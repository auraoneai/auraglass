/* auraglass/perf-backdrop-filter-shape (REQ-QUAL-44). Every `backdrop-filter`
   / `-webkit-backdrop-filter` value must match the REQ-QUAL-44 grammar
   (verbatim below): `none`, the blur→saturate→brightness chain, or an
   `url(#ag-lens-<shape>-<size>)` SVG lens with an optional blur/saturate
   (/brightness) tail. No contrast(), no other filter functions, no reordering.
   Function arguments may themselves contain nested functions (var(), calc());
   before matching, each non-url function's argument text is folded to a single
   placeholder so the regex's `[^)]+` means "one argument". */
import stylelint from 'stylelint';
import { BACKDROP_PROPS, topLevelFunctions } from './_util.mjs';

export const ruleName = 'auraglass/perf-backdrop-filter-shape';
// REQ-QUAL-44 verbatim.
export const BACKDROP_FILTER_RE =
  /^(none|blur\([^)]+\) saturate\([^)]+\) brightness\([^)]+\)|url\(#ag-lens-(fixed|capsule|concentric)-(control|bar|panel)\)( blur\([^)]+\) saturate\([^)]+\)( brightness\([^)]+\))?)?)$/;

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (value, prop) =>
    `${prop} value '${value}' is outside the REQ-QUAL-44 grammar (none | blur() saturate() brightness() | url(#ag-lens-<shape>-<size>) [blur() saturate() [brightness()]]); no contrast().`,
});

/** Fold each top-level function's arguments (except url()) to `x`; collapse whitespace. */
export function normalizeBackdropValue(value) {
  let v = value.trim().replace(/\s+/g, ' ');
  const fns = topLevelFunctions(v);
  for (let i = fns.length - 1; i >= 0; i--) {
    const f = fns[i];
    const inner = f.name === 'url' ? f.args.trim().replace(/^(['"])(.*)\1$/, '$2') : 'x';
    v = `${v.slice(0, f.start)}${f.name}(${inner})${v.slice(f.end)}`;
  }
  return v.replace(/\s*\(\s*/g, '(').replace(/\s*\)/g, ')').toLowerCase();
}

export const isValidBackdropValue = (value) => BACKDROP_FILTER_RE.test(normalizeBackdropValue(value));

const ruleFunction = (primary) => (root, result) => {
  if (!primary) return;
  root.walkDecls((decl) => {
    if (!BACKDROP_PROPS.has(decl.prop.toLowerCase())) return;
    if (!isValidBackdropValue(decl.value)) {
      stylelint.utils.report({ ruleName, result, node: decl, message: messages.rejected(decl.value.trim(), decl.prop) });
    }
  });
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = { url: 'https://github.com/auraoneai/auraglass/blob/next/docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md' };

export default stylelint.createPlugin(ruleName, ruleFunction);
