import { getConcentricRadiusValue } from "./LiquidGlassConcentricFrame";

it("computes numeric concentric radius values", () => {
  expect(getConcentricRadiusValue(20, 4)).toBe("16px");
});

it("uses capsule radius for capsule mode", () => {
  expect(getConcentricRadiusValue("lg", 4, "capsule")).toBe("9999px");
});
