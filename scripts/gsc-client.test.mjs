// Testes mock pra gsc-client. Não chama API real — só valida lógica
// de auth, parsing de erros, validação de property.

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  GSCError,
  loadCredentials,
  validatePropertyFormat,
  dateRangeDays,
  _internal,
} from "./gsc-client.mjs";

test("loadCredentials: aborta sem GSC_CLIENT_ID", () => {
  delete process.env.GSC_CLIENT_ID;
  delete process.env.GSC_CLIENT_SECRET;
  delete process.env.GSC_REFRESH_TOKEN;
  delete process.env.GSC_PROPERTY;
  assert.throws(() => loadCredentials(), (err) => {
    return err instanceof GSCError && err.message.includes("GSC_CLIENT_ID");
  });
});

test("loadCredentials: aborta sem refresh_token quando required", () => {
  process.env.GSC_CLIENT_ID = "fake.apps.googleusercontent.com";
  process.env.GSC_CLIENT_SECRET = "fake-secret";
  delete process.env.GSC_REFRESH_TOKEN;
  delete process.env.GSC_PROPERTY;
  assert.throws(() => loadCredentials(), (err) => err.message.includes("GSC_REFRESH_TOKEN"));
});

test("loadCredentials: aceita sem refresh_token quando requireRefreshToken=false", () => {
  process.env.GSC_CLIENT_ID = "fake.apps.googleusercontent.com";
  process.env.GSC_CLIENT_SECRET = "fake-secret";
  delete process.env.GSC_REFRESH_TOKEN;
  delete process.env.GSC_PROPERTY;
  const creds = loadCredentials({ requireRefreshToken: false });
  assert.equal(creds.clientId, "fake.apps.googleusercontent.com");
  assert.equal(creds.refreshToken, undefined);
});

test("loadCredentials: retorna credenciais completas quando tudo presente", () => {
  process.env.GSC_CLIENT_ID = "fake.apps.googleusercontent.com";
  process.env.GSC_CLIENT_SECRET = "fake-secret";
  process.env.GSC_REFRESH_TOKEN = "1//fake-refresh-token";
  process.env.GSC_PROPERTY = "https://exemplo.com.br/";
  const creds = loadCredentials();
  assert.equal(creds.property, "https://exemplo.com.br/");
});

test("validatePropertyFormat: URL-prefix válido", () => {
  const r = validatePropertyFormat("https://exemplo.com.br/");
  assert.equal(r.valid, true);
  assert.equal(r.type, "url-prefix");
});

test("validatePropertyFormat: URL-prefix sem barra final é inválido", () => {
  const r = validatePropertyFormat("https://exemplo.com.br");
  assert.equal(r.valid, false);
  assert.match(r.reason, /barra final/);
});

test("validatePropertyFormat: sc-domain válido", () => {
  const r = validatePropertyFormat("sc-domain:exemplo.com.br");
  assert.equal(r.valid, true);
  assert.equal(r.type, "domain");
});

test("validatePropertyFormat: sc-domain vazio é inválido", () => {
  const r = validatePropertyFormat("sc-domain:");
  assert.equal(r.valid, false);
});

test("validatePropertyFormat: formato desconhecido é inválido", () => {
  const r = validatePropertyFormat("exemplo.com.br");
  assert.equal(r.valid, false);
});

test("validatePropertyFormat: vazio é inválido", () => {
  const r = validatePropertyFormat("");
  assert.equal(r.valid, false);
});

test("dateRangeDays: gera range correto com delay 2d", () => {
  const r = dateRangeDays(90);
  assert.match(r.startDate, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(r.endDate, /^\d{4}-\d{2}-\d{2}$/);
  const start = new Date(r.startDate);
  const end = new Date(r.endDate);
  const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
  assert.equal(diffDays, 90);
  // endDate deve ser ~hoje-2d
  const expectedEnd = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  assert.equal(r.endDate, expectedEnd);
});

test("normalizeError: 401 vira mensagem acionável", () => {
  const err = _internal.normalizeError({ code: 401, message: "invalid auth" });
  assert.match(err.message, /Token GSC inválido/);
  assert.match(err.message, /\/gsc-google-search-console/);
});

test("normalizeError: 403 menciona Settings → Users", () => {
  const err = _internal.normalizeError({ code: 403, message: "forbidden" });
  assert.match(err.message, /search-console\/users/);
});

test("normalizeError: 429 fala de rate limit", () => {
  const err = _internal.normalizeError({ code: 429, message: "too many" });
  assert.match(err.message, /rate limit/i);
});

test("normalizeError: 400 dá hint de formato de property", () => {
  const err = _internal.normalizeError({ code: 400, message: "bad request" });
  assert.match(err.message, /sc-domain/);
  assert.match(err.message, /barra final/);
});

test("normalizeError: invalid_grant é tratado como 401-equivalente", () => {
  const err = _internal.normalizeError({
    code: 400,
    message: "invalid_grant",
    errors: [{ reason: "invalid_grant" }],
  });
  assert.match(err.message, /Token GSC inválido/);
});
