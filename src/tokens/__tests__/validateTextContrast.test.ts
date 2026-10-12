/** REQ-PLAT-43: validateTextContrast never returns a WCAG verdict. */
import { glassTokenUtils } from "../glass";

describe("validateTextContrast (REQ-PLAT-43)", () => {
  it.each([
    ["#000", "#fff"],
    ["#000000", "#ffffff"],
    ["#777", "#888"],
    ["#777777", "#888888"],
    ["var(--glass-text-primary)", "#fff"],
    ["", "transparent"],
  ])("%s on %s is 'unverified'", (fg, bg) => {
    expect(glassTokenUtils.validateTextContrast(fg, bg)).toBe("unverified");
  });

  it("documents that the result is truthy and not a WCAG signal", () => {
    const src: string = require("fs").readFileSync(require("path").join(__dirname, "../glass.ts"), "utf8");
    const doc = src.slice(src.lastIndexOf("/**", src.indexOf("validateTextContrast:")), src.indexOf("validateTextContrast:"));
    expect(doc).toContain("Does not measure rendered contrast. Do not use as a WCAG signal.");
    expect(doc).toMatch(/truthy/);
    expect(src).toMatch(/validateTextContrast: \([^)]*\): boolean \| "unverified"/);
  });
});
