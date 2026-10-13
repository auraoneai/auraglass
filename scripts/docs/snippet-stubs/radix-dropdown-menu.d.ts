/* User-app dependency model for docs snippet type-checking (REQ-PLAT-102).
   The from-radix migration guide's "before" sample addresses an app that
   still has @radix-ui/react-dropdown-menu installed; this declared surface
   covers exactly the compound parts that sample composes. */
import type { ComponentType, ReactNode } from 'react';

type Part = ComponentType<{ children?: ReactNode }>;

export declare const Root: Part;
export declare const Trigger: Part;
export declare const Content: Part;
export declare const Item: Part;
