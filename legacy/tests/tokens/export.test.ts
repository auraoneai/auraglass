describe("package export surface", () => {
  it("supports commonjs require for tokens", () => {
    const tokens = require("../../dist/tokens/index.cjs");
    expect(tokens).toBeTruthy();
    expect(tokens.personas?.length).toBeGreaterThan(0);
  });

  it("exposes tailwind helper via commonjs", () => {
    const tailwind = require("../../dist/tokens/tailwind.theme.cjs");
    expect(tailwind).toHaveProperty("extend.colors.primary");
  });
});
