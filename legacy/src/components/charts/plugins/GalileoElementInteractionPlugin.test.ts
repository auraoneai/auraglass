import AuraElementInteractionPluginDefault, {
  AuraElementInteractionPlugin,
  GalileoElementInteractionPlugin,
} from "./GalileoElementInteractionPlugin";

describe("AuraElementInteractionPlugin exports", () => {
  it("uses the Aura plugin id for new Chart.js registrations", () => {
    expect(AuraElementInteractionPlugin.id).toBe("auraElementInteraction");
    expect(AuraElementInteractionPluginDefault).toBe(
      AuraElementInteractionPlugin
    );
  });

  it("keeps GalileoElementInteractionPlugin as a legacy id alias", () => {
    expect(GalileoElementInteractionPlugin.id).toBe(
      "galileoElementInteraction"
    );
    expect(GalileoElementInteractionPlugin.defaults).toBe(
      AuraElementInteractionPlugin.defaults
    );
    expect(GalileoElementInteractionPlugin.afterDraw).toBe(
      AuraElementInteractionPlugin.afterDraw
    );
  });
});
