# AuraGlass SSR Hydration Fix Roadmap

**Status**: PARTIAL FIX - v2.0.31 addresses critical motion issues, but 8 more issues remain

This document tracks all SSR hydration issues identified through comprehensive bundle audits of AuraGlass v2.0.30 and v2.0.31.

## Executive Summary

**Problem**: AuraGlass components cause React hydration mismatches in Next.js SSR due to:
- Motion detection differences between server and client
- Sensor/DOM API access before window checks
- Non-deterministic rendering (Math.random, device detection)
- Inline style mutations during hydration

**Impact**: Console warnings, visual flashes, potential performance issues

**Solution Progress**:
- ✅ **v2.0.31**: Fixed motion preference detection (2/10 issues)
- ❌ **Remaining**: 8 critical issues need systematic fixes

---

## ✅ Fixed Issues (v2.0.31)

### Issue #1: useReducedMotion() defaults to true on server ✅

**Location**: `src/hooks/useReducedMotion.{ts,tsx}`
**Lines**: dist/styled/index.js:70-110, dist/index.js:170-210

**Problem**:
```typescript
// BEFORE (v2.0.30)
const [prefersReducedMotion, setPrefersReducedMotion] = useState(
  () => safeMatchMedia('(prefers-reduced-motion: reduce)')?.matches ?? true
);
```
- Server: `safeMatchMedia` returns `undefined` → defaults to `true`
- Client: Detects actual preference → might be `false`
- **Result**: Inline style mismatch (transition/transform/will-change)

**Solution (v2.0.31)**:
```typescript
// AFTER
const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

useEffect(() => {
  if (!isBrowser()) return;
  const mediaQuery = safeMatchMedia('(prefers-reduced-motion: reduce)');
  if (!mediaQuery) return;
  setPrefersReducedMotion(mediaQuery.matches);
  // ... event listeners
}, []);
```
- Both server and client start with `false`
- Detection deferred until after hydration
- No inline style mismatch

**Files Changed**:
- `src/hooks/useReducedMotion.ts`
- `src/hooks/useReducedMotion.tsx`

---

### Issue #2: No Motion Preference context provider ✅

**Location**: `src/contexts/MotionPreferenceContext.tsx`
**Lines**: dist/index.js:6352-6410

**Problem**:
- `MotionPreferenceContext` was declared but never provided
- Every component called `useMotionPreferenceContext()` and got fallback stub
- Each component probed `matchMedia` independently → inconsistent SSR defaults

**Solution (v2.0.31)**:
```typescript
export interface MotionPreferenceProviderProps {
  /**
   * Initial motion preference for SSR/first render
   * - 'auto': Detect from user preference (default)
   * - 'always-safe': Force motion enabled, ignore user preference
   * - 'never-safe': Force motion disabled
   */
  initialMotionPolicy?: 'auto' | 'always-safe' | 'never-safe';
  initialPrefersReducedMotion?: boolean;
}

export const MotionPreferenceProvider: React.FC<MotionPreferenceProviderProps> = ({
  children,
  initialMotionPolicy = 'auto',
  initialPrefersReducedMotion = false,
}) => {
  // Centralized motion preference management
  // Prevents hydration mismatches by controlling SSR default
  // ...
};
```

**Usage**:
```tsx
// SSR-safe: assume motion allowed during SSR
import { MotionPreferenceProvider } from 'aura-glass';

<MotionPreferenceProvider initialMotionPolicy="always-safe">
  <App />
</MotionPreferenceProvider>
```

**Files Changed**:
- `src/contexts/MotionPreferenceContext.tsx`
- `src/index.ts` (exported provider)

---

## ❌ Remaining Critical Issues

### Issue #3: Micro-interactions run before hydration

**Location**: dist/index.js:4300-4650 (LiquidGlassMaterial), ~26000+ (MagneticButton/CTA)

**Problem**:
```typescript
// LiquidGlassMaterial
const effectiveFlags = useMemo(() => ({
  microInteractions: enableMicroInteractions ??
    (performanceConfig.enableMicroInteractions && material === "liquid"), // defaults to TRUE
  // ...
}), [/* ... */]);
```
- `effectiveFlags.microInteractions = true` by default
- Server: No hover/tilt → inline style has `transform: none`
- Client hydration: Detects hover=false, deviceTilt=0 → adds `translate3d(0,0,0)`, `transition`, `will-change`
- **Result**: Deterministic inline style mismatch

**Solution Needed**:
```typescript
// Option 1: Defer until hydration
const [hydrated, setHydrated] = useState(false);
useEffect(() => setHydrated(true), []);

const effectiveFlags = useMemo(() => ({
  microInteractions: hydrated && (enableMicroInteractions ??
    (performanceConfig.enableMicroInteractions && material === "liquid")),
}), [hydrated, /* ... */]);

// Option 2: Respect motion context
const { isMotionSafe } = useMotionPreferenceContext();
const effectiveFlags = useMemo(() => ({
  microInteractions: isMotionSafe && (enableMicroInteractions ?? true),
}), [isMotionSafe, /* ... */]);
```

**Files to Fix**:
- `src/primitives/LiquidGlassMaterial.tsx`
- `src/components/button/GlassMagneticButton.tsx`
- Any CTA components with micro-interactions

---

### Issue #4: Device-sensor managers execute on import

**Location**: dist/index.js:~31000+, ~57000+ (BiometricSensorManager, DeviceMotion, consciousness helpers)

**Problem**:
```typescript
// CURRENT: Executes immediately on import
class BiometricSensorManager {
  constructor() {
    this.accelerometer = new window.Accelerometer(); // ❌ SSR crash
    this.bluetooth = navigator.bluetooth; // ❌ SSR crash
    this.ambientLight = new window.AmbientLightSensor(); // ❌ SSR crash
  }
}
```
- These managers instantiate sensor APIs without `typeof window !== 'undefined'` check
- SSR crashes unless consumers polyfill `window`

**Solution Needed**:
```typescript
// FIXED: Guard all sensor access
class BiometricSensorManager {
  private accelerometer?: Accelerometer;
  private bluetooth?: Bluetooth;

  constructor() {
    if (typeof window === 'undefined') return; // SSR guard

    try {
      if ('Accelerometer' in window) {
        this.accelerometer = new window.Accelerometer();
      }
    } catch (error) {
      console.warn('Accelerometer not supported:', error);
    }

    // Move all sensor init to client-only useEffect
  }
}
```

**Files to Fix**:
- `src/components/advanced/GlassBiometricAdaptation.tsx`
- `src/components/advanced/GlassOrientationEffects.tsx`
- Any consciousness/sensor-related modules

---

### Issue #5: Achievement/gaze engines access DOM in constructors

**Location**: dist/index.js:~31800, ~32000 (GlassAchievementProvider, GlassFocusTracker)

**Problem**:
```typescript
// Provider constructor calls hooks + DOM APIs
export const GlassAchievementProvider = ({ children }) => {
  const prefersReducedMotion = useReducedMotion(); // ✅ Now safe
  const resizeObserver = new ResizeObserver(/* ... */); // ❌ SSR crash
  const mutationObserver = new MutationObserver(/* ... */); // ❌ SSR crash
  // ...
};
```
- Providers instantiate `ResizeObserver`, `MutationObserver` in constructor
- SSR crashes even though `useReducedMotion()` is now safe

**Solution Needed**:
```typescript
export const GlassAchievementProvider = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isBrowser()) return;

    const resizeObserver = new ResizeObserver(/* ... */);
    const mutationObserver = new MutationObserver(/* ... */);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
};
```

**Files to Fix**:
- `src/components/advanced/GlassAchievementSystem.tsx`
- `src/components/advanced/GlassEyeTracking.tsx`
- Any components using ResizeObserver/MutationObserver

---

### Issue #6: Particle backgrounds use non-deterministic randomness

**Location**: dist/index.js:~149000 (ParticleBackground)

**Problem**:
```typescript
// Math.random() produces different values server vs client
const particles = useMemo(() =>
  Array.from({ length: count }, () => ({
    x: Math.random() * 100, // ❌ Different each render
    y: Math.random() * 100,
    size: Math.random() * 3,
    // ...
  })), [count]
);
```
- Server generates one set of random positions
- Client generates different positions during hydration
- **Result**: Markup mismatch in inline styles/gradient positions

**Solution Needed**:
```typescript
// Option 1: Seed deterministically
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const particles = useMemo(() => {
  const seed = 12345; // Deterministic seed
  return Array.from({ length: count }, (_, i) => ({
    x: seededRandom(seed + i * 3) * 100,
    y: seededRandom(seed + i * 3 + 1) * 100,
    size: seededRandom(seed + i * 3 + 2) * 3,
  }));
}, [count]);

// Option 2: Skip rendering until hydration
const [hydrated, setHydrated] = useState(false);
useEffect(() => setHydrated(true), []);

if (!hydrated) return <div className="particle-placeholder" />;
```

**Files to Fix**:
- `src/components/backgrounds/ParticleBackground.tsx`
- `src/components/backgrounds/AtmosphericBackground.tsx`
- `src/components/atmospheric/*` (any randomized effects)

---

### Issue #7: Magnetic buttons reference window in motion variants

**Location**: MagneticButton components, pages/AuraGlassExperience.tsx

**Problem**:
```typescript
// Framer-motion variants compute transforms using window size
const magneticVariants = {
  initial: { transform: 'translate3d(0, 0, 0)' },
  hover: {
    transform: (custom) => {
      const { mouseX, mouseY } = custom;
      const centerX = window.innerWidth / 2; // ❌ SSR crash
      const centerY = window.innerHeight / 2; // ❌ SSR crash
      const dx = (mouseX - centerX) * 0.5;
      const dy = (mouseY - centerY) * 0.5;
      return `translate3d(${dx}px, ${dy}px, 0)`;
    },
  },
};
```
- Server can't compute transforms → `transform: none`
- Client hydration computes `translate3d` → mismatch

**Solution Needed**:
```typescript
// Option 1: Provide clientOnly prop
<MagneticButton clientOnly>Click me</MagneticButton>

// Option 2: Use SSR-safe defaults
const magneticVariants = {
  initial: { transform: 'translate3d(0, 0, 0)' },
  hover: {
    transform: (custom) => {
      if (typeof window === 'undefined') return 'translate3d(0, 0, 0)';
      // ... compute transform
    },
  },
};
```

**Files to Fix**:
- `src/components/button/GlassMagneticButton.tsx`
- Any components using motion variants with window references

---

### Issue #8: ThemeProvider detectDevice() runs during SSR

**Location**: dist/theme/ThemeProvider.* compiled into dist/index.js

**Problem**:
```typescript
// ThemeProvider calls detectDevice() during initialization
const ThemeProvider = ({ children }) => {
  const device = detectDevice(); // ❌ Probes WebGL on server
  const quality = calculateQuality(device); // Different server vs client
  // ...
};
```
- `detectDevice()` probes WebGL capabilities on server
- Returns default values → client detects real capabilities → mismatch
- Similar to OptimizedGlassCore tier detection (which was fixed in v2.0.30)

**Solution Needed**:
```typescript
const ThemeProvider = ({
  children,
  initialDeviceInfo, // Accept SSR default
}) => {
  const [device, setDevice] = useState(() =>
    initialDeviceInfo || DEFAULT_DEVICE_INFO
  );

  useEffect(() => {
    if (!isBrowser()) return;
    setDevice(detectDevice()); // Detect after hydration
  }, []);

  // ...
};
```

**Files to Fix**:
- `src/theme/ThemeProvider.tsx`

---

### Issue #9: Consciousness defaults remain "on"

**Location**: Many components with consciousness/predictive/adaptive props

**Problem**:
```typescript
// Components default consciousness features to true
const GlassCard = ({
  consciousness = true, // ❌ Instantiates watchers on server
  predictive = true,
  adaptive = true,
  // ...
}) => {
  // Immediately creates ResizeObserver, MutationObserver, workers
  // ...
};
```
- Consciousness features default to `true`
- Instantiate DOM watchers and runtime workers assuming DOM exists
- SSR crashes or creates different initial state

**Solution Needed**:
```typescript
// Option 1: Default to false
const GlassCard = ({
  consciousness = false, // ✅ SSR-safe
  predictive = false,
  adaptive = false,
}) => {
  // Only enable if explicitly requested
};

// Option 2: Gate behind hydration
const [hydrated, setHydrated] = useState(false);
useEffect(() => setHydrated(true), []);

const effectiveConsciousness = hydrated && consciousness;
```

**Files to Fix**:
- All components with consciousness-related props
- Review default prop values across the library

---

### Issue #10: Framer-motion wrappers hydrate differently

**Location**: Various primitives wrapped in motion.div

**Problem**:
```typescript
// Server renders plain div
<div style={{ transform: 'none' }}>Content</div>

// Client hydrates with motion.div
<motion.div
  animate={{ transform: 'translate3d(0, 0, 0)' }}
  transition={{ duration: 0.2 }}
  style={{ transform: 'translate3d(0, 0, 0)', transition: 'transform 0.2s', willChange: 'transform' }}
>
  Content
</motion.div>
```
- Server outputs static div with static styles
- Hydration wraps in motion.div with motion props
- **Result**: Inline style mismatch

**Solution Needed**:
```typescript
// Option 1: Provide motionDisabledDuringSSR flag
<MotionGlassButton motionDisabledDuringSSR>
  Click me
</MotionGlassButton>

// Option 2: Use motion only after hydration
const [hydrated, setHydrated] = useState(false);
useEffect(() => setHydrated(true), []);

const Component = hydrated ? motion.div : 'div';
return <Component {...hydrated ? motionProps : {}}>{children}</Component>;
```

**Files to Fix**:
- All components using framer-motion primitives
- Create reusable SSR-safe motion wrapper

---

## Implementation Priority

### Phase 1: Critical Fixes (Block SSR usage)
1. **Issue #4**: Device-sensor managers (crashes)
2. **Issue #5**: Achievement/gaze engines (crashes)
3. **Issue #8**: ThemeProvider detectDevice (crashes)

### Phase 2: High-Impact Fixes (Visible mismatches)
4. **Issue #3**: Micro-interactions (inline style mismatches)
5. **Issue #7**: Magnetic button variants (inline style mismatches)
6. **Issue #10**: Framer-motion wrappers (inline style mismatches)

### Phase 3: Polish Fixes (Subtle issues)
7. **Issue #6**: Particle randomness (gradient position mismatches)
8. **Issue #9**: Consciousness defaults (optional feature creep)

---

## Recommended API Changes

### 1. Global SSR Config

```typescript
import { AuraGlassProvider } from 'aura-glass';

<AuraGlassProvider
  ssr={{
    disableMicroInteractions: true,
    disableConsciousness: true,
    disableMotionDetection: false, // Use MotionPreferenceProvider instead
    initialDeviceInfo: { /* ... */ },
  }}
>
  <App />
</AuraGlassProvider>
```

### 2. Per-Component Overrides

```typescript
<GlassButton
  ssr={{
    disableMicroInteractions: true,
    clientOnly: false, // Render on server with safe defaults
  }}
>
  Click me
</GlassButton>
```

### 3. Hydration-Safe Wrapper

```typescript
import { HydrationSafe } from 'aura-glass/ssr';

// Skip rendering until after hydration
<HydrationSafe fallback={<GlassButtonSkeleton />}>
  <GlassButtonWithMotion />
</HydrationSafe>
```

---

## Testing Strategy

### 1. Add SSR Test Suite

```bash
# Test SSR rendering
npm run test:ssr

# Test hydration mismatches
npm run test:hydration
```

### 2. Playwright SSR Tests

```typescript
test('GlassButton hydrates without mismatches', async ({ page }) => {
  await page.goto('/test/glass-button');

  // Check for hydration warnings
  const warnings = [];
  page.on('console', msg => {
    if (msg.text().includes('Hydration')) {
      warnings.push(msg.text());
    }
  });

  await page.waitForLoadState('networkidle');
  expect(warnings).toHaveLength(0);
});
```

### 3. Visual Regression Tests

```bash
# Capture SSR vs hydrated screenshots
npm run test:visual -- --ssr
```

---

## Migration Guide for v2.0.31+

### Step 1: Add MotionPreferenceProvider

```typescript
// app/layout.tsx
import { MotionPreferenceProvider } from 'aura-glass';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MotionPreferenceProvider initialMotionPolicy="always-safe">
          {children}
        </MotionPreferenceProvider>
      </body>
    </html>
  );
}
```

### Step 2: Disable Consciousness Features

```typescript
// Until Issue #9 is fixed, explicitly disable consciousness
<GlassCard consciousness={false} predictive={false} adaptive={false}>
  Content
</GlassCard>
```

### Step 3: Use Static Mode for Magnetic Elements

```typescript
// Until Issue #7 is fixed, avoid MagneticButton during SSR
import dynamic from 'next/dynamic';

const MagneticButton = dynamic(
  () => import('aura-glass').then(mod => mod.GlassMagneticButton),
  { ssr: false }
);
```

---

## References

- [React Hydration Docs](https://react.dev/reference/react-dom/client/hydrateRoot)
- [Next.js SSR Best Practices](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Framer Motion SSR](https://www.framer.com/motion/guide-ssr/)

---

## Change Log

### v2.0.31 (Current)
- ✅ Fixed useReducedMotion() SSR default
- ✅ Added MotionPreferenceProvider with SSR control
- ✅ Exported motion context from main bundle
- ❌ 8 critical issues remain (see above)

### v2.0.30
- ✅ Fixed StyledComponentsRegistry SSR/browser issues
- ✅ Fixed environment detection caching
- ✅ Fixed OptimizedGlassCore tier detection
- ❌ Motion preference issues remained

### v2.0.29 and earlier
- Multiple SSR crashes and hydration mismatches
- No SSR support documentation
