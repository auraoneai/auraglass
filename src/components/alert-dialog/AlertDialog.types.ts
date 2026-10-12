import type { ReactNode, Ref } from 'react';
import type { OverlayOpenChangeDetails } from '../overlays/_shared/overlayTypes';

export type RenderProp = import('react').ReactElement | ((props: any, state?: any) => import('react').ReactElement);

export interface AlertDialogRootProps {
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the next open state when it changes. */
  onOpenChange?: ((open: boolean, details: OverlayOpenChangeDetails) => void) | undefined;
  /** @deprecated moved to <AlertDialog.Action intent='danger'> — kept as a
      fallback for one release. 'danger' styles only the Action button. */
  /** 'danger' marks a destructive confirmation. */
  intent?: 'neutral' | 'danger';
  /** Overrides for the built-in, localizable UI strings. */
  labels?: { cancel?: string; action?: string };
  /** Content rendered inside the component. */
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
  /** 'danger' tints only this Action — never the surface (REQ-CMP-91). */
  intent?: 'neutral' | 'danger';
}

export interface AlertDialogLayoutProps {
  children?: ReactNode;
  className?: string;
  padding?: 'default' | 'none';
}
