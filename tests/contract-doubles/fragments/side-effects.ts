import type { SideEffectException } from '../../../src/contracts/fragments';
export default [
  { module: 'src/theme/index.ts', reason: 'binds the Escape dispatcher on first import (S-25)', expires: '5.1.0' },
] satisfies SideEffectException[];
