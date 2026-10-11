/* tests/docs/redirects.test.ts — REQ-PLAT-83 / REQ-FIN-39. Every docs/** path
   deleted by RM-13 (4842edc5e) has a 301 rule in the committed
   apps/docs/public/_redirects, the committed outputs are fresh, sources are
   unique, kept docs are not redirected, and /v4/* reaches the release/4.x
   Pages deployment. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  buildRedirects,
  emitRedirects,
  renderJson,
  rm13Paths,
  urlOf,
  REDIRECTS_FILE,
  REDIRECTS_JSON,
  V4_ORIGIN,
  type RedirectRule as Rule,
} from '../../scripts/docs/gen-redirects.mjs';

const root = join(__dirname, '..', '..');
const read = (rel: string) => readFileSync(join(root, rel), 'utf8');

/* Parse the committed Pages file independently of the generator. */
const parseRedirectsFile = (): Rule[] =>
  read(REDIRECTS_FILE)
    .split('\n')
    .filter((l) => l.trim() && !l.startsWith('#'))
    .map((l) => {
      const [from = '', to = '', status = ''] = l.trim().split(/\s+/);
      return { from, to, status: Number(status) };
    });

const deletedDocs = (): string[] =>
  execFileSync('git', ['show', '--name-only', '--diff-filter=D', '--pretty=format:', '4842edc5e', '--', 'docs'], {
    cwd: root,
    encoding: 'utf8',
  })
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^docs\/.+\.mdx?$/.test(l));

describe('docs redirects', () => {
  it('committed redirects.json and public/_redirects are fresh', async () => {
    const rules: Rule[] = await buildRedirects(root);
    expect(existsSync(join(root, REDIRECTS_FILE))).toBe(true);
    expect(read(REDIRECTS_JSON)).toBe(renderJson(rules));
    expect(read(REDIRECTS_FILE)).toBe(emitRedirects(rules));
  });

  it('every rule has a unique source and a valid status', () => {
    const rules = parseRedirectsFile();
    expect(new Set(rules.map((r) => r.from)).size).toBe(rules.length);
    for (const r of rules) {
      expect([301, 302]).toContain(r.status);
      expect(r.to).toMatch(/^(\/|https:\/\/)/);
    }
  });

  it('every docs/** path deleted by RM-13 has a 301 line in public/_redirects', () => {
    const deleted = deletedDocs();
    expect(deleted.length).toBeGreaterThan(400);
    const bySource = new Map(parseRedirectsFile().map((r) => [r.from, r]));
    const missing = deleted.filter((p) => !bySource.has(urlOf(p)));
    expect(missing).toEqual([]);
    const nonPermanent = deleted.map((p) => bySource.get(urlOf(p))!).filter((r) => r.status !== 301);
    expect(nonPermanent).toEqual([]);
  });

  it('only deleted paths get an explicit rule (kept docs are not redirected)', () => {
    const deleted = new Set(deletedDocs());
    expect(rm13Paths(root).filter((p: string) => /\.mdx?$/.test(p)).sort()).toEqual([...deleted].sort());
    /* docs/guides/component-standards.md was modified, not deleted, by RM-13 */
    expect(existsSync(join(root, 'docs/guides/component-standards.md'))).toBe(true);
    const sources = new Set(parseRedirectsFile().map((r) => r.from));
    expect(sources.has('/guides/component-standards')).toBe(false);
  });

  it('/v4/* reaches the release/4.x Pages deployment', () => {
    const v4 = parseRedirectsFile().find((r) => r.from === '/v4/*');
    expect(v4).toEqual({ from: '/v4/*', to: `${V4_ORIGIN}/:splat`, status: 301 });
    expect(V4_ORIGIN.startsWith('https://')).toBe(true);
  });

  it('covers the legacy 4.x URL roots', () => {
    const sources = parseRedirectsFile().map((r) => r.from);
    for (const must of ['/docs', '/recipes', '/cli', '/theme', '/liquid-glass', '/app-shell']) {
      expect(sources.some((s) => s.startsWith(must))).toBe(true);
    }
  });
});
