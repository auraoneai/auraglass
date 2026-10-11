import type { DeprecationFragment } from '../../../src/contracts/fragments';
export default [
  {
    id: 'DEP-P0001', kind: 'export', status: 'active', entry: '.', symbol: 'GlassButton',
    since: '4.2.0', removeIn: '5.0.0', replacement: 'Button', codemod: 'canonical-names',
    automation: 'full', breaking: 'B1',
    message: 'GlassButton was renamed to Button (§16 B1).', doc: '#dep-p0001', compat: 'GlassButton',
  },
] satisfies DeprecationFragment;
