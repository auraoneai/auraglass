/* REQ-PLAT-69: a 'use client' directive on a module that reads no client
   signal is needless cost — it pulls the module (and its importers' graph)
   into the client bundle. */
// REQ-PLAT-69 rollout: warn outside PLAT globs until RC-1 (PLAT globs: _strict.cjs).
const { rolloutSeverity } = require('./_rollout.cjs');
const CLIENT_HOOKS = /^(use(State|Effect|LayoutEffect|Ref|Reducer|Context|Memo|Callback|Id|ImperativeHandle|SyncExternalStore|Transition|ActionState|Optimistic|FormStatus)|use[A-Z][A-Za-z]*Effect)$/;
const DOM_GLOBALS = new Set(['window', 'document', 'navigator', 'localStorage', 'sessionStorage', 'customElements', 'HTMLElement', 'matchMedia']);

// Type positions are erased; they are not client signals (mirrors use-client-required).
const TYPE_CONTEXT = /^TS(TypeAnnotation|TypeReference|TypeQuery|InterfaceDeclaration|TypeAliasDeclaration|TypeParameterInstantiation|TypeParameterDeclaration|QualifiedName|InterfaceHeritage|ClassImplements)$/;
const inTypePosition = (node) => {
  for (let p = node.parent; p; p = p.parent) if (TYPE_CONTEXT.test(p.type)) return true;
  return false;
};
// REQ-PLAT-69 signal list also covers `React.useX()` member calls, any custom
// `use[A-Z]` hook call (hooks from client modules), createContext, and value
// imports of `@base-ui/react/*` (client-only primitives).
const calleeName = (callee) =>
  callee.type === 'Identifier' ? callee.name
    : callee.type === 'MemberExpression' && !callee.computed && callee.property.type === 'Identifier' ? callee.property.name
    : null;
const ANY_HOOK = /^(use[A-Z]\w*|createContext)$/;
const BASE_UI = /^@base-ui\/react(\/|$)/;

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
        const name = calleeName(node.callee);
        if (name && (CLIENT_HOOKS.test(name) || ANY_HOOK.test(name)) && !insideEffect(node)) clientSignal = true;
      },
      ImportDeclaration(node) {
        if (node.importKind !== 'type' && BASE_UI.test(String(node.source.value))) clientSignal = true;
      },
      Identifier(node) {
        if (DOM_GLOBALS.has(node.name) && !insideEffect(node) && !inTypePosition(node)) clientSignal = true;
      },
      JSXAttribute(node) {
        if (/^on[A-Z]/.test(node.name.name ?? '')) clientSignal = true;
      },
      'Program:exit'() {
        if (!clientSignal) context.report({ node: directive, messageId: 'needless' });
      },
    };
  },
  agConfig: [{ files: ['src/**/*.{ts,tsx}'], ignores: ['**/__tests__/**', '**/*.test.*'], severity: rolloutSeverity() }],
};
