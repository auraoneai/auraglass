import React, { createContext, useContext, useState, useEffect } from "react";

export interface MotionPreferenceContextType {
  prefersReducedMotion: boolean;
  isMotionSafe: boolean;
  motionPolicy: "auto" | "always-safe" | "never-safe";
}

const MotionPreferenceContext = createContext<MotionPreferenceContextType>({
  prefersReducedMotion: false,
  isMotionSafe: true,
  motionPolicy: "auto",
});

/**
 * Hook to access motion preferences from context
 *
 * IMPORTANT: Use this instead of useReducedMotion() when you want centralized
 * motion preferences controlled by MotionPreferenceProvider at the app root.
 */
export const useMotionPreferenceContext = () => {
  const context = useContext(MotionPreferenceContext);
  if (!context) {
    return {
      prefersReducedMotion: false,
      isMotionSafe: true,
      motionPolicy: "auto" as const,
    };
  }
  return context;
};

export interface MotionPreferenceProviderProps {
  children: React.ReactNode;
  /**
   * Initial motion preference for SSR/first render
   * - 'auto': Detect from user preference (default)
   * - 'always-safe': Force motion enabled, ignore user preference
   * - 'never-safe': Force motion disabled
   *
   * CRITICAL for SSR: Use 'always-safe' to prevent hydration mismatches
   * when you know your users don't prefer reduced motion.
   */
  initialMotionPolicy?: "auto" | "always-safe" | "never-safe";
  /**
   * Initial value for prefersReducedMotion during SSR
   * Default: false (motion allowed)
   *
   * Set to true if you want to assume reduced motion during SSR
   */
  initialPrefersReducedMotion?: boolean;
}

/**
 * MotionPreferenceProvider - Centralized motion preference management
 *
 * CRITICAL for SSR: Wrap your app root with this provider to:
 * 1. Prevent hydration mismatches from motion detection
 * 2. Centralize motion preferences across all AuraGlass components
 * 3. Control SSR behavior via props
 *
 * Example (SSR-safe):
 * ```tsx
 * <MotionPreferenceProvider initialMotionPolicy="always-safe">
 *   <App />
 * </MotionPreferenceProvider>
 * ```
 *
 * Example (respect user preference):
 * ```tsx
 * <MotionPreferenceProvider initialMotionPolicy="auto">
 *   <App />
 * </MotionPreferenceProvider>
 * ```
 */
export const MotionPreferenceProvider: React.FC<
  MotionPreferenceProviderProps
> = ({
  children,
  initialMotionPolicy = "auto",
  initialPrefersReducedMotion = false,
}) => {
  // CRITICAL FIX: Start with SSR-safe default to prevent hydration mismatch
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    initialPrefersReducedMotion
  );
  const [motionPolicy] = useState(initialMotionPolicy);

  useEffect(() => {
    // Skip detection if motion policy is forced
    if (motionPolicy !== "auto") {
      setPrefersReducedMotion(motionPolicy === "never-safe");
      return;
    }

    // Detect actual motion preference after hydration (client-side only)
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [motionPolicy]);

  const value = {
    prefersReducedMotion,
    isMotionSafe: !prefersReducedMotion,
    motionPolicy,
  };

  return (
    <MotionPreferenceContext.Provider value={value}>
      {children}
    </MotionPreferenceContext.Provider>
  );
};
