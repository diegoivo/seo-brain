#!/usr/bin/env node
// Article Quality Validator — calcula métricas reais do artigo (LLMs são ruins
// para contar). Valida contra alvo definido no frontmatter (target_words) ou
// inferido pelo intent (informational=1500, commercial=800, etc).
//
// Uso: node scripts/article-quality.mjs <path-to-md> [--strict]

import { readFile } from "node:fs/promises";
import { argv, exit } from "node:process";

const STRICT = argv.includes("--strict");
const target = argv[2];
if (!target) {
  console.error("Uso: article-quality <path-to-md> [--strict]");
  exit(2);
}

const raw = await readFile(target, "utf8");
const fm = parseFrontmatter(raw);
const body = stripFrontmatter(raw);

const m = analyze(body);
const intent = fm.search_intent ?? "informational";
const targetWords = fm.target_words ?? defaultTargetByIntent(intent);

const checks = [
  { label: `Palavras (${m.words}/${targetWords})`, pass: Math.abs(m.words - targetWords) / targetWords <= 0.2, severity: "high" },
  { label: `Parágrafos com ≥3 frases`, pass: m.paragraphsWithMinSentences >= m.paragraphs * 0.7, value: `${m.paragraphsWithMinSentences}/${m.paragraphs}`, severity: "high" },
  { label: `Bullets totais ≤ 2 listas`, pass: m.bulletLists <= 2, value: `${m.bulletLists} listas`, severity: "high" },
  { label: `Frases ≤25 palavras (≥80%)`, pass: m.shortSentences / m.totalSentences >= 0.8, value: `${Math.round(m.shortSentences / m.totalSentences * 100)}%`, severity: "medium" },
  { label: `Heading hierarchy (h2 antes de h3)`, pass: m.headingOrder, severity: "medium" },
  { label: `1 H1 único`, pass: m.h1Count === 1, value: `${m.h1Count}`, severity: "low" },
];

const failed = checks.filter(c => !c.pass);

console.log(`\n📝 Article quality — ${target}\n`);
for (const c of checks) {
  const icon = c.pass ? "✓" : "✗";
  console.log(`  ${icon} ${c.label}${c.value ? ` — ${c.value}` : ""}`);
}
console.log(`\nIntent: ${intent} | target ${targetWords} palavras`);

if (failed.length > 0) {
  console.log(`\n⚠️  ${failed.length} check(s) falharam:`);
  for (const c of failed) {
    console.log(`  - [${c.severity}] ${c.label}`);
  }
  if (STRICT && failed.some(c => c.severity === "high")) {
    console.log("\n❌ STRICT mode: high severity falhou. Refazer artigo antes de publicar.");
    exit(1);
  }
}

// ============================================================================

function analyze(body) {
  const text = body.replace(/```[\s\S]*?```/g, ""); // strip code blocks
  const lines = text.split("\n");

  // Contagem de palavras
  const plain = text.replace(/[#*`_\[\]()>!~]/g, " ").replace(/\s+/g, " ");
  const words = plain.split(/\s+/).filter(Boolean).length;

  // Headings
  let h1Count = 0;
  const headingLevels = [];
  for (const line of lines) {
    const m = line.match(/^(#{1,6})\s+/);
    if (m) {
      const level = m[1].length;
      if (level === 1) h1Count++;
      headingLevels.push(level);
    }
  }
  let headingOrder = true;
  for (let i = 1; i < headingLevels.length; i++) {
    if (headingLevels[i] - headingLevels[i - 1] > 1) {
      headingOrder = false;
      break;
    }
  }

  // Parágrafos (separados por linha em branco)
  const paragraphs = text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p && !p.startsWith("#") && !p.startsWith("- ") && !p.startsWith("* ") && !p.startsWith("> "));

  let paragraphsWithMinSentences = 0;
  let totalSentences = 0;
  let shortSentences = 0;

  for (const p of paragraphs) {
    const sentences = p.split(/[.!?]+\s+|[.!?]+$/).filter(s => s.trim().length > 5);
    totalSentences += sentences.length;
    if (sentences.length >= 3) paragraphsWithMinSentences++;
    for (const s of sentences) {
      const sw = s.split(/\s+/).filter(Boolean).length;
      if (sw <= 25) shortSentences++;
    }
  }

  // Listas (sequências de 2+ linhas começando com -, *, ou número)
  let bulletLists = 0;
  let inList = false;
  for (const line of lines) {
    const isBullet = /^\s*[-*]\s|^\s*\d+\.\s/.test(line);
    if (isBullet && !inList) {
      bulletLists++;
      inList = true;
    } else if (!isBullet && line.trim() === "") {
      // mantém — espaço entre bullets não quebra lista
    } else if (!isBullet) {
      inList = false;
    }
  }

  return {
    words,
    paragraphs: paragraphs.length,
    paragraphsWithMinSentences,
    totalSentences,
    shortSentences: shortSentences || 1,
    bulletLists,
    h1Count,
    headingOrder,
  };
}

function defaultTargetByIntent(intent) {
  switch (intent) {
    case "informational": return 1500;
    case "commercial":    return 800;
    case "transactional": return 500;
    case "navigational":  return 300;
    default:              return 1200;
  }
}

function parseFrontmatter(s) {
  const m = s.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!kv) continue;
    const [, k, v] = kv;
    const clean = v.trim().replace(/^["']|["']$/g, "");
    out[k] = isNaN(Number(clean)) ? clean : Number(clean);
  }
  return out;
}

function stripFrontmatter(s) {
  return s.replace(/^---\n[\s\S]*?\n---\n/, "");
}
