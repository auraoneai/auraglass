// REQ-MAT-20 fixture driver: runs the real tokens.css emitter (the one
// scripts/tokens/build.mjs calls) over a small synthetic token set and writes
// the CSS to stdout. A var() cycle makes the emitter die (exit 1, stderr
// "tokens: shadcn bridge: var cycle ..."), exactly as it does inside tokens:build.
//
// usage: node tests/tokens/fixtures/shadcn/emit.mjs <case>
//   acyclic        the 8 contract names, no cycle; source block forced on
//   acyclic-gated  same, source block forced off (the REQ-MAT-20 fallback)
//   map-cycle      a shadcn map whose pairs point at each other
//   token-cycle    a base token that reads var(--primary) while the default
//                  direction emits --primary: var(--ag-color-accent)
import { emitTokensCss } from '../../../../scripts/tokens/formats/css-layered.mjs';

const BASE = {
  '--ag-color-canvas': 'oklch(0.98 0 0)',
  '--ag-color-on-surface': 'oklch(0.2 0 0)',
  '--ag-color-accent': 'oklch(0.64 0.16 235)',
  '--ag-color-on-accent': 'oklch(1 0 0)',
  '--ag-color-on-surface-muted': 'oklch(0.45 0 0)',
  '--ag-color-border': 'oklch(0.85 0 0)',
  '--ag-color-focus-inner': 'oklch(0.55 0.2 250)',
  '--ag-radius-md': '12px',
};

const CASES = {
  acyclic: { vars: BASE, opts: { shadcnSource: true } },
  'acyclic-gated': { vars: BASE, opts: { shadcnSource: false } },
  'map-cycle': {
    vars: BASE,
    opts: { shadcnSource: false, shadcnMap: { '--ag-color-canvas': '--ag-color-accent', '--ag-color-accent': '--ag-color-canvas' } },
  },
  'token-cycle': { vars: { ...BASE, '--ag-color-accent': 'var(--primary)' }, opts: { shadcnSource: false } },
};

const name = process.argv[2];
const c = CASES[name];
if (!c) {
  console.error(`unknown case: ${name}; expected one of ${Object.keys(CASES).join(', ')}`);
  process.exit(2);
}
// MAT-06: the emitter requires the density axis (definition, private factor and
// its public readout); a single-value axis keeps the fixture output minimal.
const DENSITY = { '--_ag-density': '1', '--ag-density': 'var(--_ag-density)' };
const AXIS_DEFS = { density: { default: 'regular', values: ['regular'] } };
const cells = Object.entries({ ...DENSITY, ...c.vars }).map(([cssVar, value]) => ({ name: cssVar, cssVar, renderType: 'string', value }));
process.stdout.write(await emitTokensCss(cells, AXIS_DEFS, new Map(), new Map(), c.opts));
