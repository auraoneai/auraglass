export const shatterPresets = {
  gentle: {
    duration: 1.5,
    intensity: 0.5,
    shardCount: 8,
    autoReform: true,
    reformDelay: 2000,
  },
  dramatic: {
    duration: 2.5,
    intensity: 1.2,
    shardCount: 16,
    autoReform: true,
    reformDelay: 4000,
  },
  explosive: {
    duration: 3,
    intensity: 2,
    shardCount: 24,
    autoReform: false,
    reformDelay: 6000,
  },
  subtle: {
    duration: 1,
    intensity: 0.3,
    shardCount: 6,
    autoReform: true,
    reformDelay: 1500,
  },
} as const;

export type ShatterPresetName = keyof typeof shatterPresets;
