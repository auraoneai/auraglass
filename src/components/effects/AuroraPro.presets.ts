export const auroraPresets = {
  subtle: {
    intensity: 0.6,
    speed: 0.5,
    particleCount: 30,
    colorPalette: "arctic",
    animationMode: "flow",
  },
  dynamic: {
    intensity: 1.0,
    speed: 1.0,
    particleCount: 50,
    colorPalette: "cosmic",
    animationMode: "mixed",
  },
  intense: {
    intensity: 1.5,
    speed: 1.5,
    particleCount: 80,
    colorPalette: "sunset",
    animationMode: "pulse",
  },
  serene: {
    intensity: 0.4,
    speed: 0.3,
    particleCount: 20,
    colorPalette: "ocean",
    animationMode: "shift",
  },
} as const;

export const auroraThemes = {
  northern: {
    background:
      "linear-gradient(180deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
    glassColor: "rgba(79, 195, 247, 0.1)",
    accentColor: "#4fc3f7",
  },
  mystical: {
    background:
      "linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #2d1b69 100%)",
    glassColor: "rgba(186, 104, 200, 0.1)",
    accentColor: "#ba68c8",
  },
  tropical: {
    background:
      "linear-gradient(180deg, #0c0c0c 0%, #1a1a2e 50%, #0f3460 100%)",
    glassColor: "rgba(0, 188, 212, 0.1)",
    accentColor: "#00bcd4",
  },
  enchanted: {
    background:
      "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    glassColor: "rgba(255, 152, 77, 0.1)",
    accentColor: "#ff9843",
  },
} as const;

export type AuroraPresetName = keyof typeof auroraPresets;
