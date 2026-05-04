#!/usr/bin/env node
// Mede tokens carregados em SessionStart antes/depois do refactor.
// - Pré: lê AGENTS.md + soma SKILL.md frontmatters de .claude/skills/*/
// - Pós: soma SKILL.md frontmatters de skills/*/
// Heurística simples: ~12 tokens/linha de markdown.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const TOKENS_PER_LINE = 12;
const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---/;

function countLines(s) {
  return s.split("\n").length;
}

function frontmatterOf(path) {
  try {
    const content = readFileSync(path, "utf8");
    const m = content.match(FRONTMATTER_RE);
    return m ? m[1] : "";
  } catch { return ""; }
}

function measureSkillsDir(dir) {
  let totalLines = 0;
  let count = 0;
  if (!existsSafe(dir)) return { count: 0, lines: 0, tokens: 0 };
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillFile = join(dir, entry.name, "SKILL.md");
    const fm = frontmatterOf(skillFile);
    totalLines += countLines(fm);
    count++;
  }
  return { count, lines: totalLines, tokens: totalLines * TOKENS_PER_LINE };
}

function existsSafe(p) {
  try { return statSync(p).isDirectory(); } catch { return false; }
}

const mode = process.argv[2] || "--current";

if (mode === "--pre") {
  // Estado pré-refactor: AGENTS.md (full) + .claude/skills/ frontmatters
  const agents = readFileSync("AGENTS.md", "utf8");
  const agentsLines = countLines(agents);
  const agentsTokens = agentsLines * TOKENS_PER_LINE;
  const skills = measureSkillsDir(".claude/skills");
  console.log(JSON.stringify({
    mode: "pre",
    agents_md_lines: agentsLines,
    agents_md_tokens: agentsTokens,
    skills_count: skills.count,
    skills_frontmatter_tokens: skills.tokens,
    total_session_start_tokens: agentsTokens + skills.tokens,
    note: "Conservative: 12 tokens/line. AGENTS.md fully loaded via @import in CLAUDE.md."
  }, null, 2));
} else if (mode === "--post") {
  // Estado pós-refactor: só frontmatters de skills/ (sem AGENTS.md)
  const skills = measureSkillsDir("skills");
  const seoBrainFm = frontmatterOf("skills/seo-brain/SKILL.md");
  const seoBrainTokens = countLines(seoBrainFm) * TOKENS_PER_LINE;
  console.log(JSON.stringify({
    mode: "post",
    skills_count: skills.count,
    skills_frontmatter_tokens: skills.tokens,
    seo-brain_skill_frontmatter_tokens: seoBrainTokens,
    total_session_start_tokens: skills.tokens,
    note: "Conservative: 12 tokens/line. AGENTS.md deleted; seo-brain SKILL.md body lazy-loaded."
  }, null, 2));
} else {
  console.error("Usage: measure-token-baseline.mjs --pre | --post");
  process.exit(2);
}
