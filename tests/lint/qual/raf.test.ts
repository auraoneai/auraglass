/** @jest-environment node */
// tests/lint/qual/raf.test.ts — REQ-QUAL-45 (S-47), REQ-FIN-105, FIN-446.
// raf-requires-cancel and raf-requires-visibility-gate.

import { RuleTester } from 'eslint';
import { ruleConfig } from './helpers';

const parser = require('@typescript-eslint/parser');
const rafRequiresCancel = require('../../../lint/rules/qual/raf-requires-cancel.cjs');
const rafRequiresVisibilityGate = require('../../../lint/rules/qual/raf-requires-visibility-gate.cjs');

const tester = new RuleTester({
  languageOptions: { parser, parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module', ecmaVersion: 2023 } },
});

tester.run('auraglass/raf-requires-cancel', rafRequiresCancel, {
  valid: [
    'useEffect(() => { const id = requestAnimationFrame(paint); return () => cancelAnimationFrame(id); }, []);',
    'useEffect(() => { frame.current = requestAnimationFrame(tick); return () => { if (frame.current) cancelAnimationFrame(frame.current); }; }, []);',
    'class Loop { start() { this.raf = window.requestAnimationFrame(this.tick); } stop() { window.cancelAnimationFrame(this.raf); } }',
    'function subscribe() { const ids = []; ids.push(requestAnimationFrame(a)); return () => ids.forEach(cancelAnimationFrame); }',
    // wrapper: the caller owns the returned id
    'export const nextFrame = (cb: FrameRequestCallback) => requestAnimationFrame(cb);',
    'function schedule(cb) { return requestAnimationFrame(cb); }',
    'let id = 0; function begin() { id = requestAnimationFrame(step); } function dispose() { cancelAnimationFrame(id); }',
  ],
  invalid: [
    { code: 'useEffect(() => { requestAnimationFrame(paint); }, []);', errors: [{ messageId: 'discarded' }] },
    { code: 'function f() { void requestAnimationFrame(paint); }', errors: [{ messageId: 'discarded' }] },
    { code: 'useEffect(() => { const id = requestAnimationFrame(paint); }, []);', errors: [{ messageId: 'uncancelled' }] },
    // cancelled, but not in a cleanup / stop(): the loop body itself is not a teardown
    { code: 'function tick() { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); }', errors: [{ messageId: 'uncancelled' }] },
    { code: 'class L { start() { this.raf = requestAnimationFrame(this.tick); } stop() { cancelAnimationFrame(this.other); } }', errors: [{ messageId: 'uncancelled' }] },
    { code: 'function go() { ids.push(requestAnimationFrame(a)); }', errors: [{ messageId: 'collection' }] },
    { code: 'schedule({ id: requestAnimationFrame(a) });', errors: [{ messageId: 'untracked' }] },
  ],
});

tester.run('auraglass/raf-requires-visibility-gate', rafRequiresVisibilityGate, {
  valid: [
    // gated loop
    "function tick() { if (document.visibilityState === 'hidden') return; draw(); raf = requestAnimationFrame(tick); }",
    'const loop = () => { if (document.hidden) { paused = true; return; } step(); id = requestAnimationFrame(loop); };',
    // owner listens for visibilitychange and pauses the loop
    "useEffect(() => { const tick = () => { draw(); id = requestAnimationFrame(tick); }; const onVis = () => { cancelAnimationFrame(id); if (!document.hidden) id = requestAnimationFrame(tick); }; document.addEventListener('visibilitychange', onVis); id = requestAnimationFrame(tick); return () => { cancelAnimationFrame(id); document.removeEventListener('visibilitychange', onVis); }; }, []);",
    // one-shot frame, not a loop
    'useEffect(() => { const id = requestAnimationFrame(() => measure()); return () => cancelAnimationFrame(id); }, []);',
    // the S-13 seam instead of direct rAF
    "import { subscribeFrame } from 'aura-glass/motion'; useEffect(() => subscribeFrame((t) => draw(t)), []);",
    "class Ticker { tick = () => { if (document.visibilityState !== 'visible') return; this.id = requestAnimationFrame(this.tick); }; }",
  ],
  invalid: [
    { code: 'function tick() { draw(); raf = requestAnimationFrame(tick); }', errors: [{ messageId: 'ungated' }] },
    { code: 'const loop = () => { step(); id = requestAnimationFrame(loop); };', errors: [{ messageId: 'ungated' }] },
    { code: 'function animate(t) { render(t); requestAnimationFrame((n) => animate(n)); }', errors: [{ messageId: 'ungated' }] },
    { code: 'class Ticker { tick() { this.draw(); this.id = requestAnimationFrame(this.tick.bind(this)); } }', errors: [{ messageId: 'ungated' }] },
    { code: 'useEffect(() => { const spin = () => { angle += 1; f = window.requestAnimationFrame(spin); }; f = window.requestAnimationFrame(spin); return () => cancelAnimationFrame(f); }, []);', errors: [{ messageId: 'ungated' }] },
    // a hidden-check in an unrelated function does not gate this loop
    {
      code: 'function isHidden() { return document.hidden; } function tick() { draw(); raf = requestAnimationFrame(tick); }',
      errors: [{ messageId: 'ungated' }],
    },
  ],
});

describe('raf rules rollout (contract §4.11)', () => {
  it.each(['raf-requires-cancel', 'raf-requires-visibility-gate'])('auraglass/%s is error on QUAL globs and warn elsewhere', (name) => {
    expect(ruleConfig('certification/playwright.cert.config.ts', name)).toBe(2);
    expect(ruleConfig('src/surfaces/chart/Chart.tsx', name)).toBe(1);
  });
});
