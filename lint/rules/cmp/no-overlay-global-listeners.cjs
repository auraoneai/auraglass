/* auraglass/no-overlay-global-listeners (CMP-197, REQ-CMP-12): overlay code may
   not install global document/window listeners for dismissal or geometry —
   Base UI's dismiss/focus plumbing and ResizeObserver-covering measurement are
   the sanctioned seams. Reports:
     - document|window.addEventListener('keydown'|'mousedown'|'pointerdown'|'scroll'|'resize', ...)
     - document|window.removeEventListener(same set)
     - any assignment to document.body.style.* (scroll locking is the
       LayerStack's <html data-ag-scroll-locked> attribute).
   REQ-FIN-07: enforced at error over src/components/**, src/primitives/** and
   the SURF overlay dirs (src/app-shell/**, src/media/ImageViewer/**). Current
   offenders outside FIN-A files are listed in the shrink-only, expiring
   baseline scripts/integration/baselines/no-overlay-global-listeners.json and
   ignored here; tests/integration/no-overlay-global-listeners.test.ts fails
   on any new offender, any stale row and any malformed row. */
'use strict';

const path = require('node:path');

const BASELINE = require(path.join(__dirname, '..', '..', '..', 'scripts', 'integration', 'baselines', 'no-overlay-global-listeners.json'));

const SCOPE = [
  'src/components/**/*.{ts,tsx}',
  'src/primitives/**/*.{ts,tsx}',
  'src/app-shell/**/*.{ts,tsx}',
  'src/media/ImageViewer/**/*.{ts,tsx}',
];
const IGNORES = [
  '**/__fixtures__/**',
  '**/__tests__/**',
  '**/*.test.*',
  '**/*.stories.*',
  ...BASELINE.map((row) => row.file),
];

const GLOBALS = new Set(['document', 'window']);
const EVENTS = new Set(['keydown', 'mousedown', 'pointerdown', 'scroll', 'resize']);

function isGlobalIdent(node) {
  return node && node.type === 'Identifier' && GLOBALS.has(node.name);
}

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'ban global keydown/pointer/scroll/resize listeners and body.style writes in overlay code (S-23)' },
    schema: [],
    messages: {
      listener:
        'overlay code must not attach global {{name}} listeners ({{event}}); register with the LayerStack (useLayer) or use element-level handlers (REQ-CMP-12).',
      bodyStyle:
        'overlay code must not write document.body.style.{{prop}}; scroll locking is the LayerStack\'s (REQ-CMP-12).',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        const c = node.callee;
        if (c.type !== 'MemberExpression' || c.computed) return;
        if (c.property.type !== 'Identifier' ||
            (c.property.name !== 'addEventListener' && c.property.name !== 'removeEventListener')) return;
        if (!isGlobalIdent(c.object)) return;
        const first = node.arguments[0];
        const event = first && first.type === 'Literal' && typeof first.value === 'string'
          ? first.value : null;
        if (event && EVENTS.has(event)) {
          context.report({
            node: c,
            messageId: 'listener',
            data: { name: c.property.name, event },
          });
        }
      },
      AssignmentExpression(node) {
        // document.body.style.<prop> = ...
        let chain = node.left;
        const props = [];
        while (chain && chain.type === 'MemberExpression') {
          if (!chain.computed && chain.property.type === 'Identifier') props.unshift(chain.property.name);
          chain = chain.object;
        }
        if (!isGlobalIdent(chain) || props[0] !== 'body' || props[1] !== 'style' || props.length < 3) return;
        context.report({
          node: node.left,
          messageId: 'bodyStyle',
          data: { prop: props.slice(2).join('.') },
        });
      },
    };
  },
  agConfig: [{ files: SCOPE, ignores: IGNORES, severity: 'error' }],
  SCOPE,
  IGNORES,
};
