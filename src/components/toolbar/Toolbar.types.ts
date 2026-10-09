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

export interface ToolbarButtonProps extends Omit<ButtonProps, 'type'> {
  /** 'low' items collapse into the trailing overflow Menu at narrow widths (REQ-CMP-40). */
  priority?: 'default' | 'low' | undefined;
}
export interface ToolbarIconButtonProps extends Omit<ButtonProps, 'type' | 'startIcon' | 'endIcon'> {
  label: string;
  icon: React.ReactNode;
  /** 'low' items collapse into the trailing overflow Menu at narrow widths (REQ-CMP-40). */
  priority?: 'default' | 'low' | undefined;
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
