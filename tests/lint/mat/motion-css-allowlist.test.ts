/* @jest-environment node */
/* REQ-MAT-42 / REQ-MAT-51: scripts/mat/verify-motion-css.mjs
   - the transition allow-list is exactly ANIMATABLE (S-12, src/contracts/motion.ts):
     rotate, --_ag-hover, --_ag-pointer, paint colours and display/overlay fail;
   - a transitioned custom property must be registered with @property (the real
     src/**\/*.css registry, not an --ag-/--_ag- prefix);
   - the expiring REQ-MAT-51 rows (scripts/mat/motion-css-baseline.json) carry
     other streams' pre-existing findings by (file, rule), fail as STALE, fail
     at RC-1, and cannot carry a non-baselinable rule;
   - a full source run exits 0 with the committed rows. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ANIMATABLE } from '../../../src/contracts/motion';
import {
  ALLOWED_PROPS, applyBaseline, checkCss, registeredCustomProps, MOTION_CSS_BASELINE,
} from '../../../scripts/mat/verify-motion-css.mjs';

const ROOT = join(__dirname, '../../..');
const SCRIPT = join(ROOT, 'scripts/mat/verify-motion-css.mjs');
import type { MotionCssIssue as Issue } from '../../../scripts/mat/verify-motion-css.mjs';
const rulesOf = (css: string, opts?: { registered?: Set<string> }) =>
  checkCss(css, 'x.css', opts).issues.map((i) => i.rule);

describe('ANIMATABLE allow-list (REQ-MAT-42)', () => {
  it('ALLOWED_PROPS is exactly the contract ANIMATABLE', () => {
    expect([...ALLOWED_PROPS].sort()).toEqual([...ANIMATABLE].sort());
  });

  it.each(['rotate', '--_ag-hover', '--_ag-pointer', 'color', 'background-color', 'border-color',
    'outline-color', 'display', 'overlay'])('%s is not allowed in a transition', (prop) => {
    expect(rulesOf(`.a { transition: ${prop} var(--ag-duration-micro) var(--ag-ease-standard); }`)).toContain('not-allowed');
  });

  it.each([...ANIMATABLE])('%s is allowed', (prop) => {
    expect(rulesOf(`.a { transition-property: ${prop}; }`)).toEqual([]);
  });
});

describe('registered custom properties (REQ-MAT-51)', () => {
  it('the registry is the real @property set (includes the MAT scalars)', () => {
    const reg = registeredCustomProps();
    for (const p of ['--ag-specular', '--_ag-optics', '--_ag-press', '--_ag-refraction-scale']) expect(reg.has(p)).toBe(true);
    // --_ag-pointer stays an unregistered string (REQ-MAT-49); --_ag-hover folds into --ag-specular
    expect(reg.has('--_ag-pointer')).toBe(false);
    expect(reg.has('--_ag-hover')).toBe(false);
  });

  it('an --ag- prefixed but unregistered transitioned property fails', () => {
    expect(rulesOf('.a { transition-property: --ag-unregistered-thing; }')).toContain('unregistered-custom');
  });

  it('a property registered in the same stylesheet passes the registry check', () => {
    const r = rulesOf('@property --ag-local { syntax: "<number>"; inherits: false; initial-value: 0; } .a { transition-property: --ag-local; }', { registered: new Set() });
    expect(r).not.toContain('unregistered-custom');
  });

  it('var() references to tokens in a transition are not transitioned properties', () => {
    expect(rulesOf('.a { transition: opacity var(--ag-duration-small) var(--ag-ease-standard); }')).toEqual([]);
  });
});

describe('REQ-MAT-51 expiring rule rows', () => {
  const issue = (file: string, rule: string): Issue => ({ file, line: 1, col: 1, rule, message: 'm' });
  const row = (file: string, rule: string) => ({ file, rule, owner: 'CMP', req: 'REQ-FIN-76', expires: 'RC-1' });

  it('a (file, rule) row covers the finding before RC-1', () => {
    expect(applyBaseline([issue('a.css', 'not-allowed')], [row('a.css', 'not-allowed')], { version: '5.0.0-alpha.1' })).toEqual([]);
  });

  it('a row for one rule does not cover another rule in the same file', () => {
    const out = applyBaseline([issue('a.css', 'literal-outside-tokens')], [row('a.css', 'not-allowed')], { version: '5.0.0-alpha.1' });
    expect(out.some((l) => l.includes('literal-outside-tokens') && l.includes('[NEW'))).toBe(true);
    expect(out.some((l) => l.includes('baseline row of not-allowed is STALE'))).toBe(true);
  });

  it('every row fails at RC-1', () => {
    const out = applyBaseline([issue('a.css', 'not-allowed')], [row('a.css', 'not-allowed')], { version: '5.0.0-rc.1' });
    expect(out.join('\n')).toContain('[EXPIRED: baseline row (owner CMP, REQ-FIN-76) expired at RC-1');
  });

  it('a non-baselinable rule row is malformed and does not cover', () => {
    const out = applyBaseline([issue('a.css', 'bezier-range')], [row('a.css', 'bezier-range')], { version: '5.0.0-alpha.1' });
    expect(out.some((l) => l.includes('baseline row is malformed'))).toBe(true);
    expect(out.some((l) => l.includes('bezier-range'))).toBe(true);
  });

  it('committed rows are well-formed, unique per (file, rule) and owned by another stream', () => {
    const { rows } = JSON.parse(readFileSync(join(ROOT, MOTION_CSS_BASELINE), 'utf8')) as { rows: Array<{ file: string; rule: string; owner: string; req: string; expires: string }> };
    const keys = rows.map((r) => `${r.file}|${r.rule}`);
    expect(new Set(keys).size).toBe(keys.length);
    for (const r of rows) {
      expect(Object.keys(r).sort()).toEqual(['expires', 'file', 'owner', 'req', 'rule']);
      expect(['not-allowed', 'literal-outside-tokens']).toContain(r.rule);
      expect(r.expires).toBe('RC-1');
      expect(r.owner).not.toBe('MAT');
      expect(r.file.startsWith('src/motion/')).toBe(false);
    }
  });

  it('a full source run exits 0 with the committed rows (L1 cell)', () => {
    const out = execFileSync(process.execPath, [SCRIPT, '--no-dist'], {
      cwd: ROOT, encoding: 'utf8', env: { ...process.env, AG_VERSION: '5.0.0-alpha.1' }, stdio: ['ignore', 'pipe', 'pipe'],
    });
    expect(out).toMatch(/verify-motion-css: clean \(\d+ files/);
  });
});
