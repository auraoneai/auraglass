/** @jest-environment node */
// tests/lint/qual/layer-forcing.test.ts — REQ-QUAL-45 (S-47), REQ-FIN-105, FIN-446.
// RuleTester suites for the three layer-forcing rules plus the rollout config
// (error on QUAL globs, warn elsewhere) as resolved by the real eslint.config.js.

import { RuleTester } from 'eslint';
import { ruleConfig } from './helpers';

const parser = require('@typescript-eslint/parser');
const noTransitionAll = require('../../../lint/rules/qual/no-transition-all.cjs');
const noPermanentWillChange = require('../../../lint/rules/qual/no-permanent-will-change.cjs');
const noTranslateZHack = require('../../../lint/rules/qual/no-translatez-hack.cjs');

const tester = new RuleTester({
  languageOptions: { parser, parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module', ecmaVersion: 2023 } },
});

tester.run('auraglass/no-transition-all', noTransitionAll, {
  valid: [
    "const s = { transition: 'opacity 200ms ease, transform 200ms ease' };",
    "el.style.transition = 'opacity var(--ag-duration-fast)';",
    "const s = { transitionProperty: 'opacity, transform' };",
    "const css = '.x { transition: opacity 1s; }';",
    // `all` only as a substring of another word / custom property
    "const s = { transition: 'small-thing 1s' };",
    "const s = { transition: { duration: 0.2 } };",
    "const label = 'install all packages';",
  ],
  invalid: [
    { code: "const s = { transition: 'all 200ms ease' };", errors: [{ messageId: 'all' }] },
    { code: "const s = { transitionProperty: 'all' };", errors: [{ messageId: 'all' }] },
    { code: "const s = { WebkitTransition: 'opacity 1s, all 2s' };", errors: [{ messageId: 'all' }] },
    { code: "el.style.transition = 'all 0.3s';", errors: [{ messageId: 'all' }] },
    { code: "el.style.setProperty('transition', 'all 1s');", errors: [{ messageId: 'all' }] },
    { code: "const css = `.x { transition: all ${d}ms; }`;", errors: [{ messageId: 'all' }] },
    { code: "el.style.cssText = 'opacity: 1; transition-property: all';", errors: [{ messageId: 'all' }] },
    { code: "const C = () => <div style={{ transition: 'all .2s' }} />;", errors: [{ messageId: 'all' }] },
  ],
});

tester.run('auraglass/no-permanent-will-change', noPermanentWillChange, {
  valid: [
    "const s = { willChange: animating ? 'transform' : 'auto' };",
    "const s = { willChange: 'auto' };",
    "function start(el) { el.style.willChange = 'transform'; } function stop(el) { el.style.willChange = 'auto'; }",
    "function run(el) { el.style.setProperty('will-change', 'opacity'); a.onfinish = () => el.style.removeProperty('will-change'); }",
    "const css = '.ag-surface[data-ag-animating] { will-change: opacity, transform; }';",
    "const css = '[data-starting-style] .x { will-change: transform }';",
    "const css = '.x { will-change: auto; }';",
  ],
  invalid: [
    { code: "const s = { willChange: 'transform' };", errors: [{ messageId: 'literal' }] },
    { code: "const C = () => <div style={{ willChange: 'opacity, transform' }} />;", errors: [{ messageId: 'literal' }] },
    { code: "function mount(el) { el.style.willChange = 'transform'; }", errors: [{ messageId: 'write' }] },
    { code: "function mount(el) { el.style.setProperty('will-change', 'opacity'); }", errors: [{ messageId: 'write' }] },
    { code: "function a(el, b) { el.style.willChange = 'transform'; b.style.willChange = 'auto'; }", errors: [{ messageId: 'write' }] },
    { code: "const css = '.panel { will-change: transform; }';", errors: [{ messageId: 'css' }] },
    { code: "const css = `.panel:hover { will-change: ${p}; }`;", errors: [{ messageId: 'css' }] },
  ],
});

tester.run('auraglass/no-translatez-hack', noTranslateZHack, {
  valid: [
    "const s = { transform: 'translateZ(10px)' };",
    "const s = { transform: 'translate3d(0, 4px, 0)' };",
    "const s = { transform: `translate3d(${x}px, 0, 0)` };",
    "const s = { backfaceVisibility: 'visible' };",
    "const s = { transform: 'translateY(0)' };",
    "const css = '.x { transform: translate(0, 0); }';",
  ],
  invalid: [
    { code: "const s = { transform: 'translateZ(0)' };", errors: [{ messageId: 'translate' }] },
    { code: "el.style.transform = 'translateZ(0px)';", errors: [{ messageId: 'translate' }] },
    { code: "const s = { transform: 'translate3d(0,0,0)' };", errors: [{ messageId: 'translate' }] },
    { code: "const s = { transform: 'scale(1) translate3d(0px, 0, 0.0px)' };", errors: [{ messageId: 'translate' }] },
    { code: "const s = { backfaceVisibility: 'hidden' };", errors: [{ messageId: 'backface' }] },
    { code: "const s = { WebkitBackfaceVisibility: 'hidden' };", errors: [{ messageId: 'backface' }] },
    { code: "el.style.setProperty('backface-visibility', 'hidden');", errors: [{ messageId: 'backface' }] },
    { code: "const css = '.card { -webkit-backface-visibility: hidden; }';", errors: [{ messageId: 'backface' }] },
  ],
});

describe('layer-forcing rules rollout (contract §4.11)', () => {
  const rules = ['no-transition-all', 'no-permanent-will-change', 'no-translatez-hack'];
  it.each(rules)('auraglass/%s is error on a QUAL glob and warn on another stream path', (name) => {
    expect(ruleConfig('.storybook/preview.tsx', name)).toBe(2);
    expect(ruleConfig('src/components/button/Button.tsx', name)).toBe(1);
  });
});
