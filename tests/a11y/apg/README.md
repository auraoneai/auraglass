# APG coverage (§5.8)

Every interactive component ships an APG keyboard/AT conformance spec under
`tests/a11y/apg/<stream>/`. `tests/a11y/apg/mat/coverage.json` is the MAT row of
the coverage table; `scripts/mat/verify-apg-coverage.mjs` fails on absent specs
or specs that never exercise a required key (ratchet until beta, `--enforce` at
beta).

| Component | Spec | Owner PRD | Required keys |
|---|---|---|---|
| GlassPreferencesPanel | `tests/a11y/apg/mat/glass-preferences-panel.apg.spec.ts` | PRD-MAT | Arrows, PageUp/PageDown, Home/End, Tab |
| AuraGlassProvider | — (non-interactive) | PRD-MAT | — |
| HitArea | — (aria-hidden) | PRD-MAT | — |

APG harness: `tests/a11y/apg/harness.ts` (QUAL-owned, frozen `ApgHarness`
interface — `keyboard(page, steps)` then `axe(page)`).
