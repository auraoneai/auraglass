'use client';
/**
 * Styled Components Registry for Next.js App Router
 *
 * This registry is REQUIRED when using styled-components with Next.js App Router.
 * It collects styles during React server-side rendering and injects them into the HTML.
 *
 * CRITICAL: Must use dynamic imports to work in both SSR and browser
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
 */

import React, { useState } from 'react';

// These will be loaded dynamically below
let useServerInsertedHTML: any;
let ServerStyleSheet: any;
let StyleSheetManager: any;
let styledComponentsLoaded = false;

// Try to load styled-components and next/navigation
// This must happen at module level to work properly
if (typeof window === 'undefined') {
  // Server-side: use require (Node.js environment)
  try {
    const nextNav = require('next/navigation');
    useServerInsertedHTML = nextNav.useServerInsertedHTML;

    const sc = require('styled-components');
    ServerStyleSheet = sc.ServerStyleSheet;
    StyleSheetManager = sc.StyleSheetManager;
    styledComponentsLoaded = true;
  } catch (error) {
    console.warn('[AuraGlass] styled-components or next/navigation not available on server:', error);
  }
} else {
  // Client-side: styled-components handles styles automatically, no registry needed
  // Just pass through children
  styledComponentsLoaded = false;
}

export function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // Client-side: styled-components handles everything automatically
  if (typeof window !== 'undefined') {
    return <>{children}</>;
  }

  // Server-side: use the registry to collect styles
  if (!styledComponentsLoaded || !useServerInsertedHTML || !ServerStyleSheet || !StyleSheetManager) {
    // Dependencies not available, just render children
    return <>{children}</>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

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
}
