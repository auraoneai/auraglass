# alpha-smoke fixture

The REQ-PLAT-103 fallback quickstart target used by
`tests/dx/quickstart.spec.ts` while `registry/blocks/app-frame/` is absent or
its `meta.auraglass.certified` is not the run's SHA. The spec then runs every
quickstart step except `add app-frame`, and in place of the block edit copies:

- `components/alpha-smoke/AlphaSmoke.tsx` — `Surface` (a chrome-layer header
  over a declared media backdrop), `Button` and `Dialog` from the packed
  `aura-glass`;
- `app/page.tsx` (Next.js) or `src/App.tsx` (Vite) — the same file the
  quickstart's edit step replaces, rendering `AlphaSmoke`.

Every check (timings, material presence, console errors, client boundary,
`glass-regular` parity) still runs against this page; the cell is recorded as
`pending` in `.artifacts/plat/quickstart-timing.json` because the GA checklist
measures `app-frame` only.
