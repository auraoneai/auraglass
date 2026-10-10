#!/usr/bin/env node
// scripts/surf/verify-canary-rsc.mjs — the L11 RSC-leak gate (REQ-SURF-07).
// Runs `next build` inside canaries/next16 (when needed) and asserts the
// client reference manifests contain NONE of the REQ-SURF-07 server modules —
// a server module that lands in a client manifest means a client boundary
// imported it and its markup stopped being server-rendered.
//
// Usage: node scripts/surf/verify-canary-rsc.mjs [--no-build]

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const CANARY = join(ROOT, 'canaries', 'next16');
const BUILD_DIR = join(CANARY, '.next');

// REQ-SURF-07 server modules — path fragments as they appear inside a client
// reference manifest (webpack module ids / file paths).
const SERVER_MODULE_FRAGMENTS = [
  'app-shell/AppShell', 'app-shell/Sidebar', 'app-shell/TopBar',
  'app-shell/StatusBar', 'app-shell/MobileShell', 'app-shell/Inspector',
  'breadcrumbs/Breadcrumbs', 'pagination/Pagination',
  'data/stat-card/StatCard', 'data/sparkline/Sparkline',
  'data/chart-frame/ChartFrame.', // .tsx — not .Interactive (client island)
  'timeline/Timeline', 'activity-feed/ActivityFeed',
  'ai/message/Message', 'ai/message/MessageParts', 'ai/AgentSteps',
  'ai/UsageMeter', 'backdrops/Backdrop',
  'media/formatMediaTime', 'media/classifyTone',
];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

if (!existsSync(BUILD_DIR) && !process.argv.includes('--no-build')) {
  console.log('verify-canary-rsc: building canaries/next16 …');
  execFileSync('npm', ['run', 'build', '--', '--webpack'], {
    cwd: CANARY,
    stdio: 'inherit',
    env: { ...process.env, CI: '1' },
  });
}

if (!existsSync(BUILD_DIR)) {
  console.error('verify-canary-rsc: canaries/next16/.next missing — build the canary first (or on the L11 lane).');
  process.exit(1);
}

const manifests = [...walk(BUILD_DIR)].filter((f) => /client-reference-manifest/.test(f));
if (!manifests.length) {
  console.error('verify-canary-rsc: no client-reference-manifest files under .next — unexpected layout.');
  process.exit(1);
}

const findings = [];
for (const f of manifests) {
  const text = readFileSync(f, 'utf8');
  for (const frag of SERVER_MODULE_FRAGMENTS) {
    if (text.includes(frag)) findings.push(`${f.split(BUILD_DIR).pop()}: leaked server module ${frag}`);
  }
}

if (findings.length) {
  console.log(`verify-canary-rsc: ${findings.length} leaked server module(s)`);
  for (const f of findings) console.log('  ' + f);
  process.exit(1);
}
console.log(`verify-canary-rsc: clean (${manifests.length} manifest(s), 0 server modules)`);
