"use client";

import React from "react";

import {
  createGlassTheme,
  createGlassThemeCssVars,
  type CreateGlassThemeOptions,
  type GlassDensity,
  type GlassMotionPolicy,
  type GlassTheme,
  type GlassThemeMode,
} from "./createGlassTheme";

export interface GlassThemeContextValue {
  theme: GlassTheme;
  setTheme: (theme: GlassTheme | CreateGlassThemeOptions) => void;
  setMode: (mode: GlassThemeMode) => void;
  setDensity: (density: GlassDensity) => void;
  setMotionPolicy: (policy: GlassMotionPolicy) => void;
}

const defaultTheme = createGlassTheme();

const GlassThemeContext = React.createContext<GlassThemeContextValue>({
  theme: defaultTheme,
  setTheme: () => undefined,
  setMode: () => undefined,
  setDensity: () => undefined,
  setMotionPolicy: () => undefined,
});

export interface GlassThemeProviderProps {
  theme?: GlassTheme | CreateGlassThemeOptions;
  children: React.ReactNode;
  asChild?: boolean;
}

const resolveTheme = (
  theme?: GlassTheme | CreateGlassThemeOptions
): GlassTheme => {
  if (!theme) return defaultTheme;
  if ("tokens" in theme && "contrast" in theme) return theme;
  return createGlassTheme(theme);
};

export const GlassThemeProvider = ({
  theme: initialTheme,
  children,
}: GlassThemeProviderProps) => {
  const [theme, setThemeState] = React.useState(() =>
    resolveTheme(initialTheme)
  );

  React.useEffect(() => {
    setThemeState(resolveTheme(initialTheme));
  }, [initialTheme]);

  const setTheme = React.useCallback(
    (next: GlassTheme | CreateGlassThemeOptions) => {
      setThemeState(resolveTheme(next));
    },
    []
  );

  const setMode = React.useCallback((mode: GlassThemeMode) => {
    setThemeState((current) =>
      createGlassTheme({
        id: current.id,
        name: current.name,
        brandColor: current.tokens.color.brand,
        accentColor: current.tokens.color.accent,
        density: current.density,
        motionPolicy: current.motionPolicy,
        mode,
      })
    );
  }, []);

  const setDensity = React.useCallback((density: GlassDensity) => {
    setThemeState((current) =>
      createGlassTheme({
        id: current.id,
        name: current.name,
        brandColor: current.tokens.color.brand,
        accentColor: current.tokens.color.accent,
        mode: current.mode,
        motionPolicy: current.motionPolicy,
        density,
      })
    );
  }, []);

  const setMotionPolicy = React.useCallback(
    (motionPolicy: GlassMotionPolicy) => {
      setThemeState((current) =>
        createGlassTheme({
          id: current.id,
          name: current.name,
          brandColor: current.tokens.color.brand,
          accentColor: current.tokens.color.accent,
          mode: current.mode,
          density: current.density,
          motionPolicy,
        })
      );
    },
    []
  );

  const value = React.useMemo(
    () => ({ theme, setTheme, setMode, setDensity, setMotionPolicy }),
    [theme, setTheme, setMode, setDensity, setMotionPolicy]
  );

  const vars = createGlassThemeCssVars(theme) as React.CSSProperties;

  return (
    <GlassThemeContext.Provider value={value}>
      <div
        data-auraglass-theme={theme.id}
        data-glass-theme-mode={theme.mode}
        style={vars}
      >
        {children}
      </div>
    </GlassThemeContext.Provider>
  );
};

export const useGlassTheme = () => React.useContext(GlassThemeContext);

export const useGlassDensity = () => {
  const { theme, setDensity } = useGlassTheme();
  return { density: theme.density, setDensity, tokens: theme.tokens.density };
};

export const useGlassMotionPolicy = () => {
  const { theme, setMotionPolicy } = useGlassTheme();
  return {
    motionPolicy: theme.motionPolicy,
    setMotionPolicy,
    tokens: theme.tokens.motion,
  };
};
