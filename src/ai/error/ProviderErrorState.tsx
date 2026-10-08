'use client';
import * as React from 'react';
import { AiIcon } from '../icons/AiIcon';

export type AgErrorKind =
  | 'rate-limit'
  | 'auth'
  | 'network'
  | 'content-filter'
  | 'context-length'
  | 'aborted'
  | 'unknown';

export interface ProviderErrorStateProps {
  kind: AgErrorKind;
  title?: string | undefined;
  detail?: string | undefined;
  retryAfterMs?: number | undefined;
  onRetry?: (() => void) | undefined;
  variant?: 'compact' | 'panel' | undefined;
  className?: string | undefined;
}

const DEFAULT_COPY: Record<AgErrorKind, { title: string; detail: string }> = {
  'rate-limit': { title: 'Rate limit reached', detail: 'The provider throttled this request. Wait a moment, then retry.' },
  auth: { title: 'Authentication failed', detail: 'The provider rejected the credentials. Check the API key configuration.' },
  network: { title: 'Network error', detail: 'The request could not reach the provider. Check connectivity and retry.' },
  'content-filter': { title: 'Content filtered', detail: 'The provider filtered this content. Rephrase the request.' },
  'context-length': { title: 'Context too long', detail: 'The conversation exceeds the model context window. Start a new thread or trim history.' },
  aborted: { title: 'Stopped', detail: 'Generation was stopped.' },
  unknown: { title: 'Something went wrong', detail: 'The provider returned an unexpected error. Retry or contact support.' },
};

/**
 * REQ-SURF-127: per-kind copy; `role="alert"` on `panel` only; Retry button
 * disabled with a live countdown while `retryAfterMs` elapses.
 */
export function ProviderErrorState({ kind, title, detail, retryAfterMs, onRetry, variant = 'panel', className }: ProviderErrorStateProps) {
  const copy = DEFAULT_COPY[kind];
  const [remaining, setRemaining] = React.useState(retryAfterMs ?? 0);
  React.useEffect(() => {
    setRemaining(retryAfterMs ?? 0);
  }, [retryAfterMs]);
  React.useEffect(() => {
    if (!retryAfterMs) return;
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1000)), 1000);
    return () => clearInterval(t);
  }, [retryAfterMs]);

  const seconds = Math.ceil(remaining / 1000);
  return (
    <div
      data-ag-part="provider-error"
      data-kind={kind}
      data-variant={variant}
      role={variant === 'panel' ? 'alert' : undefined}
      className={className}
    >
      <AiIcon name="stop" />
      <div>
        <p data-ag-part="error-title">{title ?? copy.title}</p>
        <p data-ag-part="error-detail">{detail ?? copy.detail}</p>
        {onRetry ? (
          <button
            type="button"
            data-ag-part="retry"
            disabled={remaining > 0}
            onClick={onRetry}
          >
            {remaining > 0 ? `Retry in ${seconds}…` : 'Retry'}
          </button>
        ) : null}
      </div>
    </div>
  );
}
