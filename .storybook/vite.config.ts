/*
 * Storybook-owned Vite config (FIN-G). The root vite.config.ts imports
 * @vitejs/plugin-react, which is not a dependency of this package, so the
 * Storybook builder is pointed here instead. JSX is compiled by Vite's
 * built-in esbuild transform using the automatic runtime (matches
 * tsconfig "jsx": "react-jsx").
 *
 * C-4: showcases/registry items import the package by name ('aura-glass',
 * 'aura-glass/app-shell', ...). As in jest.config.js, those specifiers resolve
 * to the ENTRIES sources (src/contracts/entries.ts), never to dist/, so the
 * Storybook build does not depend on a prior package build. Subpaths not in
 * ENTRIES stay unresolvable, as in the published package.
 */
import { fileURLToPath } from 'node:url';
import { defineConfig, type Alias } from 'vite';
import { ENTRIES } from '../src/contracts/entries';

const root = fileURLToPath(new URL('..', import.meta.url));
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const entryAliases: Alias[] = ENTRIES.filter((e) => /\.tsx?$/.test(e.source)).map((e) => ({
  find: new RegExp(`^${escape(e.subpath === '.' ? 'aura-glass' : `aura-glass/${e.subpath.slice(2)}`)}$`),
  replacement: root + e.source,
}));

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  resolve: {
    alias: [
      ...entryAliases,
      // './icons/<name>' pattern export (ENTRIES comment on './icons').
      { find: /^aura-glass\/icons\/(.+)$/, replacement: `${root}src/icons/$1` },
      // Registry items import sibling items at their shadcn install path
      // ('@/registry/items/<name>'); in this repo those live under registry/.
      { find: /^@\/registry\/(.+)$/, replacement: `${root}registry/$1` },
    ],
  },
});
