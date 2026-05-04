#!/usr/bin/env node
// DataForSEO shared client — auth, retry, rate limit, output writers.
// Skills /seo-data, /seo-data, /seo-data usam este client.
// Falha cedo com mensagem clara se credenciais ausentes.

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname } from "node:path";

const BASE_URL = "https://api.dataforseo.com/v3";
const MAX_RETRIES = 4;
const RETRY_DELAYS_MS = [250, 500, 1000, 2000];
const DEFAULT_CONCURRENCY = 5;

export class DataForSEOError extends Error {
  constructor(message, { status, body } = {}) {
    super(message);
    this.name = "DataForSEOError";
    this.status = status;
    this.body = body;
  }
}

export function loadCredentials() {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) {
    const msg = [
      "❌ DataForSEO não configurado.",
      "",
      "Crie uma conta em https://app.dataforseo.com/register (Pay-as-you-go).",
      "Pegue API Login + API Password em Dashboard → API Access.",
      "Copie .env.example para .env.local e preencha:",
      "  DATAFORSEO_LOGIN=seu_api_login",
      "  DATAFORSEO_PASSWORD=sua_api_password",
      "",
      "Custo aproximado: $0.05/keyword, $0.30/domínio.",
    ].join("\n");
    throw new DataForSEOError(msg, { status: 0 });
  }
  return { login, password };
}

function authHeader({ login, password }) {
  const creds = Buffer.from(`${login}:${password}`).toString("base64");
  return `Basic ${creds}`;
}

function logSafeCredentials({ login }) {
  const masked = login.length > 6 ? `${login.slice(0, 3)}***${login.slice(-3)}` : "***";
  console.log(`[dataforseo] auth as ${masked}`);
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export async function callDataForSEO(endpoint, payload, opts = {}) {
  const creds = loadCredentials();
  if (opts.verbose !== false) logSafeCredentials(creds);

  const url = `${BASE_URL}${endpoint}`;
  const body = JSON.stringify(payload);

  let lastError;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: authHeader(creds),
          "Content-Type": "application/json",
        },
        body,
      });

      if (res.status === 429) {
        const wait = RETRY_DELAYS_MS[attempt] ?? 2000;
        if (opts.verbose !== false) console.log(`[dataforseo] 429 rate limit, aguardando ${wait}ms`);
        await sleep(wait);
        continue;
      }

      const json = await res.json();

      if (!res.ok || json.status_code >= 40000) {
        throw new DataForSEOError(`API erro: ${json.status_message ?? res.statusText}`, {
          status: res.status,
          body: json,
        });
      }

      return json;
    } catch (err) {
      lastError = err;
      if (err instanceof DataForSEOError && err.status >= 400 && err.status < 500 && err.status !== 429) {
        throw err;
      }
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAYS_MS[attempt] ?? 2000);
      }
    }
  }
  throw lastError ?? new DataForSEOError("Máximo de retries atingido");
}

export async function pLimit(concurrency, items, fn) {
  const results = [];
  let cursor = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const idx = cursor++;
      results[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return results;
}

export function defaultLocale() {
  return {
    location_code: Number(process.env.DATAFORSEO_LOCATION_CODE ?? 2076),
    language_code: process.env.DATAFORSEO_LANGUAGE_CODE ?? "pt",
  };
}

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
  const escape = v => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map(h => escape(row[h])).join(","));
  }
  return lines.join("\n");
}

export function rowsToMarkdown(rows, { title, intro } = {}) {
  if (!rows.length) return `# ${title ?? "Resultado"}\n\nSem dados.\n`;
  const headers = Object.keys(rows[0]);
  const lines = [];
  if (title) lines.push(`# ${title}`, "");
  if (intro) lines.push(intro, "");
  lines.push(`| ${headers.join(" | ")} |`);
  lines.push(`| ${headers.map(() => "---").join(" | ")} |`);
  for (const row of rows) {
    lines.push(`| ${headers.map(h => row[h] ?? "").join(" | ")} |`);
  }
  return lines.join("\n") + "\n";
}

export function estimateCost(operation, count = 1) {
  const PRICES = {
    "keywords-volume": 0.05,
    "competitor-pages": 0.30,
    "competitor-keywords": 0.30,
  };
  const unit = PRICES[operation] ?? 0;
  return { unit, total: unit * count, currency: "USD" };
}

export function printCostPreview(operation, count, items) {
  const cost = estimateCost(operation, count);
  console.log(`[dataforseo] custo estimado: ~$${cost.total.toFixed(2)} ${cost.currency} (${count} × $${cost.unit.toFixed(2)})`);
  if (items && items.length <= 10) {
    console.log(`[dataforseo] queries: ${items.join(", ")}`);
  }
}

export function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

export function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
