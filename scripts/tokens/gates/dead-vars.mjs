#!/usr/bin/env node
// MAT-051 gate dead-vars (REQ-MAT-17, REQ-FIN-53).
// Public: every manifest var needs >= 1 var() reader in the dist token css or the
// hand-written library src TS/CSS (generated, tests and stories excluded), or
// carries public: true (ag.public — the public surface is contract-stable).
// Private: every --_ag-* declared in src css (generated files included — no
// exemption for compiler-emitted recipe privates), in css text inside src TS/TSX,
// or in the dist token css needs >= 1 live var() reader outside its defining
// declaration:
//   - a self-reference (`--_ag-x: var(--_ag-x, fb)`) is not a reader;
//   - a read inside another private's declaration counts only while that
//     private is itself live (least fixpoint, so a chain or cycle of privates
//     that nothing outside reads is dead as a whole);
//   - `initial` reservations (the MAT-003 privates registry in dist/css/tokens.css)
//     neither define nor read anything;
//   - @property registration is not a reader (no channel exemption).
// Each dead var is attributed to the stream(s) owning its defining file(s)
// (contracts/ownership.json). Non-MAT findings print `pre-existing (<stream>)`;
// the gate exits 1 only on MAT findings.
// With --write-consumers, rewrites dist/tokens/manifest.json consumer counts.
// Fixture overrides (MAT-053): --root <dir>, --dist <dir> (every css file under
// it), --src <dir>, --manifest <path>.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { ROOT, walkFiles, scanCss, streamOf, reportByStream } from './_util.mjs';

const update = process.argv.includes('--write-consumers');
const arg = (n) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : undefined; };
// --root <dir>: a repo-like fixture root (src/, dist/); its paths are attributed as
// if they sat at the repo root.
const BASE = arg('--root') ? resolve(ROOT, arg('--root')) : ROOT;
const rel = (p) => relative(BASE, p).replace(/\\/g, '/');
const manifestPath = arg('--manifest') ? resolve(ROOT, arg('--manifest')) : join(BASE, 'dist/tokens/manifest.json');
const distArg = arg('--dist');
const srcDir = arg('--src') ? resolve(ROOT, arg('--src')) : join(BASE, 'src');
if (!existsSync(manifestPath)) {
  console.error('dead-vars: dist/tokens/manifest.json missing — run npm run tokens:build first');
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

const DIST_TOKEN_CSS = ['dist/tokens.css', 'dist/tailwind.css', 'dist/css/tokens.css', 'dist/css/tailwind.css', 'dist/compat/tokens.css'];
const distFiles = distArg
  ? walkFiles(resolve(ROOT, distArg), ['.css'])
  : DIST_TOKEN_CSS.map((p) => join(BASE, p)).filter((p) => existsSync(p));
const srcFiles = walkFiles(srcDir, ['.ts', '.tsx', '.css']).filter((f) => !rel(f).includes('__tests__'));
const isGenerated = (r) => r.includes('/generated/') || r.endsWith('.generated.ts');

// ---- scan --------------------------------------------------------------------
const privDefs = new Map(); // name -> Set<rel file>
const privUses = []; // {name, via}
const publicCorpus = []; // texts that count as public readers
const addDef = (name, r) => { if (!privDefs.has(name)) privDefs.set(name, new Set()); privDefs.get(name).add(r); };
const take = (scan, r) => {
  for (const d of scan.defs) if (d.name.startsWith('--_ag-')) addDef(d.name, r);
  for (const u of scan.uses) {
    if (!u.name.startsWith('--_ag-') || u.name === u.via) continue; // self-reference is not a reader
    privUses.push({ name: u.name, via: u.via });
  }
};
for (const f of [...distFiles, ...srcFiles]) {
  const r = rel(f);
  const text = readFileSync(f, 'utf8');
  if (f.endsWith('.css')) {
    take(scanCss(text, f), r);
  } else {
    // css text inside TS (template/string literals): `--_ag-x: value` declarations
    // and every static var(--_ag-x) read; a read inside a declaration value is via it.
    const defs = [];
    const uses = [];
    const inDecl = [];
    for (const m of text.matchAll(/(--_ag-[a-zA-Z0-9-]*[a-zA-Z0-9])\s*:\s*([^;}`'"\n]*)/g)) {
      if (m[2].trim() !== 'initial') defs.push({ name: m[1] });
      const start = m.index + m[0].length - m[2].length;
      inDecl.push([start, start + m[2].length, m[1]]);
    }
    for (const m of text.matchAll(/var\(\s*(--_ag-[a-zA-Z0-9-]*[a-zA-Z0-9])/g)) {
      const hit = inDecl.find(([s, e]) => m.index >= s && m.index < e);
      uses.push({ name: m[1], via: hit ? hit[2] : null });
    }
    take({ defs, uses }, r);
  }
  if (!isGenerated(r)) publicCorpus.push(text);
}

// ---- liveness (least fixpoint) -----------------------------------------------
const live = new Set();
for (let changed = true; changed;) {
  changed = false;
  for (const u of privUses) {
    if (live.has(u.name)) continue;
    // a read from a normal property, a public/unknown custom property, or a live private
    const viaLive = u.via === null || !u.via.startsWith('--_ag-') || !privDefs.has(u.via) || live.has(u.via);
    if (viaLive) { live.add(u.name); changed = true; }
  }
}
const readerCount = (v) => privUses.filter((u) => u.name === v).length;

// ---- public manifest vars ------------------------------------------------------
const esc = (v) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const countPublic = (v) => {
  const re = new RegExp(`var\\(\\s*${esc(v)}(?![a-zA-Z0-9-])`, 'g');
  let n = 0;
  for (const text of publicCorpus) n += (text.match(re) ?? []).length;
  return n;
};
const counts = new Map(manifest.tokens.map((t) => [t.cssVar, countPublic(t.cssVar)]));

if (update) {
  for (const t of manifest.tokens) t.consumers = [{ count: counts.get(t.cssVar) ?? 0 }];
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 1) + '\n');
}

// ---- findings ------------------------------------------------------------------
const findings = [];
const tokenOwner = streamOf('tokens/sys/x.tokens.json'); // manifest vars are authored under tokens/**
for (const t of manifest.tokens) {
  if ((counts.get(t.cssVar) ?? 0) === 0 && t.public !== true)
    findings.push({ stream: tokenOwner, msg: `public ${t.cssVar} (${t.name}) has 0 readers` });
}
for (const [name, files] of [...privDefs].sort(([a], [b]) => a.localeCompare(b))) {
  if (live.has(name)) continue;
  const byStream = new Map();
  for (const f of [...files].sort()) {
    const s = streamOf(f);
    if (!byStream.has(s)) byStream.set(s, []);
    byStream.get(s).push(f);
  }
  const n = readerCount(name);
  const why = n === 0 ? '0 var() readers' : `0 live var() readers (${n} read(s) only from dead privates or itself)`;
  for (const [stream, fs] of byStream) findings.push({ stream, msg: `private ${name} declared at ${fs.join(', ')} has ${why}` });
}

const { mat, other } = reportByStream('dead-vars', findings, (f) => f.msg);
const liveDefined = [...privDefs.keys()].filter((n) => live.has(n)).length;
const summary = `public ${manifest.tokens.length}, private ${privDefs.size} (${liveDefined} live)`;
if (mat.length) {
  console.error(`dead-vars: ${mat.length} MAT dead var finding(s), ${other.length} pre-existing in other streams (${summary})`);
  process.exit(1);
}
console.log(`dead-vars: 0 MAT dead vars (${other.length} pre-existing in other streams; ${summary})${update ? ' — consumers written' : ''}`);
