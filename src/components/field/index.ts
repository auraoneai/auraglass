/* @ag-contract-seed: S-30. Owner CMP replaces internals; exports frozen (CMP_MODULES, §4.6). */
import { createSeedComponent, createSeedCompound } from '../../contracts/seed';

export const Field = createSeedCompound('field', ['Root','Label','Control','Description','Error']);
export const Fieldset = createSeedComponent('fieldset', 'fieldset');
export const Form = createSeedComponent('form', 'form');
