/* Portal (CMP-027): renders children into usePortalContainer() (the provider's
   overlay layer-root; document.body when no provider). `container` overrides.
   Null until mounted — mount flag via useSyncExternalStore so server markup is
   empty and hydration is clean. Ref-as-prop API (no forwardRef). */
import * as React from 'react';
import { createPortal } from 'react-dom';
import { usePortalContainer } from '../theme/portal';
import type { PortalLayerRoot } from '../contracts/preferences';

export interface PortalProps {
  children?: React.ReactNode;
  /** Explicit container; when omitted the provider's `layer` root is used. */
  container?: HTMLElement | null;
  /** Which provider layer-root to use when `container` is omitted. */
  layer?: PortalLayerRoot;
}

const noopSubscribe = () => () => {};
const useMounted = (): boolean =>
  React.useSyncExternalStore(noopSubscribe, () => true, () => false);

export function Portal({ children, container, layer = 'overlay' }: PortalProps): React.ReactPortal | null {
  const mounted = useMounted();
  const providerContainer = usePortalContainer(layer);
  if (!mounted) return null;
  const target = container !== undefined ? container : providerContainer;
  if (!target) return null;
  return createPortal(children, target);
}

Portal.displayName = 'Portal';
