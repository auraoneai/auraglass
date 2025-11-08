/**
 * SSR StyleSheetManager for Styled Components
 *
 * Provides a consistent styled-components stylesheet instance to prevent
 * hydration mismatches between server and client.
 *
 * Usage in Next.js pages/_app.tsx:
 *
 * ```tsx
 * import { AuraGlassSSRProvider } from 'aura-glass/ssr';
 *
 * function MyApp({ Component, pageProps }) {
 *   return (
 *     <AuraGlassSSRProvider>
 *       <Component {...pageProps} />
 *     </AuraGlassSSRProvider>
 *   );
 * }
 * ```
 *
 * Usage in Next.js pages/_document.tsx:
 *
 * ```tsx
 * import Document, { DocumentContext } from 'next/document';
 * import { collectStyles } from 'aura-glass/ssr';
 *
 * class MyDocument extends Document {
 *   static async getInitialProps(ctx: DocumentContext) {
 *     const sheet = collectStyles();
 *     const originalRenderPage = ctx.renderPage;
 *
 *     try {
 *       ctx.renderPage = () =>
 *         originalRenderPage({
 *           enhanceApp: (App) => (props) =>
 *             sheet.collectStyles(<App {...props} />),
 *         });
 *
 *       const initialProps = await Document.getInitialProps(ctx);
 *       return {
 *         ...initialProps,
 *         styles: (
 *           <>
 *             {initialProps.styles}
 *             {sheet.getStyleElement()}
 *           </>
 *         ),
 *       };
 *     } finally {
 *       sheet.seal();
 *     }
 *   }
 * }
 * ```
 */

import React from "react";
import { canUseDOM } from "../utils/ssr";

// Type definitions for styled-components SSR
export interface StyleSheet {
  collectStyles: (children: React.ReactNode) => React.ReactElement;
  getStyleElement: () => React.ReactElement[];
  getStyleTags: () => string;
  seal: () => void;
  instance: any;
}

/**
 * Create a new ServerStyleSheet instance
 * Only available during SSR - returns null in browser
 */
export function createStyleSheet(): StyleSheet | null {
  if (canUseDOM) return null;

  try {
    // Dynamically import styled-components only during SSR
    const { ServerStyleSheet } = require("styled-components");
    const sheet = new ServerStyleSheet();

    return {
      collectStyles: (children: React.ReactNode) =>
        sheet.collectStyles(children),
      getStyleElement: () => sheet.getStyleElement(),
      getStyleTags: () => sheet.getStyleTags(),
      seal: () => sheet.seal(),
      instance: sheet,
    };
  } catch (error) {
    console.warn(
      "styled-components not found - SSR styles will not be collected"
    );
    return null;
  }
}

/**
 * Collect styles from a React tree during SSR
 * This is a convenience wrapper for createStyleSheet
 */
export function collectStyles(): StyleSheet {
  const sheet = createStyleSheet();
  if (!sheet) {
    // Browser fallback - return no-op functions
    return {
      collectStyles: (children: React.ReactNode) => <>{children}</>,
      getStyleElement: () => [],
      getStyleTags: () => "",
      seal: () => {},
      instance: null,
    };
  }
  return sheet;
}

/**
 * AuraGlass SSR Provider
 *
 * Wraps your app to provide consistent styled-components behavior
 * Automatically handles StyleSheetManager setup for SSR
 */
export const AuraGlassSSRProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // In browser, styled-components handles this automatically
  if (canUseDOM) {
    return <>{children}</>;
  }

  try {
    const { StyleSheetManager } = require("styled-components");

    return (
      <StyleSheetManager
        enableVendorPrefixes={false}
        disableVendorPrefixes={true}
      >
        {children}
      </StyleSheetManager>
    );
  } catch (error) {
    console.warn("styled-components not found - SSR provider disabled");
    return <>{children}</>;
  }
};

/**
 * Check if styled-components is properly configured for SSR
 */
export function isStyledComponentsSSRReady(): boolean {
  if (canUseDOM) return true;

  try {
    require("styled-components");
    return true;
  } catch {
    return false;
  }
}

/**
 * Get styled-components version if available
 */
export function getStyledComponentsVersion(): string | null {
  try {
    const pkg = require("styled-components/package.json");
    return pkg.version;
  } catch {
    return null;
  }
}
