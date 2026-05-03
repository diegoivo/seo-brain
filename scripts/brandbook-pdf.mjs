#!/usr/bin/env node
// Gera brain/brandbook.pdf agregando todas as rotas /brandbook/* em PDF multi-página.
// Estratégia:
// 1. Sobe Next em modo dev numa porta aleatória.
// 2. Aguarda /brandbook responder 200.
// 3. Para cada seção printable em ALL_SECTIONS, renderiza com page.emulateMedia({ media: "print" })
//    e captura page.pdf() (Buffer).
// 4. Faz merge dos PDFs com pdf-lib + cover page + TOC.
// 5. Output em brain/brandbook.pdf.

import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(__dirname);
const WEB = join(ROOT, "web");
const OUT_DIR = join(ROOT, "brain");
const OUT_PATH = join(OUT_DIR, "brandbook.pdf");

// Resolve deps a partir do web/node_modules (Playwright + pdf-lib são devDeps de web/).
const requireWeb = createRequire(join(WEB, "package.json"));

// Lê src/lib/brandbook-sections.ts e extrai href/label/printable via regex.
// Evita dep de TS loader — fonte é hand-written com const literals.
async function loadSections() {
  const file = join(WEB, "src/lib/brandbook-sections.ts");
  const { readFile } = await import("node:fs/promises");
  const src = await readFile(file, "utf8");
  const matches = [...src.matchAll(/href:\s*"([^"]+)"[\s\S]*?label:\s*"([^"]+)"[\s\S]*?printable:\s*(true|false)/g)];
  return matches.map((m) => ({
    href: m[1],
    label: m[2],
    printable: m[3] === "true",
  }));
}

async function loadDep(name) {
  try {
    const path = requireWeb.resolve(name);
    return await import(pathToFileURL(path).href);
  } catch (e) {
    console.error(`✗ ${name} não instalado. Rode no diretório web/:`);
    console.error(`    npm i -D playwright pdf-lib`);
    console.error(`    npx playwright install chromium`);
    process.exit(1);
  }
}

async function startNextDev() {
  // Usa script local pra pegar porta aleatória + iniciar next dev
  const proc = spawn("npm", ["run", "dev"], {
    cwd: WEB,
    stdio: ["ignore", "pipe", "pipe"],
    env: process.env,
  });
  let port;
  await new Promise((resolve, reject) => {
    const onData = (buf) => {
      const out = buf.toString();
      process.stdout.write(out);
      const m = out.match(/http:\/\/localhost:(\d+)/);
      if (m && !port) {
        port = parseInt(m[1], 10);
      }
      if (/Ready in/i.test(out) || /✓ Ready/i.test(out)) {
        resolve();
      }
    };
    proc.stdout.on("data", onData);
    proc.stderr.on("data", (b) => process.stderr.write(b));
    proc.on("exit", (code) => {
      if (!port) reject(new Error(`next dev saiu antes de ficar pronto (code ${code})`));
    });
    setTimeout(() => reject(new Error("next dev timeout (60s)")), 60_000);
  });
  if (!port) throw new Error("Não detectei a porta do next dev");
  return { proc, port };
}

async function renderToPdf(page, url, label) {
  console.log(`  → ${label} (${url})`);
  await page.goto(url, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  await wait(150);
  return await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "18mm", right: "16mm", bottom: "22mm", left: "16mm" },
    displayHeaderFooter: true,
    headerTemplate: `<div style="font-size:9px;color:#888;width:100%;text-align:right;padding-right:16mm;">Brandbook · ${label}</div>`,
    footerTemplate: `<div style="font-size:9px;color:#888;width:100%;text-align:center;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
  });
}

async function buildCoverAndToc(sections) {
  // HTML simples renderizado pelo próprio browser. Retorna um buffer de PDF de 2 páginas.
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<style>
  @page { size: A4; margin: 18mm 16mm; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; color: #000; }
  .cover { display: flex; flex-direction: column; justify-content: space-between; min-height: 24cm; padding: 4cm 0; }
  .cover h1 { font-size: 36pt; line-height: 1.05; letter-spacing: -0.02em; margin: 0 0 1cm; max-width: 14cm; }
  .cover .meta { font-family: ui-monospace, "SF Mono", monospace; font-size: 9pt; color: #555; }
  .cover .eyebrow { font-family: ui-monospace, monospace; font-size: 9pt; letter-spacing: 0.1em; text-transform: uppercase; color: #555; }
  .toc { page-break-before: always; }
  .toc h2 { font-size: 24pt; letter-spacing: -0.02em; margin: 0 0 1cm; }
  .toc-group { margin-bottom: 0.8cm; }
  .toc-group h3 { font-size: 11pt; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 0.3cm; color: #555; }
  .toc-group ul { list-style: none; padding: 0; margin: 0; }
  .toc-group li { font-size: 10pt; line-height: 1.6; display: flex; justify-content: space-between; }
</style>
</head>
<body>
<section class="cover">
  <p class="eyebrow">Brandbook</p>
  <h1>Design system deste projeto.</h1>
  <p class="meta">Gerado em ${new Date().toLocaleDateString("pt-BR")} · seobrain framework</p>
</section>
<section class="toc">
  <h2>Sumário</h2>
  ${sections.map((s, i) => `<li><span>${i + 1}. ${s.label}</span><span>${s.href}</span></li>`).join("")}
</section>
</body>
</html>`;
  return html;
}

async function main() {
  const playwright = await loadDep("playwright");
  const pdfLib = await loadDep("pdf-lib");
  const chromium = playwright.chromium ?? playwright.default?.chromium;
  const PDFDocument = pdfLib.PDFDocument ?? pdfLib.default?.PDFDocument;
  if (!chromium || !PDFDocument) {
    console.error("✗ Falha ao resolver chromium ou PDFDocument das deps.");
    process.exit(1);
  }

  const sections = (await loadSections()).filter((s) => s.printable);
  console.log(`▶ Brandbook PDF — ${sections.length} seções`);

  const { proc, port } = await startNextDev();
  console.log(`▶ Next pronto em :${port}`);

  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // Cover + TOC
  const coverHtml = await buildCoverAndToc(sections);
  await page.setContent(coverHtml, { waitUntil: "networkidle" });
  const coverPdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "18mm", right: "16mm", bottom: "22mm", left: "16mm" },
  });

  const merged = await PDFDocument.create();
  const cover = await PDFDocument.load(coverPdf);
  (await merged.copyPages(cover, cover.getPageIndices())).forEach((p) =>
    merged.addPage(p)
  );

  for (const s of sections) {
    const buf = await renderToPdf(page, `http://localhost:${port}${s.href}`, s.label);
    const doc = await PDFDocument.load(buf);
    (await merged.copyPages(doc, doc.getPageIndices())).forEach((p) =>
      merged.addPage(p)
    );
  }

  const finalBytes = await merged.save();
  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_PATH, finalBytes);

  await browser.close();
  proc.kill("SIGTERM");

  console.log(`✓ ${OUT_PATH} (${(finalBytes.length / 1024).toFixed(0)}kb · ${merged.getPageCount()} páginas)`);
  process.exit(0);
}

main().catch((err) => {
  console.error("✗", err);
  process.exit(1);
});
