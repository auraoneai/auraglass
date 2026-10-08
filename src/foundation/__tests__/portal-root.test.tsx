/* CMP-016 (REQ-A11Y-32 / REQ-CMP-06): inside AuraGlassProvider, every story whose
   meta lists `popup` or `positioner` renders that part under the provider's
   [data-ag-portal-root], and exactly one portal root exists. */
import * as React from 'react';
import { describe, expect, it, afterEach } from '@jest/globals';
import { render, cleanup, act } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { AuraGlassProvider } from '../../theme/index';
import { discoverCmpMetas, loadStories, storyElement, REPO_ROOT } from '../../../tests/foundation/metas';

const coverage = JSON.parse(
  readFileSync(join(REPO_ROOT, 'tests', 'foundation', 'contract-coverage.json'), 'utf8'),
) as { registered: string[] };

const POPUP_PARTS = new Set(['popup', 'positioner']);

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});

describe('portal-root containment', () => {
  const metas = discoverCmpMetas().filter(
    (m) => coverage.registered.includes(m.name) && m.meta.parts.some((p) => POPUP_PARTS.has(p)),
  );

  it('records which metas declare popup/positioner (0 is valid until overlays land)', () => {
    expect(metas.map((m) => m.name)).toEqual(expect.any(Array));
  });

  for (const { name } of metas) {
    it(`${name}: rendered popup/positioner sits under the provider portal root`, async () => {
      const stories = loadStories(name);
      expect(stories.length).toBeGreaterThan(0);
      let checked = 0;
      for (const loaded of stories) {
        for (const storyName of Object.keys(loaded.exports)) {
          if (storyName === 'default') continue;
          const { element } = storyElement(loaded, storyName);
          if (!element) continue;
          render(<AuraGlassProvider>{element}</AuraGlassProvider>);
          await act(async () => {});
          const portalRoot = document.querySelector('[data-ag-portal-root]');
          expect(portalRoot).not.toBeNull();
          const parts = document.querySelectorAll('[data-ag-part="popup"], [data-ag-part="positioner"]');
          for (const part of Array.from(parts)) {
            expect(part.closest('[data-ag-portal-root]')).toBe(portalRoot);
          }
          if (parts.length) checked += 1;
          expect(document.querySelectorAll('[data-ag-portal-root]')).toHaveLength(1);
        }
      }
      if (checked === 0) throw new Error(`${name}: no popup/positioner part rendered in any story`);
    });
  }
});
