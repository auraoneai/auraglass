/* CMP-114 compat: GlassConnectionStatus (4.x) -> Badge (5.0), DEP-C0238.
   warnDeprecated fires at call time, once per page load per symbol;
   unmappable props drop with a single warning; never throws.
   Mapping:
   - status online|slow|offline -> Badge intent success|warning|danger;
     status 'auto' (the 4.x default) reads navigator.onLine and
     navigator.connection.effectiveType (slow-2g/2g -> slow) after mount and
     follows the window online/offline and connection change events, as 4.x
     did. SSR and the first render assume 'online', as 4.x did.
   - onStatusChange fires with the resolved status whenever it changes.
   - showText (default true) -> Badge text from `labels` (4.x defaults);
     showText=false renders a dot whose label is the same text.
   - role="status", aria-live="polite", aria-atomic="true" as in 4.x.
   Dropped: position (other than 'inline'), showQuality, size, elevation,
   animate, autoHideDelay. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Badge } from '../../../components/badge/Badge';
import type { BadgeProps } from '../../../components/badge/Badge';

const DEP = 'DEP-C0238';
const drop = (p: string) => warnDeprecated(`${DEP}.prop.${p}`);

export type GlassConnectionState = 'online' | 'offline' | 'slow';

const STATUS_INTENT: Record<GlassConnectionState, NonNullable<BadgeProps['intent']>> = {
  online: 'success',
  slow: 'warning',
  offline: 'danger',
};

const DEFAULT_LABELS: Record<GlassConnectionState, string> = {
  online: 'Online',
  offline: 'Offline',
  slow: 'Slow Connection',
};

export interface GlassConnectionStatusProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  status?: GlassConnectionState | 'auto' | undefined;
  showText?: boolean | undefined;
  showQuality?: boolean | undefined;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'inline' | undefined;
  size?: 'sm' | 'md' | 'lg' | undefined;
  elevation?: 'level1' | 'level2' | 'level3' | 'level4' | 'level5' | undefined;
  autoHideDelay?: number | undefined;
  onStatusChange?: ((status: GlassConnectionState) => void) | undefined;
  animate?: boolean | undefined;
  labels?: Partial<Record<GlassConnectionState, string>> | undefined;
}

interface NetworkInformationLike extends EventTarget {
  effectiveType?: string;
}

function readConnection(): GlassConnectionState {
  if (typeof navigator === 'undefined') return 'online';
  if (!navigator.onLine) return 'offline';
  const conn = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  const type = conn?.effectiveType;
  return type === 'slow-2g' || type === '2g' ? 'slow' : 'online';
}

export function GlassConnectionStatus({
  status: statusProp = 'auto',
  showText = true,
  showQuality,
  position,
  size,
  elevation,
  autoHideDelay,
  onStatusChange,
  animate,
  labels,
  ref,
  ...rest
}: GlassConnectionStatusProps & { ref?: React.Ref<HTMLSpanElement> | undefined }) {
  warnDeprecated(DEP);
  if (position !== undefined && position !== 'inline') drop('position');
  if (showQuality) drop('showQuality');
  if (size !== undefined) drop('size');
  if (elevation !== undefined) drop('elevation');
  if (animate !== undefined) drop('animate');
  if (autoHideDelay) drop('autoHideDelay');

  const [detected, setDetected] = React.useState<GlassConnectionState>('online');
  const status: GlassConnectionState = statusProp === 'auto' ? detected : statusProp;

  React.useEffect(() => {
    if (statusProp !== 'auto' || typeof window === 'undefined') return undefined;
    const update = () => setDetected(readConnection());
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    const conn = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
    conn?.addEventListener?.('change', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
      conn?.removeEventListener?.('change', update);
    };
  }, [statusProp]);

  const onChangeRef = React.useRef(onStatusChange);
  onChangeRef.current = onStatusChange;
  React.useEffect(() => {
    onChangeRef.current?.(status);
  }, [status]);

  const text = labels?.[status] ?? DEFAULT_LABELS[status];
  return (
    <Badge
      role="status"
      aria-live="polite"
      aria-atomic="true"
      {...rest}
      ref={ref}
      intent={STATUS_INTENT[status]}
      {...(showText ? {} : { dot: true, label: text })}
    >
      {showText ? text : null}
    </Badge>
  );
}
