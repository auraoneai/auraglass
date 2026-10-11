/* auraglass/perf-will-change-scope (REQ-QUAL-44). `will-change` (other than
   `auto`) is allowed only in rules scoped to a transient animation state:
   `[data-ag-animating]`, `[data-starting-style]` or `[data-ending-style]`.
   With a selector list, every listed selector must carry the scope (or an
   ancestor rule must, for nested CSS). Anywhere else the compositor layer is
   permanent. */
import stylelint from 'stylelint';
import { selectorChain, splitTopLevel } from './_util.mjs';

export const ruleName = 'auraglass/perf-will-change-scope';
export const SCOPE_RE = /\[\s*data-ag-animating\s*(?:[~|^$*]?=[^\]]*)?\]|\[\s*data-starting-style\s*(?:[~|^$*]?=[^\]]*)?\]|\[\s*data-ending-style\s*(?:[~|^$*]?=[^\]]*)?\]/;
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (value, selector) =>
    `will-change: ${value} outside [data-ag-animating] / [data-starting-style] / [data-ending-style] (selector '${selector}') keeps a layer alive permanently (REQ-QUAL-44).`,
});

const RESET = /^(auto|initial|unset|revert|revert-layer)$/i;

const ruleFunction = (primary) => (root, result) => {
  if (!primary) return;
  root.walkDecls((decl) => {
    if (decl.prop.toLowerCase() !== 'will-change') return;
    if (RESET.test(decl.value.trim())) return;
    const [own = '', ...ancestors] = selectorChain(decl);
    if (ancestors.some((s) => SCOPE_RE.test(s))) return;
    const parts = own ? splitTopLevel(own, ',') : [];
    const unscoped = parts.length === 0 ? ['(no selector)'] : parts.filter((p) => !SCOPE_RE.test(p));
    if (unscoped.length) {
      stylelint.utils.report({ ruleName, result, node: decl, message: messages.rejected(decl.value.trim(), unscoped[0]) });
    }
  });
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = { url: 'https://github.com/auraoneai/auraglass/blob/next/docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md' };

export default stylelint.createPlugin(ruleName, ruleFunction);
