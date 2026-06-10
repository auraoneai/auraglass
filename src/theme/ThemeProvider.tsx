// token-lint-ignore-file: ThemeProvider composes low-level tokens and may use raw values internally.
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  useRef,
  useCallback,
  useId,
} from "react";

// import { css, createGlobalStyle } from 'styled-components'; // Unused imports
// Simple deep merge utility
type UnknownRecord = Record<string, unknown>;
type GlassQualityTier = "ultra" | "high" | "medium" | "low" | "minimal";
type UserPreferences = {
  reducedMotion: boolean;
  reducedTransparency: boolean;
  highContrastMode: boolean;
};
type PendingThemeUpdates = {
  colorMode?: ColorMode;
};
type GlassSurfaceComponentType = React.FC<
  GlassSurfaceProps & { children?: React.ReactNode }
>;

const isRecord = (value: unknown): value is UnknownRecord =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isGlassQualityTier = (value: string): value is GlassQualityTier =>
  (["ultra", "high", "medium", "low", "minimal"] as const).includes(
    value as GlassQualityTier
  );

const isBlurStrength = (
  value: string
): value is (typeof BLUR_STRENGTHS)[number] =>
  BLUR_STRENGTHS.includes(value as (typeof BLUR_STRENGTHS)[number]);

const parseStoredPreferences = (value: string): Partial<UserPreferences> => {
  const parsed: unknown = JSON.parse(value);
  if (!isRecord(parsed)) return {};

  return {
    ...(typeof parsed.reducedMotion === "boolean"
      ? { reducedMotion: parsed.reducedMotion }
      : {}),
    ...(typeof parsed.reducedTransparency === "boolean"
      ? { reducedTransparency: parsed.reducedTransparency }
      : {}),
    ...(typeof parsed.highContrastMode === "boolean"
      ? { highContrastMode: parsed.highContrastMode }
      : {}),
  };
};

const deepmerge = (
  target: UnknownRecord,
  source: UnknownRecord
): UnknownRecord => {
  const result = { ...target };
  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    const targetValue = result[key];
    if (isRecord(sourceValue)) {
      result[key] = deepmerge(
        isRecord(targetValue) ? targetValue : {},
        sourceValue
      );
    } else {
      result[key] = sourceValue;
    }
  });
  return result;
};

// import { GlassTheme } from '../core/theme'; // Removed, theme type is handled internally
// import type { ThemeContext as _ThemeContextType} from '../core/themeUtils'; // Not exported
import type {
  ColorMode,
  ThemeVariant as _ThemeVariant,
  Theme as _Theme,
  GlassSurfaceProps,
} from "../core/types";

import {
  THEME_NAMES as _THEME_NAMES,
  THEME_VARIANTS as _THEME_VARIANTS,
  GLASS_QUALITY_TIERS as _GLASS_QUALITY_TIERS,
  BLUR_STRENGTHS,
  GLOW_INTENSITIES,
} from "./themeConstants";
import { AURA_GLASS } from "../tokens/glass";
import {
  DEFAULT_PERSONA_ID,
  DESIGN_MATRIX,
  PERSONA_LIST,
  type PersonaConfig,
  type PersonaId,
} from "./designMatrix";
import {
  getSafeDocument,
  getSafeWindow,
  isBrowser,
  safeMatchMedia,
} from "../utils/env";

const PERSONA_STORAGE_KEY = "glass-ui-persona-id";

const isPersonaId = (value: string): value is PersonaId =>
  Object.prototype.hasOwnProperty.call(DESIGN_MATRIX, value);

const LEGACY_THEME_VARIANT_TO_PERSONA: Record<string, PersonaId | null> = {
  default: DEFAULT_PERSONA_ID,
  compact: "midnight-meridian",
  expanded: null,
};

const resolveLegacyPersona = (
  variant: string | undefined
): PersonaId | null => {
  if (!variant) return null;
  const normalized = variant.toLowerCase();
  return LEGACY_THEME_VARIANT_TO_PERSONA[normalized] || null;
};

const getValueByPath = (root: unknown, path: string[]): unknown => {
  return path.reduce<unknown>((value, key) => {
    if (value && typeof value === "object" && key in value) {
      return (value as Record<string, unknown>)[key];
    }
    return undefined;
  }, root);
};

// ------ ColorMode Context ------
interface ColorModeContextType {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  isDarkMode: boolean;
  toggleColorMode: () => void;
  systemPrefersDark: boolean;
}

const ColorModeContext = createContext<ColorModeContextType>({
  colorMode: "system",
  setColorMode: () => undefined,
  isDarkMode: false,
  toggleColorMode: () => undefined,
  systemPrefersDark: false,
});

// ------ ThemeVariant Context ------
interface ThemeVariantContextType {
  themeVariant: string;
  setThemeVariant: (variant: string) => void;
  availableThemes: string[];
}

const ThemeVariantContext = createContext<ThemeVariantContextType>({
  themeVariant: _THEME_VARIANTS[0] || "default",
  setThemeVariant: () => undefined,
  availableThemes: [..._THEME_VARIANTS],
});

// ------ Persona Context ------
export interface PersonaContextType {
  personaId: PersonaId;
  persona: PersonaConfig;
  setPersona: (persona: PersonaId) => void;
  personas: PersonaConfig[];
}

const PersonaContext = createContext<PersonaContextType>({
  personaId: DEFAULT_PERSONA_ID,
  persona: DESIGN_MATRIX[DEFAULT_PERSONA_ID],
  setPersona: () => undefined,
  personas: PERSONA_LIST,
});

// ------ StyleUtils Context ------
interface StyleUtilsContextType {
  getColor: (path: string, fallback?: string) => string;
  getSpacing: (size: string | number) => string;
  getShadow: (level: number, color?: string) => string; // Always returns string in implementation
  getBorderRadius: (size: string) => string;
  getZIndex: (layer: string) => number;
  getTypography: (variant: string) => React.CSSProperties;
}

const StyleUtilsContext = createContext<StyleUtilsContextType>({
  getColor: () => "",
  getSpacing: () => "",
  getShadow: () => "",
  getBorderRadius: () => "",
  getZIndex: () => 0,
  getTypography: () => ({}),
});

// ------ GlassEffects Context ------
interface GlassEffectsContextType {
  qualityTier: GlassQualityTier;
  setQualityTier: (tier: GlassQualityTier) => void;
  getBlurStrength: (strength: string | number) => string;
  getBackgroundOpacity: (opacity: string | number) => number;
  getBorderOpacity: (opacity: string | number) => number;
  getGlowIntensity: (intensity: string | number) => number;
  createSurface: (props: GlassSurfaceProps) => string;
  GlassSurface: GlassSurfaceComponentType;
}

const GlassEffectsContext = createContext<GlassEffectsContextType>({
  qualityTier: "high",
  setQualityTier: () => undefined,
  getBlurStrength: () => "",
  getBackgroundOpacity: () => 0,
  getBorderOpacity: () => 0,
  getGlowIntensity: () => 0,
  createSurface: () => "",
  GlassSurface: () => null,
});

// ------ Preferences Context ------
interface PreferencesContextType {
  reducedMotion: boolean;
  reducedTransparency: boolean;
  highContrastMode: boolean;
  setPreference: (key: string, value: boolean) => void;
  getUserPreference: (key: string) => boolean;
}

const PreferencesContext = createContext<PreferencesContextType>({
  reducedMotion: false,
  reducedTransparency: false,
  highContrastMode: false,
  setPreference: () => undefined,
  getUserPreference: () => false,
});

// ------ Responsive Context ------
interface ResponsiveContextType {
  breakpoints: Record<string, number>;
  currentBreakpoint: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  mediaQuery: (breakpoint: string) => string;
}

const ResponsiveContext = createContext<ResponsiveContextType>({
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
  currentBreakpoint: "md",
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  mediaQuery: () => "",
});

// ------ ThemeProvider Presence Context ------
const ThemeProviderPresenceContext = createContext<boolean>(false);

export const useThemeProviderPresence = () =>
  useContext(ThemeProviderPresenceContext);

// ------ Unified Theme Provider Props ------
export interface ThemeProviderProps {
  /**
   * Children to render
   */
  children: React.ReactNode;

  /**
   * Initial color mode
   */
  initialColorMode?: ColorMode;

  /**
   * Initial theme variant
   */
  initialTheme?: string;

  /**
   * Initial persona to hydrate with. Falls back to stored preference or default if absent.
   */
  initialPersona?: PersonaId;

  /**
   * Controlled persona id. When provided, internal state will mirror this value.
   */
  persona?: PersonaId;

  /**
   * Persist persona selection in localStorage. Defaults to true.
   */
  persistPersona?: boolean;

  /**
   * If true, automatically detect system preferences
   */
  enableAutoDetection?: boolean;

  /**
   * If true, respect system color mode preference
   */
  respectSystemPreference?: boolean;

  /**
   * Force specific color mode (overrides other settings)
   */
  forceColorMode?: ColorMode;

  /**
   * If true, disable CSS transitions during theme changes
   */
  disableTransitions?: boolean;

  /**
   * If true, optimize glass effects during scrolling
   */
  enableScrollOptimization?: boolean;

  /**
   * Initial glass quality tier
   */
  initialQualityTier?: "ultra" | "high" | "medium" | "low" | "minimal";

  /**
   * If true, theme will isolate from parent themes
   */
  isolateTheme?: boolean;

  /**
   * If true, enable performance optimizations
   */
  enableOptimizations?: boolean;

  /**
   * If true, enable additional debug information
   */
  debug?: boolean;

  /**
   * If true, enable performance monitoring
   */
  performanceMonitoring?: boolean;

  /**
   * Throttle time in ms for context updates
   */
  contextUpdateThrottle?: number;

  /**
   * If true, only update on React commit phases
   */
  updateOnlyOnCommit?: boolean;

  /**
   * Callback when color mode changes
   */
  onColorModeChange?: (mode: ColorMode) => void;

  /**
   * Callback when theme variant changes
   */
  onThemeChange?: (theme: string) => void;

  /**
   * Callback when persona changes
   */
  onPersonaChange?: (persona: PersonaId) => void;
}

/**
 * Unified Theme Provider Component
 *
 * Provides a comprehensive theme context for Glass UI components.
 */
const UnifiedThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialColorMode = "system",
  initialTheme = _THEME_VARIANTS[0] || "default",
  initialPersona = DEFAULT_PERSONA_ID,
  persona,
  persistPersona = true,
  enableAutoDetection = true,
  respectSystemPreference = true,
  forceColorMode,
  disableTransitions = false,
  enableScrollOptimization = true,
  initialQualityTier = "high",
  isolateTheme = false,
  enableOptimizations = true,
  contextUpdateThrottle = 0,
  updateOnlyOnCommit = false,
  onColorModeChange,
  onThemeChange,
  onPersonaChange,
}) => {
  // ------ Color Mode State ------
  const themeHostRef = useRef<HTMLDivElement | null>(null);

  const [internalPersonaId, setInternalPersonaId] = useState<PersonaId>(() => {
    if (persona) {
      return persona;
    }

    const legacyMatch = resolveLegacyPersona(initialTheme);
    if (legacyMatch) {
      return legacyMatch;
    }

    return initialPersona;
  });

  const resolvedPersonaId = persona ?? internalPersonaId;

  const personaConfig = useMemo(() => {
    const fallback = DESIGN_MATRIX[DEFAULT_PERSONA_ID];
    return DESIGN_MATRIX[resolvedPersonaId] || fallback;
  }, [resolvedPersonaId]);

  const setPersona = useCallback(
    (nextPersona: PersonaId) => {
      if (!isPersonaId(nextPersona)) {
        return;
      }

      const storage = persistPersona ? getSafeWindow()?.localStorage : null;

      if (persona) {
        if (persistPersona) {
          storage?.setItem(PERSONA_STORAGE_KEY, nextPersona);
        }
        onPersonaChange?.(nextPersona);
        return;
      }

      setInternalPersonaId((current) => {
        if (current === nextPersona) {
          return current;
        }

        if (persistPersona) {
          storage?.setItem(PERSONA_STORAGE_KEY, nextPersona);
        }

        onPersonaChange?.(nextPersona);
        return nextPersona;
      });
    },
    [persona, persistPersona, onPersonaChange]
  );

  useEffect(() => {
    if (!persona || !persistPersona) return;
    const storage = getSafeWindow()?.localStorage;
    storage?.setItem(PERSONA_STORAGE_KEY, persona);
  }, [persona, persistPersona]);

  const [colorMode, setColorModeState] = useState<ColorMode>(initialColorMode);

  // State for whether the system prefers dark mode
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(
    () => safeMatchMedia("(prefers-color-scheme: dark)")?.matches ?? false
  );

  // ------ Theme Variant State ------
  const [themeVariant, setThemeVariantState] = useState<string>(initialTheme);

  // ------ Glass Effects State ------
  const [qualityTier, setQualityTierState] =
    useState<GlassQualityTier>(initialQualityTier);

  // ------ Preferences State ------
  const [preferences, setPreferences] = useState<UserPreferences>({
    reducedMotion: false,
    reducedTransparency: false,
    highContrastMode: false,
  });

  // ------ Responsive State ------
  const [currentBreakpoint, setCurrentBreakpoint] = useState("md");

  // ------ Performance Tracking ------
  const pendingUpdates = useRef<PendingThemeUpdates>({});
  const commitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ------ Initialize System Preferences ------
  useEffect(() => {
    if (!enableAutoDetection || !isBrowser()) return;

    const darkModeMediaQuery = safeMatchMedia("(prefers-color-scheme: dark)");
    const motionMediaQuery = safeMatchMedia("(prefers-reduced-motion: reduce)");

    const handleDarkModeChange = (event: MediaQueryListEvent) => {
      setSystemPrefersDark(event.matches);
    };

    const handleMotionChange = (event: MediaQueryListEvent) => {
      setPreferences((prev) => ({
        ...prev,
        reducedMotion: event.matches,
      }));
    };

    if (darkModeMediaQuery) {
      setSystemPrefersDark(darkModeMediaQuery.matches);
      darkModeMediaQuery.addEventListener("change", handleDarkModeChange);
    }

    if (motionMediaQuery) {
      setPreferences((prev) => ({
        ...prev,
        reducedMotion: motionMediaQuery.matches,
      }));
      motionMediaQuery.addEventListener("change", handleMotionChange);
    }

    return () => {
      if (darkModeMediaQuery) {
        darkModeMediaQuery.removeEventListener("change", handleDarkModeChange);
      }
      if (motionMediaQuery) {
        motionMediaQuery.removeEventListener("change", handleMotionChange);
      }
    };
  }, [enableAutoDetection]);

  // ------ Load Saved Preferences ------
  useEffect(() => {
    if (!isBrowser()) return;

    try {
      const storage = getSafeWindow()?.localStorage;
      if (!storage) return;

      const savedColorMode = storage.getItem("glass-ui-color-mode");
      if (savedColorMode && !forceColorMode) {
        setColorModeState(savedColorMode as ColorMode);
      }

      const savedThemeVariant = storage.getItem("glass-ui-theme-variant");
      if (savedThemeVariant) {
        setThemeVariantState(savedThemeVariant);
        if (!persona) {
          const legacyPersona = resolveLegacyPersona(savedThemeVariant);
          if (legacyPersona) {
            setPersona(legacyPersona);
          }
        }
      }

      if (!persona && persistPersona) {
        const savedPersonaId = storage.getItem(PERSONA_STORAGE_KEY);
        if (savedPersonaId && isPersonaId(savedPersonaId)) {
          setPersona(savedPersonaId as PersonaId);
        }
      }

      const savedQualityTier = storage.getItem("glass-ui-quality-tier");
      if (savedQualityTier && isGlassQualityTier(savedQualityTier)) {
        setQualityTierState(savedQualityTier);
      }

      const savedPreferences = storage.getItem("glass-ui-preferences");
      if (savedPreferences) {
        try {
          const parsedPreferences = parseStoredPreferences(savedPreferences);
          setPreferences((prev) => ({ ...prev, ...parsedPreferences }));
        } catch {
          setPreferences((prev) => ({ ...prev }));
        }
      }
    } catch {
      // Ignore invalid or unavailable persisted theme state.
    }
  }, [forceColorMode, persona, persistPersona, setPersona]);

  // ------ Initialize Responsive Breakpoints ------
  useEffect(() => {
    if (!isBrowser()) return;

    const win = getSafeWindow();
    if (!win) return;

    const breakpoints = {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    };

    const handleResize = () => {
      const width = win.innerWidth;
      let newBreakpoint = "xs";

      if (width >= breakpoints.xl) {
        newBreakpoint = "xl";
      } else if (width >= breakpoints.lg) {
        newBreakpoint = "lg";
      } else if (width >= breakpoints.md) {
        newBreakpoint = "md";
      } else if (width >= breakpoints.sm) {
        newBreakpoint = "sm";
      }

      setCurrentBreakpoint(newBreakpoint);
    };

    win.addEventListener("resize", handleResize);
    handleResize(); // Initial calculation

    return () => {
      win.removeEventListener("resize", handleResize);
    };
  }, []);

  // ------ Optimized Update Handlers ------

  // Handle color mode change with throttling
  const setColorMode = useCallback(
    (mode: ColorMode) => {
      if (forceColorMode) return; // Don't change if force mode is active

      const storage = getSafeWindow()?.localStorage;

      if (contextUpdateThrottle > 0) {
        pendingUpdates.current.colorMode = mode;

        if (!commitTimerRef.current) {
          commitTimerRef.current = setTimeout(() => {
            const pendingColorMode = pendingUpdates.current.colorMode;
            if (pendingColorMode) {
              setColorModeState(pendingColorMode);
              onColorModeChange?.(pendingColorMode);
              storage?.setItem("glass-ui-color-mode", pendingColorMode);
            }
            commitTimerRef.current = null;
          }, contextUpdateThrottle);
        }
      } else {
        setColorModeState(mode);
        if (onColorModeChange) onColorModeChange(mode);
        storage?.setItem("glass-ui-color-mode", mode);
      }
    },
    [forceColorMode, contextUpdateThrottle, onColorModeChange]
  );

  // Toggle between light and dark mode
  const toggleColorMode = useCallback(() => {
    if (forceColorMode) return; // Don't toggle if force mode is active

    setColorMode(
      colorMode === "light"
        ? "dark"
        : colorMode === "dark"
          ? "light"
          : systemPrefersDark
            ? "light"
            : "dark"
    );
  }, [colorMode, forceColorMode, systemPrefersDark, setColorMode]);

  // Handle theme variant change
  const setThemeVariant = useCallback(
    (variant: string) => {
      setThemeVariantState(variant);
      if (onThemeChange) onThemeChange(variant);
      const storage = getSafeWindow()?.localStorage;
      storage?.setItem("glass-ui-theme-variant", variant);

      if (!persona) {
        const mappedPersona = resolveLegacyPersona(variant);
        if (mappedPersona) {
          setPersona(mappedPersona);
        }
      }
    },
    [onThemeChange, persona, setPersona]
  );

  // Handle quality tier change
  const setQualityTier = useCallback((tier: GlassQualityTier) => {
    setQualityTierState(tier);
    const storage = getSafeWindow()?.localStorage;
    storage?.setItem("glass-ui-quality-tier", tier);
  }, []);

  // Handle preference changes
  const setPreference = useCallback((key: string, value: boolean) => {
    setPreferences((prev) => {
      const newPreferences = { ...prev, [key]: value };
      const storage = getSafeWindow()?.localStorage;
      storage?.setItem("glass-ui-preferences", JSON.stringify(newPreferences));
      return newPreferences;
    });
  }, []);

  // Get user preference
  const getUserPreference = useCallback(
    (key: string) => {
      return preferences[key as keyof typeof preferences] || false;
    },
    [preferences]
  );

  // ------ Theme Utilities ------

  // Determine if dark mode is active based on all factors
  const isDarkMode = useMemo(() => {
    if (forceColorMode) {
      return forceColorMode === "dark";
    }

    return (
      colorMode === "dark" ||
      (colorMode === "system" && respectSystemPreference && systemPrefersDark)
    );
  }, [colorMode, forceColorMode, respectSystemPreference, systemPrefersDark]);

  const resolvedMode = isDarkMode ? "dark" : "light";

  useEffect(() => {
    if (isolateTheme) {
      const host = themeHostRef.current;
      if (host) {
        host.setAttribute("data-aura-theme", resolvedPersonaId);
        host.setAttribute("data-aura-mode", resolvedMode);
        host.setAttribute("data-theme", resolvedMode);
        host.classList.toggle("dark", resolvedMode === "dark");
      }
      return;
    }

    const doc = getSafeDocument();
    const el = doc?.documentElement;
    if (!el) {
      return;
    }

    const previousTheme = el.getAttribute("data-aura-theme");
    const previousMode = el.getAttribute("data-aura-mode");
    const previousPersona = el.getAttribute("data-persona");
    const previousDataTheme = el.getAttribute("data-theme");
    const hadDarkClass = el.classList.contains("dark");

    el.setAttribute("data-aura-theme", resolvedPersonaId);
    el.setAttribute("data-aura-mode", resolvedMode);
    el.setAttribute("data-theme", resolvedMode);
    el.setAttribute("data-persona", resolvedPersonaId);
    el.classList.toggle("dark", resolvedMode === "dark");

    return () => {
      if (previousTheme) {
        el.setAttribute("data-aura-theme", previousTheme);
      } else {
        el.removeAttribute("data-aura-theme");
      }

      if (previousMode) {
        el.setAttribute("data-aura-mode", previousMode);
      } else {
        el.removeAttribute("data-aura-mode");
      }

      if (previousPersona) {
        el.setAttribute("data-persona", previousPersona);
      } else {
        el.removeAttribute("data-persona");
      }

      if (previousDataTheme) {
        el.setAttribute("data-theme", previousDataTheme);
      } else {
        el.removeAttribute("data-theme");
      }

      el.classList.toggle("dark", hadDarkClass);
    };
  }, [isolateTheme, resolvedPersonaId, resolvedMode]);

  // Create style utility functions
  const getColor = useCallback(
    (path: string, fallback = "") => {
      const parts = path.split(".");
      const normalizedParts = parts[0] === "colors" ? parts.slice(1) : parts;
      const personaValue = getValueByPath(
        personaConfig.colors,
        normalizedParts
      );

      if (typeof personaValue === "string") {
        return personaValue;
      }

      const glassValue =
        getValueByPath(AURA_GLASS, normalizedParts) ??
        getValueByPath(AURA_GLASS.surfaces, normalizedParts);

      return typeof glassValue === "string" ? (glassValue as string) : fallback;
    },
    [personaConfig.colors]
  );

  // Create glass effect utilities
  const getBlurStrength = useCallback((strength: string | number) => {
    if (typeof strength === "number") {
      return `${strength}px`;
    }

    return isBlurStrength(strength) ? strength : "standard";
  }, []);

  const getBackgroundOpacity = useCallback((opacity: string | number) => {
    if (typeof opacity === "number") {
      return Math.max(0, Math.min(1, opacity));
    }

    const opacityMap: Record<string, number> = {
      transparent: 0,
      lightest: 0.05,
      light: 0.1,
      medium: 0.2,
      high: 0.5,
      solid: 1,
    };

    return opacityMap[opacity] || 0.2;
  }, []);

  const getBorderOpacity = useCallback((opacity: string | number) => {
    if (typeof opacity === "number") {
      return Math.max(0, Math.min(1, opacity));
    }

    const opacityMap: Record<string, number> = {
      none: 0,
      minimal: 0.05,
      subtle: 0.1,
      medium: 0.2,
      high: 0.4,
    };

    return opacityMap[opacity] || 0.2;
  }, []);

  const getGlowIntensity = useCallback((intensity: string | number) => {
    if (typeof intensity === "number") {
      return Math.max(0, Math.min(1, intensity));
    }

    const intensityMap: Record<string, number> = {
      minimal: 0.02,
      light: 0.05,
      medium: 0.1,
      strong: 0.15,
      extreme: 0.25,
    };

    return intensityMap[intensity] || 0.1;
  }, []);

  // Helper to create glass surface styles
  const createSurface = useCallback(
    (props: GlassSurfaceProps) => {
      const {
        variant = "standard",
        elevation: rawElevation = 1,
        interactive = false,
      } = props;

      // Ensure elevation is a number
      const elevation: number =
        typeof rawElevation === "string"
          ? rawElevation === "level1"
            ? 1
            : rawElevation === "level2"
              ? 2
              : rawElevation === "level3"
                ? 3
                : rawElevation === "level4"
                  ? 4
                  : 1
          : Number(rawElevation);

      // Get glass-specific color values
      const backgroundColor = isDarkMode
        ? "var(--glass-bg-dark, rgba(0, 0, 0, 0.2))"
        : "var(--glass-bg-light, rgba(255, 255, 255, 0.1))";

      const borderColor = isDarkMode
        ? "var(--glass-border-dark, rgba(255, 255, 255, 0.1))"
        : "var(--glass-border-light, rgba(0, 0, 0, 0.1))";

      const shadowColor = isDarkMode
        ? "var(--glass-shadow-dark, rgba(0, 0, 0, 0.3))"
        : "var(--glass-shadow-light, rgba(0, 0, 0, 0.1))";

      const glowColor = isDarkMode
        ? "var(--glass-glow-dark, hsl(var(--glass-color-primary)))"
        : "var(--glass-glow-light, #6366f1)";

      // Get opacity and blur values from qualityTier
      const bgOpacity = getBackgroundOpacity("medium");
      const borderOpacityValue = getBorderOpacity("medium");
      const blurValue = getBlurStrength("medium");
      const glowValue = getGlowIntensity("medium");

      // Build styles based on glass variant
      const baseStyles = `
      position: relative;
      background-color: ${backgroundColor};
      backdrop-filter: blur(${blurValue});
      -webkit-backdrop-filter: blur(${blurValue});
      border: 1px solid ${borderColor};
      box-shadow: 0 4px 12px ${shadowColor};
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    `;

      // Add variant-specific styles
      let variantStyles = "";

      // Variables for all cases
      let blurNumber: number;
      let bgOpacityAdjusted: number;
      let blurAdjusted: number;
      let dimBgOpacity: number;

      switch (variant) {
        case "frosted":
          // Parse blur value as number if it's a string
          blurNumber =
            typeof blurValue === "string"
              ? parseInt(blurValue.replace("px", ""), 10)
              : Number(blurValue);

          bgOpacityAdjusted = bgOpacity * 0.7;
          blurAdjusted = blurNumber * 1.5;

          variantStyles = `
          background-color: rgba(255, 255, 255, ${bgOpacityAdjusted});
          backdrop-filter: blur(${blurAdjusted}px);
          -webkit-backdrop-filter: blur(${blurAdjusted}px);
          border-width: 1px;
        `;
          break;
        case "crystal":
          dimBgOpacity = bgOpacity * 0.6;
          const dimElev2 = elevation * 2;
          const dimElev6 = elevation * 6;
          const dimElev05 = elevation * 0.5;
          const dimElev1 = elevation * 1;

          variantStyles = `
          background-color: rgba(255, 255, 255, ${dimBgOpacity});
          box-shadow: 
            0 ${dimElev2}px ${dimElev6}px ${shadowColor},
            0 ${dimElev05}px ${dimElev1}px rgba(0, 0, 0, 0.03),
            inset 0 0 0 1px rgba(255, 255, 255, ${borderOpacityValue});
          border-width: 0;
        `;
          break;
        case "metallic":
          const accentColor = isDarkMode
            ? "hsl(var(--glass-color-primary))"
            : "#6366f1";
          const bgOpacityTop = bgOpacity * 0.6;
          const bgOpacityBottom = bgOpacity * 0.4;
          const elevationDouble = elevation * 2;
          const elevationSix = elevation * 6;
          const elevationFive = elevation * 5;

          variantStyles = `
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, ${bgOpacityTop}) 0%,
            rgba(${accentColor}, ${bgOpacityBottom}) 100%
          );
          box-shadow: 
            0 ${elevationDouble}px ${elevationSix}px ${shadowColor},
            0 0 ${elevationFive}px rgba(${accentColor}, ${glowValue});
        `;
          break;
        case "standard":
        default:
          const stdElev2 = elevation * 2;
          const stdElev6 = elevation * 6;

          variantStyles = `
          background-color: rgba(255, 255, 255, ${bgOpacity});
          box-shadow: 
            0 ${stdElev2}px ${stdElev6}px ${shadowColor},
            inset 0 0 0 1px rgba(255, 255, 255, ${borderOpacityValue});
        `;
          break;
      }

      // Add interactive states if required
      const hoverElev3 = elevation * 3;
      const hoverElev8 = elevation * 8;
      const hoverElev2 = elevation * 2;
      const activeElev1 = elevation * 1;
      const activeElev3 = elevation * 3;

      const interactiveStyles = interactive
        ? `
      &:hover {
        transform: translateY(-2px);
        box-shadow: 
          0 ${hoverElev3}px ${hoverElev8}px ${shadowColor},
          0 0 ${hoverElev2}px ${glowColor};
      }
      
      &:active {
        transform: translateY(0);
        box-shadow: 
          0 ${activeElev1}px ${activeElev3}px ${shadowColor};
      }
    `
        : "";

      return `
      ${baseStyles}
      ${variantStyles}
      ${interactiveStyles}
    `;
    },
    [
      isDarkMode,
      getBackgroundOpacity,
      getBorderOpacity,
      getBlurStrength,
      getGlowIntensity,
    ]
  );

  /**
   * GlassSurface Component - A component for rendering glass surfaces with configurable properties
   */
  function GlassSurfaceComponent(
    props: GlassSurfaceProps & { children?: React.ReactNode }
  ) {
    const {
      variant = "frosted",
      elevation = "level1",
      interactive = false,
      children,
      ...rest
    } = props;

    // Generate a unique ID for this surface
    const uniqueId = useId();
    const surfaceId = useMemo(
      () => `glass-surface-${uniqueId.replace(/:/g, "-")}`,
      [uniqueId]
    );

    // Get the glass styles
    const cssString = createSurface({
      variant,
      elevation,
      interactive,
    });

    return (
      <div id={surfaceId} {...rest}>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          #${surfaceId} {
            ${cssString}
          }
        `,
          }}
        />
        {children}
      </div>
    );
  }

  // Use the component directly
  const GlassSurface = GlassSurfaceComponent;

  // ------ Create Responsive Utilities ------
  const breakpoints = useMemo(() => {
    return {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    };
  }, []);

  const mediaQuery = useCallback(
    (breakpoint: string) => {
      const width = breakpoints[breakpoint as keyof typeof breakpoints] || 0;
      return `@media (min-width: ${width}px)`;
    },
    [breakpoints]
  );

  const isMobile = useMemo(() => {
    return ["xs", "sm"].includes(currentBreakpoint);
  }, [currentBreakpoint]);

  const isTablet = useMemo(() => {
    return currentBreakpoint === "md";
  }, [currentBreakpoint]);

  const isDesktop = useMemo(() => {
    return ["lg", "xl"].includes(currentBreakpoint);
  }, [currentBreakpoint]);

  // ------ Create Context Values ------

  // ColorMode context
  const colorModeContextValue = useMemo(
    () => ({
      colorMode: forceColorMode || colorMode,
      setColorMode,
      isDarkMode,
      toggleColorMode,
      systemPrefersDark,
    }),
    [
      forceColorMode,
      colorMode,
      setColorMode,
      isDarkMode,
      toggleColorMode,
      systemPrefersDark,
    ]
  );

  // ThemeVariant context
  const themeVariantContextValue = useMemo(
    () => ({
      themeVariant,
      setThemeVariant,
      availableThemes: [..._THEME_VARIANTS],
    }),
    [themeVariant, setThemeVariant]
  );

  // Theme utility functions
  const getSpacing = useCallback(
    (size: string | number) => {
      if (typeof size === "number") return `${size * 8}px`;

      const key = size.startsWith("spacing.")
        ? size.replace("spacing.", "")
        : size;

      const personaSpacing = personaConfig.spacing as unknown as Record<
        string,
        string
      >;
      if (key in personaSpacing) {
        return personaSpacing[key];
      }

      const spacingMap = {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
      } as const;

      return spacingMap[key as keyof typeof spacingMap] || "0";
    },
    [personaConfig.spacing]
  );

  const getShadow = useCallback(
    (level: number, color?: string): string => {
      if (level <= 0) {
        return "none";
      }

      if (level === 1 && color) {
        return `0 1px 2px ${color}`;
      }

      if (level >= 1) {
        return personaConfig.colors.shadow.panel;
      }

      return personaConfig.colors.shadow.panel;
    },
    [personaConfig.colors.shadow.panel]
  );

  const getBorderRadius = useCallback(
    (size: string) => {
      const key = size.startsWith("radius.")
        ? size.replace("radius.", "")
        : size;

      if (key === "panel" || key === "panelRadius") {
        return personaConfig.spacing.panelRadius;
      }

      if (key === "button" || key === "buttonRadius") {
        return personaConfig.spacing.buttonRadius;
      }

      const borderRadiusMap = {
        none: "0",
        sm: "0.25rem",
        md: "0.5rem",
        lg: "1rem",
      } as const;
      return borderRadiusMap[key as keyof typeof borderRadiusMap] || "0";
    },
    [personaConfig.spacing.buttonRadius, personaConfig.spacing.panelRadius]
  );

  const getZIndex = useCallback((layer: string): number => {
    const zIndexMap = { base: 0, modal: 1000, tooltip: 1100 };
    return zIndexMap[layer as keyof typeof zIndexMap] || 0;
  }, []);

  const getTypography = useCallback(
    (variant: string) => {
      const key = variant.startsWith("typography.")
        ? variant.replace("typography.", "")
        : variant;

      const personaTypography = personaConfig.typography as unknown as Record<
        string,
        {
          weight: number;
          size: string;
          letterSpacing: string;
          lineHeight?: string;
        }
      >;

      if (key in personaTypography) {
        const spec = personaTypography[key];
        return {
          fontWeight: spec.weight,
          fontSize: spec.size,
          letterSpacing: spec.letterSpacing,
          ...(spec.lineHeight ? { lineHeight: spec.lineHeight } : {}),
        };
      }

      const typographyMap = {
        h1: { fontSize: "2.5rem", fontWeight: 600 },
        h2: { fontSize: "2rem", fontWeight: 600 },
        h3: { fontSize: "1.5rem", fontWeight: 600 },
        body: { fontSize: "1rem", fontWeight: 400 },
      } as const;

      return typographyMap[key as keyof typeof typographyMap] || {};
    },
    [personaConfig.typography]
  );

  // StyleUtils context
  const styleUtilsContextValue = useMemo(
    () => ({
      getColor,
      getSpacing,
      getShadow,
      getBorderRadius,
      getZIndex,
      getTypography,
    }),
    [getColor, getSpacing, getShadow, getBorderRadius, getZIndex, getTypography]
  );

  const personaContextValue = useMemo(
    () => ({
      personaId: resolvedPersonaId,
      persona: personaConfig,
      setPersona,
      personas: PERSONA_LIST,
    }),
    [personaConfig, resolvedPersonaId, setPersona]
  );

  // GlassEffects context including the component
  const glassEffectsContextValue = useMemo(
    () => ({
      qualityTier,
      setQualityTier,
      getBlurStrength,
      getBackgroundOpacity,
      getBorderOpacity,
      getGlowIntensity,
      createSurface,
      GlassSurface,
    }),
    [
      qualityTier,
      setQualityTier,
      getBlurStrength,
      getBackgroundOpacity,
      getBorderOpacity,
      getGlowIntensity,
      createSurface,
      GlassSurface,
    ]
  );

  // Preferences context
  const preferencesContextValue = useMemo(
    () => ({
      reducedMotion: preferences.reducedMotion,
      reducedTransparency: preferences.reducedTransparency,
      highContrastMode: preferences.highContrastMode,
      setPreference,
      getUserPreference,
    }),
    [preferences, setPreference, getUserPreference]
  );

  // Responsive context
  const responsiveContextValue = useMemo(
    () => ({
      breakpoints,
      currentBreakpoint,
      isMobile,
      isTablet,
      isDesktop,
      mediaQuery,
    }),
    [breakpoints, currentBreakpoint, isMobile, isTablet, isDesktop, mediaQuery]
  );

  // Prevent transitions during theme changes
  useEffect(() => {
    if (!disableTransitions) {
      return;
    }

    const doc = getSafeDocument();
    if (!doc) {
      return;
    }

    doc.documentElement.classList.add("disable-transitions");
    const timeout = setTimeout(() => {
      doc.documentElement.classList.remove("disable-transitions");
    }, 100);

    return () => clearTimeout(timeout);
  }, [isDarkMode, themeVariant, disableTransitions]);

  // Apply scroll optimization
  useEffect(() => {
    if (!enableScrollOptimization || !isBrowser()) {
      return;
    }
    const doc = getSafeDocument();
    const win = getSafeWindow();
    if (!doc || !win) {
      return;
    }
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    let isScrolling = false;

    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        doc.documentElement.classList.add("is-scrolling");
      }

      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }

      scrollTimer = setTimeout(() => {
        isScrolling = false;
        doc.documentElement.classList.remove("is-scrolling");
      }, 150);
    };

    win.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      win.removeEventListener("scroll", handleScroll);
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
    };
  }, [enableScrollOptimization]);

  // Render multi-context provider
  const themedChildren = isolateTheme ? (
    <div
      ref={themeHostRef}
      data-aura-theme={resolvedPersonaId}
      data-aura-mode={resolvedMode}
      data-theme={resolvedMode}
      data-persona={resolvedPersonaId}
      className={resolvedMode === "dark" ? "dark" : undefined}
    >
      {children}
    </div>
  ) : (
    children
  );

  return (
    <ThemeProviderPresenceContext.Provider value={true}>
      <ColorModeContext.Provider value={colorModeContextValue}>
        <ThemeVariantContext.Provider value={themeVariantContextValue}>
          <PersonaContext.Provider value={personaContextValue}>
            <StyleUtilsContext.Provider value={styleUtilsContextValue}>
              <GlassEffectsContext.Provider value={glassEffectsContextValue}>
                <PreferencesContext.Provider value={preferencesContextValue}>
                  <ResponsiveContext.Provider value={responsiveContextValue}>
                    {themedChildren}
                  </ResponsiveContext.Provider>
                </PreferencesContext.Provider>
              </GlassEffectsContext.Provider>
            </StyleUtilsContext.Provider>
          </PersonaContext.Provider>
        </ThemeVariantContext.Provider>
      </ColorModeContext.Provider>
    </ThemeProviderPresenceContext.Provider>
  );
};

/**
 * ThemeProvider component (exporting the unified provider directly for now).
 *
 * This component provides theme context.
 */
export const ThemeProvider = UnifiedThemeProvider;

// ------ Theme Hooks ------

/**
 * Returns the full theme object based on current settings.
 */
export const useTheme = () => {
  const colorModeContext = useContext(ColorModeContext);
  const themeVariantContext = useContext(ThemeVariantContext);
  const styleUtilsContext = useContext(StyleUtilsContext);
  const personaContext = useContext(PersonaContext);

  if (
    !colorModeContext ||
    !themeVariantContext ||
    !styleUtilsContext ||
    !personaContext
  ) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return {
    isDark: colorModeContext.isDarkMode,
    currentColorMode: colorModeContext.colorMode,
    toggleColorMode: colorModeContext.toggleColorMode,
    setColorMode: colorModeContext.setColorMode,
    currentTheme: themeVariantContext.themeVariant,
    setTheme: themeVariantContext.setThemeVariant,
    availableThemes: themeVariantContext.availableThemes,
    personaId: personaContext.personaId,
    setPersona: personaContext.setPersona,
    persona: personaContext.persona,
    personas: personaContext.personas,
    ...styleUtilsContext,
  };
};

/**
 * Hook for accessing only color mode aspects of the theme.
 * More efficient than useTheme when only color mode is needed.
 */
export const useColorMode = (): ColorModeContextType => {
  const context = useContext(ColorModeContext);

  if (!context) {
    throw new Error("useColorMode must be used within a ThemeProvider");
  }

  return context;
};

/**
 * Hook for accessing only theme variant aspects.
 * More efficient than useTheme when only theme variant is needed.
 */
export const useThemeVariant = (): ThemeVariantContextType => {
  const context = useContext(ThemeVariantContext);

  if (!context) {
    throw new Error("useThemeVariant must be used within a ThemeProvider");
  }

  return context;
};

export const usePersonaTheme = (): PersonaContextType => {
  const context = useContext(PersonaContext);

  if (!context) {
    throw new Error("usePersonaTheme must be used within a ThemeProvider");
  }

  return context;
};

/**
 * Hook for accessing only style utilities.
 */
export const useStyleUtils = (): StyleUtilsContextType => {
  const context = useContext(StyleUtilsContext);

  if (!context) {
    throw new Error("useStyleUtils must be used within a ThemeProvider");
  }

  return context;
};

/**
 * Hook for accessing only glass effect utilities.
 */
export const useGlassEffects = (): GlassEffectsContextType => {
  const context = useContext(GlassEffectsContext);

  if (!context) {
    throw new Error("useGlassEffects must be used within a ThemeProvider");
  }

  return context;
};

/**
 * Hook for accessing only preference settings.
 */
export const usePreferences = (): PreferencesContextType => {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used within a ThemeProvider");
  }

  return context;
};

/**
 * Hook for accessing only responsive context.
 */
export const useResponsive = (): ResponsiveContextType => {
  const context = useContext(ResponsiveContext);

  if (!context) {
    throw new Error("useResponsive must be used within a ThemeProvider");
  }

  return context;
};

/**
 * ThemeObserver hook for subscribing to theme changes without re-rendering.
 */
export const useThemeObserver = (
  callback: (theme: string, isDark: boolean) => void
) => {
  const { isDark, currentTheme } = useTheme();

  useEffect(() => {
    callback(currentTheme, isDark);
  }, [callback, currentTheme, isDark]);
};

// Alias for backward compatibility
export const GlassThemeProvider = ThemeProvider;
