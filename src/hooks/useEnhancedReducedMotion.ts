"use client";
import { useEffect, useState } from "react";
import { isBrowser, safeMatchMedia } from "../utils/env";

/**
 * Enhanced hook for detecting user's reduced motion preference.
 *
 * This hook monitors the user's system-level preference for reduced motion
 * and updates reactively when the preference changes. During server rendering
 * and the first client render it returns the constant `true` (reduced), so the
 * hydrated markup matches the server markup; the OS preference is read after
 * mount. It does not read the preference on the server, so a server render
 * always takes the reduced-motion branch.
 *
 * @returns {boolean} True if the user prefers reduced motion, false otherwise
 *
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const prefersReducedMotion = useEnhancedReducedMotion();
 *
 *   return (
 *     <motion.div
 *       animate={{ opacity: 1 }}
 *       transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
 *     >
 *       Content
 *     </motion.div>
 *   );
 * }
 * ```
 *
 * @see {@link useReducedMotion} for a simpler version
 */
/** @deprecated useEnhancedReducedMotion DEP-M0897 since 4.2.0, removed in 5.0.0. {@link usePreference(\} */
export function useEnhancedReducedMotion(): boolean {
  // Constant initial value: the server and the first client render must
  // agree for hydration; the real preference is applied in the effect.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    if (!isBrowser()) return;

    const mediaQuery = safeMatchMedia("(prefers-reduced-motion: reduce)");
    if (!mediaQuery) return;

    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    if (typeof (mediaQuery as any).addListener === "function") {
      (mediaQuery as any).addListener(handleChange);
      return () => (mediaQuery as any).removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
}
