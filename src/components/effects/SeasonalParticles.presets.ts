export const seasonalPresets = {
  gentle: {
    particleCount: 20,
    windStrength: 0.5,
    animationSpeed: 0.8,
    seasonDuration: 15000,
  },
  lively: {
    particleCount: 40,
    windStrength: 1.2,
    animationSpeed: 1.2,
    seasonDuration: 10000,
  },
  dramatic: {
    particleCount: 60,
    windStrength: 2.0,
    animationSpeed: 1.5,
    seasonDuration: 8000,
  },
  subtle: {
    particleCount: 15,
    windStrength: 0.3,
    animationSpeed: 0.6,
    seasonDuration: 20000,
  },
} as const;

export const seasonalThemes = {
  winter: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    glassColor: "var(--glass-bg-default)",
    accentColor: "#e3f2fd",
  },
  spring: {
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    glassColor: "var(--glass-bg-disabled)",
    accentColor: "#fce4ec",
  },
  summer: {
    background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    glassColor: "var(--glass-bg-default)",
    accentColor: "#fff3e0",
  },
  autumn: {
    background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    glassColor: "rgba(255, 255, 255, 0.12)",
    accentColor: "#efebe9",
  },
} as const;

export type SeasonalPresetName = keyof typeof seasonalPresets;
