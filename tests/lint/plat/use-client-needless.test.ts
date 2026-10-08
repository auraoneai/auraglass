/* @jest-environment node */
import { tester, F } from './helpers';

const rule = require('../../../lint/rules/plat/use-client-needless.cjs');
const errs = [{ messageId: 'needless' as const }];

describe('auraglass/use-client-needless (PLAT-259)', () => {
  tester.run('use-client-needless', rule, {
      valid: [
        { code: `'use client';\nexport const A = () => { const [x] = useState(0); return <div />; };`, filename: F },
        { code: `'use client';\nexport const A = () => useEffect(() => {}, []);`, filename: F },
        { code: `'use client';\nexport const A = () => <button onClick={() => {}} />;`, filename: F },
        { code: `'use client';\nexport const A = () => window.innerWidth;`, filename: F },
        { code: `'use client';\nexport const A = () => useRef(0);`, filename: F },
        { code: `'use client';\nexport const A = () => document.body;`, filename: F },
        { code: `'use client';\nexport const A = () => useContext(X);`, filename: F },
        { code: `'use client';\nexport const A = () => <input onChange={() => {}} />;`, filename: F },
        { code: `'use client';\nexport const A = () => matchMedia('(x)');`, filename: F },
        { code: `'use client';\nexport const A = () => useMemo(() => 1, []);`, filename: F },
        { code: `'use client';\nexport const A = () => localStorage.x;`, filename: F },
        { code: `'use client';\nexport const A = () => useReducer(() => 0, 0);`, filename: F },
      ],
      invalid: [
        { code: `'use client';\nexport const x = 1;`, filename: F, errors: errs },
        { code: `'use client';\nexport const A = () => <div />;`, filename: F, errors: errs },
        { code: `'use client';\nexport type T = { a: number };`, filename: F, errors: errs },
        { code: `'use client';\nexport const cn = (a: string, b: string) => a + b;`, filename: F, errors: errs },
        { code: `'use client';\nexport * from './x';`, filename: F, errors: errs },
        { code: `'use client';\nexport const A = () => 'text';`, filename: F, errors: errs },
        { code: `'use client';\nexport const PI = 3.14;`, filename: F, errors: errs },
        { code: `'use client';\nexport default function helper() { return 42; }`, filename: F, errors: errs },
        { code: `'use client';\nexport const t = (n: number) => n.toFixed(2);`, filename: F, errors: errs },
        { code: `'use client';\nexport const list = [1, 2, 3];`, filename: F, errors: errs },
        { code: `'use client';\nexport async function load() { return null; }`, filename: F, errors: errs },
        { code: `'use client';\nexport const attrs = { 'data-ag': 'x' };`, filename: F, errors: errs },
      ],
  });
});
