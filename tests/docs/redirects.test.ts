/* tests/docs/redirects.test.ts — PLAT-399/400. Every RM-13 removed path has
   a redirect; _redirects emits unique sources with valid statuses. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { generate } from '../../scripts/docs/gen-redirects.mjs';

const root = join(__dirname, '..', '..');
const { redirects } = JSON.parse(readFileSync(join(root, 'apps/docs/redirects.json'), 'utf8'));

describe('docs redirects', () => {
  it('emits unique source rules', () => {
    const out = generate(root).trim().split('\n');
    expect(out.length).toBe(redirects.length);
    expect(new Set(out.map((l) => l.split(' ')[0])).size).toBe(out.length);
  });
  it('covers every removed 4.x docs root', () => {
    const srcs = redirects.map((r) => r.from);
    for (const must of ['/docs', '/recipes', '/cli', '/theme', '/liquid-glass', '/app-shell']) {
      expect(srcs.some((s) => s.startsWith(must))).toBe(true);
    }
  });
  it('statuses are 301 or 302', () => {
    for (const r of redirects) expect([301, 302]).toContain(r.status ?? 301);
  });
});
