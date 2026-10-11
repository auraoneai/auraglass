/* lint/rules/qual/_shared.cjs — QUAL perf-lint helpers (REQ-QUAL-45, S-47).
   Leading underscore: eslint-plugin-auraglass.js skips it as a rule module.

   Rollout (contract §4.11 "Non-blocking rule rollout"): each QUAL rule is
   `error` only over QUAL-owned globs (contracts/ownership.json QUAL rows) and
   `warn` everywhere else. The loader visits `qual` last, so a repo-wide warn
   entry would override another stream's `_strict.cjs` escalation of a QUAL
   rule; the warn entry therefore ignores every glob another stream lists for
   that rule in its own `_strict.cjs`. At RC-1 G-05 flips all rules to error. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const JS = '{ts,tsx,js,jsx,mjs,cjs}';
const ALL_JS = [`**/*.${JS}`];

// QUAL-owned runtime/story/harness code (contracts/ownership.json B09/B10, A16, F01, F07, F08).
const QUAL_ERROR_GLOBS = [
  `.storybook/**/*.${JS}`,
  `stories/qual/**/*.${JS}`,
  `showcase/**/*.${JS}`,
  `packages/qa/**/*.${JS}`,
  `certification/**/*.${JS}`,
];
// Seeded negative fixtures intentionally violate the rules (QUAL-42/43/44).
const FIXTURE_IGNORES = ['**/fixtures/**', '**/__fixtures__/**'];
// Rule sources and RuleTester suites carry the banned patterns as data.
const SELF_IGNORES = ['lint/rules/qual/**', 'tests/lint/**', 'scripts/qual/stylelint-perf/**', 'scripts/qual/verify-css-perf.mjs'];

const ROOT = path.resolve(__dirname, '..', '..', '..');
const OTHER_STREAMS = ['plat', 'mat', 'cmp', 'surf'];

/** Globs other streams escalate to `error` for `ruleName` in their own `_strict.cjs`. */
function otherStrictGlobs(ruleName) {
  const out = [];
  for (const s of OTHER_STREAMS) {
    const f = path.join(ROOT, 'lint', 'rules', s, '_strict.cjs');
    if (!fs.existsSync(f)) continue;
    const globs = (require(f).strict ?? {})[ruleName];
    if (Array.isArray(globs)) out.push(...globs);
  }
  return out;
}

/** agConfig for a QUAL rule: warn elsewhere first, then error on QUAL globs (later entry wins). */
function agConfigFor(ruleName, { extraIgnores = [] } = {}) {
  return [
    {
      files: ALL_JS,
      ignores: [...QUAL_ERROR_GLOBS, ...SELF_IGNORES, ...extraIgnores, ...otherStrictGlobs(ruleName)],
      severity: 'warn',
    },
    { files: QUAL_ERROR_GLOBS, ignores: [...FIXTURE_IGNORES, ...extraIgnores], severity: 'error' },
  ];
}

/** Repo-relative POSIX path of the linted file. */
function relFile(context) {
  const f = context.physicalFilename ?? context.filename ?? '';
  const cwd = context.cwd ?? process.cwd();
  const rel = path.isAbsolute(f) ? path.relative(cwd, f) : f;
  return rel.split(path.sep).join('/');
}

/** Non-computed property key name ('x', "x", x). */
function keyName(node) {
  if (!node || (node.type !== 'Property' && node.type !== 'PropertyDefinition')) return null;
  const k = node.key;
  if (!k || node.computed) return null;
  if (k.type === 'Identifier') return k.name;
  if (k.type === 'Literal') return String(k.value);
  return null;
}

/** Member property name of `a.b` / `a['b']`. */
function memberName(node) {
  if (!node || node.type !== 'MemberExpression') return null;
  if (!node.computed && node.property.type === 'Identifier') return node.property.name;
  if (node.computed && node.property.type === 'Literal') return String(node.property.value);
  return null;
}

/** Static text of a string Literal or TemplateLiteral (expressions become `\u0000`). */
function staticText(node) {
  if (!node) return null;
  if (node.type === 'Literal' && typeof node.value === 'string') return node.value;
  if (node.type === 'TemplateLiteral') {
    return node.quasis.map((q) => q.value.cooked ?? q.value.raw).join('\u0000');
  }
  return null;
}

module.exports = {
  ALL_JS,
  QUAL_ERROR_GLOBS,
  FIXTURE_IGNORES,
  SELF_IGNORES,
  agConfigFor,
  otherStrictGlobs,
  relFile,
  keyName,
  memberName,
  staticText,
};
