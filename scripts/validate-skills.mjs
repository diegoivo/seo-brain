#!/usr/bin/env node
// Valida frontmatter de todas as skills sob skills/.
// Checks:
//   1. SKILL.md existe.
//   2. Frontmatter válido (--- ... ---).
//   3. name = nome do diretório.
//   4. description ≥40 palavras.
//   5. Sem colisão de name entre skills.
//   6. SKILL.md ≤500 linhas.
//   7. Description tem "Use when" ou triggers explícitos.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const SKILLS_DIR = "skills";
const MAX_LINES = 500;
const MIN_DESC_WORDS = 40;

const errors = [];
const warnings = [];
const seenNames = new Set();

const dirs = readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .sort();

for (const name of dirs) {
  const file = join(SKILLS_DIR, name, "SKILL.md");
  if (!existsSync(file)) {
    errors.push(`${name}: missing SKILL.md`);
    continue;
  }

  const content = readFileSync(file, "utf8");
  const lines = content.split("\n").length;
  if (lines > MAX_LINES) {
    errors.push(`${name}: SKILL.md has ${lines} lines (max ${MAX_LINES})`);
  }

  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    errors.push(`${name}: missing frontmatter`);
    continue;
  }
  const fm = fmMatch[1];

  const nameField = fm.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  if (!nameField) {
    errors.push(`${name}: missing 'name' field`);
  } else if (nameField !== name) {
    errors.push(`${name}: name mismatch — frontmatter '${nameField}', dir '${name}'`);
  } else if (seenNames.has(nameField)) {
    errors.push(`${name}: collision — '${nameField}' used by another skill`);
  } else {
    seenNames.add(nameField);
  }

  const descMatch = fm.match(/^description:\s*([\s\S]+?)(?=\n[a-z-]+:|$)/m);
  const desc = descMatch?.[1]?.trim() || "";
  const descWords = desc.split(/\s+/).filter(Boolean).length;
  if (descWords < MIN_DESC_WORDS) {
    warnings.push(`${name}: description has ${descWords} words (recommend ≥${MIN_DESC_WORDS})`);
  }
  const hasTrigger = /use when|use quando|trigger/i.test(desc);
  if (!hasTrigger) {
    warnings.push(`${name}: description lacks 'Use when' or 'trigger' keyword (descoverability)`);
  }
}

console.log(`\n=== Skill validation ===`);
console.log(`Skills found: ${dirs.length}`);
console.log(`Errors: ${errors.length}`);
console.log(`Warnings: ${warnings.length}`);

if (errors.length > 0) {
  console.log("\n❌ ERRORS:");
  for (const e of errors) console.log(`  - ${e}`);
}
if (warnings.length > 0) {
  console.log("\n⚠️  WARNINGS:");
  for (const w of warnings) console.log(`  - ${w}`);
}

if (errors.length === 0) {
  console.log("\n✓ All checks passed.");
  process.exit(0);
} else {
  process.exit(1);
}
