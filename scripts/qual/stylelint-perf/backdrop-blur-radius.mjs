/* auraglass/perf-backdrop-blur-radius (REQ-QUAL-44). Blur radii inside
   `backdrop-filter` / `-webkit-backdrop-filter` are limited to the material
   blur scale {0, 12px, 20px, 32px}. Each blur() argument is resolved through
   custom properties defined in the same stylesheet (all definitions and the
   var() fallback are checked); an argument that cannot be resolved inside the
   sheet (a token from another file, calc()) is not judged here — the bundled
   dist/ stylesheet, where token definitions and uses share one sheet, is. */
import stylelint from 'stylelint';
import { allFunctions, BACKDROP_PROPS, customProperties, resolveValues } from './_util.mjs';

export const ruleName = 'auraglass/perf-backdrop-blur-radius';
export const ALLOWED_PX = [0, 12, 20, 32];
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (radius, prop) => `Blur radius '${radius}' in ${prop} is off the scale — use 0, 12px, 20px or 32px (REQ-QUAL-44).`,
});

/** null = allowed, string = the offending radius. */
export function checkRadius(lit) {
  const v = lit.trim().toLowerCase();
  if (v === '') return null; // blur() defaults to 0
  const m = v.match(/^([-+]?\d*\.?\d+)(px|em|rem|vw|vh|%|)?$/);
  if (!m) return v; // not a length literal after resolution (calc(), keywords)
  const n = Number(m[1]);
  if (n === 0) return null;
  if (m[2] === 'px' && ALLOWED_PX.includes(n)) return null;
  return v;
}

const ruleFunction = (primary) => (root, result) => {
  if (!primary) return;
  let defs = null;
  root.walkDecls((decl) => {
    if (!BACKDROP_PROPS.has(decl.prop.toLowerCase())) return;
    for (const f of allFunctions(decl.value)) {
      if (f.name !== 'blur') continue;
      defs ??= customProperties(root);
      const resolved = resolveValues(f.args, defs);
      if (!resolved) continue; // not resolvable within this sheet
      for (const lit of resolved) {
        if (/\bcalc\(|\bvar\(/i.test(lit)) continue;
        // CSS-wide keywords on a custom property defer to the cascade: not judged per sheet.
        if (/^(inherit|initial|unset|revert|revert-layer)$/i.test(lit.trim())) continue;
        const bad = checkRadius(lit);
        if (bad !== null) {
          stylelint.utils.report({ ruleName, result, node: decl, message: messages.rejected(bad, decl.prop), word: f.args });
          break;
        }
      }
    }
  });
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = { url: 'https://github.com/auraoneai/auraglass/blob/next/docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md' };

export default stylelint.createPlugin(ruleName, ruleFunction);
