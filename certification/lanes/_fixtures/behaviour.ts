/* certification/lanes/_fixtures/behaviour.ts — QUAL L5 Behaviour planning (REQ-QUAL-19 · FIN-438). Pure, no browser.

   - locationProjects(root): the cert config's location-discovered projects (in addition to fragment `<stream>:cert-*`
     projects): every `tests/a11y/apg/<stream>/**\/*.apg.spec.ts` and `tests/e2e/<stream>/**\/*.spec.ts` in chromium, webkit
     and firefox, plus QUAL's own `tests/a11y/browser/**` (axe spec + harness self-test). A stream directory that does
     not exist yields no project.
   - axeCells(scope, engine): scene × scheme cells of the behaviour axe run. pr/main: photo + flat-white, light + dark
     in all three engines. nightly/release: all 8 scenes in chromium and webkit (firefox keeps photo + flat-white).
   - PREFERENCE_CELLS: forcedColors 'active', contrast 'more', reducedMotion 'reduce' (Playwright emulation, read back
     in the page) and data-ag-transparency="solid" (forced by attribute). Run in chromium, the engine whose emulation of
     all three media features reads back (the same rule as the L6 forced-colors pruning).
   - apgCoverage(metas, files): flagships (ComponentMeta.flagship set) with no APG spec under
     tests/a11y/apg/<owner>/ — pending before RC-1, fail at release (caller decides by scope). */
import { existsSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { SCENES, type SceneId } from '../../../src/contracts/testing';

export const ENGINES = ['chromium', 'webkit', 'firefox'] as const;
export type Engine = (typeof ENGINES)[number];
export const LOCATION_STREAMS = ['plat', 'mat', 'cmp', 'surf', 'qual'] as const;
export type LaneScope = 'pr' | 'main' | 'nightly' | 'release';

export interface LocationProject { name: string; testDir: string; testMatch: string; engine: Engine; stream: (typeof LOCATION_STREAMS)[number] }

/** Repo-relative directories discovered by location (each is one project per engine). */
export function locationDirs(root: string): Array<{ dir: string; testMatch: string; kind: 'apg' | 'e2e' | 'a11y-browser'; stream: LocationProject['stream'] }> {
  const out: Array<{ dir: string; testMatch: string; kind: 'apg' | 'e2e' | 'a11y-browser'; stream: LocationProject['stream'] }> = [];
  for (const stream of LOCATION_STREAMS) {
    const apg = `tests/a11y/apg/${stream}`;
    if (existsSync(join(root, apg))) out.push({ dir: apg, testMatch: '**/*.apg.spec.ts', kind: 'apg', stream });
    const e2e = `tests/e2e/${stream}`;
    if (existsSync(join(root, e2e))) out.push({ dir: e2e, testMatch: '**/*.spec.ts', kind: 'e2e', stream });
  }
  if (existsSync(join(root, 'tests/a11y/browser'))) out.push({ dir: 'tests/a11y/browser', testMatch: '**/*.spec.ts', kind: 'a11y-browser', stream: 'qual' });
  return out;
}

export function locationProjects(root: string): LocationProject[] {
  return locationDirs(root).flatMap((d) => ENGINES.map((engine) => ({
    name: d.kind === 'a11y-browser' ? `qual:a11y-browser-${engine}` : `${d.stream}:loc-${d.kind}-${engine}`,
    testDir: join(root, d.dir), testMatch: d.testMatch, engine, stream: d.stream,
  })));
}

export const PR_SCENES: readonly SceneId[] = ['photo', 'flat-white'];
export const SCHEMES = ['light', 'dark'] as const;
export interface AxeCell { scene: SceneId; scheme: (typeof SCHEMES)[number] }

export function axeCells(scope: LaneScope, engine: Engine): AxeCell[] {
  const all = (scope === 'nightly' || scope === 'release') && engine !== 'firefox';
  const scenes = all ? SCENES : PR_SCENES;
  return scenes.flatMap((scene) => SCHEMES.map((scheme) => ({ scene, scheme })));
}

export interface PreferenceCell {
  id: 'forced-colors' | 'contrast-more' | 'reduced-motion' | 'transparency-solid';
  media: { forcedColors?: 'active'; contrast?: 'more'; reducedMotion?: 'reduce' };
  /** matchMedia query that must match in the page (proves the emulation took effect). */
  readBack?: string;
  /** <html> attributes forced after navigation. */
  html?: Record<string, string>;
}
export const PREFERENCE_ENGINE: Engine = 'chromium';
export const PREFERENCE_CELLS: readonly PreferenceCell[] = [
  { id: 'forced-colors', media: { forcedColors: 'active' }, readBack: '(forced-colors: active)' },
  { id: 'contrast-more', media: { contrast: 'more' }, readBack: '(prefers-contrast: more)' },
  { id: 'reduced-motion', media: { reducedMotion: 'reduce' }, readBack: '(prefers-reduced-motion: reduce)' },
  { id: 'transparency-solid', media: {}, html: { 'data-ag-transparency': 'solid' } },
];

/** Story content + overlay roots: the scan scope for subject stories (Storybook's own page-level structure excluded). */
export const STORY_SCAN_INCLUDE = ['#storybook-root', '[data-ag-story-content]', '[data-ag-portal-root]', '[data-ag-layer-root]'] as const;

export const kebab = (name: string): string =>
  name.replace(/\./g, '-').replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2').toLowerCase();

export interface FlagshipMeta { name: string; owner: 'CMP' | 'SURF' | 'MAT'; flagship?: number }
export interface CoverageRow { name: string; owner: FlagshipMeta['owner']; flagship: number; spec: string | null; expected: string }

/** APG spec files (repo-relative) under tests/a11y/apg/<stream>/. */
export function apgSpecFiles(root: string): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    if (!existsSync(dir)) return;
    for (const d of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, d.name);
      if (d.isDirectory()) walk(p);
      else if (d.name.endsWith('.apg.spec.ts')) out.push(relative(root, p).split('\\').join('/'));
    }
  };
  for (const s of LOCATION_STREAMS) walk(join(root, 'tests/a11y/apg', s));
  return out.sort();
}

/** One row per flagship: the APG spec that covers it in its owner's directory, or null.
    A file covers a flagship when its base name is kebab(name) or starts with `kebab(name)-` and is not exactly another
    meta's kebab name (`breadcrumbs-overflow.apg.spec.ts` covers Breadcrumbs; `command-palette` covers CommandPalette,
    not Command). */
export function apgCoverage(metas: readonly FlagshipMeta[], files: readonly string[]): CoverageRow[] {
  const exact = new Set(metas.map((m) => kebab(m.name)));
  return metas.filter((m) => typeof m.flagship === 'number').map((m) => {
    const dir = `tests/a11y/apg/${m.owner.toLowerCase()}/`;
    const k = kebab(m.name);
    const spec = files.find((f) => {
      if (!f.startsWith(dir)) return false;
      const base = f.slice(f.lastIndexOf('/') + 1).replace(/\.apg\.spec\.ts$/, '');
      return base === k || (base.startsWith(`${k}-`) && !exact.has(base));
    }) ?? null;
    return { name: m.name, owner: m.owner, flagship: m.flagship as number, spec, expected: `${dir}${k}.apg.spec.ts` };
  }).sort((a, b) => a.flagship - b.flagship || a.name.localeCompare(b.name));
}
