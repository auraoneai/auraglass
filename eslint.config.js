/**
 * ESLint v9+ Configuration (Flat Config)
 * AuraGlass Design System with Glass Discipline Rules
 */

const auraglassPlugin = require('./eslint-plugin-auraglass.js');

module.exports = [
  // Main configuration for TypeScript/React files
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    ignores: ['**/*.{test,spec}.{js,jsx,ts,tsx}', '**/__tests__/**', 'src/tests/**', 'src/**/*.stories.{js,jsx,ts,tsx}', 'src/hooks/useReducedMotion.tsx'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        project: './tsconfig.json'
      }
    },
    plugins: {
      'auraglass': auraglassPlugin
    },
    rules: {
      // AuraGlass Design System Rules - CRITICAL FOR UNIFIED GLASS
      'auraglass/no-inline-glass': 'error',
      'auraglass/require-glass-tokens': 'warn',
      'auraglass/no-raw-tailwind': ['warn', { 
        allow: [
          'glass-', 
          'sb-', 
          'storybook-', 
          'auraglass-',
          'persona-picker',
          'zspace-',
          'workspace-',
          'spatial-',
          'dimensional-',
          'glowing-card',
          'liquid-glass',
          'dialog-',
          'nav-item',
          'custom-preview',
          'animation-debug',
          'interaction-',
          'gesture-',
          'premium-',
          'trend-',
          'skip-links',
          'container-responsive',
          'consciousness-',
          'generated-component',
          'occlusion-layer'
        ] 
      }],
      'auraglass/no-inline-style-attr': 'warn'
    }
  },

  // Global ignores
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'src/styles/_deprecated/**',
      'src/styles/glass.generated.css',
      'reports/**',
      '**/*.{test,spec}.{js,jsx,ts,tsx}',
      '**/__tests__/**',
      'src/tests/**',
      'src/**/*.stories.{js,jsx,ts,tsx}' // Add this line
    ]
  }
];
