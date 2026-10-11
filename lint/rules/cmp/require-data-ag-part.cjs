/* auraglass/require-data-ag-part (CMP-019, REQ-CMP-06): in files with a sibling
   *.meta.ts, (a) the return-root JSX of every exported component must carry a
   literal data-ag-part attribute, and (b) every JSX member element rendered from
   an @base-ui/react/* import (e.g. <Accordion.Root>) must carry a literal
   data-ag-part. Registered as error for src/components/**, src/primitives/**,
   src/foundation/**. Requires "require-data-ag-part": "cmp" in
   contracts/lint-rule-owners.json (contract PR). */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

function hasLiteralDataAgPart(opening) {
  return opening.attributes.some((attr) => {
    if (attr.type !== 'JSXAttribute' || attr.name.name !== 'data-ag-part') return false;
    if (attr.value == null) return false; // bare attribute has no literal value
    if (attr.value.type === 'Literal') return true;
    return attr.value.type === 'JSXExpressionContainer' && attr.value.expression.type === 'Literal';
  });
}

function hasSiblingMeta(filename) {
  const dir = path.dirname(filename);
  const base = path.basename(filename).replace(/\.(tsx|ts|jsx|js|mts|cts)$/, '');
  return fs.existsSync(path.join(dir, `${base}.meta.ts`));
}

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'require literal data-ag-part on component roots and Base UI parts (S-33)' },
    schema: [],
    messages: {
      missing: '{{what}} must carry a literal data-ag-part attribute.',
    },
  },
  create(context) {
    const filename = context.physicalFilename ?? context.filename;
    if (!hasSiblingMeta(filename)) return {};

    const baseUiNames = new Set();
    const exportedFns = new Set();

    function isExportedFunction(fn) {
      let p = fn.parent;
      if (p && p.type === 'VariableDeclarator') p = p.parent; // VariableDeclaration
      if (!p) return false;
      if (p.type === 'ExportNamedDeclaration' || p.type === 'ExportDefaultDeclaration') return true;
      return (
        p.type === 'VariableDeclaration' &&
        !!p.parent &&
        (p.parent.type === 'ExportNamedDeclaration' || p.parent.type === 'ExportDefaultDeclaration')
      );
    }

    function checkComponentRoot(node, fn) {
      if (!isExportedFunction(fn)) return;
      // top-level `return <JSX>` of the component body
      if (!node.argument || node.argument.type !== 'JSXElement') return;
      // only the outermost return of the function itself
      let fn2 = node;
      while (fn2 && fn2.type !== 'FunctionDeclaration' && fn2.type !== 'ArrowFunctionExpression' && fn2.type !== 'FunctionExpression') {
        fn2 = fn2.parent;
      }
      if (fn2 !== fn) return;
      const opening = node.argument.openingElement;
      const elName = opening.name.type === 'JSXIdentifier' ? opening.name.name : 'member';
      if (!hasLiteralDataAgPart(opening)) {
        context.report({ node: opening, messageId: 'missing', data: { what: `Return root <${elName}>` } });
      }
    }

    return {
      ImportDeclaration(node) {
        if (typeof node.source.value === 'string' && node.source.value.startsWith('@base-ui/react')) {
          for (const s of node.specifiers) if (s.type === 'ImportSpecifier') baseUiNames.add(s.local.name);
          for (const s of node.specifiers) if (s.type === 'ImportDefaultSpecifier' || s.type === 'ImportNamespaceSpecifier') baseUiNames.add(s.local.name);
        }
      },
      ReturnStatement(node) {
        let fn = node.parent;
        while (fn && fn.type !== 'FunctionDeclaration' && fn.type !== 'ArrowFunctionExpression' && fn.type !== 'FunctionExpression') {
          fn = fn.parent;
        }
        if (fn) checkComponentRoot(node, fn);
      },
      ArrowFunctionExpression(node) {
        // implicit-return components: `export const X = () => <div/>`
        if (node.body && node.body.type === 'JSXElement' && isExportedFunction(node)) {
          const opening = node.body.openingElement;
          const elName = opening.name.type === 'JSXIdentifier' ? opening.name.name : 'member';
          if (!hasLiteralDataAgPart(opening)) {
            context.report({ node: opening, messageId: 'missing', data: { what: `Return root <${elName}>` } });
          }
        }
      },
      JSXOpeningElement(node) {
        const n = node.name;
        if (n.type === 'JSXMemberExpression' && n.object.type === 'JSXIdentifier' && baseUiNames.has(n.object.name)) {
          if (!hasLiteralDataAgPart(node)) {
            const name = n.property.type === 'JSXIdentifier' ? `${n.object.name}.${n.property.name}` : n.object.name;
            context.report({ node, messageId: 'missing', data: { what: `Base UI part <${name}>` } });
          }
        }
      },
    };
  },
  agConfig: [
    {
      files: ['src/components/**/*.{ts,tsx}', 'src/primitives/**/*.{ts,tsx}', 'src/foundation/**/*.{ts,tsx}'],
      ignores: ['**/*.test.*', '**/*.stories.*', '**/compat/**'],
      severity: 'error',
    },
  ],
};
