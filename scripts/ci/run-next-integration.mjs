#!/usr/bin/env node
/* plat:integration:next on the 5x line (§4.13.4). Seed entry point — the 1a lane lands
   the real Next.js consumer integration. Until the canary exists, reports pending
   (absent inputs are pending, never a failure) and exits 0. */
import { existsSync } from 'node:fs';

if (!existsSync('canaries/next16/package.json')) {
  console.log('plat:integration:next pending (canaries/next16 not merged yet)');
  process.exit(0);
}
const { execSync } = await import('node:child_process');
execSync('npm --prefix canaries/next16 ci && npm --prefix canaries/next16 run build', { stdio: 'inherit' });
console.log('plat:integration:next OK');
