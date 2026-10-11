/*
 * Storybook-owned Vite config (FIN-G). The root vite.config.ts imports
 * @vitejs/plugin-react, which is not a dependency of this package, so the
 * Storybook builder is pointed here instead. JSX is compiled by Vite's
 * built-in esbuild transform using the automatic runtime (matches
 * tsconfig "jsx": "react-jsx").
 *
 * C-4: showcases/registry items import the package by name ('aura-glass',
 * 'aura-glass/app-shell', ...). As in jest.config.js, those specifiers resolve
 * to ENTRIES sources in development. Dist builds leave package resolution to
 * auraGlassResolve and require built exports. Registry references use a narrowly
 * scoped plugin in both modes, without a general @/ or src alias.
 */
import { fileURLToPath } from 'node:url';
import { defineConfig, type Alias } from 'vite';
import { ENTRIES } from '../src/contracts/entries';
import { registryResolve, resolveMode } from './build/aura-glass-resolve';

const root = fileURLToPath(new URL('..', import.meta.url));
const sourceMode = resolveMode() === 'source';
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const entryAliases: Alias[] = ENTRIES.filter((e) => /\.tsx?$/.test(e.source)).map((e) => ({
  find: new RegExp(`^${escape(e.subpath === '.' ? 'aura-glass' : `aura-glass/${e.subpath.slice(2)}`)}$`),
  replacement: root + e.source,
}));

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  plugins: [registryResolve(root)],
  resolve: {
    alias: sourceMode ? [
      ...entryAliases,
      // './icons/<name>' pattern export (ENTRIES comment on './icons').
      { find: /^aura-glass\/icons\/(.+)$/, replacement: `${root}src/icons/$1` },
    ] : [],
  },
});
