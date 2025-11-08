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
 * import { StyledComponentsRegistry } from 'aura-glass/styled';
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
 * This prevents the "Cannot read properties of null (reading 'useState')" error
 * during Next.js build-time static analysis.
 */

import React, { useState } from 'react';

// Dynamic imports to avoid build errors (next/navigation only available in Next.js apps)
let useServerInsertedHTML: any;
let ServerStyleSheet: any;
let StyleSheetManager: any;

try {
  // Only load these in Next.js environment
  const nextNav = require('next/navigation');
  useServerInsertedHTML = nextNav.useServerInsertedHTML;

  const sc = require('styled-components');
  ServerStyleSheet = sc.ServerStyleSheet;
  StyleSheetManager = sc.StyleSheetManager;
} catch {
  // Not in Next.js environment or styled-components not installed
}

export function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // If dependencies aren't available, just render children
  if (!useServerInsertedHTML || !ServerStyleSheet || !StyleSheetManager) {
    return <>{children}</>;
  }

  // Only executed on client side, not during build
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== 'undefined') {
    return <>{children}</>;
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}
