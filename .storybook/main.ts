/* @ag-contract-seed: C0-12. Owner QUAL replaces internals; stories/staticDirs are verbatim (§4.11). */
/* QUAL internals (REQ-QUAL-56/-57, REQ-FIN-106, FIN-452): `AG_STORYBOOK_DIST=1` resolves the library through
   package exports to dist/ (.storybook/build/aura-glass-resolve.ts); @storybook/addon-a11y runs in the
   interactive Storybook (the gate of record is REQ-QUAL-19). */
import { resolve } from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';
import { REPORT_ENV, resolveMode, withAuraGlassResolution } from './build/aura-glass-resolve';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)',
    '../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)',
    '../registry/**/*.stories.@(ts|tsx)', '../showcase/**/*.stories.@(ts|tsx)',
    '../certification/scenes/**/*.stories.@(ts|tsx)', '../.storybook/lab/**/*.stories.@(ts|tsx)',
  ],
  staticDirs: [{ from: '../certification/scenes', to: '/scenes' }],
  framework: { name: '@storybook/react-vite', options: { builder: { viteConfigPath: '.storybook/vite.config.ts' } } },
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  viteFinal: (viteConfig, options) =>
    withAuraGlassResolution(viteConfig, {
      root: resolve(options.configDir, '..'),
      mode: resolveMode(),
      reportPath: process.env[REPORT_ENV],
    }),
};

export default config;
