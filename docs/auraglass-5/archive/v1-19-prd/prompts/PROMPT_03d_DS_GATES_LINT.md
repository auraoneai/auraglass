# PROMPT-03d (DS): CSS-variable, tier, literal and parity gates, plus `no-raw-design-values` lint

Source PRD: `docs/auraglass-5/prd/AURAGLASS_DESIGN_SYSTEM_PRD.md` (PRD-03, §5.2, §5.9, §6 lint rows, §20 step 6). Requirements: REQ-DS-05 (gate), REQ-DS-07 (manifest gate), REQ-DS-30 (5.0 parity), REQ-DS-31, REQ-DS-32, REQ-DS-33, REQ-DS-36, REQ-DS-39. Acceptance: AC-DS-01 (ratchet mode before beta), AC-DS-05 (compiler entries), AC-DS-07, AC-DS-17. Tasks: `docs/auraglass-5/tasks/DS.json` DS-063..DS-080. Architecture: §4.4 (namespace), §10, §15.2 Static lane ("ratchet from about 1,890").

Contract registry `docs/auraglass-5/prd/_shared-contracts.md` is binding here: SC-04 API reports, SC-16 rule namespace (the plugin is PKG's; every rule task is a MODIFY), SC-17 (DS owns the program's only raw-value rule and the only literal baseline; FND `no-literal-style` and MOT `motion-no-literals` fold into it as categories), SC-29 (QA L1 Static hosts the gates), and SC-39 (DS-079 is the single remover of `check-undefined-custom-props.mjs`; QA-118 deletes `design-system-compliance.yml`).

## 0. Common rules (binding)

- Remote-first. Node-only Jest, ESLint, stylelint and the gate scripts may run locally. Full `npm run build` (gates need `dist/`), Storybook and browsers run remotely: in GitHub Actions on `auraoneai/auraglass` (choose per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or on an ephemeral EC2 worker via the `auraone-remote-run` skill. Never use local Docker or a local Playwright browser.
- Don't fake completion:
  - Every gate fails closed at threshold 0, except that `literals` is ratcheted against its baseline.
  - The literals baseline may only go down; regenerating it upward is forbidden.
  - No directory exclusions beyond the REQ-DS-33 exempt list.
  - No `// eslint-disable` or `/* stylelint-disable */` added to pass.
  - No allowlisting the compiler's own output.
  - No `test.skip`, no snapshot updates.
- Delete the three legacy lints only after a superset diff proves the new gates find everything they found (§20 step 6).

## 1. Prerequisites (verify; on failure stop and report)

1. 03b merged: `dist/tokens/manifest.json` and `dist/css/tokens.css` are produced by `npm run build:tokens`.
2. 03c merged: `src/material/css/generated/{ladders,floors,properties}.css` exist. For DS-063..DS-066 on compiler output, this is required. DS-072..DS-075 (literals) need only 03b.
3. API reports exist (owner prompts `PROMPT_00_TRUST` TRUST-071/072 and `PROMPT_01_REL` REL-003; SC-04 paths `etc/api/<slug>.api.md` and `etc/api/<slug>.exports.json`): `rg --files etc/api | rg "(tokens|theme)\.(api\.md|exports\.json)"` returns hits. If not, DS-067/DS-068 are blocked: the gate exits 2 `blocked`, with no silent fallback. Report it.
3a. PKG lint wiring (PKG-015, owner prompt `PROMPT_02_PKG`): `eslint.config.js` loads `eslint-plugin-auraglass.js`. QA L1 Static (QA-078, owner prompt `PROMPT_18_QA`): `certification/lanes.config.ts` has an L1 provider list. If QA-078 is missing, keep the gates on the interim DS step in `glass-pipeline.yml` (DS-047) and report DS-076 as blocked on QA-078.
4. PKG entry list: the importable CSS entries in `dist/css/` (`styles.css`, `tokens.css`, `material.css`, `tailwind.css`, per-subpath CSS, `compat/*.css`). Read them from `build/exports.manifest.json` (PKG-005). If it doesn't exist yet, glob `dist/css/**/*.css` and log the list.

## 2. File scope

May touch (NEW unless marked):
- `scripts/tokens/gates/{undefined-vars,dead-vars,tier-skip,types-runtime,literals}.mjs`, `scripts/tokens/gates/lib/*.mjs`, `scripts/tokens/gates/literals-baseline.json` (generated);
- `stylelint-plugin-auraglass/index.js` and `stylelint-plugin-auraglass/rules/no-raw-design-values.js`, plus `stylelint.config.mjs`;
- MODIFY `eslint-plugin-auraglass.js` (add rule `no-raw-design-values`), MODIFY `eslint.config.js` (register `auraglass/no-raw-design-values: 'error'`, remove `auraglass/require-glass-tokens: 'warn'` at `:30`);
- MODIFY `package.json` (scripts `lint:tokens`, `verify:css-vars`, `gates:tokens`; devDependency `stylelint` exact);
- MODIFY `certification/lanes.config.ts` (DS providers in L1 Static only, after QA-078); MODIFY `.github/workflows/glass-pipeline.yml` (remove the interim DS `tokens` step once L1/L4 are live; job names unchanged, SC-10);
- `tests/tokens/{vars-gates,literals-lint}.test.ts`, MODIFY `tests/tokens/types-runtime-parity.test.ts`, `tests/tokens/fixtures/gates/**`, `tests/tokens/fixtures/literals/**`;
- DELETE `scripts/ci/token-lint.js`, `scripts/ci/check-undefined-custom-props.mjs`, `scripts/ci/audit-css-var-coverage.js` (DS-078..DS-080 only).

Must not touch: any `src/**` file to reduce violations. Family PRDs (PRD-07..16) migrate literals in their own components, and this prompt only builds and wires the gate. Also off limits: `tokens/**` values, generated files, and PRD-02's `tests/css/**` gates.

## 3. Steps

### DS-063 `undefined-vars` (REQ-DS-31, REQ-DS-07)
For each CSS entry in §1.4, resolve its `@import` closure with postcss, then collect definitions (declarations `--x:` and `@property --x`) and references (`var(--ag-*|--_ag-*)`). A reference without a fallback must be defined in the closure. Separately, scan `src/**/*.{ts,tsx}` (ts AST: string and template literals, `style={{}}` object keys and values) for `--ag-[a-z0-9-]+` names absent from `dist/tokens/manifest.json`. Output `{entry, var, file:line}` per violation and exit 1 if any are found. This supersedes `check-undefined-custom-props.mjs`.

### DS-064 `dead-vars` (REQ-DS-32)
Every public manifest var needs ≥ 1 reader in built library CSS (`dist/css/**`) or library TS (`src/**`, excluding generated/tests/stories), unless its token carries `$extensions["ag.public"] === true`. Every private `--_ag-*` defined in compiler output needs ≥ 1 reader. Write the `consumers` count back into `dist/tokens/manifest.json`. Exit 1 if any public var has 0 readers and isn't flagged, or any private var has 0 readers.

### DS-065 `tier-skip` (REQ-DS-05)
- No `src/**` file except `src/tokens/generated/**` references `--_ag-ref-*`.
- In the resolved token graph, `material.*` aliases only `sys.*`.
- `comp.*` aliases only `sys.*`/`material.*`.
Exit 1 with the alias chain.

### DS-066 Test `tests/tokens/vars-gates.test.ts`
Run the three gates against the real build and assert 0 violations. Fixtures under `tests/tokens/fixtures/gates/`: `dead-var/` (public var with no reader), `undefined-var/` (`var(--ag-nope)`), `unmanifested-tsx/` (`style={{'--ag-foo': 1}}`), and `ref-in-src/` (`var(--_ag-ref-slate-3)` in a component). Each must exit 1 with the expected message. It also asserts total gate runtime ≤ 30 s (§16).

### DS-067..DS-068 `types-runtime` (REQ-DS-30, AC-DS-07)
`gates/types-runtime.mjs` compares `Object.keys(await import('aura-glass/tokens'))` and `aura-glass/theme` (resolved through the package `exports`, built `dist`) with `etc/api/tokens.exports.json` / `etc/api/theme.exports.json`, or with the TS compiler API on `.d.ts` if §1.3 is blocked. Rewrite `tests/tokens/types-runtime-parity.test.ts` to call it. Both directions must have 0 mismatches on `main` (5.0), and the result must contain no `getPersona`. On `release/4.x`, the only allowlisted mismatch is the 2 `@deprecated` type-only names from 03a. The allowlist is empty on `main`.

### DS-069..DS-071 Lint rules (REQ-DS-33)
- ESLint `auraglass/no-raw-design-values` goes in `eslint-plugin-auraglass.js`, next to the existing `no-inline-glass` (`:10`) and `require-glass-tokens` (`:242`). It reports string and template literals and JSX `style` values containing: hex colours (`#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`), `rgb(`/`rgba(`/`hsl(`/`hsla(` with literal components, `oklch(` with literal components (`oklch(from var(...)` is allowed), `blur(<n>px)`, `box-shadow`/`boxShadow` values with literal lengths and colours, `<n>ms`/`<n>s` durations in `transition`/`animation*` contexts, `border-radius`/`borderRadius` px literals, `cubic-bezier(` and literal `linear(` spring curves. Each finding carries a `category`: `color|blur|radius|shadow|duration|easing|spring` (SC-17). Severity is `error`. Add it by MODIFY to the existing plugin, never as a new plugin file (SC-16). In `eslint.config.js`, register it and remove `require-glass-tokens: 'warn'` (`:30`).
- stylelint: NEW `stylelint-plugin-auraglass` with rule `auraglass/no-raw-design-values`, same pattern set on declaration values in `src/**/*.css`. NEW `stylelint.config.mjs` enables it at `error`. Pin `stylelint` exactly in `devDependencies`.
- Exempt paths for both rules (and only these): `tokens/**`, `src/tokens/generated/**`, `src/material/css/generated/**`, `src/motion/tokens.generated.ts`, `src/theme/color.ts`, and values under the `sys.palette.*` group in token JSON. `color.ts` is exempt only for conversion constants and test vectors; a `// @ag-literal-allowed: color-math` marker comment is required on each such line, and the rule verifies it.

### DS-072..DS-074 `literals` gate and ratchet (REQ-DS-33, AC-DS-01)
1. `gates/literals.mjs` runs ESLint (rule only) and stylelint (rule only) programmatically over all of `src/**/*.{ts,tsx,css}` with no directory exclusions. It groups counts per file and category. Compare with `scripts/tokens/gates/literals-baseline.json` (`{ "<path>": { "<category>": <count> } }`, categories per SC-17). It fails if any file/category count rises or any file not in the baseline has > 0. This is the only literal baseline: QA L1 reads it, `certification/ratchets.json` holds coverage only, and no `scripts/ci/motion-literal-baseline.json` exists. When counts drop, run with `--update` to rewrite the baseline. The script refuses `--update` if any count would rise.
2. Generate the baseline once at the current HEAD of `main` and commit it. Log the total (architecture §15.2 expects about 1,890; PRD §7 cites 180 of 415 TSX files). Report the measured number, whatever it is.
3. `tests/tokens/literals-lint.test.ts`:
   - fixtures `fixtures/literals/{hex.tsx,rgba.tsx,blur.css,duration.tsx,bezier.css}` containing `#fff`, `rgba(0,0,0,.2)`, `blur(8px)`, `200ms` and `cubic-bezier(.2,0,0,1)` are each flagged;
   - the same content under a fixture path mapped to `tokens/` and `src/tokens/generated/` is allowed;
   - ratchet case 1: a temp baseline plus a fixture that adds one violation to a baselined file must fail;
   - ratchet case 2: a fixture that removes one violation must pass and lower the baseline under `--update`;
   - ratchet case 3: `--update` with an increase must exit 1.

### DS-075..DS-077 Scripts, CI, superset proof
- `package.json`:
  - `lint:tokens` → `node scripts/tokens/gates/literals.mjs`;
  - `verify:css-vars` → `node scripts/tokens/gates/undefined-vars.mjs`;
  - NEW `gates:tokens` runs `undefined-vars`, `dead-vars`, `tier-skip`, `types-runtime` and `literals` in sequence and fails on the first non-zero exit.
- DS-076: register DS providers in QA's L1 Static lane in `certification/lanes.config.ts` (MODIFY after QA-078; SC-29). After a full remote `npm run build`, run `npm run gates:tokens`, `npx stylelint "src/**/*.css"`, and `npx eslint src --rule '{"auraglass/no-raw-design-values":"error"}'` (counted by the gate, not by raw exit). Enforce total gate time ≤ 30 s. Then remove the interim DS step from `glass-pipeline.yml`. Do not edit `design-system-compliance.yml` or its score job: QA-118 deletes the file once it confirms these providers (SC-39). L1 is a required check through QA's `certify-pr.yml`.
- Superset proof: on the same commit, run `node scripts/ci/token-lint.js`, `node scripts/ci/check-undefined-custom-props.mjs` and `node scripts/ci/audit-css-var-coverage.js`, normalise their findings to `{file, var|literal}`, and diff them against the new gates' findings. Every legacy finding must appear in the new set. Attach the diff to the PR as a CI artifact. If any legacy finding is missing, fix the new gate; never delete the legacy lint first.

### DS-078..DS-080 Retire legacy lints
Once the superset proof is green, delete `scripts/ci/token-lint.js` (its `:305-331` ignore list is the scope gap), `scripts/ci/check-undefined-custom-props.mjs` and `scripts/ci/audit-css-var-coverage.js`. Repoint every reference: `rg -n "token-lint|check-undefined-custom-props|audit-css-var-coverage" package.json .github scripts` must return 0.

### REQ-DS-36/-39 assertions (in DS-066)
Add these to `tests/tokens/emitted-css.test.ts`:
- `src/tokens/generated/**` contains no Tailwind class strings (regex for `\b(bg|text|border|rounded|p|m|flex|grid)-[a-z0-9/[\]-]+` inside string literals = 0);
- the only class-like names this compiler emits are the six `@utility` names in `tailwind.css` (03e), and none of them appears in `src/**`.
The package-wide class coverage (`tests/css/class-coverage.test.ts`) belongs to PRD-02 REQ-PKG-95. Report its status.

## 4. Tests to run
Local: `npx jest tests/tokens/vars-gates.test.ts tests/tokens/literals-lint.test.ts tests/tokens/types-runtime-parity.test.ts tests/tokens/emitted-css.test.ts`. Remote: the PR `tokens` job (full build + `gates:tokens`), plus the superset-proof artifact.

## 5. Visual evidence
This prompt has no browser output. CI artifacts: gate reports (JSON), the literals baseline total and top 20 files, and the superset diff.

## 6. Exit criteria
- AC-DS-05 (compiler entries): `undefined-vars` = 0 and `dead-vars` = 0 for `tokens.css` and the generated material CSS; public `--ag-*` ≤ 260. The `styles.css` total ≤ 460 is verified in 03f after the 5.0 switch.
- AC-DS-07: `types-runtime` has 0 mismatches for `aura-glass/tokens` and `aura-glass/theme`.
- AC-DS-17: `rg -o -- "--ag-[a-z0-9-]+" src` shows no name absent from the manifest. `undefined-vars` enforces this.
- AC-DS-01 (ratchet mode): the baseline is committed, CI fails on any per-file increase (proven by the fixture), and the exempt list equals REQ-DS-33 exactly.
- The legacy lints are deleted after the superset diff shows 0 missing findings.

## 7. Final report format
```
PROMPT-03d report
PRs: <urls>   Branch: main
Prereqs: 1, 2, 3 (TRUST-072/REL-003), 3a (PKG-015/QA-078), 4 (PKG-005) <ok|blocked:...>
Tasks: DS-063 <done|blocked> ... DS-080
Gate results on main: undefined <n>, dead <n>, tier-skip <n>, types-runtime mismatches <n>, literals total <n> (baseline files <n>)
Gate runtime: <s> s (<= 30)
Superset proof: legacy findings <n>, missing in new <n>; artifact <url>
Tests: <cmd> -> <pass>/<total>, 0 skipped; CI <url>
AC: AC-DS-01(ratchet) <p|f>, AC-DS-05(compiler) <p|f>, AC-DS-07 <p|f>, AC-DS-17 <p|f>
Deviations: <list with evidence>
```
