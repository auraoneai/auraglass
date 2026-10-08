/* REQ-PLAT-69: useState(() => <dom read>) runs the initialiser during the
   server render too — reading window/document/matchMedia there is a hydration
   mismatch. Lazy initialisers must be DOM-free. */
const DOM_GLOBALS = new Set(['window', 'document', 'navigator', 'localStorage', 'sessionStorage', 'matchMedia', 'customElements', 'HTMLElement']);

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'forbid DOM globals inside useState lazy initialisers' },
    messages: { dom: 'useState lazy initialiser reads {{what}} — it also runs during the server render.' },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type !== 'Identifier' || node.callee.name !== 'useState') return;
        const init = node.arguments?.[0];
        if (!init || (init.type !== 'ArrowFunctionExpression' && init.type !== 'FunctionExpression')) return;
        context.sourceCode.getScope(init).through // references that resolve outside the init fn
          .forEach((ref) => {
            if (DOM_GLOBALS.has(ref.identifier.name) && !ref.resolved) {
              context.report({ node: ref.identifier, messageId: 'dom', data: { what: ref.identifier.name } });
            }
          });
      },
    };
  },
  agConfig: [{ files: ['src/**/*.{ts,tsx}'], ignores: ['**/__tests__/**', '**/*.test.*'], severity: 'error' }],
};
