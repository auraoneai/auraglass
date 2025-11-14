import path from 'node:path';
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import preserveDirectives from 'rollup-preserve-directives';

const manualExternalDeps = [
    'react',
    'react-dom',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    'react-dom/server',
    'next/dist/compiled/react',
    'next/dist/compiled/react/jsx-runtime',
    'next/dist/compiled/react-dom',
    'next/dist/compiled/react-dom/server',
    'next/navigation',
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    'framer-motion',
    'lucide-react',
    'clsx',
    'tailwind-merge',
    'chart.js',
    'react-chartjs-2',
    'socket.io-client',
    'openai',
    '@tensorflow/tfjs',
    'date-fns',
    'bcryptjs',
    'redis',
    'zod',
    'react-hook-form',
    '@google-cloud/vision',
    '@pinecone-database/pinecone',
    '@sentry/react',
];

const manualExternalSet = new Set(manualExternalDeps);

const externalPatterns = [
    /^react\//,
    /^react-dom\//,
    /^@radix-ui\/react-/,
    /^@radix-ui\/primitive/,
    /^@radix-ui\/utilities/,
    /^@react-three\//,
    /^three\//,
    /^framer-motion\//,
    /^@sentry\//,
    /^@floating-ui\//,
    /^next\/dist\/compiled\//,
];

const normalizePath = (value) => value.split(path.sep).join('/');

const isExternal = (idInput) => {
    if (typeof idInput !== 'string') {
        return false;
    }

    if (manualExternalSet.has(idInput)) {
        return true;
    }

    const normalizedId = normalizePath(idInput);

    if (manualExternalSet.has(normalizedId)) {
        return true;
    }

    if (externalPatterns.some((pattern) => pattern.test(idInput)) || externalPatterns.some((pattern) => pattern.test(normalizedId))) {
        return true;
    }

    // Preserve bare imports for any declared peer dependency so they never bundle
    if (
        !idInput.startsWith('.') &&
        !idInput.startsWith('/') &&
        !idInput.startsWith('\0') &&
        !idInput.startsWith('src/') &&
        /^@?[^.:\/]+$/.test(idInput)
    ) {
        return true;
    }

    return false;
};

const getPlugins = (extractCss = true) => [
    // This plugin must come first to externalize peer dependencies
    peerDepsExternal(),
    nodeResolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    commonjs(),
    typescript({
        tsconfig: './tsconfig.json',
        useTsconfigDeclarationDir: true,
        cacheRoot: './.rpt2_cache',
        clean: true,
        tsconfigOverride: {
            compilerOptions: {
                declaration: true,
                declarationDir: 'dist',
            },
            exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.stories.tsx', 'src/utils/testingUtils.tsx'],
        },
    }),
    extractCss && postcss({
        extract: 'styles/index.css',
        minimize: true,
        inject: false,
    }),
    babel({
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        presets: [
            ['@babel/preset-env', { modules: false }],
            ['@babel/preset-react', { runtime: 'automatic' }],
            '@babel/preset-typescript',
        ],
        babelHelpers: 'bundled',
    }),
    // Preserve 'use client' and 'use server' directives for React Server Components
    preserveDirectives(),
].filter(Boolean);

export default [
    // Main bundle
    {
        input: 'src/index.ts',
        // NOTE: inlineDynamicImports=true ensures each entry builds as a single-file bundle
        // even when we use dynamic imports for R3F/AR effects. This avoids multi-chunk
        // library imports that can break consumers' bundlers (Next.js, Vite, Webpack)
        // while still allowing internal code-splitting at the app level.
        output: [
            {
                file: 'dist/index.js',
                format: 'cjs',
                sourcemap: true,
                exports: 'named',
                inlineDynamicImports: true,
            },
            {
                file: 'dist/index.mjs',
                format: 'esm',
                sourcemap: true,
                inlineDynamicImports: true,
            },
        ],
        external: isExternal,
        plugins: getPlugins(true),
    },
    // Registry bundle (legacy compatibility exports)
    {
        input: 'src/registry/index.ts',
        output: [
            {
                file: 'dist/registry/index.js',
                format: 'cjs',
                sourcemap: true,
                exports: 'named',
                inlineDynamicImports: true,
            },
            {
                file: 'dist/registry/index.mjs',
                format: 'esm',
                sourcemap: true,
                inlineDynamicImports: true,
            },
        ],
        external: (id) => id === 'next/navigation' || isExternal(id), // Also externalize next/navigation
        plugins: getPlugins(false), // Don't extract CSS for registry bundle
    },
    // SSR bundle
    {
        input: 'src/ssr/index.ts',
        output: [
            {
                file: 'dist/ssr/index.js',
                format: 'cjs',
                sourcemap: true,
                exports: 'named',
                inlineDynamicImports: true,
            },
            {
                file: 'dist/ssr/index.mjs',
                format: 'esm',
                sourcemap: true,
                inlineDynamicImports: true,
            },
        ],
        external: isExternal,
        plugins: getPlugins(false), // Don't extract CSS again for SSR bundle
    },
    // Server-safe bundle (re-exports SSR utilities)
    {
        input: 'src/server/index.ts',
        output: [
            {
                file: 'dist/server/index.js',
                format: 'cjs',
                sourcemap: true,
                exports: 'named',
                inlineDynamicImports: true,
            },
            {
                file: 'dist/server/index.mjs',
                format: 'esm',
                sourcemap: true,
                inlineDynamicImports: true,
            },
        ],
        external: isExternal,
        plugins: getPlugins(false),
    },
    // Three / R3F bundle (3D effects only)
    {
        input: 'src/three/index.ts',
        output: [
            {
                file: 'dist/three/index.js',
                format: 'cjs',
                sourcemap: true,
                exports: 'named',
                inlineDynamicImports: true,
            },
            {
                file: 'dist/three/index.mjs',
                format: 'esm',
                sourcemap: true,
                inlineDynamicImports: true,
            },
        ],
        external: isExternal,
        plugins: getPlugins(false),
    },
];
