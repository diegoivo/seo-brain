#!/usr/bin/env node
// /rank-tracker — monitora posições orgânicas no Google ao longo do tempo.
// Modo batch async (DataForSEO Standard Normal): depth=200 (máximo desde Set/2025),
// pricing por página de 10 resultados.
//
// Sub-comandos:
//   add "kw1, kw2"        → adiciona à lista (não chama API)
//   remove "kw1"          → remove da lista (não chama API)
//   list                  → mostra estado + última posição conhecida
//   update [--no-confirm] → puxa SERP, salva snapshot, gera report com diff
//   history "kw1"         → série temporal de uma keyword
//   --help                → mostra este texto
//
// Storage:
//   brain/seo/data/rank-tracker/keywords.json
//   brain/seo/data/rank-tracker/history/<YYYY-MM-DD>.json
//   brain/seo/data/rank-tracker/reports/<YYYY-MM-DD>.{md,csv,json}

import { readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import {
  taskPost,
  pollAndCollectTasks,
  liveAdvanced,
  loadCredentials,
  defaultLocale,
  printCostPreview,
  pLimit,
  rowsToCsv,
  todayStamp,
  ensureDir,
  DataForSEOError,
} from "./dataforseo-client.mjs";
import { requireProjectRoot } from "./lib/project-root.mjs";
import {
  openDb,
  upsertSnapshotBatch,
  getSnapshot,
  getPreviousSnapshot,
  getKeywordHistory,
  getLatestPositionByKeyword,
  listSnapshotDates,
} from "./lib/rank-tracker-db.mjs";

const ROOT = requireProjectRoot();
const DATA_DIR = join(ROOT, "brain", "seo", "data", "rank-tracker");
const KEYWORDS_FILE = join(DATA_DIR, "keywords.json");
const DB_FILE = join(DATA_DIR, "history.db");
const REPORTS_DIR = join(DATA_DIR, "reports");
const PENDING_FILE = join(DATA_DIR, ".pending.json");
const SE_PATH = "serp/google/organic";
const DEPTH = 200;
const BATCH_SIZE = 100;
const POLL_INTERVAL_MS = 10_000;
const POLL_TIMEOUT_MS = 15 * 60 * 1000; // Standard Normal queue pode demorar — 15min default

// ---------- env loader (mesmo padrão de image-search.mjs) ----------
function loadEnv() {
  const envPath = join(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  const txt = readFileSync(envPath, "utf8");
  for (const line of txt.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

// ---------- helpers ----------
function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, data) {
  ensureDir(path);
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function normalizeDomain(input) {
  if (!input) return null;
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "");
}

function domainMatches(targetDomain, urlDomain, { strict = false } = {}) {
  if (!urlDomain) return false;
  const t = normalizeDomain(targetDomain);
  const u = normalizeDomain(urlDomain);
  if (t === u) return true;
  if (strict) return false;
  return u.endsWith("." + t); // subdomínio
}

function readTargetFromBrainConfig() {
  const path = join(ROOT, "brain", "config.md");
  if (!existsSync(path)) return null;
  const txt = readFileSync(path, "utf8");
  const def = txt.match(/\*\*Definitivo:\*\*\s*([^\n]+)/);
  if (def && !/TEMPLATE|ex\.:/i.test(def[1])) {
    const d = normalizeDomain(def[1].split(" ")[0]);
    if (d) return d;
  }
  const tmp = txt.match(/\*\*Temporário[^*]*\*\*\s*([^\n]+)/);
  if (tmp && !/TEMPLATE|ex\.:/i.test(tmp[1])) {
    const d = normalizeDomain(tmp[1].split(" ")[0]);
    if (d) return d;
  }
  return null;
}

function loadKeywordsFile() {
  return readJson(KEYWORDS_FILE, null);
}

function saveKeywordsFile(data) {
  writeJson(KEYWORDS_FILE, data);
}

function ensureKeywordsFile() {
  let data = loadKeywordsFile();
  if (!data) {
    data = {
      version: 1,
      target_domain: readTargetFromBrainConfig(),
      locale: defaultLocale(),
      keywords: [],
    };
    saveKeywordsFile(data);
  }
  return data;
}

async function confirm(prompt) {
  const rl = createInterface({ input: stdin, output: stdout });
  const answer = await rl.question(prompt);
  rl.close();
  return /^s(im)?$|^y(es)?$/i.test(answer.trim());
}

function parseKeywordList(input) {
  return String(input)
    .split(/[,\n;]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function parseArgs(argv) {
  const out = { _: [], flags: {} };
  for (const a of argv) {
    if (a.startsWith("--")) {
      const [k, v] = a.slice(2).split("=");
      out.flags[k] = v === undefined ? true : v;
    } else {
      out._.push(a);
    }
  }
  return out;
}

// ---------- sub-comandos ----------

function cmdAdd(input) {
  const data = ensureKeywordsFile();
  const incoming = parseKeywordList(input);
  if (!incoming.length) {
    console.error("Nenhuma keyword fornecida. Uso: rank-tracker add \"kw1, kw2\"");
    process.exit(1);
  }
  const existingLower = new Set(data.keywords.map(k => k.keyword.toLowerCase()));
  const added = [];
  for (const kw of incoming) {
    if (existingLower.has(kw.toLowerCase())) continue;
    data.keywords.push({ keyword: kw, added_at: todayStamp() });
    added.push(kw);
    existingLower.add(kw.toLowerCase());
  }
  saveKeywordsFile(data);
  console.log(`✅ ${added.length} keyword(s) adicionada(s). Total monitorado: ${data.keywords.length}.`);
  if (added.length) console.log(`   ${added.join(", ")}`);
  if (!data.target_domain) {
    console.log(`\n⚠️  target_domain não configurado. Defina em brain/config.md (Domínio Definitivo) ou use --domain= em update.`);
  }
}

function cmdRemove(input) {
  const data = loadKeywordsFile();
  if (!data) {
    console.error("Nenhuma keyword cadastrada ainda.");
    process.exit(1);
  }
  const targets = parseKeywordList(input).map(s => s.toLowerCase());
  const before = data.keywords.length;
  data.keywords = data.keywords.filter(k => !targets.includes(k.keyword.toLowerCase()));
  saveKeywordsFile(data);
  console.log(`🗑  ${before - data.keywords.length} keyword(s) removida(s). Total: ${data.keywords.length}.`);
}

function cmdList() {
  const data = loadKeywordsFile();
  if (!data || !data.keywords.length) {
    console.log("Nenhuma keyword monitorada. Use: rank-tracker add \"sua keyword\"");
    return;
  }
  const db = openDb(DB_FILE);
  const dates = listSnapshotDates(db);
  const last = dates.length ? getSnapshot(db, dates[dates.length - 1]) : null;
  const prev = dates.length > 1 ? getSnapshot(db, dates[dates.length - 2]) : null;
  db.close();

  console.log(`\nTarget: ${data.target_domain ?? "(não configurado)"}`);
  console.log(`Locale: ${data.locale.location_code} / ${data.locale.language_code}`);
  console.log(`Snapshots: ${dates.length}${last ? ` (último: ${last.date})` : ""}\n`);

  const lastByKw = new Map((last?.results ?? []).map(r => [r.keyword.toLowerCase(), r]));
  const prevByKw = new Map((prev?.results ?? []).map(r => [r.keyword.toLowerCase(), r]));

  console.log("Keyword".padEnd(40), "Pos".padStart(5), "Δ".padStart(5), "URL");
  console.log("─".repeat(80));
  for (const k of data.keywords) {
    const lastR = lastByKw.get(k.keyword.toLowerCase());
    const prevR = prevByKw.get(k.keyword.toLowerCase());
    const pos = lastR?.position ?? null;
    const prevPos = prevR?.position ?? null;
    const delta = pos != null && prevPos != null ? prevPos - pos : null;
    const posStr = pos == null ? "—" : String(pos);
    const deltaStr = delta == null ? "—" : delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : "0";
    const url = lastR?.url ? lastR.url.slice(0, 40) : "";
    console.log(k.keyword.slice(0, 40).padEnd(40), posStr.padStart(5), deltaStr.padStart(5), url);
  }
  console.log("");
}

function cmdHistory(input) {
  const targetKw = String(input).trim();
  if (!targetKw) {
    console.error("Uso: rank-tracker history \"sua keyword\"");
    process.exit(1);
  }
  if (!existsSync(DB_FILE)) {
    console.log("Sem histórico ainda. Rode: rank-tracker update");
    return;
  }
  const db = openDb(DB_FILE);
  const rows = getKeywordHistory(db, targetKw);
  db.close();
  if (!rows.length) {
    console.log(`\nSem histórico para "${targetKw}".`);
    return;
  }
  console.log(`\nSérie temporal: "${targetKw}"\n`);
  console.log("Data".padEnd(12), "Pos".padStart(5), "URL");
  console.log("─".repeat(80));
  for (const r of rows) {
    const pos = r.position ?? null;
    const url = r.url ? r.url.slice(0, 60) : "";
    console.log(r.date.padEnd(12), (pos == null ? "—" : String(pos)).padStart(5), url);
  }
  console.log("");
}

async function cmdUpdate(flags) {
  loadEnv();
  const data = loadKeywordsFile();
  if (!data || !data.keywords.length) {
    console.error("Nenhuma keyword monitorada. Use: rank-tracker add \"sua keyword\"");
    process.exit(1);
  }

  // Resolve target domain (override → config persistido → brain/config.md)
  const targetDomain = normalizeDomain(
    flags.domain ?? data.target_domain ?? readTargetFromBrainConfig(),
  );
  if (!targetDomain) {
    console.error([
      "❌ target_domain não configurado.",
      "",
      "   Opções:",
      "     • Configure em brain/config.md (campo Domínio Definitivo)",
      "     • OU use a flag: rank-tracker update --domain=exemplo.com.br",
      "",
    ].join("\n"));
    process.exit(1);
  }

  // Persiste target se veio por flag e ainda não estava salvo
  if (!data.target_domain && targetDomain) {
    data.target_domain = targetDomain;
    saveKeywordsFile(data);
  }

  loadCredentials(); // valida cedo

  // ---- caminho LIVE (síncrono, ~3x mais caro, instantâneo) ----
  if (flags.live) {
    return cmdUpdateLive(data, targetDomain, flags);
  }

  // ---- caminho BATCH ASYNC (default — mais barato, polling) ----
  // recovery: se .pending.json existe e --resume passado, retoma sem re-submeter
  let allTaskInfos; // {id, keyword}
  let totalCost;
  const pending = existsSync(PENDING_FILE) ? JSON.parse(readFileSync(PENDING_FILE, "utf8")) : null;

  if (pending && flags.resume) {
    allTaskInfos = pending.tasks;
    totalCost = pending.cost ?? 0;
    console.log(`\n[rank-tracker] retomando ${allTaskInfos.length} tasks pendentes de ${pending.submitted_at}`);
    console.log(`[rank-tracker] custo já gasto: $${totalCost.toFixed(4)}`);
  } else {
    if (pending && !flags.resume) {
      console.error([
        `\n⚠️  Há ${pending.tasks.length} tasks pendentes de ${pending.submitted_at}.`,
        `   Submetidas mas ainda não coletadas (custo já cobrado: $${(pending.cost ?? 0).toFixed(4)}).`,
        `   Para retomar:    rank-tracker update --resume`,
        `   Para descartar:  rm ${PENDING_FILE}`,
        ``,
      ].join("\n"));
      process.exit(1);
    }

    // Cost preview + confirmação (caminho normal)
    const keywords = data.keywords.map(k => k.keyword);
    console.log(`\n[rank-tracker] target: ${targetDomain}`);
    console.log(`[rank-tracker] locale: ${data.locale.location_code} / ${data.locale.language_code}`);
    console.log(`[rank-tracker] depth: ${DEPTH} (máx DataForSEO desde Set/2025)`);
    // priority 2 (high) é default — latência típica 1-3min, custo 2x normal mas 40% mais barato que Live
    const priority = flags.priority === "normal" ? 1 : 2;
    console.log(`[rank-tracker] priority: ${priority === 2 ? "high (1-3min típicos)" : "normal (5-10min típicos)"}`);
    printCostPreview("serp-batch", keywords.length, keywords, { depth: DEPTH, priority });

    if (!flags["no-confirm"]) {
      const ok = await confirm("Continuar? [s/N] ");
      if (!ok) {
        console.log("Cancelado.");
        return;
      }
    }

    // Submete em batches de 100
    const batches = [];
    for (let i = 0; i < keywords.length; i += BATCH_SIZE) {
      batches.push(keywords.slice(i, i + BATCH_SIZE));
    }

    allTaskInfos = [];
    totalCost = 0;
    for (const [idx, batch] of batches.entries()) {
      const tasks = batch.map(kw => ({
        keyword: kw,
        location_code: data.locale.location_code,
        language_code: data.locale.language_code,
        depth: DEPTH,
        device: "desktop",
        os: "macos",
        priority,
      }));
      console.log(`[rank-tracker] submetendo batch ${idx + 1}/${batches.length} (${batch.length} tasks)`);
      const posted = await taskPost(SE_PATH, tasks);
      posted.forEach((p, i) => {
        if (p.statusCode >= 40000) {
          console.warn(`  ⚠️  task falhou: "${batch[i]}" → ${p.statusMessage}`);
        } else {
          allTaskInfos.push({ id: p.id, keyword: batch[i] });
          totalCost += p.cost ?? 0;
        }
      });
    }
    if (!allTaskInfos.length) {
      console.error("Todas as tasks falharam. Abortando.");
      process.exit(1);
    }
    console.log(`[rank-tracker] ${allTaskInfos.length} tasks na fila, custo real: $${totalCost.toFixed(4)}`);

    // **Persiste IDs ANTES de poll** — se travar, dá pra retomar com --resume
    ensureDir(PENDING_FILE);
    writeFileSync(PENDING_FILE, JSON.stringify({
      submitted_at: new Date().toISOString(),
      target_domain: targetDomain,
      locale: data.locale,
      depth: DEPTH,
      cost: totalCost,
      tasks: allTaskInfos,
    }, null, 2), "utf8");
  }

  // Poll direto via task_get/{id} (responsivo, evita delay do tasks_ready)
  console.log(`[rank-tracker] aguardando processamento (poll a cada ${POLL_INTERVAL_MS / 1000}s, timeout ${POLL_TIMEOUT_MS / 60000}min)...`);
  let collected;
  try {
    collected = await pollAndCollectTasks(SE_PATH, allTaskInfos, {
      intervalMs: POLL_INTERVAL_MS,
      timeoutMs: POLL_TIMEOUT_MS,
    });
  } catch (err) {
    if (err instanceof DataForSEOError && /timeout/i.test(err.message)) {
      console.error([
        `\n⚠️  ${err.message}`,
        `   Tasks salvas em ${PENDING_FILE}. Custo já gasto: $${totalCost.toFixed(4)}.`,
        `   Retome em alguns minutos:  rank-tracker update --resume`,
        `   (DataForSEO mantém results disponíveis por 3 dias após processamento)`,
        ``,
      ].join("\n"));
      process.exit(2);
    }
    throw err;
  }

  // Resultados já vêm dentro do collected (taskData) — não precisa fetch extra
  const results = allTaskInfos.map(info => {
    const entry = collected.get(info.id);
    if (!entry) {
      return { keyword: info.keyword, position: null, url: null, title: null, error: "task não retornou" };
    }
    if (entry.error) {
      return { keyword: info.keyword, position: null, url: null, title: null, error: entry.error };
    }
    return parseLiveOrTaskResult(entry.taskData, info.keyword, targetDomain, flags);
  });

  // Snapshot — persiste em SQLite (idempotente por (date, keyword))
  const date = todayStamp();
  const fetchedAt = new Date().toISOString();
  const costUsd = Number(totalCost.toFixed(4));
  const db = openDb(DB_FILE);
  const prevSnap = getPreviousSnapshot(db, date);
  const rows = results.map(r => ({
    date,
    keyword: r.keyword,
    position: r.position,
    url: r.url,
    title: r.title,
    in_top_100: r.in_top_100 ?? null,
    results_count: r.results_count ?? null,
    error: r.error ?? null,
    fetched_at: fetchedAt,
    target_domain: targetDomain,
    depth: DEPTH,
    cost_usd: costUsd,
  }));
  upsertSnapshotBatch(db, rows);
  const snapshot = getSnapshot(db, date);
  // anexa metadata pros reports (não fica na tabela — vem do contexto da call)
  snapshot.fetched_at = fetchedAt;
  snapshot.target_domain = targetDomain;
  snapshot.locale = data.locale;
  snapshot.depth = DEPTH;
  snapshot.cost_usd = costUsd;
  db.close();
  console.log(`[rank-tracker] snapshot persistido em ${DB_FILE} (date=${date}, ${rows.length} rows)`);

  // Sucesso completo — limpa pending file
  if (existsSync(PENDING_FILE)) {
    rmSync(PENDING_FILE);
  }

  const diff = computeDiff(prevSnap, snapshot);

  // Triple report output
  writeReports(date, snapshot, prevSnap, diff);

  // Sumário no terminal
  printSummary(snapshot, prevSnap, diff);
}

// Parser compartilhado: extrai a posição do target_domain no payload result.items
function parseLiveOrTaskResult(taskResult, keyword, targetDomain, flags) {
  const items = taskResult?.result?.[0]?.items ?? [];
  const organic = items.filter(it => it.type === "organic");
  const match = organic.find(it => domainMatches(targetDomain, it.domain, { strict: !!flags["strict-subdomain"] }));
  return {
    keyword,
    position: match?.rank_absolute ?? null,
    url: match?.url ?? null,
    title: match?.title ?? null,
    in_top_100: match?.rank_absolute != null && match.rank_absolute <= 100,
    results_count: organic.length,
  };
}

async function cmdUpdateLive(data, targetDomain, flags) {
  const keywords = data.keywords.map(k => k.keyword);
  console.log(`\n[rank-tracker] modo: LIVE (síncrono, ~3x mais caro que batch async)`);
  console.log(`[rank-tracker] target: ${targetDomain}`);
  console.log(`[rank-tracker] locale: ${data.locale.location_code} / ${data.locale.language_code}`);
  console.log(`[rank-tracker] depth: ${DEPTH}`);
  printCostPreview("serp-live", keywords.length, keywords, { depth: DEPTH });

  if (!flags["no-confirm"]) {
    const ok = await confirm("Continuar? [s/N] ");
    if (!ok) {
      console.log("Cancelado.");
      return;
    }
  }

  let totalCost = 0;
  console.log(`[rank-tracker] processando ${keywords.length} keywords em paralelo (concorrência 5)...`);
  const results = await pLimit(5, keywords, async kw => {
    try {
      const taskResult = await liveAdvanced("serp/google/organic", {
        keyword: kw,
        location_code: data.locale.location_code,
        language_code: data.locale.language_code,
        depth: DEPTH,
        device: "desktop",
        os: "macos",
      }, { verbose: false });
      if (!taskResult || taskResult.status_code >= 40000) {
        return { keyword: kw, position: null, url: null, title: null, error: taskResult?.status_message ?? "task null" };
      }
      totalCost += taskResult.cost ?? 0;
      return parseLiveOrTaskResult(taskResult, kw, targetDomain, flags);
    } catch (err) {
      return { keyword: kw, position: null, url: null, title: null, error: err.message };
    }
  });

  // Persiste snapshot (mesma lógica do caminho async)
  const date = todayStamp();
  const fetchedAt = new Date().toISOString();
  const costUsd = Number(totalCost.toFixed(4));
  const db = openDb(DB_FILE);
  const prevSnap = getPreviousSnapshot(db, date);
  const rows = results.map(r => ({
    date, keyword: r.keyword,
    position: r.position, url: r.url, title: r.title,
    in_top_100: r.in_top_100 ?? null, results_count: r.results_count ?? null, error: r.error ?? null,
    fetched_at: fetchedAt, target_domain: targetDomain, depth: DEPTH, cost_usd: costUsd,
  }));
  upsertSnapshotBatch(db, rows);
  const snapshot = getSnapshot(db, date);
  snapshot.fetched_at = fetchedAt;
  snapshot.target_domain = targetDomain;
  snapshot.locale = data.locale;
  snapshot.depth = DEPTH;
  snapshot.cost_usd = costUsd;
  db.close();
  console.log(`[rank-tracker] snapshot persistido em ${DB_FILE} (date=${date}, ${rows.length} rows, custo real $${costUsd})`);

  const diff = computeDiff(prevSnap, snapshot);
  writeReports(date, snapshot, prevSnap, diff);
  printSummary(snapshot, prevSnap, diff);
}

function computeDiff(prev, curr) {
  const buckets = {
    new: [],
    entered_top_10: [],
    improved: [],
    unchanged: [],
    declined: [],
    dropped_top_100: [],
    not_ranked: [],
  };
  const prevByKw = new Map((prev?.results ?? []).map(r => [r.keyword.toLowerCase(), r]));
  for (const r of curr.results) {
    const old = prevByKw.get(r.keyword.toLowerCase());
    const oldPos = old?.position ?? null;
    const newPos = r.position ?? null;

    if (!old) {
      buckets.new.push({ keyword: r.keyword, oldPos: null, newPos, delta: null, url: r.url });
      continue;
    }
    if (newPos == null) {
      if (oldPos != null) buckets.dropped_top_100.push({ keyword: r.keyword, oldPos, newPos: null, delta: null, url: null });
      else buckets.not_ranked.push({ keyword: r.keyword, oldPos: null, newPos: null, delta: 0, url: null });
      continue;
    }
    if (oldPos == null) {
      buckets.entered_top_10.push({ keyword: r.keyword, oldPos: null, newPos, delta: null, url: r.url });
      continue;
    }
    const delta = oldPos - newPos; // positivo = subiu
    const entry = { keyword: r.keyword, oldPos, newPos, delta, url: r.url };
    if (newPos <= 10 && oldPos > 10) buckets.entered_top_10.push(entry);
    else if (delta > 0) buckets.improved.push(entry);
    else if (delta < 0) buckets.declined.push(entry);
    else buckets.unchanged.push(entry);
  }
  // ordena por magnitude
  buckets.improved.sort((a, b) => b.delta - a.delta);
  buckets.declined.sort((a, b) => a.delta - b.delta);
  return buckets;
}

function writeReports(date, snapshot, prev, diff) {
  ensureDir(REPORTS_DIR + "/x");

  // JSON
  const reportJson = {
    date,
    target_domain: snapshot.target_domain,
    snapshot_count: snapshot.results.length,
    cost_usd: snapshot.cost_usd,
    previous: prev?.date ?? null,
    summary: Object.fromEntries(Object.entries(diff).map(([k, v]) => [k, v.length])),
    buckets: diff,
  };
  writeJson(join(REPORTS_DIR, `${date}.json`), reportJson);

  // CSV
  const flatRows = snapshot.results.map(r => ({
    keyword: r.keyword,
    position: r.position ?? "",
    url: r.url ?? "",
    title: r.title ?? "",
    in_top_100: r.in_top_100 ?? "",
  }));
  writeFileSync(join(REPORTS_DIR, `${date}.csv`), rowsToCsv(flatRows), "utf8");

  // Markdown
  const md = renderMarkdownReport(date, snapshot, prev, diff);
  writeFileSync(join(REPORTS_DIR, `${date}.md`), md, "utf8");
}

function renderMarkdownReport(date, snapshot, prev, diff) {
  const lines = [];
  lines.push(`# Rank Tracker — ${date}`);
  lines.push("");
  lines.push(`- **Target:** ${snapshot.target_domain}`);
  lines.push(`- **Locale:** ${snapshot.locale.location_code} / ${snapshot.locale.language_code}`);
  lines.push(`- **Depth:** ${snapshot.depth}`);
  lines.push(`- **Keywords:** ${snapshot.results.length}`);
  lines.push(`- **Custo:** $${snapshot.cost_usd.toFixed(4)} USD`);
  lines.push(`- **Snapshot anterior:** ${prev?.date ?? "—"}`);
  lines.push("");

  const sections = [
    ["Subiram (entered top 10)", diff.entered_top_10, "—"],
    ["Subiram (improved)", diff.improved, "Δ"],
    ["Caíram (declined)", diff.declined, "Δ"],
    ["Saíram do top 100", diff.dropped_top_100, "—"],
    ["Novas (sem baseline)", diff.new, "—"],
    ["Sem mudança", diff.unchanged, "Δ"],
    ["Não rankeadas", diff.not_ranked, "—"],
  ];
  for (const [title, items] of sections) {
    if (!items.length) continue;
    lines.push(`## ${title} (${items.length})`);
    lines.push("");
    lines.push("| Keyword | Anterior | Atual | Δ | URL |");
    lines.push("|---|---|---|---|---|");
    for (const it of items) {
      const old = it.oldPos ?? "—";
      const cur = it.newPos ?? "—";
      const delta = it.delta == null ? "—" : it.delta > 0 ? `+${it.delta}` : `${it.delta}`;
      const url = it.url ? `[link](${it.url})` : "";
      lines.push(`| ${it.keyword} | ${old} | ${cur} | ${delta} | ${url} |`);
    }
    lines.push("");
  }
  return lines.join("\n") + "\n";
}

function printSummary(snapshot, prev, diff) {
  console.log(`\n✅ Update completo.`);
  console.log(`   Custo: $${snapshot.cost_usd.toFixed(4)} USD`);
  console.log(`   Snapshot: ${snapshot.results.length} keywords`);
  if (prev) {
    console.log(`   Vs ${prev.date}:`);
    console.log(`     ⬆️  ${diff.entered_top_10.length} entered top 10, ${diff.improved.length} improved`);
    console.log(`     ⬇️  ${diff.declined.length} declined, ${diff.dropped_top_100.length} dropped top 100`);
    console.log(`     ⏸  ${diff.unchanged.length} unchanged, ${diff.not_ranked.length} not ranked`);
    if (diff.improved.length) {
      const top3 = diff.improved.slice(0, 3).map(d => `"${d.keyword}" (${d.oldPos}→${d.newPos})`).join(", ");
      console.log(`   Top 3 subidas: ${top3}`);
    }
    if (diff.declined.length) {
      const top3 = diff.declined.slice(0, 3).map(d => `"${d.keyword}" (${d.oldPos}→${d.newPos})`).join(", ");
      console.log(`   Top 3 quedas: ${top3}`);
    }
  } else {
    console.log(`   (primeiro snapshot — sem baseline pra diff)`);
  }
  console.log(`\n   Reports: brain/seo/data/rank-tracker/reports/${snapshot.date}.{md,csv,json}`);
}

// ---------- entry ----------

function help() {
  console.log(`
/rank-tracker — monitor de posições orgânicas (DataForSEO batch async)

Uso:
  rank-tracker add "kw1, kw2"      Adiciona keywords à lista (não chama API)
  rank-tracker remove "kw1"        Remove keyword da lista
  rank-tracker list                Mostra estado atual + última posição
  rank-tracker update              Puxa SERP, salva snapshot, gera report
    [--priority=normal|high]         high default (1-3min, 2x preço); normal (5-10min, mais barato)
    [--live]                         síncrono (~3x mais caro, instantâneo)
    [--resume]                       retoma tasks pendentes (após timeout em modo async)
    [--domain=foo.com]               override do target domain
    [--strict-subdomain]             só match exato (sem subdomínios)
    [--no-confirm]                   pula prompt de custo
  rank-tracker history "kw1"       Série temporal de uma keyword
  rank-tracker --help              Esta tela

Storage: brain/seo/data/rank-tracker/
Custo: depth=200, ~$0.00915/keyword (Standard Normal).
`);
}

async function main() {
  loadEnv();
  const args = parseArgs(process.argv.slice(2));
  const cmd = args._[0];
  const rest = args._.slice(1).join(" ");

  if (!cmd || cmd === "--help" || cmd === "-h" || cmd === "help") {
    help();
    return;
  }

  try {
    switch (cmd) {
      case "add": cmdAdd(rest); break;
      case "remove": cmdRemove(rest); break;
      case "list": cmdList(); break;
      case "history": cmdHistory(rest); break;
      case "update": await cmdUpdate(args.flags); break;
      default:
        console.error(`Sub-comando desconhecido: "${cmd}"`);
        help();
        process.exit(1);
    }
  } catch (err) {
    if (err instanceof DataForSEOError) {
      console.error(`\n❌ ${err.message}`);
      process.exit(1);
    }
    throw err;
  }
}

main().catch(err => {
  console.error("[rank-tracker] fatal:", err);
  process.exit(1);
});
