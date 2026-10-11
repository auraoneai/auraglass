import type * as React from 'react';
import type { ButtonProps } from '../button/Button.types';

/** @tier Certified. Icon-only button sharing the Button chunk. */
export interface IconButtonProps extends Omit<ButtonProps, 'startIcon' | 'endIcon' | 'loading' | 'children'> {
  /** Required accessible name (emitted as aria-label; dev console.error when empty). */
  label: string;
  /** The icon node. */
  icon: React.ReactNode;
  /** 'capsule' (default) = fully rounded, 'fixed' = component radius. */
  shape?: 'capsule' | 'fixed' | undefined;
}
