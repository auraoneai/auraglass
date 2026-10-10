/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
// MAT-003 (5.0 form): --ag-* namespace integrity.
// - every public --ag-* name referenced in src/** is manifest-public, a template
//   prefix of manifest names, or one of the documented runtime/component vars
//   (brand-theme emit surface --ag-accent-1..12 / --ag-radius-<k>; the material
//   surface API reads --ag-group-spacing and --ag-backdrop-image/-video)
// - every --_ag-* name referenced in src/** is NOT manifest-public and is defined
//   in generated css (privates stay private and actually exist)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, walkFiles } from '../../scripts/tokens/gates/_util.mjs';

const NAME_RE = /--_?ag-[a-z0-9-]+/g;

const manifestVars = (): Set<string> => {
  const m = JSON.parse(readFileSync(join(ROOT, 'dist/tokens/manifest.json'), 'utf8'));
  return new Set(m.tokens.map((t: any) => t.cssVar));
};

// Public vars written at runtime by the theme functions (brand accent ramp and
// radius ramp) and the material surface API — not token-manifest entries.
const RUNTIME_PREFIXES = new Set(['--ag-accent-', '--ag-radius-']);
const COMPONENT_VARS = new Set(['--ag-group-spacing', '--ag-backdrop-image', '--ag-backdrop-video']);

const generatedVars = (): Set<string> => {
  const defined = new Set<string>();
  for (const f of [
    'dist/css/tokens.css',
    'dist/css/tailwind.css',
    'src/material/css/generated/ladders.css',
    'src/material/css/generated/floors.css',
    'src/material/css/properties.css', // hand-authored @property registry (REQ-MAT-28)
  ]) {
    const text = readFileSync(join(ROOT, f), 'utf8');
    for (const m of text.matchAll(/(--_?ag-[a-z0-9-]+)\s*:/g)) defined.add(m[1]!);
    for (const m of text.matchAll(/@property\s+(--_?ag-[a-z0-9-]+)/g)) defined.add(m[1]!);
  }
  return defined;
};

describe('--ag-* namespace (MAT-003)', () => {
  const srcFiles = walkFiles(join(ROOT, 'src'), ['.ts', '.tsx', '.css', '.mts', '.mjs'])
    // generated files legitimately contain emitted names; they are checked by the build
    .filter((f: string) => !f.includes('/generated/'));

  test('public --ag-* names in src are all manifest-public', () => {
    const pub = manifestVars();
    const isPublic = (name: string): boolean => {
      if (pub.has(name)) return true;
      if (COMPONENT_VARS.has(name)) return true;
      if (!name.endsWith('-')) return false;
      // template prefix (e.g. `--ag-color-${k}`) — valid when it prefixes a
      // manifest name or a documented runtime-emitted family
      if (RUNTIME_PREFIXES.has(name)) return true;
      for (const v of pub) if (v.startsWith(name)) return true;
      return false;
    };
    const bad: string[] = [];
    for (const f of srcFiles) {
      const text = readFileSync(f, 'utf8');
      for (const m of text.matchAll(NAME_RE)) {
        const name = m[0];
        if (name.startsWith('--_ag-')) continue;
        if (!isPublic(name)) bad.push(`${f.replace(`${ROOT}/`, '')}: ${name}`);
      }
    }
    console.log(`checked ${srcFiles.length} src files`);
    expect(bad).toEqual([]);
  });

  test('--_ag-* names in src are defined in generated css and not public', () => {
    const pub = manifestVars();
    const gen = generatedVars();
    const leaked: string[] = [];
    const missing: string[] = [];
    for (const f of srcFiles) {
      for (const m of readFileSync(f, 'utf8').matchAll(NAME_RE)) {
        const name = m[0];
        if (!name.startsWith('--_ag-')) continue;
        if (pub.has(name)) leaked.push(`${f}: ${name}`);
        else if (!gen.has(name)) missing.push(`${f.replace(`${ROOT}/`, '')}: ${name}`);
      }
    }
    expect({ leaked, missing }).toEqual({ leaked: [], missing: [] });
  });
});
