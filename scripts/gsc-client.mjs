#!/usr/bin/env node
// Google Search Console shared client — OAuth2 + token refresh + erro handling.
// Skills /gsc-google-search-console-setup (gera refresh_token), /gsc-google-search-console-performance, /gsc-google-search-console-coverage usam.
// Falha cedo com mensagem acionável se credenciais ausentes ou inválidas.

import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"];
const REDIRECT_URI_BASE = "http://localhost"; // porta resolvida em runtime

export class GSCError extends Error {
  constructor(message, { status, code, details } = {}) {
    super(message);
    this.name = "GSCError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Carrega credenciais do .env.local. Aborta cedo se ausentes.
// `requireRefreshToken: false` permite /gsc-google-search-console-setup chamar sem refresh ainda.
export function loadCredentials({ requireRefreshToken = true } = {}) {
  const clientId = process.env.GSC_CLIENT_ID;
  const clientSecret = process.env.GSC_CLIENT_SECRET;
  const refreshToken = process.env.GSC_REFRESH_TOKEN;
  const property = process.env.GSC_PROPERTY;

  if (!clientId || !clientSecret) {
    throw new GSCError(setupHint("GSC_CLIENT_ID + GSC_CLIENT_SECRET ausentes"), { status: 0 });
  }
  if (requireRefreshToken && !refreshToken) {
    throw new GSCError(setupHint("GSC_REFRESH_TOKEN ausente"), { status: 0 });
  }
  if (requireRefreshToken && !property) {
    throw new GSCError(setupHint("GSC_PROPERTY ausente"), { status: 0 });
  }

  return { clientId, clientSecret, refreshToken, property };
}

function setupHint(reason) {
  return [
    `❌ Google Search Console não configurado (${reason}).`,
    "",
    "Rode a skill /gsc-google-search-console-setup pra configurar OAuth de forma guiada.",
    "Ela abre URLs no Chrome e te conduz pelo Google Cloud Console.",
    "",
    "Custo: GRÁTIS (API do Google, quota 1.200 req/min).",
  ].join("\n");
}

// Cria OAuth2Client autenticado e pronto pra uso. Token refresh é
// automático via biblioteca googleapis (graças ao refresh_token).
export function createOAuthClient({ clientId, clientSecret, refreshToken, redirectUri }) {
  const client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri ?? "urn:ietf:wg:oauth:2.0:oob"
  );
  if (refreshToken) {
    client.setCredentials({ refresh_token: refreshToken });
  }
  return client;
}

// Cliente Search Console v1 já autenticado. Use isso nas skills.
export function createSearchConsoleClient(auth) {
  return google.searchconsole({ version: "v1", auth });
}

// URL de consent pra fluxo OAuth. /gsc-google-search-console-setup constrói com redirect_uri local.
export function buildConsentUrl(client) {
  return client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent", // força refresh_token mesmo se já consentiu antes
  });
}

// Troca authorization code por tokens (incluindo refresh_token).
export async function exchangeCodeForTokens(client, code) {
  try {
    const { tokens } = await client.getToken(code);
    if (!tokens.refresh_token) {
      throw new GSCError(
        "Google não retornou refresh_token. Revogue acesso em https://myaccount.google.com/permissions e tente de novo (precisamos prompt=consent).",
        { status: 0 }
      );
    }
    return tokens;
  } catch (err) {
    if (err instanceof GSCError) throw err;
    throw new GSCError(`Falha ao trocar code por tokens: ${err.message}`, { status: err.code ?? 0, details: err.response?.data });
  }
}

// Wrapper amigável pra chamadas de API. Converte erros do googleapis em
// GSCError com mensagens acionáveis.
export async function callGSC(fn) {
  try {
    return await fn();
  } catch (err) {
    throw normalizeError(err);
  }
}

function normalizeError(err) {
  const status = err.code ?? err.status ?? err.response?.status ?? 0;
  const apiCode = err.errors?.[0]?.reason ?? err.response?.data?.error?.status;
  const baseMsg = err.message ?? "Erro desconhecido";

  if (status === 401 || apiCode === "invalid_grant") {
    return new GSCError(
      "❌ Token GSC inválido ou expirado.\n\n" +
        "Possíveis causas:\n" +
        "  • Refresh token revogado em https://myaccount.google.com/permissions\n" +
        "  • OAuth client deletado no Google Cloud Console\n" +
        "  • Conta sem acesso à property\n\n" +
        "Solução: rode /gsc-google-search-console-setup novamente.",
      { status, code: apiCode, details: err.response?.data }
    );
  }

  if (status === 403) {
    return new GSCError(
      "❌ Sem permissão pra acessar essa property.\n\n" +
        "Verifique em https://search.google.com/search-console/users\n" +
        "que a conta Google usada no /gsc-google-search-console-setup tem acesso à property.\n\n" +
        `Detalhes: ${baseMsg}`,
      { status, code: apiCode, details: err.response?.data }
    );
  }

  if (status === 429) {
    return new GSCError(
      "❌ Rate limit excedido (1.200 req/min/projeto).\n" +
        "Aguarde 60s e tente de novo.",
      { status, code: apiCode }
    );
  }

  if (status === 400) {
    return new GSCError(
      `❌ Requisição inválida: ${baseMsg}\n\n` +
        "Causa comum: GSC_PROPERTY com formato errado.\n" +
        "Use uma das formas:\n" +
        "  • URL-prefix:  https://exemplo.com.br/  (com barra final)\n" +
        "  • Domain:      sc-domain:exemplo.com.br",
      { status, code: apiCode, details: err.response?.data }
    );
  }

  return new GSCError(`❌ GSC API erro (${status}): ${baseMsg}`, { status, code: apiCode, details: err.response?.data });
}

// Lista properties acessíveis. Usado em /gsc-google-search-console-setup pra escolha + validação.
export async function listProperties(auth) {
  const sc = createSearchConsoleClient(auth);
  const res = await callGSC(() => sc.sites.list());
  return (res.data.siteEntry ?? []).map((s) => ({
    siteUrl: s.siteUrl,
    permissionLevel: s.permissionLevel,
  }));
}

// Validação leve de formato pra GSC_PROPERTY. URL-prefix exige barra final.
export function validatePropertyFormat(property) {
  if (!property) return { valid: false, reason: "vazio" };
  if (property.startsWith("sc-domain:")) {
    if (property.length <= "sc-domain:".length) return { valid: false, reason: "sc-domain: sem domínio" };
    return { valid: true, type: "domain" };
  }
  if (/^https?:\/\//.test(property)) {
    if (!property.endsWith("/")) return { valid: false, reason: "URL-prefix exige barra final" };
    return { valid: true, type: "url-prefix" };
  }
  return { valid: false, reason: "formato desconhecido (use https://... ou sc-domain:...)" };
}

// Helpers de data pra ranges padrão das skills.
export function dateRangeDays(days) {
  // GSC tem 2-3d de delay. Termina em ontem-2 pra evitar dados parciais.
  const end = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

export const _internal = {
  SCOPES,
  REDIRECT_URI_BASE,
  normalizeError,
  setupHint,
};
