/* REQ-CMP-14: DOM contract — every meta's stories mount without banned
   attributes, and a second render with the same useId seed produces identical
   outerHTML (no Math.random/Date.now/new Date nondeterminism in render). */
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { discoverCmpMetas, loadStories, storyElement } from './metas';
import { expectNoBannedAttributes } from '../helpers/index';

const BANNED = [
  'data-user-stress',
  'data-interaction-count',
  'data-time-spent',
  'data-modal-complexity',
  'data-dialog-urgency',
  'data-ag-seed',
];
const BANNED_PREFIX = 'data-consciousness-';

function expectNoStressAttrs(container: HTMLElement): void {
  const hits: string[] = [];
  const scan = (el: Element) => {
    for (const name of el.getAttributeNames()) {
      if (BANNED.includes(name) || name.startsWith(BANNED_PREFIX)) {
        hits.push(`${el.tagName.toLowerCase()}[${name}]`);
      }
    }
  };
  scan(container);
  container.querySelectorAll('*').forEach(scan);
  expect(hits).toEqual([]);
}

const metas = discoverCmpMetas();

describe('dom-contract (REQ-CMP-14)', () => {
  it.each(metas.map((m) => m.name))('%s: every story mounts clean + deterministic', (name) => {
    const stories = loadStories(name);
    const failures: string[] = [];
    let mounted = 0;
    for (const mod of stories) {
      for (const exportName of Object.keys(mod.exports)) {
        if (exportName === 'default' || exportName.startsWith('__')) continue;
        let element: React.ReactElement | null = null;
        let reason: string | undefined;
        try {
          const r = storyElement(mod, exportName);
          element = r.element;
          reason = r.reason;
        } catch {
          element = null;
        }
        if (!element) {
          // render fns that use hooks are components — mount them as such
          const story = mod.exports[exportName] as { render?: (a: Record<string, unknown>) => React.ReactElement; args?: Record<string, unknown> } | undefined;
          if (story && typeof story === 'object' && typeof story.render === 'function') {
            element = React.createElement(story.render as unknown as React.FC<Record<string, unknown>>, story.args ?? {});
            reason = undefined;
          }
        }
        if (!element) {
          failures.push(`${mod.file}#${exportName}: ${reason ?? 'no element'}`);
          continue;
        }
        try {
          const a = render(<>{element}</>);
          expectNoBannedAttributes(a.container);
          expectNoStressAttrs(a.container);
          a.unmount();
          // identical useId seed → identical markup modulo the generated-id
          // counter (Base UI useId is a module counter, not per-tree) — any
          // other difference is render nondeterminism (Date.now/Math.random).
          const norm = (html: string) => html
            .replace(/\b(id|for|aria-labelledby|aria-describedby|aria-controls|aria-owns|aria-activedescendant)="[^"]*"/g, '$1="*"');
          const b = render(<>{element}</>);
          const c = render(<>{element}</>);
          expect(norm(b.container.innerHTML)).toBe(norm(c.container.innerHTML));
          b.unmount();
          c.unmount();
          mounted += 1;
        } catch (e) {
          failures.push(`${mod.file}#${exportName}: ${String(e).slice(0, 200)}`);
        }
      }
    }
    expect(failures).toEqual([]);
    if (stories.length > 0) expect(mounted).toBeGreaterThan(0);
  });
});
