#!/usr/bin/env node
// scripts/surf/verify-dist-ai.mjs — the L2 dist-ai purity check (REQ-SURF-05
// (4)). Post-build rg-style scan: the shipped dist/ai bundle must contain no
// network egress, env reads, provider SDKs, or raw-HTML injection — this is
// the emitted-code counterpart of the src AST gate so bundler-injected or
// dependency-inlined violations also fail.
//
// Usage: node scripts/surf/verify-dist-ai.mjs   (requires dist/ai; run post-build)

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const DIST_AI = join(ROOT, 'dist', 'ai');

const RULES = [
  ['no-fetch', /\bfetch\s*\(/],
  ['no-xmlhttprequest', /\bXMLHttpRequest\b/],
  ['no-websocket', /\bWebSocket\b/],
  ['no-eventsource', /\bEventSource\b/],
  ['no-sendbeacon', /\bsendBeacon\s*\(/],
  ['no-process-env', /\bprocess\.env\.(?!NODE_ENV\b)/],
  ['no-import-meta-env', /\bimport\.meta\.env\b/],
  ['no-provider-sdk', /(?:from|import\s*\()\s*['"](?:openai|ai|@ai-sdk\/[^'"]+|@anthropic-ai\/[^'"]+|@google(?:-ai|-cloud)?\/[^'"]+|cohere-ai|replicate|@aws-sdk\/[^'"]+|@azure\/[^'"]+)['"]/],
  ['no-dangerously-set', /\bdangerouslySetInnerHTML\b/],
];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(js|mjs|cjs)$/.test(name)) yield p;
  }
}

if (!existsSync(DIST_AI)) {
  console.error('verify-dist-ai: dist/ai missing — run npm run build first');
  process.exit(1);
}

const findings = [];
let scanned = 0;
for (const f of walk(DIST_AI)) {
  scanned++;
  const rel = relative(ROOT, f).split(sep).join('/');
  const text = readFileSync(f, 'utf8');
  text.split('\n').forEach((line, i) => {
    for (const [id, re] of RULES) {
      if (re.test(line)) findings.push(`${rel}:${i + 1}: ${id}`);
    }
  });
}

if (findings.length) {
  console.log(`dist/ai purity: ${findings.length} finding(s) across ${scanned} file(s)`);
  for (const f of findings) console.log('  ' + f);
  process.exit(1);
}
console.log(`dist/ai purity: clean (${scanned} file(s) scanned)`);
