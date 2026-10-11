/* @ag-contract-seed: C0-12. Owner QUAL replaces internals; stories/staticDirs are verbatim (§4.11). */
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)',
    '../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)',
    '../registry/**/*.stories.@(ts|tsx)', '../showcase/**/*.stories.@(ts|tsx)',
    '../certification/scenes/**/*.stories.@(ts|tsx)', '../.storybook/lab/**/*.stories.@(ts|tsx)',
  ],
  staticDirs: [{ from: '../certification/scenes', to: '/scenes' }],
  framework: { name: '@storybook/react-vite', options: { builder: { viteConfigPath: '.storybook/vite.config.ts' } } },
  addons: ['@storybook/addon-docs'],
};

export default config;
