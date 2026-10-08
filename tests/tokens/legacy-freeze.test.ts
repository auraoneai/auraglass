/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
// MAT-004: legacy freeze — re-run the 4.x extraction in memory and deep-equal the
// committed tokens/legacy/4x-rendered.tokens.json; >= 1 entry per --glass-*
// primitive found in the frozen 4.x tokens.css (REQ-MAT-21).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../../scripts/tokens/validate.mjs';
import { extractLegacyDeclarations, legacySourceCss, legacyTokensJson } from '../../scripts/tokens/formats/compat-aliases.mjs';

const FROZEN = join(ROOT, 'tokens/legacy/4x-rendered.tokens.json');

describe('legacy freeze (MAT-004)', () => {
  test('re-extraction deep-equals committed freeze', () => {
    const committed = JSON.parse(readFileSync(FROZEN, 'utf8'));
    const decls = extractLegacyDeclarations(legacySourceCss());
    const rerun = legacyTokensJson(decls);
    expect(rerun).toEqual(committed);
  });

  test('>= 1 entry per --glass-* primitive in 4.x tokens.css', () => {
    const committed = JSON.parse(readFileSync(FROZEN, 'utf8'));
    const css = legacySourceCss();
    const primitives = new Set<string>();
    for (const m of css.matchAll(/(--glass-[a-zA-Z0-9-]+)\s*:/g)) primitives.add(m[1]!);
    const names = new Set(Object.keys(committed.legacy).map((k) => committed.legacy[k].$extensions['ag.legacyVar']));
    const missing = [...primitives].filter((p) => !names.has(p));
    console.log(`4.x --glass-* primitives: ${primitives.size}, freeze entries: ${Object.keys(committed.legacy).length}`);
    expect(missing).toEqual([]);
    expect(Object.keys(committed.legacy).length).toBeGreaterThanOrEqual(primitives.size);
  });
});
