/* ./icons entry (CMP-037): Icon registry component + createIcon + per-glyph
   modules via category barrels. No createGlassIcon/Glass* aliases (PRD-18 compat). */
export { Icon, iconRegistry } from './components';
export { createIcon } from './createIcon';
export type { IconComponent, IconComponentProps, IconNode, IconProps } from './types';
export * from './action';
export * from './ai';
export * from './collaboration';
export * from './commerce';
export * from './data';
export * from './media';
export * from './navigation';
export * from './status';
