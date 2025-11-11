'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type GlassIntensity = 'subtle' | 'balanced' | 'strong';
export type ContrastMode = 'normal' | 'high';
export type Density = 'comfortable' | 'compact';

export interface Settings {
  themeMode: ThemeMode;
  glassIntensity: GlassIntensity;
  contrastMode: ContrastMode;
  reducedMotion: 'system' | 'on' | 'off';
  fontScale: 1 | 1.1 | 1.25 | 1.5;
  focusStyle: 'default' | 'strong';
  density: Density;
  locale: string;
  experiments: Record<string, boolean>;
}

export type SettingsPatch = Partial<Settings>;

export interface SettingsStorageAdapter {
  get: (key: string) => Promise<string | null> | string | null;
  set: (key: string, value: string) => Promise<void> | void;
  remove?: (key: string) => Promise<void> | void;
}

export interface SettingsContextValue {
  settings: Settings;
  updateSettings: (patch: SettingsPatch) => void;
  resetSettings: () => void;
  isReady: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  themeMode: 'system',
  glassIntensity: 'balanced',
  contrastMode: 'normal',
  reducedMotion: 'system',
  fontScale: 1,
  focusStyle: 'default',
  density: 'comfortable',
  locale: 'en',
  experiments: {},
};

const STORAGE_KEY = 'auraglass:settings:v1';

const noopStorage: SettingsStorageAdapter = {
  get: () => null,
  set: () => {},
  remove: () => {},
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export interface SettingsProviderProps {
  children: React.ReactNode;
  initialSettings?: SettingsPatch;
  storageAdapter?: SettingsStorageAdapter;
  onChange?: (settings: Settings) => void;
}

/**
 * SSR-safe feature detection
 */
function canUseDOM(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function getSystemThemeMode(): ThemeMode {
  if (!canUseDOM()) return 'light';
  try {
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function getSystemReducedMotion(): boolean {
  if (!canUseDOM()) return false;
  try {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  } catch {
    return false;
  }
}

function resolveEffectiveSettings(base: Settings): Settings {
  const themeMode =
    base.themeMode === 'system' ? getSystemThemeMode() : base.themeMode;

  const reducedMotionFlag =
    base.reducedMotion === 'system'
      ? getSystemReducedMotion()
      : base.reducedMotion === 'on';

  return {
    ...base,
    themeMode,
    reducedMotion: base.reducedMotion,
    // we expose `reducedMotion` as tri-state in settings, but
    // consumers can derive boolean from it + media query.
  };
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
  initialSettings,
  storageAdapter,
  onChange,
}) => {
  const adapter = storageAdapter ?? (canUseDOM() ? createLocalStorageAdapter() : noopStorage);

  const [settings, setSettings] = useState<Settings>(() => {
    const base = {
      ...DEFAULT_SETTINGS,
      ...(initialSettings || {}),
    };
    return resolveEffectiveSettings(base);
  });

  const [isReady, setIsReady] = useState(!canUseDOM());

  // Load from storage on client
  useEffect(() => {
    if (!canUseDOM()) return;

    let cancelled = false;

    const load = async () => {
      try {
        const storedRaw = await adapter.get(STORAGE_KEY);
        if (cancelled) return;

        if (storedRaw) {
          const parsed = safeParseSettings(storedRaw);
          const merged: Settings = {
            ...DEFAULT_SETTINGS,
            ...(initialSettings || {}),
            ...parsed,
          };
          setSettings(resolveEffectiveSettings(merged));
        } else {
          const merged: Settings = {
            ...DEFAULT_SETTINGS,
            ...(initialSettings || {}),
          };
          setSettings(resolveEffectiveSettings(merged));
        }
      } catch {
        // Fallback: keep defaults
      } finally {
        if (!cancelled) setIsReady(true);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist and notify
  const persistAndNotify = useCallback(
    (next: Settings) => {
      if (canUseDOM()) {
        try {
          adapter.set(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore storage errors
        }
      }
      if (onChange) onChange(next);
    },
    [adapter, onChange],
  );

  const updateSettings = useCallback(
    (patch: SettingsPatch) => {
      setSettings(prev => {
        const merged: Settings = resolveEffectiveSettings({
          ...prev,
          ...patch,
        });
        persistAndNotify(merged);
        applySettingsToDocument(merged);
        return merged;
      });
    },
    [persistAndNotify],
  );

  const resetSettings = useCallback(() => {
    setSettings(() => {
      const next = resolveEffectiveSettings(DEFAULT_SETTINGS);
      persistAndNotify(next);
      applySettingsToDocument(next);
      return next;
    });
  }, [persistAndNotify]);

  // Apply to document on mount and whenever settings change (after ready)
  useEffect(() => {
    if (!canUseDOM()) return;
    if (!isReady) return;
    applySettingsToDocument(settings);
  }, [settings, isReady]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      updateSettings,
      resetSettings,
      isReady,
    }),
    [settings, updateSettings, resetSettings, isReady],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

function safeParseSettings(raw: string): SettingsPatch {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as SettingsPatch;
  } catch {
    return {};
  }
}

function createLocalStorageAdapter(): SettingsStorageAdapter {
  return {
    get: key => {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set: (key, value) => {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // ignore
      }
    },
    remove: key => {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // ignore
      }
    },
  };
}

/**
 * Apply settings to document-level attributes/CSS variables.
 * This keeps it aligned with existing theme and motion systems.
 */
function applySettingsToDocument(settings: Settings) {
  if (!canUseDOM()) return;

  const { documentElement } = document;

  // Theme mode
  documentElement.setAttribute('data-theme', settings.themeMode);

  // Glass intensity
  documentElement.setAttribute('data-glass-intensity', settings.glassIntensity);

  // Contrast
  documentElement.setAttribute('data-contrast-mode', settings.contrastMode);

  // Density
  documentElement.setAttribute('data-density', settings.density);

  // Font scale
  documentElement.style.setProperty(
    '--auraglass-font-scale',
    String(settings.fontScale),
  );

  // Focus style
  documentElement.setAttribute('data-focus-style', settings.focusStyle);

  // Reduced motion (boolean marker based on resolved behavior)
  const reduced =
    settings.reducedMotion === 'system'
      ? getSystemReducedMotion()
      : settings.reducedMotion === 'on';

  documentElement.setAttribute(
    'data-reduced-motion',
    reduced ? 'true' : 'false',
  );

  // Locale
  documentElement.setAttribute('lang', settings.locale || 'en');

  // Experiments as flags
  Object.entries(settings.experiments || {}).forEach(([key, enabled]) => {
    const attr = `data-exp-${key}`;
    if (enabled) {
      documentElement.setAttribute(attr, 'true');
    } else {
      documentElement.removeAttribute(attr);
    }
  });
}

/**
 * Hook to access settings.
 */
export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
}

/**
 * Hook to access a single setting with proper typing.
 */
export function useSetting<K extends keyof Settings>(key: K): Settings[K] {
  const { settings } = useSettings();
  return settings[key];
}

export default SettingsContext;