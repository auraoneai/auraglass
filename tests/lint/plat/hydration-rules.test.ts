/* @jest-environment node */
import { tester, F } from './helpers';

const random = require('../../../lint/rules/plat/no-random-in-render.cjs');
const dom = require('../../../lint/rules/plat/no-dom-lazy-init.cjs');

describe('auraglass/no-random-in-render (PLAT-259)', () => {
  tester.run('no-random-in-render', random, {
      valid: [
        { code: `'use client';\nexport const A = () => <button onClick={() => Math.random()} />;`, filename: F },
        { code: `'use client';\nexport const A = () => { useEffect(() => { Date.now(); }, []); return null; };`, filename: F },
        { code: `'use client';\nexport const handleX = () => new Date();`, filename: F },
        { code: `'use client';\nexport const A = () => { const onGo = () => crypto.randomUUID(); return <button onClick={onGo} />; };`, filename: F },
        { code: `export const stableId = 'ag-x-1';`, filename: F },
      ],
      invalid: [
        { code: `'use client';\nexport const A = () => <div>{Math.random()}</div>;`, filename: F, errors: [{ messageId: 'random' }] },
        { code: `'use client';\nexport const A = () => { const t = Date.now(); return <div />; };`, filename: F, errors: [{ messageId: 'random' }] },
        { code: `'use client';\nexport const A = () => { const d = new Date(); return <div />; };`, filename: F, errors: [{ messageId: 'random' }] },
        { code: `'use client';\nexport const A = () => crypto.randomUUID();`, filename: F, errors: [{ messageId: 'random' }] },
        { code: `export const A = () => Math.random();`, filename: F, errors: [{ messageId: 'random' }] },
      ],
  });
});

describe('auraglass/no-dom-lazy-init (PLAT-259)', () => {
  tester.run('no-dom-lazy-init', dom, {
      valid: [
        { code: `'use client';\nexport const A = () => useState(0);`, filename: F },
        { code: `'use client';\nexport const A = () => useState(() => 42);`, filename: F },
        { code: `'use client';\nexport const A = () => useState(() => computePure());`, filename: F },
        { code: `'use client';\nexport const A = () => { useEffect(() => { window.x = 1; }, []); return useState(0); };`, filename: F },
        { code: `export const readLater = () => document.title;`, filename: F },
      ],
      invalid: [
        { code: `'use client';\nexport const A = () => useState(() => window.innerWidth);`, filename: F, errors: [{ messageId: 'dom' }] },
        { code: `'use client';\nexport const A = () => useState(() => document.body.className);`, filename: F, errors: [{ messageId: 'dom' }] },
        { code: `'use client';\nexport const A = () => useState(function () { return matchMedia('(x)').matches; });`, filename: F, errors: [{ messageId: 'dom' }] },
        { code: `'use client';\nexport const A = () => useState(() => localStorage.getItem('k'));`, filename: F, errors: [{ messageId: 'dom' }] },
        { code: `'use client';\nexport const A = () => useState(() => navigator.language);`, filename: F, errors: [{ messageId: 'dom' }] },
      ],
  });
});
