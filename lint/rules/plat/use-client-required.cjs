/* REQ-PLAT-69: a module that uses a client-only signal must open with
   'use client'. Spec signal list (PRD §S-47):
   - imports of useState|useEffect|useLayoutEffect|useReducer|useRef|
     useContext|useSyncExternalStore|useId|useTransition|useOptimistic|
     useActionState|createContext from 'react' or '@base-ui/react/*'
   - a function passed to an on[A-Z]\w* JSX prop
   - references to window|document|navigator|matchMedia|ResizeObserver|
     IntersectionObserver|localStorage
   - a non-type use[A-Z]\w* import from a client module (a relative
     specifier whose resolved file opens with 'use client') */
const fs = require('node:fs');
const path = require('node:path');

const SIGNAL_HOOKS = new Set([
  'useState', 'useEffect', 'useLayoutEffect', 'useReducer', 'useRef',
  'useContext', 'useSyncExternalStore', 'useId', 'useTransition',
  'useOptimistic', 'useActionState', 'createContext',
]);
const SIGNAL_SOURCES = /^react$|^@base-ui\/react(\/.*)?$/;
const DOM_GLOBALS = new Set([
  'window', 'document', 'navigator', 'matchMedia',
  'ResizeObserver', 'IntersectionObserver', 'localStorage',
]);
const SKIP = /\.d\.ts$|\.test\.|\.spec\.|\.stories\.|\/__tests__\//;
const EXTS = ['.ts', '.tsx', '.js', '.jsx', '.mts', '.cts'];

const hasClientDirective = (ast) =>
  ast.body.some((n) => n.type === 'ExpressionStatement' && n.directive === 'use client');

function resolveRelative(spec, filename) {
  if (!spec.startsWith('.')) return null;
  const base = path.resolve(path.dirname(filename), spec);
  for (const ext of EXTS) {
    if (fs.existsSync(base + ext)) return base + ext;
    if (fs.existsSync(path.join(base, 'index' + ext))) return path.join(base, 'index' + ext);
  }
  return null;
}

const isClientModule = (spec, filename) => {
  if (/^@base-ui\/react(\/.*)?$/.test(spec)) return true;
  const target = resolveRelative(spec, filename);
  if (!target) return false;
  try {
    return /^['"]use client['"]/.test(fs.readFileSync(target, 'utf8').trimStart().slice(0, 200));
  } catch { return false; }
};

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: "require 'use client' when a module uses a client-only signal" },
    messages: { required: "Module uses a client-only signal ({{what}}) but does not open with 'use client'." },
    schema: [],
  },
  create(context) {
    const sourceCode = context.sourceCode;
    const filename = context.filename ?? '';
    if (SKIP.test(filename)) return {};
    let found = null;
    const signalNames = new Set();  // identifiers imported from a signal source
    return {
      ImportDeclaration(node) {
        if (found) return;
        const src = node.source.value;
        if (SIGNAL_SOURCES.test(src)) {
          for (const s of node.specifiers) {
            if (s.type === 'ImportSpecifier' && SIGNAL_HOOKS.has(s.imported.name)) signalNames.add(s.local.name);
            if (s.type === 'ImportDefaultSpecifier' || s.type === 'ImportNamespaceSpecifier') signalNames.add(s.local.name);
          }
        }
        // non-type use* import from a client module — 'react' hooks are fully
        // covered by the signal-name check; @base-ui/react is itself a client
        // package, so its use* imports are signals beyond the named list
        if (src !== 'react') {
          for (const s of node.specifiers) {
            if (s.type === 'ImportSpecifier' && /^use[A-Z]/.test(s.imported.name) && s.importKind !== 'type') {
              if (isClientModule(src, filename)) found = `import of ${s.imported.name} from client module '${src}'`;
            }
          }
        }
      },
      CallExpression(node) {
        if (found) return;
        if (node.callee.type === 'Identifier' && signalNames.has(node.callee.name)) {
          found = `call to ${node.callee.name}()`;
        }
      },
      Identifier(node) {
        if (found) return;
        if (DOM_GLOBALS.has(node.name)) {
          const p = node.parent;
          // object keys, non-computed member names (o.window), type positions
          if (p && p.type === 'Property' && p.key === node && !p.computed) return;
          if (p && p.type === 'MemberExpression' && p.property === node && !p.computed) return;
          if (p && /TS[A-Z]/.test(p.type)) return;
          found = `reference to ${node.name}`;
        }
      },
      JSXAttribute(node) {
        if (found) return;
        const name = node.name.name ?? '';
        if (!/^on[A-Z]/.test(name)) return;
        const v = node.value;
        if (!v || v.type !== 'JSXExpressionContainer') return;
        const expr = v.expression;
        if (expr.type === 'ArrowFunctionExpression' || expr.type === 'FunctionExpression' ||
            (expr.type === 'Identifier' && expr.name !== 'undefined')) {
          found = `function passed to JSX prop ${name}`;
        }
      },
      'Program:exit'() {
        if (found && !hasClientDirective(sourceCode.ast)) {
          context.report({ node: sourceCode.ast, messageId: 'required', data: { what: found } });
        }
      },
    };
  },
  agConfig: [{ files: ['src/**/*.{ts,tsx}'], ignores: ['**/__tests__/**', '**/*.test.*', '**/*.stories.*'], severity: 'error' }],
};
