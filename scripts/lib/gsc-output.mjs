// Helpers de output para skills GSC. Padrão idêntico ao dataforseo-client:
// triple output (md + csv + json) em brain/seo/data/gsc/.
//
// Por que separado: gsc-client.mjs é específico de auth/HTTP. Output é
// genérico e reusado por /gsc-google-search-console-performance e /gsc-google-search-console-coverage.

import { writeFileSync, mkdirSync, existsSync, appendFileSync } from "node:fs";
import { dirname } from "node:path";

export function ensureDir(filepath) {
  const dir = dirname(filepath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

export function writeOutputs(basePath, { md, csv, json }) {
  ensureDir(basePath);
  if (md) writeFileSync(`${basePath}.md`, md, "utf8");
  if (csv) writeFileSync(`${basePath}.csv`, csv, "utf8");
  if (json) writeFileSync(`${basePath}.json`, JSON.stringify(json, null, 2), "utf8");
}

export function rowsToCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  }
  return lines.join("\n") + "\n";
}

export function rowsToMarkdown(rows, { title, intro } = {}) {
  if (!rows.length) {
    const head = title ? `# ${title}\n\n` : "";
    return `${head}Sem dados.\n`;
  }
  const headers = Object.keys(rows[0]);
  const lines = [];
  if (title) lines.push(`# ${title}`, "");
  if (intro) lines.push(intro, "");
  lines.push(`| ${headers.join(" | ")} |`);
  lines.push(`| ${headers.map(() => "---").join(" | ")} |`);
  for (const row of rows) {
    lines.push(`| ${headers.map((h) => formatCell(row[h])).join(" | ")} |`);
  }
  return lines.join("\n") + "\n";
}

function formatCell(v) {
  if (v === null || v === undefined) return "";
  if (typeof v === "number" && !Number.isInteger(v)) return v.toFixed(2);
  return String(v).replace(/\|/g, "\\|");
}

export function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

export function appendLog(logPath, entry) {
  ensureDir(logPath);
  const line = JSON.stringify({ ts: new Date().toISOString(), ...entry });
  appendFileSync(logPath, line + "\n", "utf8");
}
