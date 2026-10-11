#!/usr/bin/env node
// certification/gates/lint.mjs — L1 built-in (REQ-QUAL-27): runs the repository lint (`npm run lint`) and exits with its status.
import { spawnSync } from 'node:child_process';

const r = spawnSync('npm', ['run', '--silent', 'lint'], { stdio: 'inherit' });
process.exit(r.status ?? 1);
