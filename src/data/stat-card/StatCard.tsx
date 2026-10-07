/* StatCard (SURF-176, REQ-SURF-90): server component. Whole card is one link
   when href is set; nested interactive children are a dev error. Trend is an
   aria-hidden arrow plus hidden text. */
import * as React from 'react';
import { Sparkline } from '../sparkline/Sparkline';

export interface StatCardProps {
  label: string;
  value: number | React.ReactNode;
  format?: Intl.NumberFormatOptions | undefined;
  locale?: string | undefined;
  delta?: number | undefined;
  deltaFormat?: Intl.NumberFormatOptions | undefined;
  deltaLabel?: string | undefined;
  trendDirection?: 'up-is-good' | 'down-is-good' | 'neutral' | undefined;
  sparkline?: readonly number[] | undefined;
  description?: React.ReactNode;
  loading?: boolean | undefined;
  href?: string | undefined;
  children?: React.ReactNode;
  labels?: { up?: string | undefined; down?: string | undefined; unchanged?: string | undefined } | undefined;
}

export function StatCard({
  label,
  value,
  format,
  locale = 'en-US',
  delta,
  deltaFormat = { style: 'percent', signDisplay: 'exceptZero', maximumFractionDigits: 1 },
  deltaLabel = 'vs previous period',
  trendDirection = 'neutral',
  sparkline,
  description,
  loading = false,
  href,
  children,
  labels,
}: StatCardProps) {
  // Server component: no hooks. Id derives from the label text so SSR/CSR agree.
  const id = `ag-stat-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'card'}`;
  if (process.env['NODE_ENV'] === 'development' && href !== undefined && children !== undefined) {
    const hasInteractive = React.Children.toArray(children).some(
      (c) => React.isValidElement(c) && ['button', 'a', 'input', 'select'].includes(String(c.type)),
    );
    if (hasInteractive) {
      console.error('[auraglass] StatCard: nested interactive children are not allowed inside a linked card.');
    }
  }
  const fmt = new Intl.NumberFormat(locale, format);
  const deltaFmt = new Intl.NumberFormat(locale, deltaFormat);
  const valueNode = typeof value === 'number' ? fmt.format(value) : value;
  const trend = delta === undefined ? null : delta > 0 ? 'up' : delta < 0 ? 'down' : 'unchanged';
  const intent =
    trendDirection === 'neutral'
      ? 'neutral'
      : trend === null || trend === 'unchanged'
        ? 'neutral'
        : trendDirection === 'up-is-good'
          ? trend === 'up' ? 'success' : 'danger'
          : trend === 'down' ? 'success' : 'danger';
  const up = labels?.up ?? 'Up';
  const down = labels?.down ?? 'Down';
  const unchanged = labels?.unchanged ?? 'Unchanged';
  const trendText =
    delta === undefined
      ? null
      : `${trend === 'up' ? up : trend === 'down' ? down : unchanged} ${deltaFmt.format(Math.abs(delta) * (deltaFormat.style === 'percent' ? 1 : 1))} ${deltaLabel}`;

  const body = (
    <>
      <span data-ag-part="stat-card-label" className="ag-stat-card__label" id={`${id}-label`}>
        {label}
      </span>
      <span data-ag-part="stat-card-value" className="ag-stat-card__value" data-state={loading ? 'loading' : undefined}>
        {loading ? '—' : valueNode}
      </span>
      {trendText !== null ? (
        <span data-ag-part="stat-card-delta" data-ag-intent={intent} className="ag-stat-card__delta">
          <span aria-hidden="true" className={`ag-stat-card__arrow ag-stat-card__arrow--${trend}`}>
            {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '◆'}
          </span>
          <span className="ag-visually-hidden">{trendText}</span>
          <span aria-hidden="true">{deltaFmt.format(delta!)}</span>
        </span>
      ) : null}
      {sparkline !== undefined && sparkline.length > 0 ? (
        <span data-ag-part="stat-card-sparkline" className="ag-stat-card__sparkline">
          <Sparkline data={[...sparkline]} label={label} locale={locale} aria-hidden />
        </span>
      ) : null}
      {description !== undefined && description !== null ? (
        <span data-ag-part="stat-card-description" className="ag-stat-card__description">
          {description}
        </span>
      ) : null}
      {children}
    </>
  );

  if (href !== undefined) {
    return (
      <a href={href} data-ag-part="stat-card" data-ag-intent={intent} className="ag-stat-card" aria-labelledby={`${id}-label`}>
        {body}
      </a>
    );
  }
  return (
    <article data-ag-part="stat-card" data-ag-intent={intent} className="ag-stat-card" aria-labelledby={`${id}-label`}>
      {body}
    </article>
  );
}
