/* CMP-037 (§4.6): Icon's frozen module path re-exports the ./icons entry's
   registry component — the glyph set itself lives under src/icons/. */
export { Icon } from '../../icons/components';
export type { IconComponentProps as IconProps } from '../../icons/types';
