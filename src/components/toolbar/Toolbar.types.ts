import type * as React from 'react';
import type { MaterialBearingProps, RenderProp } from '../../contracts/components';
import type { ButtonProps } from '../button/Button.types';

/** @tier Certified. */
export interface ToolbarRootProps extends MaterialBearingProps {
  /** Layout direction; also the arrow-key axis. */
  orientation?: 'horizontal' | 'vertical' | undefined;
  /** SurfaceGroup spacing token on the root (the root IS the surface — REQ-CMP-37). */
  spacing?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16' | undefined;
  /** Roving-focus loop (default true). */
  loop?: boolean | undefined;
  /** Required accessible name. */
  'aria-label': string;
  /** Class name merged onto the root element. */
  className?: string | undefined;
  /** Content rendered inside the component. */
  children?: React.ReactNode;
  /** Replaces the rendered element; the component props and state are merged onto it. */
  render?: RenderProp | undefined;
  /** Ref to the rendered root element. */
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
