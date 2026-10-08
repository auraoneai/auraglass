/** PLAT-078..080: no claim of WCAG pass when the measured colors are unknown. */
import { glassTokenUtils } from "../../../tokens/glass";

describe("contrast honesty", () => {
  it("validateTextContrast returns 'unverified' for unresolved input", () => {
    expect(
      glassTokenUtils.validateTextContrast("var(--glass-text-primary)", "#fff")
    ).toBe("unverified");
    expect(glassTokenUtils.validateTextContrast("", "#ffffff")).toBe(
      "unverified"
    );
    expect(glassTokenUtils.validateTextContrast("#000", "transparent")).toBe(
      "unverified"
    );
  });

  it("validateTextContrast computes a real ratio for parseable colors", () => {
    expect(glassTokenUtils.validateTextContrast("#000000", "#ffffff")).toBe(
      true
    );
    expect(glassTokenUtils.validateTextContrast("#888888", "#999999")).toBe(
      false
    );
  });

  it("ContrastAdjustment carries a verified flag", () => {
    const src = require("fs").readFileSync(
      require("path").join(__dirname, "../../../utils/contrastGuard.ts"),
      "utf8"
    );
    expect(src).toMatch(/verified: boolean/);
  });
});
