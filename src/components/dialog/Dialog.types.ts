import type { ReactNode, Ref } from 'react';
import type { OverlayOpenChangeDetails } from '../overlays/_shared/overlayTypes';

/** BU render-prop shape, declared locally — .types.ts no headless-lib imports allowed here. */
export type RenderProp = import('react').ReactElement | ((props: any, state?: any) => import('react').ReactElement);

export type DialogSize = 'sm' | 'md' | 'lg';

/** Wide gallery layouts and edge-to-edge fullscreen are appearances, not sizes. */
export type DialogAppearance = 'default' | 'wide' | 'fullscreen';
export type DialogPlacement = 'center' | 'top';
export type DialogVariant = 'regular' | 'identity';

export interface DialogRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: ((open: boolean, details: OverlayOpenChangeDetails) => void) | undefined;
  /** 'trap-focus' keeps the focus trap without scroll-lock or outside-press inert. */
  modal?: boolean | 'trap-focus';
  /** Outside press closes; `false` maps to BU disablePointerDismissal. */
  dismissible?: boolean;
  /** Localisable strings. */
  labels?: { close?: string };
  children?: ReactNode;
}

export interface DialogTriggerProps {
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
  [key: string]: unknown;
}

export interface DialogCloseProps {
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
  [key: string]: unknown;
}

export interface DialogPortalProps {
  children?: ReactNode;
  keepMounted?: boolean;
}

export interface DialogBackdropProps {
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export interface DialogPopupProps {
  size?: DialogSize;
  appearance?: DialogAppearance;
  placement?: DialogPlacement;
  /** 'identity' carries the product shell variant; 'regular' is the default overlay material. */
  variant?: DialogVariant;
  prominent?: boolean;
  /** BU initialFocus — ref, element getter, or boolean; default first tabbable in Body else popup. */
  initialFocus?: unknown;
  /** BU finalFocus — ref, element getter, or boolean. */
  finalFocus?: unknown;
  /** BU render prop — accepts <form/>; submitting a form inside does not close the dialog. */
  render?: RenderProp;
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
  [key: string]: unknown;
}

export interface DialogTitleProps {
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLHeadingElement>;
  [key: string]: unknown;
}

export interface DialogDescriptionProps {
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLParagraphElement>;
  [key: string]: unknown;
}

export interface DialogLayoutProps {
  children?: ReactNode;
  className?: string;
  padding?: 'default' | 'none';
}

export interface DialogContentProps extends DialogPopupProps {
  keepMounted?: boolean;
  /** Set false to opt out of the backdrop even when modal (default: render when modal). */
  backdrop?: boolean;
}
