#!/usr/bin/env node
// Renomeia frontmatter `name:` em SKILL.md para o nome do diretório.
// Roda em todas as skills sob skills/.

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const dir = "skills";
const skills = readdirSync(dir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

let updated = 0;
for (const name of skills) {
  const file = join(dir, name, "SKILL.md");
  if (!existsSync(file)) continue;
  const content = readFileSync(file, "utf8");
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    console.warn(`⚠️  ${file}: no frontmatter`);
    continue;
  }
  const fm = fmMatch[1];
  const oldName = fm.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  if (oldName === name) continue;
  const newFm = fm.replace(/^name:\s*.+$/m, `name: ${name}`);
  const newContent = content.replace(fmMatch[0], `---\n${newFm}\n---`);
  writeFileSync(file, newContent);
  console.log(`✓ ${oldName} → ${name}`);
  updated++;
}

console.log(`\n${updated} skills updated.`);
