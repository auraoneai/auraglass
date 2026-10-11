import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

/* PLAT-291: Vite 7 + React 19.3, no Tailwind — the cascade proof runs against
   the assembled stylesheet with the bridge layer order statement. */

/* Per-entry CSS ships through the `css` export condition of each JS entry
   (contract: `./data` -> { types, default, css: './dist/data.css' }); there is
   no `./data.css` subpath. Vite's resolver does not read the `css` condition,
   so `import 'aura-glass/data.css'` is mapped to the `css` target of the
   `./data` entry of the INSTALLED (packed) aura-glass. Unknown entries fall
   through and fail resolution as before. */
function auraGlassEntryCss(): Plugin {
  const require = createRequire(import.meta.url);
  let pkgDir: string | undefined;
  let exportsMap: Record<string, unknown> = {};
  return {
    name: 'ag-canary-entry-css',
    enforce: 'pre',
    resolveId(id) {
      const m = id.match(/^aura-glass\/([a-z0-9-]+)\.css$/);
      if (!m) return null;
      if (!pkgDir) {
        const pkgJson = require.resolve('aura-glass/package.json');
        pkgDir = dirname(pkgJson);
        exportsMap = JSON.parse(readFileSync(pkgJson, 'utf8')).exports ?? {};
      }
      if (exportsMap[`./${m[1]}.css`]) return null; /* real css subpath: default resolver */
      const entry = exportsMap[`./${m[1]}`];
      const css = entry && typeof entry === 'object' ? (entry as { css?: unknown }).css : undefined;
      return typeof css === 'string' ? join(pkgDir, css) : null;
    },
  };
}

export default defineConfig({
  plugins: [auraGlassEntryCss(), react()],
});
