import * as React from 'react';
import type { AgChatStatus } from '../types';
import { useAnnouncer } from '../../theme';

export interface StatusAnnouncementLabels {
  /** Polite, on the transition into `submitted`. Default "Sending". */
  sending?: string | undefined;
  /** Assertive, on the transition into `error`. Default "Response failed". */
  error?: string | undefined;
}

/**
 * REQ-SURF-113 (AI §4.5): chat-status transitions announce once each through
 * the MAT announcer — `submitted` → "Sending" (polite), `error` (assertive).
 * The initial status is not announced; only changes are. Other transitions
 * (`streaming`, `ready`) are silent: the streamed text has its own policy.
 */
export function useStatusAnnouncements(status: AgChatStatus, labels: StatusAnnouncementLabels = {}): void {
  const { announce } = useAnnouncer();
  const previous = React.useRef(status);
  const { sending = 'Sending', error = 'Response failed' } = labels;
  React.useEffect(() => {
    if (previous.current === status) return;
    previous.current = status;
    if (status === 'submitted') announce(sending);
    else if (status === 'error') announce(error, { politeness: 'assertive' });
  }, [status, sending, error, announce]);
}
