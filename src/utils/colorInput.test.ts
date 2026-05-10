import { normalizeColorInputValue } from "./colorInput";

describe("normalizeColorInputValue", () => {
  it("keeps native color input hex values in #rrggbb format", () => {
    expect(normalizeColorInputValue("#abc")).toBe("#aabbcc");
    expect(normalizeColorInputValue("#AABBCCDD")).toBe("#aabbcc");
  });

  it("converts rgb and hsl colors to hex values", () => {
    expect(normalizeColorInputValue("rgb(59, 130, 246)")).toBe("#3b82f6");
    expect(normalizeColorInputValue("217 91% 60%")).toBe("#3c83f6");
  });

  it("maps unresolved AuraGlass tokens to safe color-input fallbacks", () => {
    expect(normalizeColorInputValue("var(--glass-color-primary)")).toBe(
      "#3b82f6"
    );
    expect(normalizeColorInputValue("var(--glass-gray-500)")).toBe("#64748b");
    expect(normalizeColorInputValue("var(--glass-black)", "#ffffff")).toBe(
      "#000000"
    );
  });
});
