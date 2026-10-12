'use client';
import * as React from 'react';
import { AiIcon } from '../icons/AiIcon';
import { Button } from '../../components/button';

export type AgErrorKind =
  | 'rate-limit'
  | 'auth'
  | 'network'
  | 'content-filter'
  | 'context-length'
  | 'aborted'
  | 'unknown';

export interface ProviderErrorStateProps {
  /** Provider error class; selects the default title, detail and retry affordance. */
  kind: AgErrorKind;
  /** Overrides the default title for `kind`. */
  title?: string | undefined;
  /** Overrides the default explanation for `kind`. */
  detail?: string | undefined;
  /** Milliseconds until a retry is allowed; Retry stays disabled and a countdown is shown until then. */
  retryAfterMs?: number | undefined;
  /** Called when the user presses Retry; Retry is hidden when omitted. */
  onRetry?: (() => void) | undefined;
  /** Non-material look (S-30): emitted as data-ag-appearance. Default 'panel'. */
  appearance?: 'compact' | 'panel' | undefined;
  /** Class name merged onto the root element. */
  className?: string | undefined;
}

export const DEFAULT_COPY: Record<AgErrorKind, { title: string; detail: string }> = {
  'rate-limit': { title: 'Rate limit reached', detail: 'The provider throttled this request. Wait a moment, then retry.' },
  auth: { title: 'Authentication failed', detail: 'The provider rejected the credentials. Check the API key configuration.' },
  network: { title: 'Network error', detail: 'The request could not reach the provider. Check connectivity and retry.' },
  'content-filter': { title: 'Content filtered', detail: 'The provider filtered this content. Rephrase the request.' },
  'context-length': { title: 'Context too long', detail: 'The conversation exceeds the model context window. Start a new thread or trim history.' },
  aborted: { title: 'Stopped', detail: 'Generation was stopped.' },
  unknown: { title: 'Something went wrong', detail: 'The provider returned an unexpected error. Retry or contact support.' },
};

/**
 * REQ-SURF-127: per-kind copy; `role="alert"` on the `panel` appearance only; Retry is the
 * CMP `Button`, disabled with a live countdown while `retryAfterMs` elapses.
 */
export function ProviderErrorState({ kind, title, detail, retryAfterMs, onRetry, appearance = 'panel', className }: ProviderErrorStateProps) {
  const copy = DEFAULT_COPY[kind];
  const [remaining, setRemaining] = React.useState(retryAfterMs ?? 0);
  React.useEffect(() => {
    setRemaining(retryAfterMs ?? 0);
  }, [retryAfterMs]);
  // REQ-SURF-190 / REQ-MAT-51: one 1 s timeout per remaining second (no
  // component-owned interval loop); a settled error state (Retry enabled)
  // keeps no timer pending.
  React.useEffect(() => {
    if (remaining <= 0) return;
    const t = setTimeout(() => setRemaining((r) => Math.max(0, r - 1000)), 1000);
    return () => clearTimeout(t);
  }, [remaining]);

  const seconds = Math.ceil(remaining / 1000);
  return (
    <div
      data-ag-part="provider-error"
      data-kind={kind}
      data-ag-appearance={appearance}
      role={appearance === 'panel' ? 'alert' : undefined}
      className={className}
    >
      <AiIcon name="stop" />
      <div>
        <p data-ag-part="error-title">{title ?? copy.title}</p>
        <p data-ag-part="error-detail">{detail ?? copy.detail}</p>
        {onRetry ? (
          <Button
            data-ag-part="retry"
            type="button"
            size="sm"
            suppressInnerParts
            disabled={remaining > 0}
            onClick={() => { if (remaining <= 0) onRetry(); }}
          >
            {remaining > 0 ? `Retry in ${seconds}…` : 'Retry'}
            {/* REQ-SURF-192: MAT hit area on the SURF retry part (suppressInnerParts drops the Button's own part attrs) */}
            <span data-ag-part="hit-area" aria-hidden="true" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
