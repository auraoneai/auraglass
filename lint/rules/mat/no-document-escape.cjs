/* auraglass/no-document-escape — MAT-258. Escape dismissal goes through the
   LayerStack (S-25): the single document-level keydown dispatcher lives in
   src/theme/layers/**. Any other document/window keydown|keyup listener whose
   handler compares 'Escape' | 'Esc' | 27 duplicates it. */
'use strict';

const meta = {
  type: 'problem',
  docs: { description: 'Disallow document/window Escape listeners outside the LayerStack.' },
  schema: [],
  messages: {
    escape: 'Handle Escape through the LayerStack (useLayer onEscape) — document/window {{event}} listeners are forbidden outside src/theme/layers/**.',
  },
};

const isExempt = (f) => /(?:^|[/\\])src[/\\]theme[/\\]layers[/\\]/.test(f);

const ESCAPE_RE = /^(?:'Escape'|'Esc'|27)$/;

/** Does this subtree compare/look up an Escape key? (key === 'Escape', key === 'Esc', keyCode === 27, 'Escape' switch case). */
const subtreeHasEscape = (node) => {
  if (!node || typeof node !== 'object') return false;
  let hit = false;
  const visit = (n) => {
    if (hit || !n || typeof n !== 'object') return;
    if (n.type === 'Literal' && (n.value === 'Escape' || n.value === 'Esc')) { hit = true; return; }
    if (n.type === 'BinaryExpression' && (n.right?.value === 27 || n.left?.value === 27)) { hit = true; return; }
    for (const k of Object.keys(n)) {
      if (k === 'parent' || k === 'range' || k === 'loc') continue;
      const v = n[k];
      if (Array.isArray(v)) v.forEach(visit);
      else if (v && typeof v === 'object' && typeof v.type === 'string') visit(v);
    }
  };
  visit(node);
  return hit;
};

const isDocumentOrWindow = (obj) =>
  obj?.type === 'Identifier' && (obj.name === 'document' || obj.name === 'window');

function create(context) {
  const filename = context.filename ?? context.getFilename?.() ?? '';
  if (isExempt(filename)) return {};
  return {
    CallExpression(node) {
      // document.addEventListener('keydown'|'keyup', handler-with-Escape)
      const callee = node.callee;
      if (callee?.type !== 'MemberExpression' || callee.property?.name !== 'addEventListener') return;
      if (!isDocumentOrWindow(callee.object)) return;
      const [eventArg, handler] = node.arguments;
      const ev = eventArg?.type === 'Literal' ? eventArg.value : null;
      if (ev !== 'keydown' && ev !== 'keyup') return;
      if (handler && subtreeHasEscape(handler)) {
        context.report({ node, messageId: 'escape', data: { event: ev } });
      }
    },
  };
}

const agConfig = [
  {
    files: ['src/a11y/**/*.{ts,tsx}', 'src/theme/**/*.{ts,tsx}', 'src/material/**/*.{ts,tsx}'],
    ignores: ['src/theme/layers/**'],
    severity: 'error',
  },
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    ignores: ['src/theme/layers/**', '**/*.test.*', '**/__tests__/**', 'tests/**'],
    severity: 'warn',
  },
];

module.exports = { meta, create, agConfig };
