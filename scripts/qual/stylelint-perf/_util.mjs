/* scripts/qual/stylelint-perf/_util.mjs — shared CSS value helpers for the QUAL
   CSS perf stylelint plugins (REQ-QUAL-44). No postcss import: plugins receive
   the PostCSS root from stylelint (stylelint is frozen; no direct postcss dep). */

/** Split `value` at top-level occurrences of `sep` (',' or whitespace), respecting parentheses and quotes. */
export function splitTopLevel(value, sep = ',') {
  const out = [];
  let depth = 0;
  let quote = null;
  let cur = '';
  for (const ch of value) {
    if (quote) {
      cur += ch;
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") { quote = ch; cur += ch; continue; }
    if (ch === '(') depth++;
    if (ch === ')') depth = Math.max(0, depth - 1);
    const isSep = sep === ' ' ? /\s/.test(ch) : ch === sep;
    if (isSep && depth === 0) {
      if (cur.trim()) out.push(cur.trim());
      cur = '';
      continue;
    }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** Top-level function calls in `value`: [{ name, args, start, end }] (args = raw text between the parens). */
export function topLevelFunctions(value) {
  const out = [];
  const re = /([a-zA-Z_-][\w-]*)\(/g;
  let m;
  while ((m = re.exec(value))) {
    let depth = 1;
    let i = m.index + m[0].length;
    for (; i < value.length && depth > 0; i++) {
      if (value[i] === '(') depth++;
      else if (value[i] === ')') depth--;
    }
    out.push({ name: m[1].toLowerCase(), args: value.slice(m.index + m[0].length, i - 1), start: m.index, end: i });
    re.lastIndex = i;
  }
  return out;
}

/** Function calls anywhere in `value` (nested ones included). */
export function allFunctions(value) {
  const out = [];
  const walk = (v) => {
    for (const f of topLevelFunctions(v)) {
      out.push(f);
      walk(f.args);
    }
  };
  walk(value);
  return out;
}

/** Custom property definitions in a stylesheet: Map<'--name', string[] (distinct values)>. */
export function customProperties(root) {
  const defs = new Map();
  root.walkDecls((d) => {
    if (!d.prop.startsWith('--')) return;
    const v = d.value.trim();
    const list = defs.get(d.prop) ?? [];
    if (!list.includes(v)) list.push(v);
    defs.set(d.prop, list);
  });
  return defs;
}

/** Resolve `value` through same-sheet custom properties. Returns every possible literal
    (strings without var()), or null if any branch is unresolvable in this sheet. */
export function resolveValues(value, defs, depth = 0) {
  const v = value.trim();
  if (depth > 8) return null;
  const fns = topLevelFunctions(v);
  const varFn = fns.find((f) => f.name === 'var');
  if (!varFn) return [v];
  const [nameRaw, ...fallbackParts] = splitTopLevel(varFn.args, ',');
  const name = (nameRaw ?? '').trim();
  const fallback = fallbackParts.length ? fallbackParts.join(',').trim() : null;
  // Any in-sheet definition may apply; the fallback applies wherever none is inherited.
  let candidates = defs.get(name) ? [...defs.get(name)] : null;
  if (fallback !== null) candidates = [...(candidates ?? []), fallback];
  if (!candidates) return null;
  const out = [];
  for (const c of candidates) {
    const replaced = v.slice(0, varFn.start) + c + v.slice(varFn.end);
    const r = resolveValues(replaced, defs, depth + 1);
    if (!r) return null;
    for (const x of r) if (!out.includes(x)) out.push(x);
  }
  return out;
}

/** Selectors of the rule containing `node` and of every ancestor rule (innermost first). */
export function selectorChain(node) {
  const out = [];
  for (let p = node.parent; p; p = p.parent) {
    if (p.type === 'rule' && typeof p.selector === 'string') out.push(p.selector);
  }
  return out;
}

/** True when `node` sits inside an @keyframes block. */
export function inKeyframes(node) {
  for (let p = node.parent; p; p = p.parent) {
    if (p.type === 'atrule' && /(^|-)keyframes$/i.test(p.name)) return true;
  }
  return false;
}

export const BACKDROP_PROPS = new Set(['backdrop-filter', '-webkit-backdrop-filter']);
