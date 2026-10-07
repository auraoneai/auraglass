---
"aura-glass": patch
---

Contract fragment: `fragments/codemods/mat.ts` — MAT codemod mapping data (S-39).

- `renames` for the absorbed glass/liquid names (OptimizedGlass*, GlassCore, GlassPrimitive, LiquidGlassEffectGroup/ScrollEdge/ConcentricFrame -> Surface family) and the 4.3 `createBrandGlassTheme` compat alias
- `removed` rows for the no-successor exports (GPU/shader set, backdrop samplers, mixin/token utils) with `#dep-*` doc links
- `areaTransforms` specs for `reduced-motion-initial` (MAT-360), `motion-imports` and `motion-props` (MAT-365) — PLAT implements the transform modules
- `fixtures`: 18 input/output case dirs under `fragments/codemods/mat/fixtures/` (MAT-361) covering prefersReducedMotion/reducedMotion/`!shouldAnimate`, either-branch, nested ternary, multiline, `useReducedMotion()` unwrap, `ReducedMotionProvider` unwrap, `<Motion preset>` -> element + TODO, ANIMATION token rewrites, removed motion props, `magnetic` -> `aura-glass/motion`, `RippleButton` -> `Button`, and idempotence cases
- `cssVars` block reserved for 2a-T (MAT-075/076 generated alias map)
