import {
  AURA_GLASS,
  glassTokenUtils,
  type GlassElevation,
  type GlassIntent,
  type QualityTier,
} from "../tokens/glass";

const intents = Object.keys(AURA_GLASS.surfaces) as GlassIntent[];
const canonicalSheenElevations: GlassElevation[] = [
  "level1",
  "level2",
  "level3",
];
const optionalGlowElevations: GlassElevation[] = ["level4", "level5"];
const tiers: QualityTier[] = ["low", "medium", "high", "auto"];

const extractAlpha = (color: string): number => {
  const match = color.match(/(?:rgba\([^)]*,|\/)\s*([\d.]+)\)?$/);
  if (!match) {
    throw new Error(`Unable to extract alpha from ${color}`);
  }
  return Number(match[1]);
};

describe("performance-tier glass sheen", () => {
  it.each(tiers)(
    "keeps the canonical level 1-3 sheen in the %s tier",
    (tier) => {
      for (const intent of intents) {
        for (const elevation of canonicalSheenElevations) {
          const surface = AURA_GLASS.surfaces[intent][elevation];
          const styles = glassTokenUtils.buildSurfaceStyles(
            intent,
            elevation,
            tier
          );

          expect(surface.innerGlow).toBeDefined();
          expect(styles.boxShadow).toContain(
            `inset 0 0 ${surface.innerGlow!.blur}px ${surface.innerGlow!.color}`
          );

          const sheenAlpha = extractAlpha(surface.innerGlow!.color);
          expect(sheenAlpha).toBeGreaterThanOrEqual(0.1);
          expect(sheenAlpha).toBeLessThanOrEqual(0.18);
        }
      }
    }
  );

  it("continues to suppress optional level 4-5 glow in the low tier", () => {
    for (const intent of intents) {
      for (const elevation of optionalGlowElevations) {
        const surface = AURA_GLASS.surfaces[intent][elevation];
        const styles = glassTokenUtils.buildSurfaceStyles(
          intent,
          elevation,
          "low"
        );

        expect(surface.innerGlow).toBeDefined();
        expect(styles.boxShadow).not.toContain(
          `inset 0 0 ${surface.innerGlow!.blur}px ${surface.innerGlow!.color}`
        );
      }
    }
  });

  it("keeps canonical noise and highlight opacities within certification caps", () => {
    for (const intent of intents) {
      for (const surface of Object.values(AURA_GLASS.surfaces[intent])) {
        expect(surface.noiseOpacity ?? 0).toBeLessThanOrEqual(0.1);
        expect(surface.highlightOpacity ?? 0).toBeLessThanOrEqual(0.32);
      }
    }
  });
});
