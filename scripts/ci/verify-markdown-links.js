#!/usr/bin/env node
/* scripts/ci/verify-markdown-links.js — REQ-PLAT-102, PLAT-383. The path the
   platform PRD names for the link gate. The previous CommonJS body could not
   run (package.json "type": "module" → `require is not defined`); the
   route-aware, case-sensitive checker now lives in
   scripts/docs/verify-markdown-links.js and this entry point runs it with the
   same arguments (--out <dir>, --json <file>). */
import { main } from '../docs/verify-markdown-links.js';

process.exit(main(process.argv.slice(2)));
