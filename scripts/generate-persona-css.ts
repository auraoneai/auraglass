#!/usr/bin/env node

import fs from "fs";
import path from "path";
import {
  DESIGN_MATRIX,
  PERSONA_IDS,
  DEFAULT_PERSONA_ID,
  type PersonaConfig,
  type PersonaId,
} from "../src/theme/designMatrix";

const OUTPUT_PATH = path.resolve(
  __dirname,
  "../src/styles/generated/persona-variables.css"
);

const HEADER = `/*
 * AUTO-GENERATED FILE — DO NOT EDIT DIRECTLY
 * Source: scripts/generate-persona-css.ts
 * Generated from src/theme/designMatrix.ts
 */`;

const ensureDirectory = (filePath: string) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const normalizeValue = (value: string | number): string => {
  if (typeof value === "number") {
    return String(value);
  }
  return value;
};

const hexToRgb = (value: string): string | null => {
  const hex = value.trim();
  if (!hex.startsWith("#")) {
    return null;
  }

  const normalized = hex.replace("#", "");
  if (!(normalized.length === 6 || normalized.length === 3)) {
    return null;
  }

  const chunkSize = normalized.length === 3 ? 1 : 2;
  const expand = (segment: string) =>
    segment.length === 1 ? segment + segment : segment;

  const segments = normalized.match(new RegExp(`.{1,${chunkSize}}`, "g"));
  if (!segments) {
    return null;
  }

  const [r, g, b] = segments.map((segment) =>
    parseInt(expand(segment), 16)
  );

  if ([r, g, b].some((value) => Number.isNaN(value))) {
    return null;
  }

  return `${r} ${g} ${b}`;
};

const pushTypography = (
  map: Record<string, string>,
  prefix: string,
  typography: PersonaConfig["typography"],
) => {
  (Object.keys(typography) as Array<keyof PersonaConfig["typography"]>).forEach(
    (tier) => {
      const spec = typography[tier];
      map[`--${prefix}-typography-${String(tier)}-weight`] = String(spec.weight);
      map[`--${prefix}-typography-${String(tier)}-size`] = normalizeValue(
        spec.size
      );
      map[`--${prefix}-typography-${String(tier)}-tracking`] = normalizeValue(
        spec.letterSpacing
      );
      if (spec.lineHeight) {
        map[`--${prefix}-typography-${String(tier)}-line-height`] = normalizeValue(
          spec.lineHeight
        );
      }
    }
  );
};

const buildVariableMap = (persona: PersonaConfig): Record<string, string> => {
  const map: Record<string, string> = {};

  // Core persona tokens
  map["--persona-background-canvas"] = normalizeValue(
    persona.colors.background.canvas
  );
  map["--persona-background-surface"] = normalizeValue(
    persona.colors.background.surface
  );
  map["--persona-text-primary"] = normalizeValue(persona.colors.text.primary);
  const textPrimaryRgb = hexToRgb(persona.colors.text.primary);
  if (textPrimaryRgb) {
    map["--persona-text-rgb"] = textPrimaryRgb;
  }
  map["--persona-accent-primary"] = normalizeValue(
    persona.colors.accent.primary
  );
  map["--persona-accent-secondary"] = normalizeValue(
    persona.colors.accent.secondary
  );
  map["--persona-state-success"] = normalizeValue(
    persona.colors.state.success
  );
  map["--persona-state-warning"] = normalizeValue(
    persona.colors.state.warning
  );
  map["--persona-state-error"] = normalizeValue(persona.colors.state.error);
  map["--persona-shadow-panel"] = normalizeValue(
    persona.colors.shadow.panel
  );
  map["--persona-focus-ring"] = normalizeValue(persona.colors.focus.ring);

  // Spacing & motion
  map["--persona-base-grid"] = normalizeValue(persona.spacing.baseGrid);
  map["--persona-panel-radius"] = normalizeValue(persona.spacing.panelRadius);
  map["--persona-button-radius"] = normalizeValue(
    persona.spacing.buttonRadius
  );
  map["--persona-overlay-blur"] = normalizeValue(persona.spacing.overlayBlur);
  map["--persona-motion-entry"] = normalizeValue(persona.motion.entry);
  map["--persona-motion-hover"] = normalizeValue(persona.motion.hover);
  map["--persona-motion-focus"] = normalizeValue(persona.motion.focus);
  map["--persona-motion-async"] = normalizeValue(persona.motion.async);

  pushTypography(map, "persona", persona.typography);

  // Bridge values into glass tokens for immediate consumption
  map["--glass-theme-background-canvas"] = map["--persona-background-canvas"];
  map["--glass-theme-background-surface"] = map["--persona-background-surface"];
  map["--glass-theme-text"] = map["--persona-text-primary"];
  if (textPrimaryRgb) {
    map["--glass-theme-text-rgb"] = textPrimaryRgb;
  }
  map["--glass-theme-accent-primary"] = map["--persona-accent-primary"];
  map["--glass-theme-accent-secondary"] = map["--persona-accent-secondary"];
  const accentPrimaryRgb = hexToRgb(persona.colors.accent.primary);
  if (accentPrimaryRgb) {
    map["--glass-theme-accent-primary-rgb"] = accentPrimaryRgb;
  }
  const accentSecondaryRgb = hexToRgb(persona.colors.accent.secondary);
  if (accentSecondaryRgb) {
    map["--glass-theme-accent-secondary-rgb"] = accentSecondaryRgb;
  }
  map["--glass-theme-state-success"] = map["--persona-state-success"];
  map["--glass-theme-state-warning"] = map["--persona-state-warning"];
  map["--glass-theme-state-error"] = map["--persona-state-error"];
  const stateSuccessRgb = hexToRgb(persona.colors.state.success);
  if (stateSuccessRgb) {
    map["--glass-theme-state-success-rgb"] = stateSuccessRgb;
  }
  const stateWarningRgb = hexToRgb(persona.colors.state.warning);
  if (stateWarningRgb) {
    map["--glass-theme-state-warning-rgb"] = stateWarningRgb;
  }
  const stateErrorRgb = hexToRgb(persona.colors.state.error);
  if (stateErrorRgb) {
    map["--glass-theme-state-error-rgb"] = stateErrorRgb;
  }
  map["--glass-theme-shadow-panel"] = map["--persona-shadow-panel"];
  map["--glass-theme-focus-ring"] = map["--persona-focus-ring"];
  map["--glass-theme-panel-radius"] = map["--persona-panel-radius"];
  map["--glass-theme-button-radius"] = map["--persona-button-radius"];
  map["--glass-theme-base-grid"] = map["--persona-base-grid"];
  map["--glass-theme-overlay-blur"] = map["--persona-overlay-blur"];
  map["--glass-theme-motion-entry"] = map["--persona-motion-entry"];
  map["--glass-theme-motion-hover"] = map["--persona-motion-hover"];
  map["--glass-theme-motion-focus"] = map["--persona-motion-focus"];
  map["--glass-theme-motion-async"] = map["--persona-motion-async"];

  pushTypography(map, "glass-theme", persona.typography);

  return map;
};

const formatBlock = (selector: string, variables: Record<string, string>) => {
  const entries = Object.entries(variables).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  const lines = entries.map(([key, value]) => `  ${key}: ${value};`);
  return `${selector} {\n${lines.join("\n")}\n}`;
};

const generate = () => {
  const blocks: string[] = [HEADER];

  const defaultPersona = DESIGN_MATRIX[DEFAULT_PERSONA_ID];
  if (!defaultPersona) {
    throw new Error(
      `Default persona \"${DEFAULT_PERSONA_ID}\" not found in DESIGN_MATRIX.`
    );
  }

  blocks.push(
    formatBlock(
      `:root, [data-persona="${DEFAULT_PERSONA_ID}"]`,
      buildVariableMap(defaultPersona)
    )
  );

  PERSONA_IDS.filter((id) => id !== DEFAULT_PERSONA_ID).forEach((id) => {
    const persona = DESIGN_MATRIX[id as PersonaId];
    blocks.push(formatBlock(`[data-persona="${id}"]`, buildVariableMap(persona)));
  });

  blocks.push(
    `:root {\n  --persona-default-id: \"${DEFAULT_PERSONA_ID}\";\n}`
  );

  const content = `${blocks.join("\n\n")}\n`;

  return content;
};

const writeOutput = (content: string) => {
  ensureDirectory(OUTPUT_PATH);
  fs.writeFileSync(OUTPUT_PATH, content, "utf8");
};

const run = () => {
  const content = generate();
  const checkMode = process.argv.includes("--check");

  if (checkMode) {
    if (!fs.existsSync(OUTPUT_PATH)) {
      console.error(
        `Persona CSS is missing. Expected file at ${OUTPUT_PATH}. Run without --check to generate it.`
      );
      process.exit(1);
    }

    const existing = fs.readFileSync(OUTPUT_PATH, "utf8");
    if (existing.trim() !== content.trim()) {
      console.error(
        "Persona CSS is out of date. Run npm run glass:generate-persona-css to regenerate."
      );
      process.exit(1);
    }

    process.exit(0);
  }

  writeOutput(content);
};

run();
