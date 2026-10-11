/** @jest-environment node */
// tests/lint/surf/no-to-locale.test.ts — REQ-SURF-08: RuleTester coverage for
// lint/rules/surf/no-to-locale.cjs (ESLint 9 flat-config RuleTester). It
// replaces the old locale-guard.test.ts source grep. The real-config planted
// violation lives in src/data/__tests__/no-to-locale.lint.test.ts.

import { RuleTester } from 'eslint';

const rule = require('../../../lint/rules/surf/no-to-locale.cjs');

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

tester.run('auraglass/no-to-locale', rule, {
  valid: [
    "new Intl.DateTimeFormat('en-US', { timeZone: 'UTC' }).format(d);",
    "Intl.NumberFormat(locale).format(n);",
    "new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });",
    "new Intl.DateTimeFormat(['en-US']).format(d);",
    // Intl members that take no locale are not formatters.
    "Intl.getCanonicalLocales('en-US');",
    "Intl.supportedValuesOf('timeZone');",
    // unrelated names that only share a prefix
    'value.toLocaleUpperCase("tr");',
    'const toLocaleString = 1;',
    'value.toFixed(2);',
    // a dynamic computed key is not resolvable — nothing to accuse
    'value[key]();',
  ],
  invalid: [
    { code: 'd.toLocaleDateString();', errors: [{ messageId: 'toLocale', data: { name: 'toLocaleDateString' } }] },
    { code: "d.toLocaleDateString('en-US');", errors: [{ messageId: 'toLocale' }] },
    { code: 'd.toLocaleTimeString();', errors: [{ messageId: 'toLocale', data: { name: 'toLocaleTimeString' } }] },
    { code: 'n.toLocaleString();', errors: [{ messageId: 'toLocale', data: { name: 'toLocaleString' } }] },
    { code: 'n?.toLocaleString();', errors: [{ messageId: 'toLocale' }] },
    { code: "n['toLocaleString']();", errors: [{ messageId: 'toLocale' }] },
    { code: 'n[`toLocaleDateString`]();', errors: [{ messageId: 'toLocale' }] },
    // a reference without a call still leaks the host-locale formatter
    'const f = Date.prototype.toLocaleDateString;',
    { code: '<time>{new Date(t).toLocaleTimeString()}</time>;', errors: [{ messageId: 'toLocale' }] },
    { code: 'new Intl.DateTimeFormat().format(d);', errors: [{ messageId: 'intlImplicitLocale', data: { name: 'DateTimeFormat' } }] },
    { code: 'new Intl.NumberFormat(undefined, { style: "percent" });', errors: [{ messageId: 'intlImplicitLocale', data: { name: 'NumberFormat' } }] },
    { code: 'Intl.DateTimeFormat().resolvedOptions();', errors: [{ messageId: 'intlImplicitLocale' }] },
    { code: 'new Intl.RelativeTimeFormat(void 0);', errors: [{ messageId: 'intlImplicitLocale' }] },
  ].map((c) => (typeof c === 'string' ? { code: c, errors: [{ messageId: 'toLocale' }] } : c)),
});
