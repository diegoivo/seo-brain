#!/usr/bin/env node
// Busca imagens via Pexels e/ou Unsplash. Sem deps — usa fetch nativo (Node ≥ 18).
//
// Uso:
//   node scripts/image-search.mjs "<query>" [opções]
//
// Opções:
//   --provider=pexels|unsplash|both   Default: pexels (rate limit melhor sem key)
//   --limit=N                          Default: 8
//   --orientation=landscape|portrait|square  Default: landscape
//   --download=N                       Baixa o item N (1-indexed) para web/public/images/<categoria>/<slug>.jpg
//   --slug=<nome>                      Slug do arquivo de download
//   --category=<dir>                   Subdiretório (default: misc)
//
// Env vars:
//   PEXELS_API_KEY      https://www.pexels.com/api/ (free, 200 req/h)
//   UNSPLASH_ACCESS_KEY https://unsplash.com/developers (free, 50 req/h)

import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";
import { requireProjectRoot } from "./lib/project-root.mjs";

const ROOT = requireProjectRoot();

// ---------- carrega .env.local se existir ----------
async function loadEnv() {
  const envPath = join(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  const { readFile } = await import("node:fs/promises");
  const txt = await readFile(envPath, "utf8");
  for (const line of txt.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

// ---------- args ----------
function parseArgs(argv) {
  const out = { query: "", provider: "pexels", limit: 8, orientation: "landscape", download: null, slug: "", category: "misc" };
  const positional = [];
  for (const a of argv) {
    if (a.startsWith("--")) {
      const [k, v] = a.slice(2).split("=");
      if (v === undefined) out[k] = true;
      else if (["limit", "download"].includes(k)) out[k] = parseInt(v, 10);
      else out[k] = v;
    } else {
      positional.push(a);
    }
  }
  out.query = positional.join(" ").trim();
  return out;
}

// ---------- providers ----------
async function searchPexels({ query, limit, orientation }) {
  const key = process.env.PEXELS_API_KEY;
  if (!key) {
    return { error: "PEXELS_API_KEY não configurada. Crie em https://www.pexels.com/api/ e adicione a .env.local." };
  }
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(limit));
  if (orientation) url.searchParams.set("orientation", orientation);
  const res = await fetch(url, { headers: { Authorization: key } });
  if (!res.ok) return { error: `Pexels HTTP ${res.status}: ${await res.text().catch(() => "")}` };
  const data = await res.json();
  return {
    items: (data.photos ?? []).map((p) => ({
      provider: "pexels",
      id: String(p.id),
      url: p.src?.large2x ?? p.src?.large ?? p.src?.original,
      thumb: p.src?.medium,
      width: p.width,
      height: p.height,
      author: p.photographer,
      author_url: p.photographer_url,
      attribution_url: p.url,
      alt: p.alt || "",
    })),
  };
}

async function searchUnsplash({ query, limit, orientation }) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    return { error: "UNSPLASH_ACCESS_KEY não configurada. Crie em https://unsplash.com/developers e adicione a .env.local." };
  }
  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(limit));
  if (orientation) url.searchParams.set("orientation", orientation === "landscape" ? "landscape" : orientation === "portrait" ? "portrait" : "squarish");
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${key}` } });
  if (!res.ok) return { error: `Unsplash HTTP ${res.status}: ${await res.text().catch(() => "")}` };
  const data = await res.json();
  return {
    items: (data.results ?? []).map((p) => ({
      provider: "unsplash",
      id: p.id,
      url: p.urls?.regular,
      thumb: p.urls?.small,
      width: p.width,
      height: p.height,
      author: p.user?.name,
      author_url: p.user?.links?.html,
      attribution_url: p.links?.html,
      alt: p.alt_description || "",
    })),
  };
}

// ---------- output ----------
function renderResults(items, query) {
  console.log(`\n▶ ${items.length} resultado(s) para "${query}"\n`);
  items.forEach((it, i) => {
    console.log(`${i + 1}. [${it.provider}] ${it.width}×${it.height} · @${it.author}`);
    console.log(`   ${it.url}`);
    if (it.alt) console.log(`   alt: "${it.alt}"`);
    console.log(`   attribution: ${it.attribution_url}`);
    console.log("");
  });
  console.log(`Para baixar uma: node scripts/image-search.mjs "${query}" --download=N --slug=meu-arquivo --category=posts\n`);
}

async function downloadImage(item, slug, category) {
  const ext = "jpg";
  const dir = join(ROOT, "web", "public", "images", category);
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
  const outPath = join(dir, `${slug}.${ext}`);

  console.log(`▶ Baixando ${item.provider}/${item.id}…`);
  const res = await fetch(item.url);
  if (!res.ok) throw new Error(`Falha ao baixar: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(outPath, buf);

  const relPath = outPath.replace(ROOT + "/", "");
  console.log(`✓ ${relPath} (${(buf.length / 1024).toFixed(0)}kb · ${item.width}×${item.height})\n`);
  console.log(`Frontmatter sugerido:`);
  console.log(`  cover: /images/${category}/${slug}.${ext}`);
  console.log(`  cover_alt: "${item.alt || `Foto por ${item.author}`}"`);
  console.log(`  cover_credit: "${item.author} (${item.provider}) — ${item.attribution_url}"\n`);
}

// ---------- main ----------
async function main() {
  await loadEnv();
  const args = parseArgs(process.argv.slice(2));
  if (!args.query) {
    console.error("Uso: node scripts/image-search.mjs \"<query>\" [--provider=pexels|unsplash|both] [--limit=8] [--orientation=landscape|portrait|square] [--download=N --slug=nome --category=posts]");
    process.exit(1);
  }

  let items = [];
  if (args.provider === "pexels" || args.provider === "both") {
    const r = await searchPexels(args);
    if (r.error) console.error(`✗ Pexels: ${r.error}`);
    else items.push(...r.items);
  }
  if (args.provider === "unsplash" || args.provider === "both") {
    const r = await searchUnsplash(args);
    if (r.error) console.error(`✗ Unsplash: ${r.error}`);
    else items.push(...r.items);
  }

  if (items.length === 0) {
    console.error("✗ Nenhum resultado.");
    process.exit(1);
  }

  if (args.download) {
    const item = items[args.download - 1];
    if (!item) {
      console.error(`✗ --download=${args.download} fora do intervalo (1-${items.length}).`);
      process.exit(1);
    }
    if (!args.slug) {
      console.error("✗ --slug=<nome> é obrigatório com --download.");
      process.exit(1);
    }
    await downloadImage(item, args.slug, args.category);
  } else {
    renderResults(items, args.query);
  }
}

main().catch((err) => {
  console.error("✗", err.message ?? err);
  process.exit(1);
});
