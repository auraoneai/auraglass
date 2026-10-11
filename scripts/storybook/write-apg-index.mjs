#!/usr/bin/env node
// QUAL (S-51; REQ-QUAL-51, -50; REQ-FIN-106; FIN-450): the APG index the generated docs pages read.
//
//   node scripts/storybook/write-apg-index.mjs [--out storybook-static/apg-index.json] [--sha <sha>]
//
// Reads every `tests/a11y/apg/**/*.apg.spec.ts` statically (never imports or runs a spec) and writes
//   { version: 1, sha, entries: [{ storyId, owner, spec, test, script }], references: [{ storyId, owner, spec }] }
// `entries`: one row per `apg.keyboard(page, [...])` call, bound to the story the test navigated to last
// (`gotoStory(page, '<id>')`, ignoring `.catch` fallbacks); `script` is the literal ApgStep[] or null when computed.
// `references`: every story id literal a spec mentions (used by the story-contract Keyboard check).
// The docs page fetches the file from the Storybook root, so MDX never imports a spec.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { ROOT, walk, staticValue, ownerOf } from './lib/story-static.mjs';

export const APG_DIR = 'tests/a11y/apg';
const STORY_ID_RE = /^[a-z0-9][a-z0-9-]*--[a-z0-9][a-z0-9-]*$/;
const STEP_KEYS = new Set(['press', 'type', 'expectFocus', 'expectState', 'expectAnnounced']);

const isStep = (s) => s && typeof s === 'object' && !Array.isArray(s) && Object.keys(s).length > 0
  && Object.entries(s).every(([k, v]) => STEP_KEYS.has(k) && (k === 'expectState'
    ? v && typeof v === 'object' && Object.values(v).every((x) => typeof x === 'string')
    : typeof v === 'string'));

/** Owner of a spec: the stream directory under tests/a11y/apg/<stream>/, else contracts/ownership.json. */
export function specOwner(spec, root = ROOT) {
  const m = /^tests\/a11y\/apg\/(cmp|surf|mat|plat|qual)\//.exec(spec);
  return m ? m[1].toUpperCase() : ownerOf(spec, root);
}

const calleeName = (e) => (ts.isIdentifier(e) ? e.text : ts.isPropertyAccessExpression(e) ? `${calleeName(e.expression)}.${e.name.text}` : '');

/** Parse one spec's source. */
export function parseApgSpec(spec, source, root = ROOT) {
  const sf = ts.createSourceFile(spec, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const owner = specOwner(spec, root);
  const entries = [];
  const refs = new Set();
  const inCatchFallback = (n) => {
    for (let p = n.parent; p; p = p.parent) {
      if (ts.isCallExpression(p) && ts.isPropertyAccessExpression(p.expression) && p.expression.name.text === 'catch') return true;
      if (ts.isBlock(p) && ts.isFunctionLike(p.parent) && ts.isCallExpression(p.parent.parent) && /^test(\.\w+)?$/.test(calleeName(p.parent.parent.expression))) return false;
    }
    return false;
  };
  const visitTest = (body, testName) => {
    let current = null;
    const visit = (n) => {
      if (ts.isCallExpression(n)) {
        const name = calleeName(n.expression);
        if (/(^|\.)gotoStory$/.test(name) && n.arguments[1] && ts.isStringLiteralLike(n.arguments[1]) && !inCatchFallback(n)) current = n.arguments[1].text;
        if (/(^|\.)keyboard$/.test(name) && /^(apg|harness)\./.test(name) && n.arguments[1]) {
          const v = staticValue(n.arguments[1]);
          const script = Array.isArray(v) && v.length > 0 && v.every(isStep) ? v : null;
          if (current) entries.push({ storyId: current, owner, spec, test: testName, script });
        }
      }
      ts.forEachChild(n, visit);
    };
    visit(body);
  };
  const visitTop = (n) => {
    if (ts.isStringLiteralLike(n) && STORY_ID_RE.test(n.text)) refs.add(n.text);
    if (ts.isCallExpression(n) && /^test(\.only|\.skip|\.fixme)?$/.test(calleeName(n.expression)) && n.arguments[0] && ts.isStringLiteralLike(n.arguments[0])) {
      const fn = n.arguments.find((a) => ts.isArrowFunction(a) || ts.isFunctionExpression(a));
      if (fn) visitTest(fn.body, n.arguments[0].text);
    }
    ts.forEachChild(n, visitTop);
  };
  visitTop(sf);
  return { entries, references: [...refs].sort().map((storyId) => ({ storyId, owner, spec })) };
}

export function buildApgIndex(root = ROOT, { sha = null } = {}) {
  const specs = walk(root, APG_DIR).filter((f) => f.endsWith('.apg.spec.ts')).sort();
  const entries = [];
  const references = [];
  for (const spec of specs) {
    const r = parseApgSpec(spec, readFileSync(join(root, spec), 'utf8'), root);
    entries.push(...r.entries);
    references.push(...r.references);
  }
  return { version: 1, sha, entries, references };
}

function main(argv) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : undefined; };
  const out = arg('--out') ?? 'storybook-static/apg-index.json';
  const idx = buildApgIndex(ROOT, { sha: arg('--sha') ?? process.env.CI_COMMIT_SHA ?? null });
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify(idx, null, 2)}\n`);
  console.log(`write-apg-index: ${idx.entries.length} keyboard scripts (${idx.entries.filter((e) => e.script).length} literal), ${idx.references.length} story references -> ${out}`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) process.exit(main(process.argv.slice(2)));
