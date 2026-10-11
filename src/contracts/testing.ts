/* AuraGlass 5.0 contract-v1.2. CONTRACT-owned. Runtime helpers implemented by QUAL in tests/helpers/index.ts. */
import type * as React from 'react';
import type { Backdrop, DomTier, Transparency } from './material';
import type { Scheme, Contrast } from './preferences';
import type { MotionPreference } from './motion';

// ---- S-42 scenes (was SC-28) ----
export const SCENES = ['photo', 'saturated-abstract', 'dense-text', 'dark-media', 'flat-white', 'flat-black', 'hf-pattern', 'video-frame'] as const;
export type SceneId = (typeof SCENES)[number];
export const SCENE_ASSETS = { dir: 'certification/scenes/', manifest: 'certification/scenes/scenes.manifest.json', storybookStaticPath: '/scenes', storyId: (id: SceneId) => `scenes--${id}` } as const;
export const SCENE_BACKDROP: Record<SceneId, Backdrop> = { photo: 'media', 'saturated-abstract': 'media', 'dense-text': 'light',
  'dark-media': 'media', 'flat-white': 'light', 'flat-black': 'dark', 'hf-pattern': 'media', 'video-frame': 'media' };
export const COMPOSITES = ['white', 'black', 'busy'] as const;   // contrast-gate inputs; never called "backdrops"

// ---- S-43 lanes (was SC-29) ----
export const LANES = { L1: 'Static', L2: 'Artifact', L3: 'Change class', L4: 'Token contrast', L5: 'Behaviour', L6: 'Environment visual',
  L7: 'Pixel regression', L8: 'Engine-specific', L9: 'Motion', L10: 'Performance', L11: 'Consumer canaries', L12: 'Unit',
  L13: 'Manual SR', L14: 'Human visual review' } as const;
/** CI is GitLab CI only (§4.13). No GitHub Actions workflow exists; these are GitLab job names. */
export const CI = { root: '.gitlab-ci.yml', fragment: (s: 'plat' | 'mat' | 'cmp' | 'surf' | 'qual') => `ci/${s}.gitlab-ci.yml`,
  project: 'chahal-foundation-group/github-auraoneai/auraglass', projectId: 87152036 } as const;
export const STAGES = ['contract', 'build', 'test', 'package', 'certify', 'deploy', 'publish'] as const; // v1.2: package before certify (qual:certify:* need plat:package:pack)
export type CiScope = 'pr' | 'main' | 'nightly' | 'release';     // $AG_SCOPE, set by workflow:rules in .gitlab-ci.yml
export type CiLine = '4x' | '5x';                                // $AG_LINE
export const LANE_COMMAND = 'node certification/run.mjs --lane <id> --scope $AG_SCOPE' as const;
/** Jobs whose failure fails the pipeline that gates a PR (§2.3). Was REQUIRED_CHECKS ('Glass Quality Gates', 'Next.js npm Integration',
    'Vite npm Integration', 'change-class', 'ownership', 'contract-conformance'). contract:* are blocking from C0; the rest from activation. */
export const REQUIRED_JOBS = ['contract:ownership', 'contract:conformance', 'contract:ci-fragments', 'plat:gate:glass-quality',
  'plat:integration:next', 'plat:integration:vite', 'plat:gate:change-class'] as const;
/** QUAL lane jobs (was certify-l1..l12 in certify-pr.yml/certify-main.yml). L13/L14 are release artifacts, not jobs. */
export const CERT_JOBS = ['qual:certify:l1', 'qual:certify:l2', 'qual:certify:l3', 'qual:certify:l4', 'qual:certify:l5', 'qual:certify:l6',
  'qual:certify:l7', 'qual:certify:l8', 'qual:certify:l9', 'qual:certify:l10', 'qual:certify:l11', 'qual:certify:l12'] as const;
/** Every job name another stream (or the root) may reference in `needs` (always with optional: true, §4.13.4). */
export const CI_JOBS = { root: ['contract:ownership', 'contract:conformance', 'contract:ci-fragments'],
  plat: ['plat:build:dist', 'plat:package:pack', 'plat:gate:glass-quality', 'plat:gate:change-class', 'plat:integration:next',
    'plat:integration:vite', 'plat:build:docs', 'plat:publish:npm', 'pages'],
  mat: ['mat:build:tokens'],
  qual: ['qual:build:storybook', ...CERT_JOBS, 'qual:certify:nightly', 'qual:certify:release'],
  cmp: [], surf: [] } as const;
export const REQUIRED_CHECKS = REQUIRED_JOBS;   // alias kept for archived references; do not use in new code
export const VISUAL_TOLERANCE = { pixelmatchThreshold: 0.1, includeAA: false, changedRatio: 0.001 } as const; // was SC-09

// ---- S-48 evidence (was SC-07). GitLab job artifacts; never committed. ----
export const EVIDENCE = { dirEnv: 'AURAGLASS_EVIDENCE_DIR', defaultDir: '.artifacts',
  /** each job writes only under .artifacts/<stream>/<CI_JOB_NAME_SLUG>/ so artifacts from several jobs merge without collisions */
  jobDir: '.artifacts/<stream>/<job-slug>/', artifactName: 'evidence-$CI_JOB_NAME_SLUG-$CI_COMMIT_SHORT_SHA',
  expireIn: { pr: '14 days', main: '14 days' /* plus GitLab "keep latest artifacts" per ref */, nightly: '30 days', release: '90 days' },
  committed: false,
  /** Tarball hand-off: any lane that needs the package runs plain `npm pack --pack-destination .artifacts/pack` (or reads AURAGLASS_TARBALL
      when plat:package:pack ran in the same pipeline and exported it through its dotenv report). No lane depends on a PLAT pack script existing. */
  tarballEnv: 'AURAGLASS_TARBALL', tarballDir: '.artifacts/pack' } as const;

// ---- S-55 cross-stream report artifacts (QUAL writes; PLAT reads). Paths are relative to the pipeline's merged artifacts. ----
export const REPORTS = { visualClass: '.artifacts/qual/visual-class.json', perf: '.artifacts/qual/perf-report.json',
  releaseVerdict: '.artifacts/qual/release-verdict.json', subjects: 'storybook-static/cert-manifest.json' } as const;
export interface VisualClassReport { version: 1; sha: string; base: string;
  cells: Array<{ cell: string /* <storyId>|<scene>|<engine>|<axes> */; changedRatio: number; changed: boolean; reason?: string }>;
  changedCount: number }      // archived REL-040 shape; written by qual:certify:l7, read by plat:gate:change-class, which decides the class
export interface PerfReport { version: 1; sha: string;
  subjects: Array<{ subject: string; profile: PerfProfileId; metrics: Record<string, number>; grade: 'A' | 'B' | 'C' | 'D' | 'F' }> } // read by PLAT docs-claims (G-14)
export type PerfProfileId = 'mid-mobile' | 'desktop-120hz';
export interface ReleaseVerdict { version: 1; sha: string; tag: string;
  items: Array<{ id: `G-${string}`; status: 'pass' | 'fail' | 'pending' }>; ga: boolean /* true only when every G-01..G-16 item is pass */ } // read by plat:publish:npm
export interface SubjectIndex { version: 1; stories: Array<{ id: string; subject: string; kind: StoryKind; tags: readonly string[];
  owner: 'CMP' | 'SURF' | 'MAT' | 'QUAL' | 'PLAT' }> }   // generated by QUAL from parameters.ag at storybook build; seed builds it from index.json tags

// ---- S-41 story metadata (was REQ-QA-01, REQ-SB-05/12/42) ----
export type StoryKind = 'lab' | 'component' | 'matrix' | 'scene' | 'showcase';
export const STORY_TAGS = ['flagship', 'core', 'apg', 'lab', 'scene', 'showcase', 'certified', 'no-cert'] as const;
export const REQUIRED_FLAGSHIP_STORIES = ['Playground', 'States', 'Keyboard'] as const;
export interface StoryStateDrive { name: string; drive?: Array<{ action: 'hover' | 'focus' | 'press' | 'open' | 'type'; target: string /* data-ag-part */; text?: string }> }
export interface StoryAgParameters {
  subject: string;                      // ComponentMeta.name or showcase id; explicit, never fuzzy-matched
  kind: StoryKind;
  states?: StoryStateDrive[];
  refraction?: boolean;
  scenes?: readonly SceneId[] | 'all';  // default 'all' for flagships
  tier?: DomTier;                       // forced in certification runs
  axes?: { transparency?: readonly Transparency[]; scheme?: readonly Scheme[]; contrast?: readonly Contrast[] };
}
// usage: export default { title, component, tags: ['flagship'], parameters: { ag: { subject: 'Button', kind: 'component' } satisfies StoryAgParameters } }
/** Stories in src/**, stories/**, registry/** and showcase/** never import from .storybook/**. Lab framing, matrix grids,
    scene backgrounds and preference axes are applied by QUAL's preview decorators from parameters.ag: kind 'matrix' renders
    meta.variants × states (from the component's meta.ts, found by subject); kind 'lab' wraps the story in the Material Lab frame.
    Archived helpers (defineComponentStories, MatrixGrid, MaterialLabFrame) are QUAL internals behind these decorators. */

// ---- S-40 test helper API (tests/helpers/index.ts, QUAL; seed in C0) ----
export interface AgEnvironment { scheme?: Scheme; contrast?: Contrast; transparency?: Transparency; motion?: MotionPreference;
  tier?: DomTier; backdrop?: Backdrop; forcedColors?: boolean; provider?: boolean /* default true */ }
export type RenderAg = (ui: React.ReactElement, env?: AgEnvironment) => import('@testing-library/react').RenderResult;  // jsdom; sets data-ag-* like AuraGlassScript
export type RenderAgServer = (ui: React.ReactElement, env?: AgEnvironment) => { html: string; hydrate(): Promise<{ warnings: string[] }> };
export type ExpectParts = (container: Element, meta: { parts: readonly string[] }) => void;   // DOM parts == meta.parts
export type ExpectNoBannedAttributes = (container: Element) => void;                          // BANNED_ATTRIBUTES, data-ag-seed
export type GotoStory = (page: import('@playwright/test').Page, storyId: string, env?: AgEnvironment & { scene?: SceneId; stub?: 'reference' }) => Promise<void>; // waits for data-ag-cert-ready
/** Subject enumeration for stream-authored browser specs that iterate other streams' stories (e.g. MAT zoom-reflow over every flagship):
    reads REPORTS.subjects from the Storybook under test. A spec never hard-codes another stream's story ids. */
export type ListSubjects = (filter?: { tags?: readonly string[]; kind?: StoryKind; owner?: SubjectIndex['stories'][number]['owner'] }) => Promise<SubjectIndex['stories']>;
export interface ApgStep {
  press?: string;                       // Playwright key, e.g. 'ArrowRight', 'Shift+Tab'
  type?: string;                        // text typed into the focused element
  expectFocus?: string;                 // data-ag-part value, or 'role=<role>[name=<accessible name>]'
  expectState?: Record<string, string>; // attribute -> value on the focused element (aria-*, data-state)
  expectAnnounced?: string;             // substring expected in the announcer regions (S-26)
}
export interface ApgHarness {                                                                  // tests/a11y/apg/harness.ts
  keyboard(page: import('@playwright/test').Page, script: readonly ApgStep[]): Promise<void>;  // call after gotoStory
  axe(page: import('@playwright/test').Page, opts?: { colorContrast?: true }): Promise<void>;
}
/** Page-side perf probes for stream-authored tests/perf/browser/<stream>/*.spec.ts (QUAL implements; L10 runs them remotely). */
export interface PerfProbe {
  blurredSurfaces(page: import('@playwright/test').Page): Promise<number>;            // elements with non-none backdrop-filter, incl. ::before
  bci(page: import('@playwright/test').Page): Promise<number>;                        // blur cost index (archived PERF §4.6)
  frames(page: import('@playwright/test').Page, opts: { durationMs: number; during?: () => Promise<void> }): Promise<{ p95Ms: number; longTasks: number }>;
  settledIdle(page: import('@playwright/test').Page, opts?: { afterMs?: number }): Promise<{ pendingRaf: number; intervals: number; infiniteAnimations: number }>;
}
