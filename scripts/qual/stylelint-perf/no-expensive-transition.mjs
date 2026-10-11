/* auraglass/perf-no-expensive-transition (REQ-QUAL-44). No transitions and no
   keyframes on `backdrop-filter` (+ -webkit-), `filter`, `--_ag-blur` or layout
   properties (`left`, `top`, `right`, `bottom`, `width`, `height`, `margin*`,
   `padding*`, `inset*`). Transitions on `all` are reported too: `all` includes
   every one of those properties.
   Checked: `transition` / `transition-property` (+ -webkit-/-moz-) items, and
   every declaration inside an @keyframes block. */
import stylelint from 'stylelint';
import { inKeyframes, splitTopLevel } from './_util.mjs';

export const ruleName = 'auraglass/perf-no-expensive-transition';
const messages = stylelint.utils.ruleMessages(ruleName, {
  transition: (prop) => `Transition on '${prop}' is banned — animate opacity/transform only, never filters, --_ag-blur or layout (REQ-QUAL-44).`,
  keyframes: (prop) => `@keyframes animates '${prop}' — filters, --_ag-blur and layout properties are never animated (REQ-QUAL-44).`,
});

const EXACT = new Set(['backdrop-filter', '-webkit-backdrop-filter', 'filter', '-webkit-filter', '--_ag-blur', 'left', 'top', 'right', 'bottom', 'width', 'height']);
const PREFIX = /^(margin|padding|inset)(-|$)/;
export const isBannedProp = (p) => {
  const prop = p.trim().toLowerCase();
  return EXACT.has(prop) || PREFIX.test(prop);
};

const TRANSITION_PROPS = new Set(['transition', '-webkit-transition', '-moz-transition', 'transition-property', '-webkit-transition-property', '-moz-transition-property']);
const NON_PROPERTY = /^(ease|ease-in|ease-out|ease-in-out|linear|step-start|step-end|normal|allow-discrete|initial|inherit|unset|revert|none)$/i;
const TIME = /^[-+]?\d*\.?\d+(ms|s)$/i;

/** The transitioned property of one `transition` shorthand item, or null. */
export function shorthandProperty(item) {
  for (const tok of splitTopLevel(item, ' ')) {
    if (TIME.test(tok) || NON_PROPERTY.test(tok) || /\(/.test(tok)) continue;
    return tok;
  }
  return null;
}

const ruleFunction = (primary) => (root, result) => {
  if (!primary) return;
  root.walkDecls((decl) => {
    const prop = decl.prop.toLowerCase();
    if (inKeyframes(decl)) {
      if (isBannedProp(prop)) stylelint.utils.report({ ruleName, result, node: decl, message: messages.keyframes(decl.prop) });
      return;
    }
    if (!TRANSITION_PROPS.has(prop)) return;
    const longhand = prop.endsWith('-property');
    for (const item of splitTopLevel(decl.value, ',')) {
      const p = longhand ? item.trim() : shorthandProperty(item);
      if (!p || /^var\(/i.test(p)) continue;
      if (p.toLowerCase() === 'all' || isBannedProp(p)) {
        stylelint.utils.report({ ruleName, result, node: decl, message: messages.transition(p), word: p });
      }
    }
  });
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = { url: 'https://github.com/auraoneai/auraglass/blob/next/docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md' };

export default stylelint.createPlugin(ruleName, ruleFunction);
