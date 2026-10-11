import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/* PLAT-293: vite + babel-plugin-react-compiler@1.0.0 in 'infer' mode — the
   flagship imports must compile clean (asserted by scripts/ci/verify-compiler.mjs
   and tests/smoke.spec.ts). Every compiler logger event is collected and
   written to dist/compiler-events.json after the bundle closes; the smoke
   spec asserts the canary's own sources were compiled with 0 non-success
   events. */
type CompilerEvent = { filename: string | null; kind: string | undefined; reason?: string };
const events: CompilerEvent[] = [];
const logger = {
  logEvent(filename: string | null, event: { kind?: string; detail?: { reason?: string } }) {
    events.push({ filename, kind: event?.kind, reason: event?.detail?.reason });
  },
};

const writeEvents = (): Plugin => ({
  name: 'ag-compiler-events',
  apply: 'build',
  closeBundle() {
    writeFileSync(fileURLToPath(new URL('./dist/compiler-events.json', import.meta.url)), JSON.stringify(events, null, 2));
  },
});

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', { compilationMode: 'infer', panicThreshold: 'none', logger }]],
      },
    }),
    writeEvents(),
  ],
});
