const path = require("node:path");
const fs = require("node:fs");

const distRoot = path.resolve(__dirname, "..", "..");

/**
 * Minimal structural verifiers for each export target.
 */
const exportsMap: Record<
  string,
  { file?: string; require?: string; verify: (value: any) => void }
> = {
  ".": {
    require: "dist/index.js",
    verify: (mod) => {
      expect(mod).toHaveProperty("ThemeProvider");
      expect(mod).toHaveProperty("PersonaPicker");
      expect(mod).toHaveProperty("GlassDropdownMenu");
      expect(mod).toHaveProperty("GlassDropdownMenuTrigger");
      expect(mod).toHaveProperty("GlassDropdownMenuContent");
      expect(mod).toHaveProperty("GlassDropdownMenuItem");
      expect(mod).toHaveProperty("GlassDropdownMenuCheckboxItem");
      expect(mod).toHaveProperty("GlassDropdownMenuRadioGroup");
      expect(mod).toHaveProperty("GlassDropdownMenuRadioItem");
      expect(mod).toHaveProperty("AuroraBackground");
      expect(mod).toHaveProperty("AuroraOrb");
      expect(mod).toHaveProperty("DisplayText");
      expect(mod).toHaveProperty("LogoMark");
      expect(mod).toHaveProperty("ShowcaseCard");
      expect(mod).toHaveProperty("FeatureTile");
      expect(mod).toHaveProperty("InstallCommand");
      expect(mod.GlassNavbar).toBe(mod.GlassNavigation);
      expect(mod.GlassMediaControls).toBe(mod.LiquidGlassMediaControls);
      expect(mod.LiquidGlassSourceTransition).toBe(
        mod.LiquidGlassTransitionProvider
      );
      expect(mod.SmartShoppingCart).toBe(mod.GlassSmartShoppingCart);
      expect(mod).toHaveProperty("AuraElementInteractionPlugin");
      expect(mod.AuraElementInteractionPlugin.id).toBe(
        "auraElementInteraction"
      );
      expect(mod).toHaveProperty("GalileoElementInteractionPlugin");
      expect(mod.GalileoElementInteractionPlugin.id).toBe(
        "galileoElementInteraction"
      );
    },
  },
  "./tokens": {
    require: "dist/tokens/index.cjs",
    verify: (mod) => {
      expect(Array.isArray(mod.personas)).toBe(true);
      expect(mod.personas.length).toBeGreaterThan(0);
      expect(mod).toHaveProperty("auraTokens");
    },
  },
  "./tokens/json": {
    require: "dist/tokens/tokens.json",
    verify: (json) => {
      expect(json?.version).toBeDefined();
    },
  },
  "./tokens/tailwind": {
    require: "dist/tokens/tailwind.theme.cjs",
    verify: (mod) => {
      expect(mod?.extend?.colors?.primary).toBeDefined();
    },
  },
  "./styles": {
    file: "dist/styles/index.css",
    verify: (content) => {
      expect(typeof content).toBe("string");
      expect(content.length).toBeGreaterThan(0);
    },
  },
  "./hooks/useGlassProbes": {
    require: "dist/cjs/hooks/useGlassProbes.js",
    verify: (mod) => {
      expect(typeof mod.useGlassProbes).toBe("function");
      expect(typeof mod.useGlassElementProbe).toBe("function");
    },
  },
  "./registry": {
    require: "dist/registry/index.js",
    verify: (mod) => {
      expect(mod).toHaveProperty("StyledComponentsRegistry");
      expect(Array.isArray(mod.auraGlassRecipes)).toBe(true);
      expect(mod.auraGlassRecipes.length).toBeGreaterThanOrEqual(7);
      expect(mod.getAuraGlassRecipe("saas-dashboard")?.files?.length).toBeGreaterThan(0);
    },
  },
  "./client": {
    require: "dist/client/index.js",
    verify: (mod) => {
      expect(mod).toHaveProperty("ThemeProvider");
      expect(mod).toHaveProperty("PersonaPicker");
    },
  },
  "./server": {
    require: "dist/server/index.js",
    verify: (mod) => {
      expect(mod).toHaveProperty("AuraGlassSSRProvider");
    },
  },
  "./ssr": {
    require: "dist/ssr/index.js",
    verify: (mod) => {
      expect(mod).toHaveProperty("safeBrowserExec");
    },
  },
  "./three": {
    require: "dist/three/index.js",
    verify: (mod) => {
      expect(mod).toHaveProperty("GlassShatterEffects");
      expect(mod).toHaveProperty("SeasonalParticles");
      expect(mod).toHaveProperty("AuroraPro");
      expect(mod).toHaveProperty("ARGlassEffects");
    },
  },
  "./package.json": {
    require: "package.json",
    verify: (pkg) => {
      expect(pkg.name).toBe("aura-glass");
      expect(pkg.exports).toBeDefined();
      expect(pkg.exports["./hooks/useGlassProbes"]).toMatchObject({
        import: "./dist/esm/hooks/useGlassProbes.js",
        require: "./dist/cjs/hooks/useGlassProbes.js",
        default: "./dist/esm/hooks/useGlassProbes.js",
      });
      expect(pkg.peerDependencies.openai).toBe("^6.0.0");
      expect(pkg.peerDependencies["@google-cloud/vision"]).toBe("^5.0.0");
      expect(pkg.peerDependenciesMeta.openai.optional).toBe(true);
      expect(pkg.peerDependenciesMeta["@google-cloud/vision"].optional).toBe(
        true
      );
    },
  },
  // Note: New exports (core/mixins/glassMixins, utils/env, services/*)
  // are ESM-only and will be tested in package-exports.spec.mjs
};

describe("package.json exports (CommonJS)", () => {
  for (const [entry, config] of Object.entries(exportsMap)) {
    it(`loads ${entry} export target`, () => {
      let value: any;
      if (config.require) {
        // Use Node-style require so we exercise the built CJS artifacts.
        // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
        value = require(path.join(distRoot, config.require));
      } else if (config.file) {
        const abs = path.join(distRoot, config.file);
        value = fs.readFileSync(abs, "utf8");
      } else {
        throw new Error(`No require/file configured for export ${entry}`);
      }

      config.verify(value);
    });
  }
});
