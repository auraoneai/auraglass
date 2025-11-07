import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2';

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
        'react',
        'react-dom',
        'react/jsx-runtime',
        'framer-motion',
        '@radix-ui/react-slot',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-label',
        '@radix-ui/react-select',
        'three',
        '@react-three/fiber',
        '@react-three/drei',
        'lucide-react',
        'clsx',
        'tailwind-merge',
    ],
    plugins: [
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
