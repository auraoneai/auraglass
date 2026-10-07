import { readFileSync } from "fs";
import { join } from "path";

it("exports Liquid Glass public API", () => {
  const source = readFileSync(join(process.cwd(), "src/index.ts"), "utf8");
  expect(source).toContain("LiquidGlassEffectGroup");
  expect(source).toContain("LiquidGlassToolbar");
  expect(source).toContain("LiquidGlassTabBar");
  expect(source).toContain("LiquidGlassShowcase");
});
