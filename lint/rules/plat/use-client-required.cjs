/* REQ-PLAT-69: any module that reads a client signal must start its file with
   the 'use client' directive. Signal list = state/effect/ref hooks, event
   handler props in JSX, and DOM globals used at module scope or inside a
   component. */
const CLIENT_HOOKS = /^(use(State|Effect|LayoutEffect|Ref|Reducer|Context|Memo|Callback|Id|ImperativeHandle|SyncExternalStore|Transition|ActionState|Optimistic|FormStatus)|use[A-Z][A-Za-z]*Effect)$/;
const DOM_GLOBALS = new Set(['window', 'document', 'navigator', 'localStorage', 'sessionStorage', 'customElements', 'HTMLElement', 'matchMedia']);

// TypeScript type positions are erased at compile time: `ref?: React.Ref<HTMLElement>`
// or `interface P { el: HTMLElement }` reads no client signal at runtime.
const TYPE_CONTEXT = /^TS(TypeAnnotation|TypeReference|TypeQuery|InterfaceDeclaration|TypeAliasDeclaration|TypeParameterInstantiation|TypeParameterDeclaration|QualifiedName|InterfaceHeritage|ClassImplements)$/;
const inTypePosition = (node) => {
  for (let p = node.parent; p; p = p.parent) if (TYPE_CONTEXT.test(p.type)) return true;
  return false;
};
// `React.useState()` is the same signal as `useState()`; createContext is a
// client signal too (REQ-PLAT-69 list). A Base UI import alone is not: each
// @base-ui/react module carries its own 'use client', so a server module may
// render it (src/components/chip/ChipToggle.tsx, Separator.tsx).
const calleeName = (callee) =>
  callee.type === 'Identifier' ? callee.name
    : callee.type === 'MemberExpression' && !callee.computed && callee.object.type === 'Identifier' && callee.object.name === 'React' && callee.property.type === 'Identifier' ? callee.property.name
    : null;

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
        if (p.type === 'CallExpression' && /^(use(Effect|LayoutEffect|InsertionEffect|ImperativeHandle))$/.test(calleeName(p.callee) ?? '')) return true;
        p = p.parent;
      }
      return false;
    };
    /* REQ-PLAT-69 "a function passed to an on[A-Z] JSX prop": an inline
       function, or an identifier bound to a function created in this module.
       Forwarding a caller's prop (`onLoadMore={onLoadMore}`, `onClick={a.onPress}`)
       creates no function here — a server module may forward a Server Action. */
    const isModuleFunction = (expr, at) => {
      if (!expr) return false;
      if (expr.type === 'ArrowFunctionExpression' || expr.type === 'FunctionExpression') return true;
      if (expr.type !== 'Identifier') return false;
      for (let scope = sourceCode.getScope(at); scope; scope = scope.upper) {
        const v = scope.set.get(expr.name);
        if (!v) continue;
        return v.defs.some((d) => d.type === 'FunctionName'
          || (d.type === 'Variable' && d.node.init && /^(ArrowFunctionExpression|FunctionExpression)$/.test(d.node.init.type)));
      }
      return false;
    };
    return {
      CallExpression(node) {
        if (found) return;
        const name = calleeName(node.callee);
        if (name && (CLIENT_HOOKS.test(name) || name === 'createContext') && !insideEffect(node)) found = `call to ${name}()`;
      },
      Identifier(node) {
        if (found) return;
        if (DOM_GLOBALS.has(node.name) && !insideEffect(node) && !inTypePosition(node)) found = `reference to ${node.name}`;
      },
      JSXAttribute(node) {
        if (found) return;
        if (/^on[A-Z]/.test(node.name.name ?? '') && node.value?.type === 'JSXExpressionContainer'
          && isModuleFunction(node.value.expression, node)) found = `JSX event prop ${node.name.name}`;
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
