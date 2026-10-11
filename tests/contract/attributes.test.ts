/* Contract conformance (QUAL, §6.3 / REQ-QUAL-70): attributes.test.ts — seam S-01.
   Every data-ag-* that ships (dist/, and the src/** closure tsdown maps 1:1 into dist/) and
   every data-ag-* rendered by a story is in AG_ATTRIBUTES, is emitted only from its allowed
   setter's paths, and is never in BANNED_ATTRIBUTES. The five story-only attributes and
   data-ag-seed never ship. */
import * as React from 'react';
import { afterEach, describe, expect, it } from '@jest/globals';
import { act, cleanup, render } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { AG_ATTRIBUTES, BANNED_ATTRIBUTES } from '../../src/contracts/material';
import { ENTRIES } from '../../src/contracts/entries';
import { ROOT, conform, distDir, ownerOf, rel, shippedSourceFiles, storyCases, storyFiles, walk, type Violation } from './_conformance';
import { attributeEmissions, attributeTokens, STORY_ONLY_ATTRIBUTES, checkShippedAttributes, checkRenderedAttributes } from './_checks';

const SUITE = 'attributes';
const REGISTRY_FILE = 'src/contracts/material.ts';   // the registry itself (keys only), not an emitter
const sources = ENTRIES.filter((e) => e.source.startsWith('src/')).map((e) => e.source);
const shipped = shippedSourceFiles(sources).filter((f) => f !== REGISTRY_FILE && /\.(tsx?|mjs|css)$/.test(f));

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
  document.documentElement.getAttributeNames().filter((n) => n.startsWith('data-ag-')).forEach((n) => document.documentElement.removeAttribute(n));
});

describe('S-01 attribute registry', () => {
  it('the five story-only attributes and data-ag-seed are registered as non-shipping', () => {
    expect(STORY_ONLY_ATTRIBUTES).toEqual(['data-ag-story-content', 'data-ag-story-kind', 'data-ag-cert-ready',
      'data-ag-lab-override', 'data-ag-state-cell', 'data-ag-seed']);
    for (const a of STORY_ONLY_ATTRIBUTES) expect(Object.keys(AG_ATTRIBUTES)).toContain(a);
    for (const b of BANNED_ATTRIBUTES) expect(Object.keys(AG_ATTRIBUTES)).not.toContain(b);
  });

  it('the shipped source closure is discovered from ENTRIES', () => {
    expect(shipped.length).toBeGreaterThan(50);
    expect(shipped).toContain('src/material/index.ts');
    expect(shipped.some((f) => f.includes('__tests__') || /\.(test|stories)\./.test(f))).toBe(false);
    expect(shipped).not.toContain('src/contracts/seed.tsx');
  });

  it('attributeTokens / attributeEmissions read source text', () => {
    expect(attributeTokens(`<div data-ag-part="root" />; '[data-ag-layer-root=overlay]'`)).toEqual(['data-ag-part', 'data-ag-layer-root']);
    expect(attributeEmissions(`<div data-ag-part="x" />; el.setAttribute('data-ag-tier', t); q('[data-ag-layer="overlay"]'); ({ 'data-ag-size': s })`).sort())
      .toEqual(['data-ag-part', 'data-ag-size', 'data-ag-tier']);
  });

  it('every data-ag-* in the shipped source closure is registered, not banned and not story-only', () => {
    const files = shipped.map((f) => ({ file: f, text: readFileSync(join(ROOT, f), 'utf8') }));
    conform(SUITE, 'shipped-source', checkShippedAttributes(files));
  });

  it("every data-ag-* is emitted only from its allowed setter's paths", () => {
    const violations: Violation[] = [];
    for (const f of shipped) {
      if (f.endsWith('.css')) continue;
      const owner = ownerOf(f);
      // CONTRACT files define the frozen markup the setter renders (e.g. PORTAL_ROOT_MARKUP); they emit nothing themselves.
      if (owner === 'CONTRACT') continue;
      for (const attr of attributeEmissions(readFileSync(join(ROOT, f), 'utf8'))) {
        const spec = (AG_ATTRIBUTES as Record<string, { setter: string }>)[attr];
        if (!spec) continue; // unregistered attributes are reported by the shipped-source check
        const setters = spec.setter.split('|');
        if (!setters.includes('ANY') && !setters.includes(owner)) {
          violations.push({ seam: 'S-01', file: f, detail: `emits ${attr}, whose setter is ${spec.setter} (file owner ${owner})` });
        }
      }
    }
    conform(SUITE, 'setter-paths', violations);
  });

  it('dist/ contains no unregistered, banned, story-only or seed attribute', () => {
    const dist = distDir();
    if (dist === null) {
      /* No build in this job: the source closure above is exactly what tsdown emits 1:1. The dist
         scan is recorded pending; strict (release) mode fails here, where dist/ must be present. */
      const pending = conform(SUITE, 'dist', [{ seam: 'S-01', file: 'dist/', owner: 'PLAT',
        detail: 'dist/ is not built in this job (set AURAGLASS_DIST_DIR or run with plat:build:dist artifacts)' }]);
      expect(pending).toHaveLength(1);
      return;
    }
    const files = walk(dist, (n) => /\.(m?js|cjs|css)$/.test(n))
      .filter((f) => !rel(f).endsWith('contracts/material.js'))
      .map((f) => ({ file: rel(f), text: readFileSync(f, 'utf8') }));
    expect(files.length).toBeGreaterThan(0);
    conform(SUITE, 'dist', checkShippedAttributes(files));
  });
});

describe('S-01 rendered stories', () => {
  const files = storyFiles();
  it('discovers the story files', () => {
    expect(files.length).toBeGreaterThan(50);
  });

  /* One test per CSF file: every story is rendered and every data-ag-* in the DOM checked. A
     story that cannot be rendered is reported (S-41, story owner), never dropped. */
  for (const file of files) {
    /* CSF modules load at collection time: storybook/test registers framework hooks on import. */
    let cases: ReturnType<typeof storyCases> = [];
    let loadError: string | null = null;
    try {
      cases = storyCases(file, (c, p) => React.createElement(c as React.ComponentType, p as Record<string, unknown>));
    } catch (e) {
      loadError = (e as Error).message.split('\n')[0]!;
    }
    it(`${file}: rendered stories emit only registered attributes`, async () => {
      const violations: Violation[] = [];
      if (loadError !== null) violations.push({ seam: 'S-41', file, detail: `story module fails to load: ${loadError}` });
      for (const c of cases) {
        cleanup();
        document.body.innerHTML = '';
        if (c.element === null) {
          violations.push({ seam: 'S-41', file, detail: `story ${c.name} has neither render nor a default component` });
          continue;
        }
        try {
          render(React.createElement(c.element as React.ComponentType));
          await act(async () => {});
        } catch (e) {
          violations.push({ seam: 'S-41', file, detail: `story ${c.name} throws on render: ${(e as Error).message.split('\n')[0]}` });
          continue;
        }
        violations.push(...checkRenderedAttributes(document.documentElement, file, `${c.title}/${c.name}`, { story: true }));
      }
      conform(SUITE, 'rendered', violations);
    });
  }
});
