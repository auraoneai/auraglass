import assert from "node:assert/strict";
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
