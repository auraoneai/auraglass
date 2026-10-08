import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* PLAT-293: vite + babel-plugin-react-compiler@1.0.0 in 'infer' mode — the
   flagship imports must compile clean (asserted by scripts/ci/verify-compiler.mjs
   and the canary smoke run). */
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', { compilationMode: 'infer', panicThreshold: 'none' }]],
      },
    }),
  ],
});
