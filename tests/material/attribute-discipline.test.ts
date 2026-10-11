/* REQ-MAT-27 (REQ-FIN-55, FIN-D D.3-18): attribute discipline for MAT.
   1. Rendered DOM: every MAT component, the provider (outermost + nested,
      preset, brand, LensDefs, mounts), the preferences panel, a modal layer,
      the announcer and the pre-paint script are rendered/executed in jsdom.
      Every data-ag-* name that appears on any element (including names that
      are set and later removed, captured by a MutationObserver) must be a key
      of AG_ATTRIBUTES whose setter includes MAT or ANY, and none may be in
      BANNED_ATTRIBUTES.
   2. MAT CSS: every attribute selector in the MAT stylesheets (src/material,
      src/a11y, src/motion css, the fragments/css/mat.ts rows, a fresh
      dist/tokens.css build and the createGlassTheme/createBrandTheme cssText)
      names a registered data-ag-* key (any setter: reading is not setting) or
      a non-ag state attribute listed in the contract's STATE_ATTRIBUTES (C-2).
   3. Ledger acceptance: the data-ag-* names in the non-test sources of
      src/material, src/theme, src/a11y, src/motion/css and scripts/tokens are a
      subset of AG_ATTRIBUTES keys.
   Producers (fail closed until they land on next): contract/v1.2-final C-2
   (#404) registers data-ag-{theme,shadcn-source,scroll-locked,hit-clamp,
   focus-inset,lens-defs} and STATE_ATTRIBUTES; FIN-A REQ-FIN-04 removes
   data-ag-theme-style from AuraGlassProvider.tsx; FIN-A REQ-FIN-03 keys the
   disabled ladder cells on [data-disabled]/[aria-disabled] instead of
   data-ag-state; FIN-A REQ-FIN-05 drops [data-ag-debug-targets] from
   targets.css. */
import * as React from 'react';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { act, render } from '@testing-library/react';
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';
import * as materialContract from '../../src/contracts/material';
import { AG_ATTRIBUTES, BANNED_ATTRIBUTES } from '../../src/contracts/material';
import {
  ConcentricFrame, Environment, ScrollEdge, Surface, SurfaceGroup, materialProps,
} from '../../src/material/index';
import { LensDefs } from '../../src/material/lens/LensDefs';
import { startSurfaceCounter } from '../../src/material/dev/surfaceCounter';
import { HitArea } from '../../src/a11y/HitArea';
import {
  AuraGlassProvider, GlassPreferencesPanel, auraGlassPrepaintScript, createBrandTheme,
  createGlassTheme, useAnnouncer, useLayer,
} from '../../src/theme/index';
import { presets } from '../../src/theme/presets';
import type { PresetId } from '../../src/theme/presets';
import { registerProviderMount } from '../../src/theme/providerMounts';
import { installPointerLight } from '../../src/motion/index';
import { MotionProvider, Shared, SharedLayout } from '../../src/motion/public';
import cssFragments from '../../fragments/css/mat';
import { runBuild } from '../../scripts/tokens/build.mjs';

const ROOT = join(__dirname, '..', '..');
const h = React.createElement;

type Entry = { setter: string };
const REGISTRY = AG_ATTRIBUTES as unknown as Record<string, Entry>;
const BANNED = new Set<string>(BANNED_ATTRIBUTES);

const setterAllowsMat = (name: string): boolean =>
  REGISTRY[name]?.setter.split('|').some((s) => s === 'MAT' || s === 'ANY') === true;

/* ---------- 1. rendered DOM ---------- */

const seen = new Set<string>();
const recordTree = (root: Element): void => {
  for (const el of [root, ...Array.from(root.querySelectorAll('*'))]) {
    for (const name of el.getAttributeNames()) if (name.startsWith('data-ag-')) seen.add(name);
  }
};

function ModalLayer(): React.ReactElement {
  const ref = React.useRef<HTMLDivElement>(null);
  useLayer({ kind: 'dialog', modal: true, open: true, onEscape: () => {}, element: ref.current });
  return h('div', { ref, role: 'dialog', 'aria-modal': true }, 'modal');
}

function Announce(): React.ReactElement {
  const { announce } = useAnnouncer();
  React.useEffect(() => { announce('saved'); announce('urgent', { politeness: 'assertive' }); }, [announce]);
  return h('span', null, 'announcer');
}

const materialTree = (): React.ReactElement => h(
  React.Fragment, null,
  h(Surface, null, 'default'),
  h(Surface, { layer: 'chrome', variant: 'regular', thickness: 'thin', shape: 'capsule', interactive: true }),
  h(Surface, { layer: 'overlay', variant: 'clear', prominent: true, refraction: true }),
  h(Surface, { layer: 'transient', variant: 'identity' }),
  h(Surface, { layer: 'content', content: 'content-sunken', shape: 'concentric', thickness: 'thick' }),
  h(Surface, { layer: 'overlay', allowNested: true }, h(Surface, { layer: 'overlay' })),
  h('div', materialProps({ layer: 'chrome', thickness: 'regular' })),
  h(SurfaceGroup, { spacing: '4', refraction: true, children: h(Surface, { layer: 'chrome' }) }),
  h(Environment, { backdrop: 'media', image: 'data:image/png;base64,AA==', children: h(Surface, { layer: 'chrome' }) }),
  h(Environment, { backdrop: 'auto', video: 'data:video/mp4;base64,AA==', children: 'video' }),
  h(ScrollEdge, { edge: 'top', edgeStyle: 'soft' }),
  h(ScrollEdge, { edge: 'bottom', edgeStyle: 'hard' }),
  h(ConcentricFrame, { radius: 'lg', inset: '3', children: h(Surface, { layer: 'content' }) }),
  h('button', { type: 'button', style: { position: 'relative' } }, 'hit', h(HitArea)),
  h(LensDefs),
);

describe('REQ-MAT-27 rendered attributes', () => {
  let observer: MutationObserver;

  beforeAll(() => {
    observer = new MutationObserver(() => {});
    observer.observe(document, { subtree: true, attributes: true, attributeOldValue: false, childList: true });
    registerProviderMount('lensDefs', LensDefs);
    registerProviderMount('presetCss', (id) => createGlassTheme({ id, preset: id as PresetId }).cssText);
    registerProviderMount('brandCss', (brand) => createBrandTheme(brand).cssText);
    registerProviderMount('devDiagnostics', (d) => startSurfaceCounter(d));
    registerProviderMount('pointerLight', (d) => installPointerLight(d));
  });

  afterAll(() => {
    observer.disconnect();
  });

  it('renders every MAT surface, the provider tree, panel, layer, announcer and pre-paint script', () => {
    // pre-paint script writes its data-ag-* onto <html> (S-23)
    new Function(auraGlassPrepaintScript)();
    recordTree(document.documentElement);

    const nested = h(AuraGlassProvider, {
      storage: null, density: 'compact', brand: 'oklch(0.6 0.15 250)',
      children: [h(Surface, { layer: 'chrome', key: 's' }), h(GlassPreferencesPanel, { keys: ['contrast'], key: 'p' })],
    });
    const { unmount } = render(h(AuraGlassProvider, {
      storage: null, tier: 'enhanced', preset: Object.keys(presets)[1]!,
      children: [
        h(MotionProvider, { key: 'motion' },
          h(SharedLayout, { id: 'attr' }, h(Shared, { id: 'attr-shared' }, 'shared'))),
        h(React.Fragment, { key: 'material' }, materialTree()),
        h(GlassPreferencesPanel, { key: 'panel' }),
        h(Announce, { key: 'announce' }),
        h(ModalLayer, { key: 'modal' }),
        h(React.Fragment, { key: 'nested' }, nested),
      ],
    }));
    act(() => { /* flush effects (mounts, announcer, layer stack) */ });
    recordTree(document.documentElement);
    unmount();
    for (const rec of observer.takeRecords()) {
      if (rec.type === 'attributes' && rec.attributeName?.startsWith('data-ag-')) seen.add(rec.attributeName);
      rec.addedNodes.forEach((n) => { if (n instanceof Element) recordTree(n); });
    }

    // the tree really exercised the emitting paths
    for (const must of ['data-ag-surface', 'data-ag-root', 'data-ag-provider', 'data-ag-portal-root', 'data-ag-announcer',
      'data-ag-lens-defs', 'data-ag-lens-ready', 'data-ag-scroll-locked', 'data-ag-engine', 'data-ag-part']) {
      expect([...seen]).toContain(must);
    }

    const unregistered = [...seen].filter((n) => !(n in REGISTRY)).sort();
    const wrongSetter = [...seen].filter((n) => n in REGISTRY && !setterAllowsMat(n)).sort();
    const banned = [...seen].filter((n) => BANNED.has(n)).sort();
    expect({ unregistered, wrongSetter, banned }).toEqual({ unregistered: [], wrongSetter: [], banned: [] });
  });
});

/* ---------- 2. MAT CSS selectors ---------- */

const walk = (dir: string, keep: (p: string) => boolean): string[] => {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === '__tests__' || name === 'node_modules' || name === 'fixtures') continue;
      out.push(...walk(p, keep));
    } else if (keep(p)) out.push(p);
  }
  return out;
};

const attributeNamesIn = (css: string, from: string): Array<{ name: string; where: string }> => {
  const found: Array<{ name: string; where: string }> = [];
  postcss.parse(css, { from }).walkRules((rule) => {
    // keyframe steps (from/to/%) carry no attribute selectors
    selectorParser((sel) => {
      sel.walkAttributes((attr) => { found.push({ name: attr.attribute, where: `${from}: ${rule.selector}` }); });
    }).processSync(rule.selector);
  });
  return found;
};

describe('REQ-MAT-27 MAT CSS selectors', () => {
  let tmp = '';
  beforeAll(async () => {
    tmp = mkdtempSync(join(tmpdir(), 'ag-attr-'));
    await runBuild({ outRoot: tmp, quiet: true });
  }, 60_000);
  afterAll(() => { if (tmp) rmSync(tmp, { recursive: true, force: true }); });

  it('contract lists the non-ag state attributes MAT CSS may read (C-2 STATE_ATTRIBUTES)', () => {
    const state = (materialContract as Record<string, unknown>).STATE_ATTRIBUTES;
    expect(Array.isArray(state)).toBe(true);
  });

  it('every attribute selector is a registered data-ag-* key or a contract state attribute', () => {
    const files = new Set<string>([
      ...walk(join(ROOT, 'src/material/css'), (p) => p.endsWith('.css')),
      ...walk(join(ROOT, 'src/a11y/css'), (p) => p.endsWith('.css')),
      ...walk(join(ROOT, 'src/motion/css'), (p) => p.endsWith('.css')),
      ...(cssFragments as Array<{ file: string }>).map((f) => join(ROOT, f.file)),
    ]);
    const sheets: Array<[string, string]> = [...files].map((f) => [relative(ROOT, f), readFileSync(f, 'utf8')]);
    sheets.push(['dist/tokens.css (fresh build)', readFileSync(join(tmp, 'dist/tokens.css'), 'utf8')]);
    for (const id of Object.keys(presets)) {
      sheets.push([`createGlassTheme(${id}).cssText`, createGlassTheme({ id, preset: id as PresetId }).cssText]);
    }
    sheets.push(['createBrandTheme().cssText', createBrandTheme('oklch(0.6 0.15 250)').cssText]);
    expect(sheets.length).toBeGreaterThan(10);

    const state = new Set<string>(
      ((materialContract as Record<string, unknown>).STATE_ATTRIBUTES as readonly string[] | undefined) ?? [],
    );
    const bad: string[] = [];
    let agReads = 0;
    for (const [from, css] of sheets) {
      for (const { name, where } of attributeNamesIn(css, from)) {
        if (name.startsWith('data-ag-')) {
          agReads += 1;
          if (!(name in REGISTRY) || BANNED.has(name)) bad.push(`${name} — ${where}`);
        } else if (name.startsWith('data-') || name.startsWith('aria-')) {
          if (!state.has(name)) bad.push(`${name} (not in STATE_ATTRIBUTES) — ${where}`);
        }
      }
    }
    expect(agReads).toBeGreaterThan(100);
    expect([...new Set(bad)].sort()).toEqual([]);
  });
});

/* ---------- 3. ledger acceptance over MAT sources ---------- */

describe('REQ-MAT-27 MAT source names', () => {
  it('data-ag-* names in MAT sources are AG_ATTRIBUTES keys', () => {
    const dirs = ['src/material', 'src/theme', 'src/a11y', 'src/motion/css', 'scripts/tokens'];
    const isTest = (p: string) => /\.test\.[^.]+$/.test(p) || /\.test-d\.ts$/.test(p);
    const offenders = new Map<string, Set<string>>();
    for (const d of dirs) {
      for (const f of walk(join(ROOT, d), (p) => /\.(css|ts|tsx|mjs|cjs|js|json)$/.test(p) && !isTest(p))) {
        for (const m of readFileSync(f, 'utf8').matchAll(/data-ag-[a-z-]+/g)) {
          const name = m[0].replace(/-+$/, '');
          if (!(name in REGISTRY)) {
            const set = offenders.get(name) ?? new Set<string>();
            set.add(relative(ROOT, f));
            offenders.set(name, set);
          }
        }
      }
    }
    const report = Object.fromEntries([...offenders].sort(([a], [b]) => a.localeCompare(b))
      .map(([n, s]) => [n, [...s].sort()]));
    expect(report).toEqual({});
  });
});
