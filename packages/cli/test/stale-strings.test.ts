/* stale-strings — REQ-PLAT-84: no 4.x-era release labels survive in the CLI. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.join(__dirname, '..', 'src');
const STALE = [/3\.2 target/i, /3\.3(?!\.\d)/, /3\.0\.x/];
const walk = (d: string): string[] => fs.readdirSync(d, { withFileTypes: true })
  .flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);

describe('stale release strings', () => {
  it('src/ contains no 3.2-target / 3.3 / 3.0.x mentions', () => {
    const hits: string[] = [];
    for (const f of walk(SRC)) {
      if (!/\.(ts|mts)$/.test(f)) continue;
      const text = fs.readFileSync(f, 'utf8');
      for (const re of STALE) {
        const m = text.match(re);
        if (m) hits.push(`${path.relative(SRC, f)}: ${m[0]}`);
      }
    }
    expect(hits).toEqual([]);
  });
});
