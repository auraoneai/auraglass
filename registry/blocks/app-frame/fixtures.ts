/* app-frame fixtures — deterministic values only. */
export const APP_NAV = [
  { id: 'overview', href: '#overview', label: 'Overview' },
  { id: 'reports', href: '#reports', label: 'Reports' },
  { id: 'settings', href: '#settings', label: 'Settings' },
] as const;

export const APP_TITLE = 'Acme Console';
export const STATUS_TEXT = 'Synced 2m ago';
