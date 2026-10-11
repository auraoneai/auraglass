#!/usr/bin/env node
/* Generates src/ai/__fixtures__/thread-2000.json — a seeded, deterministic
 * 2,000-message thread (REQ-SURF-109/SURF-342). `--check` verifies the fixture
 * matches generated output (CI job surf:build:ai-fixtures). REQ-SURF-109: the
 * SURF-owned home of this script (was scripts/build/gen-ai-thread-fixture.mjs). */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const out = join(root, 'src/ai/__fixtures__/thread-2000.json');

// Seeded PRNG (mulberry32) — the only randomness, lives in this script only.
let seed = 0x5eed;
const rand = () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const TOPICS = ['key rotation', 'quota raise', 'billing export', 'sso mapping', 'incident review', 'rate limits', 'sandbox refresh', 'audit export'];
const messages = [];
for (let i = 0; i < 2000; i++) {
  const role = i % 2 === 0 ? 'user' : 'assistant';
  const topic = TOPICS[Math.floor(rand() * TOPICS.length)];
  const words = 8 + Math.floor(rand() * 40);
  const text = Array.from({ length: words }, () => `${topic}-${Math.floor(rand() * 1000)}`).join(' ');
  const parts = [{ type: 'text', text }];
  if (role === 'assistant' && rand() < 0.1) {
    parts.unshift({ type: 'reasoning', text: `reasoning about ${topic}`, state: 'done' });
  }
  messages.push({
    id: `t-${String(i).padStart(4, '0')}`,
    role,
    parts,
    metadata: { createdAt: `2026-05-01T00:00:${String(i % 60).padStart(2, '0')}Z`, status: 'complete' },
  });
}

const text = JSON.stringify({ schema: 'thread-fixture/v1', seed: '0x5eed', messages }, null, 1) + '\n';
if (process.argv.includes('--check')) {
  if (readFileSync(out, 'utf8') !== text) { console.error('thread-2000.json is stale — rerun scripts/surf/gen-ai-thread-fixture.mjs'); process.exit(1); }
  console.log('gen-ai-thread-fixture: OK (2000 messages)');
} else {
  writeFileSync(out, text);
  console.log(`wrote ${out} (2000 messages)`);
}
