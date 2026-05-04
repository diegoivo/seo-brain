# Release Process

## Versioning strategy

Durante dev: `version` field omitido em `plugin.json`. Claude Code resolve via commit SHA. Permite `/plugin update` disparar em commits novos.

Em release: bump `version` em `plugin.json` ANTES do tag. Marketplace.json não tem version field (spec warning: plugin.json wins).

## Semver

- `0.1.0` → `0.1.x`: patches (bug fixes, doc updates).
- `0.1.0` → `0.2.0`: minor (new skills, non-breaking changes).
- `0.x.y` → `1.0.0`: major (only after ≥50 stars + external validation + stable eval).

## Release checklist

```
1. node scripts/validate-skills.mjs       # 0 errors
2. node scripts/sync-meta.mjs --check     # in sync
3. node tests/e2e/install-and-create.mjs  # smoke ✓
4. node scripts/eval-skill-matching.mjs --check-regression  # ≤10% drop
5. Bump version em .claude-plugin/plugin.json
6. Update CHANGELOG.md (move "Unreleased" para nova versão)
7. git commit -m "chore(release): v0.X.Y"
8. git tag v0.X.Y
9. git push && git push --tags
10. GitHub release com link pra CHANGELOG section
```

## Yank criteria

Pull plugin do marketplace se:

- Hook crashes em >5% das sessões instaladas (telemetry quando disponível).
- Skill matching regression >20% reportada por usuários (issue pattern).
- Security issue confirmado (credentials leak, code injection).
- Spec compliance break (Anthropic muda plugin format).

### Yank flow

1. Bump patch (v0.1.0 → v0.1.1) com fix.
2. Se fix demorar >24h: revert tag pra última estável (`git push --force-with-lease origin v0.1.0`).
3. Update marketplace.json com versão segura.
4. Anúncio em CHANGELOG section "[YANKED]" com motivo + alternativa.

## Hotfix process

```
git checkout v0.1.0  # última stable
git checkout -b hotfix/v0.1.1
# fix
git commit -m "fix(hotfix): ..."
git tag v0.1.1 && git push --tags
# update marketplace.json em main após teste
```

## Backporting

Plugin não tem branches estáveis (head = main). Se backport necessário, criar branch `release/v0.1.x` no momento do bump major.

## Communication

- CHANGELOG.md primeiro destination.
- GitHub release notes link pra CHANGELOG.
- Tweet/blog post na Conversion social pós-release significativo (minor+).
- Anthropic Discord #plugins channel (optional, releases majors).
