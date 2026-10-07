/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
// MAT-002: every --glass-opacity-<n> referenced in src/**/*.{ts,tsx,css} must be
// defined in src/styles/**/*.css (the shipped compat layer also defines the
// legacy primitives). A fixture string containing an undefined name like
// --glass-opacity-23 must be reported. (REQ-MAT-17; precondition for the
// 0-undefined-vars AC.)
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, walkFiles } from '../../scripts/tokens/gates/_util.mjs';

const OPACITY_RE = /--glass-opacity-([0-9]+)\b/g;
const STYLE_DIRS = ['src/styles', 'dist/css', 'dist'];

/** All defined --glass-opacity-* names across the style sheets. */
const definedOpacityVars = (): Set<string> => {
  const defined = new Set<string>();
  for (const dir of STYLE_DIRS) {
    const abs = join(ROOT, dir);
    if (!existsSync(abs)) continue;
    for (const f of walkFiles(abs, ['.css'])) {
      for (const m of readFileSync(f, 'utf8').matchAll(/--glass-opacity-[0-9]+\s*:/g))
        defined.add(m[0].slice(0, -1).trim());
    }
  }
  return defined;
};

/** Report referenced --glass-opacity-* names missing from `defined`. */
const report = (text: string, file: string, defined: Set<string>): string[] => {
  const findings: string[] = [];
  for (const m of text.matchAll(OPACITY_RE)) {
    const name = m[0];
    if (!defined.has(name)) findings.push(`${file}: ${name}`);
  }
  return findings;
};

describe('undefined --glass-opacity-* (MAT-002)', () => {
  test('every referenced opacity var is defined', () => {
    const defined = definedOpacityVars();
    const findings: string[] = [];
    for (const f of walkFiles(join(ROOT, 'src'), ['.ts', '.tsx', '.css']))
      findings.push(...report(readFileSync(f, 'utf8'), f.replace(`${ROOT}/`, ''), defined));
    console.log(`glass-opacity refs checked; defined set: ${[...defined].join(', ') || '(none)'}`);
    expect(findings).toEqual([]);
  });

  test('fixture string containing an undefined --glass-opacity-* is reported', () => {
    // --glass-opacity-24 is defined (compat layer); --glass-opacity-23 is not
    const fixture = `.x { opacity: var(--glass-opacity-23); }`;
    const findings = report(fixture, 'fixture.css', definedOpacityVars());
    expect(findings).toEqual(['fixture.css: --glass-opacity-23']);
  });
});
