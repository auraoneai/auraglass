/* @jest-environment node */
import { tester, F } from './helpers';

const rule = require('../../../lint/rules/plat/use-client-required.cjs');
const req = (what: string) => ({ messageId: 'required' as const, data: { what } });

describe('auraglass/use-client-required (PLAT-259/REQ-PLAT-69)', () => {
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
        { code: `import { useState as u } from 'not-react';\nexport const A = () => u(0);`, filename: F },       // same name, non-signal source
        { code: `export const A = () => <button onClick={undefined} />;`, filename: F },             // no function passed
        { code: `const o = { window: 1 };\nexport const A = () => o.window;`, filename: F },          // property key, not the global
      ],
      invalid: [
        { code: `import { useState } from 'react';\nexport const A = () => { const [x] = useState(0); return <div />; };`, filename: F, errors: [req('call to useState()')] },
        { code: `import { useEffect } from 'react';\nexport const A = () => useEffect(() => {}, []);`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `export const A = () => <button onClick={() => {}} />;`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `export const A = () => window.innerWidth;`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `export const A = () => document.body;`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `import { useContext } from 'react';\nexport const A = () => { useContext(X); return null; };`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `import { useRef } from 'react';\nexport const A = () => { const r = useRef(0); return <div ref={r} />; };`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `import { useReducer } from 'react';\nexport const A = () => useReducer((s: number) => s + 1, 0);`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `export const A = () => navigator.userAgent;`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `export const A = () => localStorage.getItem('k');`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `export const A = () => matchMedia('(x)');`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `export const A = () => new ResizeObserver(() => {});`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `export const A = () => new IntersectionObserver(() => {});`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `import { useId } from 'react';\nexport const A = () => useId();`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `import { createContext } from 'react';\nexport const C = createContext(0);`, filename: F, errors: [{ messageId: 'required' }] },
        { code: `import { useThing } from '@base-ui/react/use-thing';\nexport const A = () => useThing();`, filename: F, errors: [{ messageId: 'required' }] },
      ],
  });
});
