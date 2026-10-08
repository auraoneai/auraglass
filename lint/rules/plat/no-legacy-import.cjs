/* REQ-PLAT-69: 4.x-era specifiers never appear in 5.0 src/** — the removed
   subpaths (aura-glass/components, /styles, /index), compat internals, and
   4.x package aliases. New code imports the §4 subpaths. */
const LEGACY = /^aura-glass\/(components|styles|index|legacy|internal|v4)(\/|$)|^@ag\/|^ag-legacy|\/legacy\//;

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'forbid legacy 4.x import specifiers in src/**' },
    messages: { legacy: "'{{spec}}' is a 4.x-era specifier — use the §4 module path for this stream instead." },
    schema: [],
  },
  create(context) {
    if (!/(^|[/\\])src[/\\]/.test(context.filename ?? '')) return {};
    const check = (node, spec) => {
      if (typeof spec === 'string' && LEGACY.test(spec)) {
        context.report({ node, messageId: 'legacy', data: { spec } });
      }
    };
    return {
      ImportDeclaration: (n) => check(n.source, n.source.value),
      ExportNamedDeclaration: (n) => n.source && check(n.source, n.source.value),
      ExportAllDeclaration: (n) => check(n.source, n.source.value),
      ImportExpression: (n) => n.source.type === 'Literal' && check(n.source, n.source.value),
    };
  },
  agConfig: [{ files: ['src/**/*.{ts,tsx}'], severity: 'error' }],
};
