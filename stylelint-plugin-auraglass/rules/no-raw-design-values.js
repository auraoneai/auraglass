/* auraglass/no-raw-design-values (stylelint) — same literal set as the ESLint rule
   (MAT-058): raw colors, blur px, radius px, shadows, ms/s, cubic-bezier, linear(). */
import stylelint from 'stylelint';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { scanDecl, isExempt } = require('../../lint/rules/mat/_literals.cjs');

const ruleName = 'auraglass/no-raw-design-values';
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (category, literal) =>
    `Raw ${category} value '${literal}' — use the token (var(--ag-*)) or generated output instead.`,
});
const meta = { url: 'https://github.com/auraoneai/auraglass' };

const ruleFunction = (primary) => (root, result) => {
  if (!primary) return;
  const file = root.source?.input?.file ?? '';
  if (isExempt(file)) return;
  root.walkDecls((decl) => {
    for (const hit of scanDecl(decl.prop, decl.value, file)) {
      stylelint.utils.report({
        ruleName,
        result,
        node: decl,
        message: messages.rejected(hit.category, hit.literal),
        word: hit.literal,
      });
    }
  });
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default stylelint.createPlugin(ruleName, ruleFunction);
