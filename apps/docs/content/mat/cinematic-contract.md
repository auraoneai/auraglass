# Cinematic contract — the boundary between core and `@auraglass/labs`

`cinematic` is the fourth material tier (`lightweight | standard | enhanced |
cinematic`). It renders WebGL over library-owned pixels, and it exists **only
in `@auraglass/labs`** (SURF-owned package `packages/labs/**`). Core never
renders it (REQ-MAT-37, PRD-2 §4.4).

## What core guarantees

- `src/material/**` contains no WebGL, no `three` import, no `<canvas>`, no
  `getContext(`, and no auto-downgrade machinery (`IntersectionObserver`,
  `requestAnimationFrame`, `data-ag-tier` writes).
  `scripts/mat/verify-material-runtime.mjs` enforces this and prints
  `[verify-material-runtime] OK` when clean. It is registered as an L1 Static
  row in `fragments/lanes/mat.ts`.
- No core CSS selects a cinematic tier: `data-ag-tier` only ever holds a
  `DomTier` (`lightweight | standard | enhanced`), and `useMaterialTier()`
  never returns `'cinematic'` from core.

## Admission rules for a cinematic resident

A labs resident may render the cinematic tier only when it meets all seven
rules below. PRD-2 lists "pause offscreen and when hidden" as one clause; this
contract keeps those two as separate rules (3 and 4) because they fail
independently.

1. **Library-owned pixels only.** The resident refracts or distorts pixels
   that the library itself drew (its own textures, gradients or media the
   resident owns). It never rasterises application DOM (no DOM-to-canvas
   capture, no `html2canvas`-style snapshots, no `foreignObject` tricks).
2. **At most one WebGL context per page.** All cinematic residents on a page
   share a single WebGL context. A second resident reuses it and never calls
   `getContext('webgl'|'webgl2')` on a new canvas.
3. **Pause offscreen.** When the resident's canvas is outside the viewport,
   its render loop stops: no `requestAnimationFrame` callbacks and no timers
   run until it is visible again.
4. **Pause when the document is hidden.** On `visibilitychange` to
   `document.hidden === true`, the render loop stops and resumes only when the
   document is visible again.
5. **Standard `Surface` fallback.** The resident renders the standard core
   `Surface` instead of WebGL when any of these holds: motion preference is
   `calm` or `none`; resolved transparency is not `glass` (`tinted` or
   `solid`); forced colours are active; or the WebGL context is lost
   (`webglcontextlost`). The fallback is the core `Surface`, not a bespoke
   static frame.
6. **No import side effects.** Importing the resident's entry (in Node or the
   browser) does nothing at module scope: no `document`/`window` access, no
   canvas or context creation, no listeners, no timers. The labs package keeps
   `"sideEffects": false`.
7. **Public entries only.** The resident imports core only through public
   `aura-glass` entries in the package `exports` map, never
   `aura-glass/compat`, `aura-glass/src/**` or `aura-glass/dist/**`.

## Ownership

- Core side (MAT): this document, `scripts/mat/verify-material-runtime.mjs`
  and its L1 lane row.
- Labs side (SURF): the resident implementations under `packages/labs/**` and
  the labs admission checks described in `packages/labs/README.md`. A labs
  check that enforces one of the rules above cites its rule number here.
