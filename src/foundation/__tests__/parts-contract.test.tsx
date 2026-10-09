/* CMP-017 (REQ-CMP-06): for every registered meta, render every story; collected
   data-ag-part values must be a subset of meta.parts and their union must equal
   meta.parts; every data-state value must be in AG_STATES. */
import * as React from 'react';
import { describe, expect, it, afterEach } from '@jest/globals';
import { render, cleanup, act } from '@testing-library/react';
import { AG_STATES } from '../../foundation/state';
import { discoverCmpMetas, loadStories, storyElement } from '../../../tests/foundation/metas';

const STATE_SET = new Set<string>(AG_STATES);

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});

describe('parts contract (rendered DOM == meta.parts)', () => {
  const metas = discoverCmpMetas();
  /* Parts declared by any meta — a story may legitimately nest other
     components (Button triggers, Label fields, delegated Timeline roots);
     their parts are validated under their own meta, not here. A part no
     meta declares still fails below (undeclared = bug). */
  const knownParts = new Set<string>(metas.flatMap((m) => m.meta.parts));
  it('registered metas exist', () => {
    expect(metas.length).toBeGreaterThan(0);
  });

  for (const { name, meta } of metas) {
    it(`${name}: story data-ag-part union equals meta.parts and data-state is in AG_STATES`, async () => {
      const stories = loadStories(name);
      if (stories.length === 0) throw new Error(`no story file for ${name}`);
      const seen = new Set<string>();
      const states = new Set<string>();
      let rendered = 0;
      for (const loaded of stories) {
        if (loaded.file.includes('src/data/')) continue; // foreign stream's basename collision
        for (const storyName of Object.keys(loaded.exports)) {
          if (storyName === 'default') continue;
          const { element } = storyElement(loaded, storyName, { asComponent: true });
          if (!element) continue;
          cleanup();
          render(element);
          await act(async () => {});
          await act(async () => { await new Promise((r) => setTimeout(r, 10)); }); // portal root created on first effect; popup mounts on second
          rendered += 1;
          for (const el of Array.from(document.querySelectorAll('[data-ag-part]'))) {
            const v = el.getAttribute('data-ag-part');
            if (!v) continue;
            if (!meta.parts.includes(v) && knownParts.has(v)) continue; // foreign-declared child part
            seen.add(v);
          }
          for (const el of Array.from(document.querySelectorAll('[data-state]'))) {
            for (const s of (el.getAttribute('data-state') ?? '').split(/\s+/).filter(Boolean)) {
              states.add(s);
            }
          }
        }
      }
      expect(rendered).toBeGreaterThan(0);
      for (const p of seen) {
        if (!meta.parts.includes(p)) throw new Error(`${name}: rendered part '${p}' not declared in meta.parts`);
      }
      if (JSON.stringify([...seen].sort()) !== JSON.stringify([...meta.parts].sort())) {
        throw new Error(`${name}: union of rendered parts ${JSON.stringify([...seen].sort())} != meta.parts ${JSON.stringify([...meta.parts].sort())}`);
      }
      for (const s of states) {
        if (!STATE_SET.has(s)) throw new Error(`${name}: data-state '${s}' not in AG_STATES`);
      }
    });
  }
});
