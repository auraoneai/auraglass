# material API notes (MAT)

## ./material surface

Exports: `Surface`, `SurfaceGroup`, `Environment`, `ScrollEdge`,
`ConcentricFrame`, `materialProps`, `useMaterialTier` (contract `entries.ts`,
7 values). `defineMaterial` is a build-time module, not a public export.

## `cinematic` residents (input to EXP/labs)

`Tier` includes `cinematic` but core never returns it — `useMaterialTier`
resolves any unknown or labs-only value to `standard`, and `data-ag-tier` only
carries the `DomTier` subset. Labs-resident cinematic renderers must:

- refract **only library-owned pixels** — the displacement maps operate on the
  surface's own backdrop; no `html-to-image`, `foreignObject` or `html2canvas`
  rasterisation of the document;
- import public entry points only (`./material`, `./tokens`, `./motion`) —
  never `src/material/**` internals;
- use at most **1 WebGL context** per page;
- **pause** when offscreen and when `document.hidden`;
- fall back to the standard `Surface` under `data-ag-motion` `none`/`calm`,
  `data-ag-transparency` != `glass`, `forced-colors: active`, or GL context
  loss;
- produce **no import side effects** (no listeners, timers, observers or
  injected styles at module evaluation).
