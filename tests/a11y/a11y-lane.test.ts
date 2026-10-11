/** @jest-environment node */
/* REQ-MAT-65 (D.3-39): scripts/mat/a11y-lane.mjs — argument parsing, scope
   mapping, static-path containment and the local refusal (exit 2 with the
   remote command; browser lanes never run on a workstation). */
import { describe, expect, it, jest } from '@jest/globals';
import path from 'node:path';
import { parseArgs, sweepScopeFor, resolveStatic, main } from '../../scripts/mat/a11y-lane.mjs';

describe('a11y-lane', () => {
  it('parses suite, engine and shard and rejects anything else', () => {
    expect(parseArgs(['--suite', 'e2e', '--engine', 'webkit'])).toEqual({ suite: 'e2e', engine: 'webkit', shard: null });
    expect(parseArgs(['--suite', 'pixel-contrast', '--engine', 'firefox', '--shard', '2/3']).shard).toBe('2/3');
    expect(() => parseArgs(['--suite', 'visual', '--engine', 'webkit'])).toThrow(/--suite/);
    expect(() => parseArgs(['--suite', 'e2e', '--engine', 'edge'])).toThrow(/--engine/);
    expect(() => parseArgs(['--suite', 'e2e', '--engine', 'chromium', '--shard', '0/3'])).toThrow(/--shard/);
  });

  it('sweeps the whole index only on nightly and release scope', () => {
    expect(sweepScopeFor('nightly')).toBe('full');
    expect(sweepScopeFor('release')).toBe('full');
    expect(sweepScopeFor('main')).toBe('pr');
    expect(sweepScopeFor('pr')).toBe('pr');
    expect(sweepScopeFor(undefined)).toBe('pr');
  });

  it('keeps served paths inside storybook-static', () => {
    const dir = path.resolve('storybook-static');
    expect(resolveStatic(dir, '/iframe.html?id=x')).toBe(path.join(dir, 'iframe.html'));
    expect(resolveStatic(dir, '/../package.json')).toBeNull();
    expect(resolveStatic(dir, '/%2e%2e/package.json')).toBeNull();
  });

  it('refuses to run outside CI / the remote runner with exit 2 and the remote command', async () => {
    const err = jest.spyOn(console, 'error').mockImplementation(() => {});
    const code = await main(['--suite', 'e2e', '--engine', 'chromium'], {});
    expect(code).toBe(2);
    expect(err.mock.calls.flat().join('\n')).toMatch(/Remote command: node scripts\/mat\/a11y-lane\.mjs --suite e2e --engine chromium/);
    err.mockRestore();
  });
});
