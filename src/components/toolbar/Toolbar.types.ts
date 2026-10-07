import type * as React from 'react';
import type { MaterialBearingProps, RenderProp } from '../../contracts/components';
import type { ButtonProps } from '../button/Button.types';

/** @tier Certified. */
export interface ToolbarRootProps extends MaterialBearingProps {
  orientation?: 'horizontal' | 'vertical' | undefined;
  /** Roving-focus loop (default true). */
  loop?: boolean | undefined;
  /** Required accessible name. */
  'aria-label': string;
  className?: string | undefined;
  children?: React.ReactNode;
  render?: RenderProp | undefined;
  ref?: React.Ref<HTMLDivElement> | undefined;
}

export interface ToolbarButtonProps extends Omit<ButtonProps, 'type'> {}
export interface ToolbarIconButtonProps extends Omit<ButtonProps, 'type' | 'startIcon' | 'endIcon'> {
  label: string;
  icon: React.ReactNode;
}

export interface ToolbarGroupProps {
  className?: string | undefined;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement> | undefined;
}

export interface ToolbarSeparatorProps {
  orientation?: 'horizontal' | 'vertical' | undefined;
  className?: string | undefined;
  ref?: React.Ref<HTMLDivElement> | undefined;
}

export interface ToolbarLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'onChange'> {
  className?: string | undefined;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLAnchorElement> | undefined;
}
