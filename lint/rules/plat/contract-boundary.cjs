/* REQ-PLAT-69 / §4: src/** modules may only consume other streams via their
   §4 module path specifiers (aura-glass/<subpath>, or @/ for own-package
   internals). Contracts and stubs are never imported from src/**: a stub under
   contracts/stubs or contracts/stubs/** is contract scaffolding, and any
   specifier reaching contracts/ or a sibling stub dir is a boundary breach. */
// REQ-PLAT-69 rollout: warn outside PLAT globs until RC-1 (PLAT globs: _strict.cjs).
const { rolloutSeverity } = require('./_rollout.cjs');
const path = require('node:path');

const SRC_FILE = /(^|[/\\])src[/\\]/;
const BANNED_SPEC = /(^|\/)(contracts|stubs)\/|^@?ag-contract-seed$|\.stub\.|contracts\/stubs/;
const EXTERNAL_STUB = /stubs\/|\/stubs\//;

/* `src/contracts/**` is itself a §4 module path: CMP and SURF import it by
   relative path (CORE_COMPONENTS_PRD §R3, PRODUCT_SURFACES_PRD "SURF imports
   only ... src/contracts/**"). A relative specifier that resolves inside the
   `src/contracts/` directory of the importing file's own `src/` tree is
   allowed; the repo-root `contracts/` (ownership + stubs), bare `contracts/…`
   or `src/contracts/…` specifiers, and any stub stay banned. */
const resolvesIntoSrcContracts = (filename, spec) => {
  if (!spec.startsWith('.')) return false;
  const file = filename.replace(/\\/g, '/');
  const m = /^(.*?(?:^|\/)src)\//.exec(file);
  if (!m) return false;
  const target = path.posix.normalize(path.posix.join(path.posix.dirname(file), spec));
  return target.startsWith(`${m[1]}/contracts/`) || target === `${m[1]}/contracts`;
};

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'enforce §4 module-path boundaries inside src/**' },
    messages: {
      boundary: "Specifiers reaching contracts/ or stubs are forbidden inside src/** — import via the stream's §4 module path instead ('{{spec}}').",
      stub: 'Contract stubs may never be imported from src/** ({{spec}}).',
    },
    schema: [],
  },
  create(context) {
    const inSrc = SRC_FILE.test(context.filename ?? '');
    if (!inSrc) return {};
    const check = (node, spec) => {
      if (typeof spec !== 'string') return;
      if (EXTERNAL_STUB.test(spec)) context.report({ node, messageId: 'stub', data: { spec } });
      else if (BANNED_SPEC.test(spec) && !resolvesIntoSrcContracts(context.filename ?? '', spec)) context.report({ node, messageId: 'boundary', data: { spec } });
    };
    return {
      ImportDeclaration: (n) => check(n.source, n.source.value),
      ExportNamedDeclaration: (n) => n.source && check(n.source, n.source.value),
      ExportAllDeclaration: (n) => check(n.source, n.source.value),
      ImportExpression: (n) => n.source.type === 'Literal' && check(n.source, n.source.value),
    };
  },
  agConfig: [{ files: ['src/**/*.{ts,tsx}'], severity: rolloutSeverity() }],
};
