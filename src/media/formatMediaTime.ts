/* REQ-SURF-23 / §8 — deterministic media time formatting, never
 * toLocaleString (hydration-safe across timezones). Pure: no DOM, no Intl. */

export interface FormatMediaTimeOptions {
  /** Spoken form for aria-valuetext ("1 minute 32 seconds"). */
  spoken?: boolean | undefined;
  /** 'auto' (default) shows hours only when ≥1 h; 'always' always shows. */
  hours?: 'auto' | 'always' | undefined;
}

const UNITS: [number, string][] = [[3600, 'hour'], [60, 'minute'], [1, 'second']];

export function formatMediaTime(seconds: number, options: FormatMediaTimeOptions = {}): string {
  const { spoken = false, hours = 'auto' } = options;
  if (!Number.isFinite(seconds) || Number.isNaN(seconds)) return spoken ? 'unknown duration' : '0:00';
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (spoken) {
    const parts: string[] = [];
    if (h > 0 || hours === 'always') parts.push(`${h} hour${h === 1 ? '' : 's'}`);
    if (m > 0 || h > 0 || hours === 'always') parts.push(`${m} minute${m === 1 ? '' : 's'}`);
    parts.push(`${s} second${s === 1 ? '' : 's'}`);
    return parts.join(' ');
  }
  if (h > 0 || hours === 'always') return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** ISO-8601 duration for <time datetime> (PT1M32S). */
export function formatMediaTimeIso(seconds: number): string {
  if (!Number.isFinite(seconds) || Number.isNaN(seconds)) return 'PT0S';
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${s || (!h && !m) ? `${s}S` : ''}`;
}
