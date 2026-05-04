#!/usr/bin/env node
// Sweeps skills/ replacing old skill name references with new ones.
// Used once during v0.1.0 refactor.

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const RENAMES = [
  // command/skill renames
  ["/wiki-init", "/wiki-init"],
  ["/branding-onboard", "/branding-onboard"],
  ["/wiki-update", "/wiki-update"],
  ["/wiki-lint", "/wiki-lint"],
  ["/branding-init", "/branding-init"],
  ["/branding-brandbook", "/branding-brandbook"],
  ["/branding-images", "/branding-images"],
  ["/branding-review", "/branding-review"],
  ["/content-seo-review", "/content-seo-review"],
  ["/website-qa", "/website-qa"],
  ["/branding-clone", "/branding-clone"],
  ["/branding-clone", "/branding-clone"],
  ["/content-seo", "/content-seo"],
  ["/content-seo", "/content-seo"],
  ["/content-seo", "/content-seo"],
  ["/content-seo", "/content-seo"],
  ["/technical-seo", "/technical-seo"],
  ["/technical-seo", "/technical-seo"],
  ["/technical-seo", "/technical-seo"],
  ["/technical-seo", "/technical-seo"],
  ["/seo-strategy", "/seo-strategy"],
  ["/seo-data", "/seo-data"],
  ["/seo-data", "/seo-data"],
  ["/seo-data", "/seo-data"],
  ["/website-create", "/website-create"],
  ["/website-bestpractices", "/website-bestpractices"],
  ["/website-cms", "/website-cms"],
  ["/website-domain", "/website-domain"],
  ["/website-email", "/website-email"],
  ["/ship", "/ship"],
  ["/seobrain:start", "/seobrain:start"],
  ["/plan", "/plan"],
  ["/approved", "/approved"],

  // bare skill name references (in prose like "skill X" or "via X")
  ["skill `wiki-update`", "skill `wiki-update`"],
  ["skill `wiki-init`", "skill `wiki-init`"],
  ["skill `wiki-lint`", "skill `wiki-lint`"],
  ["skill `branding-onboard`", "skill `branding-onboard`"],
  ["skill `branding-init`", "skill `branding-init`"],
  ["skill `branding-images`", "skill `branding-images`"],
  ["skill `branding-review`", "skill `branding-review`"],
  ["skill `content-seo-review`", "skill `content-seo-review`"],
  ["skill `website-qa`", "skill `website-qa`"],
  ["skill `branding-clone`", "skill `branding-clone`"],
  ["skill `branding-clone`", "skill `branding-clone`"],
  ["skill `content-seo`", "skill `content-seo`"],
  ["skill `content-seo`", "skill `content-seo`"],
  ["skill `content-seo`", "skill `content-seo`"],
  ["skill `technical-seo`", "skill `technical-seo`"],
  ["skill `ship`", "skill `ship`"],
  ["skill `seobrain`", "skill `seobrain`"],
  ["skill `plan`", "skill `plan`"],

  // path references
  ["../website-bestpractices/", "../website-bestpractices/"],
  ["../branding-clone/", "../branding-clone/"],
  ["../branding-review/", "../branding-review/"],
  ["../content-seo-review/", "../content-seo-review/"],
  ["../website-qa/", "../website-qa/"],
  ["../branding-init/", "../branding-init/"],
  ["../wiki-init/", "../wiki-init/"],
  ["../wiki-update/", "../wiki-update/"],
  ["../wiki-lint/", "../wiki-lint/"],
  ["../branding-brandbook/", "../branding-brandbook/"],
  ["../branding-images/", "../branding-images/"],
  ["../website-domain/", "../website-domain/"],
  ["../website-email/", "../website-email/"],
  ["../technical-seo/", "../technical-seo/"],
  ["../technical-seo/", "../technical-seo/"],
  ["../technical-seo/", "../technical-seo/"],
  ["../technical-seo/", "../technical-seo/"],
  ["../seo-strategy/", "../seo-strategy/"],
  ["../seo-data/", "../seo-data/"],
  ["../seo-data/", "../seo-data/"],
  ["../seo-data/", "../seo-data/"],
  ["../website-create/", "../website-create/"],
  ["../website-cms/", "../website-cms/"],
  ["../ship/", "../ship/"],
  ["../content-seo/", "../content-seo/"],
  ["../content-seo/", "../content-seo/"],
  ["../content-seo/", "../content-seo/"],
  ["../content-seo/", "../content-seo/"],
];

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(path);
    } else if (entry.name.endsWith(".md") || entry.name.endsWith(".mjs") || entry.name.endsWith(".json")) {
      yield path;
    }
  }
}

let totalReplacements = 0;
let filesChanged = 0;

const dirs = ["skills", "commands", "hooks", "scripts", "docs"];

for (const dir of dirs) {
  for (const file of walk(dir)) {
    let content = readFileSync(file, "utf8");
    let original = content;
    for (const [old, neu] of RENAMES) {
      const before = content;
      content = content.split(old).join(neu);
      if (before !== content) {
        const occurrences = before.split(old).length - 1;
        totalReplacements += occurrences;
      }
    }
    if (content !== original) {
      writeFileSync(file, content);
      filesChanged++;
      console.log(`  ✓ ${file}`);
    }
  }
}

console.log(`\n${filesChanged} files changed, ${totalReplacements} replacements.`);
