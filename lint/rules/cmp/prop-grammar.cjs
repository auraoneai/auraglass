/* auraglass/prop-grammar (REQ-CMP-05): exported *Props interfaces/types under
   src/components, src/primitives and src/icons must not declare material
   props — the banned vocabulary is owned by MAT tokens and SURF internals.
   Error on CMP globs; the same AST is warning-level on SURF globs via the
   surf owners' config. */
'use strict';

/** Exact banned prop names (contract §4.9 + REQ-CMP-05 list). */
const BANNED = new Set([
  'material', 'elevation', 'as', 'tone', 'tier', 'intensity', 'depth', 'tint',
  'blur', 'caustics', 'chromatic', 'ior', 'lighting', 'animation',
  'respectMotionPreference', 'consciousness', 'predictive', 'eyeTracking',
  'adaptive', 'spatialAudio', 'trackAchievements', 'backdropBlur',
  'onChange', 'asChild',
]);

/** Banned prefixes (glow*, plus paranoia for future optics tokens). */
const BANNED_PREFIX = /^glow[A-Z_]/;

function propName(member) {
  if (!member || member.type !== 'TSPropertySignature') return null;
  const k = member.key;
  if (!k) return null;
  if (k.type === 'Identifier') return k.name;
  if (k.type === 'Literal' && typeof k.value === 'string') return k.value;
  return null;
}

function isExportedDecl(node) {
  const parent = node.parent;
  return parent && parent.type === 'ExportNamedDeclaration';
}

function declName(node) {
  return node.id && node.id.type === 'Identifier' ? node.id.name : null;
}

function membersOf(node) {
  if (node.type === 'TSInterfaceDeclaration') return node.body.body;
  if (node.type === 'TSTypeAliasDeclaration' && node.typeAnnotation && node.typeAnnotation.type === 'TSTypeLiteral') {
    return node.typeAnnotation.members;
  }
  return null;
}

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'ban material/optics prop names on public *Props (contract §4.9)' },
    schema: [],
    messages: {
      banned:
        "'{{prop}}' is a banned prop name on public props — material/optics are owned by MAT tokens & SURF internals (REQ-CMP-05).",
    },
  },
  create(context) {
    function check(node) {
      if (!isExportedDecl(node)) return;
      const name = declName(node);
      if (!name || !name.endsWith('Props')) return;
      const members = membersOf(node);
      if (!members) return;
      for (const m of members) {
        const prop = propName(m);
        if (!prop) continue;
        if (BANNED.has(prop) || BANNED_PREFIX.test(prop)) {
          context.report({ node: m.key, messageId: 'banned', data: { prop } });
        }
      }
    }
    return {
      TSInterfaceDeclaration: check,
      TSTypeAliasDeclaration: check,
    };
  },
  agConfig: [
    { files: ['src/components/**/*.{ts,tsx}', 'src/primitives/**/*.{ts,tsx}', 'src/icons/**/*.{ts,tsx}'], severity: 'error' },
    { files: ['src/**/*.{ts,tsx}'], ignores: ['src/components/**', 'src/primitives/**', 'src/icons/**', 'src/compat/**', 'src/contracts/**'], severity: 'warn' },
  ],
};
