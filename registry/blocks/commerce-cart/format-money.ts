// Shared currency formatting for the commerce blocks (SURF-585/-587/-591):
// Intl.NumberFormat — JPY renders 0 decimals, de-DE EUR uses comma decimals.
// CartFormatContext carries the cart's currency + locale to its parts.
import * as React from 'react';

export function formatMoney(amount: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

export interface CartFormat {
  currency: string;
  locale: string;
  format: (amount: number) => string;
}

const makeFormat = (currency: string, locale: string): CartFormat => ({
  currency, locale, format: (n) => formatMoney(n, currency, locale),
});

export const CartFormatContext = React.createContext<CartFormat>(makeFormat('USD', 'en-US'));

/** Memoised formatter for a currency/locale pair (provider value). */
export function useCartFormatValue(currency: string, locale: string): CartFormat {
  return React.useMemo(() => makeFormat(currency, locale), [currency, locale]);
}

export const useCartFormat = (): CartFormat => React.useContext(CartFormatContext);
