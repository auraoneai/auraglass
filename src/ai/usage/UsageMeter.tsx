import * as React from 'react';
import type { AgUsage } from '../types';

export interface UsageMeterProps {
  usage: AgUsage;
  format?: 'compact' | 'full' | undefined;
  locale?: string | undefined;
  className?: string | undefined;
}

function fmtTokens(n: number, locale: string): string {
  return new Intl.NumberFormat(locale, { notation: 'compact' }).format(n);
}

function fmtCost(usd: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 4,
  }).format(usd);
}

/**
 * REQ-SURF-126: server-safe usage meter. With `contextWindow`, renders a
 * `role="meter"` gauge over (input+output)/contextWindow — `warning` ≥80%,
 * `critical` ≥95% (text, not colour only).
 */
export function UsageMeter({ usage, format = 'compact', locale = 'en-US', className }: UsageMeterProps) {
  const tokens: Array<[string, number | undefined]> = [
    ['Input', usage.inputTokens],
    ['Output', usage.outputTokens],
    ['Reasoning', usage.reasoningTokens],
    ['Cached', usage.cachedInputTokens],
  ];
  const used = (usage.inputTokens ?? 0) + (usage.outputTokens ?? 0);
  const hasWindow = typeof usage.contextWindow === 'number' && usage.contextWindow > 0;
  const ratio = hasWindow ? used / (usage.contextWindow ?? 1) : 0;
  const level = ratio >= 0.95 ? 'critical' : ratio >= 0.8 ? 'warning' : 'normal';

  return (
    <div data-ag-part="usage-meter" data-format={format} className={className}>
      <dl data-ag-part="usage">
        {tokens.map(([label, v]) =>
          v !== undefined && (format === 'full' || v > 0) ? (
            <React.Fragment key={label}>
              <dt>{label}</dt>
              <dd>{fmtTokens(v, locale)}</dd>
            </React.Fragment>
          ) : null,
        )}
        {usage.costUsd !== undefined ? (
          <React.Fragment>
            <dt>Cost</dt>
            <dd>{fmtCost(usage.costUsd, locale)}</dd>
          </React.Fragment>
        ) : null}
      </dl>
      {hasWindow ? (
        <div
          role="meter"
          data-ag-part="usage-window"
          data-level={level}
          aria-valuemin={0}
          aria-valuemax={usage.contextWindow}
          aria-valuenow={used}
          aria-label="Context window used"
        >
          <span data-ag-part="usage-window-text">
            {`${fmtTokens(used, locale)} / ${fmtTokens(usage.contextWindow ?? 0, locale)}`}
            {level !== 'normal' ? ` — ${level}` : ''}
          </span>
        </div>
      ) : null}
    </div>
  );
}
