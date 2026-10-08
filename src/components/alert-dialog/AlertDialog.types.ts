import type { ReactNode, Ref } from 'react';
import type { OverlayOpenChangeDetails } from '../overlays/_shared/overlayTypes';

export type RenderProp = import('react').ReactElement | ((props: any, state?: any) => import('react').ReactElement);

export interface AlertDialogRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: ((open: boolean, details: OverlayOpenChangeDetails) => void) | undefined;
  /** 'danger' styles only the Action button — never the surface. */
  intent?: 'neutral' | 'danger';
  labels?: { cancel?: string; action?: string };
  children?: ReactNode;
}

export interface AlertDialogTriggerProps {
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
  [key: string]: unknown;
}

export interface AlertDialogPopupProps {
  render?: RenderProp;
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
  [key: string]: unknown;
}

export interface AlertDialogContentProps extends AlertDialogPopupProps {
  keepMounted?: boolean;
  backdrop?: boolean;
}

export interface AlertDialogButtonishProps {
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLElement>;
  /** Element-specific casts happen at the BU boundary. */
  [key: string]: unknown;
}

export interface AlertDialogActionProps extends AlertDialogButtonishProps {
  onClick?: (e: unknown) => void;
}

export interface AlertDialogLayoutProps {
  children?: ReactNode;
  className?: string;
  padding?: 'default' | 'none';
}
