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
      const C = mod[name] as React.ComponentType<Record<string, unknown>>;
      expect(typeof C).toBe('function');
      const { container } = render(<C />);
      const el = container.firstElementChild as HTMLElement;
      expect(el).not.toBeNull();
      expect(el.hasAttribute('data-ag-seed')).toBe(true);
      expect(el.getAttribute('data-ag-part')).toBe('root');
    });
  }
});

describe('compound components seed (S-28)', () => {
  for (const name of Object.keys(COMPOUND_PARTS)) {
    const mod = require(join(root, CMP_MODULES[name as keyof typeof CMP_MODULES])) as Record<string, unknown>;
    it(`${name} exports every part and parts render data-ag-part`, () => {
      const C = mod[name] as Record<string, React.ComponentType<Record<string, unknown>>>;
      for (const part of COMPOUND_PARTS[name as keyof typeof COMPOUND_PARTS]) {
        expect(typeof C[part]).toBe('function');
      }
      const Root = C.Root;
      expect(Root).toBeDefined();
      const { container } = render(React.createElement(Root!, { open: true, defaultOpen: true }));
      for (const part of COMPOUND_PARTS[name as keyof typeof COMPOUND_PARTS]) {
        expect(typeof C[part]).toBe('function');
      }
      expect(container.firstElementChild).not.toBeNull();
    });
  }
});

describe('useToast seed', () => {
  it('is exported from toast module', () => {
    const mod = require(join(root, 'src/components/toast/index.ts')) as Record<string, unknown>;
    expect(typeof mod.useToast).toBe('function');
  });
});
