# AuraGlass Glassmorphism Certification Audit — Tightened Spec

## Goal

Certify that every visual component-like export and every recipe renders as true,
token-canonical glassmorphism. The public scope also includes one explicitly
nonvisual state-engine export (`QuantumNeuromorphicEngine`), which is excluded
from screenshot certification and must pass separate API/behavior tests.
"True glass" means: a real `backdrop-filter`
chain with a canonical blur, a white-frost fill whose white-channel alpha is
inside an exact floor/ceiling, no dark/navy panel contamination, and no layout
defects. The audit must be fully headless, mechanically checkable, and
exit-code gated. Fix source only where a proven invariant violation exists;
never modify source, stories, or decorators to silence the audit.

## 1. Exact inventory (run these first)

    node scripts/audit/public-export-audit.js
    node scripts/audit/api-surface-audit.js
    npm run audit:exports
    npm run audit:api

Artifacts required: `reports/public-export-audit.json` and
`reports/public-export-audit.md`.

The authoritative public scope is **470 visual component-like exports + 1
explicitly nonvisual public state engine (`QuantumNeuromorphicEngine`) + 28
recipes = 499 total**. The visual screenshot scope is therefore **498 items**
(470 exports + 28 recipes), requiring **1,494 PNG/JSON pairs** (498 × 3
viewports). Derive these counts from the generated inventory at runtime rather
than hard-coding them; `nonVisual` entries are excluded from screenshot gates
only after their API/behavior test passes. The prompt's "439
exports/components and recipes" is stale; record the real count and the
discrepancy in the final summary. Every visual component-like export must
satisfy all of:

- source file exists (`missingSourceCount: 0`);
- a resolvable Storybook story id (direct story or generated certification
  story); otherwise the export is `blocked` and fails the gate;
- per-viewport screenshot evidence in the certification report. The explicitly
  nonvisual export instead requires API and behavior evidence and never counts
  as a generated placeholder or visual pass.

## 2. Token invariants (exact, mechanical checks)

Sources of truth: `src/tokens/glass.ts` (AURA_GLASS),
`tokens/personas/default.json`, `src/styles/tokens.css`,
`src/styles/glass.generated.css`. Generated CSS is the runtime truth;
`glass:validate-persona-css` proves source files agree.

### 2a. Backdrop-filter presence and blur range

- Every glass surface must have BOTH computed `backdrop-filter` AND
  `-webkit-backdrop-filter` non-`none`.
- The `blur()` value must be in the canonical scale **{16, 24, 32, 40, 48}px**
  exactly — matching `--glass-blur-{sm,md,lg,xl,2xl}` and
  `--glass-*-level{1..5}-blur`. Any blur outside this set (e.g. 8px, 12px,
  18px, 56px) fails.
- The canonical composite chain is
  `blur(<px>) saturate(1.8) brightness(1.05) contrast(1.05)`.
  Pass ranges: `saturate ≥ 1.4`, `brightness ≥ 1.0`,
  `contrast ∈ [0.95, 1.2]`. Missing any of the four filters fails.
- `blur(0px)` / `--glass-blur-none` on a glass surface fails. A sub-16px blur
  is allowed only on a non-surface decorative layer (e.g. inner glow), never on
  a surface candidate.
- Any `var(--glass-backdrop-blur, <fallback>)` must resolve to a real blur;
  a fallback resolving to `blur(0px)` fails.

### 2b. White-channel alpha floors (anti-frost)

- **Every white surface gradient stop** (including the start, midpoint, and
  end stop, and every additional stop if present) must have white-channel
  alpha ∈ **[0.015, 0.35]**. A single passing lightest stop is not sufficient;
  any stop below 0.015 or above 0.35 fails. Canonical hardened neutral
  white-frost (c07fd71) is `0.105/0.035/0.018` (start/52%/end); legacy level
  stops l1 `0.12/0.08/0.08`, l2 `0.14/0.08/0.10`, l3 `0.16/0.08/0.11`,
  l4 `0.18/0.08/0.12`, l5 `0.20/0.08/0.14` remain valid.
- Flat `background-color` used as a glass surface: white-channel alpha ∈
  [0.015, 0.35]. Tailwind: `bg-white/5` fails; `bg-white/{10,15,20,25,30}`
  passes unless composited under a dark overlay.

### 2c. Dark-channel prohibition (anti-navy)

- The only permitted dark channel is the overlay scrim
  `rgba(15,23,42,0.20..0.28)` per level (l1..l5). Scrim alpha must be ≤ 0.30.
- Any glass-surface dark fill with alpha **≥ 0.50 fails** (dark/navy
  contamination). Opaque `#0f172a`-style fills always fail.
- No hard-coded `#hex` / `rgb()` / `hsl()` colors on glass surfaces, borders,
  or text unless byte-identical to a canonical semantic token value.

### 2d. Border / glow / highlight floors

- Border white-channel alpha **≥ 0.12**. Canonical shipped borders:
  0.16/0.20/0.24/0.28/0.32 (level borders) and 0.25/0.40/0.50/0.20
  (`--glass-border-{default,hover,active,disabled}`). Deviations go to
  `reports/audit/triage.md`, not failures.
- Inner-glow/sheen white-alpha ∈ **[0.10, 0.18]** (canonical
  0.10/0.12/0.14/0.16/0.18 for l1..l5). Missing sheen on l1..l3 = flat
  surface, fails.
- Noise opacity ≤ 0.10 (canonical 0.03..0.10). Highlight opacity ≤ 0.32
  (canonical 0.18..0.32).

### 2e. Text alpha floors

- Primary ≥ 0.90, secondary ≥ 0.70, tertiary ≥ 0.50; any text node < 0.50
  fails. Low-alpha Tailwind text on a glass surface (`text-white/30` etc.)
  fails; replace with canonical text tokens.

### 2f. Theme purity

- All ten personas in `src/theme/designMatrix.ts` keep white-frost surfaces:
  every gradient stop ∈ [0.015, 0.35] and the full backdrop chain. Dark canvases
  are permitted; the glass surface itself must never be an opaque navy panel.
- `data-theme="dark"` may darken text/scrim but not the fill frost or chain.

## 3. Layout invariants

At 1440x900, 768x1024, and 390x844:

- No horizontal overflow: `scrollWidth > clientWidth + 2` fails on
  `document.documentElement` or any glass surface **unless** the glass surface
  itself is a contained scroll viewport (`overflow-x: auto` or `scroll`
  computed). A deliberately scrollable tab list, carousel, or code viewport is
  not a layout defect; content clipped by a non-scrollable or hidden-overflow
  ancestor, or document-level overflow, is.
- No zero-size glass surface (computed width or height ≤ 0 on a surface
  candidate). SVG-descendant and tiny-divider false positives are suppressed.
- No interactive-element overlap > 2px (bounding boxes intersecting beyond the
  2px tolerance).

## 4. Exact audit command sequence

Run in this order; each gate must exit 0 before the next starts.

    npm run lint:tokens
    npm run lint:styles
    npm run glass:validate-persona-css
    npm run glass:validate
    node scripts/glass-violation-scanner.js
    node scripts/ci/audit-css-var-coverage.js
    npm run test:recipes:render
    npm run audit:components

Then the runtime audit against the live Storybook server (port 6006):

    STORYBOOK_URL=http://localhost:6006 npx playwright test tests/visual/design-system/token-purity-layout-audit.spec.ts --config=playwright.visual-ci.config.ts --workers=1 --reporter=list

Capture independent visual evidence for every export and recipe (not only
failures), then verify the evidence set:

    CAPTURE_ALL_VISUALS=1 STORYBOOK_URL=http://localhost:6006 npx playwright test --config=playwright.visual-ci.config.ts tests/visual/design-system/token-purity-layout-audit.spec.ts --workers=1 --reporter=list
    npm run audit:visual:evidence

The capture must produce 498 directories × 3 viewports under
`reports/audit/visual-all/` (1440×900, 768×1024, 390×844), and the verifier
must exit 0 with `PASS: 498/498` (or the equivalent dynamically derived visual
count). A missing, blank, dark/navy, zero-geometry,
or error-bearing screenshot is a failure even when the token audit passes.
Evidence must be tied to the individual export or recipe and viewport. A
generic `CertificationCase`, placeholder story, shared shell screenshot, or
smoke-gate result is not evidence for the underlying item and cannot satisfy
this gate. Each recipe requires real rendered evidence at all three viewports;
recipes may not auto-pass from `npm run test:recipes:render` or another smoke
gate alone.

Then the full release gates:

    npm run test:visual:ci
    npm run test:visual:matrix

Then regenerate the certification report:

    STORYBOOK_URL=http://localhost:6006 node scripts/audit/storybook-visual-certification.mjs

`reports/glassmorphism-storybook-visual-certification.json` must show
`missingStoryCount: 0` and `statusCounts.passed` equal to the total evaluated
for both desktop and mobile.

## 5. Runtime audit contract

`tests/visual/design-system/token-purity-layout-audit.spec.ts` drives
Storybook headlessly. For each of the 470 visual component-like exports plus
all 28 recipes, at 1440x900, 768x1024, 390x844:

- Resolve export → story id (direct story, then generated certification
  story, then inventory-name fallback). Log any export that cannot resolve as
  `blocked`; it fails the gate.
- Inspect **every individual glass surface** in each story (not merely the
  first matching node or one representative surface). Every inspected surface
  must satisfy sections 2a–2f and section 3. Find at least one real glass
  surface per story (computed
  `backdrop-filter ≠ none`, or a `.glass*` / `glass-surface` /
  `liquid-glass` element). Storybook chrome (`.glass-on-light`,
  `.ag-story-panel`, `.ag-story-scene`, `.contrast-guard`,
  `.glass-contrast-guard`, `.glass-sr-only`, skip-links) is excluded from
  surface candidates.
- Generic `CertificationCase`/placeholder evidence is invalid. A recipe must
  resolve to its real recipe story and provide independent 1440x900, 768x1024,
  and 390x844 artifacts; a recipe smoke test cannot auto-pass certification.
- Every individual surface must pass sections 2a–2f; layout must pass section 3.
- `QuantumNeuromorphicEngine` is nonvisual and is excluded from Storybook
  screenshot enumeration; it must pass its dedicated API/behavior tests. It
  cannot be represented by a generated placeholder and cannot auto-pass the
  visual gate.
- On failure: write `reports/audit/<export-id>/<viewport>.png` and
  `reports/audit/<export-id>/<viewport>.computed-styles.json`, and record
  `{render, tokens, layout}` statuses with reasons in
  `reports/audit/audit-summary.json`. Exit non-zero on any failure.

## 6. Remediation policy

Fix only proven shipped-component violations:

- legacy `glass-base` → canonical glass/tokens (e.g. `GlassMorphingEngine.tsx`);
- low-contrast `text-white/30`-style text → canonical text tokens (e.g.
  `GlassOrbitalMenu.tsx`, `GlassProductRecommendations.tsx`);
- low-opacity backgrounds below 0.08 on shipped components → raise to the
  section-2b floor;
- missing/partial backdrop chain on a real glass surface → apply the canonical
  chain and a canonical blur;
- dark fill ≥ 0.50 on a real glass surface → replace with the scrim token.

Story/decorator-only hits are classified as evidence in `triage.md`, never
fixed. Re-run sections 4–5 after any fix and prove clean.

## 7. Final gate

`reports/audit/audit-summary.json` must contain, per export/recipe id:
`status: "pass"` for render, tokens, and layout, plus artifact paths; record
inventory counts (including the 470 visual + 1 nonvisual + 28 recipe split),
the 471-vs-439 discrepancy, static-sweep results, and matrix
evidence. Emit `reports/audit/audit-summary.md` with the pass table and
`reports/audit/triage.md` for evidence-only findings. The final gate
(`npm run audit:components` plus the runtime spec) must exit 0.
