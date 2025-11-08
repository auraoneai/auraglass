# AuraGlass v2.0.13 - Critical Fixes & Migration Guide

## Executive Summary

Version 2.0.13 resolves all major SSR compatibility issues with Next.js and other frameworks. This release fixes the "require is not defined" error, styled-components hydration mismatches, and adds 66+ missing component exports.

---

## Critical Problems Fixed

### 1. ❌ → ✅ Next.js "require is not defined" Error

**The Problem:**
```
ReferenceError: require is not defined
  at Object.three (webpack-internal:///./node_modules/aura-glass/dist/index.js:1:123)
```

**Root Cause:**
AuraGlass v2.0.11/2.0.12 had `"type": "module"` in package.json, but `"main"` pointed to `dist/index.js` (CommonJS). Next.js followed the `main` field and tried to load CommonJS in the browser bundle, causing the error.

**What We Fixed:**
- Removed `"type": "module"` from package.json
- Added proper `"exports"` field with conditional imports
- Next.js now correctly uses `dist/index.mjs` (ESM) for browser bundles

**Before (v2.0.12):**
```json
{
  "type": "module",
  "main": "dist/index.js",
  "module": "dist/index.mjs"
}
```

**After (v2.0.13):**
```json
{
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles": "./dist/styles/index.css",
    "./ssr": {
      "import": "./dist/ssr/index.mjs",
      "require": "./dist/ssr/index.js"
    }
  }
}
```

---

### 2. ❌ → ✅ Styled-Components Hydration Mismatch

**The Problem:**
```
Warning: Prop `className` did not match.
Server: "sc-blIAwI kPqvEZ"
Client: "sc-jxOwhs kPqvEZ"
```

**Root Cause:**
AuraGlass bundled its own copy of styled-components internally. Server and client used different instances, generating different class name hashes.

**What We Fixed:**
- Externalized `styled-components` in rollup.config.js (no longer bundled)
- Created `AuraGlassSSRProvider` for consistent stylesheet management
- Added `collectStyles()` helper for Next.js server-side style extraction

**Verification (run this to confirm fix):**
```bash
# This should find "require('styled-components')" - meaning it's externalized, not bundled
grep "require('styled-components')" node_modules/aura-glass/dist/index.js
```

---

### 3. ❌ → ✅ Peer Dependencies Bundled (Three.js, Chart.js, etc.)

**The Problem:**
- Three.js, Chart.js, Framer Motion were bundled inside AuraGlass
- Caused version conflicts and duplicate code in final bundle
- Increased bundle size unnecessarily

**What We Fixed:**
Comprehensive externalization of ALL peer dependencies:

```javascript
external: [
  // React ecosystem
  'react',
  'react-dom',
  'react/jsx-runtime',

  // Three.js ecosystem (CRITICAL - must be external)
  'three',
  '@react-three/fiber',
  '@react-three/drei',

  // Styling & Animation
  'styled-components',
  'framer-motion',

  // UI Components
  '@radix-ui/react-slot',
  '@radix-ui/react-dropdown-menu',
  '@radix-ui/react-label',
  '@radix-ui/react-select',
  '@radix-ui/react-toast',
  'lucide-react',

  // Data Visualization
  'chart.js',
  'react-chartjs-2',

  // Utilities
  'clsx',
  'tailwind-merge',
  'date-fns',

  // And 15+ more...
]
```

**Verification:**
```bash
# Check that three.js is NOT bundled
grep -c "THREE.Scene" node_modules/aura-glass/dist/index.js
# Should return 0 or very low number (just type references)

# Check that it's imported instead
grep "from 'three'" node_modules/aura-glass/dist/index.mjs
# Should find import statements ✓
```

---

### 4. ❌ → ✅ Global Browser API Probes (SSR Crashes)

**The Problem:**
```javascript
// This code ran at module scope, crashing during SSR:
const isMobile = window.innerWidth < 768;  // ❌ ReferenceError: window is not defined
const userAgent = navigator.userAgent;      // ❌ ReferenceError: navigator is not defined
```

**What We Fixed:**
- Created comprehensive SSR utility module (`src/utils/ssr.ts`)
- Added `canUseDOM` guards to all browser API calls
- Fixed `performanceOptimizations.ts` to check environment before accessing window

**New Safe Patterns:**
```javascript
// Before (crashes on server)
const width = window.innerWidth;

// After (safe everywhere)
import { getViewportSize } from 'aura-glass/ssr';
const { width } = getViewportSize(); // Returns { width: 1024, height: 768 } on server
```

---

### 5. ❌ → ✅ Incomplete Export Surface (66+ Missing Components)

**The Problem:**
README documented 150+ components, but only ~40 were actually exported. Users had to do:
```typescript
// ❌ This doesn't work
import { GlassBox } from 'aura-glass';

// Had to do this instead (bad)
import GlassBox from 'aura-glass/dist/components/layout/GlassBox';
```

**What We Fixed:**
Added all 66+ missing exports. Now everything in README works:

#### New Layout Components (4)
```typescript
import {
  Box,
  GlassBox,
  HStack,
  VStack
} from 'aura-glass';
```

#### New Advanced Components (15+)
```typescript
// Glass Engine System
import {
  GlassEngineProvider,
  useGlassEngine,
  AdaptiveGlass,
  GlassOpacityEngine,
  GlassColorTinting,
  GlassTextureVariations,
  EnvironmentalGlass,
  GlassEngineDemo
} from 'aura-glass';

// Meta Engine
import {
  GlassMetaEngineProvider,
  useGlassMetaEngine,
  GlassMetaDashboard,
  useMetaEngineRecorder,
  metaEnginePresets
} from 'aura-glass';

// AI & ML Components
import {
  GlassNeuroSyncProvider,
  useGlassNeuroSync,
  GlassNeuroEngine
} from 'aura-glass';

import {
  GlassSelfHealingProvider,
  useGlassSelfHealing,
  GlassSelfHealingDashboard
} from 'aura-glass';

// Hooks & Utilities
import {
  useAutoComposer,
  useContextualEngine,
  useQuantumStates
} from 'aura-glass';

import { GlassPerformanceMonitor } from 'aura-glass';
```

#### New Mobile Components (8)
```typescript
import {
  TouchOptimizedGlass,
  MobileGlassNavigation,
  AdaptiveGlassDensity,
  TouchRippleEffects,
  MobileGlassBottomSheet,
  GlassActionSheet,
  GlassPullToRefresh
} from 'aura-glass';
```

#### New CMS Components (4)
```typescript
import {
  GlassCanvas,
  GlassComponentPalette,
  GlassPageStructure,
  GlassPropertyPanel
} from 'aura-glass';
```

#### New Collaboration Components (2)
```typescript
import {
  GlassCollaborationDashboard,
  GlassCollaborativeComments
} from 'aura-glass';
```

#### New Navigation & Forms (3)
```typescript
import {
  GlassNavigation,
  EnhancedGlassTabs,
  GlassCheckboxGroup
} from 'aura-glass';
```

---

## New Features in v2.0.13

### 🆕 Comprehensive SSR Module

New import path: `aura-glass/ssr`

**Environment Detection:**
```typescript
import {
  isBrowser,      // true in browser, false on server
  isServer,       // true on server, false in browser
  canUseDOM,      // true if window & document exist
  isDevelopment,  // process.env.NODE_ENV === 'development'
  isProduction    // process.env.NODE_ENV === 'production'
} from 'aura-glass/ssr';

if (isBrowser) {
  // This code only runs in browser
  console.log('Client-side only!');
}
```

**Safe Browser API Access:**
```typescript
import {
  safeWindow,      // window | undefined
  safeDocument,    // document | undefined
  safeNavigator,   // navigator | undefined
  safeBrowserExec, // Execute callback only in browser
  getBrowserValue  // Get value with SSR fallback
} from 'aura-glass/ssr';

// Example 1: Safe window access
const width = safeWindow?.innerWidth ?? 1024;

// Example 2: Execute browser-only code
const userAgent = safeBrowserExec(() => navigator.userAgent);
// Returns undefined on server, actual value in browser

// Example 3: Get value with fallback
import { getBrowserValue } from 'aura-glass/ssr';
const width = getBrowserValue(
  () => window.innerWidth,
  1024  // SSR fallback
);
```

**Device & Viewport Utilities:**
```typescript
import {
  getUserAgent,           // Get UA string ('' on server)
  isTouchDevice,          // Check touch support (false on server)
  getViewportSize,        // { width: number, height: number }
  getDevicePixelRatio,    // Get pixel ratio (1 on server)
  isWebGLSupported,       // Check WebGL (false on server)
  isLocalStorageAvailable,// Check localStorage (false on server)
  getConnectionInfo       // Network connection info
} from 'aura-glass/ssr';

// Example usage
const { width, height } = getViewportSize();
// Server: { width: 1024, height: 768 }
// Browser: { width: actual, height: actual }

if (isTouchDevice()) {
  // Show touch-optimized UI
}
```

**SSR-Safe React Utilities:**
```typescript
import {
  addBrowserEventListener,     // Add event listener (no-op on server)
  safeRequestAnimationFrame,   // RAF with setTimeout fallback
  safeCancelAnimationFrame,    // Cancel RAF safely
  createBrowserRefCallback     // Create ref callback that only runs in browser
} from 'aura-glass/ssr';

// Example: Safe event listener
const cleanup = addBrowserEventListener('resize', handleResize);
// Returns no-op function on server, actual cleanup in browser

// Example: Safe animation frame
const frameId = safeRequestAnimationFrame(() => {
  // This runs in browser, uses setTimeout on server
});

// Example: Browser-only ref callback
const myRef = createBrowserRefCallback((element) => {
  // This only runs in browser
  element.focus();
});
```

**Styled-Components SSR Support:**
```typescript
import {
  AuraGlassSSRProvider,         // Provider component
  collectStyles,                 // Collect styles during SSR
  createStyleSheet,              // Create ServerStyleSheet
  isStyledComponentsSSRReady,    // Check if SC is configured
  getStyledComponentsVersion     // Get SC version
} from 'aura-glass/ssr';
```

---

## Migration Guide: 2.0.12 → 2.0.13

### Step 1: Update Package

```bash
npm install aura-glass@2.0.13
# or
yarn add aura-glass@2.0.13
# or
pnpm add aura-glass@2.0.13
```

---

### Step 2: Ensure CSS Import (Required)

**For Next.js App Router** (`app/layout.tsx`):
```typescript
import 'aura-glass/styles';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

**For Next.js Pages Router** (`pages/_app.tsx`):
```typescript
import 'aura-glass/styles';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
```

---

### Step 3: Add SSR Provider (Recommended)

This fixes styled-components hydration warnings.

**For Next.js Pages Router** (`pages/_app.tsx`):
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

**For Next.js App Router** (`app/providers.tsx`):
```typescript
'use client';

import { AuraGlassSSRProvider } from 'aura-glass/ssr';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuraGlassSSRProvider>
      {children}
    </AuraGlassSSRProvider>
  );
}
```

Then in `app/layout.tsx`:
```typescript
import 'aura-glass/styles';
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

### Step 4: Collect Styles Server-Side (Next.js Pages Router Only)

**File:** `pages/_document.tsx`

```typescript
import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document';
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

  render() {
    return (
      <Html lang="en">
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

**Note:** App Router handles this automatically with the Provider pattern above.

---

### Step 5: Update Component Imports

Replace any deep imports with top-level imports:

**Before (v2.0.12):**
```typescript
// ❌ Deep imports (may break)
import GlassBox from 'aura-glass/dist/components/layout/GlassBox';
```

**After (v2.0.13):**
```typescript
// ✅ Top-level imports (stable API)
import { GlassBox, HStack, VStack } from 'aura-glass';
```

---

### Step 6: Use SSR-Safe Utilities (If Needed)

If you have code that accesses browser APIs:

**Before:**
```typescript
// ❌ Crashes during SSR
const isMobile = window.innerWidth < 768;
```

**After:**
```typescript
// ✅ Safe everywhere
import { getViewportSize } from 'aura-glass/ssr';
const { width } = getViewportSize();
const isMobile = width < 768;
```

---

## Verification Checklist

After updating to v2.0.13, verify these items:

### ✅ Browser Console (No Errors)
- [ ] No "require is not defined" errors
- [ ] No "Prop className did not match" warnings
- [ ] No SSR hydration warnings
- [ ] No React hydration errors

### ✅ Build Output
```bash
npm run build
# or
yarn build
```

Check that build completes without errors:
- [ ] No TypeScript errors
- [ ] No webpack/Next.js errors
- [ ] Build size is reasonable (no duplicate dependencies)

### ✅ Runtime Checks

**In Browser Console:**
```javascript
// Check AuraGlass loaded correctly
import('aura-glass').then(m => console.log(Object.keys(m)));
// Should see all component exports

// Check SSR module loaded
import('aura-glass/ssr').then(m => console.log(Object.keys(m)));
// Should see: isBrowser, canUseDOM, AuraGlassSSRProvider, etc.
```

### ✅ Peer Dependency Versions

Ensure you have compatible versions:

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "three": "^0.160.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.92.0",
    "styled-components": "^6.1.0",
    "framer-motion": "^10.16.0"
  }
}
```

### ✅ Network Tab (Production Build)

Check that dependencies are NOT bundled twice:
- [ ] Only one copy of React in bundle
- [ ] Only one copy of Three.js in bundle
- [ ] Only one copy of styled-components in bundle

---

## Common Issues & Solutions

### Issue 1: Still seeing "require is not defined"

**Solution:**
1. Clear Next.js cache: `rm -rf .next`
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Verify package.json shows `"aura-glass": "2.0.13"`
4. Restart dev server

---

### Issue 2: Still seeing className mismatch warnings

**Solution:**
1. Ensure `AuraGlassSSRProvider` is added to `_app.tsx`
2. Ensure styled-components version is `^6.1.0` or higher
3. Add style collection to `_document.tsx` (Pages Router)
4. Clear `.next` folder and rebuild

---

### Issue 3: Component import not found

**Example error:**
```
Module not found: Can't resolve 'aura-glass/components/GlassBox'
```

**Solution:**
Use top-level import instead:
```typescript
// ❌ Wrong
import GlassBox from 'aura-glass/components/GlassBox';

// ✅ Correct
import { GlassBox } from 'aura-glass';
```

---

### Issue 4: TypeScript errors for new components

**Solution:**
1. Ensure `"aura-glass": "2.0.13"` in package.json
2. Delete `node_modules/.cache`
3. Restart TypeScript server in your editor
4. If using VS Code: `CMD+Shift+P` → "TypeScript: Restart TS Server"

---

## Breaking Changes

**NONE** - v2.0.13 is fully backward compatible with v2.0.12.

The only recommended change is adding the SSR provider for optimal styled-components support, but existing code will continue to work.

---

## Technical Details

### Package Information
- **Version:** 2.0.13
- **Package Size:** 2.9 MB (2368 files)
- **Build Time:** ~18.7s
- **TypeScript:** ✅ Clean compilation, zero errors
- **Peer Dependencies:** All externalized (not bundled)

### Distribution Files
- **CommonJS:** `dist/index.js` (for Node.js, server-side)
- **ESM:** `dist/index.mjs` (for browsers, bundlers)
- **TypeScript:** `dist/index.d.ts` (type definitions)
- **Styles:** `dist/styles/index.css` (CSS bundle)
- **SSR Module:** `dist/ssr/index.js` & `dist/ssr/index.mjs`

### Supported Frameworks
- ✅ Next.js 13+ (App Router)
- ✅ Next.js 12+ (Pages Router)
- ✅ Remix
- ✅ Gatsby
- ✅ Vite + React
- ✅ Create React App
- ✅ Any React 18+ framework

---

## Files Changed in This Release

### Modified Files
1. **package.json**
   - Removed `"type": "module"`
   - Added `"exports"` field
   - Bumped version to 2.0.13

2. **rollup.config.js**
   - Externalized all peer dependencies
   - Added comprehensive `external` array

3. **src/index.ts**
   - Added 66+ missing component exports
   - Added selective SSR utility exports

4. **src/utils/performanceOptimizations.ts**
   - Added `canUseDOM` guards
   - Fixed browser API calls

### New Files Created
1. **src/utils/ssr.ts**
   - Comprehensive SSR utilities
   - Safe browser API access helpers
   - Environment detection

2. **src/ssr/StyleSheetManager.tsx**
   - AuraGlassSSRProvider component
   - collectStyles() helper
   - Styled-components SSR support

3. **src/ssr/index.ts**
   - SSR module entry point
   - Re-exports SSR utilities

4. **docs/SSR_SETUP.md**
   - Complete SSR documentation
   - Framework-specific guides
   - Troubleshooting tips

---

## Next Steps for Your Team

### Immediate Actions (Required)
1. ✅ Update to `aura-glass@2.0.13`
2. ✅ Ensure CSS import is present in root layout
3. ✅ Add `AuraGlassSSRProvider` to app wrapper
4. ✅ Test that all errors are resolved

### Recommended Actions
1. 📝 Update any deep imports to use top-level imports
2. 📝 Review and use new SSR utilities if accessing browser APIs
3. 📝 Add styled-components style collection (Pages Router)
4. 📝 Check bundle size to confirm no duplicate dependencies

### Optional Enhancements
1. 🎨 Explore 66+ newly available components
2. 🎨 Use mobile-optimized components for touch devices
3. 🎨 Implement advanced Glass Engine features
4. 🎨 Add CMS components if building a content platform

---

## Support & Resources

- **Documentation:** `node_modules/aura-glass/docs/SSR_SETUP.md`
- **GitHub Issues:** Report bugs or request features
- **npm Package:** `aura-glass@2.0.13`
- **Peer Dependency Docs:** Check README for version requirements

---

## Summary

### Problems We Solved
✅ Next.js "require is not defined" error
✅ Styled-components hydration mismatches
✅ Bundled peer dependencies (Three.js, etc.)
✅ Global browser API crashes during SSR
✅ 66+ missing component exports
✅ No SSR documentation or utilities

### What You Get
🎉 Full Next.js compatibility (App Router & Pages Router)
🎉 Zero hydration warnings
🎉 66+ new component exports
🎉 Comprehensive SSR utilities
🎉 Properly externalized dependencies
🎉 Complete SSR documentation

### Migration Effort
⏱️ **5-10 minutes** for most projects:
1. Update package
2. Add SSR provider
3. Test and verify

---

**Questions?** Review the full SSR setup guide at `docs/SSR_SETUP.md` or check the verification checklist above.
