'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  glassBase: string;
  glassTint: string;
}

interface ColorAnalysis {
  dominantColors: string[];
  brightness: number;
  contrast: number;
  temperature: 'warm' | 'cool' | 'neutral';
  saturation: number;
  mood: 'energetic' | 'calm' | 'vibrant' | 'muted';
}

interface ColorAdaptationConfig {
  enabled: boolean;
  sensitivity: number;
  transitionDuration: number;
  preserveAccessibility: boolean;
  contextualAwareness: boolean;
  timeBasedShifts: boolean;
  seasonalAdaptation: boolean;
  brandColorInfluence: number;
}

interface IntelligentColorContextType {
  currentPalette: ColorPalette;
  config: ColorAdaptationConfig;
  adaptToPalette: (analysis: ColorAnalysis) => void;
  adaptToTime: (timeOfDay: number) => void;
  adaptToSeason: (season: 'spring' | 'summer' | 'autumn' | 'winter') => void;
  adaptToBrand: (brandColors: string[]) => void;
  updateConfig: (newConfig: Partial<ColorAdaptationConfig>) => void;
  analyzeContent: (element: HTMLElement) => ColorAnalysis;
  getAccessiblePalette: (basePalette: ColorPalette) => ColorPalette;
}

const defaultPalette: ColorPalette = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  accent: '#06b6d4',
  background: '#0f172a',
  surface: '#1e293b',
  text: '#f8fafc',
  textSecondary: '#cbd5e1',
  border: 'var(--glass-bg-default)',
  glassBase: 'var(--glass-bg-default)',
  glassTint: 'rgba(255, 255, 255, 0.05)'
};

// Dark theme palette with high contrast text colors
const darkThemePalette: ColorPalette = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  accent: '#06b6d4',
  background: '#020617',
  surface: '#1e293b',
  text: 'var(--glass-text-primary)',
  textSecondary: 'rgba(255, 255, 255, 0.80)',
  border: 'var(--glass-bg-disabled)',
  glassBase: 'var(--glass-bg-disabled)',
  glassTint: 'rgba(255, 255, 255, 0.08)'
};

const IntelligentColorContext = createContext<IntelligentColorContextType | null>(null);

export const useIntelligentColor = () => {
  const context = useContext(IntelligentColorContext);
  if (!context) {
    throw new Error('useIntelligentColor must be used within IntelligentColorProvider');
  }
  return context;
};

// Memoized color conversion functions for better performance
const hexToRgbCache = new Map<string, [number, number, number] | null>();
const hexToRgb = (hex: string): [number, number, number] | null => {
  if (hexToRgbCache.has(hex)) {
    return hexToRgbCache.get(hex)!;
  }

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const rgb: [number, number, number] | null = result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;

  hexToRgbCache.set(hex, rgb);
  return rgb;
};

const rgbToHslCache = new Map<string, [number, number, number]>();
const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  const key = `${r},${g},${b}`;
  if (rgbToHslCache.has(key)) {
    return rgbToHslCache.get(key)!;
  }

  let rNorm = r / 255;
  let gNorm = g / 255;
  let bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
      case gNorm: h = (bNorm - rNorm) / d + 2; break;
      case bNorm: h = (rNorm - gNorm) / d + 4; break;
    }
    h /= 6;
  }

  const hsl: [number, number, number] = [h * 360, s * 100, l * 100];
  rgbToHslCache.set(key, hsl);
  return hsl;
};

const hslToHexCache = new Map<string, string>();
const hslToHex = (h: number, s: number, l: number): string => {
  const key = `${Math.round(h)},${Math.round(s)},${Math.round(l)}`;
  if (hslToHexCache.has(key)) {
    return hslToHexCache.get(key)!;
  }

  let hNorm = h / 360;
  let sNorm = s / 100;
  let lNorm = l / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
  const p = 2 * lNorm - q;

  const r = hue2rgb(p, q, hNorm + 1/3);
  const g = hue2rgb(p, q, hNorm);
  const b = hue2rgb(p, q, hNorm - 1/3);

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  hslToHexCache.set(key, hex);
  return hex;
};

const calculateLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = rgb.map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const getContrastRatio = (color1: string, color2: string): number => {
  const lum1 = calculateLuminance(color1);
  const lum2 = calculateLuminance(color2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

const adjustColorForAccessibility = (
  foreground: string,
  background: string,
  targetRatio: number = 4.5
): string => {
  const currentRatio = getContrastRatio(foreground, background);
  if (currentRatio >= targetRatio) return foreground;

  const rgb = hexToRgb(foreground);
  if (!rgb) return foreground;

  const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);

  let newL = l;
  let iterations = 0;
  const maxIterations = 100;
  const step = currentRatio < targetRatio ? (l > 50 ? -2 : 2) : 0;

  while (iterations < maxIterations) {
    const testColor = hslToHex(h, s, Math.max(0, Math.min(100, newL)));
    const testRatio = getContrastRatio(testColor, background);

    if (testRatio >= targetRatio) return testColor;

    newL += step;
    if (newL <= 0 || newL >= 100) break;
    iterations++;
  }

  return foreground;
};

export const IntelligentColorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Detect if we're in a dark theme context
  const isDarkTheme = typeof document !== 'undefined' &&
    (document.documentElement.classList.contains('dark') ||
     document.documentElement.getAttribute('data-theme') === 'dark');

  const [currentPalette, setCurrentPalette] = useState<ColorPalette>(
    isDarkTheme ? darkThemePalette : defaultPalette
  );
  const [config, setConfig] = useState<ColorAdaptationConfig>({
    enabled: true,
    sensitivity: 0.7,
    transitionDuration: 0.8,
    preserveAccessibility: true,
    contextualAwareness: true,
    timeBasedShifts: true,
    seasonalAdaptation: true,
    brandColorInfluence: 0.3
  });

  const analyzeContent = useCallback((element: HTMLElement): ColorAnalysis => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return {
      dominantColors: [],
      brightness: 0.5,
      contrast: 0.5,
      temperature: 'neutral',
      saturation: 0.5,
      mood: 'calm'
    };

    // Basic implementation - in production, would use more sophisticated color analysis
    const computedStyle = getComputedStyle(element);
    const backgroundColor = computedStyle.backgroundColor;
    const textColor = computedStyle.color;

    const colors = [backgroundColor, textColor].filter(Boolean);

    // Calculate actual brightness from color values
    const calculateBrightness = (color: string): number => {
      const rgb = color.match(/\d+/g);
      if (!rgb) return 0.5;
      const [r, g, b] = rgb.map(Number);
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    };

    // Calculate contrast ratio
    const calculateContrast = (color1: string, color2: string): number => {
      const l1 = calculateBrightness(color1);
      const l2 = calculateBrightness(color2);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    };

    // Determine color temperature
    const determineTemperature = (color: string): 'warm' | 'cool' | 'neutral' => {
      const rgb = color.match(/\d+/g);
      if (!rgb) return 'neutral';
      const [r, g, b] = rgb.map(Number);
      const warmth = (r - b) / 255;
      return warmth > 0.1 ? 'warm' : warmth < -0.1 ? 'cool' : 'neutral';
    };

    const brightness = colors.length > 0 ? calculateBrightness(colors[0]) : 0.5;
    const contrast = colors.length > 1 ? calculateContrast(colors[0], colors[1]) / 21 : 0.5;
    const temperature = colors.length > 0 ? determineTemperature(colors[0]) : 'neutral';
    
    // Calculate saturation from primary color
    const calculateSaturation = (color: string): number => {
      const rgb = color.match(/\d+/g);
      if (!rgb) return 0.5;
      const [r, g, b] = rgb.map(n => Number(n) / 255);
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      return max === 0 ? 0 : (max - min) / max;
    };

    const saturation = colors.length > 0 ? calculateSaturation(colors[0]) : 0.5;
    
    // Determine mood based on brightness and saturation
    const determineMood = (brightness: number, saturation: number): 'energetic' | 'calm' | 'vibrant' | 'muted' => {
      if (brightness > 0.7 && saturation > 0.5) return 'energetic';
      if (brightness < 0.3 && saturation < 0.3) return 'muted';
      if (saturation > 0.6) return 'vibrant';
      return 'calm';
    };

    return {
      dominantColors: colors,
      brightness,
      contrast,
      temperature,
      saturation,
      mood: determineMood(brightness, saturation)
    };
  }, []);

  const adaptToPalette = useCallback((analysis: ColorAnalysis) => {
    if (!config.enabled) return;

    setCurrentPalette(prev => {
      const { dominantColors, brightness, saturation } = analysis;
      let newPalette = { ...prev };

      if (dominantColors.length > 0) {
        const primaryColor = dominantColors[0];
        const rgb = hexToRgb(primaryColor);
        if (rgb) {
          const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
          const brightnessMultiplier = brightness > 0.6 ? 0.8 : 1.2;
          const saturationMultiplier = saturation > 0.7 ? 0.9 : 1.1;
          newPalette.primary = hslToHex(h, s * saturationMultiplier, l * brightnessMultiplier);
          newPalette.secondary = hslToHex((h + 30) % 360, s * 0.8, l * 0.9);
          newPalette.accent = hslToHex((h + 120) % 360, s * 1.1, l * 0.85);
          newPalette.glassBase = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.1)`;
          newPalette.glassTint = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.05)`;
        }
      }

      if (config.preserveAccessibility) {
        newPalette = computeAccessiblePalette(newPalette);
      }
      return newPalette;
    });
  }, [config.enabled, config.preserveAccessibility]);

  const adaptToTime = useCallback((timeOfDay: number) => {
    if (!config.timeBasedShifts) return;
    const hour = timeOfDay;
    setCurrentPalette(prev => {
      const timeBasePalette = { ...prev };
      if (hour >= 5 && hour < 9) {
        timeBasePalette.primary = '#f59e0b';
        timeBasePalette.glassBase = 'rgba(245, 158, 11, 0.1)';
      } else if (hour >= 9 && hour < 17) {
        timeBasePalette.primary = '#3b82f6';
        timeBasePalette.glassBase = 'rgba(59, 130, 246, 0.1)';
      } else if (hour >= 17 && hour < 21) {
        timeBasePalette.primary = '#f97316';
        timeBasePalette.glassBase = 'rgba(249, 115, 22, 0.1)';
      } else {
        timeBasePalette.primary = '#6366f1';
        timeBasePalette.background = '#020617';
        timeBasePalette.glassBase = 'rgba(99, 102, 241, 0.08)';
      }
      return timeBasePalette;
    });
  }, [config.timeBasedShifts]);

  const adaptToSeason = useCallback((season: 'spring' | 'summer' | 'autumn' | 'winter') => {
    if (!config.seasonalAdaptation) return;
    setCurrentPalette(prev => {
      const seasonPalette = { ...prev };
      switch (season) {
        case 'spring':
          seasonPalette.primary = '#10b981';
          seasonPalette.secondary = '#f59e0b';
          seasonPalette.accent = '#ec4899';
          seasonPalette.glassBase = 'rgba(16, 185, 129, 0.1)';
          break;
        case 'summer':
          seasonPalette.primary = '#06b6d4';
          seasonPalette.secondary = '#f59e0b';
          seasonPalette.accent = '#ef4444';
          seasonPalette.glassBase = 'rgba(6, 182, 212, 0.1)';
          break;
        case 'autumn':
          seasonPalette.primary = '#f97316';
          seasonPalette.secondary = '#eab308';
          seasonPalette.accent = '#dc2626';
          seasonPalette.glassBase = 'rgba(249, 115, 22, 0.1)';
          break;
        case 'winter':
          seasonPalette.primary = '#6366f1';
          seasonPalette.secondary = '#06b6d4';
          seasonPalette.accent = '#8b5cf6';
          seasonPalette.background = '#020617';
          seasonPalette.glassBase = 'rgba(99, 102, 241, 0.08)';
          break;
      }
      return seasonPalette;
    });
  }, [config.seasonalAdaptation]);

  const adaptToBrand = useCallback((brandColors: string[]) => {
    if (brandColors.length === 0) return;
    const influence = config.brandColorInfluence;
    setCurrentPalette(prev => {
      const brandPalette = { ...prev };
      brandColors.forEach((color, index) => {
        const rgb = hexToRgb(color);
        if (rgb) {
          const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
          switch (index) {
            case 0: {
              const currentRgb = hexToRgb(brandPalette.primary);
              if (currentRgb) {
                const [currentH, currentS, currentL] = rgbToHsl(currentRgb[0], currentRgb[1], currentRgb[2]);
                const newH = currentH + (h - currentH) * influence;
                const newS = currentS + (s - currentS) * influence;
                const newL = currentL + (l - currentL) * influence;
                brandPalette.primary = hslToHex(newH, newS, newL);
              }
              break;
            }
            case 1:
              brandPalette.secondary = color;
              break;
            case 2:
              brandPalette.accent = color;
              break;
          }
          brandPalette.glassBase = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.1)`;
          brandPalette.glassTint = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.05)`;
        }
      });
      return brandPalette;
    });
  }, [config.brandColorInfluence]);

  const getAccessiblePalette = useCallback((basePalette: ColorPalette): ColorPalette => {
    const accessiblePalette = { ...basePalette };

    // Ensure text has sufficient contrast against backgrounds
    accessiblePalette.text = adjustColorForAccessibility(
      accessiblePalette.text,
      accessiblePalette.background,
      4.5
    );

    accessiblePalette.textSecondary = adjustColorForAccessibility(
      accessiblePalette.textSecondary,
      accessiblePalette.background,
      3.0
    );

    return accessiblePalette;
  }, []);

  const updateConfig = useCallback((newConfig: Partial<ColorAdaptationConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  // Pure helper to compute accessible palette without relying on hooks ordering
  const computeAccessiblePalette = (basePalette: ColorPalette): ColorPalette => {
    const accessiblePalette = { ...basePalette };
    accessiblePalette.text = adjustColorForAccessibility(
      accessiblePalette.text,
      accessiblePalette.background,
      4.5
    );
    accessiblePalette.textSecondary = adjustColorForAccessibility(
      accessiblePalette.textSecondary,
      accessiblePalette.background,
      3.0
    );
    return accessiblePalette;
  };

  // Auto-adapt to theme changes - optimized
  useEffect(() => {
    let lastThemeCheck = 0;
    const THEME_CHECK_DEBOUNCE = 100; // Only check theme every 100ms

    const checkThemeAndUpdate = () => {
      const now = Date.now();
      if (now - lastThemeCheck < THEME_CHECK_DEBOUNCE) return;

      lastThemeCheck = now;

      const isDarkTheme = document.documentElement.classList.contains('dark') ||
                         document.documentElement.getAttribute('data-theme') === 'dark';

      // Only update if the theme state actually changed
      const shouldBeDarkPalette = isDarkTheme;
      const isCurrentlyDarkPalette = currentPalette.text === darkThemePalette.text;

      if (shouldBeDarkPalette !== isCurrentlyDarkPalette) {
        setCurrentPalette(shouldBeDarkPalette ? darkThemePalette : defaultPalette);
      }
    };

    // Check theme on mount
    checkThemeAndUpdate();

    // Set up a mutation observer to watch for theme changes - less aggressive
    const observer = new MutationObserver((mutations) => {
      let hasRelevantChange = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          hasRelevantChange = true;
        }
      });

      if (hasRelevantChange) {
        // Debounce the theme check
        setTimeout(checkThemeAndUpdate, 50);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, [currentPalette.text]);

  // Auto-adapt to time of day - optimized for performance
  useEffect(() => {
    if (config.timeBasedShifts) {
      const updateTime = () => {
        const now = new Date();
        adaptToTime(now.getHours());
      };

      updateTime();
      // Reduce frequency to every 5 minutes for better performance
      const interval = setInterval(updateTime, 300000);

      return () => clearInterval(interval);
    }
  }, [config.timeBasedShifts]);

  // Auto-adapt to seasons
  useEffect(() => {
    if (config.seasonalAdaptation) {
      const now = new Date();
      const month = now.getMonth();

      let season: 'spring' | 'summer' | 'autumn' | 'winter';
      if (month >= 2 && month <= 4) season = 'spring';
      else if (month >= 5 && month <= 7) season = 'summer';
      else if (month >= 8 && month <= 10) season = 'autumn';
      else season = 'winter';

      adaptToSeason(season);
    }
  }, [config.seasonalAdaptation]);

  // Apply CSS custom properties for the current palette - optimized
  useEffect(() => {
    const root = document.documentElement;

    // Batch all CSS updates to minimize DOM manipulations
    const updates: Record<string, string> = {};

    // Check and queue text property updates
    const currentTextPrimary = root.style.getPropertyValue('--glass-text-primary');
    if (currentTextPrimary !== currentPalette.text) {
      updates['--glass-text-primary'] = currentPalette.text;
    }

    const currentTextSecondary = root.style.getPropertyValue('--glass-text-secondary');
    if (currentTextSecondary !== currentPalette.textSecondary) {
      updates['--glass-text-secondary'] = currentPalette.textSecondary;
      updates['--glass-text-tertiary'] = currentPalette.textSecondary;
      updates['--glass-text-disabled'] = currentPalette.textSecondary;
    }

    // Check and queue background/border updates
    const currentSurface = root.style.getPropertyValue('--glass-bg-default');
    if (currentSurface !== currentPalette.surface) {
      updates['--glass-bg-default'] = currentPalette.surface;
      updates['--glass-border-default'] = currentPalette.border;
      updates['--glass-border-subtle'] = currentPalette.border;
      updates['--glass-gradient-default'] = `linear-gradient(135deg, ${currentPalette.surface}, ${currentPalette.glassTint})`;
    }

    // Check and queue essential palette properties
    const essentialProps = ['primary', 'secondary', 'accent', 'background'];
    essentialProps.forEach(key => {
      const currentValue = root.style.getPropertyValue(`--glass-${key}`);
      const newValue = currentPalette[key as keyof ColorPalette] as string;
      if (currentValue !== newValue) {
        updates[`--glass-${key}`] = newValue;
      }
    });

    // Apply all updates in a single batch
    if (Object.keys(updates).length > 0) {
      requestAnimationFrame(() => {
        Object.entries(updates).forEach(([property, value]) => {
          root.style.setProperty(property, value);
        });
      });
    }
  }, [currentPalette]);

  const contextValue: IntelligentColorContextType = {
    currentPalette,
    config,
    adaptToPalette,
    adaptToTime,
    adaptToSeason,
    adaptToBrand,
    updateConfig,
    analyzeContent,
    getAccessiblePalette
  };

  return (
    <IntelligentColorContext.Provider value={contextValue}>
      {children}
    </IntelligentColorContext.Provider>
  );
};

export const ColorAdaptationDemo: React.FC = () => {
  const {
    currentPalette,
    config,
    adaptToTime,
    adaptToSeason,
    adaptToBrand,
    updateConfig
  } = useIntelligentColor();

  const demoColors = useMemo(() => [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'
  ], []);

  return (
    <motion.div
      className={cn('glass-p-6 glass-radius-2xl glass-blur-backdrop glass-border glass-border-white/20')}
      style={{
        background: `linear-gradient(135deg, ${currentPalette.glassBase}, ${currentPalette.glassTint})`,
        borderColor: currentPalette.border
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: config.transitionDuration }}
    >
      <h3 className={cn('glass-text-xl glass-font-bold glass-mb-4')} style={{ color: currentPalette.text }}>
        Intelligent Color System Demo
      </h3>

      {/* Current Palette Display */}
      <div className={cn('glass-grid glass-grid-cols-4 glass-gap-2 glass-mb-6')}>
        {Object.entries(currentPalette).map(([name, color]) => (
          <div key={name} className={cn('glass-text-center')}>
            <div
              className={cn('glass-w-full glass-h-12 glass-radius-lg glass-mb-2')}
              style={{ backgroundColor: color }}
            />
            <div className={cn('glass-text-xs')} style={{ color: currentPalette.textSecondary }}>
              {name}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className={cn('glass-space-y-4')}>
        <div>
          <label className={cn('glass-block glass-text-sm glass-font-medium glass-mb-2')} style={{ color: currentPalette.text }}>
            Time of Day
          </label>
          <div className={cn('glass-flex glass-space-x-2')}>
            {['Morning', 'Day', 'Evening', 'Night'].map((time, index) => (
              <motion.button
                key={time}
                className={cn('glass-px-3 glass-py-2 glass-radius-lg glass-text-sm glass-font-medium')}
                style={{
                  backgroundColor: currentPalette.primary,
                  color: currentPalette.background
                }}
                onClick={() => adaptToTime([6, 12, 18, 0][index])}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {time}
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className={cn('glass-block glass-text-sm glass-font-medium glass-mb-2')} style={{ color: currentPalette.text }}>
            Season
          </label>
          <div className={cn('glass-flex glass-space-x-2')}>
            {(['spring', 'summer', 'autumn', 'winter'] as const).map((season) => (
              <motion.button
                key={season}
                className={cn('glass-px-3 glass-py-2 glass-radius-lg glass-text-sm glass-font-medium glass-capitalize')}
                style={{
                  backgroundColor: currentPalette.secondary,
                  color: currentPalette.background
                }}
                onClick={() => adaptToSeason(season)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {season}
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className={cn('glass-block glass-text-sm glass-font-medium glass-mb-2')} style={{ color: currentPalette.text }}>
            Brand Colors
          </label>
          <div className={cn('glass-flex glass-space-x-2')}>
            {demoColors.map((color, i) => (
              <motion.button
                key={`${color}-${i}`}
                className={cn('glass-w-8 glass-h-8 glass-radius-full glass-border-2')}
                style={{
                  backgroundColor: color,
                  borderColor: currentPalette.border
                }}
                onClick={() => adaptToBrand([color])}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>

        <div className={cn('glass-flex glass-items-center glass-justify-between')}>
          <label style={{ color: currentPalette.text }}>
            Auto-adaptation enabled
          </label>
          <motion.button
            className={cn('glass-w-12 glass-h-6 glass-radius-full glass-p-1', config.enabled ? 'glass-surface-success' : 'glass-surface-muted')}
            onClick={() => updateConfig({ enabled: !config.enabled })}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className={cn('glass-w-4 glass-h-4 glass-surface-light glass-radius-full')}
              animate={{ x: config.enabled ? 24 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default IntelligentColorProvider;
