import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/* PLAT-292: vite + Tailwind v4 — the consumer imports aura-glass/tailwind.css
   (the bridge) instead of styles.css; the cascade proof asserts the bridge's
   '@layer theme, base, ag, components, utilities;' ordering holds. */
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
