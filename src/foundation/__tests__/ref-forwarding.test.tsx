/* CMP-015 (REQ-CMP-03): every CMP component's ref resolves to its root part's DOM
   element. Discovers metas, renders each registered component's Default story with
   a ref, asserts HTMLElement with data-ag-part='root'. Coverage is driven by
   tests/foundation/contract-coverage.json. */
import * as React from 'react';
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { discoverCmpMetas, loadStories, storyElement, REPO_ROOT } from '../../../tests/foundation/metas';

const coverage = JSON.parse(
  readFileSync(join(REPO_ROOT, 'tests', 'foundation', 'contract-coverage.json'), 'utf8'),
) as { registered: string[] };

describe('ref resolves to the root part element', () => {
  const metas = discoverCmpMetas();
  const registered = metas.filter((m) => coverage.registered.includes(m.name) && m.meta.parts.length > 0);

  it('coverage lists at least one component', () => {
    expect(registered.length).toBeGreaterThan(0);
  });

  for (const { name, meta } of registered) {
    const rootPart = meta.parts[0]!;
    it(`${name}: ref.current is the [data-ag-part=${rootPart}] element`, () => {
      const stories = loadStories(name);
      if (stories.length === 0) throw new Error(`no story file found for ${name}`);
      let asserted = 0;
      for (const loaded of stories) {
        const { element, reason } = storyElement(loaded, 'Default');
        if (!element) throw new Error(`${name}: Default story not renderable in ${loaded.file} (${reason})`);
        const el = element as React.ReactElement<Record<string, unknown> & { ref?: React.Ref<HTMLElement> }>;
        const seen: Array<HTMLElement | null> = [];
        const ref = (node: HTMLElement | null) => { seen.push(node); };
        const withRef = React.cloneElement(el, { ref } as Record<string, unknown>);
        const { container } = render(withRef);
        const rootEl = container.querySelector(`[data-ag-part="${rootPart}"]`);
        if (!rootEl) throw new Error(`${name}: no data-ag-part=${rootPart} element rendered`);
        expect(seen[seen.length - 1]).toBe(rootEl);
        expect(seen[seen.length - 1]).toBeInstanceOf(HTMLElement);
        asserted += 1;
      }
      expect(asserted).toBeGreaterThan(0);
    });
  }
});
