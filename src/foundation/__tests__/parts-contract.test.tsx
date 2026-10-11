/* CMP-017 (REQ-CMP-06): post-seed parts contract over every CMP meta (not a registered
   subset): render every story; collected data-ag-part values must be a subset of
   meta.parts and their union must equal meta.parts; every data-state value must be in
   AG_STATES. */
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
  it('CMP metas are discovered', () => {
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
        for (const storyName of Object.keys(loaded.exports)) {
          if (storyName === 'default') continue;
          const { element } = storyElement(loaded, storyName);
          if (!element) continue;
          cleanup();
          render(element);
          await act(async () => {});
          rendered += 1;
          for (const el of Array.from(document.querySelectorAll('[data-ag-part]'))) {
            const v = el.getAttribute('data-ag-part');
            if (v) seen.add(v);
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
