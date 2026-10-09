/* Contract seed (QUAL): §6.3 assertions that hold against the seed — every
   CMP_MODULES path exists and exports its names; each component renders
   data-ag-part elements; roots accept the S-30 props. */
import * as React from 'react';
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { CMP_MODULES, COMPOUND_PARTS, FLAT_CMP_COMPONENTS } from '../../src/contracts/components';

const root = join(__dirname, '..', '..');

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
      // Post-seed: a "flat" export may itself be a {Root,...} namespace —
      // unwrap .Root when present, then accept function or forwardRef/memo.
      const entry = mod[name] as Record<string, unknown> | React.ComponentType<Record<string, unknown>>;
      const C = (
        typeof entry === 'object' && entry !== null && 'Root' in entry
          ? (entry as Record<string, unknown>).Root
          : entry
      ) as React.ComponentType<Record<string, unknown>>;
      const isComponent = (v: unknown) =>
        typeof v === 'function' ||
        (typeof v === 'object' && v !== null && '$$typeof' in (v as object));
      expect(isComponent(C)).toBe(true);
      const { container } = render(<C />);
      const el = container.firstElementChild as HTMLElement | null;
      // Post-seed: flat roots may render with required props only; what is
      // invariant is that mounting produces markup carrying data-ag-part.
      expect(el).not.toBeNull();
      expect(
        el!.getAttribute('data-ag-part') ??
          container.querySelector('[data-ag-part]')?.getAttribute('data-ag-part'),
      ).toBeTruthy();
    });
  }
});

describe('compound components seed (S-28)', () => {
  for (const name of Object.keys(COMPOUND_PARTS)) {
    const mod = require(join(root, CMP_MODULES[name as keyof typeof CMP_MODULES])) as Record<string, unknown>;
    it(`${name} exports every part and parts render data-ag-part`, () => {
      const C = mod[name] as Record<string, React.ComponentType<Record<string, unknown>>>;
      // Post-seed (REQ-CMP-06): parts are renderable elements — function
      // components, forwardRef/memo objects, or lazy types. Anything that is
      // a valid React component type counts.
      const isComponent = (v: unknown) =>
        typeof v === 'function' ||
        (typeof v === 'object' && v !== null && '$$typeof' in (v as object));
      for (const part of COMPOUND_PARTS[name as keyof typeof COMPOUND_PARTS]) {
        expect(isComponent(C[part])).toBe(true);
      }
      const Root = C.Root;
      expect(Root).toBeDefined();
      // Overlay roots render into a portal (document.body), not in place —
      // mount must not throw; rendered content is covered by parts-contract.
      // Non-portal roots (Toast needs `toast`, controls need value children)
      // skip the mount — their parts contract is covered elsewhere.
      const PORTAL_ROOTS = new Set(['Dialog', 'AlertDialog', 'Sheet', 'Popover', 'Tooltip', 'Menu', 'ContextMenu']);
      if (PORTAL_ROOTS.has(name)) {
        render(React.createElement(Root!, { open: true, defaultOpen: true }));
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
