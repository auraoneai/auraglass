/* fragments/codemods/mat.ts — MAT owns this file on both branches (§3.4).
 *
 * CodemodMappingFragment (S-39). Lane blocks are owned by MAT lanes
 * 2a-T..2e-B; edit only your own block. PLAT writes the transform code
 * (W-3) from the areaTransforms specs; the engines live under
 * packages/cli/src/migrate/4to5/transforms/<id>.ts.
 *
 * Field ownership:
 *   renames        — 2b-M / 2c-V / 2d-P (each lane's absorbed or renamed exports)
 *   props          — prop-grammar rows (component-scoped renames + value maps)
 *   cssVars        — 2a-T ONLY (MAT-075/076 generate the --glass-* -> --ag-* map;
 *                    keep this aligned with tokens/generated/compat-alias-map.json)
 *   removed        — every §9 row with no 5.x successor (doc links to #dep-*)
 *   deps           — PLAT-owned upstream; MAT does not write here
 *   areaTransforms — 2e-B (MAT-360/365 specs, verbatim task scope)
 *   fixtures       — 2e-B (MAT-361 fixtures shipped in this commit)
 *
 * TODO convention everywhere: TODO_MARKER = '// TODO(aura-glass 5): <reason>, see <doc>'.
 */
import type { CodemodMappingFragment } from '../../src/contracts/fragments';

// ---------------------------------------------------------------------------
// renames — canonical-names / imports-subpaths tables
// ---------------------------------------------------------------------------
const renames: NonNullable<CodemodMappingFragment['renames']> = [
  // --- lane 2b-M begin ---
  // §9 canonical-name rows: the 4.x glass/liquid component names absorbed by
  // the single 5.x Surface primitive and its siblings.
  { from: 'OptimizedGlass', fromEntry: '.', to: 'Surface', toEntry: '.' },
  { from: 'OptimizedGlassCore', fromEntry: '.', to: 'Surface', toEntry: '.' },
  { from: 'GlassAdvanced', fromEntry: '.', to: 'Surface', toEntry: '.' },
  { from: 'OptimizedGlassAdvanced', fromEntry: '.', to: 'Surface', toEntry: '.' },
  { from: 'GlassCore', fromEntry: './primitives', to: 'Surface', toEntry: '.' },
  { from: 'GlassPrimitive', fromEntry: './primitives', to: 'Surface', toEntry: '.' },
  { from: 'LiquidGlassEffectGroup', fromEntry: './primitives', to: 'SurfaceGroup', toEntry: '.' },
  { from: 'LiquidGlassScrollEdge', fromEntry: './primitives', to: 'ScrollEdge', toEntry: '.' },
  { from: 'LiquidGlassConcentricFrame', fromEntry: './primitives', to: 'ConcentricFrame', toEntry: '.' },
  // --- lane 2b-M end ---
  // --- lane 2d-P begin ---
  // MAT-066: the 4.3 shim name keeps resolving at ./theme through 4.x; the
  // codemod still points consumers at the 5.x name (compat-only rename).
  { from: 'createBrandGlassTheme', fromEntry: './theme', to: 'createBrandTheme', toEntry: './theme', compatOnly: true },
  // --- lane 2d-P end ---
  // --- lane 2c-V begin ---
  // --- lane 2c-V end ---
];

// ---------------------------------------------------------------------------
// props — prop-grammar rows
// ---------------------------------------------------------------------------
const props: NonNullable<CodemodMappingFragment['props']> = [
  // --- lane 2d-P begin ---
  // "comfortable"/"high-contrast" value removals ride the providers codemod
  // (see fragments/deprecations/mat.ts DEP-M0964..M0965); no component-scoped
  // prop renames are authored for MAT yet — lanes add rows here.
  // --- lane 2d-P end ---
];

// ---------------------------------------------------------------------------
// cssVars — the --glass-* -> --ag-* alias map (MAT-075/076, lane 2a-T only)
// ---------------------------------------------------------------------------
const cssVars = {
  // --- lane 2a-T begin ---
  // Populated from tokens/generated/compat-successors.json + compat-alias-map.json
  // once MAT-075 lands; every --glass-* name read in 4.x src/** and the frozen
  // consumer fixture gets a --ag-* successor or null.
  // --- lane 2a-T end ---
};

// ---------------------------------------------------------------------------
// removed — §9 exports with no 5.x successor
// ---------------------------------------------------------------------------
const removed: NonNullable<CodemodMappingFragment['removed']> = [
  // --- lane 2b-M begin ---
  { symbol: 'HoudiniGlassCard', entry: '.', reason: 'GPU/shader effects are labs-only over owned pixels, not part of core', doc: '#dep-m0839' },
  { symbol: 'HoudiniGlassProvider', entry: '.', reason: 'GPU/shader effects are labs-only over owned pixels, not part of core', doc: '#dep-m0840' },
  { symbol: 'LiquidGlassGPU', entry: '.', reason: 'GPU/shader effects are labs-only over owned pixels, not part of core', doc: '#dep-m0841' },
  { symbol: 'GlassWebGLShader', entry: '.', reason: 'GPU/shader effects are labs-only over owned pixels, not part of core', doc: '#dep-m0842' },
  { symbol: 'HeatGlass', entry: '.', reason: 'GPU/shader effects are labs-only over owned pixels, not part of core', doc: '#dep-m0843' },
  { symbol: 'Glass3DEngine', entry: '.', reason: 'GPU/shader effects are labs-only over owned pixels, not part of core', doc: '#dep-m0844' },
  { symbol: 'LiquidGlassBackdropSampler', entry: './primitives', reason: 'backdrop is declared, never sampled', doc: '#dep-m0818' },
  { symbol: 'useLiquidGlassBackdrop', entry: '.', reason: 'backdrop is declared, never sampled', doc: '#dep-m0819' },
  { symbol: 'useGlassProbes', entry: './hooks/useGlassProbes', reason: 'backdrop is declared, never sampled', doc: '#dep-m0820' },
  { symbol: 'createGlassStyle', entry: '.', reason: 'replaced by materialProps/MaterialSpec (aura-glass/material)', doc: '#dep-m0822' },
  { symbol: 'glassTokenUtils', entry: './tokens', reason: 'replaced by materialProps/MaterialSpec (aura-glass/material)', doc: '#dep-m0825' },
  { symbol: 'glassUtils', entry: './tokens', reason: 'replaced by materialProps/MaterialSpec (aura-glass/material)', doc: '#dep-m0826' },
  { symbol: 'liquidGlassUtils', entry: './tokens', reason: 'replaced by materialProps/MaterialSpec (aura-glass/material)', doc: '#dep-m0827' },
  // --- lane 2b-M end ---
];

// ---------------------------------------------------------------------------
// areaTransforms — 2e-B specs (MAT-360 / MAT-365). PLAT implements the
// transform modules from these specs; fixtures live under
// fragments/codemods/mat/fixtures/<id>/<case>/{input,output}.tsx.
// ---------------------------------------------------------------------------
const areaTransforms: NonNullable<CodemodMappingFragment['areaTransforms']> = [
  // --- lane 2e-B begin ---
  {
    id: 'reduced-motion-initial',
    module: 'packages/cli/src/migrate/4to5/transforms/reduced-motion-initial.ts',
    spec:
      'REQ-MOT-27: TypeScript-compiler-API codemod rewriting JSX animate={c ? {} : X} ' +
      '(also undefined/false, either branch, negated test) to initial={c ? false : ' +
      '<original initial>} + unconditional animate={X}; leaves initial absent if none ' +
      'existed; text-span edits preserve formatting. Area id registered by REL in the ' +
      '§11.2 catalogue and schema enum (SC-33); engine DX-041, catalogue DX-042; TODO ' +
      "marker `// TODO(aura-glass 5): <reason>, see docs/motion.md`.",
  },
  {
    id: 'motion-imports',
    module: 'packages/cli/src/migrate/4to5/transforms/motion-imports.ts',
    spec:
      "§11 item 2 / REQ-MOT-T21 (SC-33): hooks -> usePreference('motion') !== 'full'; " +
      'unwrap ReducedMotionProvider; skip MotionPreferenceProvider (handled by the core ' +
      'providers transform DX-046); <Motion preset> -> plain element + TODO(aura-glass 5) ' +
      'marker; JS token rewrites ANIMATION.DURATION.normal -> motionTokens.duration.small, ' +
      'bounce/elastic -> ease.standard + TODO (there is no tokens transform id). Mapping ' +
      'data only from generated mappings/*.json and <Component>.meta.ts migration fields.',
  },
  {
    id: 'motion-props',
    module: 'packages/cli/src/migrate/4to5/transforms/motion-props.ts',
    spec:
      '§11 item 2 / REQ-MOT-T21 (SC-33): delete removed motion props; magnetic -> ' +
      'aura-glass/motion magnetic() + TODO; RippleButton -> Button. Mapping data only ' +
      'from generated mappings/*.json and <Component>.meta.ts migration fields.',
  },
  // --- lane 2e-B end ---
];

// ---------------------------------------------------------------------------
// fixtures — <id>/<case>/{input,output}.tsx dirs authored by the stream
// ---------------------------------------------------------------------------
const fixtures: NonNullable<CodemodMappingFragment['fixtures']> = [
  // --- lane 2e-B begin ---
  // MAT-361 (REQ-MOT-T21): reduced-motion-initial cases; every output is
  // byte-identical on a second run (already-fixed/idempotent cases encode that).
  'fragments/codemods/mat/fixtures/reduced-motion-initial/prefers-reduced-motion',
  'fragments/codemods/mat/fixtures/reduced-motion-initial/reduced-motion-var',
  'fragments/codemods/mat/fixtures/reduced-motion-initial/negated-should-animate',
  'fragments/codemods/mat/fixtures/reduced-motion-initial/either-branch',
  'fragments/codemods/mat/fixtures/reduced-motion-initial/nested-ternary',
  'fragments/codemods/mat/fixtures/reduced-motion-initial/multiline-attribute',
  'fragments/codemods/mat/fixtures/reduced-motion-initial/false-literal',
  'fragments/codemods/mat/fixtures/reduced-motion-initial/already-fixed',
  // MAT-365: motion-imports + motion-props cases.
  'fragments/codemods/mat/fixtures/motion-imports/use-reduced-motion-hook',
  'fragments/codemods/mat/fixtures/motion-imports/reduced-motion-provider-unwrap',
  'fragments/codemods/mat/fixtures/motion-imports/motion-preset',
  'fragments/codemods/mat/fixtures/motion-imports/js-token-duration',
  'fragments/codemods/mat/fixtures/motion-imports/js-token-easing',
  'fragments/codemods/mat/fixtures/motion-imports/idempotent',
  'fragments/codemods/mat/fixtures/motion-props/removed-props',
  'fragments/codemods/mat/fixtures/motion-props/magnetic-prop',
  'fragments/codemods/mat/fixtures/motion-props/ripple-button',
  'fragments/codemods/mat/fixtures/motion-props/idempotent',
  // --- lane 2e-B end ---
];

export default {
  names: ['GlassScript'],
  renames,
  props,
  cssVars,
  removed,
  areaTransforms,
  fixtures,
} satisfies CodemodMappingFragment;
