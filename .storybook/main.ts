import type { StorybookConfig } from '@storybook/react';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
    '../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
  ],

  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  // Ensure Vite pre-bundles react-reconciler/scheduler used by @react-three/fiber
  viteFinal: async (config) => {
    // Optimize dependencies for R3F to avoid CJS interop issues
    config.optimizeDeps = config.optimizeDeps || {};
    const include = new Set([
      ...(config.optimizeDeps.include || []),
      'react-reconciler',
      'scheduler',
      '@react-three/fiber',
      '@react-three/drei',
      'three',
    ]);
    config.optimizeDeps.include = Array.from(include);

    // Avoid duplicated React instances
    config.resolve = config.resolve || {} as any;
    const dedupe = new Set([...(config.resolve.dedupe || []), 'react', 'react-dom']);
    (config.resolve as any).dedupe = Array.from(dedupe);

    config.define = {
      ...(config.define || {}),
      'process.env': {
        NODE_ENV: 'development',
        NEXT_PUBLIC_IMAGE_SERVICE_URL: '',
        IMAGE_SERVICE_URL: '',
        NEXT_PUBLIC_WEBSOCKET_SERVER_URL: '',
        WEBSOCKET_SERVER_URL: '',
        REACT_APP_WEBSOCKET_URL: '',
        JEST_WORKER_ID: undefined,
      },
    };

    return config;
  },

  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  }
};

export default config;
