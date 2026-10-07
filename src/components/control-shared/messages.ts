/** Default localized strings for controls (CMP-097). Callers override via props. */
export const CONTROL_MESSAGES = {
  clearSearch: 'Clear search',
  increase: 'Increase',
  decrease: 'Decrease',
  removeItem: 'Remove',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  required: 'Required',
  optional: 'Optional',
} as const;

export type ControlMessageKey = keyof typeof CONTROL_MESSAGES;
