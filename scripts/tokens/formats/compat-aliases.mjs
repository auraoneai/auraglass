// AuraGlass 5.0 — compat layer tooling (MAT-004/073/074/075/076).
//
// Reads the frozen 4.1.0 primitives and reader set from VENDORED files under
// tokens/legacy/ (the build never shells out to git):
//   tokens/legacy/4x-primitives.css  — byte-identical to
//     15b6de6f7:src/styles/tokens.css (verified by --refresh)
//   tokens/legacy/4x-reader-set.json — every --glass-*, --aura-*, --persona-*,
//     --glass-theme-* custom property read by the 4.x source at that commit
// and emits:
//   tokens/legacy/4x-rendered.tokens.json  — private, pre-resolved token records
//   tokens/generated/compat-alias-map.json — reader -> successor map
//   dist/compat/tokens.css                 — @layer ag.compat alias block
//
// Regenerate the vendored inputs with `node scripts/tokens/formats/
// compat-aliases.mjs --refresh` (requires git access to LEGACY_COMMIT).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const COMPAT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
export const LEGACY_COMMIT = '15b6de6f7';
export const LEGACY_CSS_PATH = 'src/styles/tokens.css';
const VENDORED_CSS = join(COMPAT_ROOT, 'tokens', 'legacy', '4x-primitives.css');
const VENDORED_READERS = join(COMPAT_ROOT, 'tokens', 'legacy', '4x-reader-set.json');

/** All custom-property declarations in a CSS file (multi-line aware). */
export function extractLegacyDeclarations(cssText) {
  const out = [];
  const re = /(--(?:glass|aura|persona|glass-theme)[a-zA-Z0-9-]*)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(cssText))) {
    out.push({ name: m[1], value: m[2].replace(/\s+/g, ' ').trim() });
  }
  return out;
}

// Every --glass-* / --aura-* / --persona-* / --glass-theme-* name read by 4.x
// source at LEGACY_COMMIT. The build reads the vendored set; --refresh recomputes
// it from git.
export function legacyReaderSet() {
  const doc = JSON.parse(readFileSync(VENDORED_READERS, 'utf8'));
  if (doc.commit !== LEGACY_COMMIT)
    throw new Error(`tokens/legacy/4x-reader-set.json was generated from ${doc.commit}; expected ${LEGACY_COMMIT} — run compat-aliases.mjs --refresh`);
  return doc.names;
}

/** Git-backed scanner used only by --refresh to regenerate VENDORED_READERS. */
export function scanLegacyReaderSet() {
  const files = execSync(
    `git ls-tree -r ${LEGACY_COMMIT} --name-only`,
    { cwd: COMPAT_ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
  ).split('\n').filter((f) => /^src\/.*\.(ts|tsx|css)$/.test(f));
  const names = new Set();
  for (const f of files) {
    let src;
    try { src = execSync(`git show ${LEGACY_COMMIT}:${f}`, { cwd: COMPAT_ROOT, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }); }
    catch { continue; }
    for (const m of src.matchAll(/--(?:glass|aura|persona|glass-theme)[a-zA-Z0-9-]*/g)) names.add(m[0]);
  }
  return [...names].sort();
}

export function legacySourceCss() {
  return readFileSync(VENDORED_CSS, 'utf8');
}

/** Regenerate the vendored 4.x inputs (dev-time; needs git object access). */
export function refreshVendored() {
  const css = execSync(`git show ${LEGACY_COMMIT}:${LEGACY_CSS_PATH}`, { cwd: COMPAT_ROOT, encoding: 'utf8' });
  writeFileSync(VENDORED_CSS, css);
  const names = scanLegacyReaderSet();
  writeFileSync(VENDORED_READERS, JSON.stringify({
    commit: LEGACY_COMMIT,
    generatedBy: 'scripts/tokens/formats/compat-aliases.mjs --refresh',
    names,
  }, null, 2) + '\n');
  return { bytes: css.length, names: names.length };
}

/**
 * Successor table: scripts/tokens/compat-successors.json (ordered, first match
 * wins). `to` carries $N capture refs; {group, map} looks a capture up in a
 * table; a missing/null `to` freezes the 4.x value verbatim. `shims` declares
 * compat-emitted shim vars successors may point at.
 */
const SUCCESSOR_DOC = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'compat-successors.json'), 'utf8')
);
export const SHIM_VARS = SUCCESSOR_DOC.shims;

const resolveTo = (to, m) => {
  if (to == null) return null;
  if (typeof to === 'string') return to.replace(/\$(\d+)/g, (_, i) => m[Number(i)] ?? '');
  if (to.map) return to.map[m[to.group ?? 1]] ?? null;
  return null;
};

export const SUCCESSOR_RULES = SUCCESSOR_DOC.rules.map(
  (r) => [new RegExp(r.match), r.to],
);

/** Name -> { successor: string|null, frozen: string|null, defined: boolean } */
export function buildCompatMap(legacyDecls, readers) {
  const defined = new Map(legacyDecls.map((d) => [d.name, d.value]));
  const names = new Set([...defined.keys(), ...readers]);
  const map = {};
  for (const name of [...names].sort()) {
    let successor = null;
    for (const [re, target] of SUCCESSOR_RULES) {
      const m = re.exec(name);
      if (m) { successor = resolveTo(target, m); break; }
    }
    map[name] = { successor, frozen: defined.get(name) ?? null, defined: defined.has(name) };
  }
  return map;
}

/** tokens/legacy/4x-rendered.tokens.json — private pre-resolved records. */
export function legacyTokensJson(legacyDecls) {
  const legacy = {};
  for (const d of legacyDecls) {
    const key = d.name.replace(/^--/, '');
    legacy[key] = {
      $type: 'string',
      $value: d.value,
      $extensions: { 'ag.legacyVar': d.name, 'ag.legacy': true, 'ag.tier': 'legacy' },
    };
  }
  return { legacy };
}

/** dist/compat/tokens.css — @layer ag.compat :where(:root) block plus the
 *  `[data-theme=dark], .dark` block carrying every --ag-color-* dark value so
 *  4.x dark-mode selectors keep resolving 5.x colors (MAT-073). */
export function compatCss(map, darkOverrides = {}) {
  const lines = [
    '/* @generated by scripts/tokens/build.mjs (scripts/tokens/formats/compat-aliases.mjs). 4.x compat aliases — do not edit. */',
    "@import '../css/tokens.css';",
    '@layer ag.compat {',
    '  :where(:root) {',
  ];
  for (const [shim, target] of Object.entries(SHIM_VARS)) lines.push(`    ${shim}: ${target};`);
  // Reader names never defined in 4.x tokens.css have no compat value to emit;
  // they are accounted for in tokens/generated/compat-alias-map.json
  // (defined: false), not as CSS comments (MAT-021 gzip cap).
  for (const [name, e] of Object.entries(map)) {
    if (!e.defined) continue;
    if (e.successor) lines.push(`    ${name}: var(${e.successor});`);
    else lines.push(`    ${name}: ${e.frozen};`);
  }
  lines.push('  }', '}', '');
  // MAT-036 contract: dist/compat/tokens.css emits ZERO legacy hook selectors
  // (no [data-theme=dark]/.dark blocks). darkOverrides are not emitted here.
  return lines.join('\n');
}

/** Emits all compat artifacts; called from runBuild when tokens/legacy/ exists.
 *  darkOverrides: { '--ag-color-*': '<rendered dark css>' } from the scheme cells. */
export function emitCompat(write, tokenDir, darkOverrides = {}) {
  const css = legacySourceCss();
  const decls = extractLegacyDeclarations(css);
  const readers = legacyReaderSet();
  const map = buildCompatMap(decls, readers);
  write('tokens/generated/compat-alias-map.json', JSON.stringify(map, null, 2) + '\n');
  write('dist/compat/tokens.css', compatCss(map, darkOverrides));
  write('dist/css/compat/legacy-primitives.css', css);
  return { count: Object.keys(map).length };
}

if (process.argv[1] === fileURLToPath(import.meta.url) && process.argv.includes('--refresh')) {
  const r = refreshVendored();
  console.log(`compat-aliases: vendored 4.x primitives (${r.bytes} bytes) and ${r.names} reader names from ${LEGACY_COMMIT}`);
}
