'use client';
/* DateProvider (SURF-208, REQ-SURF-98): bridges the SURF `locale` prop into
   RA's I18nProvider; falls back to nearest [lang]/[dir], else RA resolved. */
import * as React from 'react';
import { I18nProvider } from 'react-aria-components';

export interface DateProviderProps {
  locale?: string | undefined;
  children: React.ReactNode;
}

export function DateProvider({ locale, children }: DateProviderProps) {
  const resolved =
    locale ??
    (typeof document !== 'undefined'
      ? document.documentElement.lang || undefined
      : undefined);
  return <I18nProvider {...(resolved !== undefined ? { locale: resolved } : {})}>{children}</I18nProvider>;
}
