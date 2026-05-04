#!/usr/bin/env node
// Content Sync — pipeline unidirecional markdown → Payload (quando add-cms estiver ativo).
// Antes de Payload existir no projeto, este script é no-op + diagnóstico.
// Uso: node scripts/content-sync.mjs

import { existsSync } from "node:fs";
import { join } from "node:path";
import { requireProjectRoot } from "./lib/project-root.mjs";

const PROJECT_ROOT = requireProjectRoot();
const PAYLOAD_CONFIG = join(PROJECT_ROOT, "web/payload.config.ts");

if (!existsSync(PAYLOAD_CONFIG)) {
  console.log("ℹ️  Payload não detectado em web/payload.config.ts.");
  console.log("    O kit roda em modo estático por padrão.");
  console.log("    Rode a skill /website-cms quando o gatilho dispar (≥100 páginas/3 meses).");
  process.exit(0);
}

console.log("Payload detectado. Pipeline markdown → Payload ativo.");
console.log("(Implementação no-op até add-cms ser configurado.)");
// TODO: implementar quando add-cms rodar:
// 1. Ler content/posts/*.md e content/site/*.md
// 2. Para cada arquivo com status: published, criar/atualizar entry no Payload
// 3. Atualizar frontmatter com payloadId
