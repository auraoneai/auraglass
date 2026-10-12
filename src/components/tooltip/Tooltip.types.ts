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
  /** Hover delay override; otherwise inherits Provider (standalone default 600ms). */
  delay?: number | undefined;
  /** Hover close delay override; otherwise inherits Provider (standalone default 0ms). */
  closeDelay?: number | undefined;
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the next open state when it changes. */
  onOpenChange?: ((open: boolean, details: OverlayOpenChangeDetails) => void) | undefined;
  /** Content rendered inside the component. */
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

/** Content = Portal > Positioner > Popup (REQ-CMP-06): the placement props go to the
    positioner, `keepMounted` to the portal, everything else to the popup. */
export interface TooltipContentProps extends TooltipPopupProps,
  Pick<TooltipPositionerProps, 'side' | 'align' | 'sideOffset' | 'collisionPadding'> {
  keepMounted?: boolean | undefined;
  ref?: React.Ref<HTMLDivElement> | undefined;
}

export interface TooltipArrowProps extends React.HTMLAttributes<HTMLElement> {
  render?: RenderProp | undefined;
}
