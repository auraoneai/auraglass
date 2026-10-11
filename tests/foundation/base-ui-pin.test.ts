/** @jest-environment node */
/* CMP-006: Base UI pin gate. dependencies['@base-ui/react'] is an exact version,
   the docs allowlist agrees, the package is absent from peerDependencies, and
   every §4.5 part resolves from the pinned install (open item O-06). */
import { describe, expect, it } from '@jest/globals';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const root = join(__dirname, '..', '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};
const allowlist = JSON.parse(readFileSync(join(root, 'docs', 'dependency-allowlist.json'), 'utf8')) as
  | { dependencies?: Record<string, string>; packages?: Record<string, string> }
  | Record<string, unknown>;

const PIN = /^\d+\.\d+\.\d+$/;

describe('Base UI dependency pin (REQ-CMP-01)', () => {
  it('dependencies pins an exact version', () => {
    const spec = pkg.dependencies?.['@base-ui/react'];
    expect(spec).toBeDefined();
    expect(spec).toMatch(PIN);
  });

  it('the allowlist holds the same name and version', () => {
    const text = readFileSync(join(root, 'docs', 'dependency-allowlist.json'), 'utf8');
    const spec = pkg.dependencies?.['@base-ui/react'] ?? '';
    expect(text).toContain('@base-ui/react');
    expect(text).toContain(spec);
  });

  it('is absent from peerDependencies', () => {
    expect(pkg.peerDependencies?.['@base-ui/react']).toBeUndefined();
  });
});

describe('§4.5 Base UI parts resolve (O-06)', () => {
  /* Every §4.5 subpath: [subdir, export name, part inside the export].
     Flat subpaths export the component itself (part === export name). */
  const PARTS: Array<[string, string, string]> = [
    ['accordion', 'Accordion', 'Root'],
    ['avatar', 'Avatar', 'Root'],
    ['button', 'Button', 'Button'],
    ['checkbox', 'Checkbox', 'Root'],
    ['checkbox-group', 'CheckboxGroup', 'CheckboxGroup'],
    ['collapsible', 'Collapsible', 'Root'],
    ['combobox', 'Combobox', 'Chips'],
    ['dialog', 'Dialog', 'Root'],
    ['alert-dialog', 'AlertDialog', 'Root'],
    ['field', 'Field', 'Root'],
    ['fieldset', 'Fieldset', 'Root'],
    ['form', 'Form', 'Form'],
    ['input', 'Input', 'Input'],
    ['menu', 'Menu', 'Root'],
    ['context-menu', 'ContextMenu', 'Root'],
    ['menubar', 'Menubar', 'Menubar'],
    ['meter', 'Meter', 'Root'],
    ['number-field', 'NumberField', 'ScrubArea'],
    ['popover', 'Popover', 'Root'],
    ['progress', 'Progress', 'Root'],
    ['radio', 'Radio', 'Root'],
    ['radio-group', 'RadioGroup', 'RadioGroup'],
    ['scroll-area', 'ScrollArea', 'Root'],
    ['select', 'Select', 'Root'],
    ['separator', 'Separator', 'Separator'],
    ['slider', 'Slider', 'Root'],
    ['switch', 'Switch', 'Root'],
    ['toast', 'Toast', 'Provider'],
    ['toggle', 'Toggle', 'Toggle'],
    ['toggle-group', 'ToggleGroup', 'ToggleGroup'],
    ['toolbar', 'Toolbar', 'Root'],
    ['tooltip', 'Tooltip', 'Root'],
    ['autocomplete', 'Autocomplete', 'Root'],
  ];
  for (const [sub, ns, part] of PARTS) {
    it(`@base-ui/react/${sub} exposes ${ns}.${part}`, () => {
      const mod = require(`@base-ui/react/${sub}`) as Record<string, unknown>;
      const nsObj = (mod[ns] ?? mod) as Record<string, unknown>;
      const resolved = part === ns ? nsObj : nsObj[part];
      if (typeof resolved === 'undefined') {
        throw new Error(`missing @base-ui/react ${ns}.${part} (exports: ${Object.keys(nsObj).slice(0, 10).join(',')})`);
      }
      expect(typeof resolved).not.toBe('undefined');
    });
  }
});

describe('Base UI import confinement (REQ-CMP-01)', () => {
  /* §4.5 isolation: '@base-ui/react' may only be imported under
     src/components/** and src/foundation/** — every other consumer composes
     the CMP seam (e.g. src/components/chip/ChipToggle). */
  const ALLOWED = ['src/components', 'src/foundation'];
  function* walk(dir: string): Generator<string> {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      const st = statSync(p);
      if (st.isDirectory()) yield* walk(p);
      else if (/\.(ts|tsx)$/.test(entry)) yield p;
    }
  }
  /* Expiring baseline: SURF Chip still imports Base UI Toggle directly until
     REQ-FIN-83 (FIN-F) switches it to src/components/chip/ChipToggle. The
     stale-row check below forces this row out in the PR that fixes it. */
  const BASELINE: Array<{ file: string; owner: string; reqFin: string; expires: string }> = [
    { file: 'src/data/chip/Chip.tsx', owner: 'SURF', reqFin: 'REQ-FIN-83', expires: 'RC-1' },
  ];
  function scan(): string[] {
    const offenders: string[] = [];
    for (const f of walk(join(root, 'src'))) {
      const rel = relative(root, f).split(sep).join('/');
      if (ALLOWED.some((d) => rel.startsWith(`${d}/`))) continue;
      if (/@base-ui\/react/.test(readFileSync(f, 'utf8'))) offenders.push(rel);
    }
    return offenders;
  }
  it('no @base-ui/react import outside src/components|src/foundation', () => {
    const baselined = new Set(BASELINE.map((r) => r.file));
    expect(scan().filter((f) => !baselined.has(f))).toEqual([]);
  });
  it('every baseline row is still an offender (no stale rows)', () => {
    const offenders = new Set(scan());
    expect(BASELINE.map((r) => r.file).filter((f) => !offenders.has(f))).toEqual([]);
  });
});
