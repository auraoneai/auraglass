/** @jest-environment node */
// MAT-062: gate superset proof. The 4.x gates (scripts/ci/token-lint.js,
// check-undefined-custom-props.mjs, audit-css-var-coverage.js) cannot even run
// on next (CJS inside type:module / missing dist/styles), so their scan logic is
// re-implemented verbatim here over next's tree, normalized to {file, kind};
// every normalized finding must appear in the new gates' findings (or, for
// literals, in the measured categories the baseline ratchets).
// Out-of-scope by contract: 'animate-pulse' class checks and raw spacing px
// (padding/margin/gap) — SC-17's literal categories do not include spacing.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { ROOT, walkFiles } from '../../scripts/tokens/gates/_util.mjs';

const require2 = createRequire(join(ROOT, 'x.cjs'));
const literals = require2(join(ROOT, 'lint/rules/mat/_literals.cjs'));

// ---------- legacy check-undefined-custom-props + audit-css-var-coverage ------
// Same DEF/REF regexes as the legacy scripts; applied to every shipped css
// surface (the 4.x dist/styles + dist/tokens entries are gone on next).
const DEF_RE = /(^|[;{}\s])(--[A-Za-z0-9_-]+)\s*:/g;
const REF_RE = /var\(\s*(--[A-Za-z0-9_-]+)\s*(,|\))/g;
const EXTERNALLY_DEFINED = new Set(['--tw-gradient-stops']);

const SHIPPED_CSS = [
  'dist/css/tokens.css',
  'dist/css/tailwind.css',
  'dist/tokens.css',
  'dist/tailwind.css',
  'dist/compat/tokens.css',
  'dist/css/compat/legacy-primitives.css',
].map((f) => join(ROOT, f)).filter(existsSync);

// The legacy checks scoped "defined" to the importable entry — on next that is
// the @import closure of the shipped file (compat/tokens.css @imports tokens.css).
const importClosure = (file: string): Set<string> => {
  const seen = new Set<string>();
  const stack = [file];
  while (stack.length) {
    const f = stack.pop()!;
    if (seen.has(f)) continue;
    seen.add(f);
    for (const m of readFileSync(f, 'utf8').matchAll(/@import\s+['"]([^'"]+)['"]/g)) {
      const target = join(f, '..', m[1]!);
      if (existsSync(target)) stack.push(target);
    }
  }
  return seen;
};

const legacyUndefinedVarFindings = () => {
  const bare: Array<{ file: string; name: string }> = [];
  const fallback: Array<{ file: string; name: string }> = [];
  for (const file of SHIPPED_CSS) {
    const defs = new Set<string>();
    for (const f of importClosure(file))
      for (const m of readFileSync(f, 'utf8').matchAll(DEF_RE)) defs.add(m[2]!);
    const css = readFileSync(file, 'utf8');
    for (const m of css.matchAll(REF_RE)) {
      const name = m[1]!;
      if (defs.has(name!) || EXTERNALLY_DEFINED.has(name!)) continue;
      // audit-css-var-coverage: bare refs (no fallback) are the fatal class;
      // fallback'd refs are reported separately as 'recoverable'
      (m[2] === ')' ? bare : fallback).push({ file, name });
    }
  }
  return { bare, fallback };
};

// ---------- legacy token-lint.js ---------------------------------------------
const LEGACY_PATTERNS: Record<string, RegExp> = {
  hexColor: /#[0-9a-fA-F]{3,8}\b/g,
  rgbColor: /rgba?\s*\([^)]+\)/g,
  hslColor: /hsla?\s*\([^)]+\)/g,
  backdropFilter: /backdrop-filter\s*:/g,
  webkitBackdropFilter: /-webkit-backdrop-filter\s*:/g,
  animatePulse: /animate-pulse/g,
  boxShadow: /box-shadow\s*:\s*[^;]+(?:px|em|rem)/g,
  dropShadow: /drop-shadow\s*\([^)]+\)/g,
  rawSpacing: /(?:padding|margin|gap|space|top|right|bottom|left)\s*:\s*\d+px/g,
  borderRadius: /border-radius\s*:\s*\d+px/g,
};
const LEGACY_TO_LITERAL: Record<string, string | null> = {
  hexColor: 'color', rgbColor: 'color', hslColor: 'color',
  backdropFilter: 'blur', webkitBackdropFilter: 'blur',
  boxShadow: 'shadow', dropShadow: 'shadow',
  borderRadius: 'radius',
  animatePulse: null, // tailwind class check — not an SC-17 literal category
  rawSpacing: null,   // spacing px — not an SC-17 literal category
};

const srcFiles = walkFiles(join(ROOT, 'src'), ['.ts', '.tsx', '.css'])
  .filter((f) => !f.includes('/generated/'));

const legacyLiteralFindings = () => {
  const findings: Array<{ file: string; kind: string; category: string | null }> = [];
  for (const f of srcFiles) {
    const content = readFileSync(f, 'utf8');
    if (content.includes('token-lint-ignore-file')) continue;
    for (const [kind, re] of Object.entries(LEGACY_PATTERNS)) {
      for (const m of content.matchAll(re)) {
        // legacy regexes have no word boundary — 'rgb(' inside 'oklchToSrgb(' is a
        // known false positive; a hit mid-identifier is not a literal
        if (/[A-Za-z0-9_$]/.test(content[m.index - 1] ?? '')) continue;
        const lineStart = content.lastIndexOf('\n', m.index);
        const lineEnd = content.indexOf('\n', m.index);
        const line = content.slice(lineStart + 1, lineEnd === -1 ? undefined : lineEnd);
        if (line.includes('token-lint-ignore')) continue;
        if (kind === 'hexColor' && (line.includes('--') || line.includes('//') || line.includes('/*'))) continue;
        findings.push({ file: f.replace(`${ROOT}/`, ''), kind, category: LEGACY_TO_LITERAL[kind]! });
      }
    }
  }
  return findings;
};

// ---------- new gates ---------------------------------------------------------
const runGate = (name: string, args: string[]) => {
  try {
    const out = execFileSync('node', [join(ROOT, `scripts/tokens/gates/${name}.mjs`), ...args], {
      cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { code: 0, out };
  } catch (e: any) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
};

describe('legacy gate superset (MAT-062)', () => {
  test('undefined-var findings: new gate covers every legacy finding', () => {
    const { bare, fallback } = legacyUndefinedVarFindings();
    const gate = runGate('undefined-vars', ['--dist', join(ROOT, 'dist'), '--manifest', join(ROOT, 'dist/tokens/manifest.json'), '--quiet']);
    // every BARE (no-fallback) legacy finding must be named in the new gate's
    // output — as a failure finding or an explicitly grandfathered 4.x quirk
    const missing = bare.filter((f) => !gate.out.includes(f.name));
    console.log(`legacy undefined-var findings: ${bare.length} bare, ${fallback.length} recoverable (fallback); gate exit ${gate.code}`);
    expect(missing).toEqual([]);
    if (bare.length === 0) expect(gate.code).toBe(0);
  });

  test('literal findings: every in-category legacy hit is flagged by _literals', () => {
    const legacy = legacyLiteralFindings();
    const scoped = legacy.filter((f) => f.category !== null);
    const skipped = legacy.filter((f) => f.category === null);
    const uncovered: string[] = [];
    for (const f of scoped) {
      const abs = join(ROOT, f.file);
      if (literals.isExempt(f.file)) continue; // exempt paths are allowed literals
      const hits: Array<{ category: string }> = literals.scanText(readFileSync(abs, 'utf8'), f.file);
      if (!hits.some((h) => h.category === f.category)) uncovered.push(`${f.file}: ${f.kind}`);
    }
    console.log(`legacy literal findings: ${scoped.length} scoped (${JSON.stringify(
      scoped.reduce((acc: any, f) => ({ ...acc, [f.kind]: (acc[f.kind] ?? 0) + 1 }), {}))}), skipped-out-of-category: ${skipped.length}`);
    expect(uncovered).toEqual([]);
  });
});
