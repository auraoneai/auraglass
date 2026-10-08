import React, { createContext, useContext, useState, useEffect } from "react";
import { AuraGlassProvider } from "../theme/AuraGlassProvider";
import { warnDeprecated } from "../utils/warnDeprecated";

export interface AnimationContextType {
  reducedMotion: boolean;
  setReducedMotion: (reduced: boolean) => void;
  defaultSpring: {
    stiffness: number;
    damping: number;
    mass: number;
  };
}

const defaultContextValue: AnimationContextType = {
  reducedMotion: false,
  setReducedMotion: () => {},
  defaultSpring: {
    stiffness: 100,
    damping: 10,
    mass: 1,
  },
};

export const AnimationContext =
  createContext<AnimationContextType>(defaultContextValue);

// AnimationProvider component
export interface AnimationProviderProps {
  children: React.ReactNode;
  defaultReducedMotion?: boolean;
  defaultSpring?: {
    stiffness: number;
    damping: number;
    mass: number;
  };
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({
  children,
  defaultReducedMotion = false,
  defaultSpring = { stiffness: 100, damping: 10, mass: 1 },
}) => {
  const [reducedMotion, setReducedMotion] = useState(defaultReducedMotion);

  // Check for prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setReducedMotion(e.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  const contextValue: AnimationContextType = {
    reducedMotion,
    setReducedMotion,
    defaultSpring,
  };

  warnDeprecated("DEP-P0050");
  return (
    <AuraGlassProvider>
      <AnimationContext.Provider value={contextValue}>
        {children}
      </AnimationContext.Provider>
    </AuraGlassProvider>
  );
};

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    // Instead of throwing, return default values to prevent crashes
    return defaultContextValue;
  }
  return context;
};

export const useAnimationContext = useAnimation;
