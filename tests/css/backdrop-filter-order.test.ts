/* MAT: `-webkit-backdrop-filter` must never be the LAST of a same-rule pair.
   LightningCSS (Turbopack/Next, Vite) dedupes the prefixed+standard pair
   keeping only the later declaration; with `-webkit-` last, the standard
   property vanished from consumer builds and Chromium computed
   `backdrop-filter: none` on surface ::before (quickstart parity failure).
   Standard-last keeps both: older Safari reads `-webkit-`, everything else
   the standard property. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const SHIPPED_PAIR_SOURCES = [
  'src/material/css/material.css',
  'src/material/css/lens.css',
  'src/a11y/css/rungs.css',
];

describe('backdrop-filter declaration order', () => {
  it.each(SHIPPED_PAIR_SOURCES)('%s declares standard backdrop-filter after -webkit-', (rel) => {
    const css = readFileSync(join(process.cwd(), rel), 'utf8');
    const standardThenWebkit = /(?<!-webkit-)backdrop-filter:\s*([^;]+);\s*\n\s*-webkit-backdrop-filter:\s*\1;/;
    expect(css).not.toMatch(standardThenWebkit);
  });
});
