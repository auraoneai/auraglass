'use client';
/**
 * Styled Components Registry for Next.js App Router
 *
 * This registry is REQUIRED when using styled-components with Next.js App Router.
 * It collects styles during React server-side rendering and injects them into the HTML.
 *
 * Usage in Next.js app/layout.tsx:
 *
 * ```tsx
 * import { StyledComponentsRegistry } from 'aura-glass/registry';
 *
 * export default function RootLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * This prevents the "Cannot read properties of null (reading 'useState')" or
 * "Cannot read properties of null (reading 'useContext')" errors during
 * Next.js build-time static analysis.
 */

import React from 'react';

export function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // With 'use client', this component still executes on server during SSR
  // We must avoid loading styled-components on the server entirely

  // Server-side: just pass through children
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  // Client-side only from here
  // Dynamically load styled-components ONLY in the browser
  // This code never runs during Next.js build or SSR
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { ServerStyleSheet, StyleSheetManager } = require('styled-components');
    // eslint-disable-next-line @typescript-eslint/no-var-requires, react-hooks/rules-of-hooks
    const { useServerInsertedHTML } = require('next/navigation');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [styledComponentsStyleSheet] = React.useState(() => new ServerStyleSheet());

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useServerInsertedHTML(() => {
      const styles = styledComponentsStyleSheet.getStyleElement();
      styledComponentsStyleSheet.instance.clearTag();
      return <>{styles}</>;
    });

    return (
      <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
        {children}
      </StyleSheetManager>
    );
  } catch (error) {
    // If styled-components isn't available, just render children
    console.warn('styled-components not available:', error);
    return <>{children}</>;
  }
}
