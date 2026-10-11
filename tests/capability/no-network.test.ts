// tests/capability/no-network.test.ts — REQ-SURF-05 (stream-wide purity).
// Shipped code opens no network and reads no env other than NODE_ENV.
import { describe, expect, it } from '@jest/globals';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '../..');
const ROOTS = ['src', 'packages/labs/src', 'registry/blocks', 'registry/items'];
const NET = /\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b|\bEventSource\b|\bsendBeacon\s*\(/;
const SERVER_ROUTE = join(ROOT, 'registry/blocks/ai-workspace/app/api/chat/route.ts');
const ENV = /\bprocess\.env\.(?!NODE_ENV\b)[A-Za-z_]+|process\.env\[\s*['"](?!NODE_ENV['"])|\bimport\.meta\.env\b/;

function* walk(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(ts|tsx|mts|cts|js|jsx)$/.test(name)) yield p;
  }
}

describe('no network or env access in shipped code', () => {
  it('no fetch/XHR/WebSocket/EventSource/sendBeacon in shipped surfaces', () => {
    const hits: string[] = [];
    for (const base of ROOTS) {
      for (const f of walk(join(ROOT, base)) ?? []) {
        if (/ai-workspace|\.test\.|\.spec\.|fixtures|__tests__/.test(f)) continue;
        readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
          const stripped = line.replace(/\/\/.*$/, '');
          if (NET.test(stripped)) hits.push(`${f}:${i + 1}`);
        });
      }
    }
    expect(hits).toEqual([]);
  });
  it('no env reads other than NODE_ENV', () => {
    const hits: string[] = [];
    for (const base of ROOTS) {
      for (const f of walk(join(ROOT, base)) ?? []) {
        if (/\.test\.|\.spec\.|fixtures|__tests__/.test(f)) continue;
        // The consumer-owned server route is checked separately below.
        if (f === SERVER_ROUTE) continue;
        readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
          if (ENV.test(line)) hits.push(`${f}:${i + 1}`);
        });
      }
    }
    expect(hits).toEqual([]);
  });
  it('the ai-workspace server route reads only its PRISM_* config and the trusted-proxy flag', () => {
    // REQ-SURF-172: the Next.js route runs in the consumer's server, never in
    // the browser bundle; it may read exactly these variables and nothing else.
    const ALLOWED = new Set(['PRISM_API_KEY', 'PRISM_BASE_URL', 'PRISM_MODEL', 'AI_WORKSPACE_TRUST_PROXY']);
    const src = readFileSync(SERVER_ROUTE, 'utf8');
    const read = [...src.matchAll(/\bprocess\.env\.([A-Za-z_]+)/g)].map((m) => m[1]!);
    expect(read.length).toBeGreaterThan(0);
    expect(read.filter((v) => !ALLOWED.has(v))).toEqual([]);
    expect(src).not.toMatch(/process\.env\[|import\.meta\.env|NEXT_PUBLIC_/);
  });
});
