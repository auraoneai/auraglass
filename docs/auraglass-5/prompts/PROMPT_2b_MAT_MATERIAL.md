# PROMPT-2b (MAT lane M): Material engine and tiers

Stream index: `docs/auraglass-5/prompts/PROMPT_2_MAT.md` (its "Common rules" are binding here). Source PRD: `docs/auraglass-5/prd/AURAGLASS_MATERIAL_SYSTEM_PRD.md` (PRD-2, key MAT) §20 lane **M**. Frozen contract: `docs/auraglass-5/AURAGLASS_5_CONTRACTS.md` (`contract-v1.1`, wins on any conflict). Tasks: `docs/auraglass-5/tasks/MAT.json`, field `lane = "2b-M"` (91 tasks: MAT-095..185).

This lane starts on **day 0**, runs at the same time as every other MAT lane and every other stream, and waits for nothing: its `depends_on` edges stay inside this lane, and everything it needs from elsewhere is a frozen contract seam that exists at C0 as a type, seed, double, stub or verbatim file.

## Scope

**Owned paths (exclusive inside MAT):** `src/material/**` (except `generated/`), `scripts/tokens/lens-maps.mjs`, `scripts/mat/{verify-optics-css,count-glass-recipes,verify-material-runtime}.mjs`, `lint/rules/mat/{no-optics-outside-material,no-inline-glass}.cjs`, `tests/lint/mat/{no-optics-outside-material,no-inline-glass}.test.ts`, `tests/material/**` (except `exports/`), `tests/{e2e,visual,perf/browser}/mat/material/**`

**Delivers:** REQ-MAT-23..40

**Order inside the lane:** lint + recipe metric in ratchet mode → structural CSS on the seed ladders → components → tiers and dev counter → enhanced lens

**Requirements closed by this lane:** REQ-MAT-01, REQ-MAT-04, REQ-MAT-06, REQ-MAT-07, REQ-MAT-10, REQ-MAT-13, REQ-MAT-16, REQ-MAT-18, REQ-MAT-19, REQ-MAT-20, REQ-MAT-21, REQ-MAT-22, REQ-MAT-23, REQ-MAT-24, REQ-MAT-25, REQ-MAT-26, REQ-MAT-27, REQ-MAT-28, REQ-MAT-29, REQ-MAT-30, REQ-MAT-31, REQ-MAT-32, REQ-MAT-33, REQ-MAT-34, REQ-MAT-35, REQ-MAT-36, REQ-MAT-37, REQ-MAT-38, REQ-MAT-39, REQ-MAT-40, REQ-MAT-41, REQ-MAT-42, REQ-MAT-44, REQ-MAT-59, REQ-MAT-63, REQ-MAT-65, REQ-MAT-67.

## Branch and worktree

```bash
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin next release/4.x
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add ../AuraGlass.wt/mat-m -b next-mat/m-<topic> origin/next
```

Merge small PRs into `next` at least daily, each only after the GitLab pipeline for its head SHA is `success` (`node scripts/ci/gitlab-status.mjs --sha <sha>`, pipeline URL in the PR). A lane failure caused only by another stream's paths is reported `pre-existing` and does not block the PR (contract §2.3). Each PR carries `.changeset/mat-<slug>.md` and refreshes the MAT-owned `etc/api/*` reports it affects (`npm run api:update -- --entry <entry>`).

## Tasks

Read the full rows with `node -e 'for (const t of require("./docs/auraglass-5/tasks/MAT.json")) if (t.lane === "2b-M") console.log(JSON.stringify(t, null, 1))'`. The `description`, `test` and `acceptance` fields are binding; `source` names the archived task for traceability (archived text that names old PRD ids or GitHub workflows is superseded by the contract and by this prompt).

| ID | Action | File | Summary | Depends on | REQ |
|---|---|---|---|---|---|
| MAT-095 | CREATE | `NEW:src/material/types.ts` | Export exactly the architecture §4.2 types: MaterialVariant ('regular'\|'clear'\|'identity'), Thickness, Layer, ContentMaterial, Backdrop, Tier (incl. 'cinematic', TSDoc: … |  | REQ-MAT-22, REQ-MAT-23, REQ-MAT-24 |
| MAT-096 | CREATE | `NEW:scripts/mat/material-css-api.mjs` | Generate etc/api/material.css-api.json {public, private, attributes, privateAttributes} from the REQ-MAT-13 registry, the REQ-MAT-14 read-outs, … | MAT-095 | REQ-MAT-04, REQ-MAT-22, REQ-MAT-27, REQ-MAT-28, REQ-MAT-29 |
| MAT-097 | MODIFY | `lint/rules/mat/` | Add rule no-optics-outside-material: report keys backdropFilter/WebkitBackdropFilter and string/template literals matching /backdrop-filter\|-webkit-backdrop-filter/i, … |  | REQ-MAT-39 |
| MAT-098 | TEST | `NEW:tests/lint/mat/no-optics-outside-material.test.ts` | ESLint RuleTester with ≥1 invalid fixture per REQ-MAT-63 pattern (7+), template literal, style={{}} object, and a src/components/** story; valid fixtures in … | MAT-097 | REQ-MAT-39 |
| MAT-099 | MODIFY | `lint/rules/mat/` | Register 'auraglass/no-optics-outside-material': 'warn' for src/** (ratchet, §20 step 2); keep auraglass/no-inline-glass (:29) until MAT-118. Record the baseline … | MAT-097 | REQ-MAT-39 |
| MAT-100 | CREATE | `NEW:scripts/mat/verify-optics-css.mjs` | PostCSS scanner applying the REQ-MAT-63 optics patterns to src/**/*.css and *.module.css outside src/material/css/** and generated token CSS (no stylelint dependency; … |  | REQ-MAT-39 |
| MAT-101 | TEST | `NEW:tests/material/ci/verify-optics-css.test.ts` | node --test fixtures under tests/ci/fixtures/optics-css/: clean file → 0, violating *.module.css → reported with line, exempt src/material/css file → 0, ratchet … | MAT-100 | REQ-MAT-39 |
| MAT-102 | CREATE | `NEW:scripts/mat/count-glass-recipes.mjs` | Compute independent-glass-recipes N = distinct src files outside src/material/** and compiler output emitting a backdrop-filter/-webkit-backdrop-filter declaration or … |  | REQ-MAT-39 |
| MAT-103 | TEST | `NEW:tests/material/ci/count-glass-recipes.test.ts` | Fixture trees tests/ci/fixtures/glass-recipes/{zero,one,three}: 0/1/3 outside emitters + 1 inside src/material → N=1/2/4; ratchet with higher N exits 1; noRegression … | MAT-102 | REQ-MAT-39 |
| MAT-104 | CREATE | `NEW:src/material/defineMaterial.ts` | Build-time defineMaterial(spec) returning a frozen MaterialSpec with defaults; throws on blur >32, scrim blur >12, grain.opacity outside 0.02–0.04, opacityFloor cell … | MAT-095 | REQ-MAT-22 |
| MAT-105 | TEST | `NEW:src/material/__tests__/properties.test.ts` | PostCSS-parse src/material/css/generated/properties.css (DS output): exactly 12 @property names with REQ-MAT-13 syntax/inherits/initial values; all --_ag-* … | MAT-095 | REQ-MAT-28 |
| MAT-106 | CREATE | `NEW:src/material/css/material.css` | Create material.css: first line exactly '@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;' (SC-20, statement owned by PKG); imports generated … | MAT-105 | REQ-MAT-19, REQ-MAT-30 |
| MAT-107 | MODIFY | `src/material/css/material.css` | ::before (content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;pointer-events:none;backdrop-filter:blur(var(--_ag-blur)) … | MAT-106 | REQ-MAT-28, REQ-MAT-30 |
| MAT-108 | MODIFY | `src/material/css/material.css` | Set public read-outs on .ag-surface: --ag-surface-fill:var(--_ag-fill), --ag-surface-rim, --ag-surface-shadow:var(--_ag-shadow), --ag-surface-radius, --ag-on-surface, … | MAT-107 | REQ-MAT-29 |
| MAT-109 | MODIFY | `src/material/css/material.css` | Implement the exact REQ-MAT-15 tint formula (--_ag-alpha min/max/calc on --_ag-tint-floor and --ag-glass-opacity; --_ag-fill: oklch(from var(--ag-color-canvas) l c h / … | MAT-107 | REQ-MAT-29, REQ-MAT-10 |
| MAT-110 | MODIFY | `src/material/css/material.css` | [data-ag-backdrop=light\|dark\|media\|auto] blocks set inherited --_ag-env-* and backdrop-specific --ag-on-surface (glyph flip for small chrome; large surfaces raise … | MAT-109 | REQ-MAT-27, REQ-MAT-29 |
| MAT-111 | MODIFY | `src/material/css/material.css` | Nested rule verbatim: '.ag-surface .ag-surface:not([data-ag-allow-nested])::before{backdrop-filter:none;-webkit-backdrop-filter:none}' and … | MAT-107 | REQ-MAT-31 |
| MAT-112 | MODIFY | `src/material/css/material.css` | [data-ag-group]::before carries the group's compiled optics; '[data-ag-group] > .ag-surface::before{backdrop-filter:none;-webkit-backdrop-filter:none}'; children keep … | MAT-107 | REQ-MAT-31, REQ-MAT-26 |
| MAT-113 | MODIFY | `src/material/css/material.css` | '.ag-surface[data-ag-layer=content]:not([data-ag-variant])' renders content-raised\|content-sunken: opaque OKLCH fill from MaterialSpec.content, rim, grain on ::before … | MAT-107 | REQ-MAT-31 |
| MAT-114 | MODIFY | `src/material/css/material.css` | [data-disabled],[aria-disabled=true] set --_ag-surface-alpha: var(--ag-state-disabled-alpha) multiplied into fill alpha and pseudo-layer opacity (host opacity stays 1); … | MAT-109 | REQ-MAT-31 |
| MAT-115 | MODIFY | `src/material/css/material.css` | Consume ladder cells for blur (thin 12, regular 20, thick 32px; cap 32), one saturation value, scheme-resolved brightness in the fixed order blur() saturate() … | MAT-107 | REQ-MAT-01 |
| MAT-116 | MODIFY | `src/material/css/material.css` | Intent never tints the fill; [data-ag-prominent] mixes --ag-color-accent into --_ag-fill at ≤0.18 alpha (one per view, documented); rim/specular may take intent colour. | MAT-109 | REQ-MAT-01 |
| MAT-117 | CREATE | `NEW:src/material/assets/ag-grain-128.avif` | Generate 128×128 grain AVIF ≤4 KB deterministically via NEW scripts/build/make-grain.mjs (seeded noise); ::before background-image:url(../assets/ag-grain-128.avif), … | MAT-107 | REQ-MAT-23, REQ-MAT-25 |
| MAT-118 | MODIFY | `src/material/css/material.css` | ::after rim band: mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude (+ -webkit-mask-composite: xor); padding: … | MAT-107 | REQ-MAT-01 |
| MAT-119 | MODIFY | `src/material/css/material.css` | Fresnel approximation: second unmasked ::after radial-gradient layer anchored on the edge facing --ag-light-angle, fading to transparent within 8px of the edge. | MAT-118 | REQ-MAT-01 |
| MAT-120 | MODIFY | `src/material/css/material.css` | ::after sheen linear-gradient(var(--ag-light-angle), rgb(from var(--ag-color-specular) r g b / calc(var(--ag-specular) * 0.35)), transparent 40%) clipped to top-lit … | MAT-118 | REQ-MAT-07, REQ-MAT-28 |
| MAT-121 | MODIFY | `src/material/css/material.css` | Host box-shadow: var(--_ag-shadow) (ambient + key from shadow.{thin,regular,thick} × scheme, derived from layer × thickness; overlays use thick key) plus ::after inset … | MAT-107 | REQ-MAT-07, REQ-MAT-31 |
| MAT-122 | MODIFY | `src/material/css/material.css` | [data-ag-interactive]:hover raises --ag-specular to state.hover-specular; :active,[data-pressed] raise press glow in ::after; transition only on pseudo-layer opacity … | MAT-120 | REQ-MAT-42, REQ-MAT-44 |
| MAT-123 | MODIFY | `src/material/css/material.css` | clear over [data-ag-backdrop=light\|media] sets --_ag-dim:0.35 composited as a dark layer in ::before; … | MAT-110, MAT-115 | REQ-MAT-33 |
| MAT-124 | MODIFY | `src/material/css/material.css` | [data-ag-variant=identity]: ::before none, transparent fill, no rim, no shadow; data-ag-surface kept so ag.a11y rungs still apply. | MAT-107 | REQ-MAT-32 |
| MAT-125 | MODIFY | `src/material/css/material.css` | Standard needs no attribute. Lightweight rung under @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))), [data-ag-tier=lightweight] … | MAT-109, MAT-117 | REQ-MAT-35, REQ-MAT-27 |
| MAT-126 | CREATE | `NEW:src/material/css/lens.css` | Single eligibility selector :root[data-ag-engine=chromium]:has(svg[data-ag-lens-ready]) .ag-surface[data-ag-refraction][data-ag-layer=chrome] (lens-ready lives on … | MAT-115, MAT-183 | REQ-MAT-36 |
| MAT-127 | DOC | `src/material/types.ts` | Add type LensId = `ag-lens-${Shape}-${'control'\|'bar'\|'panel'}` and a lens.css header documenting the REQ-MAT-58 filter structure (feImage convex-squircle map n≈1.5 → … | MAT-126 | REQ-MAT-36 |
| MAT-128 | MODIFY | `src/material/css/material.css` | --ag-radius-inner: max(0px, calc(var(--ag-radius-outer) - var(--ag-inset))); [data-ag-shape=concentric]{border-radius:var(--ag-radius-inner, <fallbackRadius token var, … | MAT-107 | REQ-MAT-26, REQ-MAT-06 |
| MAT-129 | MODIFY | `src/material/css/material.css` | [data-ag-part=scroll-edge] sticky mask-image gradient (soft\|hard by data-ag-edge-style, emitted from the ScrollEdge edgeStyle prop; top\|bottom by data-ag-edge), height … | MAT-106 | REQ-MAT-26, REQ-MAT-63 |
| MAT-130 | TEST | `NEW:src/material/__tests__/css-contract.test.ts` | Assert the DS @media (pointer: coarse) block in generated/ladders.css lowers only thick blur 32→20px and grain to ≤0.02; thin/regular unchanged; implemented in CSS not … | MAT-105 | REQ-MAT-40 |
| MAT-131 | TEST | `src/material/__tests__/css-contract.test.ts` | Assert generated [data-ag-radius\|spacing\|inset\|sizeclass] selectors use token names only (no px in attribute values) and set only --ag-radius-outer, --ag-inset, … | MAT-096 | REQ-MAT-23 |
| MAT-132 | TEST | `src/material/__tests__/css-contract.test.ts` | PostCSS over material.css, lens.css, generated/*.css: first statement equals the SC-20 six-name order statement; 0 !important; every non-@property rule inside @layer … | MAT-125, MAT-126 | REQ-MAT-13, REQ-MAT-21 |
| MAT-133 | TEST | `NEW:src/material/__tests__/tailwind-bridge-parity.test.ts` | Normalised declaration blocks of @utility glass-regular, glass-clear, glass-thin, glass-thick, content-raised in the DS Tailwind bridge equal their [data-ag-*] … | MAT-113, MAT-115 | REQ-MAT-01 |
| MAT-134 | CREATE | `NEW:src/material/internal/resolveRole.ts` | Pure resolveRole(role, sizeClass?): layer default chrome; variant default regular (omitted for layer=content without explicit variant); content default content-raised … | MAT-095 | REQ-MAT-23, REQ-MAT-36 |
| MAT-135 | CREATE | `NEW:src/material/materialProps.ts` | materialProps(role) → {className:'ag-surface','data-ag-surface':'','data-ag-layer',…optional data-ag-variant\|thickness\|content\|shape and boolean ''-valued … | MAT-134 | REQ-MAT-23 |
| MAT-136 | CREATE | `NEW:src/material/Surface.tsx` | Surface: div default; render prop cloned (single node), className merged with clsx, consumer wins for non-data-ag-* attrs, role wins for data-ag-*; ref as prop … | MAT-135 | REQ-MAT-24, REQ-MAT-25 |
| MAT-137 | CREATE | `NEW:src/material/SurfaceGroup.tsx` | SurfaceGroup({spacing='2', children}): one element with materialProps({layer:'chrome'}) + data-ag-group='' + data-ag-spacing=<SpaceToken>; no variant/thickness props; … | MAT-135 | REQ-MAT-26 |
| MAT-138 | CREATE | `NEW:src/material/Environment.tsx` | Environment({backdrop, image?, video?, children}): data-ag-backdrop=backdrop, auto + image\|video → media; media layer <img decoding='async' alt='' aria-hidden='true'> … | MAT-095 | REQ-MAT-26, REQ-MAT-65 |
| MAT-139 | CREATE | `NEW:src/material/ScrollEdge.tsx` | ScrollEdge({edge='top', edgeStyle='soft'}) renders <div aria-hidden='true' data-ag-part='scroll-edge' data-ag-edge data-ag-edge-style>; the prop is edgeStyle, not style … | MAT-095 | REQ-MAT-26 |
| MAT-140 | CREATE | `NEW:src/material/ConcentricFrame.tsx` | ConcentricFrame({radius, inset, children}) emits data-ag-radius=<RadiusToken> and data-ag-inset=<SpaceToken>; no inline style. | MAT-095 | REQ-MAT-26 |
| MAT-141 | CREATE | `NEW:src/material/useMaterialTier.ts` | 'use client' hook on useSyncExternalStore: server snapshot 'standard'; reads <html data-ag-tier> (lightweight\|standard\|enhanced, else standard); one module-level … | MAT-095 | REQ-MAT-25 |
| MAT-142 | CREATE | `NEW:src/material/index.ts` | Barrel (no directive) exporting exactly the 8 values Surface, SurfaceGroup, Environment, ScrollEdge, ConcentricFrame, materialProps, defineMaterial, useMaterialTier and … | MAT-136, MAT-137, MAT-138, MAT-139, MAT-140, MAT-141, MAT-104 | REQ-MAT-22, REQ-MAT-37 |
| MAT-143 | CREATE | `NEW:src/material/dev/warnings.ts` | warnOnce(el,key,msg) with WeakSet, all call sites under process.env.NODE_ENV !== 'production'. Exact messages: '[aura-glass] allowNested at depth N at <selector>'; … | MAT-135 | REQ-MAT-31, REQ-MAT-33, REQ-MAT-36 |
| MAT-144 | CREATE | `NEW:src/material/dev/surfaceCounter.ts` | Dev-only startSurfaceCounter(root), called by the A11Y provider (A11Y-029): after mount and on requestIdleCallback after 500ms-debounced MutationObserver, count visible … | MAT-143 | REQ-MAT-38, REQ-MAT-36 |
| MAT-145 | TEST | `NEW:src/material/__tests__/materialProps.test.ts` | Matrix 4 layers × 3 variants × 3 thicknesses × 2 content × 3 shapes × 4 booleans: deep-equal determinism, no style key, defaults table, size-class↔thickness mapping, … | MAT-135 | REQ-MAT-23 |
| MAT-146 | TEST | `NEW:src/material/__tests__/Surface.test.tsx` | 36 roles (3 variants × 3 thicknesses × 4 layers) → getAttribute('style') === null; render keeps one DOM node; consumer style identical by reference; ref reaches … | MAT-136 | REQ-MAT-24 |
| MAT-147 | TEST | `NEW:src/material/__tests__/server-safe.test.tsx` | @jest-environment node: renderToString of Surface, SurfaceGroup, Environment, ScrollEdge, ConcentricFrame and materialProps output with no window/document/provider; … | MAT-142 | REQ-MAT-25, REQ-MAT-35 |
| MAT-148 | TEST | `NEW:src/material/__tests__/useMaterialTier.test.tsx` | Server snapshot standard; <html data-ag-tier> change re-renders within one act; unknown value → standard; observer disconnects after last unmount (spy on … | MAT-141 | REQ-MAT-25 |
| MAT-149 | TEST | `NEW:src/material/__tests__/components.test.tsx` | SurfaceGroup data-ag-group/data-ag-spacing default '2'; Environment backdrop and auto+image→media, media aria-hidden; ScrollEdge attrs/defaults; ConcentricFrame … | MAT-137, MAT-138, MAT-139, MAT-140 | REQ-MAT-26, REQ-MAT-65 |
| MAT-150 | TEST | `NEW:src/material/__tests__/dev-warnings.test.tsx` | clear without backdrop warns once per element; clear under auto warns; allowNested depth ≥2 warns once; refraction on content/overlay warns; counter crossing thresholds … | MAT-143, MAT-144 | REQ-MAT-31 |
| MAT-151 | TEST | `NEW:src/material/__tests__/import-side-effects.test.ts` | jsdom: spy addEventListener, setTimeout/setInterval, MutationObserver constructor, document.head.appendChild; require src/material → 0 calls; <html>/<head> attributes … | MAT-142 | REQ-MAT-23, REQ-MAT-25 |
| MAT-152 | CREATE | `NEW:scripts/mat/verify-material-runtime.mjs` | Grep gate over src/material/** excluding dev/ and __tests__/: fail on IntersectionObserver, requestAnimationFrame, setAttribute('data-ag-tier', dataset.agTier =, … | MAT-142 | REQ-MAT-35, REQ-MAT-37, REQ-MAT-27 |
| MAT-153 | DOC | `src/material/types.ts` | TSDoc on Tier and a section in etc/api/material.api.md: cinematic residents refract only library-owned pixels (no html-to-image/foreignObject/html2canvas), import only … | MAT-142 | REQ-MAT-37 |
| MAT-154 | TEST | `NEW:src/material/__tests__/hydration.test.tsx` | renderToString then hydrateRoot of every server-safe export (with and without <html data-ag-tier>) with console.error/console.warn spied: 0 calls. | MAT-147 | REQ-MAT-01 |
| MAT-155 | CREATE | `NEW:tests/material/helpers/computed.ts` | Helpers: computed.ts (pseudo-element backdropFilter and custom-property reads), pixels.ts (band luminance mean, variance, ΔE2000 from screenshots), density.ts (visible … |  | REQ-MAT-16 |
| MAT-156 | TEST | `NEW:tests/material/layer-stack.spec.ts` | Host backdrop-filter none; ::before carries blur; ::before --_ag-blur = ladder px (not 0px); ::after --ag-specular changes on [data-ag-interactive]:hover; host … | MAT-107, MAT-108 | REQ-MAT-28 |
| MAT-157 | TEST | `NEW:tests/material/nesting.spec.ts` | Nested surface ::before none and fill = inner fill; allowNested keeps optics and logs depth warning (dev story); portaled overlay inside nested tree keeps optics; … | MAT-111, MAT-114, MAT-173 | REQ-MAT-31 |
| MAT-158 | TEST | `NEW:tests/material/group.spec.ts` | 5-child SurfaceGroup toolbar → exactly 1 visible backdrop filter (density helper); children keep rim (::after background non-none) and shadow. (Cross-lane input 2e-B is … | MAT-112, MAT-137 | REQ-MAT-31 |
| MAT-159 | TEST | `NEW:tests/material/content-materials.spec.ts` | layer=content without variant: ::before backdrop none in standard, enhanced and lightweight; opaque fill alpha 1; sunken inset top shade; explicit variant=regular … | MAT-113 | REQ-MAT-31 |
| MAT-160 | TEST | `NEW:tests/material/optics.spec.ts` | Per §5.4 row: filter order blur() saturate() brightness(); 12/20/32px by thickness, none >32; saturation single value; brightness by scheme; prominent accent ≤0.18; … | MAT-115, MAT-116, MAT-117, MAT-118, MAT-119, MAT-120, MAT-121, MAT-122, MAT-123, MAT-174 | REQ-MAT-28 |
| MAT-161 | TEST | `NEW:tests/material/clear-fallback.spec.ts` | clear without declared backdrop and under nearest auto computes identical ::before filter and host fill to regular; clear under light/dark/media keeps clear cell. … | MAT-123 | REQ-MAT-33 |
| MAT-162 | TEST | `NEW:tests/material/tiers.spec.ts` | No attribute → standard; data-ag-tier=lightweight and forcedColors 'active' → fill alpha ≥0.85, ::before none, light-scheme fill OKLCH L >0.5 (no black slab); with A11Y … | MAT-125 | REQ-MAT-35, REQ-MAT-59 |
| MAT-163 | TEST | `NEW:tests/material/enhanced-gating.spec.ts` | Chromium + chrome + data-ag-refraction + svg[data-ag-lens-ready] (LensDefs) → ::before filter contains url(#ag-lens-<shape>-<sizeclass>); WebKit/Gecko and documents … | MAT-126, MAT-183 | REQ-MAT-36, REQ-MAT-35 |
| MAT-164 | TEST | `NEW:tests/material/kill-switches.spec.ts` | With <html data-ag-tier=enhanced>, subtree data-ag-tier=standard removes lens filter; subtree data-ag-transparency=tinted raises floor to tinted row; solid gives … | MAT-125 | REQ-MAT-27 |
| MAT-165 | TEST | `NEW:tests/material/webkit-literal.spec.ts` | WebKit only: over a hf-pattern scene, pixel variance under a regular surface drops ≥40% vs the same region without surface (blur actually applied via literal … | MAT-115 | REQ-MAT-34 |
| MAT-166 | TEST | `NEW:tests/material/no-auto-downgrade.spec.ts` | Production Storybook build: mount 20 surfaces, scripted scroll 5s; MutationObserver log shows 0 attribute mutations on <html> and surfaces; computed ::before filters … | MAT-152 | REQ-MAT-35 |
| MAT-167 | TEST | `NEW:tests/material/rsc-canary.spec.ts` | Run in QA L11 Consumer canaries against PKG's canaries/next16 (QA-086): a Server Component imports every server-safe material export; remote next build succeeds; page … | MAT-154 | REQ-MAT-25 |
| MAT-168 | TEST | `NEW:tests/material/responsive.spec.ts` | Coarse-pointer emulation: thick blur 20px, grain ≤0.02; 390×844 modal story ≤3 visible filters incl. scrim, scrim blur ≤12px; ScrollEdge height 16–32px and no overlap … | MAT-128, MAT-129, MAT-130, MAT-144 | REQ-MAT-38, REQ-MAT-40, REQ-MAT-36, REQ-MAT-06, REQ-MAT-26, REQ-MAT-63 |
| MAT-169 | TEST | `NEW:tests/material/a11y-coverage.spec.ts` | Each of the 8 certification/scenes ids (SC-28) under forced-colors, contrast-more and reduced-transparency emulation: 100% of live ::before filters belong to … |  | REQ-MAT-65 |
| MAT-170 | MODIFY | `tests/e2e/mat/axe.spec.ts` | Add every Material Lab story id to A11Y's browser axe spec (SC-30; no tests/material/axe.spec.ts): @axe-core/playwright with color-contrast enabled, 3 engines, 0 … | MAT-171, MAT-172, MAT-173, MAT-174 | REQ-MAT-65 |
| MAT-171 | CREATE | `NEW:src/material/stories/Material.Lab.stories.tsx` | Material.Lab.stories.tsx, title 'Material Lab', first six REQ-SB-18 stories in order: Overview, Regular, Clear, Identity, Content Raised, Content Sunken, each rendered … | MAT-142 |  |
| MAT-172 | CREATE | `NEW:src/material/stories/Material.Matrix.stories.tsx` | Grid 4 variants (regular, clear, identity, content-raised) × 3 thicknesses per scene generated from NEW src/material/stories/matrix.meta.ts typed metadata (not … | MAT-142 |  |
| MAT-173 | MODIFY | `src/material/stories/Material.Lab.stories.tsx` | Append the remaining six REQ-SB-18 stories in order: Tiers (lightweight/standard/enhanced; 'inert on this engine' when data-ag-engine ≠ chromium), Nesting & Groups … | MAT-171 |  |
| MAT-174 | CREATE | `NEW:src/material/stories/Material/Optics.stories.tsx` | Material/Optics (one story per §5.4 optic: blur ladder, grain on/off, rim only, light-angle sweep, specular, prominent, interaction, layer stack), NEW Material Lab … | MAT-142 | REQ-MAT-32 |
| MAT-175 | TEST | `NEW:tests/perf/browser/mat/material-surfaces.spec.ts` | Perf browser spec driven by PERF's tests/perf/harness/run-perf.mjs (SC-30; no tests/material/perf.spec.ts), run in QA L10: standard 6 surfaces hover+scroll ≥55 fps p50 … |  |  |
| MAT-176 | TEST | `src/material/css/material.css` | On a throwaway branch in the remote lane, revert one CSS rule per §5.2, §5.3, §5.4, §5.5, §5.7 and show the named spec fails each time; delete the branch afterwards; no … | MAT-156, MAT-157, MAT-160, MAT-162, MAT-163 | REQ-MAT-01 |
| MAT-177 | CREATE | `NEW:src/material/css/preview-v5.css` | [release/4.x 4.3] Apply the same compiled ladders.css/material.css under [data-ag-preview="v5"] (generated scoped copy from DS or scoped @import); neutralise 4.x inline … |  | REQ-MAT-41 |
| MAT-178 | TEST | `NEW:tests/material/preview-v5.spec.ts` | [release/4.x 4.3] Frozen 4.x consumer fixture (NEW tests/material/fixtures/frozen-4x/, built from 4.1.0 stories): without the attribute ΔE2000 ≤1 on 100% of pixels vs … | MAT-177 | REQ-MAT-41, REQ-MAT-20 |
| MAT-179 | CREATE | `NEW:scripts/mat/verify-recipe-removal.mjs` | rg -l "buildSurfaceStyles\|buildLiquidGlassStyles\|buildBackdropFilter\|createGlassStyle\|glassFoundation\|glassUtils\|liquidGlassUtils" src must return only src/compat/**; … |  | REQ-MAT-67 |
| MAT-180 | MODIFY | `lint/rules/mat/` | After each family deletion/migration PR, set auraglass/no-optics-outside-material to error for that family glob and add its files to noRegression in … |  | REQ-MAT-18 |
| MAT-181 | MODIFY | `lint/rules/mat/` | [main 5.0] Remove the auraglass/no-inline-glass rule (owned here, SC-16) from PKG's eslint-plugin-auraglass.js and its eslint.config.js:29 registration (MODIFY; the … |  | REQ-MAT-39 |
| MAT-182 | CREATE | `NEW:scripts/tokens/lens-maps.mjs` | Interim §16 PRD-15 (SC-37): deterministic build-time generator for the 9 convex-squircle displacement maps src/material/assets/lens/ag-lens-<shape>-<sizeclass>.png … | MAT-127 | REQ-MAT-36 |
| MAT-183 | CREATE | `NEW:src/material/lens/LensDefs.tsx` | Internal server-safe LensDefs (no hooks/effects/"use client"; not exported from aura-glass/material): one <svg data-ag-lens-defs data-ag-lens-ready aria-hidden="true" … | MAT-182, MAT-126 | REQ-MAT-36 |
| MAT-184 | TEST | `NEW:src/material/__tests__/lens-maps.test.ts` | 9 ids exactly matching ^ag-lens-(fixed\|capsule\|concentric)-(control\|bar\|panel)$; generator determinism; no feTurbulence; each map ≤3 KB; LensDefs renderToString … | MAT-182, MAT-183 | REQ-MAT-36 |
| MAT-185 | MODIFY | `src/material/css/material.css` | REQ-OVL-08 decision: add [data-ag-obscured] .ag-surface::before{backdrop-filter:none;-webkit-backdrop-filter:none} ONLY if dialog-perf 'obscured page' ΔE2000 p95 <=2.0 … | MAT-106 | REQ-MAT-31, REQ-MAT-01 |

## Contract seams this lane consumes

S-01, S-02, S-05, S-06, S-30, S-35, S-36, S-37, S-38, S-39, S-40, S-41, S-42, S-43, S-44, S-45, S-46, S-49, S-51. Day-0 forms are listed in the stream index prompt and in PRD §19. Code and test against the seed or double at its final path; switch to the real implementation by deleting nothing and renaming nothing when it lands.

## Done for this lane

1. Every task above is `done` with its `test` green in the GitLab pipeline of the merge SHA on `next` (or `release/4.x` for the 4.x rows), and every REQ listed above is closed by at least one of them.
2. No file outside the owned paths was edited; `contract:ownership`, `contract:conformance` and `contract:ci-fragments` are green.
3. No result rests on a seed, double or stub; rows that are still `pending` or `double-pass` are reported as such, not as passes.

```
MAT LANE M REPORT  contract-v1.1  next@<sha>
<TASK-ID> | <REQ ids> | test(s) | lane id (L1..L13) | PASS / FAIL / PENDING / DOUBLE-PASS / BLOCKED | GitLab pipeline URL
Contract PRs opened: <branch> — state
Open items touched: <id> — status
```
