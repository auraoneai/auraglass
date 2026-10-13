/* User-app dependency model for docs snippet type-checking (REQ-PLAT-102).
   The from-lucide migration guide's "before" sample addresses an app that
   still has lucide-react installed; icons there are SVG components. This
   declared surface covers exactly the icons the sample renders. */
import type { ComponentType, SVGProps } from 'react';

export type LucideIcon = ComponentType<SVGProps<SVGSVGElement>>;

export declare const Search: LucideIcon;
export declare const Settings: LucideIcon;
export declare const X: LucideIcon;
