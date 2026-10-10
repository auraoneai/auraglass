/* Contract seed (QUAL): §6.3 assertions that hold against the seed — every
   CMP_MODULES path exists and exports its names; each component renders
   data-ag-part elements; roots accept the S-30 props. */
import * as React from 'react';
import { beforeAll, describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { CMP_MODULES, COMPOUND_PARTS, FLAT_CMP_COMPONENTS } from '../../src/contracts/components';

const root = join(__dirname, '..', '..');
/* Parts may be plain functions or memo/forwardRef objects — both are valid
   component types (renderable). */
const isComponent = (v: unknown) => typeof v === 'function' || (typeof v === 'object' && v !== null && '$$typeof' in (v as Record<string, unknown>));

describe('component module table', () => {
  it('every CMP_MODULES path exists as a real file', () => {
    for (const p of Object.values(CMP_MODULES)) {
      expect(existsSync(join(root, p))).toBe(true);
    }
  });
});

describe('flat components seed (S-27)', () => {
  for (const name of FLAT_CMP_COMPONENTS) {
    const mod = require(join(root, CMP_MODULES[name as keyof typeof CMP_MODULES])) as Record<string, unknown>;
    it(`${name} renders its root element`, () => {
      const C = mod[name] as React.ComponentType<Record<string, unknown>>;
      expect(isComponent(C)).toBe(true);
      const { container } = render(<C />);
      const el = container.querySelector('[data-ag-part="root"]') ?? container.firstElementChild;
      expect(el).not.toBeNull();
      expect(el!.getAttribute('data-ag-part')).toBe('root');
    });
  }
});

describe('compound components seed (S-28)', () => {
  /* Portal-bound parts (Toast.Viewport etc.) mount into the theme portal root;
     outside AuraGlassProvider usePortalContainer falls back to one already in
     the document — provide the standard fixture so they can attach. */
  beforeAll(() => {
    const host = document.createElement('div');
    host.setAttribute('data-ag-portal-root', '');
    for (const layer of ['overlay', 'toast', 'menu', 'tooltip']) {
      const l = document.createElement('div');
      l.setAttribute('data-ag-layer-root', layer);
      host.appendChild(l);
    }
    document.body.appendChild(host);
  });

  for (const name of Object.keys(COMPOUND_PARTS)) {
    const mod = require(join(root, CMP_MODULES[name as keyof typeof CMP_MODULES])) as Record<string, unknown>;
    it(`${name} exports every part and parts render data-ag-part`, () => {
      const C = mod[name] as Record<string, React.ComponentType<Record<string, unknown>>>;
      for (const part of COMPOUND_PARTS[name as keyof typeof COMPOUND_PARTS]) {
        expect(isComponent(C[part])).toBe(true);
      }
      const Root = (C.Provider ?? C.Root) as React.ComponentType<Record<string, unknown>>;
      expect(Root).toBeDefined();
      /* BU parts require their own parents (Popup under Positioner etc.), so
         mount the first leaf that legally attaches directly to Root. Roots may
         be context-only and overlay parts portal to document.body. */
      const parts = COMPOUND_PARTS[name as keyof typeof COMPOUND_PARTS];
      let mounted = false;
      for (const leaf of ['Trigger', 'Track', 'Item', 'Viewport', 'Menu', 'Step', 'Action']) {
        if (!(parts as readonly string[]).includes(leaf) || !isComponent(C[leaf])) continue;
        try {
          render(React.createElement(Root!, { open: true, defaultOpen: true, steps: [{ target: 'body', title: 't' }] },
            React.createElement(C[leaf] as React.ComponentType<Record<string, unknown>>, { key: leaf })));
          mounted = true;
          break;
        } catch { /* leaf needs a different parent — try the next */ }
      }
      if (!mounted) {
        expect(() => render(React.createElement(Root!, { open: true, defaultOpen: true, steps: [{ target: 'body', title: 't' }] }))).not.toThrow();
      } else {
        expect(document.querySelector('[data-ag-part]')).not.toBeNull();
      }
    });
  }
});

describe('useToast seed', () => {
  it('is exported from toast module', () => {
    const mod = require(join(root, 'src/components/toast/index.ts')) as Record<string, unknown>;
    expect(typeof mod.useToast).toBe('function');
  });
});
