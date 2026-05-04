#!/usr/bin/env node
// bootstrap — DEPRECATED.
// O bootstrap antigo clonava o repo todo e cortava o cordão umbilical.
// O novo modelo multi-projeto vive dentro do framework via `npm run new`.
// Bootstrap standalone (init em pasta arbitrária) será reintroduzido em v2.

console.error("");
console.error("⚠️  `seobrain bootstrap` foi removido.");
console.error("");
console.error("   Novo modelo multi-projeto:");
console.error("     1. git clone https://github.com/diegoivo/seobrain.git");
console.error("     2. cd seobrain && npm install");
console.error("     3. npm run new <nome>");
console.error("     4. cd projects/<nome>");
console.error("");
console.error("   Cada projeto fica em projects/<nome>/ (git-ignored).");
console.error("   Pode virar repo próprio do cliente: git init dentro da pasta.");
console.error("");
process.exit(1);
