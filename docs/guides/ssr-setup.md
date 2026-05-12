# Server-Side Rendering (SSR) Setup Guide

AuraGlass v2.1.0+ includes comprehensive SSR support for Next.js, Remix, Gatsby, and other React frameworks.

## Quick Start

### 1. Import CSS Styles

**IMPORTANT**: You must import AuraGlass styles in your root component or layout:

```tsx
// In your _app.tsx (Next.js) or root layout
import 'aura-glass/styles';
```

**Alternative**: Import in your global CSS:

```css
/* In your global.css or styles.css */
@import 'aura-glass/styles';
```

### 2. Styled Components Setup (Optional)

If you're using styled-components and seeing hydration warnings like "Prop className did not match", wrap your app with the AuraGlass SSR Provider:

```tsx
// pages/_app.tsx
import { AuraGlassSSRProvider } from 'aura-glass';

function MyApp({ Component, pageProps }) {
  return (
    <AuraGlassSSRProvider>
      <Component {...pageProps} />
    </AuraGlassSSRProvider>
  );
}

export default MyApp;
```

### 3. Next.js Document Setup (Optional, for styled-components)

```tsx
// pages/_document.tsx
import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document';
import { collectStyles } from 'aura-glass';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = collectStyles();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

## SSR-Safe Component Usage

All AuraGlass components are SSR-safe by default. However, if you're creating custom components or using browser APIs, use the provided SSR utilities:

```tsx
import { isBrowser, safeBrowserExec, getBrowserValue } from 'aura-glass';

// Check if code is running in browser
if (isBrowser) {
  // Safe to use window, document, etc.
}

// Execute browser-only code safely
const userAgent = safeBrowserExec(() => navigator.userAgent);

// Get browser value with fallback
const width = getBrowserValue(() => window.innerWidth, 1024);
```

## Available SSR Utilities

### Browser Detection

- `isBrowser` / `canUseDOM` - Check if running in browser
- `isServer` - Check if running on server
- `safeWindow` - Safely access window (undefined during SSR)
- `safeDocument` - Safely access document (undefined during SSR)
- `safeNavigator` - Safely access navigator (undefined during SSR)

### Safe Execution

- `safeBrowserExec(callback)` - Execute callback only in browser
- `getBrowserValue(getter, fallback)` - Get browser value with SSR fallback
- `addBrowserEventListener(type, listener)` - SSR-safe event listeners
- `safeRequestAnimationFrame(callback)` - SSR-safe animation frame

### Device/Environment Detection

- `prefersReducedMotion()` - Check reduced motion preference
- `getUserAgent()` - Get user agent string (empty during SSR)
- `isTouchDevice()` - Check touch support (false during SSR)
- `getViewportSize()` - Get viewport dimensions (defaults to 1024x768 during SSR)
- `getDevicePixelRatio()` - Get device pixel ratio (defaults to 1 during SSR)
- `isWebGLSupported()` - Check WebGL support (false during SSR)
- `isLocalStorageAvailable()` - Check localStorage availability

## Troubleshooting

### Styled Components Hash Mismatch

**Problem**: Console warnings like `Prop className did not match. Server: "sc-blIAwI" Client: "sc-jxOwhs"`

**Solution**:
1. Import styles: `import 'aura-glass/styles';`
2. Wrap app with `<AuraGlassSSRProvider>`
3. Set up styled-components in `_document.tsx` (see above)

### Components Not Styled

**Problem**: Components render but have no styles

**Solution**: Make sure you've imported the CSS:

```tsx
import 'aura-glass/styles';
```

### Browser API Errors

**Problem**: `ReferenceError: window is not defined` or similar

**Solution**: Use SSR utilities:

```tsx
import { isBrowser } from 'aura-glass';

// Instead of:
const width = window.innerWidth; // ❌ Breaks SSR

// Do this:
import { getViewportSize } from 'aura-glass';
const { width } = getViewportSize(); // ✅ SSR-safe
```

## Framework-Specific Guides

### Next.js App Router

```tsx
// app/layout.tsx
import 'aura-glass/styles';
import { AuraGlassSSRProvider } from 'aura-glass';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AuraGlassSSRProvider>{children}</AuraGlassSSRProvider>
      </body>
    </html>
  );
}
```

### Remix

```tsx
// app/root.tsx
import styles from 'aura-glass/styles';

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export default function App() {
  return (
    <html>
      <head>
        <Links />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
```

### Gatsby

```tsx
// gatsby-browser.js and gatsby-ssr.js
import 'aura-glass/styles';
```

## Performance Considerations

1. **CSS Import**: Import styles only once at the root level
2. **Tree Shaking**: AuraGlass supports tree-shaking - only used components are bundled
3. **SSR Bundle Size**: SSR utilities add minimal overhead (~2KB gzipped)
4. **Hydration**: All components hydrate cleanly with no console warnings

## Migration from 2.0.12

If upgrading from 2.0.12:

1. Add CSS import: `import 'aura-glass/styles';`
2. (Optional) Add `<AuraGlassSSRProvider>` wrapper
3. Replace manual browser checks with SSR utilities
4. Update `_document.tsx` if using styled-components

## Support

For issues or questions:
- [GitHub Issues](https://github.com/auraoneai/auraglass/issues)
- [Documentation](https://auraglass.auraone.ai/docs/ssr)
