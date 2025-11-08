'use client';
import React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';

export interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  colorScheme: 'light' | 'dark' | 'auto';
  forcedColors: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

export interface AccessibilityOptions {
  enableStorage?: boolean;
  storageKey?: string;
  detectScreenReader?: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  reducedMotion: false,
  highContrast: false,
  largeText: false,
  colorScheme: 'auto',
  forcedColors: false,
  screenReader: false,
  keyboardNavigation: false,
};

/**
 * Enhanced accessibility settings hook with comprehensive device detection
 */
export function useAccessibilitySettings(options: AccessibilityOptions = {}): {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  resetSettings: () => void;
  isLoading: boolean;
} {
  const {
    enableStorage = true,
    storageKey = 'aura-glass-a11y-settings',
    detectScreenReader = true,
  } = options;

  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const mediaQueriesRef = useRef<MediaQueryList[]>([]);
  const keyboardDetectionRef = useRef<boolean>(false);

  // Detect screen reader usage
  const detectScreenReaderUsage = useCallback((): boolean => {
    if (!detectScreenReader || typeof window === 'undefined') return false;

    // Check for common screen reader indicators
    const indicators = [
      // NVDA
      () => 'speechSynthesis' in window && window.speechSynthesis.getVoices().length > 0,
      // JAWS, NVDA, others
      () => navigator.userAgent.includes('NVDA') || navigator.userAgent.includes('JAWS'),
      // VoiceOver (macOS/iOS)
      () => 'webkitSpeechRecognition' in window,
      // General screen reader detection
      () => window.navigator.userAgent.includes('Screenreader'),
    ];

    return indicators.some(indicator => {
      try {
        return indicator();
      } catch {
        return false;
      }
    });
  }, [detectScreenReader]);

  // Detect keyboard navigation preference
  const detectKeyboardNavigation = useCallback(() => {
    let keyboardUsed = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ' || e.key.startsWith('Arrow')) {
        keyboardUsed = true;
        keyboardDetectionRef.current = true;
        setSettings((prev: any) => ({ ...prev, keyboardNavigation: true }));
      }
    };

    const handleMouseDown = () => {
      if (keyboardUsed) {
        keyboardDetectionRef.current = false;
        setSettings((prev: any) => ({ ...prev, keyboardNavigation: false }));
      }
    };

    document.addEventListener('keydown', handleKeyDown, { passive: true });
    document.addEventListener('mousedown', handleMouseDown, { passive: true });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Load settings from storage
  const loadStoredSettings = useCallback((): Partial<AccessibilitySettings> => {
    if (!enableStorage || typeof window === 'undefined') return {};

    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Failed to load accessibility settings from storage:', error);
      return {};
    }
  }, [enableStorage, storageKey]);

  // Save settings to storage
  const saveSettings = useCallback((newSettings: AccessibilitySettings) => {
    if (!enableStorage || typeof window === 'undefined') return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(newSettings));
    } catch (error) {
      console.warn('Failed to save accessibility settings to storage:', error);
    }
  }, [enableStorage, storageKey]);

  // Update individual setting
  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings((prev: any) => {
      const newSettings = { ...prev, [key]: value };
      saveSettings(newSettings);
      return newSettings;
    });
  }, [saveSettings]);

  // Reset to defaults
  const resetSettings = useCallback(() => {
    const detectedSettings = detectSystemSettings();
    const newSettings = { ...DEFAULT_SETTINGS, ...detectedSettings };
    setSettings(newSettings);
    saveSettings(newSettings);
  }, [saveSettings]);

  // Detect system accessibility preferences
  const detectSystemSettings = useCallback((): Partial<AccessibilitySettings> => {
    if (typeof window === 'undefined') return {};

    const queries = [
      { key: 'reducedMotion', query: '(prefers-reduced-motion: reduce)' },
      { key: 'highContrast', query: '(prefers-contrast: high)' },
      { key: 'forcedColors', query: '(forced-colors: active)' },
    ];

    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const detected: Partial<AccessibilitySettings> = {
      screenReader: detectScreenReaderUsage(),
      colorScheme: colorSchemeQuery.matches ? 'dark' : 'light',
    };

    queries.forEach(({ key, query }) => {
      try {
        const mediaQuery = window.matchMedia(query);
        (detected as any)[key] = mediaQuery.matches;
      } catch (error) {
        console.warn(`Failed to detect ${key} preference:`, error);
      }
    });

    return detected;
  }, [detectScreenReaderUsage]);

  // Initialize settings
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const initializeSettings = async () => {
      try {
        // Detect system preferences
        const systemSettings = detectSystemSettings();
        
        // Load stored preferences
        const storedSettings = loadStoredSettings();
        
        // Merge with priority: stored > system > defaults
        const initialSettings = {
          ...DEFAULT_SETTINGS,
          ...systemSettings,
          ...storedSettings,
        };

        setSettings(initialSettings);

        // Set up media query listeners
        const queries = [
          { key: 'reducedMotion', query: '(prefers-reduced-motion: reduce)' },
          { key: 'highContrast', query: '(prefers-contrast: high)' },
          { key: 'forcedColors', query: '(forced-colors: active)' },
        ];

        const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const updateFromMediaQuery = () => {
          const updates: Partial<AccessibilitySettings> = {
            colorScheme: colorSchemeQuery.matches ? 'dark' : 'light',
          };

          queries.forEach(({ key, query }) => {
            try {
              const mediaQuery = window.matchMedia(query);
              (updates as any)[key] = mediaQuery.matches;
            } catch (error) {
              console.warn(`Failed to update ${key} from media query:`, error);
            }
          });

          setSettings((prev: any) => {
            const newSettings = { ...prev, ...updates };
            saveSettings(newSettings);
            return newSettings;
          });
        };

        // Add listeners
        const mediaQueries = [
          ...queries.map(({ query }) => window.matchMedia(query)),
          colorSchemeQuery,
        ];

        mediaQueries.forEach((mq: any) => {
          mq.addEventListener('change', updateFromMediaQuery);
        });

        mediaQueriesRef.current = mediaQueries;

        // Set up keyboard detection
        const cleanupKeyboardDetection = detectKeyboardNavigation();

        // Cleanup function
        return () => {
          mediaQueries.forEach((mq: any) => {
            mq.removeEventListener('change', updateFromMediaQuery);
          });
          cleanupKeyboardDetection();
        };
      } catch (error) {
        console.error('Failed to initialize accessibility settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const cleanup = initializeSettings();
    
    return () => {
      cleanup?.then(fn => fn?.());
    };
  }, [detectSystemSettings, loadStoredSettings, saveSettings, detectKeyboardNavigation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mediaQueriesRef.current = [];
    };
  }, []);

  return {
    settings,
    updateSetting,
    resetSettings,
    isLoading,
  };
}

/**
 * Hook for specific accessibility feature detection
 */
export function useAccessibilityFeature(feature: keyof AccessibilitySettings): boolean {
  const { settings } = useAccessibilitySettings();
  return settings[feature] as boolean;
}

/**
 * Hook for accessibility-aware animations
 */
export function useAccessibleAnimation(defaultEnabled: boolean = true): {
  shouldAnimate: boolean;
  animationDuration: number;
  transitionDuration: number;
} {
  const { settings } = useAccessibilitySettings();
  
  const shouldAnimate = defaultEnabled && !settings.reducedMotion;
  const animationDuration = settings.reducedMotion ? 0 : 300;
  const transitionDuration = settings.reducedMotion ? 0 : 200;

  return {
    shouldAnimate,
    animationDuration,
    transitionDuration,
  };
}

/**
 * Hook for accessibility-aware colors
 */
export function useAccessibleColors(): {
  shouldUseHighContrast: boolean;
  colorScheme: 'light' | 'dark' | 'auto';
  forcedColors: boolean;
} {
  const { settings } = useAccessibilitySettings();

  return {
    shouldUseHighContrast: settings.highContrast,
    colorScheme: settings.colorScheme,
    forcedColors: settings.forcedColors,
  };
}