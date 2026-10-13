/* User-app dependency model for docs snippet type-checking (REQ-PLAT-102).
   The from-mui migration guide's "before" sample addresses an app that
   still has @mui/material installed; this declared surface covers exactly
   the components and props that sample uses. It never ships. */
import type { CSSProperties, ComponentType, ReactNode } from 'react';

export declare const AppBar: ComponentType<{ position?: string; children?: ReactNode }>;
export declare const Toolbar: ComponentType<{ children?: ReactNode }>;
export declare const Box: ComponentType<{ sx?: CSSProperties; children?: ReactNode }>;
export declare const Button: ComponentType<{ variant?: string; children?: ReactNode }>;
