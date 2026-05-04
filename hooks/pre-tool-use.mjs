#!/usr/bin/env node
// PreToolUse hook — diferencia mudanças auto vs com confirmação.
// Lê o input JSON do hook via stdin, decide aprovar ou pedir confirmação.
// Nunca bloqueia (exit 0 sempre). Falhas silenciosas para não poluir log.
//
// Cobre 2 categorias:
// 1. Write/Edit em paths críticos (package.json, migrations, settings, etc).
// 2. Bash com comandos de risco (git merge|push em main, rm -rf, etc).

import { readFileSync } from "node:fs";

const CONFIRM_PATHS = [
  /^package\.json$/,
  /^package-lock\.json$/,
  /^pnpm-lock\.yaml$/,
  /migrations?\//,
  /^web\/payload\.config\./,
  /^\.github\//,
  /^\.claude\/settings\.json$/,
  /^\.env(\.|$)/,
];

const DANGEROUS_BASH = [
  { regex: /\bgit\s+(merge|rebase)\b.*\b(main|master)\b/, label: "merge/rebase em main" },
  { regex: /\bgit\s+push\b[^&|;]*\b(main|master)\b/, label: "push direto em main" },
  { regex: /\bgit\s+push\b.*--force/, label: "force push" },
  { regex: /\bgit\s+reset\b.*--hard/, label: "git reset --hard" },
  { regex: /\brm\s+-rf?\s+(\/|~|\$HOME)/, label: "rm -rf em path crítico" },
  { regex: /\bvercel\s+(--prod|deploy.*--prod)/, label: "deploy direto a produção Vercel" },
];

(async function main() {
  let input = "";
  try {
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

  const toolName = payload?.tool_name ?? "";

  if (toolName === "Bash") {
    const command = payload?.tool_input?.command ?? "";
    if (!command) return;
    for (const { regex, label } of DANGEROUS_BASH) {
      if (regex.test(command)) {
        console.error(`⚠️  Comando de risco detectado (${label}). Confirme com o usuário antes de executar.`);
        return;
      }
    }
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
