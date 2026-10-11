#!/usr/bin/env node
/* REQ-MAT-02 / REQ-FIN-50 (D.3-04) compiler guards — FIN-D-owned module.

   Every guard walks the loaded token records (build.mjs loadTokens) and their
   alias-resolved values (build.mjs resolveAliases) and returns findings
   { guard, path, message }; `path` is always the offending token path.
   build.mjs calls assertGuards(records, resolved) right after alias resolution
   (REQ-FIN-01 transfer, FIN-A), which exits 1 listing every finding.

   Guards:
     material-alias  a material.* token aliases anything but a sys.* token
     preset          a preset defines a `material` / `material.*` key, aliases a
                     material.* (or material-tier) token, or carries a --_ag-* string
                     (keys and alias targets are walked; plain strings such as the
                     preset `name` are never pattern-matched for "material.")
     ref-leak        an emitted --ag-* value, or a comp-tier token, resolves through
                     a ref-tier token with no sys hop
     blur-cap        a blur dimension resolves above 32px
     bezier-y        a cubic-bezier resolves with a y control point outside [0, 1]
     spring-zeta     a spring resolves with dampingRatio outside [0.8, 1.0]
     spring-response a spring resolves with response outside [120, 800] ms

   CLI: node scripts/tokens/guards.mjs [--fixtures <token dir>]
   Runs schema validation, alias resolution and every guard over the token tree
   (default tokens/); exits 1 naming each offending path, else prints OK. */
import { readFileSync, realpathSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const BLUR_CAP_PX = 32;
export const SPRING_ZETA = [0.8, 1.0];
export const SPRING_RESPONSE_MS = [120, 800];
export const GUARD_IDS = ['material-alias', 'preset', 'ref-leak', 'blur-cap', 'bezier-y', 'spring-zeta', 'spring-response'];

const REF_RE = /\{([^{}]+)\}/g;
const PRIVATE_RE = /--_ag-/;
const tierOf = (rec) => rec?.ext?.['ag.tier'];
const isLegacy = (rec) => rec.ext?.['ag.legacy'] === true || tierOf(rec) === 'legacy';
const isPlain = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isDimension = (v) => isPlain(v) && typeof v.value === 'number' && typeof v.unit === 'string';

/** Alias targets named anywhere inside a raw (unresolved) token value. */
function aliasTargets(value) {
  const out = [];
  const scan = (v) => {
    if (typeof v === 'string') for (const m of v.matchAll(REF_RE)) out.push(m[1]);
    else if (Array.isArray(v)) v.forEach(scan);
    else if (isPlain(v)) Object.values(v).forEach(scan);
  };
  scan(value);
  return out;
}

/** Visit every node of a value with its key path ([] for the root). */
function walkValue(value, visit, keys = [], parent = undefined) {
  visit(value, keys, parent);
  if (Array.isArray(value)) value.forEach((x, i) => walkValue(x, visit, [...keys, String(i)], value));
  else if (isPlain(value)) for (const [k, x] of Object.entries(value)) walkValue(x, visit, [...keys, k], value);
}

const at = (name, keys) => (keys.length ? `${name}.${keys.join('.')}` : name);

// ---------- material-alias ----------

/** material.* tokens may alias sys.* tokens only (REQ-MAT-02). */
export function guardMaterialAliases(records) {
  const findings = [];
  for (const rec of records.values()) {
    if (tierOf(rec) !== 'material') continue;
    for (const target of aliasTargets(rec.value)) {
      const t = records.get(target);
      if (!t) continue; // unresolved aliases are reported by resolveAliases
      if (tierOf(t) !== 'sys')
        findings.push({ guard: 'material-alias', path: rec.name, message: `material.* alias {${target}} targets tier '${tierOf(t) ?? 'none'}' (must alias sys.* only)` });
    }
  }
  return findings;
}

// ---------- preset ----------

const isPreset = (rec) => rec.type === 'theme-preset' || rec.name.startsWith('preset.');
const isMaterialKey = (k) => k === 'material' || k.startsWith('material.');

/** Presets must not define material.* keys, alias material tokens, or carry --_ag-* (REQ-MAT-02). */
export function guardPresets(records, resolved) {
  const findings = [];
  const seen = new Set();
  const add = (path, message) => {
    const key = `${path}\u0000${message}`;
    if (!seen.has(key)) { seen.add(key); findings.push({ guard: 'preset', path, message }); }
  };
  for (const rec of records.values()) {
    if (!isPreset(rec)) continue;
    for (const target of aliasTargets(rec.value)) {
      if (isMaterialKey(target) || tierOf(records.get(target)) === 'material')
        add(rec.name, `preset defines material.* keys (aliases {${target}})`);
    }
    for (const value of [rec.value, resolved?.get(rec.name)]) {
      walkValue(value, (v, keys) => {
        const last = keys.at(-1);
        if (last !== undefined && isMaterialKey(last)) add(at(rec.name, keys), 'preset defines material.* keys');
        if (last !== undefined && PRIVATE_RE.test(last)) add(at(rec.name, keys), 'preset value contains private --_ag-* var');
        if (typeof v === 'string' && PRIVATE_RE.test(v)) add(at(rec.name, keys), 'preset value contains private --_ag-* var');
      });
    }
  }
  return findings;
}

// ---------- ref-leak ----------

const emitsPublicVar = (rec) => {
  const cssVar = rec.ext?.['ag.cssVar'];
  return typeof cssVar === 'string' && cssVar.startsWith('--ag-');
};

/**
 * An emitted --ag-* token or a comp-tier token must reach ref.* only through a
 * sys.* hop. A sys-tier token is itself the hop; a ref-tier token emitting --ag-*
 * leaks directly; any other tier (comp, material, none) is followed through its
 * aliases until a sys token (ok) or a ref token (leak) is reached.
 */
export function guardRefLeak(records) {
  const findings = [];
  for (const rec of records.values()) {
    if (isLegacy(rec)) continue;
    const isComp = tierOf(rec) === 'comp';
    if (!emitsPublicVar(rec) && !isComp) continue;
    const subject = emitsPublicVar(rec) ? `emitted ${rec.ext['ag.cssVar']}` : 'comp-tier token';
    if (tierOf(rec) === 'ref') {
      findings.push({ guard: 'ref-leak', path: rec.name, message: `${subject} is a ref-tier token (ref.* must reach outputs through a sys.* hop)` });
      continue;
    }
    if (tierOf(rec) === 'sys') continue;
    const visited = new Set([rec.name]);
    const walk = (name, chain) => {
      for (const target of aliasTargets(records.get(name)?.value)) {
        if (visited.has(target)) continue;
        visited.add(target);
        const t = records.get(target);
        if (!t) continue;
        const next = [...chain, target];
        if (tierOf(t) === 'sys') continue;
        if (tierOf(t) === 'ref') {
          findings.push({ guard: 'ref-leak', path: rec.name, message: `${subject} resolves through ref-tier ${target} with no sys hop (${[rec.name, ...next].join(' -> ')})` });
          continue;
        }
        walk(target, next);
      }
    };
    walk(rec.name, []);
  }
  return findings;
}

// ---------- blur-cap ----------

const toPx = (d) => (d.unit === 'px' ? d.value : d.unit === 'rem' || d.unit === 'em' ? d.value * 16 : NaN);
const isShadowShape = (o) => isPlain(o) && ('offsetX' in o || 'offsetY' in o || 'spread' in o);
const BLUR_FN_RE = /blur\(\s*(-?\d*\.?\d+)(px|rem|em)\s*\)/g;

/**
 * Backdrop blur must not exceed 32px after alias resolution: a dimension token
 * whose path names blur, a `blur` key inside a material recipe (shadow blur radii,
 * i.e. objects shaped {offsetX, offsetY, blur, spread}, are not backdrop blur),
 * and any `blur(<n>px)` in a string value.
 */
export function guardBlurCap(records, resolved) {
  const findings = [];
  for (const rec of records.values()) {
    if (isLegacy(rec) || rec.type === 'shadow') continue;
    const value = resolved.get(rec.name);
    walkValue(value, (v, keys, parent) => {
      const path = at(rec.name, keys);
      const named = keys.length === 0 ? /blur/i.test(rec.name) : /blur/i.test(keys.at(-1)) && !isShadowShape(parent);
      if (named && isDimension(v) && toPx(v) > BLUR_CAP_PX)
        findings.push({ guard: 'blur-cap', path, message: `blur ${v.value}${v.unit} exceeds the ${BLUR_CAP_PX}px cap` });
      if (typeof v === 'string') for (const m of v.matchAll(BLUR_FN_RE)) {
        const px = toPx({ value: Number(m[1]), unit: m[2] });
        if (px > BLUR_CAP_PX) findings.push({ guard: 'blur-cap', path, message: `blur(${m[1]}${m[2]}) exceeds the ${BLUR_CAP_PX}px cap` });
      }
    });
  }
  return findings;
}

// ---------- bezier-y ----------

const BEZIER_FN_RE = /cubic-bezier\(\s*([^)]*)\)/g;
const bezierYFinding = (path, pts) => {
  const [, y1, , y2] = pts;
  const bad = [y1, y2].filter((y) => !(y >= 0 && y <= 1));
  return bad.length ? { guard: 'bezier-y', path, message: `cubic-bezier(${pts.join(', ')}) has y control point ${bad.join(', ')} outside [0, 1]` } : null;
};

/** cubic-bezier y control points stay in [0, 1] (cubicBezier tokens and cubic-bezier() strings). */
export function guardBezierY(records, resolved) {
  const findings = [];
  for (const rec of records.values()) {
    if (isLegacy(rec)) continue;
    const value = resolved.get(rec.name);
    const valueType = rec.type === 'mode-table' ? rec.ext?.['ag.valueType'] : rec.type;
    walkValue(value, (v, keys) => {
      const path = at(rec.name, keys);
      const depthOk = rec.type === 'mode-table' ? keys.length === 1 : keys.length === 0;
      if (valueType === 'cubicBezier' && depthOk && Array.isArray(v) && v.length === 4) {
        const f = bezierYFinding(path, v);
        if (f) findings.push(f);
      }
      if (typeof v === 'string') for (const m of v.matchAll(BEZIER_FN_RE)) {
        const pts = m[1].split(',').map((s) => Number(s.trim()));
        if (pts.length === 4 && pts.every(Number.isFinite)) {
          const f = bezierYFinding(path, pts);
          if (f) findings.push(f);
        }
      }
    });
  }
  return findings;
}

// ---------- springs ----------

const responseMs = (r) => (isDimension(r) ? (r.unit === 's' ? r.value * 1000 : r.unit === 'ms' ? r.value : NaN) : NaN);

/** Springs: dampingRatio in [0.8, 1.0] (spring-zeta), response in [120, 800] ms (spring-response). */
export function guardSprings(records, resolved) {
  const findings = [];
  for (const rec of records.values()) {
    if (isLegacy(rec) || rec.type !== 'motion-spring') continue;
    const v = resolved.get(rec.name);
    if (!isPlain(v)) continue; // shape errors belong to schema validation
    const zeta = v.dampingRatio;
    if (!(typeof zeta === 'number' && zeta >= SPRING_ZETA[0] && zeta <= SPRING_ZETA[1]))
      findings.push({ guard: 'spring-zeta', path: rec.name, message: `spring dampingRatio ${zeta} outside [${SPRING_ZETA.join(', ')}]` });
    const ms = responseMs(v.response);
    if (!(ms >= SPRING_RESPONSE_MS[0] && ms <= SPRING_RESPONSE_MS[1]))
      findings.push({ guard: 'spring-response', path: rec.name, message: `spring response ${Number.isNaN(ms) ? JSON.stringify(v.response) : `${ms}ms`} outside [${SPRING_RESPONSE_MS.join(', ')}] ms` });
  }
  return findings;
}

// ---------- aggregate ----------

/** Every guard's findings, in GUARD_IDS order then token order. */
export function collectGuardFindings(records, resolved) {
  return [
    ...guardMaterialAliases(records),
    ...guardPresets(records, resolved),
    ...guardRefLeak(records),
    ...guardBlurCap(records, resolved),
    ...guardBezierY(records, resolved),
    ...guardSprings(records, resolved),
  ];
}

export const formatFinding = (f) => `guard ${f.guard}: ${f.path}: ${f.message}`;

/** Build entry point: print every finding and exit 1 when any guard fires. */
export function assertGuards(records, resolved) {
  const findings = collectGuardFindings(records, resolved);
  if (findings.length) {
    console.error(`tokens: compiler guards failed (${findings.length}):\n  ${findings.map(formatFinding).join('\n  ')}`);
    process.exit(1);
  }
  return findings;
}

// ---------- CLI ----------

async function main(argv) {
  const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
  const i = argv.indexOf('--fixtures');
  const tokenDir = i >= 0 && argv[i + 1] ? resolve(ROOT, argv[i + 1]) : join(ROOT, 'tokens');
  const { discoverTokenFiles, validateTokenFile, loadSchema } = await import('./validate.mjs');
  const { loadTokens, resolveAliases } = await import('./build.mjs');

  const errors = [];
  const schema = loadSchema(join(tokenDir, '$schema.json'));
  for (const f of discoverTokenFiles(tokenDir)) {
    let tree;
    try { tree = JSON.parse(readFileSync(f, 'utf8')); }
    catch (e) { console.error(`tokens: ${f}: invalid JSON: ${e.message}`); process.exit(1); }
    for (const e of validateTokenFile(tree, schema, f)) errors.push(`schema: ${e.path}: ${e.message}`);
  }
  const records = loadTokens(tokenDir);          // exits 1 on duplicate paths
  const resolved = resolveAliases(records);      // exits 1 on unresolved alias / cycle
  const findings = collectGuardFindings(records, resolved);
  const lines = [...errors, ...findings.map(formatFinding)];
  if (lines.length) {
    console.error(`tokens: compiler guards failed (${lines.length}):\n  ${lines.join('\n  ')}`);
    process.exit(1);
  }
  console.log(`tokens:guards OK (${records.size} tokens, ${GUARD_IDS.length} guards)`);
}

const isMain = (() => {
  try { return !!process.argv[1] && realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1]); }
  catch { return false; }
})();
if (isMain) main(process.argv.slice(2)).catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
