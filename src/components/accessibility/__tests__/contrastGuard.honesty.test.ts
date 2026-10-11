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

  it("ContrastGuard emits only data-contrast-status='unverified', never a wcag claim", () => {
    const src = require("fs").readFileSync(
      require("path").join(__dirname, "../ContrastGuard.tsx"),
      "utf8"
    );
    expect(src).toContain('"data-contrast-status": "unverified"');
    expect(src).not.toMatch(/data-meets-wcag/);
    // status is a literal 'unverified' in the type + callback call
    expect(src).toMatch(/status: ['\"]unverified['\"]/);
    expect(src).toMatch(/"unverified"\s*\)/);
  });
});
