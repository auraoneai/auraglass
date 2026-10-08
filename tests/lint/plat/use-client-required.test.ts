/* @jest-environment node */
import { tester, F } from './helpers';

const rule = require('../../../lint/rules/plat/use-client-required.cjs');
const req = (what: string) => ({ messageId: 'required' as const, data: { what } });

describe('auraglass/use-client-required (PLAT-259)', () => {
  tester.run('use-client-required', rule, {
      valid: [
        { code: `'use client';\nimport { useState } from 'react';\nexport const A = () => { const [x] = useState(0); return <button onClick={() => {}}>{x}</button>; };`, filename: F },
        { code: `export const f = (n: number) => n * 2;`, filename: F },
        { code: `export const T = { a: 1, b: 2 };`, filename: F },
        { code: `export type X = { onClick: () => void };`, filename: F },
        { code: `export * from './x';`, filename: F },
        { code: `'use client';\nexport const A = () => <div ref={undefined} />;`, filename: F },
        { code: `'use client';\nexport const A = () => useEffect(() => { window.x = 1; }, []);`, filename: F },
        { code: `'use client';\nexport const useThing = () => useContext(Ctx);`, filename: F },
        { code: `export const serverOnly = () => fetch('/x');`, filename: 'src/server/x.ts' },
        { code: `export const testComp = () => useState(0);`, filename: 'src/x.test.tsx' },
        { code: `export const story = () => useState(0);`, filename: 'src/x.stories.tsx' },
        { code: `export declare const x: number;`, filename: 'src/x.d.ts' },
      ],
      invalid: [
        { code: `export const A = () => { const [x] = useState(0); return <div />; };`, filename: F, errors: [req('call to useState()')] },
        { code: `export const A = () => useEffect(() => {}, []);`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `export const A = () => <button onClick={() => {}} />;`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `export const A = () => window.innerWidth;`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `export const A = () => document.body;`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `export const A = () => { useContext(X); return null; };`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `export const A = () => { const r = useRef(0); return <div ref={r} />; };`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `export const A = () => useReducer((s: number) => s + 1, 0);`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `export const A = () => navigator.userAgent;`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `export const A = () => localStorage.getItem('k');`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `export const A = () => useMemo(() => 1, []);`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `export const A = () => <input onChange={() => {}} />;`, filename: F, errors: [{ messageId: 'required' }] },
      ],
  });
});
