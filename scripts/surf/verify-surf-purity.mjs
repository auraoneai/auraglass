#!/usr/bin/env node
// scripts/surf/verify-surf-purity.mjs — the SURF purity gate (REQ-SURF-05,
// REQ-SURF-110/-112/-133; AC-SURF-03).
//
// AST gate (@babel/parser, typescript+jsx): every rule matches on syntax
// nodes — call sites, imports, member chains, JSX attributes — so comments,
// strings and look-alike identifiers never false-positive, and renamed
// bindings never false-negative the way regex did. Registered on CI as
// surf:test:* jobs and on QUAL's L1 lane through fragments/lanes/surf.ts.
//
// The rule table is sectioned per lane — edit only your own lane block.
//
// Usage:
//   node scripts/surf/verify-surf-purity.mjs [path ...]
// With no args it scans every SURF-owned source root that exists. With args it
// scans exactly the given files/dirs (used by tests/capability/purity-gate.test.ts
// against failing fixtures).

import { parse } from '@babel/parser';
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

// Network/env/provider-SDK rules apply to every SURF root, the shared
// component tree and labs — shipped code never egresses (REQ-SURF-05 (2)).
const NET_ENV_PATHS = [...SURF_ROOTS, 'src/components'];
// Global key listeners: app-shell + components, exempting only the
// CommandPalette hotkey listener (its own file).
const KEYDOWN_PATHS = ['src/app-shell', 'src/components'];
const KEYDOWN_EXEMPT = 'src/components/command-palette/CommandPalette';

/** A rule: { id, paths, match, message, excludeFile?, timerAllow? } */
function rule(id, paths, match, message, extra = {}) {
  return { id, paths: Array.isArray(paths) ? paths : [paths], match, message, ...extra };
}

// ---- AST matchers --------------------------------------------------------
const calleeName = (n) =>
  n?.type === 'CallExpression'
    ? n.callee.type === 'Identifier'
      ? n.callee.name
      : n.callee.type === 'MemberExpression' && n.callee.property.type === 'Identifier'
        ? n.callee.property.name
        : null
    : null;
const isIdent = (names) => (n) => n?.type === 'Identifier' && names.has(n.name);
const isNew = (names) => (n) =>
  n?.type === 'NewExpression' && n.callee.type === 'Identifier' && names.has(n.callee.name);
const callOf = (names) => (n) => calleeName(n) !== null && names.has(calleeName(n));
/** ['process','env','X'] style chain; 'import.meta' collapses to one part. */
function chain(m) {
  const parts = [];
  let cur = m;
  while (cur?.type === 'MemberExpression') {
    parts.unshift(cur.property.type === 'Identifier' ? cur.property.name : cur.property.value);
    cur = cur.object;
  }
  if (cur?.type === 'Identifier') parts.unshift(cur.name);
  if (cur?.type === 'MetaProperty') parts.unshift(`${cur.meta.name}.${cur.property.name}`);
  return parts;
}
const memberCall = (objName, prop, argRe) => (n) => {
  if (n?.type !== 'CallExpression') return false;
  const c = n.callee;
  if (c?.type !== 'MemberExpression') return false;
  const parts = chain(c);
  if (parts[0] !== objName || parts[parts.length - 1] !== prop) return false;
  const a0 = n.arguments?.[0];
  if (argRe && !(a0?.type === 'StringLiteral' && argRe.test(a0.value))) return false;
  return true;
};
const importFrom = (re) => (n) =>
  (n?.type === 'ImportDeclaration' && re.test(n.source.value)) ||
  (n?.type === 'CallExpression' && n.callee.name === 'require' && n.arguments[0]?.type === 'StringLiteral' && re.test(n.arguments[0].value));

// --- lane W1 begin ---
const w1 = [];
// --- lane W1 end ---

// --- lane W2 begin ---
const w2 = [];
// --- lane W2 end ---

// --- lane W3 begin ---
// SURF-534 (REQ-SURF-05/-110/-112): no network, no env reads, no provider SDKs
// anywhere in shipped SURF/components/labs code. Model calls are always the
// consumer's (e.g. Kiro Prism routed by the app), never the library's.
const SDK_RE = /^(?:openai|ai|@ai-sdk\/.+|@anthropic-ai\/.+|@google\/.+|@google-ai\/.+|@google-cloud\/.+|cohere-ai|replicate|@aws-sdk\/.+|@azure\/.+)$/;
const w3 = [
  rule('no-fetch', NET_ENV_PATHS, callOf(new Set(['fetch'])), 'network call in shipped code; model calls live in consumer code'),
  rule('no-xmlhttprequest', NET_ENV_PATHS, isIdent(new Set(['XMLHttpRequest'])), 'network call in shipped code'),
  rule('no-websocket', NET_ENV_PATHS, isIdent(new Set(['WebSocket'])), 'sockets in shipped code are simulated transport'),
  rule('no-eventsource', NET_ENV_PATHS, isIdent(new Set(['EventSource'])), 'streaming is consumer-driven; no EventSource in the library'),
  rule('no-sendbeacon', NET_ENV_PATHS, callOf(new Set(['sendBeacon'])), 'no network egress from library code'),
  rule(
    'no-process-env',
    NET_ENV_PATHS,
    (n) => {
      if (n?.type !== 'MemberExpression') return false;
      const parts = chain(n);
      if (parts[0] !== 'process' || parts[1] !== 'env' || parts.length < 3) return false;
      return parts[2] !== 'NODE_ENV';
    },
    'shipped code reads no env other than NODE_ENV'
  ),
  rule(
    'no-import-meta-env',
    NET_ENV_PATHS,
    (n) => n?.type === 'MemberExpression' && chain(n).slice(0, 2).join('.') === 'import.meta.env',
    'no bundler env in shipped code'
  ),
  rule('no-provider-sdk', NET_ENV_PATHS, importFrom(SDK_RE), 'provider SDK import; the library never talks to a model provider',
    { excludeFile: 'registry/items/ai-sdk-adapter' } /* the adapter item's purpose IS the @ai-sdk bridge — peer-installed by the consumer */),
  rule('no-dangerously-set', NET_ENV_PATHS, (n) => n?.type === 'JSXAttribute' && n.name.name === 'dangerouslySetInnerHTML', 'no raw HTML injection in shipped surfaces',
    { excludeFile: 'registry/items/rich-text' } /* the item's contract is rendering sanitized consumer HTML */),
  rule('no-scroll-into-view', NET_ENV_PATHS, callOf(new Set(['scrollIntoView'])), 'scroll anchoring goes through the Thread viewport API'),
];
// --- lane W3 end ---

// --- lane W4 begin ---
// SURF-538 (REQ-SURF-05/-133): media and backdrop modules hold no capture,
// sampling or DOM-probing machinery.
const PROBE = new Set(['elementsFromPoint', 'elementFromPoint', 'getComputedStyle']);
const w4 = [
  rule('media/no-audio-context', 'src/media', isIdent(new Set(['AudioContext', 'webkitAudioContext'])), 'no AudioContext in library media code'),
  rule('media/no-media-recorder', 'src/media', isIdent(new Set(['MediaRecorder'])), 'no capture APIs; MediaControls renders transport only'),
  rule(
    'media/no-src-assignment',
    'src/media',
    (n) => n?.type === 'AssignmentExpression' && n.left.type === 'MemberExpression' && n.left.property.type === 'Identifier' && n.left.property.name === 'src',
    'no .src assignment on media elements; src arrives by props'
  ),
  rule(
    'media/no-global-keydown',
    'src/media',
    (n) => memberCall('window', 'addEventListener', /^key(?:down|up|press)$/)(n) || memberCall('document', 'addEventListener', /^key(?:down|up|press)$/)(n),
    'global key listeners are owned by the Command layer, not media parts'
  ),
  rule(
    'media/no-dom-probe',
    ['src/media/sampling', 'src/backdrops'],
    (n) =>
      callOf(PROBE)(n) ||
      isIdent(new Set(['html2canvas']))(n) ||
      (n?.type === 'JSXIdentifier' && n.name === 'foreignObject'),
    'no DOM sampling/probing machinery (REQ-SURF-133)'
  ),
  rule('no-test-harness-import', SURF_ROOTS, importFrom(/(?:\.storybook|certification)\//), 'shipped code never imports storybook or certification harnesses'),
];
// --- lane W4 end ---

// --- lane W5 begin ---
// Global SURF bans (S-47): timers are simulated-behaviour machinery — allowed
// only in the four documented file:function pairs. Spatial APIs exist only
// inside src/three/**.
const TIMER_ALLOW = [
  'src/ai/error/ProviderErrorState.tsx:ProviderErrorState', // retry countdown
  'src/ai/message/StreamingText.tsx:StreamingText', // sentence flush
  'src/app-shell/StatusBar.Live.tsx:StatusBarLive', // live polling
  'src/components/command-palette/Command.tsx:CommandRoot', // announce debounce
];
const w5 = [
  {
    ...rule('no-fake-timer', SURF_ROOTS, callOf(new Set(['setTimeout', 'setInterval'])), 'timer outside the allowlist (ProviderErrorState retry countdown, StreamingText sentence flush, StatusBar.Live polling, Command announcement debounce)'),
    timerAllow: TIMER_ALLOW,
  },
  rule('no-spatial-core', SURF_ROOTS.filter((p) => p !== 'src/three'), (n) => importFrom(/^(?:three|@react-three\/.+)$/)(n) || (n?.type === 'MemberExpression' && chain(n).slice(0, 2).join('.') === 'navigator.xr'), 'three/@react-three imports and navigator.xr exist only inside src/three/**'),
  rule(
    'no-global-keydown',
    KEYDOWN_PATHS,
    (n) => memberCall('window', 'addEventListener', /^key(?:down|up|press)$/)(n) || memberCall('document', 'addEventListener', /^key(?:down|up|press)$/)(n),
    'global key listeners are owned by the Command layer',
    { excludeFile: KEYDOWN_EXEMPT }
  ),
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

const FUNCTION_NODES = new Set(['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression', 'ObjectMethod', 'ClassMethod']);
function fnName(node, parent) {
  if (node.id?.name) return node.id.name;
  if (parent?.type === 'VariableDeclarator' && parent.id.type === 'Identifier') return parent.id.name;
  if ((parent?.type === 'ObjectProperty' || parent?.type === 'Property') && parent.key.type === 'Identifier') return parent.key.name;
  return null;
}

function* visit(node, ancestors) {
  if (!node || typeof node.type !== 'string') return;
  yield { node, ancestors };
  ancestors.push(node);
  for (const [key, v] of Object.entries(node)) {
    if (key === 'loc' || key === 'start' || key === 'end' || key === 'leadingComments' || key === 'trailingComments' || key === 'innerComments' || key === 'extra') continue;
    if (Array.isArray(v)) {
      for (const c of v) if (c && typeof c === 'object') yield* visit(c, ancestors);
    } else if (v && typeof v === 'object' && v.type) {
      yield* visit(v, ancestors);
    }
  }
  ancestors.pop();
}

function enclosingFn(ancestors) {
  for (let i = ancestors.length - 1; i >= 0; i--) {
    const n = ancestors[i];
    if (FUNCTION_NODES.has(n.type)) return fnName(n, ancestors[i - 1]) ?? '(anonymous)';
  }
  return '(top)';
}

function scanFile(absPath) {
  const rel = relative(ROOT, absPath).split(sep).join('/');
  const eff = effectiveRel(rel);
  const findings = [];
  if (!SRC_EXTS.has(rel.slice(rel.lastIndexOf('.')))) return findings;
  // shipped-code gate: tests, stories and meta files are not shipped.
  if (/__tests__|\.test\.|\.stories\.|\.meta\.ts$/.test(rel)) return findings;
  const text = readFileSync(absPath, 'utf8');
  let ast;
  try {
    ast = parse(text, {
      sourceType: 'unambiguous',
      allowImportExportEverywhere: true,
      plugins: ['typescript', 'jsx'],
      errorRecovery: true,
    });
  } catch {
    findings.push(`${rel}:0: parse-error could not parse for purity scan`);
    return findings;
  }
  const inScope = RULES.filter((r) => r.paths.some((p) => eff === p || eff.startsWith(p + '/') || eff.startsWith(p)));
  for (const { node, ancestors } of visit(ast.program, [])) {
    for (const r of inScope) {
      if (r.excludeFile && eff.startsWith(r.excludeFile)) continue;
      if (r.timerAllow && r.timerAllow.some((pair) => {
        const [f, fn] = pair.split(':');
        if (eff !== f) return false;
        if (fn === '*') return true;
        // any named enclosing function may own the timer — innermost
        // callbacks are typically anonymous effect/timeout closures.
        return ancestors.some((a, i) => FUNCTION_NODES.has(a.type) && fnName(a, ancestors[i - 1]) === fn);
      })) continue;
      if (r.match(node)) {
        const line = node.loc?.start.line ?? 0;
        findings.push(`${rel}:${line}: ${r.id} ${r.message}`);
      }
    }
  }
  return findings;
}

const args = process.argv.slice(2);
const targets = args.length ? args.map((t) => join(ROOT, t)) : SURF_ROOTS.map((p) => join(ROOT, p)).filter(existsSync);
const all = [];
let scanned = 0;
for (const abs of targets) {
  if (!existsSync(abs)) continue;
  for (const f of walk(abs)) {
    scanned++;
    all.push(...scanFile(f));
  }
}
if (all.length) {
  console.log(`surf purity gate: ${all.length} finding(s) across ${scanned} file(s)`);
  for (const f of all) console.log('  ' + f);
  process.exit(1);
}
console.log(`surf purity gate: clean (${targets.length} root(s), ${scanned} file(s) scanned)`);
