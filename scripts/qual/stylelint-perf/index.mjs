/* scripts/qual/stylelint-perf/index.mjs — QUAL CSS perf stylelint plugins
   (REQ-QUAL-44, REQ-FIN-105, FIN-446). Used by scripts/qual/verify-css-perf.mjs;
   `config` is a complete stylelint config enabling all five rules. */
import backdropBlurRadius, { ruleName as blurRule } from './backdrop-blur-radius.mjs';
import backdropFilterShape, { ruleName as shapeRule } from './backdrop-filter-shape.mjs';
import noLayerHack, { ruleName as hackRule } from './no-layer-hack.mjs';
import willChangeScope, { ruleName as willChangeRule } from './will-change-scope.mjs';
import noExpensiveTransition, { ruleName as transitionRule } from './no-expensive-transition.mjs';

export const plugins = [backdropBlurRadius, backdropFilterShape, noLayerHack, willChangeScope, noExpensiveTransition];
export const ruleNames = [blurRule, shapeRule, hackRule, willChangeRule, transitionRule];
export const config = {
  plugins,
  rules: Object.fromEntries(ruleNames.map((r) => [r, true])),
};
export default plugins;
