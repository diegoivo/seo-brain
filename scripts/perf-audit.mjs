#!/usr/bin/env node
// Perf Audit — PageSpeed Insights primeiro, fallback para Lighthouse local via npx.
// Uso: node scripts/perf-audit.mjs <url> [--strategy=mobile|desktop] [--out=<dir>]

import { spawn } from "node:child_process";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, isAbsolute } from "node:path";
import { argv, env, exit } from "node:process";
import { requireProjectRoot } from "./lib/project-root.mjs";

const PROJECT_ROOT = requireProjectRoot();
const args = parseArgs(argv.slice(2));
const url = args.url ?? (await readDomainFromBrain());
if (!url) {
  console.error("Uso: perf-audit <url> [--strategy=mobile|desktop]");
  console.error("Ou defina o domínio em brain/index.md (linha 'Domínio: ...').");
  exit(2);
}

const strategy = args.strategy ?? "mobile";
const outDir = args.out
  ? (isAbsolute(args.out) ? args.out : join(PROJECT_ROOT, args.out))
  : join(PROJECT_ROOT, "brain/seo/reports");

console.log(`\n🔍 Auditando ${url} (${strategy})...`);

let report;
let source;

try {
  report = await runPageSpeed(url, strategy);
  source = "PageSpeed Insights API";
} catch (psErr) {
  console.log(`⚠️  PageSpeed falhou: ${psErr.message}`);
  console.log("   Tentando Lighthouse local via npx (pode demorar ~30s)...");
  try {
    report = await runLighthouseLocal(url, strategy);
    source = "Lighthouse local (npx)";
  } catch (lhErr) {
    console.error(`❌ Lighthouse local também falhou: ${lhErr.message}`);
    exit(1);
  }
}

const md = renderMarkdown(url, strategy, source, report);
const slug = slugify(url);
const stamp = new Date().toISOString().split("T")[0];
const baseName = `perf-${slug}-${stamp}-${strategy}`;

await mkdir(outDir, { recursive: true });
await writeFile(join(outDir, `${baseName}.json`), JSON.stringify(report, null, 2));
await writeFile(join(outDir, `${baseName}.md`), md);

console.log(`\n✅ Reports em ${join(outDir, baseName)}.{json,md}\n`);
console.log(summary(report));

// ============================================================================

async function runPageSpeed(targetUrl, strat) {
  const apiKey = env.PAGESPEED_API_KEY;
  const params = new URLSearchParams({
    url: targetUrl,
    strategy: strat,
  });
  for (const cat of ["performance", "accessibility", "best-practices", "seo"]) {
    params.append("category", cat);
  }
  if (apiKey) params.set("key", apiKey);

  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`;
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text().then(t => t.slice(0, 200))}`);
  const data = await res.json();
  if (!data.lighthouseResult) throw new Error("Resposta inválida da API");
  return parseLighthouse(data.lighthouseResult);
}

function runLighthouseLocal(targetUrl, strat) {
  return new Promise((resolve, reject) => {
    const args = [
      "-y", "lighthouse@latest", targetUrl,
      "--output=json",
      "--quiet",
      `--preset=${strat === "desktop" ? "desktop" : ""}`.replace(/=$/, ""),
      "--chrome-flags=--headless --no-sandbox",
      "--only-categories=performance,accessibility,best-practices,seo",
    ].filter(Boolean);

    const proc = spawn("npx", args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", c => stdout += c);
    proc.stderr.on("data", c => stderr += c);
    proc.on("error", reject);
    proc.on("exit", code => {
      if (code !== 0) return reject(new Error(`exit ${code}: ${stderr.slice(0, 300)}`));
      try {
        const parsed = JSON.parse(stdout);
        resolve(parseLighthouse(parsed));
      } catch (e) {
        reject(new Error(`parse: ${e.message}`));
      }
    });
  });
}

function parseLighthouse(lh) {
  const cats = lh.categories ?? {};
  const audits = lh.audits ?? {};
  return {
    fetchedAt: lh.fetchTime ?? new Date().toISOString(),
    finalUrl: lh.finalUrl ?? lh.requestedUrl,
    scores: {
      performance: pct(cats.performance?.score),
      accessibility: pct(cats.accessibility?.score),
      bestPractices: pct(cats["best-practices"]?.score),
      seo: pct(cats.seo?.score),
    },
    metrics: {
      lcp: audits["largest-contentful-paint"]?.numericValue ?? null,
      inp: audits["interaction-to-next-paint"]?.numericValue ?? null,
      cls: audits["cumulative-layout-shift"]?.numericValue ?? null,
      ttfb: audits["server-response-time"]?.numericValue ?? null,
      fcp: audits["first-contentful-paint"]?.numericValue ?? null,
      tbt: audits["total-blocking-time"]?.numericValue ?? null,
    },
    opportunities: extractIssues(audits, "opportunity"),
    diagnostics: extractIssues(audits, "diagnostic"),
  };
}

function extractIssues(audits, kind) {
  return Object.entries(audits)
    .filter(([, a]) => a.scoreDisplayMode !== "informative" && a.score !== null && a.score < 0.9)
    .map(([id, a]) => ({
      id,
      title: a.title,
      score: a.score,
      displayValue: a.displayValue ?? null,
      description: cleanDescription(a.description),
    }))
    .sort((a, b) => (a.score ?? 1) - (b.score ?? 1))
    .slice(0, 12);
}

function cleanDescription(d) {
  if (!d) return "";
  return d.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").slice(0, 200);
}

function pct(score) {
  return score == null ? null : Math.round(score * 100);
}

function summary(report) {
  const s = report.scores;
  const fmt = (n, target) => n == null ? "—" : `${n}${n >= target ? " ✅" : " ⚠️"}`;
  return [
    `Performance: ${fmt(s.performance, 95)} (alvo 95+)`,
    `SEO: ${fmt(s.seo, 100)} (alvo 100)`,
    `Accessibility: ${fmt(s.accessibility, 95)} (alvo 95+)`,
    `Best Practices: ${fmt(s.bestPractices, 95)} (alvo 95+)`,
  ].join("\n");
}

function renderMarkdown(url, strat, source, report) {
  const s = report.scores;
  const m = report.metrics;
  const fmtMs = ms => ms == null ? "—" : `${Math.round(ms)}ms`;
  const fmtCls = c => c == null ? "—" : c.toFixed(3);
  const issues = (report.opportunities ?? []).slice(0, 8).map(i =>
    `- **${i.title}**${i.displayValue ? ` (${i.displayValue})` : ""} — ${i.description}`
  ).join("\n");
  return `# Lighthouse — ${url}

- Data: ${report.fetchedAt}
- Strategy: ${strat}
- Source: ${source}

## Scores

| Categoria | Score | Alvo |
|---|---|---|
| Performance | ${s.performance ?? "—"} | 95+ |
| SEO | ${s.seo ?? "—"} | 100 |
| Accessibility | ${s.accessibility ?? "—"} | 95+ |
| Best Practices | ${s.bestPractices ?? "—"} | 95+ |

## Métricas-chave

- LCP: ${fmtMs(m.lcp)} (alvo <2500ms)
- INP: ${fmtMs(m.inp)} (alvo <200ms)
- CLS: ${fmtCls(m.cls)} (alvo <0.1)
- TTFB: ${fmtMs(m.ttfb)} (alvo <800ms)
- FCP: ${fmtMs(m.fcp)}
- TBT: ${fmtMs(m.tbt)}

## Recomendações priorizadas

${issues || "_Nenhuma issue significativa._"}
`;
}

async function readDomainFromBrain() {
  const path = join(PROJECT_ROOT, "brain/index.md");
  if (!existsSync(path)) return null;
  const content = await readFile(path, "utf8");
  const m = content.match(/^.*Dom[ií]nio.*?:\s*[`'"]?([^`'"\s\n]+)/im);
  if (!m) return null;
  const v = m[1].trim();
  if (v === "TEMPLATE" || v.startsWith("ex.")) return null;
  return v.startsWith("http") ? v : `https://${v}`;
}

function slugify(s) {
  return s.replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase().slice(0, 60);
}

function parseArgs(arr) {
  const out = {};
  for (const a of arr) {
    if (a.startsWith("--")) {
      const [k, v] = a.slice(2).split("=");
      out[k] = v ?? true;
    } else if (!out.url) {
      out.url = a;
    }
  }
  return out;
}
