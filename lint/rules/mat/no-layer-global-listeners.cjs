/* auraglass/no-layer-global-listeners (REQ-FIN-07 / S-25): inside the layering
   and focus plumbing, document/window event listeners and document.body.style
   writes are forbidden — input arrives through src/theme/layerInput.ts (the
   single per-document dispatcher) and outside-pointer blocking through the
   LayerStack's inert pass (pointerLockOutside), never body.style. */
'use strict';

const GLOBALS = new Set(['document', 'window']);
const TARGET = /(?:^|[/\\])src[/\\](?:primitives|foundation)[/\\]|(?:^|[/\\])src[/\\]theme[/\\]layers[/\\]/;
const EXEMPT = /(?:^|[/\\])__tests__[/\\]|[.]test[.]|(?:^|[/\\])tests[/\\]/;

const isGlobal = (n) => n && n.type === 'Identifier' && GLOBALS.has(n.name);

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'ban document/window listeners and body.style in layering dirs (subscribe to src/theme/layerInput)' },
    schema: [],
    messages: {
      listener: 'use layerInputFor(document).on(...) — private document/window listeners are forbidden in layering/focus plumbing (REQ-FIN-07).',
      bodyStyle: 'document.body.style writes are forbidden — use the LayerStack pointerLockOutside inert pass (REQ-FIN-07).',
    },
  },
  create(context) {
    const file = context.filename ?? context.getFilename?.() ?? '';
    if (!TARGET.test(file) || EXEMPT.test(file)) return {};
    return {
      CallExpression(node) {
        const c = node.callee;
        if (c?.type !== 'MemberExpression' || c.computed) return;
        if (c.property?.name !== 'addEventListener' && c.property?.name !== 'removeEventListener') return;
        if (!isGlobal(c.object)) return;
        context.report({ node: c, messageId: 'listener' });
      },
      AssignmentExpression(node) {
        let chain = node.left;
        const props = [];
        while (chain?.type === 'MemberExpression') {
          if (!chain.computed && chain.property.type === 'Identifier') props.unshift(chain.property.name);
          chain = chain.object;
        }
        if (!isGlobal(chain) || props[0] !== 'body' || props[1] !== 'style' || props.length < 3) return;
        context.report({ node: node.left, messageId: 'bodyStyle', data: { prop: props.slice(2).join('.') } });
      },
    };
  },
  agConfig: [],
};
