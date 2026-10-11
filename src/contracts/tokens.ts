/* AuraGlass 5.0 contract-v1.2. CONTRACT-owned. */
export type RadiusToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';           // 6/10/14/20/28/9999px (§5.2)
export type SpaceToken = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16'; // n × 4px (4pt grid)
export type TypeRole = 'display' | 'title-1' | 'title-2' | 'title-3' | 'body' | 'callout' | 'caption' | 'label' | 'mono';
export type SysColor = 'canvas' | 'on-surface' | 'on-surface-muted' | 'accent' | 'on-accent' | 'border'
  | 'focus-inner' | 'focus-outer' | 'specular' | 'danger' | 'warning' | 'success' | 'info';
export type ZLayer = 'content' | 'chrome' | 'overlay' | 'transient' | 'toast';

/** S-03: every public custom property. Anything else starting with --ag- fails MAT's dead/undefined-var gate. */
export const PUBLIC_CSS_VARS = {
  light: ['--ag-light-angle', '--ag-specular', '--ag-glass-opacity'],
  readouts: ['--ag-surface-fill', '--ag-surface-rim', '--ag-surface-shadow', '--ag-surface-radius', '--ag-on-surface', '--ag-on-surface-muted'],
  shape: ['--ag-radius-outer', '--ag-inset', '--ag-radius-inner'],
  focus: ['--ag-focus-inner', '--ag-focus-outer', '--ag-focus-width'],
  layout: ['--ag-scroll-padding-top', '--ag-scroll-padding-bottom'],
  color: ['canvas', 'on-surface', 'on-surface-muted', 'accent', 'on-accent', 'border', 'focus-inner', 'focus-outer',
    'specular', 'danger', 'warning', 'success', 'info'].map((c) => `--ag-color-${c}`),
  space: ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16'].map((s) => `--ag-space-${s}`),
  radius: ['xs', 'sm', 'md', 'lg', 'xl', 'full'].map((r) => `--ag-radius-${r}`),
  type: ['display', 'title-1', 'title-2', 'title-3', 'body', 'callout', 'caption', 'label', 'mono']
    .flatMap((t) => [`--ag-type-${t}-size`, `--ag-type-${t}-leading`, `--ag-type-${t}-weight`]),
  font: ['--ag-font-sans', '--ag-font-mono'],
  shadow: ['--ag-shadow-thin', '--ag-shadow-regular', '--ag-shadow-thick'],
  z: ['content', 'chrome', 'overlay', 'transient', 'toast'].map((z) => `--ag-z-${z}`),
  state: ['--ag-state-hover-specular', '--ag-state-press-glow', '--ag-state-disabled-alpha'],
  target: ['--ag-target-min', '--ag-target-coarse'],                            // 24px / 44px
  density: ['--ag-density'],                                                    // 0.875 | 1 | 1.125
  scrim: ['--ag-scrim-clear', '--ag-scrim-media'],                             // 0.35 / media scrim
  motion: [/* see src/contracts/motion.ts MOTION_CSS_VARS */],
  // C-7 (v1.2): MAT component tokens consumed by CMP CSS (REQ-FIN-11, REQ-CMP-19/-45). Every other comp/sys output is --_ag-*.
  comp: ['sm', 'md', 'lg'].flatMap((s) => ['compact', 'default', 'spacious'].map((d) => `--ag-comp-control-height-${s}-${d}`)),
  switchTrack: ['w', 'h'].flatMap((a) => ['sm', 'md', 'lg'].map((s) => `--ag-switch-track-${a}-${s}`)),
  shadcn: ['--background', '--foreground', '--primary', '--primary-foreground', '--muted', '--border', '--ring', '--radius'],
} as const;

/** Private namespaces. --_ag-* is MAT's; components use --_ag-<component>-* inside their own CSS only. */
export const PRIVATE_VAR_PREFIX = '--_ag-' as const;
export type ComponentPrivateVar<K extends string> = `--_ag-${K}-${string}`;

/** S-04: CSS layers. Every shipped CSS file starts with exactly this statement (no !important anywhere). */
export const CSS_LAYERS = ['ag.compat', 'ag.reset', 'ag.tokens', 'ag.material', 'ag.components', 'ag.a11y'] as const;
export type CssLayer = (typeof CSS_LAYERS)[number];
export const LAYER_ORDER_STATEMENT = '@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;' as const;
export const LAYER_CONTENT_OWNER: Record<CssLayer, string> = {
  'ag.compat': 'PLAT (compat/globals.css) + MAT (compat/tokens.css)',
  'ag.reset': 'PLAT (scoped under :where([data-ag-root],[data-ag-surface]))',
  'ag.tokens': 'MAT',
  'ag.material': 'MAT',
  'ag.components': 'CMP and SURF, each in its own <Name>.css files',
  'ag.a11y': 'MAT',
};
export const TAILWIND_BRIDGE_ORDER = '@layer theme, base, ag, components, utilities;' as const; // PLAT, §5.5

/** S-10/S-11: generated token module and manifest (MAT compiler is the only writer). */
export interface TokenManifestEntry {
  name: string;                 // DTCG path, e.g. 'sys.color.canvas'
  cssVar: `--ag-${string}`;
  type: 'color' | 'dimension' | 'number' | 'duration' | 'cubicBezier' | 'motion-spring' | 'shadow' | 'glass-material' | 'fontFamily' | 'fontWeight';
  tier: 'sys' | 'material' | 'comp';   // 'ref' never appears in the manifest
  modes: Partial<Record<'light' | 'dark' | 'more' | 'tinted' | 'solid' | 'compact' | 'spacious', string>>;
  value: string;                // resolved default (light, standard, glass, regular)
}
export interface TokenManifest { version: 1; generatedFrom: 'tokens/**/*.tokens.json'; tokens: TokenManifestEntry[] }
export const TOKEN_OUTPUTS = {
  css: 'dist/tokens.css',                       // @layer ag.tokens
  manifest: 'dist/tokens/manifest.json',
  ts: 'src/tokens/index.ts',                    // generated; exported as aura-glass/tokens
  motionTs: 'src/motion/tokens.generated.ts',
  ladders: 'src/material/css/generated/ladders.css',
  floors: 'src/material/css/generated/floors.css',
  compat: 'dist/compat/tokens.css',             // from tokens/compat-alias-map.json, @layer ag.compat
  // C-7 (v1.2): the other outputs tokens:build actually writes and ships or commits. Anything not listed here is not
  // written by the build (e.g. dist/css/* copies and tokens/contrast/busy-reference.json are not build outputs).
  generated: ['src/tokens/generated/tokens.ts', 'src/tokens/generated/tokens.d.ts', 'src/tokens/generated/material-spec.ts',
    'src/tokens/generated/presets.ts', 'src/tokens/generated/manifest.ts'],
  properties: 'src/material/css/generated/properties.css',
  tailwind: 'dist/tailwind.css',                // ./tailwind.css subpath, TAILWIND_BRIDGE_ORDER
  contrastMatrix: 'dist/contrast-matrix.json',
  opacityFloors: 'tokens/generated/opacity-floors.json',
  registry: 'dist/tokens/registry-cssvars.json',
} as const;
