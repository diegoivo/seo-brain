#!/usr/bin/env node
// Helper não-interativo do /gsc-google-search-console (setup). Recebe client_id + secret,
// abre consent no browser, captura code via callback, troca por
// refresh_token, lista properties. Imprime JSON em stdout.
//
// Uso:
//   node scripts/gsc-auth-headless.mjs --client-id=X --client-secret=Y
//
// Output (stdout):
//   { refresh_token, user_email, properties: [...] }
//
// Logs vão pra stderr — não poluem o JSON do stdout.

import { createServer } from "node:http";
import { spawnSync } from "node:child_process";
import { argv, exit, stderr, stdout } from "node:process";
import getPort from "get-port";
import { google } from "googleapis";
import {
  createOAuthClient,
  buildConsentUrl,
  exchangeCodeForTokens,
  listProperties,
} from "./gsc-client.mjs";

const TIMEOUT_MS = 5 * 60 * 1000; // 5min

function parseArgs() {
  const args = {};
  for (const a of argv.slice(2)) {
    if (a.startsWith("--client-id=")) args.clientId = a.slice("--client-id=".length);
    else if (a.startsWith("--client-secret=")) args.clientSecret = a.slice("--client-secret=".length);
  }
  return args;
}

async function main() {
  const { clientId, clientSecret } = parseArgs();
  if (!clientId || !clientSecret) {
    stderr.write("Uso: node scripts/gsc-auth-headless.mjs --client-id=X --client-secret=Y\n");
    exit(2);
  }

  const port = await getPort({
    port: [8080, 8081, 8082, 8083, 8084, 8085, 8086, 8087, 8088, 8089],
  });
  const redirectUri = `http://localhost:${port}`;

  const oauthClient = createOAuthClient({ clientId, clientSecret, redirectUri });
  const authUrl = buildConsentUrl(oauthClient);

  stderr.write(`[gsc-auth] callback: ${redirectUri}\n`);
  stderr.write(`[gsc-auth] consent URL aberta no Chrome\n`);
  stderr.write(`[gsc-auth] aguardando você clicar em "Continue" (timeout 5min)...\n`);

  // Abre URL no Chrome.
  const r = spawnSync("open", ["-a", "Google Chrome", authUrl], { stdio: "ignore" });
  if (r.status !== 0) {
    stderr.write(`[gsc-auth] falha abrir Chrome — abra manualmente:\n${authUrl}\n`);
  }

  const code = await waitForCallback(port);
  stderr.write(`[gsc-auth] code recebido, trocando por refresh_token...\n`);

  const tokens = await exchangeCodeForTokens(oauthClient, code);
  oauthClient.setCredentials(tokens);

  let userEmail = null;
  try {
    const oauth2 = google.oauth2({ version: "v2", auth: oauthClient });
    const info = await oauth2.userinfo.get();
    userEmail = info.data.email ?? null;
  } catch {
    // ignora — não bloqueia
  }

  stderr.write(`[gsc-auth] autenticado como ${userEmail ?? "(desconhecido)"}\n`);
  stderr.write(`[gsc-auth] listando properties...\n`);

  const properties = await listProperties(oauthClient);

  stderr.write(`[gsc-auth] ${properties.length} properties encontradas\n`);

  stdout.write(
    JSON.stringify(
      {
        refresh_token: tokens.refresh_token,
        user_email: userEmail,
        properties,
      },
      null,
      2
    ) + "\n"
  );
}

function waitForCallback(port) {
  return new Promise((resolveP, rejectP) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url, `http://localhost:${port}`);
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");
      if (error) {
        res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`<h1>Erro: ${error}</h1>`);
        cleanup();
        rejectP(new Error(`Consent negado: ${error}`));
        return;
      }
      if (!code) {
        res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
        res.end("<h1>Sem code</h1>");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(
        `<!doctype html><meta charset="utf-8">
<title>SEO Brain — autenticado</title>
<style>body{font:16px system-ui;padding:40px;max-width:540px;margin:auto;color:#222}</style>
<h1>✅ Autenticado</h1>
<p>Pode fechar essa aba.</p>`
      );
      cleanup();
      resolveP(code);
    });

    const timer = setTimeout(() => {
      cleanup();
      rejectP(new Error("Timeout 5min aguardando callback"));
    }, TIMEOUT_MS);

    function cleanup() {
      clearTimeout(timer);
      server.close();
    }

    server.listen(port);
  });
}

main().catch((err) => {
  stderr.write(`❌ ${err.message}\n`);
  exit(1);
});
