/* auraglass/no-global-pointer-listener (REQ-QUAL-45, S-47). Global
   high-frequency listeners (`mousemove`, `pointermove`, `scroll`,
   `deviceorientation` on window/document) run on every frame for every
   mounted instance. Only the motion seam (src/motion/**, S-13) may install
   them; components subscribe through it. Reported outside src/motion/**:
     - window|document|globalThis|self|document.body|document.documentElement
       .addEventListener('<event>', …)
     - window.on<event> = … / document.on<event> = …
   The event may be a string literal or a static template literal. */
'use strict';
const { agConfigFor, memberName, relFile, staticText } = require('./_shared.cjs');

const EVENTS = new Set(['mousemove', 'pointermove', 'scroll', 'deviceorientation']);
const HANDLERS = new Set([...EVENTS].map((e) => `on${e}`));
const ROOTS = new Set(['window', 'document', 'globalThis', 'self']);
const ALLOWED = /^src\/motion\//;

function isGlobalTarget(node) {
  if (!node) return false;
  if (node.type === 'Identifier') return ROOTS.has(node.name);
  // document.body / document.documentElement / window.document
  if (node.type === 'MemberExpression' && !node.computed && node.object.type === 'Identifier') {
    const p = memberName(node);
    if (node.object.name === 'document' && (p === 'body' || p === 'documentElement')) return true;
    if ((node.object.name === 'window' || node.object.name === 'globalThis') && p === 'document') return true;
  }
  return false;
}

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'ban global mousemove/pointermove/scroll/deviceorientation listeners outside src/motion/** (REQ-QUAL-45)' },
    schema: [],
    messages: {
      listener: "Global '{{event}}' listener on {{target}} — subscribe through the motion seam (src/motion/**, S-13) instead (REQ-QUAL-45).",
    },
  },
  create(context) {
    if (ALLOWED.test(relFile(context))) return {};
    const src = context.sourceCode;
    return {
      CallExpression(node) {
        const c = node.callee;
        if (c.type !== 'MemberExpression' || memberName(c) !== 'addEventListener') return;
        if (!isGlobalTarget(c.object)) return;
        const event = staticText(node.arguments[0]);
        if (event && EVENTS.has(event.toLowerCase())) {
          context.report({ node, messageId: 'listener', data: { event, target: src.getText(c.object) } });
        }
      },
      AssignmentExpression(node) {
        const name = memberName(node.left);
        if (!name || !HANDLERS.has(name.toLowerCase())) return;
        if (!isGlobalTarget(node.left.object)) return;
        context.report({ node, messageId: 'listener', data: { event: name.slice(2), target: src.getText(node.left.object) } });
      },
    };
  },
  agConfig: agConfigFor('no-global-pointer-listener', { extraIgnores: ['src/motion/**'] }),
};
