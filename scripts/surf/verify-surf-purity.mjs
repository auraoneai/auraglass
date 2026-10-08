#!/usr/bin/env node
// scripts/surf/verify-surf-purity.mjs — the SURF purity gate (REQ-SURF-05,
// REQ-SURF-110/-112/-133; AC-SURF-03).
//
// Zero-dep Node >=20 ESM script. Scans SURF-owned source files line by line
// and fails with `<path>:<line>: <rule-id> <message>` for every banned
// pattern. Registered on CI as surf:test:* jobs and on QUAL's L1 lane through
// fragments/lanes/surf.ts.
//
// The rule table is sectioned per lane — edit only your own lane block.
//
// Usage:
//   node scripts/surf/verify-surf-purity.mjs [path ...]
// With no args it scans every SURF-owned source root that exists. With args it
// scans exactly the given files/dirs (used by tests/capability/purity-gate.test.ts
// against failing fixtures).

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const SRC_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.mts', '.cts']);

const SURF_ROOTS = [
  'src/app-shell',
  'src/data',
  'src/date',
  'src/ai',
  'src/media',
  'src/backdrops',
  'src/charts',
  'src/three',
  'registry/blocks',
  'registry/items',
  'packages/labs/src',
];

/** A rule: { id, paths, pattern, message, exclude?, pathAllowlist? } */
function rule(id, paths, pattern, message, extra = {}) {
  return { id, paths: Array.isArray(paths) ? paths : [paths], pattern, message, ...extra };
}

// --- lane W1 begin ---
const w1 = [];
// --- lane W1 end ---

// --- lane W2 begin ---
const w2 = [];
// --- lane W2 end ---

// --- lane W3 begin ---
// SURF-534 (REQ-SURF-05/-110/-112): no network, no env reads, no provider SDKs
// in src/ai/**. Model calls are always the consumer's (e.g. Kiro Prism routed
// by the app), never the library's.
const w3 = [
  rule('ai/no-fetch', 'src/ai', /\bfetch\s*\(/, 'network call in shipped ai module; model calls live in consumer code'),
  rule('ai/no-xmlhttprequest', 'src/ai', /\bXMLHttpRequest\b/, 'network call in shipped ai module'),
  rule('ai/no-websocket', 'src/ai', /\bWebSocket\b/, 'sockets in shipped ai module are simulated transport'),
  rule('ai/no-eventsource', 'src/ai', /\bEventSource\b/, 'streaming is consumer-driven; no EventSource in the library'),
  rule('ai/no-sendbeacon', 'src/ai', /\bsendBeacon\s*\(/, 'no network egress from library code'),
  rule('ai/no-process-env', 'src/ai', /\bprocess\.env\.(?!NODE_ENV\b)[A-Za-z_]+|process\.env\[\s*['"](?!NODE_ENV['"])/, 'shipped code reads no env other than NODE_ENV'),
  rule('ai/no-import-meta-env', 'src/ai', /\bimport\.meta\.env\b/, 'no bundler env in shipped code'),
  rule(
    'ai/no-provider-sdk',
    'src/ai',
    /from\s+['"](?:openai|ai|@ai-sdk\/[^'"]+|@anthropic-ai\/[^'"]+|@google\/[^'"]+|@google-ai\/[^'"]+|@google-cloud\/[^'"]+|cohere-ai|replicate|@aws-sdk\/[^'"]+|@azure\/[^'"]+)['"]|require\(\s*['"](?:openai|ai|@ai-sdk\/[^'"]+|@anthropic-ai\/[^'"]+)/,
    'provider SDK import; the library never talks to a model provider'
  ),
  rule('ai/no-dangerously-set', 'src/ai', /\bdangerouslySetInnerHTML\b/, 'no raw HTML injection in ai surfaces'),
  rule('ai/no-scroll-into-view', 'src/ai', /\bscrollIntoView\s*\(/, 'scroll anchoring goes through the Thread viewport API'),
];
// --- lane W3 end ---

// --- lane W4 begin ---
// SURF-538 (REQ-SURF-05/-133): media and backdrop modules hold no capture,
// sampling or DOM-probing machinery.
const w4 = [
  rule('media/no-audio-context', 'src/media', /\bAudioContext\b|\bwebkitAudioContext\b/, 'no AudioContext in library media code'),
  rule('media/no-media-recorder', 'src/media', /\bMediaRecorder\b/, 'no capture APIs; MediaControls renders transport only'),
  rule('media/no-src-assignment', 'src/media', /\.src\s*=(?!=)/, 'no .src assignment on media elements; src arrives by props'),
  rule('media/no-global-keydown', 'src/media', /\b(?:window|document)\.addEventListener\(\s*['"]key(?:down|up|press)/, 'global key listeners are owned by the Command layer, not media parts'),
  rule('media/no-dom-probe', ['src/media/sampling', 'src/backdrops'], /\b(?:elementsFromPoint|elementFromPoint|getComputedStyle)\s*\(|\bhtml2canvas\b|<foreignObject\b|\bforeignObject\b/, 'no DOM sampling/probing machinery (REQ-SURF-133)'),
  rule('no-test-harness-import', SURF_ROOTS, /from\s+['"][^'"]*(?:\.storybook|certification)\//, 'shipped code never imports storybook or certification harnesses'),
];
// --- lane W4 end ---

// --- lane W5 begin ---
// Global SURF bans (S-47): timers are simulated-behaviour machinery — allowed
// only in the four documented cases (ProviderErrorState retry countdown,
// StreamingText sentence flush, StatusBar.Live polling, Command announcement
// debounce). Spatial APIs exist only inside src/three/**.
const TIMER_ALLOW = ['ProviderErrorState', 'StreamingText', 'StatusBar', 'Command'];
const w5 = [
  {
    ...rule('no-fake-timer', SURF_ROOTS, /\b(?:setTimeout|setInterval)\s*\(/, 'timer outside the allowlist (ProviderErrorState retry countdown, StreamingText sentence flush, StatusBar.Live, Command announcement debounce)'),
    pathAllowlist: TIMER_ALLOW,
  },
  rule('no-spatial-core', SURF_ROOTS.filter((p) => p !== 'src/three'), /from\s+['"](?:three|@react-three\/[^'"]+)['"]|\bnavigator\.xr\b/, 'three/@react-three imports and navigator.xr exist only inside src/three/**'),
];
// --- lane W5 end ---

const RULES = [...w1, ...w2, ...w3, ...w4, ...w5];

// Fixtures under tests/capability/fixtures/purity/<area>/ scan as if they were
// src/<area>/ files so each lane's rule scope applies to them.
const FIXTURE_PURITY = 'tests/capability/fixtures/purity/';
function effectiveRel(rel) {
  if (!rel.startsWith(FIXTURE_PURITY)) return rel;
  const rest = rel.slice(FIXTURE_PURITY.length);
  return 'src/' + rest;
}

function* walk(target) {
  const st = statSync(target);
  if (st.isFile()) {
    yield target;
    return;
  }
  for (const name of readdirSync(target)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(target, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

function scanFile(absPath) {
  const rel = relative(ROOT, absPath).split(sep).join('/');
  const eff = effectiveRel(rel);
  const findings = [];
  if (!SRC_EXTS.has(rel.slice(rel.lastIndexOf('.')))) return findings;
  const text = readFileSync(absPath, 'utf8');
  const lines = text.split('\n');
  for (const r of RULES) {
    const inScope = r.paths.some((p) => eff === p || eff.startsWith(p + '/') || eff.startsWith(p));
    if (!inScope) continue;
    if (r.pathAllowlist && r.pathAllowlist.some((token) => eff.includes(token))) continue;
    lines.forEach((line, i) => {
      const stripped = line.replace(/\/\/.*$/, '');
      if (r.pattern.test(stripped)) {
        findings.push(`${rel}:${i + 1}: ${r.id} ${r.message}`);
      }
    });
  }
  return findings;
}

const args = process.argv.slice(2);
const targets = args.length ? args : SURF_ROOTS.map((p) => join(ROOT, p)).filter(existsSync);
const all = [];
for (const t of targets) {
  const abs = join(ROOT, t);
  if (!existsSync(abs)) continue;
  for (const f of walk(abs)) all.push(...scanFile(f));
}
if (all.length) {
  console.log(`surf purity gate: ${all.length} finding(s)`);
  for (const f of all) console.log('  ' + f);
  process.exit(1);
}
console.log(`surf purity gate: clean (${targets.length} root(s) scanned)`);
