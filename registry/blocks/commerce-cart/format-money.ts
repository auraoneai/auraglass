// Shared currency formatting for the commerce blocks (SURF-585/-587/-591):
// Intl.NumberFormat — JPY renders 0 decimals, de-DE EUR uses comma decimals.
export function formatMoney(amount: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}
