#!/usr/bin/env node
/* plat:integration:vite on the 5x line (§4.13.4). Seed entry point — the 1a lane lands
   the real Vite consumer integration. Until the canary exists, reports pending
   (absent inputs are pending, never a failure) and exits 0. */
import { existsSync } from 'node:fs';

if (!existsSync('canaries/vite/package.json')) {
  console.log('plat:integration:vite pending (canaries/vite not merged yet)');
  process.exit(0);
}
const { execSync } = await import('node:child_process');
execSync('npm --prefix canaries/vite ci && npm --prefix canaries/vite run build', { stdio: 'inherit' });
console.log('plat:integration:vite OK');
