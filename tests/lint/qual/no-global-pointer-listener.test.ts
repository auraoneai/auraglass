/** @jest-environment node */
// tests/lint/qual/no-global-pointer-listener.test.ts — REQ-QUAL-45 (S-47), REQ-FIN-105, FIN-446.

import { RuleTester } from 'eslint';
import { ruleConfig } from './helpers';

const parser = require('@typescript-eslint/parser');
const rule = require('../../../lint/rules/qual/no-global-pointer-listener.cjs');

const tester = new RuleTester({
  languageOptions: { parser, parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module', ecmaVersion: 2023 } },
});

const F = 'src/components/slider/Slider.tsx';

tester.run('auraglass/no-global-pointer-listener', rule, {
  valid: [
    // element-scoped listeners are fine
    { code: "el.addEventListener('pointermove', onMove);", filename: F },
    { code: "ref.current.addEventListener('scroll', onScroll, { passive: true });", filename: F },
    // low-frequency global events are not in scope
    { code: "window.addEventListener('resize', onResize);", filename: F },
    { code: "document.addEventListener('visibilitychange', onVis);", filename: F },
    { code: "window.addEventListener('keydown', onKey);", filename: F },
    // the motion seam itself may install them
    { code: "window.addEventListener('pointermove', onMove, { passive: true });", filename: 'src/motion/pointer.ts' },
    { code: "window.addEventListener('deviceorientation', onTilt);", filename: 'src/motion/tilt/source.ts' },
    { code: 'const C = () => <div onPointerMove={onMove} onScroll={onScroll} />;', filename: F },
  ],
  invalid: [
    { code: "window.addEventListener('mousemove', onMove);", filename: F, errors: [{ messageId: 'listener' }] },
    { code: "document.addEventListener('pointermove', onMove);", filename: F, errors: [{ messageId: 'listener' }] },
    { code: "window.addEventListener('scroll', onScroll, { passive: true });", filename: F, errors: [{ messageId: 'listener' }] },
    { code: "window.addEventListener('deviceorientation', onTilt);", filename: F, errors: [{ messageId: 'listener' }] },
    { code: 'document.body.addEventListener(`pointermove`, onMove);', filename: F, errors: [{ messageId: 'listener' }] },
    { code: "globalThis.addEventListener('scroll', onScroll);", filename: F, errors: [{ messageId: 'listener' }] },
    { code: 'window.onscroll = () => update();', filename: F, errors: [{ messageId: 'listener' }] },
    { code: "useEffect(() => { document.documentElement.addEventListener('mousemove', f); }, []);", filename: 'showcase/ops-console/OpsConsole.showcase.tsx', errors: [{ messageId: 'listener' }] },
  ],
});

describe('no-global-pointer-listener rollout (contract §4.11)', () => {
  it('is error on QUAL globs, warn on other streams, off in src/motion/**', () => {
    expect(ruleConfig('.storybook/preview.tsx', 'no-global-pointer-listener')).toBe(2);
    expect(ruleConfig('src/components/slider/Slider.tsx', 'no-global-pointer-listener')).toBe(1);
    expect(ruleConfig('src/motion/pointer.ts', 'no-global-pointer-listener')).toBe(0);
  });
});
