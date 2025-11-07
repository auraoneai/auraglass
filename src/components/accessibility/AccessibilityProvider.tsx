'use client';

import React from 'react';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { cn } from '../../lib/utilsComprehensive';

export interface AccessibilitySettings {
  focusIndicators: boolean;
  keyboardNavigation: boolean;
  screenReaderOptimized: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  colorBlindness: string;
  voiceCommands: boolean;
  motionControls: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  resetToDefaults: () => void;
  detectSystemPreferences: () => void;
}

const defaultSettings: AccessibilitySettings = {
  focusIndicators: true,
  keyboardNavigation: true,
  screenReaderOptimized: true,
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  colorBlindness: 'none',
  voiceCommands: false,
  motionControls: false
};

// Create context
const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
  initialSettings?: Partial<AccessibilitySettings>;
  storageKey?: string;
}

export function AccessibilityProvider({
  children,
  initialSettings = {},
  storageKey = 'aura-glass-accessibility-settings'
}: AccessibilityProviderProps) {
  // Merge default settings with initial settings
  const [settings, setSettings] = useState<AccessibilitySettings>({
    ...defaultSettings,
    ...initialSettings
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        setSettings((prev: any) => ({ ...prev, ...parsedSettings }));
      }
    } catch (error) {
      console.warn('Failed to load accessibility settings:', error);
    }
  }, [storageKey]);

  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save accessibility settings:', error);
    }
  }, [settings, storageKey]);

  // Detect system preferences
  const detectSystemPreferences = () => {
    const mediaQueryReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mediaQueryHighContrast = window.matchMedia('(prefers-contrast: high)');
    const mediaQueryColorScheme = window.matchMedia('(prefers-color-scheme: dark)');

    const newSettings: Partial<AccessibilitySettings> = {};

    if (mediaQueryReducedMotion.matches) {
      newSettings.reducedMotion = true;
    }

    if (mediaQueryHighContrast.matches) {
      newSettings.highContrast = true;
    }

    // Update settings with detected preferences
    if (Object.keys(newSettings).length > 0) {
      updateSettings(newSettings);
    }

    // Listen for changes in system preferences
    const handlePreferenceChange = (event: MediaQueryListEvent) => {
      if (event.media === '(prefers-reduced-motion: reduce)') {
        updateSettings({ reducedMotion: event.matches });
      } else if (event.media === '(prefers-contrast: high)') {
        updateSettings({ highContrast: event.matches });
      }
    };

    mediaQueryReducedMotion.addEventListener('change', handlePreferenceChange);
    mediaQueryHighContrast.addEventListener('change', handlePreferenceChange);

    return () => {
      mediaQueryReducedMotion.removeEventListener('change', handlePreferenceChange);
      mediaQueryHighContrast.removeEventListener('change', handlePreferenceChange);
    };
  };

  // Update settings
  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev: any) => ({ ...prev, ...newSettings }));
  };

  // Reset to defaults
  const resetToDefaults = () => {
    setSettings(defaultSettings);
  };

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;

    // Apply reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--animation-delay', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--animation-delay');
    }

    // Apply high contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply large text
    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Apply color blindness simulation
    root.setAttribute('data-color-blindness', settings.colorBlindness);

  }, [settings]);

  const contextValue: AccessibilityContextType = {
    settings,
    updateSettings,
    resetToDefaults,
    detectSystemPreferences
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// Hook to use accessibility context
export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

export default AccessibilityProvider;
