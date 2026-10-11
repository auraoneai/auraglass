/*
 * Storybook-owned Vite config (FIN-G). The root vite.config.ts imports
 * @vitejs/plugin-react, which is not a dependency of this package, so the
 * Storybook builder is pointed here instead. JSX is compiled by Vite's
 * built-in esbuild transform using the automatic runtime (matches
 * tsconfig "jsx": "react-jsx").
 */
import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
});
