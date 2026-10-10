/* REQ-PLAT-69: a 'use client' directive on a module that reads no client
   signal is needless cost — it pulls the module (and its importers' graph)
   into the client bundle. */
const CLIENT_HOOKS = /^(use(State|Effect|LayoutEffect|Ref|Reducer|Context|Memo|Callback|Id|ImperativeHandle|SyncExternalStore|Transition|ActionState|Optimistic|FormStatus)|use[A-Z][A-Za-z]*Effect)$/;
const DOM_GLOBALS = new Set(['window', 'document', 'navigator', 'localStorage', 'sessionStorage', 'customElements', 'HTMLElement', 'matchMedia']);

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: "forbid 'use client' where no client signal is used" },
    messages: { needless: "'use client' is needless: no client-only signal is used in this module." },
    schema: [],
  },
  create(context) {
    const sourceCode = context.sourceCode;
    const directive = sourceCode.ast.body.find(
      (n) => n.type === 'ExpressionStatement' && n.directive === 'use client',
    );
    if (!directive) return {};
    let clientSignal = false;
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
        const c = node.callee;
        const name = c.type === 'Identifier' ? c.name
          : (c.type === 'MemberExpression' && c.property.type === 'Identifier' ? c.property.name : null);
        if (name && CLIENT_HOOKS.test(name) && !insideEffect(node)) clientSignal = true;
      },
      Identifier(node) {
        if (DOM_GLOBALS.has(node.name) && !insideEffect(node)) clientSignal = true;
      },
      JSXAttribute(node) {
        if (/^on[A-Z]/.test(node.name.name ?? '')) clientSignal = true;
      },
      'Program:exit'() {
        if (!clientSignal) context.report({ node: directive, messageId: 'needless' });
      },
    };
  },
  agConfig: [{ files: ['src/**/*.{ts,tsx}'], ignores: ['**/__tests__/**', '**/*.test.*'], severity: 'error' }],
};
