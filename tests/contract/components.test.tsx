/* Contract conformance (QUAL, §6.3 / REQ-QUAL-70): components.test.tsx — seams S-30, S-33.
   Post-seed (no CMP module renders a seed any more). For every COMPOUND_PARTS and
   FLAT_CMP_COMPONENTS export:
   - the export exists at its CMP_MODULES path and every part is a component;
   - flat roots render data-ag-part="root" on their root element; compound Roots render a
     data-ag-part="root" element exactly when their meta declares the `root` part (Base UI
     context-only roots render no DOM); nothing renders data-ag-seed;
   - every Root mounts with the props of its meta's story fixture (CSF args) plus open state;
   - the root accepts the S-30 root props (CmpRootProps) and no BANNED_PROPS appear in any part's
     declared props (TypeScript checker over the modules the .d.ts is rolled from);
   - open behaviour matches the contract double (tests/contract-doubles/cmp) for the
     click-to-open compounds.
   Replaces the #320 test diff (which accepted any data-ag-part descendant and skipped non-portal
   roots). */
import * as React from 'react';
import { afterEach, beforeAll, describe, expect, it } from '@jest/globals';
import { render, act } from '@testing-library/react';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { BANNED_PROPS, CMP_MODULES, COMPOUND_PARTS, FLAT_CMP_COMPONENTS } from '../../src/contracts/components';
import { ROOT, conform, discoverMetas, storyFiles, type Violation } from './_conformance';
import { isComponent, mountCompound, openBehaviour, resetDom } from './_s30';
import { contractRootProps, exportProps } from './_types';

const SUITE = 'components';
const modulePath = (name: string) => CMP_MODULES[name as keyof typeof CMP_MODULES];
const metaByName = new Map(discoverMetas().map((m) => [String(m.meta.name), m]));
const allStories = storyFiles();

/* Story fixtures load at collection time (storybook/test registers framework hooks on import).
   The fixture of a component is its CSF default args merged with its Playground story's args. */
function loadFixture(name: string): { args: Record<string, unknown>; source: string | null } {
  const file = allStories.find((f) => f.split('/').pop() === `${name}.stories.tsx`);
  if (!file) return { args: {}, source: null };
  const mod = require(join(ROOT, file)) as Record<string, { args?: Record<string, unknown> } | undefined>;
  const base = (mod.default?.args ?? {}) as Record<string, unknown>;
  const play = (mod.Playground?.args ?? {}) as Record<string, unknown>;
  return { args: { ...base, ...play }, source: file };
}
const fixtures = new Map<string, { args: Record<string, unknown>; source: string | null } | { error: string }>();
for (const name of [...FLAT_CMP_COMPONENTS, ...Object.keys(COMPOUND_PARTS)]) {
  try {
    fixtures.set(name, loadFixture(name));
  } catch (e) {
    fixtures.set(name, { error: (e as Error).message.split('\n')[0]! });
  }
}
const fixtureArgs = (name: string, v: Violation[]) => {
  const f = fixtures.get(name)!;
  if ('error' in f) {
    v.push({ seam: 'S-41', file: modulePath(name), detail: `${name}: story fixture fails to load: ${f.error}` });
    return {};
  }
  // Element-valued args (children etc.) are kept; functions are kept (they are handlers).
  return f.args;
};

beforeAll(() => {
  /* Outside AuraGlassProvider, usePortalContainer resolves a portal root already in the
     document; provide the standard fixture so portal-bound parts can attach. */
  const host = document.createElement('div');
  host.setAttribute('data-ag-portal-root', '');
  for (const layer of ['overlay', 'transient', 'toast']) {
    const l = document.createElement('div');
    l.setAttribute('data-ag-layer-root', layer);
    host.appendChild(l);
  }
  document.documentElement.appendChild(host);
});

afterEach(() => resetDom());

describe('component module table', () => {
  it('every CMP_MODULES path exists as a real file', () => {
    for (const p of Object.values(CMP_MODULES)) expect(existsSync(join(ROOT, p))).toBe(true);
  });

  it('useToast is exported from the toast module', () => {
    const mod = require(join(ROOT, CMP_MODULES.useToast)) as Record<string, unknown>;
    expect(typeof mod.useToast).toBe('function');
  });
});

describe('flat components (S-30 / S-33)', () => {
  for (const name of FLAT_CMP_COMPONENTS) {
    it(`${name} renders data-ag-part="root" on its root element and no seed`, async () => {
      const mod = require(join(ROOT, modulePath(name))) as Record<string, unknown>;
      const C = mod[name];
      expect(isComponent(C)).toBe(true);
      const v: Violation[] = [];
      const args = fixtureArgs(name, v);
      try {
        const { container } = render(React.createElement(C as React.ComponentType<Record<string, unknown>>, args));
        await act(async () => {});
        const el = container.firstElementChild;
        if (!el) v.push({ seam: 'S-30', file: modulePath(name), detail: `${name} renders no element with its fixture args` });
        else if (el.getAttribute('data-ag-part') !== 'root') {
          v.push({ seam: 'S-33', file: modulePath(name), detail: `${name} root element <${el.tagName.toLowerCase()}> has data-ag-part=${JSON.stringify(el.getAttribute('data-ag-part'))}, expected "root"` });
        }
        if (document.querySelector('[data-ag-seed]')) v.push({ seam: 'S-30', file: modulePath(name), detail: `${name} still renders data-ag-seed` });
      } catch (e) {
        v.push({ seam: 'S-30', file: modulePath(name), detail: `${name} throws when mounted with its fixture args: ${(e as Error).message.split('\n')[0]}` });
      }
      conform(SUITE, 'flat-root', v);
    });
  }
});

describe('compound components (S-30 / S-33)', () => {
  for (const name of Object.keys(COMPOUND_PARTS)) {
    const parts = COMPOUND_PARTS[name as keyof typeof COMPOUND_PARTS] as readonly string[];
    it(`${name} exports every part; Root mounts with its fixture; root part matches meta; no seed`, async () => {
      const mod = require(join(ROOT, modulePath(name))) as Record<string, unknown>;
      const C = mod[name] as Record<string, unknown>;
      expect(C).toBeDefined();
      for (const part of parts) expect({ part, ok: isComponent(C[part]) }).toEqual({ part, ok: true });
      const v: Violation[] = [];
      const args = { ...fixtureArgs(name, v), open: true, defaultOpen: true };
      const r = await mountCompound(C, parts, args);
      const file = modulePath(name);
      if (!r.mounted) v.push({ seam: 'S-30', file, detail: `${name}.Root cannot be mounted with its fixture args: ${r.errors.join(' | ')}` });
      else {
        if (r.parts.length === 0) v.push({ seam: 'S-33', file, detail: `${name} mounted (${r.leaf ?? 'Root alone'}) renders no data-ag-part` });
        if (r.seed) v.push({ seam: 'S-30', file, detail: `${name} still renders data-ag-seed` });
        const meta = metaByName.get(name);
        if (!meta) v.push({ seam: 'S-31', file, detail: `${name} has no *.meta.ts` });
        else {
          const declaresRoot = ((meta.meta.parts as string[]) ?? []).includes('root');
          if (declaresRoot !== r.rootPart) {
            v.push({ seam: 'S-33', file: meta.file, detail: `${name}: meta ${declaresRoot ? 'declares' : 'does not declare'} part "root" but the mounted Root ${r.rootPart ? 'renders' : 'does not render'} data-ag-part="root"` });
          }
        }
      }
      conform(SUITE, 'compound-mount', v);
    });
  }
});

describe('declared props (S-30 root props, BANNED_PROPS)', () => {
  const files = [...new Set(Object.values(CMP_MODULES))];
  for (const name of [...Object.keys(COMPOUND_PARTS), ...FLAT_CMP_COMPONENTS]) {
    it(`${name}: root accepts the S-30 root props and no part declares a banned prop`, () => {
      const file = modulePath(name);
      const surface = exportProps(files, file, name);
      const v: Violation[] = [];
      if (!surface || surface.length === 0) v.push({ seam: 'S-30', file, detail: `${name}: no component type found for the export` });
      else {
        for (const { name: part, props } of surface) {
          const banned = props.filter((p) => (BANNED_PROPS as readonly string[]).includes(p));
          if (banned.length) v.push({ seam: 'S-30', file, detail: `${part} declares banned prop(s) ${banned.join(', ')}` });
        }
        const required = contractRootProps(files, name);
        const root = surface.find((s) => s.name === `${name}.Root`) ?? surface.find((s) => s.name === name);
        if (required.length && !root) v.push({ seam: 'S-30', file, detail: `${name}: no Root to carry CmpRootProps` });
        else if (root) {
          const missing = required.filter((p) => !root.props.includes(p));
          if (missing.length) v.push({ seam: 'S-30', file, detail: `${root.name} does not accept S-30 root prop(s) ${missing.join(', ')}` });
        }
      }
      conform(SUITE, 'declared-props', v);
    });
  }
});

describe('behaviour matches the contract doubles (§5.1)', () => {
  const CLICK_OPEN = ['Dialog', 'Popover', 'Menu', 'Select', 'Collapsible'] as const;
  for (const name of CLICK_OPEN) {
    it(`${name}: clicking Trigger opens like the double (aria-expanded, onOpenChange(true, {reason}))`, async () => {
      const real = require(join(ROOT, modulePath(name)))[name] as Record<string, unknown>;
      const double = require(join(ROOT, 'tests/contract-doubles/cmp', `${name.toLowerCase()}.tsx`))[name] as Record<string, unknown>;
      const d = await openBehaviour(double);
      const r = await openBehaviour(real);
      // The double is Base UI itself: it must open, or the comparison would be vacuous.
      expect(d.calls[0]?.open).toBe(true);
      const v: Violation[] = [];
      const file = modulePath(name);
      if (r.expandedAfterClick !== d.expandedAfterClick) v.push({ seam: 'S-30', file, detail: `${name}.Trigger aria-expanded after click is ${JSON.stringify(r.expandedAfterClick)}, double: ${JSON.stringify(d.expandedAfterClick)}` });
      if (r.calls[0]?.open !== true) v.push({ seam: 'S-30', file, detail: `${name}.Root onOpenChange first call is ${JSON.stringify(r.calls[0] ?? null)}, double: ${JSON.stringify(d.calls[0])}` });
      else if (typeof r.calls[0].reason !== 'string') v.push({ seam: 'S-32', file, detail: `${name}.Root onOpenChange details carry no reason (ChangeDetails)` });
      conform(SUITE, 'double-behaviour', v);
    });
  }
});
