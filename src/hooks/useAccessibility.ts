import { useState, useEffect, useCallback } from 'react';

export interface AccessibilitySettings {
  // Visual preferences
  fontSize: 'small' | 'medium' | 'large' | 'x-large';
  contrast: 'normal' | 'high' | 'higher';
  colorBlindMode: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia';
  
  // Motion preferences
  reduceMotion: boolean;
  autoplayMedia: boolean;
  
  // Interaction preferences
  stickyFocus: boolean;
  announceChanges: boolean;
  keyboardNavigation: boolean;
  
  // Cognitive preferences
  simplifiedUI: boolean;
  readingGuide: boolean;
  focusIndicators: 'subtle' | 'prominent' | 'high-contrast';
}

export const defaultAccessibilitySettings: AccessibilitySettings = {
  fontSize: 'medium',
  contrast: 'normal',
  colorBlindMode: 'none',
  reduceMotion: false,
  autoplayMedia: true,
  stickyFocus: false,
  announceChanges: true,
  keyboardNavigation: true,
  simplifiedUI: false,
  readingGuide: false,
  focusIndicators: 'subtle',
};

export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultAccessibilitySettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('aura-accessibility-settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultAccessibilitySettings, ...parsed });
      }
    } catch (error) {
      console.warn('Failed to load accessibility settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Detect system preferences
  useEffect(() => {
    // Detect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches && !localStorage.getItem('aura-accessibility-settings')) {
        updateSettings({ reduceMotion: true });
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    
    // Set initial value if no stored preference
    if (mediaQuery.matches && !localStorage.getItem('aura-accessibility-settings')) {
      updateSettings({ reduceMotion: true });
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply CSS custom properties based on settings
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size scaling
    const fontSizeMap = {
      'small': '0.875',
      'medium': '1',
      'large': '1.125',
      'x-large': '1.25',
    };
    root.style.setProperty('--font-scale', fontSizeMap[settings.fontSize]);

    // Contrast adjustments
    const contrastMap = {
      'normal': '1',
      'high': '1.2',
      'higher': '1.5',
    };
    root.style.setProperty('--contrast-scale', contrastMap[settings.contrast]);

    // Motion preferences
    root.style.setProperty('--animation-duration', settings.reduceMotion ? '0.01s' : '0.3s');
    root.style.setProperty('--transition-duration', settings.reduceMotion ? '0.01s' : '0.2s');

    // Focus indicators
    const focusMap = {
      'subtle': '2px',
      'prominent': '3px', 
      'high-contrast': '4px',
    };
    root.style.setProperty('--focus-width', focusMap[settings.focusIndicators]);

    // Color blind filters
    if (settings.colorBlindMode !== 'none') {
      const filterMap = {
        'deuteranopia': 'sepia(100%) saturate(0%) hue-rotate(90deg)',
        'protanopia': 'sepia(100%) saturate(0%) hue-rotate(180deg)', 
        'tritanopia': 'sepia(100%) saturate(0%) hue-rotate(270deg)',
        'none': 'none',
      };
      root.style.setProperty('--color-blind-filter', filterMap[settings.colorBlindMode]);
    }

  }, [settings]);

  // Save settings to localStorage
  const updateSettings = useCallback((updates: Partial<AccessibilitySettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    
    try {
      localStorage.setItem('aura-accessibility-settings', JSON.stringify(newSettings));
    } catch (error) {
      console.warn('Failed to save accessibility settings:', error);
    }
  }, [settings]);

  // Reset to defaults
  const resetSettings = useCallback(() => {
    setSettings(defaultAccessibilitySettings);
    localStorage.removeItem('aura-accessibility-settings');
  }, []);

  // Announce changes to screen readers
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!settings.announceChanges) return;

    const announcer = document.getElementById('accessibility-announcer');
    if (announcer) {
      announcer.setAttribute('aria-live', priority);
      announcer.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    }
  }, [settings.announceChanges]);

  // Keyboard navigation helper
  const handleKeyboardNavigation = useCallback((event: KeyboardEvent, onEnter?: () => void, onEscape?: () => void) => {
    if (!settings.keyboardNavigation) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        onEnter?.();
        break;
      case 'Escape':
        event.preventDefault();
        onEscape?.();
        break;
    }
  }, [settings.keyboardNavigation]);

  // Focus management
  const focusElement = useCallback((element: HTMLElement | null) => {
    if (!element || !settings.stickyFocus) return;
    
    element.focus({ preventScroll: false });
    
    if (settings.focusIndicators !== 'subtle') {
      element.style.outline = `var(--focus-width) solid var(--primary)`;
      element.style.outlineOffset = '2px';
    }
  }, [settings.stickyFocus, settings.focusIndicators]);

  // Get CSS classes based on settings
  const getAccessibilityClasses = useCallback(() => {
    const classes = [];
    
    if (settings.reduceMotion) classes.push('reduce-motion');
    if (settings.simplifiedUI) classes.push('simplified-ui');
    if (settings.contrast !== 'normal') classes.push(`contrast-${settings.contrast}`);
    if (settings.colorBlindMode !== 'none') classes.push(`color-blind-${settings.colorBlindMode}`);
    if (settings.readingGuide) classes.push('reading-guide');
    
    return classes.join(' ');
  }, [settings]);

  return {
    settings,
    updateSettings,
    resetSettings,
    announce,
    handleKeyboardNavigation,
    focusElement,
    getAccessibilityClasses,
    isLoading,
  };
};

// Hook for checking specific accessibility features
export const useAccessibilityFeatures = () => {
  const { settings } = useAccessibility();
  
  return {
    prefersReducedMotion: settings.reduceMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    prefersHighContrast: settings.contrast !== 'normal' || window.matchMedia('(prefers-contrast: high)').matches,
    prefersLargeText: settings.fontSize === 'large' || settings.fontSize === 'x-large',
    hasColorBlindMode: settings.colorBlindMode !== 'none',
    needsFocusManagement: settings.stickyFocus || settings.keyboardNavigation,
  };
};