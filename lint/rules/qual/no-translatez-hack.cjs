/* auraglass/no-translatez-hack (REQ-QUAL-45, S-47). Layer-forcing hacks
   (`translateZ(0)`, `translate3d(0,0,0)`, `backface-visibility: hidden`) make
   permanent compositor layers, multiply GPU memory per surface and can turn
   a glass host into a backdrop root. Reported in JS/TSX:
     - any string/template whose text contains translateZ(0) / translateZ(0px)
       or translate3d(0,0,0) (any spacing / units / zero spelling)
     - style objects: { backfaceVisibility: 'hidden' } (+ WebkitBackfaceVisibility)
     - DOM writes: el.style.backfaceVisibility = 'hidden',
       setProperty('backface-visibility' | '-webkit-backface-visibility', 'hidden')
     - CSS text: `backface-visibility: hidden` in a string/template. */
'use strict';
const { agConfigFor, keyName, memberName, staticText } = require('./_shared.cjs');

const ZERO = String.raw`\s*[-+]?0*\.?0+(?:px|em|rem|%)?\s*`;
const TRANSLATE_HACK = new RegExp(String.raw`translateZ\(${ZERO}\)|translate3d\(${ZERO},${ZERO},${ZERO}\)`, 'i');
const BACKFACE_KEYS = new Set(['backfaceVisibility', 'WebkitBackfaceVisibility', 'backface-visibility', '-webkit-backface-visibility']);
const BACKFACE_CSS = /(?:^|[\s{;"'`])(?:-webkit-)?backface-visibility\s*:\s*hidden\b/i;

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'ban translateZ(0) / translate3d(0,0,0) / backface-visibility: hidden layer hacks (REQ-QUAL-45)' },
    schema: [],
    messages: {
      translate: '`{{found}}` is a layer-forcing hack — it creates a permanent compositor layer; remove it (REQ-QUAL-45).',
      backface: '`backface-visibility: hidden` is a layer-forcing hack outside a real 3D flip — remove it (REQ-QUAL-45).',
    },
  },
  create(context) {
    const reported = new WeakSet();
    const report = (node, messageId, data = {}) => {
      if (reported.has(node)) return;
      reported.add(node);
      context.report({ node, messageId, data });
    };
    const checkText = (node) => {
      const text = staticText(node);
      if (text == null) return;
      const m = text.match(TRANSLATE_HACK);
      if (m) return report(node, 'translate', { found: m[0] });
      if (BACKFACE_CSS.test(text)) report(node, 'backface');
    };
    const isHidden = (v) => {
      const t = staticText(v);
      return typeof t === 'string' && t.trim().toLowerCase() === 'hidden';
    };
    return {
      Literal: checkText,
      TemplateLiteral: checkText,
      Property(node) {
        const name = keyName(node);
        if (name && BACKFACE_KEYS.has(name) && isHidden(node.value)) report(node.value, 'backface');
      },
      AssignmentExpression(node) {
        const name = memberName(node.left);
        if (name && BACKFACE_KEYS.has(name) && isHidden(node.right)) report(node.right, 'backface');
      },
      CallExpression(node) {
        if (memberName(node.callee) !== 'setProperty') return;
        const prop = staticText(node.arguments[0]);
        if (prop && BACKFACE_KEYS.has(prop.toLowerCase()) && isHidden(node.arguments[1])) report(node.arguments[1], 'backface');
      },
    };
  },
  agConfig: agConfigFor('no-translatez-hack'),
};
