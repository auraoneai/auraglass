/** Default localized strings for controls (CMP-097). Merge order per CTL-002:
 * defaults < provider `messages` < props. */
export const CONTROL_MESSAGES = {
  clearSearch: 'Clear search',
  increase: 'Increase',
  decrease: 'Decrease',
  removeItem: 'Remove {label}',
  noResults: 'No results',
  openCalendar: 'Open calendar',
  /** REQ-CMP-73: Combobox `loadOptions` rejection text, rendered in Empty. */
  loadError: "Couldn't load results",
  /** @deprecated alias of `loadError` (pre-5.0 key); an override under this
   *  key is still honoured when `loadError` is not overridden. */
  loadFailed: "Couldn't load results",
  createItem: 'Create "{query}"',
  loadingResults: 'Loading results',
  required: 'Required',
  optional: 'Optional',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
} as const;

export type ControlMessageKey = keyof typeof CONTROL_MESSAGES;
export type ControlMessages = Partial<Record<ControlMessageKey, string>>;

/** Template interpolation for defaults that contain {placeholders}. */
export function controlMessage(key: ControlMessageKey, overrides?: ControlMessages, params?: Record<string, string>): string {
  const raw = overrides?.[key]
    ?? (key === 'loadError' ? overrides?.loadFailed : undefined)
    ?? CONTROL_MESSAGES[key];
  if (!params) return raw;
  return raw.replace(/\{(\w+)\}/g, (m, name: string) => params[name] ?? m);
}
