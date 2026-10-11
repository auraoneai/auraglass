/* StatCard (SURF-176, REQ-SURF-90): server component (React.useId is the one
   hook legal in RSC). Whole card is one link when href is set; nested
   interactive descendants (deep walk) are a dev error. Trend is an
   aria-hidden arrow plus hidden text. */
import * as React from 'react';
import { Sparkline } from '../sparkline/Sparkline';

export interface StatCardProps {
  /** Id base for the card's labelledby target; defaults to a React.useId id
      so two cards with the same label never share an id. */
  id?: string | undefined;
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

const INTERACTIVE_TAGS = new Set(['a', 'button', 'input', 'select', 'textarea', 'details', 'summary', 'iframe', 'audio', 'video']);

/** Deep-walks a React children tree (host elements and the props of
    component elements) for anything focusable or activatable. */
function hasInteractiveDescendant(node: React.ReactNode): boolean {
  let found = false;
  const visit = (n: React.ReactNode) => {
    if (found) return;
    React.Children.forEach(n, (c) => {
      if (found || !React.isValidElement(c)) return;
      const props = c.props as Record<string, unknown>;
      if (
        (typeof c.type === 'string' && INTERACTIVE_TAGS.has(c.type)) ||
        typeof props['href'] === 'string' ||
        typeof props['onClick'] === 'function' ||
        (typeof props['tabIndex'] === 'number' && props['tabIndex'] >= 0) ||
        props['contentEditable'] === true || props['contentEditable'] === 'true'
      ) {
        found = true;
        return;
      }
      visit(props['children'] as React.ReactNode);
    });
  };
  visit(node);
  return found;
}

export function StatCard({
  id: idProp,
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
  // useId is deterministic across SSR/CSR and unique per card instance.
  const autoId = React.useId();
  const id = idProp ?? `ag-stat-${autoId.replace(/[^A-Za-z0-9_-]/g, '')}`;
  if (
    process.env['NODE_ENV'] === 'development' &&
    href !== undefined &&
    (hasInteractiveDescendant(children) || hasInteractiveDescendant(description))
  ) {
    console.error('[auraglass] StatCard: nested interactive children are not allowed inside a linked card.');
  }
  const fmt = new Intl.NumberFormat(locale, format);
  const deltaFmt = new Intl.NumberFormat(locale, deltaFormat);
  // The hidden trend text carries direction in words ("Up 12.5% …"), so its
  // magnitude is unsigned regardless of deltaFormat.signDisplay.
  const magnitudeFmt = new Intl.NumberFormat(locale, { ...deltaFormat, signDisplay: 'never' });
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
      : `${trend === 'up' ? up : trend === 'down' ? down : unchanged} ${magnitudeFmt.format(Math.abs(delta))} ${deltaLabel}`;

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
