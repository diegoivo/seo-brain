#!/usr/bin/env node
// Brain Lint — Karpathy-style + Obsidian-friendly.
// Valida: frontmatter, freshness, orphans (páginas sem inbound links),
// broken wikilinks, stale claims, contradições heurísticas.
// Uso: node scripts/brain-lint.mjs [--strict]

import { readdir, readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, relative } from "node:path";
import { argv } from "node:process";

const ROOT = process.cwd();
const STRICT = argv.includes("--strict");
const ERRORS = [];
const WARNINGS = [];

const REQUIRED_POST_FIELDS = [
  "title", "description", "slug", "date", "status", "schema_type",
  "primary_keyword", "search_intent", "target_persona",
  "proprietary_claims", "author",
];
const REQUIRED_SITE_FIELDS = [
  "title", "description", "slug", "updated", "status", "schema_type",
  "primary_keyword", "search_intent", "category",
];
const FRESHNESS_DAYS = 30;
const STALE_DAYS = 90;

const REQUIRED_BRAIN = [
  "brain/index.md",
  "brain/log.md",
  "brain/config.md",
  "brain/tom-de-voz.md",
  "brain/personas/index.md",
  "brain/povs/index.md",
  "brain/glossario/index.md",
  "brain/tecnologia/index.md",
  "brain/sources/index.md",
  "brain/backlog.md",
];

await checkBrainCore();
await checkBrainEntities();
await checkBrainGraph();
await checkContent("content/posts", REQUIRED_POST_FIELDS);
await checkContent("content/site", REQUIRED_SITE_FIELDS);

console.log(`\nBrain Lint: ${ERRORS.length} erro(s), ${WARNINGS.length} warning(s)`);
for (const w of WARNINGS) console.log(`  ⚠️  ${w}`);
for (const e of ERRORS) console.log(`  ❌  ${e}`);

if (STRICT && ERRORS.length > 0) process.exit(1);

// ============================================================================

async function checkBrainCore() {
  for (const f of REQUIRED_BRAIN) {
    if (!existsSync(join(ROOT, f))) {
      ERRORS.push(`${f} não existe`);
      continue;
    }
    await checkFreshness(f);
    await checkStaleClaims(f);
  }
  if (!existsSync(join(ROOT, "brain/DESIGN.md"))) {
    WARNINGS.push("brain/DESIGN.md não existe — rode /design-init (ou /onboard fase brandbook)");
  }
}

async function checkBrainEntities() {
  // Personas, POVs, glossário: cada um deve ter ≥1 entidade preenchida
  // (após onboard). Em estado template, só aviso.
  const dirs = ["brain/personas", "brain/povs", "brain/glossario"];
  for (const dir of dirs) {
    const full = join(ROOT, dir);
    if (!existsSync(full)) continue;
    const entries = await readdir(full);
    const real = entries.filter(e => e.endsWith(".md") && e !== "index.md" && !e.startsWith("_"));
    if (real.length === 0) {
      WARNINGS.push(`${dir}: vazio (0 entidades). Esperado após /onboard.`);
    }
  }
}

async function checkBrainGraph() {
  // Constrói grafo de wikilinks e detecta orphans + broken refs.
  const brainFiles = await collectMd("brain");
  // Para resolver wikilinks com `..` que apontam pra fora do brain (ex.: docs/, content/).
  const externalFiles = [...await collectMd("docs"), ...await collectMd("content")];
  const allFiles = [...brainFiles, ...externalFiles];
  const inbound = new Map(); // file → count

  for (const f of brainFiles) {
    inbound.set(slugify(f), 0);
  }

  for (const f of brainFiles) {
    // Templates ilustram sintaxe — não validar wikilinks neles.
    if (f.endsWith("_template.md")) continue;
    const content = await readFile(join(ROOT, f), "utf8");
    // Aceita escape de pipe em tabelas (`\|`). Ignora target placeholder com `...` ou `<...>`.
    const wikilinks = [...content.matchAll(/\[\[([^\]|#\\]+)(?:\\?\|[^\]]*)?\]\]/g)]
      .map(m => m[1].trim())
      .filter(t => !t.includes("...") && !t.includes("<") && t !== "arquivo" && t !== "Nota");
    for (const target of wikilinks) {
      const candidate = resolveWikilink(target, f, allFiles);
      if (!candidate) {
        WARNINGS.push(`${f}: wikilink quebrado [[${target}]]`);
      } else if (brainFiles.includes(candidate)) {
        inbound.set(slugify(candidate), (inbound.get(slugify(candidate)) || 0) + 1);
      }
    }
  }

  // Orphans (exceto index.md, _template.md e log.md)
  for (const f of brainFiles) {
    if (f.endsWith("/index.md") || f.endsWith("_template.md") || f.endsWith("/log.md")) continue;
    const count = inbound.get(slugify(f)) || 0;
    if (count === 0) {
      WARNINGS.push(`${f}: orphan (nenhum arquivo do brain linka pra cá)`);
    }
  }
}

async function checkStaleClaims(file) {
  const content = await readFile(join(ROOT, file), "utf8");
  const fm = parseFrontmatter(content);
  if (!fm || !fm.updated || fm.updated === "TEMPLATE") return;
  const updated = new Date(fm.updated);
  if (isNaN(updated.getTime())) return;
  const ageDays = (Date.now() - updated.getTime()) / 86400000;
  if (ageDays > STALE_DAYS) {
    WARNINGS.push(`${file}: stale — frontmatter updated há ${Math.round(ageDays)} dias (>${STALE_DAYS}d). Revisar claims.`);
  }
}

async function collectMd(dir) {
  const full = join(ROOT, dir);
  if (!existsSync(full)) return [];
  const out = [];
  await walk(full);
  return out;

  async function walk(d) {
    const entries = await readdir(d, { withFileTypes: true });
    for (const e of entries) {
      const p = join(d, e.name);
      if (e.isDirectory()) {
        if (e.name.startsWith(".")) continue;
        await walk(p);
      } else if (e.name.endsWith(".md")) {
        out.push(relative(ROOT, p));
      }
    }
  }
}

function slugify(filepath) {
  return filepath.replace(/\.md$/, "").replace(/\/index$/, "");
}

function resolveWikilink(target, fromFile, allFiles) {
  // Tenta resolver [[target]] relativo ao arquivo (com .. normalizado), depois absoluto em brain/.
  const fromDir = fromFile.split("/").slice(0, -1).join("/");
  const candidates = [
    normalizePath(`${fromDir}/${target}.md`),
    normalizePath(`${fromDir}/${target}/index.md`),
    `brain/${target}.md`,
    `brain/${target}/index.md`,
    target.endsWith(".md") ? `brain/${target}` : null,
  ].filter(Boolean);
  for (const c of candidates) {
    if (allFiles.includes(c)) return c;
  }
  return null;
}

function normalizePath(p) {
  const parts = p.split("/");
  const out = [];
  for (const part of parts) {
    if (part === "..") out.pop();
    else if (part !== "." && part !== "") out.push(part);
  }
  return out.join("/");
}

async function checkFreshness(path) {
  const s = await stat(join(ROOT, path));
  const ageDays = (Date.now() - s.mtimeMs) / 86400000;
  if (ageDays > FRESHNESS_DAYS) {
    WARNINGS.push(`${path}: ${Math.round(ageDays)} dias sem mtime (>${FRESHNESS_DAYS}d)`);
  }
}

async function checkContent(dir, requiredFields) {
  const full = join(ROOT, dir);
  if (!existsSync(full)) return;
  const indexPath = join(full, "index.md");
  if (!existsSync(indexPath)) {
    WARNINGS.push(`${dir}/index.md não existe`);
  }
  let entries;
  try { entries = await readdir(full); } catch { return; }
  for (const entry of entries) {
    if (!entry.endsWith(".md") || entry === "index.md" || entry.startsWith("_")) continue;
    const filePath = join(full, entry);
    const content = await readFile(filePath, "utf8");
    const fm = parseFrontmatter(content);
    if (!fm) {
      ERRORS.push(`${dir}/${entry}: frontmatter ausente`);
      continue;
    }
    for (const field of requiredFields) {
      if (!(field in fm) || fm[field] === "" || fm[field] === null) {
        ERRORS.push(`${dir}/${entry}: campo obrigatório '${field}' ausente ou vazio`);
      }
    }
    if (Array.isArray(fm.proprietary_claims) && fm.proprietary_claims.length < 3) {
      ERRORS.push(`${dir}/${entry}: proprietary_claims precisa de ≥3 itens (tem ${fm.proprietary_claims.length})`);
    }
  }
}

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const out = {};
  let currentArrayKey = null;
  for (const line of m[1].split("\n")) {
    if (currentArrayKey && line.match(/^\s*-\s/)) {
      out[currentArrayKey].push(line.replace(/^\s*-\s/, "").trim().replace(/^["']|["']$/g, ""));
      continue;
    }
    currentArrayKey = null;
    const kv = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!kv) continue;
    const [, k, v] = kv;
    if (v === "" || v === "[]") {
      out[k] = v === "[]" ? [] : "";
      if (v === "") currentArrayKey = k;
      if (currentArrayKey) out[k] = [];
    } else {
      out[k] = v.replace(/^["']|["']$/g, "");
    }
  }
  return out;
}
