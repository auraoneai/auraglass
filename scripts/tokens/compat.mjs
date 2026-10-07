// AuraGlass 5.0 — compat layer tooling (MAT-004/073/074/075/076).
//
// Reads the frozen 4.1.0 primitives (git show 15b6de6f7:src/styles/tokens.css,
// vendored verbatim at dist/css/compat/legacy-primitives.css) plus the reader set
// (every --glass-*, --aura-*, --persona-*, --glass-theme-* custom property read by
// the 4.x source at that commit) and emits:
//   tokens/legacy/4x-rendered.tokens.json  — private, pre-resolved token records
//   tokens/generated/compat-alias-map.json — reader -> successor map
//   dist/compat/tokens.css                 — @layer ag.compat alias block
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const COMPAT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const LEGACY_COMMIT = '15b6de6f7';
export const LEGACY_CSS_PATH = 'src/styles/tokens.css';

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

// Every --glass-* / --aura-* / --persona-* / --glass-theme-* name read by 4.x source.
export function legacyReaderSet() {
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
  return execSync(`git show ${LEGACY_COMMIT}:${LEGACY_CSS_PATH}`, { cwd: COMPAT_ROOT, encoding: 'utf8' });
}

/**
 * Ordered successor rules: [regexOnName, successor | null]. null = frozen (the 4.x
 * value is emitted literally). A successor may itself be a compat-emitted shim var
 * (declared in SHIM_VARS) — e.g. the spec'd --ag-on-surface-tertiary.
 */
export const SHIM_VARS = {
  '--ag-on-surface-tertiary': 'var(--ag-on-surface-muted)',
  '--ag-color-on-surface': 'var(--ag-on-surface)',
  '--ag-color-on-surface-muted': 'var(--ag-on-surface-muted)',
};

export const SUCCESSOR_RULES = [
  // theme hooks (MAT-075 normative names; resolve via SHIM_VARS)
  [/^--glass-theme-text$/, '--ag-color-on-surface'],
  [/^--glass-theme-text-secondary$/, '--ag-color-on-surface-muted'],
  [/^--glass-theme-text-tertiary$/, '--ag-on-surface-tertiary'],
  // radius ladders: shared sizes map, dropped rungs freeze
  [/^--glass-radius-(xs|sm|md|lg|xl|full)$/, (m) => `--ag-radius-${m[1]}`],
  [/^--aura-radius-(sm|md|lg|xl)$/, (m) => `--ag-radius-${m[1]}`],
  [/^--aura-radius-2xl$/, '--ag-radius-xl'],
  // motion: 4.x 6-rung scale -> 5.0 rungs by ordinal; ease names -> ag-ease-*
  [/^--glass-(motion-duration-|duration-)instant$/, '--ag-duration-instant'],
  [/^--glass-(motion-duration-|duration-)fast$/, '--ag-duration-micro'],
  [/^--glass-(motion-duration-|duration-)normal$/, '--ag-duration-small'],
  [/^--glass-(motion-duration-|duration-)slow$/, '--ag-duration-medium'],
  [/^--glass-(motion-duration-|duration-)slower$/, '--ag-duration-large'],
  [/^--aura-motion-duration-fast$/, '--ag-duration-micro'],
  [/^--aura-motion-duration-medium$/, '--ag-duration-small'],
  [/^--glass-(motion-ease|motion-easing|easing)-standard$/, '--ag-ease-standard'],
  [/^--glass-(motion-ease|motion-easing|easing)-emphasized$/, '--ag-ease-emphasized'],
  [/^--glass-(motion-ease|motion-easing|easing)-decelerated$/, '--ag-ease-emphasized-decelerate'],
  [/^--glass-(motion-ease|motion-easing|easing)-accelerated$/, '--ag-ease-accelerate'],
  [/^--glass-(motion-ease|motion-easing|easing)-(in|in-out)$/, '--ag-ease-standard'],
  [/^--glass-(motion-ease|motion-easing|easing)-out$/, '--ag-ease-emphasized-decelerate'],
  [/^--glass-(motion-ease|motion-easing|easing)-spring$/, '--ag-spring-smooth'],
  [/^--aura-motion-easing-(standard|emphasized)$/, (m) => `--ag-ease-${m[1]}`],
  // space: --aura-space-<n> maps when an --ag-space-<n> exists
  [/^--aura-space-(0|1|2|3|4|5|6|8|10|12|16)$/, (m) => `--ag-space-${m[1]}`],
  // type: 4.x font-size ramp -> 5.0 type roles
  [/^--(glass|aura)-font-size-(xs|sm|base|lg|xl|2xl|3xl)$/, (m) => ({ xs: 'caption', sm: 'label', base: 'body', lg: 'callout', xl: 'title-3', '2xl': 'title-2', '3xl': 'title-1' })[m[2]] && `--ag-type-${({ xs: 'caption', sm: 'label', base: 'body', lg: 'callout', xl: 'title-3', '2xl': 'title-2', '3xl': 'title-1' })[m[2]]}-size`],
  [/^--aura-font-(family-)?sans$/, '--ag-font-sans'],
  // shadows: named elevations only
  [/^--aura-shadow-elevation-(1|sm)$/, '--ag-shadow-thin'],
  [/^--aura-shadow-elevation-(2|3|md)$/, '--ag-shadow-regular'],
  [/^--aura-shadow-elevation-(4|lg|xl)$/, '--ag-shadow-thick'],
  // focus
  [/^--glass-focus-width$/, '--ag-focus-width'],
  [/^--glass-focus-color-(primary|default)$/, '--ag-color-focus-inner'],
  // color hooks
  [/^--glass-color-accent$/, '--ag-color-accent'],
  [/^--glass-color-(danger|error)$/, '--ag-color-danger'],
  [/^--glass-color-info$/, '--ag-color-info'],
  [/^--aura-accent-color$/, '--ag-color-accent'],
  [/^--aura-color-highlight$/, '--ag-color-accent'],
  [/^--aura-color-muted$/, '--ag-on-surface-muted'],
  [/^--aura-color-semantic-primary$/, '--ag-color-accent'],
  [/^--aura-color-semantic-(danger|error)$/, '--ag-color-danger'],
  [/^--aura-color-global-border-(soft|strong)$/, '--ag-color-border'],
  [/^--aura-color-global-surface$/, '--ag-color-canvas'],
  [/^--aura-color-global-text-primary$/, '--ag-on-surface'],
  [/^--aura-color-global-text-secondary$/, '--ag-on-surface-muted'],
  [/^--aura-color-glass-border$/, '--ag-color-border'],
  // text hooks
  [/^--glass-text-primary$/, '--ag-on-surface'],
  [/^--glass-text-(secondary|tertiary)(-dark)?$/, '--ag-on-surface-muted'],
  // touch targets
  [/^--glass-touch-target-(min|md)$/, '--ag-target-min'],
  [/^--glass-touch-target-lg$/, '--ag-target-coarse'],
  // z: content rung
  [/^--glass-z-0$/, '--ag-z-content'],
];

/** Name -> { successor: string|null, frozen: string|null, defined: boolean } */
export function buildCompatMap(legacyDecls, readers) {
  const defined = new Map(legacyDecls.map((d) => [d.name, d.value]));
  const names = new Set([...defined.keys(), ...readers]);
  const map = {};
  for (const name of [...names].sort()) {
    let successor = null;
    for (const [re, target] of SUCCESSOR_RULES) {
      const m = re.exec(name);
      if (m) { successor = typeof target === 'function' ? target(m) : target; break; }
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

/** dist/compat/tokens.css — one @layer ag.compat :where(:root) block. */
export function compatCss(map) {
  const lines = [
    '/* @generated by scripts/tokens/build.mjs (scripts/tokens/compat.mjs). 4.x compat aliases — do not edit. */',
    "@import '../css/tokens.css';",
    '@layer ag.compat {',
    '  :where(:root) {',
  ];
  for (const [shim, target] of Object.entries(SHIM_VARS)) lines.push(`    ${shim}: ${target};`);
  for (const [name, e] of Object.entries(map)) {
    if (!e.defined) { lines.push(`    /* ${name}: never defined in 4.x tokens.css — no output */`); continue; }
    if (e.successor) lines.push(`    ${name}: var(${e.successor});`);
    else lines.push(`    ${name}: ${e.frozen};`);
  }
  lines.push('  }', '}', '');
  return lines.join('\n');
}

/** Emits all compat artifacts; called from runBuild when tokens/legacy/ exists. */
export function emitCompat(write, tokenDir) {
  const css = legacySourceCss();
  const decls = extractLegacyDeclarations(css);
  const readers = legacyReaderSet();
  const map = buildCompatMap(decls, readers);
  write('tokens/generated/compat-alias-map.json', JSON.stringify(map, null, 2) + '\n');
  write('dist/compat/tokens.css', compatCss(map));
  write('dist/css/compat/legacy-primitives.css', css);
  return { count: Object.keys(map).length };
}
