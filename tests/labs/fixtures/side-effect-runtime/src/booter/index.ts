// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
// The timer is started through a local helper, so no module-scope statement
// names a DOM global or timer API; only the real Node import catches it.
import { boot } from './boot';
boot();
export const Booter = () => null;
