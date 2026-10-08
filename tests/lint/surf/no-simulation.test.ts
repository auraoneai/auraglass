/** @jest-environment node */
// tests/lint/surf/no-simulation.test.ts — AC-SURF-03 (REQ-SURF-05, S-47).
// RuleTester coverage for lint/rules/surf/no-simulation.cjs against the
// ESLint 9 flat-config RuleTester API.

import { RuleTester } from 'eslint';

const rule = require('../../../lint/rules/surf/no-simulation.cjs');

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

tester.run('auraglass/no-simulation', rule, {
  valid: [
    // Math.random inside an event handler is allowed (user-gesture entropy).
    'function handleShuffle() { return Math.random(); }',
    'const onPick = () => Math.random();',
    'const el = { onSpin: () => Math.random() };',
    '<button onClick={() => Math.random()} />;',
    'el.addEventListener("click", () => Math.random());',
    // hooks are fine
    'const id = useId();',
    // a real buffer, not a fabricated payload
    'const b = new Blob([buf]);',
    // 2-object default is under the demo-data bar
    'function List({ items = [{a:1},{b:2}] }) { return items; }',
    // timer whose callback is opaque — nothing to accuse
    'function later(fn) { setTimeout(fn, 100); }',
    // a named non-progress setter inside a timer is not a fake progress loop
    'setTimeout(() => setLabel("done"), 100);',
  ],
  invalid: [
    {
      code: 'export function Body() { const r = Math.random(); return <div>{r}</div>; }',
      errors: [{ messageId: 'mathRandom' }],
    },
    {
      code: 'function C() { useEffect(() => { setSeed(Math.random()); }, []); }',
      errors: [{ messageId: 'mathRandom' }],
    },
    {
      code: 'function C() { const [seed] = useState(() => Math.random()); }',
      errors: [{ messageId: 'mathRandom' }],
    },
    {
      code: 'export const seed = Math.random();',
      errors: [{ messageId: 'mathRandom' }],
    },
    {
      code: 'function C() { setTimeout(() => setProgress(40), 100); }',
      errors: [{ messageId: 'fakeProgressTimer' }],
    },
    {
      code: 'function C() { setInterval(() => setProgress(p => p + 5), 100); }',
      errors: [{ messageId: 'fakeProgressTimer' }],
    },
    {
      code: 'const blob = new Blob(["mock audio data"]);',
      errors: [{ messageId: 'mockBlob' }],
    },
    {
      code: 'function List({ items = [{a:1},{b:2},{c:3}] }) { return items; }',
      errors: [{ messageId: 'demoDataDefault' }],
    },
    {
      code: 'List.defaultProps = { items: [{a:1},{b:2},{c:3}] };',
      errors: [{ messageId: 'demoDataDefault' }],
    },
  ],
});
