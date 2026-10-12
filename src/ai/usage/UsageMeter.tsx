import * as React from 'react';
import { Meter } from '../../components/meter';
import type { AgUsage } from '../types';

export interface UsageMeterProps {
  /** Token usage to display. */
  usage: AgUsage;
  /** 'compact' hides zero token counts; 'full' lists every count. */
  format?: 'compact' | 'full' | undefined;
  /** BCP 47 locale used for formatting and parsing. */
  locale?: string | undefined;
  /** Class name merged onto the root element. */
  className?: string | undefined;
}

/** 'compact' → "1.2M"; 'full' → standard notation with grouping ("1,234,567"). */
function fmtTokens(n: number, locale: string, format: 'compact' | 'full'): string {
  return new Intl.NumberFormat(locale, format === 'full' ? { notation: 'standard' } : { notation: 'compact' }).format(n);
}

function fmtCost(usd: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 4,
  }).format(usd);
}

/**
 * REQ-SURF-126: server module (no directive, no hooks). Token counts use
 * `Intl.NumberFormat` (compact or full notation), cost is USD with ≤4
 * fraction digits. With `contextWindow`, the gauge is CMP `Meter` (the
 * client boundary: Meter.client.tsx carries 'use client'; every prop passed
 * to it is serializable) over (input+output)/contextWindow — `warning` ≥80%,
 * `critical` ≥95%, stated in text, not colour only. Meter's low/high/optimum
 * map the same thresholds to its intent (low-is-good: optimum 0).
 */
export function UsageMeter({ usage, format = 'compact', locale = 'en-US', className }: UsageMeterProps) {
  const tokens: Array<[string, number | undefined]> = [
    ['Input', usage.inputTokens],
    ['Output', usage.outputTokens],
    ['Reasoning', usage.reasoningTokens],
    ['Cached', usage.cachedInputTokens],
  ];
  const used = (usage.inputTokens ?? 0) + (usage.outputTokens ?? 0);
  const contextWindow = usage.contextWindow ?? 0;
  const hasWindow = typeof usage.contextWindow === 'number' && contextWindow > 0;
  const ratio = hasWindow ? used / contextWindow : 0;
  const level = ratio >= 0.95 ? 'critical' : ratio >= 0.8 ? 'warning' : 'normal';

  return (
    <div data-ag-part="usage-meter" data-format={format} className={className}>
      <dl data-ag-part="usage">
        {tokens.map(([label, v]) =>
          v !== undefined && (format === 'full' || v > 0) ? (
            <React.Fragment key={label}>
              <dt>{label}</dt>
              <dd>{fmtTokens(v, locale, format)}</dd>
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
        <div data-ag-part="usage-window" data-level={level}>
          <Meter
            label="Context window used"
            value={used}
            min={0}
            max={contextWindow}
            low={contextWindow * 0.8}
            high={contextWindow * 0.95}
            optimum={0}
            data-level={level}
          >
            <span data-ag-part="usage-window-text">
              {`${fmtTokens(used, locale, format)} / ${fmtTokens(contextWindow, locale, format)}`}
              {level !== 'normal' ? ` — ${level}` : ''}
            </span>
          </Meter>
        </div>
      ) : null}
    </div>
  );
}
