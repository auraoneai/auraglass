/* no-cn-outside-internal (REQ-PLAT-26): `cn` exists only in src/internal/cn.ts.
   Forbids, anywhere in src/ except src/internal/cn.ts:
   - importing or re-exporting clsx / tailwind-merge / classnames
     (`import … from`, `export … from`, `import()`, `require()`);
   - defining a binding named `cn` (`const|let|var cn`, `function cn`).
   Consumers import `cn` from src/internal (barrel) or src/internal/cn. */
const CLASS_MODULES = new Set(['clsx', 'tailwind-merge', 'classnames']);
const CN_FILE = /src[/\\]internal[/\\]cn\.tsx?$/;

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'cn only in src/internal/cn.ts' },
    messages: {
      import: "'{{mod}}' may only be imported inside src/internal/cn.ts — import { cn } from src/internal.",
      define: '`cn` may only be defined in src/internal/cn.ts.',
    },
    schema: [],
  },
  agConfig: [{ files: ['src/**/*.{ts,tsx}'], ignores: ['src/internal/cn.ts'], severity: 'error' }],
  create(context) {
    if (CN_FILE.test(context.filename ?? context.getFilename?.() ?? '')) return {};
    const checkSource = (node, source) => {
      const mod = source && source.type === 'Literal' ? source.value : null;
      if (typeof mod === 'string' && CLASS_MODULES.has(mod)) {
        context.report({ node, messageId: 'import', data: { mod } });
      }
    };
    return {
      ImportDeclaration(node) { checkSource(node, node.source); },
      ExportNamedDeclaration(node) { if (node.source) checkSource(node, node.source); },
      ExportAllDeclaration(node) { checkSource(node, node.source); },
      ImportExpression(node) { checkSource(node, node.source); },
      CallExpression(node) {
        if (node.callee.type === 'Identifier' && node.callee.name === 'require' && node.arguments.length === 1) {
          checkSource(node, node.arguments[0]);
        }
      },
      VariableDeclarator(node) {
        if (node.id?.type === 'Identifier' && node.id.name === 'cn') context.report({ node, messageId: 'define' });
      },
      FunctionDeclaration(node) {
        if (node.id?.name === 'cn') context.report({ node, messageId: 'define' });
      },
    };
  },
};
