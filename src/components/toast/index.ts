/* @ag-contract-seed: S-30. Owner CMP replaces internals; exports frozen (CMP_MODULES, §4.6). */
import { createSeedComponent, createSeedCompound } from '../../contracts/seed';

export const Toast = createSeedCompound('toast', ['Provider','Viewport','Root','Title','Description','Action','Close']);
export const useToast = () => ({
  toast: () => '', update: () => {}, dismiss: () => {},
  promise: (p: Promise<unknown>) => p, toasts: [] as const, history: null,
});
