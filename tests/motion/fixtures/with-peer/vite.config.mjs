/* REQ-MAT-50 fixture: a plain Vite client build (no framework plugin, no
 * resolve aliases or polyfills) so that any `node:` import reaching the client
 * graph from aura-glass/motion fails the build or shows up in the output. */
import { defineConfig } from 'vite';

export default defineConfig({
  build: { outDir: 'dist', emptyOutDir: true, minify: false, sourcemap: false },
  logLevel: 'info',
});
