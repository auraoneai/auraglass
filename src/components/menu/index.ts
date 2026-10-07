/* @ag-contract-seed: S-30. Owner CMP replaces internals; exports frozen (CMP_MODULES, §4.6). */
import { createSeedComponent, createSeedCompound } from '../../contracts/seed';

export const Menu = createSeedCompound('menu', ['Root','Trigger','Content','Item','CheckboxItem','RadioGroup','RadioItem','Group','GroupLabel','Separator','Submenu','SubmenuTrigger']);
export const ContextMenu = createSeedCompound('context-menu', ['Root','Trigger','Content','Item','Group','GroupLabel','Separator']);
export const Menubar = createSeedCompound('menubar', ['Root','Menu']);
