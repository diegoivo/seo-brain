#!/usr/bin/env node
// Static matching eval. Para cada prompt de tests/prompts.jsonl,
// calcula score de match contra cada skill via overlap de palavras-chave
// description vs prompt (Jaccard simples sobre tokens).
//
// NÃO é verdadeiro LLM matching, mas serve como proxy:
// se o prompt esperado matchearia algo, o overlap deve ser maior pra skill correta.
//
// Output: tests/baseline-matching-{pre|post}.json + score agregado.

import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---/;
const STOPWORDS = new Set([
  "a", "o", "e", "de", "do", "da", "em", "no", "na", "para", "por", "com", "um", "uma", "os", "as",
  "the", "of", "in", "on", "to", "for", "with", "and", "or", "an", "is", "are", "use", "when",
  "este", "esta", "que", "se", "qual",
]);

function tokenize(s) {
  return s.toLowerCase()
    .replace(/[^\w\sáéíóúâêôãõç]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOPWORDS.has(t));
}

function descriptionOf(skillDir) {
  const path = join(skillDir, "SKILL.md");
  if (!existsSync(path)) return "";
  const content = readFileSync(path, "utf8");
  const m = content.match(FRONTMATTER_RE);
  if (!m) return "";
  const desc = m[1].match(/^description:\s*([\s\S]*?)(?:\n[a-z-]+:|$)/m);
  return desc ? desc[1].trim() : "";
}

function jaccard(a, b) {
  const A = new Set(a);
  const B = new Set(b);
  const inter = [...A].filter(x => B.has(x)).length;
  const union = new Set([...A, ...B]).size;
  return union === 0 ? 0 : inter / union;
}

const skillsDir = existsSync("skills") ? "skills" : ".claude/skills";
const skills = readdirSync(skillsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => ({
    name: d.name,
    description: descriptionOf(join(skillsDir, d.name)),
  }));

const prompts = readFileSync("tests/prompts.jsonl", "utf8")
  .split("\n").filter(Boolean).map(JSON.parse);

const results = prompts.map(p => {
  const promptTokens = tokenize(p.prompt);
  const ranked = skills.map(s => ({
    skill: s.name,
    score: jaccard(promptTokens, tokenize(s.description)),
  })).sort((a, b) => b.score - a.score);
  const top = ranked[0];
  const accepts = p.accepts || [p.expected_skill];
  const matchesAccept = (name) => accepts.some(a => name === a || name.includes(a));
  return {
    prompt: p.prompt,
    accepts,
    top_match: top.skill,
    top_score: top.score.toFixed(3),
    correct_top1: ranked.slice(0, 1).some(r => matchesAccept(r.skill)),
    correct_top3: ranked.slice(0, 3).some(r => matchesAccept(r.skill)),
    correct_top5: ranked.slice(0, 5).some(r => matchesAccept(r.skill)),
  };
});

const summary = {
  skills_dir: skillsDir,
  prompts_total: results.length,
  top1_correct: results.filter(r => r.correct_top1).length,
  top3_correct: results.filter(r => r.correct_top3).length,
  top5_correct: results.filter(r => r.correct_top5).length,
  top1_pct: ((results.filter(r => r.correct_top1).length / results.length) * 100).toFixed(1),
  top3_pct: ((results.filter(r => r.correct_top3).length / results.length) * 100).toFixed(1),
  top5_pct: ((results.filter(r => r.correct_top5).length / results.length) * 100).toFixed(1),
};

const mode = process.argv[2] === "--post" ? "post" : "pre";
const outFile = `tests/baseline-matching-${mode}.json`;
writeFileSync(outFile, JSON.stringify({ summary, results }, null, 2));

console.log(JSON.stringify(summary, null, 2));
console.log(`\nWritten: ${outFile}`);

if (process.argv.includes("--check-regression")) {
  const preFile = "tests/baseline-matching-pre.json";
  if (!existsSync(preFile)) {
    console.error("⚠️  No pre baseline found. Skip check.");
    process.exit(0);
  }
  const pre = JSON.parse(readFileSync(preFile, "utf8")).summary;
  const regression = parseFloat(pre.top3_pct) - parseFloat(summary.top3_pct);
  console.log(`\nRegression top3: ${regression.toFixed(1)}pp (pre ${pre.top3_pct}% → post ${summary.top3_pct}%)`);
  if (regression > 10) {
    console.error("❌ Regression >10pp. Block merge.");
    process.exit(1);
  }
  console.log("✓ Within 10pp threshold.");
}
