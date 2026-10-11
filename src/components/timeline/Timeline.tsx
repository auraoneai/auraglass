/* Timeline (SURF-186, REQ-SURF-96): server component, <ol> of <li> with
   <time dateTime>; relative/absolute time formats; horizontal falls back to
   vertical below 480px via container query. */
import * as React from 'react';

export interface TimelineItem {
  id: string;
  timestamp: Date | string;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  intent?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' | undefined;
  meta?: React.ReactNode;
}

export interface TimelineProps {
  items: readonly TimelineItem[];
  orientation?: 'vertical' | 'horizontal' | undefined;
  timeFormat?: 'relative' | 'absolute' | Intl.DateTimeFormatOptions | undefined;
  /** Required when timeFormat='relative' on the server (else dev error). */
  now?: Date | number | undefined;
  locale?: string | undefined;
  'aria-label'?: string | undefined;
  className?: string | undefined;
}

export function formatTimestamp(
  ts: Date | string,
  timeFormat: 'relative' | 'absolute' | Intl.DateTimeFormatOptions,
  locale: string,
  now?: Date | number,
): { dateTime: string; text: string } {
  const d = typeof ts === 'string' ? new Date(ts) : ts;
  const dateTime = d.toISOString();
  if (timeFormat === 'relative') {
    const ref = now === undefined ? undefined : typeof now === 'number' ? now : now.getTime();
    if (ref === undefined) {
      if (process.env['NODE_ENV'] === 'development') {
        console.error('[auraglass] Timeline: pass `now` when timeFormat="relative" on the server.');
      }
      return { dateTime, text: dateTime };
    }
    const diff = Math.round((d.getTime() - ref) / 1000);
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const abs = Math.abs(diff);
    if (abs < 60) return { dateTime, text: rtf.format(diff, 'second') };
    if (abs < 3600) return { dateTime, text: rtf.format(Math.round(diff / 60), 'minute') };
    if (abs < 86400) return { dateTime, text: rtf.format(Math.round(diff / 3600), 'hour') };
    return { dateTime, text: rtf.format(Math.round(diff / 86400), 'day') };
  }
  const opts = timeFormat === 'absolute' ? { dateStyle: 'medium', timeStyle: 'short' } as Intl.DateTimeFormatOptions : timeFormat;
  return { dateTime, text: new Intl.DateTimeFormat(locale, { timeZone: 'UTC', ...opts }).format(d) };
}

export function Timeline({
  items,
  orientation = 'vertical',
  timeFormat = 'absolute',
  now,
  locale = 'en-US',
  'aria-label': ariaLabel,
  className,
}: TimelineProps) {
  return (
    <ol
      data-ag-part="timeline"
      data-ag-orientation={orientation}
      className={`ag-timeline${className ? ` ${className}` : ''}`}
      aria-label={ariaLabel}
    >
      {items.map((item) => {
        const t = formatTimestamp(item.timestamp, timeFormat, locale, now);
        return (
          <li
            key={item.id}
            data-ag-part="timeline-item"
            data-ag-intent={item.intent ?? 'neutral'}
            className="ag-timeline__item"
          >
            <span aria-hidden="true" className="ag-timeline__marker" data-ag-part="timeline-marker">
              {item.icon}
            </span>
            <div className="ag-timeline__content">
              <div className="ag-timeline__row">
                <span data-ag-part="timeline-title" className="ag-timeline__title">
                  {item.title}
                </span>
                <time data-ag-part="timeline-time" dateTime={t.dateTime} className="ag-timeline__time">
                  {t.text}
                </time>
              </div>
              {item.description !== undefined && item.description !== null ? (
                <p data-ag-part="timeline-description" className="ag-timeline__description">
                  {item.description}
                </p>
              ) : null}
              {item.meta !== undefined && item.meta !== null ? (
                <div data-ag-part="timeline-meta" className="ag-timeline__meta">
                  {item.meta}
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* Contract namespace (REQ-SURF-01): the formatter ships on the component,
   keeping the root surf slice at its nine flagship names. */
Timeline.formatTimestamp = formatTimestamp;
