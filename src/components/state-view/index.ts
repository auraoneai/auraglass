/* @ag-contract-seed: S-30. Owner CMP replaces internals; exports frozen (CMP_MODULES, §4.6). */
import { createSeedComponent, createSeedCompound } from '../../contracts/seed';

export const EmptyState = createSeedComponent('empty-state', 'div');
export const ErrorState = createSeedComponent('error-state', 'div');
export const LoadingState = createSeedComponent('loading-state', 'div');
