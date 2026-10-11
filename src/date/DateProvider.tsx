'use client';
/* DateProvider (SURF-208, REQ-SURF-98): bridges the SURF `locale`/`dir` props
   into React Aria's I18nProvider.

   Resolution order: explicit `locale` prop → an enclosing DateProvider (pickers
   nest a Calendar inside a portal, which must inherit the picker's locale) →
   the rendered element's closest `[lang]` / `[dir]`, read through the anchor
   ref the date components attach to their root element.

   SSR: the DOM is not readable on the server, so without a `locale` prop the
   server and the first client (hydration) render both use FALLBACK_LOCALE; the
   DOM-derived locale is applied in a layout effect after hydration. Server and
   client markup therefore always match. Pass `locale` to render the right
   locale on the server. */
import * as React from 'react';
import { I18nProvider } from 'react-aria-components';

export const FALLBACK_LOCALE = 'en-US';

export interface DateProviderProps {
  locale?: string | undefined;
  dir?: 'ltr' | 'rtl' | undefined;
  children: React.ReactNode;
}

interface DateLocaleCtx {
  locale: string;
  /** Explicit `dir` prop, else the DOM-resolved `[dir]`. Applied to the root and
      to portalled popups (which do not inherit the field's direction). */
  dir: 'ltr' | 'rtl' | undefined;
  /** Attach to the component's root element so DOM [lang]/[dir] can be read. */
  anchorRef: (el: Element | null) => void;
}

const DateLocaleContext = React.createContext<DateLocaleCtx | null>(null);

const noopRef = () => {};

export function useDateLocale(): DateLocaleCtx {
  return React.useContext(DateLocaleContext) ?? { locale: FALLBACK_LOCALE, dir: undefined, anchorRef: noopRef };
}

const useIsoLayoutEffect = typeof document !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export function DateProvider({ locale, dir, children }: DateProviderProps) {
  const parent = React.useContext(DateLocaleContext);
  const [anchor, setAnchor] = React.useState<Element | null>(null);
  const [dom, setDom] = React.useState<{ lang: string | undefined; dir: 'ltr' | 'rtl' | undefined }>({
    lang: undefined,
    dir: undefined,
  });

  useIsoLayoutEffect(() => {
    if (locale !== undefined && dir !== undefined) return;
    if (parent !== null || anchor === null) return;
    const langEl = anchor.closest('[lang]');
    const dirEl = anchor.closest('[dir]');
    const lang = langEl?.getAttribute('lang') || undefined;
    const d = dirEl?.getAttribute('dir');
    const nextDir = d === 'rtl' || d === 'ltr' ? d : undefined;
    setDom((cur) => (cur.lang === lang && cur.dir === nextDir ? cur : { lang, dir: nextDir }));
  }, [anchor, locale, dir, parent]);

  const resolvedLocale = locale ?? parent?.locale ?? dom.lang ?? FALLBACK_LOCALE;
  const resolvedDir = dir ?? parent?.dir ?? dom.dir;

  const anchorRef = React.useCallback((el: Element | null) => {
    setAnchor((cur) => (cur === el ? cur : el));
  }, []);

  const value = React.useMemo<DateLocaleCtx>(
    // A nested provider that inherits (e.g. the Calendar inside a picker's
    // portal) must not re-anchor: its DOM position is the portal, not the page.
    () => ({ locale: resolvedLocale, dir: resolvedDir, anchorRef: parent !== null && locale === undefined ? noopRef : anchorRef }),
    [resolvedLocale, resolvedDir, parent, locale, anchorRef],
  );

  return (
    <DateLocaleContext.Provider value={value}>
      <I18nProvider locale={resolvedLocale}>{children}</I18nProvider>
    </DateLocaleContext.Provider>
  );
}
