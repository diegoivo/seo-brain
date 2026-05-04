#!/usr/bin/env node
// /gsc-google-search-console (coverage) — lista sitemaps + status de cada um (warnings, errors,
// indexação). Output triplo em brain/seo/data/gsc/coverage-<date>.{md,csv,json}.
//
// Uso:
//   node scripts/gsc-coverage.mjs

import { join } from "node:path";
import { exit } from "node:process";
import {
  GSCError,
  loadCredentials,
  createOAuthClient,
  createSearchConsoleClient,
  callGSC,
} from "./gsc-client.mjs";
import {
  writeOutputs,
  rowsToCsv,
  rowsToMarkdown,
  todayStamp,
  appendLog,
} from "./lib/gsc-output.mjs";
import { requireProjectRoot, resolveFrameworkRoot } from "./lib/project-root.mjs";
import { loadEnvLocal } from "./lib/env-local.mjs";

async function main() {
  const projectRoot = requireProjectRoot();
  const frameworkRoot = resolveFrameworkRoot() ?? projectRoot;
  loadEnvLocal(join(frameworkRoot, ".env.local"));

  let creds;
  try {
    creds = loadCredentials();
  } catch (err) {
    console.error(err.message);
    exit(1);
  }

  console.log(`[gsc-coverage] property: ${creds.property}`);

  const auth = createOAuthClient(creds);
  const sc = createSearchConsoleClient(auth);

  const list = await callGSC(() => sc.sitemaps.list({ siteUrl: creds.property }));
  const sitemaps = list.data.sitemap ?? [];

  if (sitemaps.length === 0) {
    console.log("");
    console.log("⚠️  Nenhum sitemap submetido pra essa property.");
    console.log("");
    console.log("   Submeta em https://search.google.com/search-console/sitemaps");
    console.log("   Selecione a property e cole a URL do seu sitemap (ex: /sitemap.xml).");
    console.log("");
    // Ainda assim escreve output vazio pra audit trail.
    writeEmpty(projectRoot, creds.property);
    exit(0);
  }

  // Para sitemap-index, busca detalhes dos children.
  const expanded = [];
  for (const sm of sitemaps) {
    expanded.push(normalize(sm));
    if (sm.isSitemapsIndex) {
      try {
        const detail = await callGSC(() => sc.sitemaps.get({ siteUrl: creds.property, feedpath: sm.path }));
        // sitemaps.get retorna o mesmo shape — não traz lista de children diretamente.
        // Documentação: API não expõe children de um sitemap-index. Só listagem
        // top-level via sitemaps.list. Então não há expansão extra a fazer.
      } catch {
        // ignora se falhar — mantém o registro top-level
      }
    }
  }

  const totals = expanded.reduce(
    (acc, s) => ({
      sitemaps: acc.sitemaps + 1,
      submitted: acc.submitted + (s.urls_submitted ?? 0),
      indexed: acc.indexed + (s.urls_indexed ?? 0),
      errors: acc.errors + (s.errors ?? 0),
      warnings: acc.warnings + (s.warnings ?? 0),
    }),
    { sitemaps: 0, submitted: 0, indexed: 0, errors: 0, warnings: 0 }
  );

  const date = todayStamp();
  const outDir = join(projectRoot, "brain/seo/data/gsc");
  const basePath = join(outDir, `coverage-${date}`);
  const logPath = join(outDir, "_log.jsonl");

  writeOutputs(basePath, {
    md: buildMarkdown({ property: creds.property, sitemaps: expanded, totals }),
    csv: rowsToCsv(expanded.map(toCsvRow)),
    json: {
      property: creds.property,
      skill: "gsc-coverage",
      fetched_at: new Date().toISOString(),
      totals,
      sitemaps: expanded,
    },
  });

  appendLog(logPath, {
    skill: "gsc-coverage",
    sitemaps: totals.sitemaps,
    submitted: totals.submitted,
    indexed: totals.indexed,
    errors: totals.errors,
    property: creds.property,
  });

  printSummary({ property: creds.property, sitemaps: expanded, totals, outDir, date });
}

function normalize(sm) {
  // Acumula contents (geralmente só "web", mas pode ter "image", "video", etc).
  let submitted = 0;
  let indexed = 0;
  for (const c of sm.contents ?? []) {
    submitted += parseInt(c.submitted ?? "0", 10);
    indexed += parseInt(c.indexed ?? "0", 10);
  }
  return {
    path: sm.path,
    type: sm.type ?? "sitemap",
    is_index: sm.isSitemapsIndex === true,
    is_pending: sm.isPending === true,
    last_submitted: sm.lastSubmitted ?? null,
    last_downloaded: sm.lastDownloaded ?? null,
    warnings: parseInt(sm.warnings ?? "0", 10),
    errors: parseInt(sm.errors ?? "0", 10),
    urls_submitted: submitted,
    urls_indexed: indexed,
    contents: sm.contents ?? [],
  };
}

function toCsvRow(s) {
  return {
    path: s.path,
    type: s.type,
    is_index: s.is_index,
    last_submitted: s.last_submitted ?? "",
    last_downloaded: s.last_downloaded ?? "",
    urls_submitted: s.urls_submitted,
    urls_indexed: s.urls_indexed,
    warnings: s.warnings,
    errors: s.errors,
  };
}

function buildMarkdown({ property, sitemaps, totals }) {
  const lines = [];
  lines.push(`# GSC Coverage — Sitemaps (${todayStamp()})`);
  lines.push("");
  lines.push(`- **Property:** ${property}`);
  lines.push(`- **Total sitemaps:** ${totals.sitemaps}`);
  lines.push("");
  lines.push("## Sitemaps submetidos");
  lines.push("");

  const tableRows = sitemaps.map((s) => ({
    Path: s.path.replace(property, "/").replace("//", "/"),
    Tipo: s.is_index ? "index" : s.type,
    Submetido: shortDate(s.last_submitted),
    "Última leitura": shortDate(s.last_downloaded),
    URLs: s.urls_submitted,
    Indexadas: s.urls_indexed,
    Warnings: s.warnings,
    Errors: s.errors,
  }));
  lines.push(rowsToMarkdown(tableRows).trimEnd());
  lines.push("");

  const indexationRate = totals.submitted > 0 ? ((totals.indexed / totals.submitted) * 100).toFixed(1) : "0";

  lines.push("## Resumo");
  lines.push("");
  lines.push(`- **Total URLs submetidas:** ${totals.submitted.toLocaleString("pt-BR")}`);
  lines.push(`- **Total indexadas:** ${totals.indexed.toLocaleString("pt-BR")} (${indexationRate}%)`);
  lines.push(`- **Não indexadas:** ${(totals.submitted - totals.indexed).toLocaleString("pt-BR")}`);
  lines.push(`- **Sitemaps com errors:** ${sitemaps.filter((s) => s.errors > 0).length}`);
  lines.push(`- **Sitemaps com warnings:** ${sitemaps.filter((s) => s.warnings > 0).length}`);
  lines.push(`- **Sitemaps nunca lidos:** ${sitemaps.filter((s) => !s.last_downloaded).length}`);
  lines.push("");

  const withErrors = sitemaps.filter((s) => s.errors > 0);
  if (withErrors.length > 0) {
    lines.push("## ⚠️ Sitemaps com errors");
    lines.push("");
    for (const s of withErrors) {
      lines.push(`- **${s.path}** — ${s.errors} error(s). Revise no GSC.`);
    }
    lines.push("");
  }

  const ratio = totals.submitted > 0 ? totals.indexed / totals.submitted : 1;
  if (ratio < 0.9 && totals.submitted > 0) {
    lines.push("## 🚨 Indexação baixa");
    lines.push("");
    lines.push(`Taxa de indexação ${indexationRate}% está abaixo de 90%. Possíveis causas:`);
    lines.push("- URLs com `noindex`");
    lines.push("- Conteúdo duplicado / canonical apontando pra outra URL");
    lines.push("- Páginas órfãs (sem links internos)");
    lines.push("- Bloqueio em robots.txt");
    lines.push("");
    lines.push("Verifique relatório 'Pages' em https://search.google.com/search-console/inspect");
    lines.push("");
  }

  return lines.join("\n") + "\n";
}

function shortDate(iso) {
  if (!iso) return "(nunca)";
  return iso.slice(0, 10);
}

function writeEmpty(projectRoot, property) {
  const date = todayStamp();
  const basePath = join(projectRoot, `brain/seo/data/gsc/coverage-${date}`);
  writeOutputs(basePath, {
    md: `# GSC Coverage — Sitemaps (${date})\n\n- **Property:** ${property}\n- **Total sitemaps:** 0\n\nNenhum sitemap submetido. Submeta em https://search.google.com/search-console/sitemaps\n`,
    csv: "",
    json: {
      property,
      skill: "gsc-coverage",
      fetched_at: new Date().toISOString(),
      totals: { sitemaps: 0, submitted: 0, indexed: 0, errors: 0, warnings: 0 },
      sitemaps: [],
    },
  });
}

function printSummary({ property, sitemaps, totals, outDir, date }) {
  console.log("");
  console.log("✅ GSC coverage extraído.");
  console.log("");
  console.log(`Property: ${property}`);
  console.log(`Sitemaps: ${totals.sitemaps}`);
  console.log("");

  const indexationRate = totals.submitted > 0 ? ((totals.indexed / totals.submitted) * 100).toFixed(1) : "0";
  console.log(`URLs submetidas: ${totals.submitted.toLocaleString("pt-BR")}`);
  console.log(`URLs indexadas:  ${totals.indexed.toLocaleString("pt-BR")} (${indexationRate}%)`);

  const withErrors = sitemaps.filter((s) => s.errors > 0);
  if (withErrors.length > 0) {
    console.log("");
    console.log(`⚠️  ${withErrors.length} sitemap(s) com errors:`);
    for (const s of withErrors) {
      console.log(`    • ${s.path}  →  ${s.errors} error(s)`);
    }
    console.log("    Revise em https://search.google.com/search-console/sitemaps");
  }

  console.log("");
  console.log(`Output em: ${outDir}/coverage-${date}.{md,csv,json}`);
  console.log("");
}

main().catch((err) => {
  console.error("");
  if (err instanceof GSCError) {
    console.error(err.message);
  } else {
    console.error(`❌ Erro: ${err.message}`);
    if (process.env.DEBUG) console.error(err.stack);
  }
  exit(1);
});
