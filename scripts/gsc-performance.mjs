#!/usr/bin/env node
// /gsc-google-search-console (performance) — extrai top queries + pages + oportunidades do GSC.
// Output triplo (md + csv + json) em brain/seo/data/gsc/.
//
// Uso:
//   node scripts/gsc-performance.mjs
//   node scripts/gsc-performance.mjs --days=30 --limit=200
//   node scripts/gsc-performance.mjs --dimension=query
//   node scripts/gsc-performance.mjs --no-opportunities

import { join } from "node:path";
import { argv, exit } from "node:process";
import {
  GSCError,
  loadCredentials,
  createOAuthClient,
  createSearchConsoleClient,
  callGSC,
  dateRangeDays,
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

// CTR benchmark por posição. Curva conservadora.
const CTR_BENCHMARK = {
  1: 0.28, 2: 0.15, 3: 0.11, 4: 0.08, 5: 0.06,
  6: 0.045, 7: 0.035, 8: 0.028, 9: 0.022, 10: 0.018,
};
const CTR_BENCHMARK_FALLBACK = 0.01; // pos 11-15

function benchmarkFor(pos) {
  const rounded = Math.round(pos);
  if (rounded >= 1 && rounded <= 10) return CTR_BENCHMARK[rounded];
  if (rounded >= 11 && rounded <= 15) return CTR_BENCHMARK_FALLBACK;
  return null;
}

function parseArgs() {
  const args = { days: 90, limit: 100, dimension: "both", opportunities: true };
  for (const a of argv.slice(2)) {
    if (a.startsWith("--days=")) args.days = parseInt(a.slice(7), 10);
    else if (a.startsWith("--limit=")) args.limit = parseInt(a.slice(8), 10);
    else if (a.startsWith("--dimension=")) args.dimension = a.slice(12);
    else if (a === "--no-opportunities") args.opportunities = false;
  }
  return args;
}

async function main() {
  const projectRoot = requireProjectRoot();
  const frameworkRoot = resolveFrameworkRoot() ?? projectRoot;
  loadEnvLocal(join(frameworkRoot, ".env.local"));

  const args = parseArgs();
  if (!Number.isInteger(args.days) || args.days < 1 || args.days > 480) {
    console.error("❌ --days deve ser inteiro entre 1 e 480.");
    exit(2);
  }
  if (!Number.isInteger(args.limit) || args.limit < 1 || args.limit > 25000) {
    console.error("❌ --limit deve ser inteiro entre 1 e 25000.");
    exit(2);
  }
  if (!["query", "page", "both"].includes(args.dimension)) {
    console.error("❌ --dimension deve ser query, page, ou both.");
    exit(2);
  }

  let creds;
  try {
    creds = loadCredentials();
  } catch (err) {
    console.error(err.message);
    exit(1);
  }

  const range = dateRangeDays(args.days);
  console.log(`[gsc-performance] property: ${creds.property}`);
  console.log(`[gsc-performance] range: ${range.startDate} → ${range.endDate} (${args.days} dias)`);
  console.log(`[gsc-performance] dimension: ${args.dimension}, limit: ${args.limit}`);

  const auth = createOAuthClient(creds);
  const sc = createSearchConsoleClient(auth);

  const dimensions = args.dimension === "both" ? ["query", "page"] : [args.dimension];

  const date = todayStamp();
  const outDir = join(projectRoot, "brain/seo/data/gsc");
  const logPath = join(outDir, "_log.jsonl");

  const results = await Promise.all(
    dimensions.map((dim) => fetchDimension({ sc, property: creds.property, range, dim, limit: args.limit }))
  );

  for (let i = 0; i < dimensions.length; i++) {
    const dim = dimensions[i];
    const data = results[i];
    const opportunities = args.opportunities && dim === "query" ? findOpportunities(data.rows) : [];

    const basePath = join(outDir, `performance-${date}-${dim === "query" ? "queries" : "pages"}`);
    writeOutputs(basePath, {
      md: buildMarkdown({ dim, property: creds.property, range, args, data, opportunities }),
      csv: rowsToCsv(data.rows),
      json: {
        property: creds.property,
        skill: "gsc-performance",
        dimension: dim,
        fetched_at: new Date().toISOString(),
        range: { start: range.startDate, end: range.endDate, days: args.days },
        totals: data.totals,
        rows: data.rows,
        opportunities: dim === "query" ? opportunities : undefined,
      },
    });

    appendLog(logPath, {
      skill: "gsc-performance",
      dimension: dim,
      range: `${args.days}d`,
      rows: data.rows.length,
      property: creds.property,
    });

    console.log(`[gsc-performance] ${dim}: ${data.rows.length} rows`);
  }

  printSummary({ dimensions, results, args, opportunities: args.opportunities, outDir, date });
}

async function fetchDimension({ sc, property, range, dim, limit }) {
  const res = await callGSC(() =>
    sc.searchanalytics.query({
      siteUrl: property,
      requestBody: {
        startDate: range.startDate,
        endDate: range.endDate,
        dimensions: [dim],
        rowLimit: limit,
        type: "web",
      },
    })
  );

  const raw = res.data.rows ?? [];
  const rows = raw.map((r) => ({
    [dim]: r.keys[0],
    clicks: r.clicks ?? 0,
    impressions: r.impressions ?? 0,
    ctr: r.ctr ?? 0,
    position: r.position ?? 0,
  }));
  rows.sort((a, b) => b.clicks - a.clicks);

  const totals = rows.reduce(
    (acc, r) => ({
      clicks: acc.clicks + r.clicks,
      impressions: acc.impressions + r.impressions,
    }),
    { clicks: 0, impressions: 0 }
  );

  return { rows, totals };
}

function findOpportunities(rows) {
  const opps = [];
  for (const r of rows) {
    if (r.position < 5 || r.position > 15) continue;
    if (r.impressions < 100) continue;
    const benchmark = benchmarkFor(r.position);
    if (benchmark === null) continue;
    if (r.ctr >= benchmark) continue;

    const monthlyImpressions = r.impressions / 3; // assume 90d range, normaliza pra mês
    const currentMonthlyClicks = r.ctr * monthlyImpressions;
    const targetMonthlyClicks = 0.11 * monthlyImpressions; // se subir pra pos 3
    const upside = Math.max(0, Math.round(targetMonthlyClicks - currentMonthlyClicks));

    opps.push({
      query: r.query,
      position: r.position,
      impressions: r.impressions,
      ctr: r.ctr,
      ctr_benchmark: benchmark,
      upside_monthly_clicks: upside,
    });
  }
  opps.sort((a, b) => b.upside_monthly_clicks - a.upside_monthly_clicks);
  return opps.slice(0, 25);
}

function buildMarkdown({ dim, property, range, args, data, opportunities }) {
  const label = dim === "query" ? "Queries" : "Páginas";
  const lines = [];
  lines.push(`# GSC Performance — ${label} (${todayStamp()})`);
  lines.push("");
  lines.push(`- **Property:** ${property}`);
  lines.push(`- **Período:** ${range.startDate} → ${range.endDate} (${args.days} dias)`);
  lines.push(`- **Total ${label.toLowerCase()} com dados:** ${data.rows.length.toLocaleString("pt-BR")}`);
  lines.push(`- **Total clicks:** ${data.totals.clicks.toLocaleString("pt-BR")}`);
  lines.push(`- **Total impressões:** ${data.totals.impressions.toLocaleString("pt-BR")}`);
  lines.push("");
  lines.push("> Nota: GSC esconde queries com poucos cliques (anonymized) por privacidade. Dados têm 2-3d de delay.");
  lines.push("");

  if (data.rows.length === 0) {
    lines.push("Sem dados no período.");
    return lines.join("\n") + "\n";
  }

  lines.push(`## Top ${Math.min(50, data.rows.length)} ${label.toLowerCase()} por clicks`);
  lines.push("");
  const top = data.rows.slice(0, 50).map((r, i) => ({
    "#": i + 1,
    [dim === "query" ? "Query" : "Página"]: r[dim],
    Clicks: r.clicks.toLocaleString("pt-BR"),
    Impressões: r.impressions.toLocaleString("pt-BR"),
    CTR: `${(r.ctr * 100).toFixed(2)}%`,
    Posição: r.position.toFixed(1),
  }));
  lines.push(rowsToMarkdown(top).trimEnd());
  lines.push("");

  if (dim === "query" && opportunities && opportunities.length > 0) {
    lines.push("## Oportunidades — pos 5-15 com CTR abaixo do esperado");
    lines.push("");
    lines.push("Filtros: posição entre 5 e 15, mín 100 impressões no período, CTR < benchmark.");
    lines.push("Upside estimado se mover pra pos 3 (CTR 11%).");
    lines.push("");
    const oppRows = opportunities.map((o) => ({
      Query: o.query,
      "Pos atual": o.position.toFixed(1),
      Impressões: o.impressions.toLocaleString("pt-BR"),
      "CTR atual": `${(o.ctr * 100).toFixed(2)}%`,
      "CTR esperado": `${(o.ctr_benchmark * 100).toFixed(1)}%`,
      "Upside (clicks/mês)": `+${o.upside_monthly_clicks}`,
    }));
    lines.push(rowsToMarkdown(oppRows).trimEnd());
    lines.push("");
  }

  return lines.join("\n") + "\n";
}

function printSummary({ dimensions, results, args, opportunities, outDir, date }) {
  const queryIdx = dimensions.indexOf("query");
  const pageIdx = dimensions.indexOf("page");
  const queryData = queryIdx >= 0 ? results[queryIdx] : null;
  const pageData = pageIdx >= 0 ? results[pageIdx] : null;
  const opps =
    opportunities && queryData ? findOpportunities(queryData.rows) : [];

  console.log("");
  console.log("✅ GSC performance extraído.");
  console.log("");

  if (queryData) {
    console.log(`Total queries: ${queryData.rows.length} (${queryData.totals.clicks.toLocaleString("pt-BR")} clicks)`);
  }
  if (pageData) {
    console.log(`Total páginas: ${pageData.rows.length} (${pageData.totals.clicks.toLocaleString("pt-BR")} clicks)`);
  }

  if (queryData && queryData.rows.length > 0) {
    console.log("");
    console.log("Top 3 queries:");
    queryData.rows.slice(0, 3).forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.query.padEnd(40)} ${r.clicks.toString().padStart(5)} clicks (pos ${r.position.toFixed(1)})`);
    });
  }

  if (opps.length > 0) {
    console.log("");
    console.log(`🎯 ${opps.length} oportunidades (pos 5-15, CTR baixo):`);
    opps.slice(0, 5).forEach((o) => {
      console.log(`  • ${o.query.padEnd(40)} +${o.upside_monthly_clicks} clicks/mês`);
    });
  }

  console.log("");
  console.log(`Output em: ${outDir}/performance-${date}-*.{md,csv,json}`);
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
