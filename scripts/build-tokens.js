#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TOKENS_ROOT = path.resolve(ROOT, "tokens");
const DIST_ROOT = path.resolve(ROOT, "dist/tokens");
const SRC_TOKENS_DIR = path.resolve(ROOT, "src/tokens");
const SRC_STYLES_DIR = path.resolve(ROOT, "src/styles");

const ensureDir = (dir) => {
  fs.mkdirSync(dir, { recursive: true });
};

const readJson = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

const writeFile = (filePath, contents) => {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, contents);
};

const kebab = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

const asCssVar = (...parts) => `--aura-${parts.filter(Boolean).map(kebab).join("-")}`;

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const requiredKeys = [
  "metadata",
  "colors",
  "typography",
  "spacing",
  "motion",
  "glass",
];

const loadPersonas = () => {
  const manifestPath = path.join(TOKENS_ROOT, "index.json");
  const manifest = readJson(manifestPath);
  assert(Array.isArray(manifest.personas), "tokens/index.json must include personas array");

  const personas = manifest.personas.map((entry) => {
    assert(entry.id, "Each persona entry requires id");
    assert(entry.path, `Persona ${entry.id} missing path`);
    const personaPath = path.resolve(TOKENS_ROOT, entry.path);
    const payload = readJson(personaPath);

    requiredKeys.forEach((key) => {
      assert(key in payload, `Persona ${entry.id} missing ${key}`);
    });

    return { manifest: entry, payload, path: entry.path };
  });

  return { manifest: { ...manifest, personas: personas.map((p) => p.manifest) }, personas };
};

const buildGlobalCssVars = (personaPayload) => {
  const vars = [];
  const { colors, typography, spacing, motion } = personaPayload;

  Object.entries(colors.semantic).forEach(([key, value]) => {
    vars.push(`${asCssVar("color", "semantic", key)}: ${value};`);
  });

  Object.entries(colors.global).forEach(([key, value]) => {
    vars.push(`${asCssVar("color", "global", key)}: ${value};`);
  });

  Object.entries(typography.families).forEach(([key, value]) => {
    vars.push(`${asCssVar("font", key)}: ${value};`);
  });

  Object.entries(typography.scale).forEach(([token, spec]) => {
    Object.entries(spec).forEach(([attribute, value]) => {
      vars.push(`${asCssVar("type", token, attribute)}: ${value};`);
    });
  });

  Object.entries(typography.weights).forEach(([key, value]) => {
    vars.push(`${asCssVar("font", "weight", key)}: ${value};`);
  });

  Object.entries(typography.lineHeights).forEach(([key, value]) => {
    vars.push(`${asCssVar("font", "line-height", key)}: ${value};`);
  });

  Object.entries(spacing.scale).forEach(([key, value]) => {
    vars.push(`${asCssVar("space", key)}: ${value};`);
  });

  Object.entries(spacing.radii).forEach(([key, value]) => {
    vars.push(`${asCssVar("radius", key)}: ${value};`);
  });

  Object.entries(spacing.gaps).forEach(([key, value]) => {
    vars.push(`${asCssVar("gap", key)}: ${value};`);
  });

  Object.entries(motion.durations).forEach(([key, value]) => {
    vars.push(`${asCssVar("motion", "duration", key)}: ${value};`);
  });

  Object.entries(motion.easings).forEach(([key, value]) => {
    vars.push(`${asCssVar("motion", "easing", key)}: ${value};`);
  });

  Object.entries(motion.stagger).forEach(([key, value]) => {
    vars.push(`${asCssVar("motion", "stagger", key)}: ${value};`);
  });

  return vars;
};

const buildPersonaCssBlock = (persona) => {
  const { metadata, colors, glass } = persona.payload;
  const selectorBase = `[data-aura-theme="${metadata.id}"]`;
  const blocks = [];

  Object.entries(colors.personas).forEach(([mode, values]) => {
    const selector = `${selectorBase}[data-aura-mode="${mode}"]`;
    const lines = Object.entries(values).map(
      ([key, value]) => `${asCssVar("color", key)}: ${value};`
    );
    blocks.push({ selector, lines });
  });

  const surfaceLines = [];
  Object.entries(glass.surfaces).forEach(([intent, elevations]) => {
    Object.entries(elevations).forEach(([elevation, spec]) => {
      surfaceLines.push(
        `${asCssVar("glass", intent, elevation, "backdrop-blur")}: ${spec.backdropBlur.px}px;`
      );
      surfaceLines.push(
        `${asCssVar("glass", intent, elevation, "surface-base")}: ${spec.surface.base};`
      );
      if (spec.surface.overlay) {
        surfaceLines.push(
          `${asCssVar("glass", intent, elevation, "surface-overlay")}: ${spec.surface.overlay};`
        );
      }
      surfaceLines.push(
        `${asCssVar("glass", intent, elevation, "border-color")}: ${spec.border.color};`
      );
      surfaceLines.push(
        `${asCssVar("glass", intent, elevation, "border-width")}: ${spec.border.width}px;`
      );
      surfaceLines.push(
        `${asCssVar("glass", intent, elevation, "border-style")}: ${spec.border.style};`
      );
      if (spec.innerGlow) {
        surfaceLines.push(
          `${asCssVar("glass", intent, elevation, "inner-glow-color")}: ${spec.innerGlow.color};`
        );
        surfaceLines.push(
          `${asCssVar("glass", intent, elevation, "inner-glow-spread")}: ${spec.innerGlow.spread}px;`
        );
        surfaceLines.push(
          `${asCssVar("glass", intent, elevation, "inner-glow-blur")}: ${spec.innerGlow.blur}px;`
        );
      }
      if (spec.outerShadow) {
        surfaceLines.push(
          `${asCssVar("glass", intent, elevation, "shadow-color")}: ${spec.outerShadow.color};`
        );
        surfaceLines.push(
          `${asCssVar("glass", intent, elevation, "shadow-x")}: ${spec.outerShadow.x}px;`
        );
        surfaceLines.push(
          `${asCssVar("glass", intent, elevation, "shadow-y")}: ${spec.outerShadow.y}px;`
        );
        surfaceLines.push(
          `${asCssVar("glass", intent, elevation, "shadow-blur")}: ${spec.outerShadow.blur}px;`
        );
        surfaceLines.push(
          `${asCssVar("glass", intent, elevation, "shadow-spread")}: ${spec.outerShadow.spread}px;`
        );
      }
      if (typeof spec.noiseOpacity === "number") {
        surfaceLines.push(
          `${asCssVar("glass", intent, elevation, "noise-opacity")}: ${spec.noiseOpacity};`
        );
      }
      if (typeof spec.highlightOpacity === "number") {
        surfaceLines.push(
          `${asCssVar("glass", intent, elevation, "highlight-opacity")}: ${spec.highlightOpacity};`
        );
      }
      surfaceLines.push(
        `${asCssVar("glass", intent, elevation, "text-primary")}: ${spec.text.primary};`
      );
      surfaceLines.push(
        `${asCssVar("glass", intent, elevation, "text-secondary")}: ${spec.text.secondary};`
      );
    });
  });

  if (surfaceLines.length > 0) {
    blocks.push({ selector: selectorBase, lines: surfaceLines });
  }

  return blocks;
};

const buildKeyframesCss = (personaPayload) => {
  const entries = Object.entries(personaPayload.motion.keyframes).map(([name, def]) => {
    const keyframeName = `aura-${kebab(name)}`;
    const steps = def.steps
      .map((step) => {
        const properties = Object.entries(step.properties)
          .map(([prop, value]) => `    ${prop}: ${value};`)
          .join("\n");
        return `  ${step.at} {\n${properties}\n  }`;
      })
      .join("\n");
    return `@keyframes ${keyframeName} {\n${steps}\n}`;
  });

  return entries.join("\n\n");
};

const buildTailwindThemeLiteral = (personaPayload) => {
  const { colors, spacing, typography } = personaPayload;
  const lines = [];
  lines.push("{");
  lines.push("  extend: {");
  lines.push("    colors: {");
  Object.keys(colors.semantic).forEach((key) => {
    lines.push(
      `      ${key}: 'var(${asCssVar("color", "semantic", key)})',`
    );
  });
  lines.push("    },");
  lines.push("    spacing: {");
  Object.keys(spacing.scale).forEach((key) => {
    lines.push(`      '${key}': 'var(${asCssVar("space", key)})',`);
  });
  lines.push("    },");
  lines.push("    borderRadius: {");
  Object.keys(spacing.radii).forEach((key) => {
    lines.push(`      '${key}': 'var(${asCssVar("radius", key)})',`);
  });
  lines.push("    },");
  lines.push("    fontSize: {");
  Object.entries(typography.scale).forEach(([token, spec]) => {
    lines.push(
      `      '${token}': ['var(${asCssVar("type", token, "font-size")})', { lineHeight: 'var(${asCssVar(
        "type",
        token,
        "line-height"
      )})', letterSpacing: 'var(${asCssVar("type", token, "tracking")})' }],`
    );
  });
  lines.push("    },");
  lines.push("  },");
  lines.push("}");
  return lines.join("\n");
};

const buildUnoPreset = (personaPayload) => {
  const { colors, spacing, typography } = personaPayload;
  const lines = [];
  lines.push("import { definePreset } from 'unocss';");
  lines.push("");
  lines.push("export const auraGlassPreset = definePreset({");
  lines.push("  name: 'aura-glass',");
  lines.push("  theme: {");
  lines.push("    colors: {");
  Object.keys(colors.semantic).forEach((key) => {
    lines.push(
      `      ${key}: 'var(${asCssVar("color", "semantic", key)})',`
    );
  });
  lines.push("    },");
  lines.push("    spacing: {");
  Object.keys(spacing.scale).forEach((key) => {
    lines.push(`      '${key}': 'var(${asCssVar("space", key)})',`);
  });
  lines.push("    },");
  lines.push("    fontSize: {");
  Object.keys(typography.scale).forEach((token) => {
    lines.push(
      `      '${token}': 'var(${asCssVar("type", token, "font-size")})',`
    );
  });
  lines.push("    },");
  lines.push("  },");
  lines.push("});");
  lines.push("");
  lines.push("export default auraGlassPreset;\n");
  return lines.join("\n");
};

const buildGeneratedTs = (manifest, personas) => {
  const personaObjects = personas.map((p) => {
    const payload = { ...p.payload };
    if (Object.prototype.hasOwnProperty.call(payload, "$schema")) {
      delete payload.$schema;
    }
    return payload;
  });
  const personaDescriptors = personas.map((p) => ({
    id: p.payload.metadata.id,
    modes: p.payload.metadata.modes,
  }));

  const personaIdUnion = personaDescriptors
    .map((p) => `'${p.id}'`)
    .join(" | ");

  const personaModeUnion = Array.from(
    new Set(personaDescriptors.flatMap((p) => p.modes))
  )
    .map((mode) => `'${mode}'`)
    .join(" | ");

  const dataLiteral = JSON.stringify(
    {
      version: manifest.version,
      description: manifest.description,
      personas: personaObjects,
    },
    null,
    2
  );

  const lines = [];
  lines.push("// AUTO-GENERATED FILE. DO NOT EDIT.");
  lines.push(`export type PersonaId = ${personaIdUnion};`);
  lines.push(`export type PersonaMode = ${personaModeUnion};`);
  lines.push("");
  lines.push("export interface AuraPersona {");
  lines.push("  $schema?: string;");
  lines.push("  metadata: {");
  lines.push("    id: PersonaId;");
  lines.push("    displayName: string;");
  lines.push("    description?: string;");
  lines.push("    version: string;");
  lines.push("    modes: PersonaMode[];");
  lines.push("  };");
  lines.push("  colors: Record<string, any>;");
  lines.push("  typography: Record<string, any>;");
  lines.push("  spacing: Record<string, any>;");
  lines.push("  motion: Record<string, any>;");
  lines.push("  glass: Record<string, any>;");
  lines.push("}");
  lines.push("");
  lines.push("export interface AuraTokensManifest {");
  lines.push("  version?: string;");
  lines.push("  description?: string;");
  lines.push("  personas: AuraPersona[];");
  lines.push("}");
  lines.push("");
  lines.push(`export const auraTokens = ${dataLiteral} as const satisfies AuraTokensManifest;`);
  lines.push("");
  lines.push("const personaMap = new Map<PersonaId, AuraPersona>();");
  lines.push("auraTokens.personas.forEach((persona) => {");
  lines.push("  personaMap.set(persona.metadata.id as PersonaId, persona as AuraPersona);");
  lines.push("});");
  lines.push("");
  lines.push("export function getPersona(id: PersonaId): AuraPersona {");
  lines.push("  const persona = personaMap.get(id);");
  lines.push("  if (!persona) {");
  lines.push("    throw new Error(`Unknown persona \"${id}\"`);");
  lines.push("  }");
  lines.push("  return persona;");
  lines.push("}");
  lines.push("");
  lines.push("export function getPersonaModeTokens(id: PersonaId, mode: PersonaMode) {");
  lines.push("  const persona = getPersona(id);");
  lines.push("  if (!persona.metadata.modes.includes(mode)) {");
  lines.push("    throw new Error(`Persona ${id} does not include mode ${mode}`);");
  lines.push("  }");
  lines.push("  return {");
  lines.push("    colors: persona.colors.personas?.[mode],");
  lines.push("    glass: persona.glass,");
  lines.push("    motion: persona.motion,");
  lines.push("    spacing: persona.spacing,");
  lines.push("    typography: persona.typography,");
  lines.push("  };");
  lines.push("}");
  lines.push("");
  lines.push("export default auraTokens;\n");

  return lines.join("\n");
};

const buildManifestModule = (manifest, personas) => {
  const payload = {
    version: manifest.version,
    description: manifest.description,
    personas: personas.map((p) => p.payload.metadata.id),
  };
  return `export const manifest = ${JSON.stringify(payload, null, 2)};
export default manifest;
`;
};

const createTokensPayload = (manifest, personas) => ({
  version: manifest.version,
  description: manifest.description,
  personas: personas.map((p) => p.payload),
});

const buildTokensModule = (format) => {
  if (format === "esm") {
    return `import auraTokens from "./tokens.json" with { type: "json" };

export { auraTokens };
export const personas = auraTokens.personas;
export const version = auraTokens.version;
export const description = auraTokens.description;
export default auraTokens;
`;
  }

  return `'use strict';

const auraTokens = require("./tokens.json");

module.exports = auraTokens;
module.exports.default = auraTokens;
module.exports.auraTokens = auraTokens;
module.exports.personas = auraTokens.personas;
module.exports.version = auraTokens.version;
module.exports.description = auraTokens.description;
`;
};

const main = () => {
  const { manifest, personas } = loadPersonas();

  const representativePersona = personas[0]?.payload;
  assert(representativePersona, "At least one persona is required");

  const globalVars = buildGlobalCssVars(representativePersona);

  let cssOutput = `:root {\n  ${globalVars.join("\n  ")}\n}\n\n`;
  personas.forEach((persona) => {
    const blocks = buildPersonaCssBlock(persona);
    blocks.forEach((block) => {
      cssOutput += `${block.selector} {\n  ${block.lines.join("\n  ")}\n}\n\n`;
    });
  });

  const keyframesCss = buildKeyframesCss(representativePersona);

  const tailwindThemeLiteral = buildTailwindThemeLiteral(representativePersona);
  const unoPreset = buildUnoPreset(representativePersona);
  const generatedTs = buildGeneratedTs(manifest, personas);
  const manifestModule = buildManifestModule(manifest, personas);
  const tokensPayload = createTokensPayload(manifest, personas);
  const tokensJson = JSON.stringify(tokensPayload, null, 2);

  writeFile(path.join(DIST_ROOT, "tokens.css"), cssOutput.trim() + "\n");
  writeFile(path.join(DIST_ROOT, "tokens.keyframes.css"), keyframesCss.trim() + "\n");
  writeFile(
    path.join(DIST_ROOT, "tailwind.theme.cjs"),
    `module.exports = ${tailwindThemeLiteral};\n`
  );
  writeFile(
    path.join(DIST_ROOT, "tailwind.theme.mjs"),
    `export const auraGlassTailwindTheme = ${tailwindThemeLiteral};\nexport default auraGlassTailwindTheme;\n`
  );
  writeFile(
    path.join(DIST_ROOT, "tailwind.theme.js"),
    'module.exports = require("./tailwind.theme.cjs");\n'
  );
  writeFile(path.join(DIST_ROOT, "unocss.preset.ts"), unoPreset);
  writeFile(path.join(DIST_ROOT, "tokens.json"), tokensJson + "\n");
  writeFile(path.join(DIST_ROOT, "index.mjs"), buildTokensModule("esm"));
  writeFile(path.join(DIST_ROOT, "index.cjs"), buildTokensModule("cjs"));
  writeFile(path.join(DIST_ROOT, "manifest.mjs"), manifestModule);
  writeFile(path.join(SRC_TOKENS_DIR, "generated.ts"), generatedTs);
  writeFile(path.join(SRC_STYLES_DIR, "variables.css"), cssOutput.trim() + "\n");
  writeFile(path.join(SRC_STYLES_DIR, "keyframes.css"), keyframesCss.trim() + "\n");
};

main();
