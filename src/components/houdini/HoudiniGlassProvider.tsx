'use client';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createGlassStyle } from '../../core/mixins/glassMixins';
import { cn } from '../../lib/utilsComprehensive';


interface HoudiniGlassContextType {
  isSupported: boolean;
  hasPropertyAPI: boolean;
  hasPaintAPI: boolean;
  globalPreset: keyof typeof glassPresets;
  setGlobalPreset: (preset: keyof typeof glassPresets) => void;
  globalProperties: Record<string, string>;
  updateGlobalProperty: (property: string, value: string) => void;
  enabledEffects: string[];
  toggleEffect: (effect: string) => void;
  performanceMode: boolean;
  setPerformanceMode: (enabled: boolean) => void;
  debugMode: boolean;
  setDebugMode: (enabled: boolean) => void;
}

const HoudiniGlassContext = createContext<HoudiniGlassContextType | null>(null);

// Glass presets with CSS custom properties
export const glassPresets = {
  standard: {
    '--glass-background': 'var(--glass-bg-default)',
    '--glass-border': 'var(--glass-border-default)',
    '--glass-blur': 'var(--glass-blur-lg)',
    '--glass-shadow': 'var(--glass-elev-2)',
    '--glass-animation-speed': '1',
    '--glass-blur-intensity': '10'
  },
  frosted: {
    '--glass-background': 'var(--glass-bg-hover)',
    '--glass-border': 'var(--glass-border-hover)',
    '--glass-blur': 'var(--glass-blur-xl)',
    '--glass-shadow': 'var(--glass-elev-3)',
    '--glass-animation-speed': '1.2',
    '--glass-blur-intensity': '15'
  },
  minimal: {
    '--glass-background': 'var(--glass-bg-active)',
    '--glass-border': 'var(--glass-border-disabled)',
    '--glass-blur': 'var(--glass-blur-sm)',
    '--glass-shadow': 'var(--glass-elev-1)',
    '--glass-animation-speed': '0.8',
    '--glass-blur-intensity': '5'
  },
  heavy: {
    '--glass-background': 'var(--glass-bg-strong)',
    '--glass-border': 'var(--glass-border-strong)',
    '--glass-blur': 'var(--glass-blur-2xl)',
    '--glass-shadow': 'var(--glass-elev-4)',
    '--glass-animation-speed': '1.5',
    '--glass-blur-intensity': '20'
  },
  crystal: {
    '--glass-background': 'var(--glass-bg-active)',
    '--glass-border': 'var(--glass-border-disabled)',
    '--glass-blur': 'var(--glass-blur-sm)',
    '--glass-shadow': 'var(--glass-elev-1)',
    '--glass-animation-speed': '0.5',
    '--glass-blur-intensity': '2'
  }
} as const;

export interface HoudiniGlassProviderProps {
  children: React.ReactNode;
  defaultPreset?: keyof typeof glassPresets;
  defaultProperties?: Record<string, string>;
  enabledEffects?: string[];
  performanceMode?: boolean;
  debugMode?: boolean;
}

export function HoudiniGlassProvider({
  children,
  defaultPreset = 'standard',
  defaultProperties = {},
  enabledEffects = ['frost', 'caustics', 'border'],
  performanceMode = false,
  debugMode = false
}: HoudiniGlassProviderProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [hasPropertyAPI, setHasPropertyAPI] = useState(false);
  const [hasPaintAPI, setHasPaintAPI] = useState(false);
  const [globalPreset, setGlobalPreset] = useState<keyof typeof glassPresets>(defaultPreset);
  const [globalProperties, setGlobalProperties] = useState<Record<string, string>>(defaultProperties);
  const [enabledEffectsState, setEnabledEffectsState] = useState<string[]>(enabledEffects);
  const [performanceModeState, setPerformanceModeState] = useState(performanceMode);
  const [debugModeState, setDebugModeState] = useState(debugMode);
  const [stylesInjected, setStylesInjected] = useState(false);

  // Initialize Houdini support detection and registration
  useEffect(() => {
    const detectSupport = () => {
      const propertyAPI = typeof CSS !== 'undefined' && 'registerProperty' in CSS;
      const paintAPI = typeof CSS !== 'undefined' && 'paintWorklet' in CSS;

      setHasPropertyAPI(propertyAPI);
      setHasPaintAPI(paintAPI);
      setIsSupported(propertyAPI || paintAPI);

      if (debugModeState) {
        console.log('Houdini Support Detection:', {
          propertyAPI,
          paintAPI,
          overall: propertyAPI || paintAPI
        });
      }

      return { propertyAPI, paintAPI };
    };

    const { propertyAPI, paintAPI } = detectSupport();

    // Register properties if supported
    if (propertyAPI) {
      try {
        registerGlassProperties();
        if (debugModeState) {
          console.log('Glass properties registered successfully');
        }
      } catch (error) {
        console.warn('Failed to register glass properties:', error);
      }
    }

    // Register worklets if supported and not in performance mode
    if (paintAPI && !performanceModeState) {
      try {
        registerGlassWorklets();
        if (debugModeState) {
          console.log('Glass worklets registered successfully');
        }
      } catch (error) {
        console.warn('Failed to register glass worklets:', error);
      }
    }
  }, [debugModeState, performanceModeState]);

  // Inject global styles
  useEffect(() => {
    if (!stylesInjected) {
      const styleElement = document.createElement('style');
      styleElement.textContent = houdiniGlassStyles;
      document.head.appendChild(styleElement);
      setStylesInjected(true);

      return () => {
        if (document.head.contains(styleElement)) {
          document.head.removeChild(styleElement);
        }
      };
    }
  }, [stylesInjected]);

  // Apply global preset to document root
  useEffect(() => {
    if (hasPropertyAPI && globalPreset) {
      const preset = glassPresets[globalPreset];
      Object.entries(preset).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
      });

      if (debugModeState) {
        console.log(`Applied global preset: ${globalPreset}`, preset);
      }
    }
  }, [globalPreset, hasPropertyAPI, debugModeState]);

  // Apply global properties to document root
  useEffect(() => {
    if (hasPropertyAPI) {
      Object.entries(globalProperties).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
      });

      if (debugModeState) {
        console.log('Applied global properties:', globalProperties);
      }
    }
  }, [globalProperties, hasPropertyAPI, debugModeState]);

  // Performance mode adjustments
  useEffect(() => {
    if (performanceModeState) {
      // Disable expensive effects in performance mode
      const reducedEffects = enabledEffectsState.filter((effect: any) =>
        !['caustics', 'refraction'].includes(effect)
      );
      setEnabledEffectsState((prev: any) => {
        const sameLength = prev.length === reducedEffects.length;
        const sameOrder = sameLength && prev.every((v: any, i: any) => v === reducedEffects[i]);
        return sameOrder ? prev : reducedEffects;
      });

      // Reduce animation complexity
      document.documentElement.style.setProperty('--glass-animation-speed', '0.5');
      document.documentElement.style.setProperty('--glass-blur-intensity', '5');

      if (debugModeState) {
        console.log('Performance mode enabled - reduced effects:', reducedEffects);
      }
    } else {
      // Restore full effects
      setEnabledEffectsState((prev: any) => {
        const next = enabledEffects;
        const sameLength = prev.length === next.length;
        const sameOrder = sameLength && prev.every((v: any, i: any) => v === next[i]);
        return sameOrder ? prev : next;
      });
      document.documentElement.style.setProperty('--glass-animation-speed', '1');
      document.documentElement.style.setProperty('--glass-blur-intensity', '10');
    }
  }, [performanceModeState, enabledEffects, debugModeState]);

  // Debug information logging
  useEffect(() => {
    if (debugModeState) {
      const interval = setInterval(() => {
        console.log('Houdini Glass Debug Info:', {
          isSupported,
          hasPropertyAPI,
          hasPaintAPI,
          globalPreset,
          enabledEffects: enabledEffectsState,
          performanceMode: performanceModeState,
          globalPropertiesCount: Object.keys(globalProperties).length
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [
    debugModeState,
    isSupported,
    hasPropertyAPI,
    hasPaintAPI,
    globalPreset,
    enabledEffectsState,
    performanceModeState,
    globalProperties
  ]);

  const updateGlobalProperty = useCallback((property: string, value: string) => {
    setGlobalProperties((prev: any) => ({ ...prev, [property]: value }));

    if (hasPropertyAPI) {
      document.documentElement.style.setProperty(property, value);
    }

    if (debugModeState) {
      console.log(`Updated global property: ${property} = ${value}`);
    }
  }, [hasPropertyAPI, debugModeState]);

  const toggleEffect = useCallback((effect: string) => {
    setEnabledEffectsState((prev: any) => {
      const newEffects = prev.includes(effect)
        ? prev.filter((e: any) => e !== effect)
        : [...prev, effect];

      if (debugModeState) {
        console.log(`Toggled effect: ${effect}. New effects:`, newEffects);
      }

      return newEffects;
    });
  }, [debugModeState]);

  const setPerformanceMode = useCallback((enabled: boolean) => {
    setPerformanceModeState(enabled);

    if (debugModeState) {
      console.log(`Performance mode ${enabled ? 'enabled' : 'disabled'}`);
    }
  }, [debugModeState]);

  const setDebugMode = useCallback((enabled: boolean) => {
    setDebugModeState(enabled);
    console.log(`Houdini Glass debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }, []);

  const contextValue: HoudiniGlassContextType = {
    isSupported,
    hasPropertyAPI,
    hasPaintAPI,
    globalPreset,
    setGlobalPreset,
    globalProperties,
    updateGlobalProperty,
    enabledEffects: enabledEffectsState,
    toggleEffect,
    performanceMode: performanceModeState,
    setPerformanceMode,
    debugMode: debugModeState,
    setDebugMode
  };

  return (
    <HoudiniGlassContext.Provider data-glass-component value={contextValue}>
      {children}

      {/* Debug overlay */}
      {debugModeState && (
        <div
          style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
        >
          <div><strong>Houdini Glass Debug</strong></div>
          <div>Support: {isSupported ? '✅' : '❌'}</div>
          <div>Property API: {hasPropertyAPI ? '✅' : '❌'}</div>
          <div>Paint API: {hasPaintAPI ? '✅' : '❌'}</div>
          <div>Preset: {globalPreset}</div>
          <div>Effects: {enabledEffectsState.join(', ')}</div>
          <div>Performance: {performanceModeState ? '🚀' : '🎨'}</div>
          <div>Properties: {Object.keys(globalProperties).length}</div>
        </div>
      )}
    </HoudiniGlassContext.Provider>
  );
}

// Hook to use Houdini Glass context
export function useHoudiniGlass() {
  const context = useContext(HoudiniGlassContext);
  if (!context) {
    throw new Error('useHoudiniGlass must be used within a HoudiniGlassProvider');
  }
  return context;
}

// Hook for component-specific glass effects
export function useGlassEffect(
  elementRef: React.RefObject<HTMLElement>,
  effects: string[] = [],
  options: {
    preset?: keyof typeof glassPresets;
    customProperties?: Record<string, string>;
    enableWorklets?: boolean;
  } = {}
) {
  const { isSupported, hasPropertyAPI, hasPaintAPI, performanceMode } = useHoudiniGlass();
  // Derive applied effects without causing re-render loops
  const appliedEffects = useMemo(() => {
    if (options.enableWorklets && hasPaintAPI && !performanceMode) {
      return effects;
    }
    return [] as string[];
  }, [effects, options.enableWorklets, hasPaintAPI, performanceMode]);

  // Stabilize dependency keys to avoid reruns from referentially new objects/arrays
  const effectsKey = useMemo(() => effects.join(','), [effects]);
  const customPropsKey = useMemo(
    () => JSON.stringify(options.customProperties ?? {}),
    [options.customProperties]
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !isSupported) return;

    // Apply preset
    if (options.preset && hasPropertyAPI) {
      const preset = glassPresets[options.preset];
      Object.entries(preset).forEach(([property, value]) => {
        element.style.setProperty(property, value);
      });
    }

    // Apply custom properties
    if (options.customProperties && hasPropertyAPI) {
      Object.entries(options.customProperties).forEach(([property, value]) => {
        element.style.setProperty(property, value);
      });
    }

    // Apply worklet effects
    if (options.enableWorklets && hasPaintAPI && !performanceMode) {
      const workletStyles: string[] = [];

      if (effects.includes('frost')) {
        workletStyles.push('paint(glass-frost)');
      }
      if (effects.includes('caustics')) {
        workletStyles.push('paint(glass-caustics)');
      }
      if (effects.includes('refraction')) {
        element.style.borderImage = 'paint(glass-refraction) 1';
      }
      if (effects.includes('border')) {
        element.style.borderImageSource = 'paint(glass-border)';
        element.style.borderImageSlice = '1';
      }

      if (workletStyles.length > 0) {
        element.style.backgroundImage = workletStyles.join(', ');
      }
    }
  }, [
    elementRef,
    effectsKey,
    options.preset,
    customPropsKey,
    options.enableWorklets,
    isSupported,
    hasPropertyAPI,
    hasPaintAPI,
    performanceMode
  ]);

  return {
    isSupported,
    appliedEffects,
    canUseWorklets: hasPaintAPI && !performanceMode
  };
}

// Mock functions for Houdini API registration - in real implementation these would register actual worklets
function registerGlassProperties() {
  // Register CSS custom properties for glass effects
  if (typeof CSS !== 'undefined' && CSS.registerProperty) {
    try {
      if (typeof window !== 'undefined') {
        if ((window as any).__AURAGLASS_PROPERTIES_REGISTERED__) {
          return;
        }
        (window as any).__AURAGLASS_PROPERTIES_REGISTERED__ = true as any;
      }
      CSS.registerProperty({
        name: '--glass-background',
        syntax: '<color>',
        inherits: false,
        initialValue: 'var(--glass-bg-default)'
      });

      CSS.registerProperty({
        name: '--glass-border',
        syntax: '<color>',
        inherits: false,
        initialValue: 'rgba(var(--glass-color-white) / var(--glass-opacity-20))'
      });

      CSS.registerProperty({
        name: '--glass-blur',
        syntax: '<length>',
        inherits: false,
        initialValue: '20px'
      });

      CSS.registerProperty({
        name: '--glass-shadow',
        syntax: '<string>',
        inherits: false,
        initialValue: '0 8px 32px rgba(var(--glass-color-black) / var(--glass-opacity-10))'
      });

      CSS.registerProperty({
        name: '--glass-animation-speed',
        syntax: '<number>',
        inherits: false,
        initialValue: '1'
      });

      CSS.registerProperty({
        name: '--glass-blur-intensity',
        syntax: '<number>',
        inherits: false,
        initialValue: '10'
      });
    } catch (error) {
      console.warn('Failed to register glass properties:', error);
    }
  }
}

// Extend CSS interface for Houdini Paint Worklet API
declare global {
  interface CSS {
    paintWorklet?: Worklet;
  }
  interface Window {
    __AURAGLASS_WORKLETS_REGISTERED__?: boolean;
    __AURAGLASS_PROPERTIES_REGISTERED__?: boolean;
  }
}

function registerGlassWorklets() {
  // Register paint worklets for advanced glass effects
  if (typeof CSS !== 'undefined' && (CSS as any).paintWorklet) {
    try {
      if (typeof window !== 'undefined') {
        if ((window as any).__AURAGLASS_WORKLETS_REGISTERED__) {
          return;
        }
        (window as any).__AURAGLASS_WORKLETS_REGISTERED__ = true as any;
      }
      // In a real implementation, these would be actual worklet files
      // CSS.paintWorklet.addModule('/worklets/glass-frost.js');
      // CSS.paintWorklet.addModule('/worklets/glass-caustics.js');
      // CSS.paintWorklet.addModule('/worklets/glass-border.js');
      // CSS.paintWorklet.addModule('/worklets/glass-refraction.js');

      console.log('Glass worklets registered (mock implementation)');
    } catch (error) {
      console.warn('Failed to register glass worklets:', error);
    }
  }
}

// Global CSS styles for Houdini glass effects
const houdiniGlassStyles = `
  .houdini-glass {
    background: var(--glass-background, var(--glass-bg-default));
    backdrop-filter: var(--glass-backdrop-blur););
    border: 1px solid var(--glass-border, rgba(var(--glass-color-white) / var(--glass-opacity-20)));
    box-shadow: var(--glass-elev-2);
    transition: all calc(0.3s * var(--glass-animation-speed, 1));
  }

  .houdini-glass:hover {
    background: var(--glass-bg-default);
    border-color: var(--glass-bg-hover);
    box-shadow: var(--glass-elev-2);
  }

  @supports (backdrop-filter: var(--glass-backdrop-blur);) {
    .houdini-glass-fallback {
      background: var(--glass-bg-default);
      border: 1px solid var(--glass-border-default);
    }
  }

  /* Performance mode styles */
  .houdini-glass-performance {
    --glass-blur: 10px;
    --glass-animation-speed: 0.5;
    backdrop-filter: var(--glass-backdrop-blur);
    transition: all 0.15s;
  }

  /* Debug styles */
  .houdini-glass-debug {
    outline: 2px solid rgba(255, 0, 0, 0.5);
    outline-offset: -1px;
  }
`;

export default HoudiniGlassProvider;