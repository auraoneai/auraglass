import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolve = (file) => path.join(__dirname, "..", "..", "dist", file);
const resolveEsm = (file) =>
  path.join(__dirname, "..", "..", "dist", "esm", file);

const exportsMap = [
  {
    name: ".",
    import: "index.mjs",
    verify: (mod) => {
      assert.ok(mod.ThemeProvider, "ThemeProvider export should exist");
      assert.ok(mod.PersonaPicker, "PersonaPicker export should exist");
      assert.ok(mod.AuroraBackground, "AuroraBackground export should exist");
      assert.ok(mod.AuroraOrb, "AuroraOrb export should exist");
      assert.ok(mod.DisplayText, "DisplayText export should exist");
      assert.ok(mod.LogoMark, "LogoMark export should exist");
      assert.ok(mod.ShowcaseCard, "ShowcaseCard export should exist");
      assert.ok(mod.FeatureTile, "FeatureTile export should exist");
      assert.ok(mod.InstallCommand, "InstallCommand export should exist");
      assert.equal(
        mod.GlassNavbar,
        mod.GlassNavigation,
        "GlassNavbar should alias GlassNavigation"
      );
      assert.equal(
        mod.GlassMediaControls,
        mod.LiquidGlassMediaControls,
        "GlassMediaControls should alias LiquidGlassMediaControls"
      );
      assert.equal(
        mod.LiquidGlassSourceTransition,
        mod.LiquidGlassTransitionProvider,
        "LiquidGlassSourceTransition should alias LiquidGlassTransitionProvider"
      );
      assert.equal(
        mod.SmartShoppingCart,
        mod.GlassSmartShoppingCart,
        "SmartShoppingCart should alias GlassSmartShoppingCart"
      );
      assert.equal(
        mod.AuraElementInteractionPlugin?.id,
        "auraElementInteraction",
        "AuraElementInteractionPlugin export should use the Aura plugin id"
      );
      assert.equal(
        mod.GalileoElementInteractionPlugin?.id,
        "galileoElementInteraction",
        "GalileoElementInteractionPlugin export should keep the legacy plugin id"
      );
    },
  },
  {
    name: "./tokens",
    import: "tokens/index.mjs",
    verify: (mod) => {
      assert.ok(Array.isArray(mod.personas), "personas array should exist");
      assert.ok(
        (mod.personas || []).length > 0,
        "personas array should not be empty"
      );
    },
  },
  {
    name: "./tokens/tailwind",
    import: "tokens/tailwind.theme.mjs",
    verify: (mod) => {
      assert.ok(
        mod.default?.extend?.colors?.primary || mod.extend?.colors?.primary,
        "tailwind theme should expose extend.colors.primary"
      );
    },
  },
  {
    name: "./tokens/manifest",
    import: "tokens/manifest.mjs",
    verify: (mod) => {
      const manifest = mod.default ?? mod;
      assert.ok(
        Array.isArray(manifest.personas) && manifest.personas.length > 0,
        "manifest.personas should be a non-empty array"
      );
    },
  },
  {
    name: "./registry",
    import: "registry/index.mjs",
    verify: (mod) => {
      assert.ok(
        mod.StyledComponentsRegistry,
        "StyledComponentsRegistry export should exist"
      );
      assert.ok(
        Array.isArray(mod.auraGlassRecipes) && mod.auraGlassRecipes.length >= 7,
        "registry should expose launch recipe metadata"
      );
      assert.ok(
        mod.getAuraGlassRecipe("saas-dashboard")?.files?.length > 0,
        "registry should resolve recipe files by id"
      );
    },
  },
  {
    name: "./client",
    import: "client/index.mjs",
    verify: (mod) => {
      assert.ok(
        mod.ThemeProvider,
        "ThemeProvider export should exist on client entry"
      );
    },
  },
  {
    name: "./server",
    import: "server/index.mjs",
    verify: (mod) => {
      assert.ok(
        mod.AuraGlassSSRProvider,
        "AuraGlassSSRProvider export should exist on server entry"
      );
    },
  },
  {
    name: "./ssr",
    import: "ssr/index.mjs",
    verify: (mod) => {
      assert.ok(
        mod.safeBrowserExec,
        "safeBrowserExec export should exist on ssr entry"
      );
    },
  },
  {
    name: "./three",
    import: "three/index.mjs",
    verify: (mod) => {
      assert.ok(
        mod.GlassShatterEffects,
        "GlassShatterEffects export should exist on three entry"
      );
      assert.ok(
        mod.SeasonalParticles,
        "SeasonalParticles export should exist on three entry"
      );
      assert.ok(mod.AuroraPro, "AuroraPro export should exist on three entry");
      assert.ok(
        mod.ARGlassEffects,
        "ARGlassEffects export should exist on three entry"
      );
    },
  },
  {
    name: "./core/mixins/glassMixins",
    import: "esm/core/mixins/glassMixins.js",
    verify: (mod) => {
      assert.ok(
        mod.createGlassStyle || mod.default?.createGlassStyle,
        "createGlassStyle should exist in glassMixins"
      );
    },
  },
  {
    name: "./utils/env",
    import: "esm/utils/env.js",
    verify: (mod) => {
      assert.ok(
        mod.isBrowser !== undefined || mod.default?.isBrowser !== undefined,
        "isBrowser should exist in utils/env"
      );
    },
  },
  {
    name: "./hooks/useGlassProbes",
    import: "esm/hooks/useGlassProbes.js",
    verify: (mod) => {
      assert.equal(
        typeof mod.useGlassProbes,
        "function",
        "useGlassProbes should exist"
      );
      assert.equal(
        typeof mod.useGlassElementProbe,
        "function",
        "useGlassElementProbe should exist"
      );
    },
  },
  {
    name: "./services/ai/openai-service",
    import: "esm/services/ai/openai-service.js",
    verify: (mod) => {
      assert.ok(
        mod.OpenAIService || mod.default?.OpenAIService,
        "OpenAIService should exist"
      );
    },
  },
  {
    name: "./services/ai/vision-service",
    import: "esm/services/ai/vision-service.js",
    verify: (mod) => {
      assert.ok(
        mod.VisionService || mod.default?.VisionService,
        "VisionService should exist"
      );
    },
  },
  {
    name: "./services/websocket/collaboration-service",
    import: "esm/services/websocket/collaboration-service.js",
    verify: (mod) => {
      assert.ok(
        mod.CollaborationService || mod.default?.CollaborationService,
        "CollaborationService should exist"
      );
    },
  },
];

for (const entry of exportsMap) {
  const importPath = entry.import.startsWith("esm/")
    ? resolveEsm(entry.import.replace("esm/", ""))
    : resolve(entry.import);
  const mod = await import(importPath);
  const value = mod.default ?? mod;
  entry.verify(value);
}

const packageJson = JSON.parse(
  readFileSync(path.join(__dirname, "..", "..", "package.json"), "utf8")
);

const glassProbesExport = packageJson.exports["./hooks/useGlassProbes"];
assert.equal(
  glassProbesExport.import,
  "./dist/esm/hooks/useGlassProbes.js",
  "./hooks/useGlassProbes should expose an ESM runtime target"
);
assert.equal(
  glassProbesExport.require,
  "./dist/cjs/hooks/useGlassProbes.js",
  "./hooks/useGlassProbes should expose a CJS runtime target"
);
assert.equal(
  glassProbesExport.default,
  "./dist/esm/hooks/useGlassProbes.js",
  "./hooks/useGlassProbes should expose a default runtime target"
);

assert.equal(
  packageJson.peerDependencies.openai,
  "^6.0.0",
  "openai should be declared as an optional peer for the OpenAI service subpath"
);
assert.equal(
  packageJson.peerDependencies["@google-cloud/vision"],
  "^5.0.0",
  "@google-cloud/vision should be declared as an optional peer for the Vision service subpath"
);
assert.equal(packageJson.peerDependenciesMeta.openai?.optional, true);
assert.equal(
  packageJson.peerDependenciesMeta["@google-cloud/vision"]?.optional,
  true
);

const openAIServiceSource = readFileSync(
  resolveEsm("services/ai/openai-service.js"),
  "utf8"
);
const visionServiceSource = readFileSync(
  resolveEsm("services/ai/vision-service.js"),
  "utf8"
);
assert.ok(
  !/\bfrom\s+["']openai["']/.test(openAIServiceSource),
  "OpenAI service subpath should not statically import the optional openai peer"
);
assert.ok(
  !/\bfrom\s+["']@google-cloud\/vision["']/.test(visionServiceSource),
  "Vision service subpath should not statically import the optional Google Vision peer"
);
