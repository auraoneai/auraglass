/* @jest-environment node */
/* REQ-FIN-07 (AC-FIN-07, PRD-F §4.3 rule 3): the no-overlay-global-listeners
   gate. The lint rule runs at `error` over src/components/**,
   src/primitives/** and the SURF overlay dirs; offenders outside FIN-A files
   sit in the shrink-only baseline
   scripts/integration/baselines/no-overlay-global-listeners.json. This test
   fails on a new offender, on a stale row (file no longer offends), on a
   malformed or expired row, and when the rule config stops ignoring exactly
   the baseline. */
import { describe, expect, it } from '@jest/globals';
import { createRequire } from 'node:module';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { Linter } from 'eslint';

const ROOT = process.cwd();
const require = createRequire(join(ROOT, 'package.json'));
const rule = require('./lint/rules/cmp/no-overlay-global-listeners.cjs') as {
  meta: unknown;
  create: unknown;
  agConfig: Array<{ files: string[]; ignores?: string[]; severity: string }>;
  SCOPE: string[];
  IGNORES: string[];
};
// Loaded through require: the babel ESM interop would hand Linter the module
// namespace instead of the parser, and it would silently fall back to espree.
const tsParser = require('@typescript-eslint/parser') as Linter.Parser;
const BASELINE_PATH = 'scripts/integration/baselines/no-overlay-global-listeners.json';
const baseline = JSON.parse(readFileSync(join(ROOT, BASELINE_PATH), 'utf8')) as Array<{
  file: string; owner: string; reqFin: string; expires: string;
}>;

/* REQ-FIN-07's own files may never be baselined: FIN-A fixes them here. */
const FIN_A_FILES = new Set([
  'src/foundation/portal.ts',
  'src/components/overlays/_shared/useOverlayLayer.ts',
  'src/primitives/DismissableLayer.tsx',
  'src/primitives/FocusScope.tsx',
]);
const STREAMS = new Set(['PLAT', 'MAT', 'CMP', 'SURF', 'QUAL']);
const NON_BASELINE_IGNORES = ['**/__fixtures__/**', '**/__tests__/**', '**/*.test.*', '**/*.stories.*'];
const SCAN_ROOTS = ['src/components', 'src/primitives', 'src/app-shell', 'src/media/ImageViewer'];

const toPosix = (p: string) => p.split(sep).join('/');
const walk = (dir: string, out: string[] = []): string[] => {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
};

const plugin = { rules: { 'no-overlay-global-listeners': { meta: rule.meta, create: rule.create } } };
const languageOptions = {
  parser: tsParser,
  ecmaVersion: 2023 as const,
  sourceType: 'module' as const,
  parserOptions: { ecmaFeatures: { jsx: true } },
};
const configFor = (ignores: string[]) => [{
  files: rule.SCOPE,
  ignores,
  languageOptions,
  plugins: { auraglass: plugin },
  rules: { 'auraglass/no-overlay-global-listeners': 'error' as const },
}];
const linter = new Linter({ configType: 'flat', cwd: ROOT });
const ruleHits = (code: string, file: string, ignores: string[]) => {
  const messages = linter.verify(code, configFor(ignores) as never, join(ROOT, file));
  const fatal = messages.filter((m) => m.fatal);
  if (fatal.length > 0) throw new Error(`${file}: ${fatal.map((m) => m.message).join('; ')}`);
  return messages.filter((m) => m.ruleId === 'auraglass/no-overlay-global-listeners');
};

describe('no-overlay-global-listeners gate (REQ-FIN-07)', () => {
  it('rule is at error over components, primitives and the SURF overlay dirs', () => {
    expect(rule.agConfig).toHaveLength(1);
    const [cfg] = rule.agConfig;
    expect(cfg!.severity).toBe('error');
    expect(cfg!.files).toEqual(expect.arrayContaining([
      'src/components/**/*.{ts,tsx}',
      'src/primitives/**/*.{ts,tsx}',
      'src/app-shell/**/*.{ts,tsx}',
      'src/media/ImageViewer/**/*.{ts,tsx}',
    ]));
  });

  it('baseline rows are well-formed, unique, unexpired and outside FIN-A files', () => {
    const seen = new Set<string>();
    for (const row of baseline) {
      expect(Object.keys(row).sort()).toEqual(['expires', 'file', 'owner', 'reqFin']);
      expect(existsSync(join(ROOT, row.file))).toBe(true);
      expect(STREAMS.has(row.owner)).toBe(true);
      expect(row.reqFin).toMatch(/^REQ-FIN-\d+$/);
      expect(row.reqFin).not.toBe('REQ-FIN-07');
      expect(row.expires).toBe('RC-1');
      expect(FIN_A_FILES.has(row.file)).toBe(false);
      expect(seen.has(row.file)).toBe(false);
      seen.add(row.file);
    }
  });

  it('the rule config ignores exactly the baseline files (plus tests/fixtures/stories)', () => {
    const ignores = rule.agConfig[0]!.ignores ?? [];
    expect([...ignores].sort()).toEqual([...NON_BASELINE_IGNORES, ...baseline.map((r) => r.file)].sort());
  });

  it('current offenders equal the baseline: no new offender, no stale row', () => {
    const offenders: string[] = [];
    for (const dir of SCAN_ROOTS) {
      for (const abs of walk(join(ROOT, dir))) {
        const file = toPosix(relative(ROOT, abs));
        if (ruleHits(readFileSync(abs, 'utf8'), file, NON_BASELINE_IGNORES).length > 0) offenders.push(file);
      }
    }
    expect(offenders.sort()).toEqual(baseline.map((r) => r.file).sort());
  });

  it('a new offender in scope fails with the rule message; a baseline file is ignored', () => {
    const bad = "export const f = () => { document.addEventListener('keydown', () => {}); document.body.style.overflow = 'hidden'; };";
    const hits = ruleHits(bad, 'src/components/new-overlay/NewOverlay.tsx', rule.agConfig[0]!.ignores ?? []);
    expect(hits.map((m) => m.messageId)).toEqual(['listener', 'bodyStyle']);
    expect(hits.every((m) => m.severity === 2)).toBe(true);
    expect(hits[0]!.message).toContain('register with the LayerStack');
    const primitivesHit = ruleHits(bad, 'src/primitives/NewPrimitive.tsx', rule.agConfig[0]!.ignores ?? []);
    expect(primitivesHit).toHaveLength(2);
    if (baseline.length > 0) {
      expect(ruleHits(bad, baseline[0]!.file, rule.agConfig[0]!.ignores ?? [])).toEqual([]);
    }
  });

  it('AC-FIN-07: no document listener or body style write in primitives, theme/layers, foundation', () => {
    const pattern = /document\.(add|remove)EventListener|document\.body\.style/;
    const hits: string[] = [];
    for (const dir of ['src/primitives', 'src/theme/layers', 'src/foundation']) {
      for (const abs of walk(join(ROOT, dir))) {
        if (/\.test\./.test(abs)) continue;
        readFileSync(abs, 'utf8').split('\n').forEach((line, i) => {
          if (pattern.test(line)) hits.push(`${toPosix(relative(ROOT, abs))}:${i + 1}`);
        });
      }
    }
    expect(hits).toEqual([]);
  });

  it('AC-FIN-07: exactly one usePortalContainer implementation in src', () => {
    const defs: string[] = [];
    for (const abs of walk(join(ROOT, 'src'))) {
      const n = readFileSync(abs, 'utf8').split('\n').filter((l) => /export function usePortalContainer\b/.test(l)).length;
      if (n > 0) defs.push(`${toPosix(relative(ROOT, abs))}:${n}`);
    }
    expect(defs).toEqual(['src/theme/portal.ts:1']);
  });
});
