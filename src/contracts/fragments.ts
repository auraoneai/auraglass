/* AuraGlass 5.0 contract-v1.0. CONTRACT-owned. Every fragments/<kind>/<stream>.ts default-exports `[...] satisfies <Type>`. */
export type StreamKey = 'plat' | 'mat' | 'cmp' | 'surf' | 'qual';

// ---- S-38 deprecations (was SC-02/SC-03; envelope generated as {"$schema","version":1,"entries":[...]}) ----
export type DeprecationKind = 'export' | 'subpath' | 'prop' | 'prop-value' | 'css-var' | 'css-global' | 'peer'
  | 'dependency' | 'engine' | 'behavior' | 'cli' | 'data-attr' | 'asset';
export interface DeprecationEntry {
  id: `DEP-${'P' | 'M' | 'C' | 'S' | 'Q'}${number}`;   // per-stream id space: DEP-P0001 (PLAT) ... DEP-S0001 (SURF); no collisions
  kind: DeprecationKind;
  status: 'active' | 'planned';
  entry: string;                        // 4.x subpath, e.g. '.', './navigation'
  symbol: string;
  since: `4.${number}.${number}`;
  removeIn: '5.0.0' | '6.0.0';
  replacement: string | null;
  codemod: CodemodId | null;
  automation: 'full' | 'mostly' | 'partial' | 'manual' | 'none';
  breaking: `B${number}`;               // architecture §14.5 B1..B16
  message: string;                      // <= 200 chars
  doc: `#dep-${string}`;
  compat?: string;                      // aura-glass/compat export that keeps it working in 5.x
  exception?: 'security' | 'privacy' | 'crash' | 'legal' | 'honesty';
  evidence?: string;
}
export type DeprecationFragment = readonly DeprecationEntry[];

// ---- S-39 codemods (was SC-33) ----
export const CORE_CODEMODS = ['imports-subpaths', 'canonical-names', 'prop-grammar', 'dead-optical-props', 'providers', 'css-vars', 'deps', 'removed'] as const;
export const AREA_CODEMODS = { 'ai-chat': 'surf', 'app-shell-slots': 'surf', 'media-backdrops': 'surf',
  'reduced-motion-initial': 'mat', 'motion-imports': 'mat', 'motion-props': 'mat' } as const;
export type CodemodId = (typeof CORE_CODEMODS)[number] | keyof typeof AREA_CODEMODS;
export interface CodemodMappingFragment {
  renames?: Array<{ from: string; fromEntry: string; to: string; toEntry: string; compatOnly?: boolean }>;   // canonical-names, imports-subpaths
  props?: Array<{ component: string; from: string; to: string | null; values?: Record<string, string | Record<string, unknown>>; todo?: string }>; // prop-grammar
  cssVars?: Record<`--glass-${string}`, `--ag-${string}` | null>;   // css-vars (MAT supplies the alias map)
  removed?: Array<{ symbol: string; entry: string; reason: string; registryItem?: string; doc: string }>;  // removed
  deps?: Array<{ pkg: string; range: string; when: string }>;      // deps (PLAT)
  areaTransforms?: Array<{ id: keyof typeof AREA_CODEMODS; module: string /* packages/cli/src/migrate/4to5/transforms/<id>.ts, written by PLAT from this spec */; spec: string }>;
  fixtures?: string[];                  // fragments/codemods/<stream>/fixtures/<id>/<case>/ dirs the stream authored (never under packages/cli/)
}
export const TODO_MARKER = '// TODO(aura-glass 5): <reason>, see <doc>' as const;

// ---- S-44 budgets (was SC-15) ----
export interface SizeBudgetRow { id: string; import: string /* e.g. "{ Button } from 'aura-glass'" or 'aura-glass/data.css' */; limitBytes: number; kind: 'js' | 'css' }
export const DEFAULT_CEILINGS = { subpathCssBytes: 8192, stylesCssBytes: 32768, tarballBytes: 2 * 1024 * 1024, nodeColdImportMs: 150 } as const;
export const PROVISIONAL_ROWS = { Button: 10240, Dialog: 20480, Select: 25600, Table: 46080, AiThreadMessageComposer: 25600, MaterialJs: 3072, SingleIcon: 1024 } as const;
export interface PerfBudgetRow {
  subject: string;                      // story id or component name
  profile: 'mid-mobile' | 'desktop-120hz';
  metric: 'frame-p95-ms' | 'long-tasks' | 'blurred-surfaces' | 'bci' | 'lcp-ms' | 'grade';
  max: number | 'A' | 'B' | 'C';
  provisional: boolean;                 // true until the alpha.1 calibration PR (D-26); afterwards ratchet-down only
}

// ---- S-43 lane registration ----
export type LaneId = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7' | 'L8' | 'L9' | 'L10' | 'L11' | 'L12' | 'L13' | 'L14';
export interface LaneRegistration {
  lane: LaneId;
  kind: 'node-script' | 'jest' | 'playwright' | 'story-subjects' | 'manual-record';
  path: string;                         // glob or file inside the registering stream's own paths
  scope: 'pr' | 'main' | 'release' | 'nightly';
  remote: boolean;                      // true for every browser, perf and heavy lane (machine policy)
  failClosed: true;
}
export interface PlaywrightProjectFragment { name: `${StreamKey}:${string}`; testDir: string; testMatch?: string; use?: Record<string, unknown> }

// ---- S-45 other fragments ----
export interface CssFragment { file: string; layer: 'ag.compat' | 'ag.reset' | 'ag.tokens' | 'ag.material' | 'ag.components' | 'ag.a11y'; bundle: 'styles.css' | 'tokens.css' | 'material.css' | 'data.css' | 'date.css' | 'ai.css' | 'media.css' | 'app-shell.css' | 'backdrops.css' | 'compat/tokens.css' | 'compat/globals.css'; order?: number }
export interface SideEffectException { module: string; reason: string; expires: string /* version */ }
export interface ReviewItem { id: string; subject: string; criterion: 'specular-quality' | 'optical-hierarchy' | 'radius-rhythm' | 'one-hand' | 'other'; note?: string }
export interface LiteralsBaseline { version: 1; files: Record<string, Partial<Record<'color' | 'blur' | 'radius' | 'shadow' | 'duration' | 'easing' | 'spring', number>>> }
export interface A11yBaseline { version: 1; violations: Array<{ subject: string; rule: string; count: number; issue: string }> }
export interface SrRecord { flagship: string; at: 'voiceover-macos' | 'voiceover-ios' | 'nvda-chrome' | 'talkback-chrome' | 'touch'; result: 'pass' | 'fail'; date: string; tester: string; notes?: string; sha: string }
export type RegistryItemOwner = { id: string; type: 'registry:base' | 'registry:block' | 'registry:item'; owner: 'PLAT' | 'CMP' | 'SURF'; ga: boolean };
export type FragmentKind = 'deprecations' | 'codemods' | 'size-budgets' | 'perf-budgets' | 'lanes' | 'playwright' | 'css' | 'side-effects' | 'review' | 'literals-baseline' | 'a11y-baseline';
