/* CMP-265..269 (REQ-CMP-99/100/101/22): Tooltip prop types. */
import type * as React from 'react';
import type { OverlayOpenChangeDetails } from '../overlays/_shared/overlayTypes';

type RenderProp = React.ReactElement | ((props: any) => React.ReactElement);

export interface TooltipProviderProps {
  /** shared hover delay across tooltips — default 600 */
  delay?: number | undefined;
  /** shared close delay — default 0 */
  closeDelay?: number | undefined;
  /** skip-delay window after a tooltip closes — default 400 */
  skipDelayWindow?: number | undefined;
  children?: React.ReactNode;
}

export interface TooltipRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: ((open: boolean, details: OverlayOpenChangeDetails) => void) | undefined;
  children?: React.ReactNode;
}

export interface TooltipTriggerProps extends React.HTMLAttributes<HTMLElement> {
  render?: RenderProp | undefined;
  children?: React.ReactNode;
}

export interface TooltipPortalProps {
  children?: React.ReactNode;
  keepMounted?: boolean | undefined;
}

export interface TooltipPositionerProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: RenderProp | undefined;
  side?: 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end' | undefined;
  align?: 'start' | 'center' | 'end' | undefined;
  sideOffset?: number | undefined;
  collisionPadding?: number | undefined;
  children?: React.ReactNode;
}

export interface TooltipPopupProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: RenderProp | undefined;
  children?: React.ReactNode;
}

export interface TooltipArrowProps extends React.HTMLAttributes<HTMLElement> {
  render?: RenderProp | undefined;
}
