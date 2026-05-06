#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const vm = require("vm");
const { buildSync } = require("esbuild");

const rootDir = path.resolve(__dirname, "../../");

const bundleToModule = (entry) => {
  const result = buildSync({
    entryPoints: [entry],
    bundle: true,
    platform: "node",
    target: "es2019",
    format: "cjs",
    sourcemap: false,
    write: false,
    logLevel: "silent",
    external: ["react", "styled-components"],
  });

  const [output] = result.outputFiles;
  const code = output.text;

  const module = { exports: {} };
  const sandbox = {
    module,
    exports: module.exports,
    require: (specifier) => {
      if (specifier === "react") {
        return {};
      }
      if (specifier === "styled-components") {
        return {};
      }
      return require(specifier);
    },
    __dirname: path.dirname(entry),
    __filename: entry,
    process,
    console,
    Buffer,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
  };

  const script = new vm.Script(code, { filename: entry });
  const context = vm.createContext(sandbox);
  script.runInContext(context);
  return module.exports;
};

const saveJson = (filepath, data) => {
  const outputPath = path.resolve(rootDir, filepath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
};

const buildPersonaPayload = () => {
  const tokenModule = bundleToModule(
    path.resolve(rootDir, "src/tokens/themeTokens.ts")
  );
  const glassModule = bundleToModule(
    path.resolve(rootDir, "src/tokens/glass.ts")
  );

  const { light: lightTheme, dark: darkTheme } = tokenModule;
  const { AURA_GLASS, LIQUID_GLASS } = glassModule;

  const payload = {
    metadata: {
      id: "auraglass-default",
      displayName: "AuraGlass Default",
      description:
        "Baseline AuraGlass persona including light and dark modes with glassmorphism surfaces.",
      version: require(path.resolve(rootDir, "package.json")).version,
      modes: ["light", "dark"],
    },
    colors: {
      global: lightTheme.colors.glass,
      semantic: lightTheme.colors.semantic,
      personas: {
        light: {
          ...lightTheme.colors.glass,
          ...lightTheme.colors.components.button,
          ...lightTheme.colors.components.input,
          ...lightTheme.colors.components.card,
        },
        dark: {
          ...darkTheme.colors.glass,
          ...darkTheme.colors.components.button,
          ...darkTheme.colors.components.input,
          ...darkTheme.colors.components.card,
        },
      },
    },
    typography: {
      families: tokenModule.TYPOGRAPHY?.families || {},
      scale: tokenModule.TYPOGRAPHY?.variants || {},
      weights: tokenModule.TYPOGRAPHY?.fontWeight || {},
      lineHeights: tokenModule.TYPOGRAPHY?.lineHeight || {},
    },
    spacing: {
      scale: tokenModule.SPACING?.space || {},
      radii: tokenModule.BORDER_RADIUS || {},
      gaps: tokenModule.SPACING?.gaps || {},
    },
    motion: {
      durations: tokenModule.ANIMATION?.DURATION || {},
      easings: tokenModule.ANIMATION?.EASING || {},
      stagger: tokenModule.ANIMATION?.STAGGER || {},
      keyframes: tokenModule.ANIMATION?.KEYFRAMES || {},
    },
    glass: {
      intents: Object.keys(AURA_GLASS.surfaces),
      elevations: Object.keys(AURA_GLASS.surfaces.neutral || {}),
      surfaces: AURA_GLASS.surfaces,
      performance: AURA_GLASS.performance || {},
      liquid: LIQUID_GLASS.performance || {},
    },
  };

  return payload;
};

const main = () => {
  const persona = buildPersonaPayload();
  saveJson("tokens/personas/default.json", {
    $schema: "./../schema.json",
    ...persona,
  });
};

main();
