/* CMP-262..264 (REQ-CMP-97/98/85/22): Popover prop types. BU render-prop
   shapes are declared locally — .types.ts has no headless-lib imports
   (foundation pattern). */
import type * as React from 'react';
import type { OverlayOpenChangeDetails } from '../overlays/_shared/overlayTypes';

type RenderProp = React.ReactElement | ((props: any) => React.ReactElement);

export interface PopoverRootProps {
  open?: boolean | undefined;
  defaultOpen?: boolean;
  onOpenChange?: ((open: boolean, details: OverlayOpenChangeDetails) => void) | undefined;
  /** Modal behaviour; non-modal is the default for anchored overlays. */
  modal?: boolean | 'trap-focus' | undefined;
  children?: React.ReactNode;
}

export interface PopoverTriggerProps extends React.HTMLAttributes<HTMLElement> {
  render?: RenderProp | undefined;
  /** Hover-to-open mode (the HoverCard successor). Default false. */
  openOnHover?: boolean | undefined;
  /** Hover open delay ms — default 300. */
  delay?: number | undefined;
  /** Hover close delay ms — default 150. */
  closeDelay?: number | undefined;
  children?: React.ReactNode;
}

export interface PopoverPortalProps {
  children?: React.ReactNode;
  keepMounted?: boolean | undefined;
}

export interface PopoverPositionerProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: RenderProp | undefined;
  side?: 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end' | undefined;
  align?: 'start' | 'center' | 'end' | undefined;
  sideOffset?: number | undefined;
  collisionPadding?: number | undefined;
  /** External anchor element (Tour step targets, hovercards) — BU forwards it to
      the positioner's anchor resolution. */
  anchor?: Element | null | undefined;
  children?: React.ReactNode;
}

export interface PopoverPopupProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: RenderProp | undefined;
  /** REQ-CMP-78: per-instance overlay material is limited to 'regular' (default) | 'identity'. */
  variant?: 'regular' | 'identity' | undefined;
  /** REQ-CMP-78: prominent overlay material (honoured on Dialog and Popover only). */
  prominent?: boolean | undefined;
  initialFocus?: React.RefObject<HTMLElement | null> | ((openType: string) => HTMLElement | null | undefined) | undefined;
  finalFocus?: React.RefObject<HTMLElement | null> | ((closeType: string) => HTMLElement | null | undefined) | undefined;
  children?: React.ReactNode;
}

export interface PopoverArrowProps extends React.HTMLAttributes<HTMLElement> {
  render?: RenderProp | undefined;
}

export interface PopoverTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  render?: RenderProp | undefined;
  children?: React.ReactNode;
}

export interface PopoverDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  render?: RenderProp | undefined;
  children?: React.ReactNode;
}

export interface PopoverCloseProps extends React.HTMLAttributes<HTMLElement> {
  render?: RenderProp | undefined;
  children?: React.ReactNode;
}
