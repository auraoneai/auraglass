/* auraglass/no-forward-ref (CMP-023, REQ-CMP-03): React 19 ref-as-prop — banning
   forwardRef import specifiers (named, aliased, namespace member calls) and
   forwardRef()/React.forwardRef() call sites in src/** except src/compat/**. */
'use strict';

function isForwardRefMember(node) {
  return (
    node.type === 'MemberExpression' &&
    !node.computed &&
    node.object.type === 'Identifier' &&
    node.object.name === 'React' &&
    node.property.type === 'Identifier' &&
    node.property.name === 'forwardRef'
  );
}

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'ban forwardRef; React 19 takes ref as a prop (S-35)' },
    schema: [],
    messages: {
      banned: 'forwardRef is banned in 5.0: pass ref as a normal prop (REQ-CMP-03).',
    },
  },
  create(context) {
    return {
      ImportSpecifier(node) {
        const decl = node.parent;
        if (decl.source.value === 'react' && node.imported.name === 'forwardRef') {
          context.report({ node, messageId: 'banned' });
        }
      },
      CallExpression(node) {
        const c = node.callee;
        if ((c.type === 'Identifier' && c.name === 'forwardRef') || isForwardRefMember(c)) {
          context.report({ node: c, messageId: 'banned' });
        }
      },
    };
  },
  agConfig: [
    { files: ['src/**/*.{ts,tsx,js,jsx}'], ignores: ['src/compat/**'], severity: 'error' },
  ],
};
