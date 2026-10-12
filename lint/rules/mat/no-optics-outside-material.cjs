/* auraglass/no-optics-outside-material — REQ-MAT-39 (was no-inline-glass, SC-16).
   Outside src/material/**, tokens/** and generated CSS, no code may emit backdrop
   filters, white-glass rgba() tints, blur()/saturate() literals or white specular
   gradients. Stories and tests are not exempt; RuleTester fixtures of optics rules (this rule's
   and QUAL's backdrop-filter CSS rules) and frozen 4.x codemod inputs are.

   Scope (FIN-D D.3-03 launch re-scope): the rule polices *emission* — optics that can reach
   a rendered style. Two things are therefore out of scope:
   1. Optics-detector fixtures and the material engine's own verification suites (EXEMPT
      below): the controls/fixtures of QUAL's probes and perf harness, of the registry /
      showcase / blocks / audit-backdrop detectors and of count-glass-recipes, plus
      tests/material/**, tests/e2e/mat/** and tests/visual/mat/**, which assert the optics
      src/material/** emits. Their whole subject is optics, so they must spell them.
   2. Non-emitting string contexts in any file (see nonEmitting()): test titles
      (describe/it/test/... first argument), expect(value, message) messages, CSS reader /
      feature-query arguments (getPropertyValue(...), CSS.supports(...)), optics resets
      (`backdrop-filter: none`) and capability flags (a backdropFilter key whose value is
      boolean-valued: true/false, !x, a comparison).
   Everything else in src/**, stories/**, tests/** and apps/** stays linted — a story or
   test that renders a bespoke backdrop filter is still a finding. A deliberate emission
   in a test (e.g. a probe's negative control) carries an eslint-disable-next-line with
   the reason. */
'use strict';

const PATTERNS = [
  { re: /backdrop-filter|-webkit-backdrop-filter/i, label: 'backdrop-filter declaration' },
  { re: /rgba\(\s*255\s*,\s*255\s*,\s*255\s*,/, label: 'white glass rgba() tint' },
  { re: /\bblur\(\s*\d/, label: 'blur() literal' },
  { re: /\bsaturate\(\s*\d/, label: 'saturate() literal' },
  { re: /linear-gradient\([^)]*rgba\(255,\s*255,\s*255/, label: 'white specular gradient' },
];

const OPTICS_KEYS = new Set(['backdropFilter', 'WebkitBackdropFilter']);

/** Paths that are allowed to carry optics code (posix-style relative paths). */
const EXEMPT = [
  /(^|\/)src\/material\//,              // the material engine owns all optics
  /(^|\/)tokens\//,                     // token sources carry blur()/colour values
  /(^|\/)generated\//,                  // generated outputs (incl. token CSS, tailwind bridge)
  /(^|\/)dist\//,
  /tailwind[^/]*\.(css|ts|mjs|cjs)$/,   // the generated Tailwind bridge
  /(^|\/)tests\/lint\/mat\//,           // this rule's own RuleTester fixtures live here
  /(^|\/)legacy\//,                     // quarantined 4.x tree (PLAT-owned)
  /(^|\/)tests\/dx\/fixtures\/recipes-4x\//, // frozen 4.x recipe inputs of the 4to5 codemod (REQ-PLAT-92): 4.x source by definition, read as text, never rendered
  /(^|\/)tests\/lint\/qual\/css-perf\.test\.ts$/, // RuleTester fixtures of the QUAL backdrop-filter CSS rules (same standing as tests/lint/mat/)
  /(^|\/)tests\/lint\/qual\/story-rules\.test\.ts$/, // RuleTester fixtures of the QUAL story optics rules (same standing)
  /(^|\/)stories\/qual\/fixtures\//,    // QUAL probe/perf-harness negative and positive controls (tagged no-cert): bespoke optics by design
  /(^|\/)tests\/perf\/qual\//,          // QUAL perf harness: optics detectors (invariants.mjs), their self-tests and fixture specs
  /(^|\/)tests\/material\//,             // the material engine's own test suite: asserts the optics src/material/** emits
  /(^|\/)tests\/e2e\/mat\//,            // material e2e suite: reads computed material optics
  /(^|\/)tests\/visual\/mat\//,         // material visual suite: reads computed material optics / capability
  /(^|\/)tests\/registry\/lint\.test\.ts$/,               // fixtures of the registry no-inline-optics lint
  /(^|\/)tests\/capability\/registry\/blocks-lint\.test\.ts$/, // fixture violation for the blocks registry lint
  /(^|\/)tests\/showcase\/showcase-imports\.test\.mjs$/,   // fixtures of the showcase style-prop check
  /(^|\/)tests\/dx\/audit-backdrop\.remote\.spec\.ts$/,    // input CSS of the audit-backdrop CLI
];

const TEST_FNS = new Set(['describe', 'it', 'test', 'suite', 'bench', 'context']);
const READERS = new Set(['getPropertyValue', 'supports']);
const COMPARISON = new Set(['<', '<=', '>', '>=', '==', '!=', '===', '!==', 'in', 'instanceof']);
/** Root identifier of a callee chain: it.each([...])('t') / test.describe.serial / describe. */
const rootName = (n) => {
  while (n) {
    if (n.type === 'Identifier') return n.name;
    if (n.type === 'MemberExpression') n = n.object;
    else if (n.type === 'CallExpression') n = n.callee;
    else if (n.type === 'TaggedTemplateExpression') n = n.tag;
    else return null;
  }
  return null;
};
const propName = (callee) => (callee?.type === 'MemberExpression' && !callee.computed && callee.property.type === 'Identifier'
  ? callee.property.name : null);
/** A string node whose position means it cannot reach a rendered style (see header, 2.). */
const nonEmitting = (node) => {
  const p = node.parent;
  if (!p || p.type !== 'CallExpression') return false;
  const i = p.arguments.indexOf(node);
  if (i === 0 && TEST_FNS.has(rootName(p.callee))) return true; // test/suite title
  if (i === 1 && rootName(p.callee) === 'expect' && (p.callee.type === 'Identifier' || ['soft', 'poll'].includes(propName(p.callee)))) {
    return true; // expect(value, message)
  }
  if (i === 0 && READERS.has(propName(p.callee))) return true; // getPropertyValue(...) / CSS.supports(...)
  return false;
};
/** A value that is necessarily a boolean: a capability flag, never a filter value. */
const booleanValued = (v) => (v.type === 'Literal' && typeof v.value === 'boolean')
  || (v.type === 'UnaryExpression' && v.operator === '!')
  || (v.type === 'BinaryExpression' && COMPARISON.has(v.operator));
/** Optics resets (`backdrop-filter: none`) remove optics; they are not optics. */
const RESET = /(?:-webkit-)?backdrop-filter\s*:\s*none\b/gi;

const norm = (f) => (typeof f === 'string' ? f.replace(/\\/g, '/') : '');
const isExempt = (filename) => {
  const f = norm(filename);
  return f === '' || f === '<input>' || EXEMPT.some((re) => re.test(f));
};

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'Forbid material optics (backdrop filters, glass rgba/blur/saturate literals, specular gradients) outside src/material/**' },
    schema: [],
    messages: {
      key: "'{{name}}' is a material optic; emit it only inside src/material/** (REQ-MAT-39).",
      pattern: '{{label}} is a material optic; emit it only inside src/material/** (REQ-MAT-39).',
    },
  },
  create(context) {
    if (isExempt(context.filename ?? context.getFilename?.())) return {};
    const report = (node, label) =>
      context.report({ node, messageId: 'pattern', data: { label } });
    const checkText = (node, text) => {
      if (typeof text !== 'string') return;
      const scanned = text.replace(RESET, '');
      const hit = PATTERNS.find((p) => p.re.test(scanned));
      if (hit) report(node, hit.label);
    };
    return {
      Property(node) {
        const key = node.key;
        if (!key || node.computed) {
          return;
        }
        const name = key.type === 'Identifier' ? key.name : key.value;
        if (OPTICS_KEYS.has(name) && !booleanValued(node.value)) {
          context.report({ node: key, messageId: 'key', data: { name } });
        }
      },
      Literal(node) {
        if (!nonEmitting(node)) checkText(node, node.value);
      },
      TemplateLiteral(node) {
        if (nonEmitting(node)) return;
        for (const quasi of node.quasis) checkText(quasi, quasi.value.cooked ?? quasi.value.raw);
      },
      // CSS-in-JS / tagged templates and JSON-ish string args are covered by the two
      // visitors above; template *expressions* are not scanned (they are values, not optics).
    };
  },
  agConfig: [
    {
      // REQ-MAT-39: stories, tests and apps are not exempt. 'warn' everywhere, held by the
      // optics-baseline.json ratchet (scripts/mat/optics-lint.mjs: per-file counts plus the
      // maxWarnings total, run in mat:test:optics). Migrated families graduate to 'error'
      // via lint/rules/mat/_strict.cjs (MAT-180). The rule's own RuleTester fixtures are
      // excluded.
      files: [
        'src/**/*.{ts,tsx,js,jsx,mjs,cjs}',
        'stories/**/*.{ts,tsx,js,jsx,mjs,cjs}',
        'tests/**/*.{ts,tsx,js,jsx,mjs,cjs}',
        'apps/**/*.{ts,tsx,js,jsx,mjs,cjs}',
      ],
      ignores: ['tests/lint/mat/**'],
      severity: 'warn',
    },
  ],
};
