/* @ag-contract-seed: S-30. Owner CMP replaces internals; exports frozen (CMP_MODULES, §4.6). */
import { createSeedComponent, createSeedCompound } from '../../contracts/seed';

export const Sheet = createSeedCompound('sheet', ['Root','Trigger','Content','Title','Description','Close','Handle']);
