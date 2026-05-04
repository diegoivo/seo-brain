#!/usr/bin/env node
// SEO Score CLI — 10 categorias ponderadas, output JSON + Markdown.
// Nunca bloqueia. Roda contra URL pública (modo prod) ou diretório de build (modo local).
// Uso: node scripts/seo-score.mjs <url|build-path> [--mode=prod|local] [--profile=auto|home|page|post|landing] [--out=<dir>]

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, basename, isAbsolute } from "node:path";
import { argv, exit } from "node:process";
import { requireProjectRoot } from "./lib/project-root.mjs";

const PROJECT_ROOT = requireProjectRoot();

const WEIGHTS = {
  cwv: 20,
  indexability: 15,
  meta: 10,
  semantic: 10,
  schema: 10,
  internal: 8,
  images: 7,
  content: 5,
  geo: 10,
  a11y: 5,
};

// Profiles — desabilitam checks que não fazem sentido para o tipo de página.
// `geo.tldr` e `geo.faq` não fazem sentido em home/contato/sobre.
// `content.density` (length) não faz sentido em landing/contato.
const PROFILES = {
  home:    { tldr: false, faq: false, breadcrumb: false, articleSchema: false },
  page:    { tldr: false, faq: false, breadcrumb: true,  articleSchema: false },
  post:    { tldr: true,  faq: true,  breadcrumb: true,  articleSchema: true  },
  landing: { tldr: false, faq: true,  breadcrumb: true,  articleSchema: false },
};

const args = parseArgs(argv.slice(2));
if (!args.target) {
  console.error("Uso: seo-score <url|build-path> [--mode=prod|local] [--profile=auto|home|page|post|landing]");
  exit(2);
}

const mode = args.mode ?? (args.target.startsWith("http") ? "prod" : "local");
const outDir = args.out
  ? (isAbsolute(args.out) ? args.out : join(PROJECT_ROOT, args.out))
  : join(PROJECT_ROOT, "brain/seo/reports");
const profile = resolveProfile(args.profile, args.target);
const profileFlags = PROFILES[profile];

const html = await fetchTarget(args.target, mode);
const url = mode === "prod" ? args.target : `file://${args.target}`;

const results = {
  cwv: await checkCWV(args.target, mode),
  indexability: checkIndexability(html, url),
  meta: checkMeta(html),
  semantic: checkSemantic(html),
  schema: checkSchema(html, profileFlags),
  internal: checkInternalLinks(html, url),
  images: checkImages(html),
  content: checkContent(html),
  geo: checkGEO(html, url, profileFlags),
  a11y: checkA11y(html, url),
};

const score = computeScore(results);
const report = buildReport(args.target, mode, score, results);

await mkdir(outDir, { recursive: true });
const slug = slugify(args.target);
const stamp = new Date().toISOString().split("T")[0];
const baseName = `${slug}-${stamp}`;

await writeFile(join(outDir, `${baseName}.json`), JSON.stringify(report, null, 2));
await writeFile(join(outDir, `${baseName}.md`), renderMarkdown(report));

console.log(`\nScore: ${score.total}/100`);
console.log(`Reports: ${join(outDir, baseName)}.{json,md}\n`);
if (score.total < 80) {
  console.log("⚠️  Score abaixo de 80. Revise os itens críticos antes de publicar.");
  console.log("(Lembre: este script nunca bloqueia. Decisão é sua.)");
}

// ============================================================================
// fetch
// ============================================================================

async function fetchTarget(target, mode) {
  if (mode === "prod") {
    const res = await fetch(target, { headers: { "User-Agent": "AgenticSEOKit/1.0" } });
    if (!res.ok) throw new Error(`HTTP ${res.status} em ${target}`);
    return await res.text();
  }
  if (!existsSync(target)) throw new Error(`Path não existe: ${target}`);
  const indexPath = target.endsWith(".html") ? target : join(target, "index.html");
  return await readFile(indexPath, "utf8");
}

// ============================================================================
// checks
// ============================================================================

async function checkCWV(target, mode) {
  if (mode !== "prod") {
    return note("CWV só roda em modo prod (URL pública). Skip em local.", { skipped: true });
  }
  const apiKey = process.env.PAGESPEED_API_KEY;
  if (!apiKey) {
    return note("Sem PAGESPEED_API_KEY. CWV não medido.", { skipped: true });
  }
  try {
    const url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(target)}&category=performance&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    const audits = data?.lighthouseResult?.audits ?? {};
    const lcp = audits["largest-contentful-paint"]?.numericValue ?? null;
    const cls = audits["cumulative-layout-shift"]?.numericValue ?? null;
    const inp = audits["interaction-to-next-paint"]?.numericValue ?? null;
    const ttfb = audits["server-response-time"]?.numericValue ?? null;
    const checks = [
      bool("LCP < 2500ms", lcp != null && lcp < 2500, lcp),
      bool("INP < 200ms", inp != null && inp < 200, inp),
      bool("CLS < 0.1", cls != null && cls < 0.1, cls),
      bool("TTFB < 800ms", ttfb != null && ttfb < 800, ttfb),
    ];
    return summarize(checks);
  } catch (err) {
    return note(`Erro CWV: ${err.message}`, { skipped: true });
  }
}

function checkIndexability(html, url) {
  const checks = [
    bool("robots meta sem noindex", !/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html)),
    bool("canonical presente", /<link[^>]+rel=["']canonical["']/i.test(html)),
    bool("lang no <html>", /<html[^>]+lang=/i.test(html)),
    bool("charset utf-8", /<meta[^>]+charset=["']?utf-8/i.test(html)),
    bool("viewport meta", /<meta[^>]+name=["']viewport["']/i.test(html)),
  ];
  return summarize(checks);
}

function checkMeta(html) {
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() ?? "";
  const desc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] ?? "";
  const checks = [
    bool(`title 30-60 chars (${title.length})`, title.length >= 30 && title.length <= 60),
    bool(`description 120-160 chars (${desc.length})`, desc.length >= 120 && desc.length <= 160),
    bool("og:title", /<meta[^>]+property=["']og:title["']/i.test(html)),
    bool("og:description", /<meta[^>]+property=["']og:description["']/i.test(html)),
    bool("og:image", /<meta[^>]+property=["']og:image["']/i.test(html)),
    bool("twitter:card", /<meta[^>]+name=["']twitter:card["']/i.test(html)),
  ];
  return summarize(checks);
}

function checkSemantic(html) {
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  const checks = [
    bool(`exatamente 1 H1 (${h1Count})`, h1Count === 1),
    bool("usa <main>", /<main\b/i.test(html)),
    bool("usa <article> ou <section>", /<(article|section)\b/i.test(html)),
    bool("breadcrumbs ARIA ou schema", /aria-label=["']breadcrumb["']|BreadcrumbList/i.test(html)),
    bool("sem hierarquia quebrada (H1→H3)", !/<h1[^>]*>[\s\S]{0,2000}?<h3/i.test(html) || /<h2/i.test(html)),
  ];
  return summarize(checks);
}

function checkSchema(html, flags) {
  const ldjson = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  let parsed = [];
  for (const m of ldjson) {
    try {
      parsed.push(JSON.parse(m[1].trim()));
    } catch { /* ignore malformed */ }
  }
  const types = parsed.flatMap(p => Array.isArray(p) ? p.map(x => x["@type"]) : [p["@type"]]).filter(Boolean);
  const checks = [
    bool("JSON-LD presente", parsed.length > 0),
    bool("JSON-LD parseável", ldjson.length > 0 && parsed.length === ldjson.length),
    bool("Article/BlogPosting/Product/etc", types.some(t => /Article|BlogPosting|Product|Service|HowTo|FAQPage|Organization/.test(t))),
    bool("Person ou Organization (E-E-A-T)", types.some(t => /Person|Organization/.test(t))),
  ];
  if (flags?.breadcrumb) {
    checks.push(bool("BreadcrumbList schema", types.some(t => /BreadcrumbList/.test(t))));
  }
  if (flags?.articleSchema) {
    checks.push(bool("Article/BlogPosting (post)", types.some(t => /Article|BlogPosting/.test(t))));
  }
  return summarize(checks);
}

function checkInternalLinks(html, url) {
  const host = safeHost(url);
  const links = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  const internal = links.filter(([, href]) => {
    if (href.startsWith("/") && !href.startsWith("//")) return true;
    if (href.startsWith("#")) return false;
    try { return new URL(href).host === host; } catch { return false; }
  });
  const genericAnchors = internal.filter(([, , text]) => /^(clique aqui|aqui|saiba mais|leia mais)$/i.test(stripTags(text).trim()));
  const checks = [
    bool(`>= 3 links internos (${internal.length})`, internal.length >= 3),
    bool("sem 'clique aqui'/'leia mais' como anchor", genericAnchors.length === 0),
  ];
  return summarize(checks);
}

function checkImages(html) {
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]);
  const withAlt = imgs.filter(i => /\balt=["'][^"']+["']/i.test(i));
  const withDims = imgs.filter(i => /\bwidth=/i.test(i) && /\bheight=/i.test(i));
  const modern = imgs.filter(i => /\.(avif|webp)/i.test(i));
  const lazy = imgs.filter(i => /loading=["']lazy["']/i.test(i));
  const checks = [
    bool(`100% com alt (${withAlt.length}/${imgs.length})`, imgs.length === 0 || withAlt.length === imgs.length),
    bool("dimensões explícitas em ≥80%", imgs.length === 0 || withDims.length / imgs.length >= 0.8),
    bool("formato moderno em ≥50%", imgs.length === 0 || modern.length / imgs.length >= 0.5),
    bool("lazy loading abaixo da dobra", imgs.length <= 1 || lazy.length >= Math.max(1, imgs.length - 2)),
  ];
  return summarize(checks);
}

function checkContent(html) {
  const text = stripTags(html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ""));
  const words = text.split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+\s/).filter(s => s.trim().length > 0);
  const wordCount = words.length;
  const flesch = fleschPtBR(words, sentences);
  const checks = [
    bool(`>= 600 palavras (${wordCount})`, wordCount >= 600),
    bool(`Flesch PT-BR >= 50 (${flesch.toFixed(1)}) — Martins/Ghiraldelo`, flesch >= 50),
  ];
  return summarize(checks);
}

function checkGEO(html, url, flags) {
  const host = safeHost(url);
  const checks = [
    bool("Person schema (autoria/E-E-A-T)", /"@type"\s*:\s*"Person"/.test(html)),
    bool("citações com data ou fonte", /(fonte:|segundo|de acordo com)/i.test(html)),
    bool("perguntas em headings (H2/H3)", /<h[23][^>]*>[^<]*\?/i.test(html)),
    note(host ? `Validar manualmente https://${host}/llms.txt` : "llms.txt: skip (sem host)", { info: true }),
  ];
  if (flags?.faq) {
    checks.push(bool("FAQPage schema", /FAQPage/.test(html)));
  }
  if (flags?.tldr) {
    checks.push(bool("TL;DR ou bloco resumo", /tl;?dr|resumo r[áa]pido|em resumo/i.test(html)));
  }
  return summarize(checks.filter(c => c.value !== undefined));
}

function checkA11y(html, url) {
  const checks = [
    bool("HTTPS", url.startsWith("https://") || url.startsWith("file://")),
    bool("skip-to-content link", /skip[-_ ]to[-_ ]content|pular para o conteúdo/i.test(html)),
    bool("form labels ou aria-label em inputs", !/<input\b/i.test(html) || /<label\b|aria-label=/i.test(html)),
    bool("imagens decorativas com alt=\"\"", true), // verificação heurística
  ];
  return summarize(checks);
}

// ============================================================================
// helpers
// ============================================================================

function bool(label, ok, value) {
  return { label, value: ok, raw: value };
}

function note(label, meta) {
  return { label, ...meta };
}

function summarize(checks) {
  const real = checks.filter(c => typeof c.value === "boolean");
  const passed = real.filter(c => c.value).length;
  const total = real.length;
  const pct = total === 0 ? 0 : passed / total;
  return { passed, total, pct, checks };
}

function computeScore(results) {
  let total = 0;
  const breakdown = {};
  for (const [key, weight] of Object.entries(WEIGHTS)) {
    const r = results[key];
    if (r.skipped) {
      breakdown[key] = { weight, score: weight, note: "skipped (não conta)" };
      total += weight;
      continue;
    }
    const earned = Math.round(weight * r.pct);
    breakdown[key] = { weight, score: earned, passed: r.passed, total: r.total };
    total += earned;
  }
  return { total: Math.min(100, total), breakdown };
}

function buildReport(target, mode, score, results) {
  return {
    target,
    mode,
    profile,
    timestamp: new Date().toISOString(),
    score: score.total,
    breakdown: score.breakdown,
    details: results,
  };
}

function resolveProfile(explicit, target) {
  if (explicit && explicit !== "auto" && PROFILES[explicit]) return explicit;
  // Auto-detect via path/URL.
  const path = target.replace(/^https?:\/\/[^/]+/, "").replace(/^file:\/\//, "");
  if (/\/blog\//.test(path) || /\/posts?\//.test(path)) return "post";
  if (/\/(servicos?|produtos?|services?|products?|landing)\//.test(path)) return "landing";
  if (/\/(contato|sobre|about|contact|equipe|team|legal|privacidade|terms)/.test(path)) return "page";
  if (path === "" || path === "/" || /\/index\.html?$/.test(path) || path.endsWith("/")) return "home";
  return "page";
}

function renderMarkdown(report) {
  const rows = Object.entries(report.breakdown).map(([k, v]) =>
    `| ${k} | ${v.score}/${v.weight} | ${v.passed ?? "-"}/${v.total ?? "-"} | ${v.note ?? ""} |`
  ).join("\n");
  const failed = [];
  for (const [cat, r] of Object.entries(report.details)) {
    if (!r.checks) continue;
    for (const c of r.checks) {
      if (c.value === false) failed.push(`- **${cat}** — ${c.label}`);
    }
  }
  return `# SEO Score — ${report.target}

- **Score:** ${report.score}/100
- **Profile:** ${report.profile}
- **Modo:** ${report.mode}
- **Data:** ${report.timestamp}

## Breakdown

| Categoria | Score | Checks | Observação |
|---|---|---|---|
${rows}

## Itens reprovados

${failed.length ? failed.join("\n") : "Nenhum check reprovado. 🎯"}

## Próximos passos

Priorize os itens reprovados em CWV, Indexabilidade e Schema (alto peso).
`;
}

// Flesch adaptado PT-BR (Martins/Ghiraldelo, 1996):
// 248.835 − (1.015 × ASL) − (84.6 × ASW)
function fleschPtBR(words, sentences) {
  if (words.length === 0 || sentences.length === 0) return 0;
  const asl = words.length / sentences.length;
  const asw = words.reduce((sum, w) => sum + countSyllablesPt(w), 0) / words.length;
  return 248.835 - 1.015 * asl - 84.6 * asw;
}

function countSyllablesPt(word) {
  // heurística: contagem de grupos vocálicos (incluindo ditongos comuns).
  const w = word.toLowerCase().replace(/[^a-záâãàéêíóôõúüç]/g, "");
  if (!w) return 0;
  const groups = w.match(/[aeiouáâãàéêíóôõúü]+/g);
  return groups ? groups.length : 1;
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function safeHost(url) {
  try { return new URL(url).host; } catch { return ""; }
}

function slugify(s) {
  return s.replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase().slice(0, 80);
}

function parseArgs(arr) {
  const out = {};
  for (const a of arr) {
    if (a.startsWith("--")) {
      const [k, v] = a.slice(2).split("=");
      out[k] = v ?? true;
    } else if (!out.target) {
      out.target = a;
    }
  }
  return out;
}
