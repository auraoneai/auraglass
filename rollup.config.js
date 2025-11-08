import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.js',
            format: 'cjs',
            sourcemap: true,
            exports: 'named',
        },
        {
            file: 'dist/index.mjs',
            format: 'esm',
            sourcemap: true,
        },
    ],
    external: [
        // React and React DOM (peer dependencies)
        'react',
        'react-dom',
        'react/jsx-runtime',

        // Three.js ecosystem (peer dependencies - MUST be external)
        'three',
        '@react-three/fiber',
        '@react-three/drei',

        // Framer Motion (peer dependency)
        'framer-motion',

        // Radix UI components
        '@radix-ui/react-slot',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-label',
        '@radix-ui/react-select',

        // UI utilities
        'lucide-react',
        'clsx',
        'tailwind-merge',

        // Chart.js ecosystem
        'chart.js',
        'react-chartjs-2',

        // Third-party libraries that shouldn't be bundled
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
        'styled-components',
    ],
    plugins: [
        // This plugin must come first to externalize peer dependencies
        peerDepsExternal(),
        nodeResolve({
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        }),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json',
            useTsconfigDeclarationDir: true,
            tsconfigOverride: {
                compilerOptions: {
                    declaration: true,
                    declarationDir: 'dist',
                },
                exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.stories.tsx', 'src/utils/testingUtils.tsx'],
            },
        }),
        postcss({
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
    ],
};
