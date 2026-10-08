import fs from "node:fs";
import path from "node:path";

const FIX = path.resolve(__dirname, "..", "fixtures", "consumer-4x");

describe("consumer-4x fixture contents", () => {
  for (const app of ["next15", "vite-react18"]) {
    const dir = path.join(FIX, app);
    it(`${app} declares aura-glass 4.x + its runtime pair`, () => {
      const pkg = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
      expect(pkg.dependencies["aura-glass"]).toMatch(/^4\./);
      if (app === "next15") {
        expect(pkg.dependencies.next).toMatch(/^15/);
        expect(pkg.dependencies.react).toMatch(/^19/);
      } else {
        expect(pkg.dependencies.vite || pkg.devDependencies.vite).toMatch(/^5|^6/);
        expect(pkg.dependencies.react).toMatch(/^18\.3/);
      }
    });
    it(`${app} uses >= 30 root exports`, () => {
      const file = ["src/app.tsx", "src/App.tsx"].map((f) => path.join(dir, f)).find(fs.existsSync)!;
      const src = fs.readFileSync(file, "utf8");
      const names = src.match(/from "aura-glass"/)
        ? src.split('} from "aura-glass"')[0].split("import {")[1].split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];
      expect(names.length).toBeGreaterThanOrEqual(30);
      expect(src).toContain('from "aura-glass"');
      expect(src).toContain("aura-glass/styles");
      expect(src).toContain("aura-glass/tokens/css");
      expect(src).toContain("data-mobile-page");
    });
    it(`${app} reads --glass-* vars and relies on global styles`, () => {
      const css = fs.readFileSync(path.join(dir, "src/globals.css"), "utf8");
      expect(css).toMatch(/--glass-/);
      expect(css).toContain("@supports");
    });
  }
  it("fixture is marked frozen", () => {
    expect(fs.readFileSync(path.join(FIX, "README.md"), "utf8")).toContain("FROZEN");
  });
});
