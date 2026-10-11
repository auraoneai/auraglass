/* REQ-QUAL-17 console allowlist (QUAL, FIN-430): {regex, owner, expires ≤90 d, reason}; errors are never allowlisted. */
import { describe, expect, it } from '@jest/globals';
import { fileURLToPath } from 'node:url';
import { consoleViolations, loadConsoleAllowlist, parseConsoleAllowlist } from '../src/evidence/consoleAllowlist';

const ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const NOW = new Date('2026-10-10T12:00:00Z');
const entry = (over: Record<string, unknown> = {}) => ({ regex: '^\\[aura-glass\\] deprecated', owner: 'cmp', expires: '2026-12-01', reason: 'GlassButton alias warns until RM-11 lands', ...over });

describe('console-allowlist.json', () => {
  it('the committed allowlist is valid today (an entry expires out of it, never silently)', () => {
    expect(() => loadConsoleAllowlist(ROOT, new Date())).not.toThrow();
  });
  it('accepts an entry expiring within 90 days', () => {
    expect(parseConsoleAllowlist([entry()], NOW)).toHaveLength(1);
  });
  it('rejects an entry whose expiry is more than 90 days out', () => {
    expect(() => parseConsoleAllowlist([entry({ expires: '2027-01-09' })], NOW)).toThrow(/more than 90 days ahead/);
  });
  it('rejects an expired entry', () => {
    expect(() => parseConsoleAllowlist([entry({ expires: '2026-10-09' })], NOW)).toThrow(/expired on 2026-10-09/);
  });
  it('rejects unknown owners, extra keys, bad regexes and missing reasons', () => {
    expect(() => parseConsoleAllowlist([entry({ owner: 'docs' })], NOW)).toThrow(/owner must be one of/);
    expect(() => parseConsoleAllowlist([entry({ gate: 'console' })], NOW)).toThrow(/keys must be exactly/);
    expect(() => parseConsoleAllowlist([entry({ regex: '(' })], NOW)).toThrow(/regex does not compile/);
    expect(() => parseConsoleAllowlist([entry({ reason: '' })], NOW)).toThrow(/reason must say why/);
  });
});

describe('consoleViolations', () => {
  const allow = parseConsoleAllowlist([entry()], NOW);
  it('an allowlisted warning passes; any other warning, every error and every pageerror fail', () => {
    const v = consoleViolations([
      { kind: 'warning', text: '[aura-glass] deprecated GlassButton' },
      { kind: 'warning', text: 'Warning: Each child in a list should have a unique "key" prop.' },
      { kind: 'error', text: '[aura-glass] deprecated GlassButton' },
      { kind: 'pageerror', text: 'TypeError: x is undefined' },
    ], allow);
    expect(v.map((e) => e.kind)).toEqual(['warning', 'error', 'pageerror']);
  });
});
