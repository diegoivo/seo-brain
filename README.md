# SEO Brain

> **Agentic SEO + GEO toolkit for Claude Code** — Brazilian Portuguese voice, proprietary POVs, parallel sub-agents, AI Overviews optimization, schema markup, E-E-A-T scoring. 24 skills covering LLM Wiki, Branding, Content SEO, Technical SEO, SEO Strategy, SEO Data.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Plugin-7C3AED)](https://code.claude.com/)
[![Status](https://img.shields.io/badge/status-experimental-orange)](#warning)

> ⚠️ **Experimental.** SEO Brain decides, writes, publishes with light supervision. **Do not deploy to production without 100% human review of generated output.**

Multi-harness: Claude Code (plugin) · Codex CLI · Cursor · Antigravity (via AGENTS.md fallback).

---

## Install

```bash
# Inside Claude Code
/plugin marketplace add diegoivo/seobrain
/plugin install seobrain@seobrain-marketplace

# First run
/seobrain:start
```

Plugin discovers 24 skills + 3 commands + 2 hooks automatically. No `npm install` required.

For Codex/Cursor/Antigravity: clone repo, agent reads `AGENTS.md` (auto-generated per-project on first `/seobrain:start`).

---

## Quick start

```
$ /seobrain:start
🧠 SEO Brain v0.1.0 — Brazilian-first SEO + GEO toolkit
   Status: framework root, no projects yet.
   Run /seobrain:start create-project <name> to begin.

$ /seobrain:start create-project acme-cliente
✓ Created /Users/you/dev/acme-cliente/

$ cd acme-cliente && /seobrain:start
🧠 Project 'acme-cliente' detected. Brain in template state.
   Vamos popular brain + branding (~10min, 18 questions).
```

After onboarding: `/content-seo` writes blog post · `/technical-seo` audits · `/seo-data` keyword research · `/qa` validates · `/ship` deploys.

Full walkthrough: [`skills/seobrain/examples/new-project-walkthrough.md`](./skills/seobrain/examples/new-project-walkthrough.md).

---

## Why SEO Brain

| | claude-seo | searchfit-seo | superseo-skills | **SEO Brain** |
|---|---|---|---|---|
| Brazilian Portuguese first | ❌ | ❌ | ❌ | **✅** |
| Proprietary POVs (Karpathy LLM Wiki) | ❌ | ❌ | ❌ | **✅** |
| Parallel sub-agents | partial | ❌ | partial | **✅** |
| GEO + AI Overviews | partial | ✅ | ✅ | **✅** |
| Multi-project (clients) | ❌ | ❌ | ❌ | **✅** |
| DataForSEO native | ❌ | ❌ | partial | **✅** |
| Anti-AI-slop validators | ❌ | ❌ | ❌ | **✅** |

---

## 24 skills (6 pillars + pipeline)

### Framework entry
- `seobrain` — load context, list/create projects, orchestrate brain + branding onboarding.

### Pipeline (4)
- `plan` — execution plan in plans/ before non-trivial task
- `ship` — release pipeline (commit → preview → smoke → merge main → prod)
- `approved` — task approval triggers wiki-update
- `qa` — orchestrator, dispatches 3 reviewers in parallel via Task

### LLM Wiki (3) — substrate
- `wiki-init` — populate brain from scratch
- `wiki-update` — refresh after task
- `wiki-lint` — frontmatter + freshness + drift detection

### Branding (6) — design + visual identity
- `branding-init` — 10 questions → DESIGN.md (anti-AI-slop)
- `branding-onboard` — phase 2 of project onboarding
- `branding-clone` — visual clone from URL + fidelity QA
- `branding-brandbook` — interactive Next.js scaffold (cores, tipografia, voz)
- `branding-images` — image system (Pexels, Unsplash, OpenAI)
- `branding-review` — design system QA + AI-slop detection

### Content SEO (2)
- `content-seo` — pipeline editorial (intent analysis → article OR 6-step blogpost → GEO checklist)
- `content-seo-review` — voice + capitalização BR + POVs + GEO validation

### Technical SEO (3)
- `technical-seo` — full site audit / single page / images / Lighthouse + CWV
- `seo-strategy` — 7-step strategy (competitors, topic clusters, linkbait)
- `seo-data` — DataForSEO (volume, competitor pages, competitor keywords)

### Website (6)
- `website-create` — Next.js scaffold (home + service + blog + sobre + contato)
- `website-bestpractices` — canonical Tailwind/Next snippets (Lighthouse 95+)
- `website-cms` — Payload + Neon bolt-on (when ≥100 dynamic pages)
- `website-domain` — Vercel domain config post first deploy
- `website-email` — Resend integration for contact form
- `website-qa` — build + lighthouse + a11y + schema validation

---

## Architecture

```
seobrain/                            (plugin root)
├── .claude-plugin/
│   ├── plugin.json                 (manifest)
│   └── marketplace.json            (catalog)
├── skills/                          (24 skills, progressive disclosure)
├── commands/                        (3 slash shortcuts)
├── hooks/                           (session-start, pre-tool-use)
├── scripts/                         (utilities — seo-score, eval, sync-meta, etc.)
├── templates/project/               (copied to user cwd by /seobrain:start create-project)
├── tests/                           (e2e smoke + eval prompts)
└── docs/                            (release-process, marketplace-submission)
```

Per-project (created by user, git-ignored from this repo):
```
<your-project>/
├── brain/                           LLM Wiki (Karpathy methodology + Obsidian-friendly)
├── content/                         posts + pages
├── web/                             Next.js SSG (Lighthouse 100 baseline)
└── AGENTS.md                        auto-generated for non-Claude harnesses
```

---

## Migration from pre-v0.1.0

If you have projects from earlier versions: see [MIGRATION.md](./MIGRATION.md) for skill rename cheat sheet and migration script.

---

## Telemetry & metrics

Pre-refactor → post-refactor:
- SessionStart tokens: 5052 → 2040 (-60%)
- Skill matching top3: 80% → 100%
- 33 skills → 24 (consolidated by domain)

---

## Roadmap

- v0.1.x: bug fixes, doc updates, marketplace submissions.
- v0.2.0: KeywordProvider abstraction (GSC, GA4 alongside DataForSEO).
- v0.3.0: Codex/Antigravity/Cursor parity testing + native walkthrough.
- v1.0.0: after ≥50 stars + external eval validation.

See [CHANGELOG.md](./CHANGELOG.md).

---

## Development

```bash
git clone https://github.com/diegoivo/seobrain.git
cd seobrain
node scripts/validate-skills.mjs       # 24 skills, 0 errors
node tests/e2e/install-and-create.mjs  # smoke ✓
node scripts/eval-skill-matching.mjs   # 100% top3 match
```

---

## License

MIT © Diego Ivo (Conversion). [conversion.com.br](https://www.conversion.com.br)
