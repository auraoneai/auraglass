# AuraGlass v2.0.13 - Quick Fix Guide

## 🚨 What This Fixes

1. ✅ **"require is not defined" error** in Next.js
2. ✅ **Styled-components className mismatch** warnings
3. ✅ **66+ missing component exports** now available
4. ✅ **Peer dependencies** properly externalized
5. ✅ **SSR browser API crashes** fixed

---

## 📦 Installation

```bash
npm install aura-glass@2.0.13
```

---

## 🔧 Required Setup (5 minutes)

### 1. Import CSS (if not already done)

**In `app/layout.tsx` or `pages/_app.tsx`:**
```typescript
import 'aura-glass/styles';
```

### 2. Add SSR Provider

**Next.js Pages Router (`pages/_app.tsx`):**
```typescript
import 'aura-glass/styles';
import { AuraGlassSSRProvider } from 'aura-glass/ssr';

function MyApp({ Component, pageProps }) {
  return (
    <AuraGlassSSRProvider>
      <Component {...pageProps} />
    </AuraGlassSSRProvider>
  );
}

export default MyApp;
```

**Next.js App Router (`app/layout.tsx`):**
```typescript
import 'aura-glass/styles';
import { AuraGlassSSRProvider } from 'aura-glass/ssr';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuraGlassSSRProvider>
          {children}
        </AuraGlassSSRProvider>
      </body>
    </html>
  );
}
```

### 3. Collect Styles (Pages Router ONLY)

**Create/update `pages/_document.tsx`:**
```typescript
import Document, { DocumentContext } from 'next/document';
import { collectStyles } from 'aura-glass/ssr';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = collectStyles();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
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
}

export default MyDocument;
```

### 4. Clear Cache & Restart

```bash
rm -rf .next
npm run dev
```

---

## ✅ Verification

**Browser console should show:**
- ✅ No "require is not defined" errors
- ✅ No "className did not match" warnings
- ✅ No hydration errors

---

## 🎁 New Components Available

All 66+ components are now exported. Replace deep imports:

**Before:**
```typescript
// ❌ This may break
import GlassBox from 'aura-glass/dist/components/layout/GlassBox';
```

**After:**
```typescript
// ✅ Stable API
import { GlassBox, HStack, VStack } from 'aura-glass';
```

**New exports include:**
- Layout: `Box`, `GlassBox`, `HStack`, `VStack`
- Advanced: `GlassEngineProvider`, `AdaptiveGlass`, `GlassMetaEngine`, etc.
- Mobile: `TouchOptimizedGlass`, `MobileGlassNavigation`, `GlassActionSheet`
- CMS: `GlassCanvas`, `GlassComponentPalette`, `GlassPageStructure`
- And 50+ more!

---

## 🆘 Troubleshooting

### Still seeing "require is not defined"?
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Still seeing className warnings?
1. Verify `AuraGlassSSRProvider` is in `_app.tsx`
2. Add style collection to `_document.tsx` (Pages Router)
3. Ensure styled-components version is `^6.1.0+`

---

## 📚 Full Documentation

See `CHANGELOG_2.0.13.md` for complete details, migration guide, and all new features.

---

## 🎯 Summary

**Time to fix:** ~5 minutes
**Breaking changes:** None
**What you get:** Zero errors, 66+ new components, proper SSR support

**Questions?** Check the full changelog or SSR setup guide in `docs/SSR_SETUP.md`
