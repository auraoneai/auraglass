/* no-cn-outside-internal (REQ-PLAT-26): `cn` exists only in src/internal/cn.ts.
   Forbids: clsx/tailwind-merge imports and `function cn|const cn` definitions
   anywhere else in src/. */
const CN_DEF = /^(?:const|function|let|var)\s+cn\b/;
module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'cn only in src/internal/cn.ts' },
    messages: {
      import: "'{{mod}}' may only be imported inside src/internal/cn.ts — import cn from '@/internal/cn' (or src/internal/cn).",
      define: "`cn` may only be defined in src/internal/cn.ts.",
    },
    schema: [],
  },
  agConfig: [{ files: ['src/**/*.{ts,tsx}'], ignores: ['src/internal/cn.ts'], severity: 'error' }],
  create(context) {
    const isCnFile = /src[/\\]internal[/\\]cn\.tsx?$/.test(context.filename ?? context.getFilename?.() ?? '');
    return {
      ImportDeclaration(node) {
        if (isCnFile) return;
        const mod = node.source?.value;
        if (mod === 'clsx' || mod === 'tailwind-merge' || mod === 'classnames') {
          context.report({ node, messageId: 'import', data: { mod } });
        }
      },
      VariableDeclaration(node) {
        if (isCnFile) return;
        for (const d of node.declarations) {
          if (d.id?.type === 'Identifier' && d.id.name === 'cn') {
            context.report({ node: d, messageId: 'define' });
          }
        }
      },
      FunctionDeclaration(node) {
        if (isCnFile) return;
        if (node.id?.name === 'cn') context.report({ node, messageId: 'define' });
      },
    };
  },
};
