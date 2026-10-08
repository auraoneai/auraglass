import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* PLAT-291: Vite 7 + React 19.3, no Tailwind — the cascade proof runs against
   the assembled stylesheet with the bridge layer order statement. */
export default defineConfig({
  plugins: [react()],
});
