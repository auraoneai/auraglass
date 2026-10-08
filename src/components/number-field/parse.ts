/* NumberField parse/format/clamp helpers.
   Handles grouped + decimal-separator variants (e.g. de-DE "1.234,56")
   and locale-independent input ("1234.56"). */

export function parseNumber(input: string | null | undefined, locale?: string): number | null {
  if (input == null) return null;
  const trimmed = input.trim();
  if (trimmed === '') return null;
  let s = trimmed.replace(/\s/g, '');

  // Determine the decimal separator: last of ',' or '.'; if the string uses
  // only one separator and it's repeated >1 time it must be a group separator.
  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');
  let decimalSep: ',' | '.' | null = null;
  if (lastComma > -1 || lastDot > -1) {
    const lastIdx = Math.max(lastComma, lastDot);
    const sepChar = s[lastIdx] as ',' | '.';
    const occurrences = s.split(sepChar).length - 1;
    if (occurrences === 1) {
      // Ambiguity: single separator followed by exactly 3 digits could be a
      // group separator ("1.234" de = 1234). Consult the locale's real decimal.
      const localeSep = getDecimalSep(locale);
      const fracLen = s.length - lastIdx - 1;
      if (fracLen === 3 && sepChar !== localeSep && s[lastIdx - 4] !== sepChar) {
        decimalSep = null;
      } else {
        decimalSep = sepChar;
      }
    } else {
      decimalSep = sepChar;
    }
  }

  if (decimalSep) {
    const sep = decimalSep === ',' ? /\./g : /,/g;
    s = s.replace(sep, '').replace(decimalSep, '.');
  } else {
    s = s.replace(/[,.]/g, '');
  }
  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}

function getDecimalSep(locale?: string): ',' | '.' {
  try {
    const parts = new Intl.NumberFormat(locale).formatToParts(1.5);
    const dec = parts.find((p) => p.type === 'decimal');
    return dec?.value === ',' ? ',' : '.';
  } catch {
    return '.';
  }
}

export function clampValue(value: number, min?: number, max?: number): number {
  let v = value;
  if (typeof min === 'number' && v < min) v = min;
  if (typeof max === 'number' && v > max) v = max;
  return v;
}

export function formatNumber(
  value: number | null,
  locale?: string,
  format?: Intl.NumberFormatOptions,
): string {
  if (value === null) return '';
  try {
    return new Intl.NumberFormat(locale, format).format(value);
  } catch {
    return String(value);
  }
}

/** Snap `value` to the nearest multiple of `step` offset from `min` (default 0). */
export function snapToStep(value: number, step: number, min = 0): number {
  if (step <= 0) return value;
  const snapped = Math.round((value - min) / step) * step + min;
  // Fix float dust: round to step's precision.
  const decimals = Math.max(0, -Math.floor(Math.log10(step)));
  return Number(snapped.toFixed(decimals));
}
