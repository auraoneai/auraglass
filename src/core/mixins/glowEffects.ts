import { CSSProperties } from "react";

export interface GlowConfig {
  color?: string;
  intensity?: "subtle" | "light" | "standard" | "strong" | "intense";
  size?: number;
  spread?: number;
  blur?: number;
  animated?: boolean;
  animationDuration?: number;
  pulsing?: boolean;
  pulseSpeed?: number;
}

export interface GlowPreset {
  primary: GlowConfig;
  secondary: GlowConfig;
  success: GlowConfig;
  warning: GlowConfig;
  error: GlowConfig;
  info: GlowConfig;
}

// Glow effects mixin
export const glowEffects = {
  subtle: "0 0 10px rgba(255, 255, 255, 0.1)",
  light: "0 0 20px rgba(255, 255, 255, 0.2)",
  standard: "0 0 30px rgba(255, 255, 255, 0.3)",
  strong: "0 0 40px rgba(255, 255, 255, 0.4)",
  intense: "0 0 50px rgba(255, 255, 255, 0.5)",
};

export const createGlowEffect = (config: GlowConfig = {}): CSSProperties => {
  const {
    color = "var(--glass-white)",
    intensity = "standard",
    size = 30,
    spread = 0,
    blur = size,
    animated = false,
    animationDuration = 2000,
    pulsing = false,
    pulseSpeed = 2000,
  } = config;

  // Convert hex to rgba if needed
  const glowColor = color.startsWith("#") ? hexToRgba(color, 0.3) : color;

  const baseStyles: CSSProperties = {
    boxShadow: `0 0 ${blur}px ${spread}px ${glowColor}`,
    filter: `drop-shadow(0 0 ${blur / 2}px ${glowColor})`,
  };

  if (animated || pulsing) {
    baseStyles.animation = pulsing
      ? `glow-pulse ${pulseSpeed}ms ease-in-out infinite alternate`
      : `glow-animate ${animationDuration}ms ease-in-out infinite`;
  }

  return baseStyles;
};

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Predefined glow colors
export const glowColors = {
  white: "var(--glass-white)",
  blue: "hsl(var(--glass-color-primary))",
  indigo: "#6366f1",
  purple: "#8b5cf6",
  pink: "#ec4899",
  red: "hsl(var(--glass-color-danger))",
  orange: "#f97316",
  amber: "hsl(var(--glass-color-warning))",
  yellow: "#eab308",
  lime: "#84cc16",
  green: "#22c55e",
  emerald: "hsl(var(--glass-color-success))",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  sky: "#0ea5e9",
  gray: "var(--glass-gray-500)",
} as const;

// Preset glow effects
export const glowPresets: GlowPreset = {
  primary: {
    color: glowColors.blue,
    intensity: "standard",
    animated: true,
  },
  secondary: {
    color: glowColors.gray,
    intensity: "light",
    animated: false,
  },
  success: {
    color: glowColors.green,
    intensity: "light",
    pulsing: true,
  },
  warning: {
    color: glowColors.amber,
    intensity: "standard",
    pulsing: true,
  },
  error: {
    color: glowColors.red,
    intensity: "strong",
    pulsing: true,
    pulseSpeed: 1000,
  },
  info: {
    color: glowColors.cyan,
    intensity: "light",
    animated: true,
  },
};

// Specific glow effects for different elements
export const blueGlow = createGlowEffect(glowPresets.primary);
export const greenGlow = createGlowEffect(glowPresets.success);
export const redGlow = createGlowEffect(glowPresets.error);
export const whiteGlow = createGlowEffect({ color: glowColors.white });
export const purpleGlow = createGlowEffect({ color: glowColors.purple });
export const orangeGlow = createGlowEffect({ color: glowColors.orange });

// Intensity-based glow effects
export const subtleGlow = (color: string = glowColors.white) =>
  createGlowEffect({ color, intensity: "subtle" });

export const lightGlow = (color: string = glowColors.white) =>
  createGlowEffect({ color, intensity: "light" });

export const standardGlow = (color: string = glowColors.white) =>
  createGlowEffect({ color, intensity: "standard" });

export const strongGlow = (color: string = glowColors.white) =>
  createGlowEffect({ color, intensity: "strong" });

export const intenseGlow = (color: string = glowColors.white) =>
  createGlowEffect({ color, intensity: "intense" });

// Animated glow effects
export const pulsingGlow = (color: string = glowColors.white) =>
  createGlowEffect({ color, pulsing: true });

export const animatedGlow = (color: string = glowColors.white) =>
  createGlowEffect({ color, animated: true });

// Multi-color glow effects
export const rainbowGlow = (): CSSProperties => ({
  boxShadow: `
    0 0 10px ${glowColors.red},
    0 0 20px ${glowColors.orange},
    0 0 30px ${glowColors.yellow},
    0 0 40px ${glowColors.green},
    0 0 50px ${glowColors.blue},
    0 0 60px ${glowColors.indigo},
    0 0 70px ${glowColors.purple}
  `,
  animation: "rainbow-glow 3000ms ease-in-out infinite",
});

export const dualGlow = (color1: string, color2: string): CSSProperties => ({
  boxShadow: `
    0 0 20px ${color1},
    0 0 40px ${color2}
  `,
  animation: "dual-glow 2000ms ease-in-out infinite alternate",
});

// Contextual glow effects
export const contextualGlow = {
  hover: (color: string = glowColors.blue) =>
    createGlowEffect({
      color,
      intensity: "light",
      animated: true,
      animationDuration: 300,
    }),

  focus: (color: string = glowColors.blue) =>
    createGlowEffect({
      color,
      intensity: "standard",
      size: 20,
    }),

  active: (color: string = glowColors.blue) =>
    createGlowEffect({
      color,
      intensity: "strong",
      size: 15,
    }),

  disabled: () =>
    createGlowEffect({
      color: glowColors.gray,
      intensity: "subtle",
      size: 5,
    }),

  loading: (color: string = glowColors.blue) =>
    createGlowEffect({
      color,
      intensity: "light",
      pulsing: true,
      pulseSpeed: 1500,
    }),

  success: () => createGlowEffect(glowPresets.success),
  error: () => createGlowEffect(glowPresets.error),
  warning: () => createGlowEffect(glowPresets.warning),
};

// CSS keyframes for glow animations (to be injected into global styles)
export const glowKeyframes = `
  @keyframes glow-animate {
    0% { filter: drop-shadow(0 0 5px currentColor); }
    50% { filter: drop-shadow(0 0 20px currentColor); }
    100% { filter: drop-shadow(0 0 5px currentColor); }
  }

  @keyframes glow-pulse {
    0% { box-shadow: 0 0 5px currentColor; }
    100% { box-shadow: 0 0 25px currentColor; }
  }

  @keyframes rainbow-glow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }

  @keyframes dual-glow {
    0% { filter: brightness(1); }
    100% { filter: brightness(1.3); }
  }
`;

// Utility to inject glow keyframes
export const injectGlowKeyframes = (): void => {
  const styleId = "aura-glass-glow-keyframes";

  if (document.getElementById(styleId)) {
    return; // Already injected
  }

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = glowKeyframes;
  document.head.appendChild(style);
};
