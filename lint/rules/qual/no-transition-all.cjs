/* auraglass/no-transition-all (REQ-QUAL-45, S-47; adopts the rule trimmed from
   PR #322). `transition: all` / `transition-property: all` animates every
   property, including layout and filter properties, and promotes work the
   compositor cannot skip. Reported in JS/TSX:
     - style objects:   { transition: 'all 200ms' }, { transitionProperty: 'all' }
                        (also WebkitTransition / MozTransition / msTransition)
     - DOM writes:      el.style.transition = 'all 1s', el.style.transitionProperty = 'all'
     - setProperty:     el.style.setProperty('transition', 'all 1s')
     - CSS text:        any string/template containing `transition: … all …`
                        or `transition-property: … all …` (css``, innerHTML, cssText). */
'use strict';
const { agConfigFor, keyName, memberName, staticText } = require('./_shared.cjs');

const STYLE_KEYS = new Set([
  'transition', 'transitionProperty',
  'WebkitTransition', 'MozTransition', 'msTransition', 'OTransition',
  'WebkitTransitionProperty', 'MozTransitionProperty',
]);
const CSS_PROPS = new Set(['transition', 'transition-property', '-webkit-transition', '-webkit-transition-property', '-moz-transition']);
// `all` as a whole word in a transition value (not `small`, not `--all-x`).
const ALL_WORD = /(^|[\s,])all(?=$|[\s,;])/i;
// CSS-text form: `transition[-property]: <value up to ; } or end>`.
const CSS_TEXT = /(?:^|[\s{;"'`])(-webkit-|-moz-)?transition(-property)?\s*:\s*([^;}]*)/gi;

function valueHasAll(text) {
  if (typeof text !== 'string') return false;
  return ALL_WORD.test(text.replace(/\u0000/g, ' x ').trim());
}

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'ban `transition: all` in style objects, DOM style writes and CSS text (REQ-QUAL-45)' },
    schema: [],
    messages: {
      all: "`{{prop}}: all` transitions every property (layout, filter, backdrop-filter) — list the exact compositor-safe properties instead (REQ-QUAL-45).",
    },
  },
  create(context) {
    const reported = new WeakSet();
    const report = (node, prop) => {
      if (reported.has(node)) return;
      reported.add(node);
      context.report({ node, messageId: 'all', data: { prop } });
    };
    const checkCssText = (node) => {
      const text = staticText(node);
      if (text == null || !/transition/i.test(text)) return;
      for (const m of text.matchAll(CSS_TEXT)) {
        if (valueHasAll(m[3])) {
          report(node, `${m[1] ?? ''}transition${m[2] ?? ''}`);
          return;
        }
      }
    };
    return {
      Property(node) {
        const name = keyName(node);
        if (!name) return;
        if (STYLE_KEYS.has(name) || CSS_PROPS.has(name)) {
          const text = staticText(node.value);
          if (valueHasAll(text)) report(node.value, name);
        }
      },
      AssignmentExpression(node) {
        const name = memberName(node.left);
        if (!name || !STYLE_KEYS.has(name)) return;
        const text = staticText(node.right);
        if (valueHasAll(text)) report(node.right, name);
      },
      CallExpression(node) {
        if (memberName(node.callee) !== 'setProperty') return;
        const [p, v] = node.arguments;
        const prop = staticText(p);
        if (prop && CSS_PROPS.has(prop.toLowerCase()) && valueHasAll(staticText(v))) report(v, prop);
      },
      Literal: checkCssText,
      TemplateLiteral: checkCssText,
    };
  },
  agConfig: agConfigFor('no-transition-all'),
};
