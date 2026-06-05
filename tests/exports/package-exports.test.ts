const path = require("node:path");
const fs = require("node:fs");

const distRoot = path.resolve(__dirname, "..", "..");
const isComponentLike = (value: unknown) =>
  typeof value === "function" || (value !== null && typeof value === "object");

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
  "./icons": {
    require: "dist/icons/index.js",
    verify: (mod) => {
      expect(typeof mod.SearchIcon).toBe("object");
      expect(typeof mod.SettingsIcon).toBe("object");
      expect(typeof mod.CloseIcon).toBe("object");
    },
  },
  "./icons/navigation": {
    require: "dist/icons/navigation.js",
    verify: (mod) => {
      expect(typeof mod.HomeIcon).toBe("object");
      expect(typeof mod.SettingsIcon).toBe("object");
    },
  },
  "./primitives": {
    require: "dist/primitives/index.js",
    verify: (mod) => {
      expect(typeof mod.Slot).toBe("object");
      expect(typeof mod.Portal).toBe("function");
      expect(typeof mod.FocusScope).toBe("object");
    },
  },
  "./primitives/slot": {
    require: "dist/cjs/primitives/Slot.js",
    verify: (mod) => {
      expect(typeof mod.Slot).toBe("object");
    },
  },
  "./primitives/portal": {
    require: "dist/cjs/primitives/Portal.js",
    verify: (mod) => {
      expect(typeof mod.Portal).toBe("function");
    },
  },
  "./primitives/focus": {
    require: "dist/cjs/primitives/FocusScope.js",
    verify: (mod) => {
      expect(typeof mod.FocusScope).toBe("object");
    },
  },
  "./primitives/dismissable-layer": {
    require: "dist/cjs/primitives/DismissableLayer.js",
    verify: (mod) => {
      expect(typeof mod.DismissableLayer).toBe("object");
    },
  },
  "./primitives/roving-focus": {
    require: "dist/cjs/primitives/RovingFocusGroup.js",
    verify: (mod) => {
      expect(typeof mod.RovingFocusGroup).toBe("object");
      expect(typeof mod.RovingFocusGroupItem).toBe("object");
    },
  },
  "./primitives/positioning": {
    require: "dist/cjs/primitives/Positioner.js",
    verify: (mod) => {
      expect(typeof mod.Positioner).toBe("object");
    },
  },
  "./app-shell": {
    require: "dist/app-shell/index.js",
    verify: (mod) => {
      expect(typeof mod.GlassAppShell).toBe("object");
      expect(typeof mod.GlassTopBar).toBe("object");
      expect(typeof mod.GlassMobileShell).toBe("object");
    },
  },
  "./workspace": {
    require: "dist/workspace/index.js",
    verify: (mod) => {
      expect(typeof mod.GlassWorkspace).toBe("object");
      expect(typeof mod.GlassWorkflowShell).toBe("object");
    },
  },
  "./theme": {
    require: "dist/theme/index.js",
    verify: (mod) => {
      expect(typeof mod.createGlassTheme).toBe("function");
      expect(typeof mod.GlassThemeProvider).toBe("function");
    },
  },
  "./forms": {
    require: "dist/index.js",
    verify: (mod) => {
      expect(isComponentLike(mod.GlassFormTemplate)).toBe(true);
      expect(isComponentLike(mod.GlassWizardTemplate)).toBe(true);
      expect(isComponentLike(mod.GlassFormWizardSteps)).toBe(true);
    },
  },
  "./data": {
    require: "dist/index.js",
    verify: (mod) => {
      expect(isComponentLike(mod.GlassDataTable)).toBe(true);
      expect(isComponentLike(mod.GlassBadge)).toBe(true);
      expect(isComponentLike(mod.GlassToastProvider)).toBe(true);
    },
  },
  "./navigation": {
    require: "dist/index.js",
    verify: (mod) => {
      expect(isComponentLike(mod.GlassPageTabs)).toBe(true);
      expect(isComponentLike(mod.LiquidGlassToolbar)).toBe(true);
      expect(isComponentLike(mod.GlassMenuPrimitive)).toBe(true);
    },
  },
  "./overlays": {
    require: "dist/index.js",
    verify: (mod) => {
      expect(isComponentLike(mod.LiquidGlassAdaptiveSheet)).toBe(true);
      expect(isComponentLike(mod.LiquidGlassPopoverMenu)).toBe(true);
    },
  },
  "./workflows": {
    require: "dist/workspace/index.js",
    verify: (mod) => {
      expect(isComponentLike(mod.GlassWorkspace)).toBe(true);
      expect(isComponentLike(mod.GlassWorkflowShell)).toBe(true);
    },
  },
  "./marketing": {
    require: "dist/index.js",
    verify: (mod) => {
      expect(isComponentLike(mod.AuroraBackground)).toBe(true);
      expect(isComponentLike(mod.DisplayText)).toBe(true);
      expect(isComponentLike(mod.ShowcaseCard)).toBe(true);
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
      expect(pkg.exports["./forms"]).toMatchObject({
        types: "./dist/forms/index.d.ts",
        import: "./dist/index.mjs",
        require: "./dist/index.js",
      });
      expect(pkg.exports["./data"]).toMatchObject({
        types: "./dist/data/index.d.ts",
        import: "./dist/index.mjs",
        require: "./dist/index.js",
      });
      expect(pkg.exports["./navigation"]).toMatchObject({
        types: "./dist/navigation/index.d.ts",
        import: "./dist/index.mjs",
        require: "./dist/index.js",
      });
      expect(pkg.exports["./overlays"]).toMatchObject({
        types: "./dist/overlays/index.d.ts",
        import: "./dist/index.mjs",
        require: "./dist/index.js",
      });
      expect(pkg.exports["./workflows"]).toMatchObject({
        types: "./dist/workflows/index.d.ts",
        import: "./dist/workspace/index.mjs",
        require: "./dist/workspace/index.js",
      });
      expect(pkg.exports["./marketing"]).toMatchObject({
        types: "./dist/marketing/index.d.ts",
        import: "./dist/index.mjs",
        require: "./dist/index.js",
      });
      expect(pkg.exports["./services/ai/config"]).toMatchObject({
        types: "./dist/services/ai/config.d.ts",
        import: "./dist/esm/services/ai/config.js",
        default: "./dist/esm/services/ai/config.js",
      });
      expect(pkg.exports["./services/ai/cache-service"]).toMatchObject({
        types: "./dist/services/ai/cache-service.d.ts",
        import: "./dist/esm/services/ai/cache-service.js",
        default: "./dist/esm/services/ai/cache-service.js",
      });
      expect(pkg.peerDependencies.openai).toBe("^6.0.0");
      expect(pkg.peerDependencies["@google-cloud/vision"]).toBe("^5.0.0");
      expect(pkg.peerDependencies.redis).toBe("^5.0.0");
      expect(pkg.peerDependenciesMeta.openai.optional).toBe(true);
      expect(pkg.peerDependenciesMeta["@google-cloud/vision"].optional).toBe(
        true
      );
      expect(pkg.peerDependenciesMeta.redis.optional).toBe(true);
    },
  },
  // Note: ESM-only exports (core/mixins/glassMixins, utils/env, services/*)
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
