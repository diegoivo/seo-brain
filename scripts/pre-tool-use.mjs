#!/usr/bin/env node
// PreToolUse hook — diferencia mudanças auto vs com confirmação.
// Lê o input JSON do hook via stdin, decide aprovar ou pedir confirmação.
// Nunca bloqueia (exit 0 sempre). Falhas silenciosas para não poluir log.

import { readFileSync } from "node:fs";

const AUTO_PATHS = [
  /^brain\//,
  /^content\/.*\/_template\.md$/,
  /^content\/(posts|site)\/.*\.md$/,
  /^plans\//,
  /^\.cache\//,
];

const CONFIRM_PATHS = [
  /^package\.json$/,
  /^package-lock\.json$/,
  /^pnpm-lock\.yaml$/,
  /migrations?\//,
  /^web\/payload\.config\./,
  /^\.github\//,
  /^\.claude\/settings\.json$/,
];

(async function main() {
  let input = "";
  try {
    // Lê stdin se houver. Fallback silencioso.
    input = readFileSync(0, "utf8");
  } catch {
    return;
  }

  if (!input || !input.trim()) return;

  let payload;
  try {
    payload = JSON.parse(input);
  } catch {
    return;
  }

  const filePath = payload?.tool_input?.file_path ?? payload?.tool_input?.path ?? "";
  if (!filePath) return;

  const rel = filePath.replace(process.cwd() + "/", "");

  if (CONFIRM_PATHS.some(rx => rx.test(rel))) {
    console.error(`⚠️  Mudança em path crítico (${rel}). Confirme com o usuário antes de prosseguir.`);
  }
})().catch(() => {
  // Nunca bloquear o tool use por falha do hook.
}).finally(() => {
  process.exit(0);
});
