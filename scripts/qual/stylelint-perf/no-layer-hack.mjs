/* auraglass/perf-no-layer-hack (REQ-QUAL-44). Bans the layer-forcing hacks
   `translateZ(0)`, `translate3d(0,0,0)` (any zero spelling/unit) and
   `backface-visibility: hidden` (+ -webkit-) in any declaration, including
   keyframes. They create permanent compositor layers and can make a glass
   host a backdrop root. */
import stylelint from 'stylelint';
import { allFunctions, splitTopLevel } from './_util.mjs';

export const ruleName = 'auraglass/perf-no-layer-hack';
const messages = stylelint.utils.ruleMessages(ruleName, {
  translate: (fn) => `'${fn}' is a layer-forcing hack — remove it (REQ-QUAL-44).`,
  backface: () => '`backface-visibility: hidden` is a layer-forcing hack — remove it (REQ-QUAL-44).',
});

const isZero = (arg) => /^[-+]?0*\.?0+(px|em|rem|%)?$/i.test(arg.trim());

const ruleFunction = (primary) => (root, result) => {
  if (!primary) return;
  root.walkDecls((decl) => {
    const prop = decl.prop.toLowerCase();
    if ((prop === 'backface-visibility' || prop === '-webkit-backface-visibility') && decl.value.trim().toLowerCase() === 'hidden') {
      stylelint.utils.report({ ruleName, result, node: decl, message: messages.backface() });
      return;
    }
    for (const f of allFunctions(decl.value)) {
      const args = splitTopLevel(f.args, ',');
      const hack = (f.name === 'translatez' && args.length === 1 && isZero(args[0]))
        || (f.name === 'translate3d' && args.length === 3 && args.every(isZero));
      if (hack) {
        stylelint.utils.report({ ruleName, result, node: decl, message: messages.translate(`${f.name === 'translatez' ? 'translateZ' : 'translate3d'}(${f.args})`), word: f.args });
        return;
      }
    }
  });
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = { url: 'https://github.com/auraoneai/auraglass/blob/next/docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md' };

export default stylelint.createPlugin(ruleName, ruleFunction);
