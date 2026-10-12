/* REQ-PLAT-69: nondeterminism during render breaks hydration. Forbid
   Math.random, Date.now(), new Date(), and crypto.randomUUID evaluated in the
   render path — i.e. reachable from a component body without crossing a
   callback boundary (event handlers and effect callbacks are allowed). */
// REQ-PLAT-69 rollout: warn outside PLAT globs until RC-1 (PLAT globs: _strict.cjs).
const { rolloutSeverity } = require('./_rollout.cjs');
const BANNED = /^(Math\.random|Date\.now|crypto\.randomUUID)$/;
const ALLOWED_CALLBACK = /^(on[A-Z]|handle[A-Z]|use(Effect|LayoutEffect|InsertionEffect|Memo|Callback|ImperativeHandle|SyncExternalStore))/;

const calleeName = (node) => {
  const c = node.callee;
  if (c.type === 'Identifier') return c.name;
  if (c.type === 'MemberExpression' && !c.computed && c.property.type === 'Identifier' && c.object.type === 'Identifier') return `${c.object.name}.${c.property.name}`;
  return null;
};

const enclosingCallbackAllows = (node) => {
  let p = node.parent;
  while (p) {
    if (p.type === 'CallExpression') {
      // `useEffect(...)` and the namespaced `React.useEffect(...)` alike.
      const c = p.callee;
      const hook = c.type === 'Identifier' ? c.name
        : c.type === 'MemberExpression' && !c.computed && c.object.type === 'Identifier' && c.object.name === 'React' && c.property.type === 'Identifier' ? c.property.name
        : null;
      if (hook && ALLOWED_CALLBACK.test(hook)) return true;
    }
    if (p.type === 'JSXAttribute' && /^on[A-Z]/.test(p.name?.name ?? '')) return true;
    if (p.type === 'VariableDeclarator' && p.id.type === 'Identifier' && ALLOWED_CALLBACK.test(p.id.name)) return true;
    p = p.parent;
  }
  return false;
};

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'forbid nondeterministic calls during render' },
    messages: { random: '{{what}} may not be evaluated during render — it breaks hydration determinism.' },
    schema: [],
  },
  create(context) {
    const check = (node, what) => {
      if (!enclosingCallbackAllows(node)) context.report({ node, messageId: 'random', data: { what } });
    };
    return {
      CallExpression(node) {
        const name = calleeName(node);
        if (name && BANNED.test(name)) check(node, `${name}()`);
      },
      NewExpression(node) {
        if (node.callee.type === 'Identifier' && node.callee.name === 'Date' && (node.arguments ?? []).length === 0) check(node, 'new Date()');
      },
    };
  },
  agConfig: [{ files: ['src/**/*.{ts,tsx}'], ignores: ['**/__tests__/**', '**/*.test.*', '**/*.stories.*'], severity: rolloutSeverity() }],
};
