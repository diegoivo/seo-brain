// pdf-generator.mjs
// Converte brand/<slug>/brandbook.html em brand/<slug>/brandbook.pdf
// usando puppeteer-core + Chrome do sistema. Sem dependência externa pesada.
//
// Uso:
//   node skills/branding/assets/pdf-generator.mjs brand/<slug>
//
// Requer puppeteer-core no node_modules (npm install puppeteer-core --save-dev).
// Detecta Chrome em paths conhecidos (macOS / linux / windows). Se ausente, sai
// com exit code 2 e instrução de fallback manual (Cmd+P).

import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

async function generatePDF() {
  const brandDir = process.argv[2];
  if (!brandDir) {
    console.error("Usage: node pdf-generator.mjs <brand-directory>");
    process.exit(1);
  }

  const htmlPath = join(brandDir, "brandbook.html");
  const pdfPath = join(brandDir, "brandbook.pdf");

  if (!existsSync(htmlPath)) {
    console.error(`Not found: ${htmlPath}`);
    console.error(`Run /branding export first to produce brandbook.html.`);
    process.exit(1);
  }

  const chromePaths = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ];

  const envChrome = process.env.CHROME_PATH;
  const candidates = envChrome ? [envChrome, ...chromePaths] : chromePaths;

  let chromePath = null;
  for (const p of candidates) {
    if (existsSync(p)) {
      chromePath = p;
      break;
    }
  }

  if (!chromePath) {
    console.error("Chrome not found in known locations.");
    console.error("Set CHROME_PATH env var to the Chrome executable, or install Google Chrome.");
    console.error("");
    console.error("Manual fallback:");
    console.error(`  open ${htmlPath}`);
    console.error("  Then Cmd+P → Save as PDF (A4 Landscape, Background graphics ON).");
    process.exit(2);
  }

  let puppeteer;
  try {
    puppeteer = await import("puppeteer-core");
  } catch (err) {
    console.error("puppeteer-core not installed.");
    console.error("Install with: npm install puppeteer-core --save-dev");
    console.error("");
    console.error("Manual fallback:");
    console.error(`  open ${htmlPath}`);
    console.error("  Then Cmd+P → Save as PDF (A4 Landscape, Background graphics ON).");
    process.exit(3);
  }

  const browser = await puppeteer.default.launch({
    executablePath: chromePath,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  const fileUrl = pathToFileURL(htmlPath).href;

  await page.goto(fileUrl, { waitUntil: "networkidle0", timeout: 30000 });

  await page.pdf({
    path: pdfPath,
    format: "A4",
    landscape: true,
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  console.log(`PDF generated: ${pdfPath}`);
}

generatePDF().catch((err) => {
  console.error("PDF generation failed:", err.message);
  process.exit(4);
});
