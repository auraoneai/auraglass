/* Contract conformance (QUAL, §6.3 / REQ-QUAL-70): doubles.test.tsx — seam S-30.
   Each tests/contract-doubles/cmp/* double satisfies the same S-30 assertions as the real
   component (components.test.tsx, shared through _s30.tsx), so a double cannot drift from the
   contract: it exports its compound under the contract name, has every COMPOUND_PARTS part as a
   component, mounts with the contract open/value props, renders data-ag-part names in the S-33
   grammar (kebab-case of the part), never renders data-ag-seed, and reports open changes as
   onOpenChange(open, details-with-reason). */
import { afterEach, describe, expect, it } from '@jest/globals';
import { join } from 'node:path';
import { COMPOUND_PARTS, PART_NAME_RE } from '../../src/contracts/components';
import { ROOT, conform, rel, walk, type Violation } from './_conformance';
import { isComponent, mountCompound, openBehaviour, resetDom } from './_s30';

const SUITE = 'doubles';
const DIR = join(ROOT, 'tests', 'contract-doubles', 'cmp');
const files = walk(DIR, (n) => n.endsWith('.tsx') && !n.startsWith('_'));
const pascal = (base: string) => base.replace(/(^|-)([a-z])/g, (_, __, c: string) => c.toUpperCase());
const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

afterEach(() => resetDom());

describe('contract doubles (S-30)', () => {
  it('discovers the ten §5.1 doubles', () => {
    expect(files.map((f) => pascal(f.split('/').pop()!.replace(/\.tsx$/, ''))).sort())
      .toEqual(['Collapsible', 'Combobox', 'Dialog', 'Menu', 'Popover', 'ScrollArea', 'Select', 'Slider', 'Toolbar', 'Tooltip']);
  });

  for (const abs of files) {
    const file = rel(abs);
    const name = pascal(abs.split('/').pop()!.replace(/\.tsx$/, ''));
    const parts = (COMPOUND_PARTS as Record<string, readonly string[]>)[name];

    it(`${name} double satisfies the S-30 compound assertions`, async () => {
      expect(parts).toBeDefined();
      const D = (require(abs) as Record<string, unknown>)[name] as Record<string, unknown> | undefined;
      const v: Violation[] = [];
      if (!D) v.push({ seam: 'S-30', file, detail: `does not export ${name}` });
      else {
        for (const p of parts!) if (!isComponent(D[p])) v.push({ seam: 'S-30', file, detail: `${name}.${p} is missing or not a component` });
        const r = await mountCompound(D, parts!, { open: true, defaultOpen: true });
        if (!r.mounted) v.push({ seam: 'S-30', file, detail: `${name}.Root cannot be mounted: ${r.errors.join(' | ')}` });
        else {
          if (r.parts.length === 0) v.push({ seam: 'S-33', file, detail: `${name} mounted (${r.leaf ?? 'Root alone'}) renders no data-ag-part` });
          if (r.seed) v.push({ seam: 'S-30', file, detail: `${name} renders data-ag-seed` });
          const allowed = new Set(['root', ...Object.keys(D).map(kebab)]);
          for (const p of r.parts) {
            if (!PART_NAME_RE.test(p)) v.push({ seam: 'S-33', file, detail: `${name} renders part ${JSON.stringify(p)} outside PART_NAME_RE` });
            else if (!allowed.has(p)) v.push({ seam: 'S-33', file, detail: `${name} renders part ${p}, which is not the kebab-case name of any of its parts` });
          }
        }
      }
      conform(SUITE, 'compound', v);
    });

    if (parts?.includes('Trigger') && ['Dialog', 'Popover', 'Menu', 'Select', 'Collapsible'].includes(name)) {
      it(`${name} double reports open changes as onOpenChange(true, details-with-reason)`, async () => {
        const D = (require(abs) as Record<string, unknown>)[name] as Record<string, unknown>;
        const b = await openBehaviour(D);
        const v: Violation[] = [];
        if (b.calls[0]?.open !== true) v.push({ seam: 'S-30', file, detail: `${name} onOpenChange first call is ${JSON.stringify(b.calls[0] ?? null)}` });
        else if (typeof b.calls[0].reason !== 'string') v.push({ seam: 'S-32', file, detail: `${name} onOpenChange details carry no reason` });
        if (b.expandedAfterClick !== 'true') v.push({ seam: 'S-30', file, detail: `${name}.Trigger aria-expanded after click is ${JSON.stringify(b.expandedAfterClick)}` });
        conform(SUITE, 'open-behaviour', v);
      });
    }
  }
});
