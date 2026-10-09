/* fragments/deprecations/cmp.ts — CMP owns this file on both branches (§3.4). */
import type { DeprecationFragment } from '../../src/contracts/fragments';
export default [
  { id: 'DEP-C0028', kind: 'export', status: 'active', entry: '.', symbol: 'GlassFieldGroup', since: '4.3.0', removeIn: '5.0.0', replacement: 'Fieldset', codemod: 'canonical-names', automation: 'full', breaking: 'B5', message: '\'GlassFieldGroup\' is renamed to \'Fieldset\' in aura-glass 5.0; run `aura-glass migrate 5` (canonical-names).', doc: '#dep-dep-c0028', compat: 'GlassFieldGroup' },
] satisfies DeprecationFragment;
