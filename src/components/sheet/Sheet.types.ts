import type { ReactNode, Ref } from 'react';
import type { OverlayOpenChangeDetails } from '../overlays/_shared/overlayTypes';
import type { SheetDetent } from './useSheetDetents';

export type RenderProp = import('react').ReactElement | ((props: any, state?: any) => import('react').ReactElement);

/** start/end flip under dir=rtl; left/right never flip. */
export type SheetSide = 'start' | 'end' | 'top' | 'bottom' | 'left' | 'right';
export type SheetPreset = 'panel' | 'action';

export interface SheetRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: ((open: boolean, details: OverlayOpenChangeDetails) => void) | undefined;
  /** Anchored edge; 'start'/'end' resolve against the text direction. */
  side?: SheetSide;
  /** 'action' forces side=bottom and composes Sheet.Action items + a separated cancel. */
  preset?: SheetPreset;
  modal?: boolean;
  dismissible?: boolean;
  /** Detents as fractions of 100dvh plus 'content' and 'full'. */
  detents?: SheetDetent[];
  detent?: number;
  defaultDetent?: number;
  onDetentChange?: (index: number) => void;
  labels?: { close?: string; handle?: string; detents?: string[] };
  children?: ReactNode;
}

export interface SheetTriggerProps {
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
  [key: string]: unknown;
}

export interface SheetPopupProps {
  /** side sheets: 320/400/560px, capped at calc(100vw - 48px). */
  size?: 'sm' | 'md' | 'lg';
  render?: RenderProp;
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
  [key: string]: unknown;
}

export interface SheetContentProps extends SheetPopupProps {
  keepMounted?: boolean;
  backdrop?: boolean;
}

export interface SheetButtonishProps {
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLElement>;
  /** Element-specific casts happen at the BU boundary. */
  [key: string]: unknown;
}

export interface SheetActionProps extends SheetButtonishProps {
  onClick?: (e: unknown) => void;
}

export interface SheetLayoutProps {
  children?: ReactNode;
  className?: string;
  padding?: 'default' | 'none';
}
