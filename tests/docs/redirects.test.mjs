/* tests/docs/redirects.test.ts — REQ-PLAT-83. Every docs/** path deleted by
   RM-13 has a 301 rule, sources are unique, statuses valid, and the /v4
   wildcard reaches the release/4.x Pages deployment. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRedirects, emitRedirects, rm13Paths, urlOf, V4_ORIGIN } from '../../scripts/docs/gen-redirects.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

describe('docs redirects', () => {
  it('redirects.json is fresh and every rule has a unique source', async () => {
    const rules = await buildRedirects(root);
    const { redirects } = JSON.parse(readFileSync(join(root, 'apps/docs/redirects.json'), 'utf8'));
    expect(redirects).toEqual(rules);
    expect(new Set(rules.map((r) => r.from)).size).toBe(rules.length);
    for (const r of rules) expect([301, 302]).toContain(r.status ?? 301);
  });

  it('every docs/** path deleted by RM-13 has a 301 entry', async () => {
    const rules = await buildRedirects(root);
    const srcs = new Map(rules.map((r) => [r.from, r]));
    const missing = rm13Paths(root)
      .filter((p) => p.endsWith('.md') || p.endsWith('.mdx'))
      .filter((p) => !srcs.has(urlOf(p)));
    expect(missing).toEqual([]);
    /* and each of those entries is a permanent redirect */
    const nonPerm = rm13Paths(root)
      .filter((p) => p.endsWith('.md') || p.endsWith('.mdx'))
      .map((p) => srcs.get(urlOf(p)))
      .filter((r) => r && r.status !== 301);
    expect(nonPerm).toEqual([]);
  });

  it('/v4/* reaches the release/4.x Pages deployment', async () => {
    const rules = await buildRedirects(root);
    const v4 = rules.find((r) => r.from === '/v4/*');
    expect(v4).toBeDefined();
    expect(v4.to).toContain(':splat');
    expect(v4.to.startsWith('https://')).toBe(true);
    expect(v4.status).toBe(301);
  });

  it('covers the legacy 4.x URL roots', async () => {
    const rules = await buildRedirects(root);
    const srcs = rules.map((r) => r.from);
    for (const must of ['/docs', '/recipes', '/cli', '/theme', '/liquid-glass', '/app-shell']) {
      expect(srcs.some((s) => s.startsWith(must))).toBe(true);
    }
  });

  it('emitRedirects renders Netlify-format lines', async () => {
    const out = emitRedirects(await buildRedirects(root));
    expect(out.trim().split('\n').length).toBeGreaterThan(400);
    expect(out).toContain(`/v4/* ${V4_ORIGIN}/:splat 301`);
  });
});
