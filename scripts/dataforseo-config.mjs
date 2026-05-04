#!/usr/bin/env node
// /dataforseo-config — server local efêmero pra capturar credenciais DataForSEO.
// Bind em 127.0.0.1 com porta aleatória, valida via /v3/appendix/user_data
// (gratuito), grava .env.local com upsert (preserva outras vars), encerra.
//
// Uso: node scripts/dataforseo-config.mjs
//   ou: node ../../scripts/dataforseo-config.mjs (de dentro de projects/<nome>/)

import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { validateCredentials } from "./dataforseo-client.mjs";
import { requireProjectRoot } from "./lib/project-root.mjs";

const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutos
const PROJECT_ROOT = requireProjectRoot();
const ENV_PATH = join(PROJECT_ROOT, ".env.local");

const HTML_FORM = (errorMsg = "") => `<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DataForSEO — configuração</title>
<style>
  * { box-sizing: border-box; }
  body {
    font: 16px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    max-width: 540px;
    margin: 4rem auto;
    padding: 0 1.5rem;
    color: #111;
    background: #fafafa;
  }
  h1 { font-size: 1.5rem; margin: 0 0 .5rem; }
  p.lede { color: #555; margin: 0 0 2rem; }
  form { background: #fff; padding: 1.5rem; border: 1px solid #e5e5e5; border-radius: 8px; }
  label { display: block; font-weight: 600; margin: 0 0 .35rem; font-size: .9rem; }
  input { width: 100%; padding: .65rem .75rem; border: 1px solid #ccc; border-radius: 6px; font-size: 1rem; font-family: ui-monospace, "SF Mono", Menlo, monospace; }
  input:focus { outline: 2px solid #0066ff33; border-color: #0066ff; }
  .field { margin-bottom: 1.25rem; }
  .hint { font-size: .82rem; color: #666; margin: .35rem 0 0; }
  button { background: #111; color: #fff; border: 0; padding: .8rem 1.25rem; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer; width: 100%; }
  button:hover { background: #000; }
  .warn { background: #fff8e1; border: 1px solid #f0d264; padding: .85rem 1rem; border-radius: 6px; font-size: .9rem; margin: 0 0 1.25rem; }
  .err { background: #ffe8e8; border: 1px solid #f0a0a0; padding: .85rem 1rem; border-radius: 6px; font-size: .9rem; margin: 0 0 1.25rem; color: #a01010; }
  a { color: #0066ff; }
</style>
</head>
<body>
<h1>DataForSEO — configurar credenciais</h1>
<p class="lede">Cole API Login e API Password (não confunda com email/senha de login no site).</p>
${errorMsg ? `<div class="err">${errorMsg}</div>` : ""}
<form method="POST" action="/save">
  <div class="warn">
    <strong>Onde encontrar?</strong><br>
    Pegue em <a href="https://app.dataforseo.com/api-access" target="_blank" rel="noopener">app.dataforseo.com/api-access</a> (Dashboard → API Access).
    Se ainda não tem conta, <a href="https://app.dataforseo.com/register" target="_blank" rel="noopener">crie aqui</a> (Pay-as-you-go, sem assinatura).
  </div>
  <div class="field">
    <label for="login">API Login</label>
    <input id="login" name="login" type="text" required autocomplete="off" autofocus>
    <p class="hint">Formato típico: email cadastrado ou string alfanumérica.</p>
  </div>
  <div class="field">
    <label for="password">API Password</label>
    <input id="password" name="password" type="password" required autocomplete="off">
    <p class="hint">Aparece como "API Password" no Dashboard. Não é a senha do site.</p>
  </div>
  <button type="submit">Validar e salvar</button>
</form>
</body>
</html>`;

const HTML_SUCCESS = ({ balance }) => `<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="utf-8">
<title>DataForSEO — pronto</title>
<style>
  body { font: 16px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; max-width: 540px; margin: 4rem auto; padding: 0 1.5rem; color: #111; background: #fafafa; text-align: center; }
  h1 { font-size: 1.5rem; }
  .ok { background: #e8f7e8; border: 1px solid #8ed28e; padding: 1.5rem; border-radius: 8px; margin: 2rem 0; }
  .balance { font-size: 1.1rem; margin-top: .5rem; }
  code { background: #eee; padding: .15rem .4rem; border-radius: 4px; font-size: .9rem; }
</style>
</head>
<body>
<h1>Credenciais salvas</h1>
<div class="ok">
  <strong>OK!</strong> Validamos as credenciais com sucesso.
  ${balance != null ? `<div class="balance">Saldo atual: <strong>$${Number(balance).toFixed(2)} USD</strong></div>` : ""}
</div>
<p>Pode fechar esta aba. Próximo passo no terminal: rodar <code>/rank-tracker add "sua keyword"</code>.</p>
<script>setTimeout(() => window.close(), 1500);</script>
</body>
</html>`;

function parseBody(req) {
  return new Promise((resolveBody, reject) => {
    const chunks = [];
    req.on("data", c => chunks.push(c));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      const params = new URLSearchParams(raw);
      resolveBody({
        login: params.get("login")?.trim() ?? "",
        password: params.get("password")?.trim() ?? "",
      });
    });
    req.on("error", reject);
  });
}

function upsertEnvVar(envPath, updates) {
  let lines = [];
  if (existsSync(envPath)) {
    lines = readFileSync(envPath, "utf8").split("\n");
  }
  const seen = new Set();
  const out = lines.map(line => {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=/);
    if (m && updates[m[1]] !== undefined) {
      seen.add(m[1]);
      return `${m[1]}=${updates[m[1]]}`;
    }
    return line;
  });
  // remove trailing empty lines antes de adicionar novas vars
  while (out.length && out[out.length - 1] === "") out.pop();
  for (const [key, value] of Object.entries(updates)) {
    if (!seen.has(key)) out.push(`${key}=${value}`);
  }
  writeFileSync(envPath, out.join("\n") + "\n", "utf8");
}

function openBrowser(url) {
  const platform = process.platform;
  const cmd = platform === "darwin" ? "open" : platform === "win32" ? "start" : "xdg-open";
  try {
    spawn(cmd, [url], { detached: true, stdio: "ignore" }).unref();
    return true;
  } catch {
    return false;
  }
}

async function handleSave(req, res) {
  const { login, password } = await parseBody(req);
  if (!login || !password) {
    res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    res.end(HTML_FORM("Login e password são obrigatórios."));
    return null;
  }

  const result = await validateCredentials({ login, password });
  if (!result.ok) {
    const msg = result.hint ?? `Erro ao validar: ${result.error}`;
    res.writeHead(401, { "Content-Type": "text/html; charset=utf-8" });
    res.end(HTML_FORM(msg));
    return null;
  }

  upsertEnvVar(ENV_PATH, {
    DATAFORSEO_LOGIN: login,
    DATAFORSEO_PASSWORD: password,
  });

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(HTML_SUCCESS({ balance: result.balance }));
  return { balance: result.balance };
}

async function main() {
  const server = createServer(async (req, res) => {
    try {
      if (req.method === "GET" && req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(HTML_FORM());
        return;
      }
      if (req.method === "POST" && req.url === "/save") {
        const saved = await handleSave(req, res);
        if (saved) {
          console.log(`\n✅ Credenciais salvas em ${ENV_PATH}`);
          if (saved.balance != null) console.log(`   Saldo DataForSEO: $${Number(saved.balance).toFixed(2)} USD`);
          console.log(`\nPróximo passo: /rank-tracker add "sua keyword"`);
          setTimeout(() => {
            server.close(() => process.exit(0));
          }, 2000);
        }
        return;
      }
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
    } catch (err) {
      console.error("[dataforseo-config] erro:", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Erro interno: " + err.message);
    }
  });

  await new Promise(r => server.listen(0, "127.0.0.1", r));
  const port = server.address().port;
  const url = `http://127.0.0.1:${port}`;

  console.log(`\n[dataforseo-config] servindo em ${url}`);
  console.log(`[dataforseo-config] gravará em ${ENV_PATH}`);
  console.log(`[dataforseo-config] timeout de 5 min`);

  if (openBrowser(url)) {
    console.log(`[dataforseo-config] navegador aberto automaticamente`);
  } else {
    console.log(`[dataforseo-config] abra manualmente: ${url}`);
  }

  const timeoutHandle = setTimeout(() => {
    console.error(`\n[dataforseo-config] timeout ${TIMEOUT_MS / 1000}s — encerrando sem salvar`);
    server.close(() => process.exit(1));
  }, TIMEOUT_MS);
  timeoutHandle.unref();
}

main().catch(err => {
  console.error("[dataforseo-config] fatal:", err);
  process.exit(1);
});
