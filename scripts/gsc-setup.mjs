#!/usr/bin/env node
// /gsc-google-search-console-setup — fluxo OAuth guiado pra Google Search Console.
// BYO credentials: cliente cria projeto Google Cloud + OAuth client próprio.
// Abre URLs no Chrome real do usuário e instrui passo a passo.
// Captura refresh_token via callback localhost.
//
// Uso:
//   node scripts/gsc-setup.mjs           # interativo
//   node scripts/gsc-setup.mjs --force   # sobrescreve config existente

import { createServer } from "node:http";
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, chmodSync } from "node:fs";
import { join, basename, resolve, dirname } from "node:path";
import { argv, exit, cwd, stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import getPort from "get-port";
import { google } from "googleapis";
import {
  GSCError,
  createOAuthClient,
  buildConsentUrl,
  exchangeCodeForTokens,
  listProperties,
  validatePropertyFormat,
} from "./gsc-client.mjs";
import { resolveFrameworkRoot, resolveProjectRoot } from "./lib/project-root.mjs";

const FORCE = argv.includes("--force");
const CALLBACK_TIMEOUT_MS = 10 * 60 * 1000; // 10min

async function main() {
  const projectRoot = resolveProjectRoot();
  if (!projectRoot) {
    console.error("");
    console.error("❌ /gsc-google-search-console-setup precisa rodar dentro de um projeto SEO Brain.");
    console.error("");
    console.error("   Opções:");
    console.error("     • cd projects/<nome>  (se já existe)");
    console.error("     • npm run new <nome>  (criar novo, na raiz do framework)");
    console.error("");
    exit(2);
  }

  const frameworkRoot =
    resolveFrameworkRoot() ?? resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const envPath = join(frameworkRoot, ".env.local");
  const projectName = basename(projectRoot);

  console.log("");
  console.log("🔧 GSC Setup — Google Search Console OAuth");
  console.log("");
  console.log(`   Projeto:   ${projectName}`);
  console.log(`   Framework: ${frameworkRoot}`);
  console.log(`   .env.local: ${envPath}`);
  console.log("");

  // Carrega .env.local atual (se existe).
  const env = loadEnvFile(envPath);
  if (env.GSC_REFRESH_TOKEN && !FORCE) {
    console.log("✅ GSC já configurado.");
    console.log(`   Property atual: ${env.GSC_PROPERTY ?? "(não definida)"}`);
    console.log("");
    console.log("   Reconfigurar? Use: node scripts/gsc-setup.mjs --force");
    console.log("   Ou rode /gsc-google-search-console-performance ou /gsc-google-search-console-coverage diretamente.");
    exit(0);
  }

  const rl = createInterface({ input: stdin, output: stdout });
  const ask = async (q) => (await rl.question(q)).trim();

  try {
    // Passo 0: aviso geral.
    console.log("Vou te conduzir pelo Google Cloud Console (~5min na primeira vez).");
    console.log("Vou abrir URLs no seu Chrome. Você clica/preenche o que precisar.");
    console.log("Sua sessão Google já está logada lá, então vai ser rápido.");
    console.log("");
    await ask("Pressione Enter pra começar... ");

    // === Passo 1: criar projeto GCP ===
    console.log("");
    console.log("─── Passo 1/5: criar projeto Google Cloud ───");
    console.log("");
    openUrl("https://console.cloud.google.com/projectcreate");
    console.log("Abri https://console.cloud.google.com/projectcreate");
    console.log("");
    console.log("No formulário:");
    console.log(`  • Project name:  seobrain-${projectName}`);
    console.log("  • Location:      No organization (default)");
    console.log("  • Clique CREATE e aguarde ~30s.");
    console.log("");
    const projectId =
      (await ask("Cole aqui o Project ID (ex: seobrain-cliente-123456) ou Enter pra pular: ")) ||
      "";

    // === Passo 2: habilitar API ===
    console.log("");
    console.log("─── Passo 2/5: habilitar Search Console API ───");
    console.log("");
    const apiUrl =
      "https://console.cloud.google.com/apis/library/searchconsole.googleapis.com" +
      (projectId ? `?project=${encodeURIComponent(projectId)}` : "");
    openUrl(apiUrl);
    console.log("Abri o catálogo de APIs.");
    console.log("");
    console.log("  • Clique ENABLE (botão azul)");
    console.log("  • Aguarde ~10s até aparecer 'API enabled'");
    console.log("");
    await ask("Digite 'ok' quando concluir: ");

    // === Passo 3: consent screen ===
    console.log("");
    console.log("─── Passo 3/5: configurar OAuth Consent Screen ───");
    console.log("");
    const consentUrl =
      "https://console.cloud.google.com/apis/credentials/consent" +
      (projectId ? `?project=${encodeURIComponent(projectId)}` : "");
    openUrl(consentUrl);
    console.log("Abri OAuth consent screen.");
    console.log("");
    console.log("  1. User Type: External → CREATE");
    console.log("  2. Preencha App name, User support email, Developer contact");
    console.log("     (App name sugerido: 'SEO Brain " + projectName + "')");
    console.log("  3. SAVE AND CONTINUE 3x (pula Scopes e Test users por enquanto)");
    console.log("  4. BACK TO DASHBOARD");
    console.log("");
    console.log("  5. Agora adicione você como Test User:");
    console.log("     • Na tela do dashboard, role até 'Test users'");
    console.log("     • ADD USERS → cole seu email Google → SAVE");
    console.log("");
    console.log("     (Sem isso o consent vai falhar com 'access_denied')");
    console.log("");
    await ask("Digite 'ok' quando concluir: ");

    // === Passo 4: criar OAuth client ===
    console.log("");
    console.log("─── Passo 4/5: criar OAuth Client ID ───");
    console.log("");
    const credsUrl =
      "https://console.cloud.google.com/apis/credentials" +
      (projectId ? `?project=${encodeURIComponent(projectId)}` : "");
    openUrl(credsUrl);
    console.log("Abri Credentials.");
    console.log("");
    console.log("  1. CREATE CREDENTIALS → OAuth client ID");
    console.log("  2. Application type: Desktop app");
    console.log("  3. Name: seobrain-cli");
    console.log("  4. CREATE");
    console.log("");
    console.log("Vai aparecer modal com Client ID e Client secret.");
    console.log("");

    let clientId = "";
    while (!clientId) {
      clientId = (await ask("Cole o Client ID: ")).trim();
      if (!clientId.includes("apps.googleusercontent.com")) {
        console.log("⚠️  Formato esperado: 123456-abc.apps.googleusercontent.com");
        console.log("    Tente de novo.");
        clientId = "";
      }
    }
    let clientSecret = "";
    while (!clientSecret) {
      clientSecret = (await ask("Cole o Client secret: ")).trim();
      if (!clientSecret.startsWith("GOCSPX-")) {
        console.log("⚠️  Formato esperado: GOCSPX-...");
        console.log("    Confirme se copiou o valor certo. Pra continuar mesmo assim, cole de novo.");
        const confirm = await ask("    Continuar com este valor? [s/N]: ");
        if (confirm.toLowerCase() !== "s") {
          clientSecret = "";
        }
      }
    }

    // === Passo 5: consent + callback ===
    console.log("");
    console.log("─── Passo 5/5: autorizar acesso ao GSC ───");
    console.log("");

    const port = await getPort({ port: [8080, 8081, 8082, 8083, 8084, 8085, 8086, 8087, 8088, 8089] });
    const redirectUri = `http://localhost:${port}`;
    console.log(`[gsc-setup] callback server em ${redirectUri}`);

    const oauthClient = createOAuthClient({ clientId, clientSecret, redirectUri });
    const authUrl = buildConsentUrl(oauthClient);

    const codePromise = waitForCallback(port);

    console.log("");
    console.log("Vou abrir a tela de consent do Google. Você vai ver:");
    console.log("");
    console.log("  • 'Google hasn't verified this app'");
    console.log("    → Clique 'Advanced' → 'Go to seobrain (unsafe)'");
    console.log("    → É seu próprio app, é seguro. Só não foi verificado pelo Google.");
    console.log("");
    console.log("  • Tela de permissões (Search Console read-only)");
    console.log("    → Clique 'Continue'");
    console.log("");
    console.log("  • Vai redirecionar pra " + redirectUri);
    console.log("    → Página vai mostrar '✅ Autenticado, pode fechar essa aba'");
    console.log("");
    openUrl(authUrl);
    console.log("Aguardando callback (timeout 10min)...");
    console.log("");

    const code = await codePromise;
    console.log("[gsc-setup] code recebido, trocando por refresh_token...");

    const tokens = await exchangeCodeForTokens(oauthClient, code);
    oauthClient.setCredentials(tokens);

    // Pega email do user pra logar.
    let userEmail = null;
    try {
      const oauth2 = google.oauth2({ version: "v2", auth: oauthClient });
      const info = await oauth2.userinfo.get();
      userEmail = info.data.email ?? null;
    } catch {
      // não bloqueia se falhar
    }

    if (userEmail) {
      console.log(`[gsc-setup] autenticado como ${userEmail}`);
    }

    // === Listar properties + escolher ===
    console.log("");
    console.log("Buscando properties acessíveis...");
    const properties = await listProperties(oauthClient);
    if (properties.length === 0) {
      console.error("");
      console.error("❌ Nenhuma property encontrada nesta conta Google.");
      console.error("");
      console.error("   Adicione uma property em https://search.google.com/search-console");
      console.error("   e verifique propriedade (DNS, HTML tag, ou Google Analytics).");
      console.error("");
      console.error("   Depois rode /gsc-google-search-console-setup --force.");
      exit(1);
    }

    console.log("");
    console.log("Properties acessíveis:");
    console.log("");
    properties.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.siteUrl.padEnd(50)} (${p.permissionLevel})`);
    });
    console.log("");

    let chosen = null;
    while (!chosen) {
      const answer = await ask(`Qual usar pra ${projectName}? Digite o número [1-${properties.length}]: `);
      const idx = parseInt(answer, 10);
      if (Number.isInteger(idx) && idx >= 1 && idx <= properties.length) {
        chosen = properties[idx - 1];
      } else {
        console.log("Número inválido. Tente de novo.");
      }
    }

    const validation = validatePropertyFormat(chosen.siteUrl);
    if (!validation.valid) {
      console.error(`⚠️  Property tem formato inesperado: ${validation.reason}`);
      console.error("    Continuando mesmo assim — ajuste manualmente em .env.local se der erro.");
    }

    // === Persistência ===
    console.log("");
    console.log("Salvando credenciais...");

    const newEnv = {
      ...env,
      GSC_CLIENT_ID: clientId,
      GSC_CLIENT_SECRET: clientSecret,
      GSC_REFRESH_TOKEN: tokens.refresh_token,
      GSC_PROPERTY: chosen.siteUrl,
    };
    writeEnvFile(envPath, newEnv);
    chmodSync(envPath, 0o600);

    updateBrainConfig(projectRoot, {
      property: chosen.siteUrl,
      userEmail,
      permissionLevel: chosen.permissionLevel,
    });

    console.log("");
    console.log("✅ Google Search Console configurado.");
    console.log("");
    console.log(`   Property:           ${chosen.siteUrl}`);
    console.log(`   Conta Google:       ${userEmail ?? "(desconhecida)"}`);
    console.log(`   Permissão:          ${chosen.permissionLevel}`);
    console.log(`   .env.local:         ${envPath}`);
    console.log(`   Brain config:       ${join(projectRoot, "brain/config.md")}`);
    console.log("");
    console.log("Próximos passos:");
    console.log("   /gsc-google-search-console-performance       # top queries dos últimos 90 dias");
    console.log("   /gsc-google-search-console-coverage          # status de sitemaps + erros de indexação");
    console.log("");
    console.log("Custo: GRÁTIS (quota 1.200 req/min/projeto).");
    console.log("Token refresh é automático.");
    console.log("");
  } catch (err) {
    console.error("");
    if (err instanceof GSCError) {
      console.error(err.message);
    } else {
      console.error(`❌ Erro inesperado: ${err.message}`);
      if (process.env.DEBUG) console.error(err.stack);
    }
    console.error("");
    exit(1);
  } finally {
    rl.close();
  }
}

function openUrl(url) {
  const r = spawnSync("open", ["-a", "Google Chrome", url], { stdio: "ignore" });
  if (r.status !== 0) {
    console.log(`(falha ao abrir Chrome — abra manualmente: ${url})`);
  }
}

function waitForCallback(port) {
  return new Promise((resolveP, rejectP) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url, `http://localhost:${port}`);
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      if (error) {
        res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`<h1>Erro: ${error}</h1><p>Volte ao terminal.</p>`);
        cleanup();
        rejectP(new GSCError(`Consent negado: ${error}`, { status: 0 }));
        return;
      }

      if (!code) {
        res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
        res.end("<h1>Sem code no callback</h1>");
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(
        `<!doctype html><meta charset="utf-8">
<title>SEO Brain — autenticado</title>
<style>body{font:16px system-ui;padding:40px;max-width:540px;margin:auto;color:#222}</style>
<h1>✅ Autenticado</h1>
<p>Pode fechar essa aba e voltar pro terminal.</p>`
      );
      cleanup();
      resolveP(code);
    });

    const timer = setTimeout(() => {
      cleanup();
      rejectP(new GSCError("Timeout aguardando callback (10min). Rode /gsc-google-search-console-setup de novo.", { status: 0 }));
    }, CALLBACK_TIMEOUT_MS);

    function cleanup() {
      clearTimeout(timer);
      server.close();
    }

    server.listen(port);
  });
}

function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  const raw = readFileSync(path, "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    // Strip surrounding quotes se houver.
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function writeEnvFile(path, env) {
  // Preserva comentários do arquivo original quando possível.
  const existing = existsSync(path) ? readFileSync(path, "utf8") : "";
  const lines = existing.split("\n");
  const handled = new Set();
  const newLines = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      newLines.push(line);
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      newLines.push(line);
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    if (key in env) {
      newLines.push(`${key}=${quoteIfNeeded(env[key] ?? "")}`);
      handled.add(key);
    } else {
      newLines.push(line);
    }
  }

  // Adiciona keys novas no final.
  const newKeys = Object.keys(env).filter((k) => !handled.has(k));
  if (newKeys.length > 0) {
    if (newLines.length > 0 && newLines[newLines.length - 1].trim() !== "") {
      newLines.push("");
    }
    for (const key of newKeys) {
      newLines.push(`${key}=${quoteIfNeeded(env[key] ?? "")}`);
    }
  }

  writeFileSync(path, newLines.join("\n"), "utf8");
}

function quoteIfNeeded(value) {
  if (value === "" || /^[A-Za-z0-9_./:@\-]+$/.test(value)) return value;
  return `"${value.replace(/"/g, '\\"')}"`;
}

function updateBrainConfig(projectRoot, { property, userEmail, permissionLevel }) {
  const configPath = join(projectRoot, "brain/config.md");
  if (!existsSync(configPath)) {
    console.log(`[gsc-setup] brain/config.md não encontrado em ${configPath} — pulando atualização do Brain.`);
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const block = [
    "## Google Search Console",
    "",
    `- **Property:** ${property}`,
    `- **Conta Google:** ${userEmail ?? "(desconhecida)"}`,
    `- **Permissão:** ${permissionLevel}`,
    `- **Configurado em:** ${today}`,
    "",
    "Skills disponíveis: `/gsc-google-search-console-performance`, `/gsc-google-search-console-coverage`",
    "",
  ].join("\n");

  let content = readFileSync(configPath, "utf8");
  const heading = "## Google Search Console";

  if (content.includes(heading)) {
    // Substitui seção existente até a próxima ## ou fim do arquivo.
    const re = new RegExp(`${heading}[\\s\\S]*?(?=\\n## |$)`, "m");
    content = content.replace(re, block);
  } else {
    // Adiciona no final.
    if (!content.endsWith("\n")) content += "\n";
    content += "\n" + block;
  }

  writeFileSync(configPath, content, "utf8");
  console.log(`[gsc-setup] brain/config.md atualizado.`);
}

main();
