/* REQ-PLAT-69: any module that reads a client signal must start its file with
   the 'use client' directive. Signal list = state/effect/ref hooks, event
   handler props in JSX, and DOM globals used at module scope or inside a
   component. */
const CLIENT_HOOKS = /^(use(State|Effect|LayoutEffect|Ref|Reducer|Context|Memo|Callback|Id|ImperativeHandle|SyncExternalStore|Transition|ActionState|Optimistic|FormStatus)|use[A-Z][A-Za-z]*Effect)$/;
const DOM_GLOBALS = new Set(['window', 'document', 'navigator', 'localStorage', 'sessionStorage', 'customElements', 'HTMLElement', 'matchMedia']);

const hasClientDirective = (sourceCode) =>
  sourceCode.ast.body.some((n) => n.type === 'ExpressionStatement' && n.directive === 'use client');

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: "require 'use client' when a module uses client-only signals" },
    messages: { required: "Module uses a client-only signal ({{what}}) but does not open with 'use client'." },
    schema: [],
  },
  create(context) {
    const sourceCode = context.sourceCode;
    if (/\.d\.ts$|\.test\.|\.spec\.|\.stories\.|\/__tests__\//.test(context.filename ?? '')) return {};
    let found = null;
    const insideEffect = (node) => {
      let p = node.parent;
      while (p) {
        if (p.type === 'CallExpression' && p.callee.type === 'Identifier' && /^(use(Effect|LayoutEffect|InsertionEffect|ImperativeHandle))$/.test(p.callee.name)) return true;
        p = p.parent;
      }
      return false;
    };
    return {
      CallExpression(node) {
        if (found) return;
        if (node.callee.type === 'Identifier' && CLIENT_HOOKS.test(node.callee.name) && !insideEffect(node)) found = `call to ${node.callee.name}()`;
      },
      Identifier(node) {
        if (found) return;
        if (DOM_GLOBALS.has(node.name) && !insideEffect(node)) found = `reference to ${node.name}`;
      },
      JSXAttribute(node) {
        if (found) return;
        if (/^on[A-Z]/.test(node.name.name ?? '')) found = `JSX event prop ${node.name.name}`;
      },
      'Program:exit'() {
        if (found && !hasClientDirective(sourceCode)) {
          context.report({ node: sourceCode.ast, messageId: 'required', data: { what: found } });
        }
      },
    };
  },
  agConfig: [{ files: ['src/**/*.{ts,tsx}'], ignores: ['**/__tests__/**', '**/*.test.*', '**/*.stories.*'], severity: 'error' }],
};
