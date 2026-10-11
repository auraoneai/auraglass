/* @jest-environment node */
import { describe } from '@jest/globals';
import { tester, F } from './helpers';

const boundary = require('../../../lint/rules/plat/contract-boundary.cjs');
const legacy = require('../../../lint/rules/plat/no-legacy-import.cjs');

describe('auraglass/contract-boundary (PLAT-259)', () => {
  tester.run('contract-boundary', boundary, {
      valid: [
        { code: `import { cn } from '@/internal';`, filename: F },
        { code: `import { Button } from 'aura-glass/primitives';`, filename: F },
        { code: `import { T } from '../tokens';`, filename: F },
        { code: `import { X } from './sibling';`, filename: F },
        { code: `import { contractsDir } from 'x';`, filename: 'scripts/build/x.ts' },
        { code: `export { tokens } from 'aura-glass/tokens';`, filename: F },
        { code: `const m = await import('aura-glass/data');`, filename: F },
        { code: `import type { X } from 'aura-glass';`, filename: F },
        // src/contracts/** is a §4 module path (CMP R3, SURF import list).
        { code: `import type { AgPart } from '../../contracts/components';`, filename: 'src/components/tabs/Tabs.tsx' },
        { code: `import { PREFS } from '../contracts/preferences';`, filename: 'src/primitives/Portal.tsx' },
      ],
      invalid: [
        { code: `import { stub } from 'contracts/stubs/reference';`, filename: F, errors: [{ messageId: 'stub' }] },
        { code: `import { seed } from '../../stubs/x';`, filename: F, errors: [{ messageId: 'stub' }] },
        { code: `import { fr } from 'src/contracts/fragments';`, filename: F, errors: [{ messageId: 'boundary' }] },
        { code: `const x = await import('contracts/x');`, filename: F, errors: [{ messageId: 'boundary' }] },
        { code: `import { y } from './x.stub.ts';`, filename: F, errors: [{ messageId: 'boundary' }] },
        // relative path escaping src/ into the repo-root contracts/ dir
        { code: `import o from '../../../contracts/ownership.json';`, filename: 'src/components/tabs/Tabs.tsx', errors: [{ messageId: 'boundary' }] },
        { code: `export { z } from 'contracts/stubs/ref';`, filename: F, errors: [{ messageId: 'stub' }] },
      ],
  });
});

describe('auraglass/no-legacy-import (PLAT-259)', () => {
  tester.run('no-legacy-import', legacy, {
      valid: [
        { code: `import { Button } from 'aura-glass/primitives';`, filename: F },
        { code: `import { tokens } from 'aura-glass/tokens';`, filename: F },
        { code: `import { x } from './sibling';`, filename: F },
        { code: `import { components } from 'some-pkg';`, filename: F },
        { code: `import { L } from 'aura-glass/components';`, filename: 'scripts/x.ts' },
      ],
      invalid: [
        { code: `import { Button } from 'aura-glass/components';`, filename: F, errors: [{ messageId: 'legacy' }] },
        { code: `import 'aura-glass/styles';`, filename: F, errors: [{ messageId: 'legacy' }] },
        { code: `import { x } from 'aura-glass/index';`, filename: F, errors: [{ messageId: 'legacy' }] },
        { code: `import { y } from '@ag/legacy';`, filename: F, errors: [{ messageId: 'legacy' }] },
        { code: `import { z } from 'ag-legacy/pkg';`, filename: F, errors: [{ messageId: 'legacy' }] },
      ],
  });
});
