import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolve = (file) => path.join(__dirname, "..", "..", "dist", file);

const exportsMap = [
  {
    name: ".",
    import: "index.mjs",
    verify: (mod) => {
      assert.ok(mod.ThemeProvider, "ThemeProvider export should exist");
      assert.ok(mod.PersonaPicker, "PersonaPicker export should exist");
    },
  },
  {
    name: "./tokens",
    import: "tokens/index.mjs",
    verify: (mod) => {
      assert.ok(Array.isArray(mod.personas), "personas array should exist");
      assert.ok(
        (mod.personas || []).length > 0,
        "personas array should not be empty",
      );
    },
  },
  {
    name: "./tokens/tailwind",
    import: "tokens/tailwind.theme.mjs",
    verify: (mod) => {
      assert.ok(
        mod.default?.extend?.colors?.primary ||
          mod.extend?.colors?.primary,
        "tailwind theme should expose extend.colors.primary",
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
        "manifest.personas should be a non-empty array",
      );
    },
  },
  {
    name: "./registry",
    import: "registry/index.mjs",
    verify: (mod) => {
      assert.ok(mod.StyledComponentsRegistry, "StyledComponentsRegistry export should exist");
    },
  },
  {
    name: "./client",
    import: "client/index.mjs",
    verify: (mod) => {
      assert.ok(
        mod.ThemeProvider,
        "ThemeProvider export should exist on client entry",
      );
    },
  },
  {
    name: "./server",
    import: "server/index.mjs",
    verify: (mod) => {
      assert.ok(
        mod.AuraGlassSSRProvider,
        "AuraGlassSSRProvider export should exist on server entry",
      );
    },
  },
  {
    name: "./ssr",
    import: "ssr/index.mjs",
    verify: (mod) => {
      assert.ok(
        mod.safeBrowserExec,
        "safeBrowserExec export should exist on ssr entry",
      );
    },
  },
];

for (const entry of exportsMap) {
  const mod = await import(resolve(entry.import));
  const value = mod.default ?? mod;
  entry.verify(value);
}
