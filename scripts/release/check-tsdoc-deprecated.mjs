#!/usr/bin/env node
/* scripts/release/check-tsdoc-deprecated.mjs — REQ-PLAT-27 (PLAT-188/189).
   For every ACTIVE deprecation entry of kind export|prop|prop-value, the
   declaration itself must carry a TSDoc tag in the exact form

     @deprecated since <since>, removed in <removeIn>. Use {@link <replacement>}.
     @deprecated since <since>, removed in <removeIn>.            (replacement null)

   on the JSDoc block attached to the declaration (TypeScript compiler API —
   not a text window), optionally followed by free text. `export` entries
   match an exported function/class/interface/type/enum/const named <symbol>;
   `prop`/`prop-value` entries (<Component>.<prop>) match a property
   signature <prop> in an interface/type alias whose name starts with
   <Component>. Planned entries get their tag when they flip to active.
   Reverse check (default; --no-reverse disables): every `@deprecated since
   …, removed in …` tag on a declaration must have an entry.

     node scripts/release/check-tsdoc-deprecated.mjs [--line 4x|5x] [--roots src]
       [--entries <json>] [--no-reverse] */
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(import.meta.url);
const ts = require('typescript');
export const COVERED_KINDS = new Set(['export', 'prop', 'prop-value']);
const TAG_RE = /^since (\S+), removed in (\S+?)\.(?: Use \{@link ([^}]+)\}\.)?(?:\s|$)/;

export function findDeclFiles(symbol, roots, { cwd = ROOT } = {}) {
  const out = [];
  for (const root of roots) {
    try {
      const hits = execFileSync('git', ['grep', '-l', '-w', '-F', symbol, '--', `${root}/`], { cwd, encoding: 'utf8' });
      out.push(...hits.split('\n').filter((f) => /\.(ts|tsx)$/.test(f) && !/\.d\.ts$/.test(f)));
    } catch { /* git grep exits 1 on no match */ }
  }
  return [...new Set(out)];
}

/** Text of the `@deprecated` tag on the JSDoc attached to `node`, or null. */
function deprecatedTagText(node, sf) {
  for (const doc of ts.getJSDocCommentsAndTags(node)) {
    const tags = ts.isJSDoc(doc) ? doc.tags ?? [] : [doc];
    for (const tag of tags) {
      if (tag.tagName?.escapedText !== 'deprecated') continue;
      // Raw source of the tag comment keeps {@link …} verbatim.
      const raw = sf.text.slice(tag.tagName.end, tag.end)
        .split('\n').map((l) => l.replace(/^\s*\*?\s?/, '')).join(' ')
        .replace(/\*\/\s*$/, '').replace(/\s+/g, ' ').trim();
      return raw;
    }
  }
  return null;
}

const isExported = (node) => (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0
  || (ts.isVariableDeclaration(node) && (ts.getCombinedModifierFlags(node.parent.parent) & ts.ModifierFlags.Export) !== 0);

/** Every declaration that can carry a tag: [{kind:'export'|'prop', name, owner, line, tag}]. */
export function declarations(text, fileName = 'x.tsx') {
  const sf = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true, fileName.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const out = [];
  const line = (n) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1;
  const visit = (node, owner) => {
    if ((ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node)
      || ts.isTypeAliasDeclaration(node) || ts.isEnumDeclaration(node)) && node.name && isExported(node)) {
      out.push({ kind: 'export', name: node.name.text, owner: null, line: line(node), tag: deprecatedTagText(node, sf) });
    }
    if (ts.isVariableStatement(node) && isExported(node)) {
      for (const d of node.declarationList.declarations) {
        if (ts.isIdentifier(d.name)) out.push({ kind: 'export', name: d.name.text, owner: null, line: line(d), tag: deprecatedTagText(node, sf) ?? deprecatedTagText(d, sf) });
      }
    }
    let nextOwner = owner;
    if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) nextOwner = node.name.text;
    if (ts.isPropertySignature(node) && node.name && (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) && owner) {
      out.push({ kind: 'prop', name: node.name.text, owner, line: line(node), tag: deprecatedTagText(node, sf) });
    }
    ts.forEachChild(node, (c) => visit(c, nextOwner));
  };
  visit(sf, null);
  return out;
}

/** Parse a tag against the exact form; returns {since, removeIn, link} or null. */
export function parseTag(tag) {
  const m = tag == null ? null : TAG_RE.exec(tag);
  return m ? { since: m[1], removeIn: m[2], link: m[3] ?? null } : null;
}

const matches = (entry, d) => {
  if (entry.kind === 'export') return d.kind === 'export' && d.name === entry.symbol;
  const [component, prop] = String(entry.symbol).split('.');
  return d.kind === 'prop' && d.name === prop && d.owner != null && d.owner.startsWith(component);
};

export function checkEntry({ entry, readFile, findFiles, missingIsError = true, stats = null }) {
  const errors = [];
  if (!COVERED_KINDS.has(entry.kind)) return errors;
  // Tags are required for active entries only — a planned entry's tag lands
  // when the deprecation ships in its minor (REQ-PLAT-27 item 3).
  if (entry.status !== 'active') return errors;
  const lookup = entry.kind === 'export' ? entry.symbol : String(entry.symbol).split('.')[0];
  const want = `since ${entry.since}, removed in ${entry.removeIn}.${entry.replacement ? ` Use {@link ${entry.replacement}}.` : ''}`;
  let found = 0; let ok = false;
  for (const f of findFiles(lookup)) {
    for (const d of declarations(readFile(f), f)) {
      if (!matches(entry, d)) continue;
      found++;
      const p = parseTag(d.tag);
      if (!p) {
        errors.push(`${entry.id}: ${f}:${d.line} '${entry.symbol}' needs '@deprecated ${want}'${d.tag ? ` (found '@deprecated ${d.tag}')` : ''}`);
      } else if (p.since !== entry.since || p.removeIn !== entry.removeIn || (p.link ?? null) !== (entry.replacement ?? null)) {
        errors.push(`${entry.id}: ${f}:${d.line} @deprecated must read '${want}' (found '${d.tag}')`);
      } else ok = true;
    }
  }
  if (!found) {
    // On next, entries without a compat wrapper carry their tag on the 4.x
    // source only — nothing to check here.
    if (stats) stats.absent++;
    if (missingIsError) errors.push(`${entry.id}: no source declaration found for '${entry.symbol}'`);
    return errors;
  }
  if (ok && stats) stats.covered++;
  return ok ? [] : errors;
}

// Reverse: an exact-form `@deprecated since …, removed in …` tag on a
// declaration with no covered entry.
export function checkReverse(files, entries, { readFile }) {
  const errors = [];
  const covered = entries.filter((e) => COVERED_KINDS.has(e.kind));
  for (const f of files) {
    for (const d of declarations(readFile(f), f)) {
      if (!d.tag || !/^since \S+, removed in /.test(d.tag)) continue;
      const hit = covered.some((e) => matches(e, d));
      if (!hit) errors.push(`${f}:${d.line}: @deprecated '${d.owner ? `${d.owner}.` : ''}${d.name}' has no deprecation entry`);
    }
  }
  return errors;
}

export async function main(argv = process.argv.slice(2), { root = ROOT } = {}) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  const line = arg('--line') ?? '5x';
  // On 4.x the tag lives on the deprecated declaration itself (roots: src).
  // On next the 4.x sources are quarantined under legacy/ and the seam is
  // src/compat — entries without a compat wrapper are 4.x-only tags.
  const roots = (arg('--roots') ?? (line === '4x' ? 'src' : 'src/compat')).split(',');
  const missingIsError = line === '4x';
  let entries;
  if (arg('--entries')) entries = JSON.parse(readFileSync(arg('--entries'), 'utf8'));
  else {
    const { loadEntries } = await import('./gen-deprecations.mjs');
    entries = await loadEntries(root);
  }
  const readFile = (f) => readFileSync(join(root, f), 'utf8');
  const findFiles = (sym) => findDeclFiles(sym, roots, { cwd: root });
  const stats = { covered: 0, absent: 0 };
  const errors = entries.flatMap((e) => checkEntry({ entry: e, readFile, findFiles, missingIsError, stats }));
  if (!argv.includes('--no-reverse')) {
    const files = findDeclFiles('@deprecated', roots, { cwd: root });
    errors.push(...checkReverse(files, entries, { readFile }));
  }
  if (errors.length) { for (const e of errors) console.error(`FAIL ${e}`); return 1; }
  const n = entries.filter((e) => COVERED_KINDS.has(e.kind) && e.status === 'active').length;
  console.log(`check-tsdoc-deprecated --line ${line}: ${stats.covered} of ${n} active export/prop/prop-value entries covered by a tag${stats.absent ? ` (${stats.absent} with no declaration under ${roots.join(',')})` : ''}`);
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().then((c) => process.exit(c)).catch((e) => { console.error(e); process.exit(1); });
}
