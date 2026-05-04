// SQLite (node:sqlite nativo) para snapshots time-series do /rank-tracker.
// Schema: 1 tabela `snapshots` com PK composta (date, keyword) — idempotente
// no dia + naturalmente ordenável.
//
// Por que SQLite e não JSON:
// - Time-series queries (history por keyword, último snapshot anterior) viram
//   SELECTs simples em vez de loops de leitura de N arquivos.
// - 50 keywords × 52 weeks × ~100B = ~260KB/ano por projeto: cabe em git.
// - Reports (md/csv/json) continuam derivados consumíveis pelo humano —
//   o Brain segue navegável.
//
// Requer Node >=22.13 (node:sqlite estável; engines no package.json garante).
// Suprime ExperimentalWarning específico do SQLite — ainda é RC em 24.x.

import { DatabaseSync } from "node:sqlite";
import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS snapshots (
  date          TEXT NOT NULL,
  keyword       TEXT NOT NULL,
  position      INTEGER,
  url           TEXT,
  title         TEXT,
  in_top_100    INTEGER,
  results_count INTEGER,
  error         TEXT,
  fetched_at    TEXT NOT NULL,
  target_domain TEXT NOT NULL,
  depth         INTEGER NOT NULL,
  cost_usd      REAL,
  PRIMARY KEY (date, keyword)
);

CREATE INDEX IF NOT EXISTS idx_keyword_date ON snapshots(keyword COLLATE NOCASE, date);
CREATE INDEX IF NOT EXISTS idx_date ON snapshots(date);
`;

// node:sqlite ainda emite ExperimentalWarning. Suprimimos só esse warning
// específico, sem mascarar outros.
function silenceSqliteWarning() {
  process.removeAllListeners("warning");
  process.on("warning", w => {
    if (w.name === "ExperimentalWarning" && /SQLite/i.test(w.message)) return;
    console.warn(w);
  });
}

export function openDb(path) {
  silenceSqliteWarning();
  const dir = dirname(path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const db = new DatabaseSync(path);
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA foreign_keys = ON");
  db.exec(SCHEMA);
  return db;
}

export function upsertSnapshotBatch(db, rows) {
  const stmt = db.prepare(`
    INSERT INTO snapshots
      (date, keyword, position, url, title, in_top_100, results_count, error,
       fetched_at, target_domain, depth, cost_usd)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT (date, keyword) DO UPDATE SET
      position      = excluded.position,
      url           = excluded.url,
      title         = excluded.title,
      in_top_100    = excluded.in_top_100,
      results_count = excluded.results_count,
      error         = excluded.error,
      fetched_at    = excluded.fetched_at,
      target_domain = excluded.target_domain,
      depth         = excluded.depth,
      cost_usd      = excluded.cost_usd
  `);
  const txn = db.exec.bind(db);
  txn("BEGIN");
  try {
    for (const r of rows) {
      stmt.run(
        r.date,
        r.keyword,
        r.position ?? null,
        r.url ?? null,
        r.title ?? null,
        r.in_top_100 == null ? null : (r.in_top_100 ? 1 : 0),
        r.results_count ?? null,
        r.error ?? null,
        r.fetched_at,
        r.target_domain,
        r.depth,
        r.cost_usd ?? null,
      );
    }
    txn("COMMIT");
  } catch (err) {
    txn("ROLLBACK");
    throw err;
  }
}

export function getSnapshot(db, date) {
  const rows = db.prepare(
    "SELECT * FROM snapshots WHERE date = ? ORDER BY keyword COLLATE NOCASE"
  ).all(date);
  return rows.length ? { date, results: rows.map(rowToResult) } : null;
}

export function getLatestSnapshot(db) {
  const row = db.prepare("SELECT MAX(date) AS d FROM snapshots").get();
  return row?.d ? getSnapshot(db, row.d) : null;
}

export function getPreviousSnapshot(db, beforeDate) {
  const row = db.prepare("SELECT MAX(date) AS d FROM snapshots WHERE date < ?").get(beforeDate);
  return row?.d ? getSnapshot(db, row.d) : null;
}

export function getKeywordHistory(db, keyword) {
  return db.prepare(`
    SELECT date, position, url, title
    FROM snapshots
    WHERE keyword = ? COLLATE NOCASE
    ORDER BY date
  `).all(keyword).map(r => ({
    date: r.date,
    position: r.position,
    url: r.url,
    title: r.title,
  }));
}

export function getLatestPositionByKeyword(db, keyword) {
  return db.prepare(`
    SELECT date, position, url
    FROM snapshots
    WHERE keyword = ? COLLATE NOCASE
    ORDER BY date DESC
    LIMIT 1
  `).get(keyword) ?? null;
}

export function listSnapshotDates(db) {
  return db.prepare("SELECT DISTINCT date FROM snapshots ORDER BY date").all().map(r => r.date);
}

function rowToResult(r) {
  return {
    keyword: r.keyword,
    position: r.position,
    url: r.url,
    title: r.title,
    in_top_100: r.in_top_100 == null ? null : !!r.in_top_100,
    results_count: r.results_count,
    error: r.error,
  };
}
