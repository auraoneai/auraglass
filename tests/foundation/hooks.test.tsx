/* REQ-CMP-15: every meta's stories rerender through prop toggles
   (error/description/label/disabled/loading/multiple) without a
   "Rendered more/fewer hooks" crash; aria-describedby targets must exist
   before AND after toggles. */
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { discoverCmpMetas, loadStories, storyElement } from './metas';

const TOGGLE = ['error', 'description', 'label', 'disabled', 'loading', 'multiple'] as const;
const TOGGLE_VALUES: Record<(typeof TOGGLE)[number], unknown> = {
  error: 'err',
  description: 'helper text',
  label: 'Label',
  disabled: true,
  loading: true,
  multiple: true,
};

function describedByMissing(root: ParentNode): string[] {
  const missing: string[] = [];
  root.querySelectorAll('[aria-describedby]').forEach((el) => {
    // overlay triggers reference portal-mounted popups that jsdom cannot
    // mount (BU floating needs layout) — in the DOM the target exists.
    if (el.getAttribute('data-ag-part') === 'trigger') return;
    for (const id of (el.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean)) {
      if (!el.ownerDocument.getElementById(id)) missing.push(id);
    }
  });
  return missing;
}

const metas = discoverCmpMetas();

describe('hooks stability over all metas (REQ-CMP-15)', () => {
  const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  afterEach(() => {
    const hookErrs = errSpy.mock.calls
      .map((c) => String(c[0]))
      .filter((m) => /Rendered (more|fewer) hooks/.test(m));
    expect(hookErrs).toEqual([]);
  });

  it.each(metas.map((m) => m.name))('%s: 6 rerenders toggling %j — stable + describedby intact', (name) => {
    const stories = loadStories(name);
    const failures: string[] = [];
    let mounted = 0;
    for (const mod of stories) {
      for (const exportName of Object.keys(mod.exports)) {
        if (exportName === 'default' || exportName.startsWith('__')) continue;
        let element: React.ReactElement | null = null;
        try {
          const r = storyElement(mod, exportName);
          element = r.element;
        } catch { element = null; }
        if (!element) {
          const story = mod.exports[exportName] as { render?: (a: Record<string, unknown>) => React.ReactElement; args?: Record<string, unknown> } | undefined;
          if (story && typeof story === 'object' && typeof story.render === 'function') {
            element = React.createElement(story.render as unknown as React.FC<Record<string, unknown>>, story.args ?? {});
          }
        }
        if (!element) continue;
        try {
          const view = render(element);
          expect(describedByMissing(view.container)).toEqual([]);
          for (let round = 0; round < 6; round += 1) {
            const props: Record<string, unknown> = {};
            for (const key of TOGGLE) props[key] = round % 2 === 0 ? TOGGLE_VALUES[key] : undefined;
            view.rerender(React.cloneElement(element, props));
            expect(describedByMissing(view.container)).toEqual([]);
          }
          view.unmount();
          mounted += 1;
        } catch (e) {
          const msg = String(e);
          failures.push(`${mod.file}#${exportName}: ${msg.slice(0, 160)}`);
        }
      }
    }
    expect(failures).toEqual([]);
    if (stories.length > 0) expect(mounted).toBeGreaterThan(0);
  });
});
