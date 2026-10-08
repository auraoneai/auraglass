/* REQ-PLAT-69: nondeterminism during render breaks hydration. Forbid
   Math.random, Date.now(), new Date(), and crypto.randomUUID evaluated in the
   render path — i.e. reachable from a component body without crossing a
   callback boundary (event handlers and effect callbacks are allowed). */
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
    if (p.type === 'CallExpression' && p.callee.type === 'Identifier' && ALLOWED_CALLBACK.test(p.callee.name)) return true;
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
  agConfig: [{ files: ['src/**/*.{ts,tsx}'], ignores: ['**/__tests__/**', '**/*.test.*', '**/*.stories.*'], severity: 'error' }],
};
