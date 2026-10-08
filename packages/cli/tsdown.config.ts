import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/bin.ts', 'src/index.ts'],
  outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
  copy: [{ from: 'src/migrate/4to5/mappings', to: 'dist' }],
  format: ['esm'],
  dts: true,
  sourcemap: false,
  clean: true,
  outDir: 'dist',
});
