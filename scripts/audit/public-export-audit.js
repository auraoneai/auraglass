#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { evidenceDir } = require("../ci/lib/evidence-dir");

const root = process.cwd();
const indexPath = path.join(root, "src/index.ts");
const reportJsonPath = path.join(evidenceDir(), "public-export-audit.json");
const reportMdPath = path.join(evidenceDir(), "public-export-audit.md");
const visualTargetManifestPath = path.join(
  evidenceDir(),
  "public-visual-target-manifest.json"
);

const read = (filePath) => fs.readFileSync(filePath, "utf8");

const walk = (dir, predicate, out = []) => {
  if (!fs.existsSync(dir)) return out;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, predicate, out);
      continue;
    }
    if (predicate(fullPath)) out.push(fullPath);
  }

  return out;
};

const normalizeName = (value) =>
  value
    .replace(/\.(stories|test|spec)?\.?[cm]?[jt]sx?$/, "")
    .replace(/\.md$/, "")
    .toLowerCase()
    .replace(/^glass/, "")
    .replace(/[^a-z0-9]/g, "");

const candidateNames = (exportName, sourcePath) => {
  const sourceBase = sourcePath ? path.basename(sourcePath) : exportName;
  return new Set([
    normalizeName(exportName),
    normalizeName(exportName.replace(/^Glass/, "")),
    normalizeName(`Glass${exportName}`),
    normalizeName(sourceBase),
    normalizeName(sourceBase.replace(/^Glass/, "")),
    normalizeName(`Glass${sourceBase}`),
  ]);
};

const toNameSet = (files) =>
  new Set(files.map((filePath) => normalizeName(path.basename(filePath))));

const hasDirectMatch = (set, exportName, sourcePath) =>
  [...candidateNames(exportName, sourcePath)].some((name) => set.has(name));

const resolveSourceFile = (specifier) => {
  if (!specifier.startsWith(".")) return null;

  const base = path.join(root, "src", specifier.replace(/^\.\//, ""));
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.jsx`,
    path.join(base, "index.ts"),
    path.join(base, "index.tsx"),
  ];

  return (
    candidates.find(
      (candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()
    ) || null
  );
};

const declarationPathForSource = (sourceFile) => {
  if (!sourceFile) return null;
  const relative = path.relative(path.join(root, "src"), sourceFile);
  const parsed = path.parse(relative);
  return path.join(root, "dist", parsed.dir, `${parsed.name}.d.ts`);
};

// Public values can live under components/ without being renderable UI. Keep
// them in the API audit while excluding them from visual certification.
const nonVisualPublicExports = new Map([
  [
    "QuantumNeuromorphicEngine",
    "Stateful computation class; it does not render React or DOM output.",
  ],
]);

// A root-level `as` clause is syntax, not necessarily a public alias. For
// example, the public GlassTabsTrigger name is the canonical identity of the
// source-local TabsTrigger component. Keep this reviewed list explicit so a
// newly renamed public value cannot silently acquire a visual classification.
const reviewedCanonicalReexports = new Set([
  "Glass",
  "Motion",
  "OptimizedGlass",
  "GlassTabsRoot",
  "GlassTabsContent",
  "GlassTabsList",
  "GlassTabsTrigger",
  "GlassSelectCompound",
  "GlassSelectRoot",
  "GlassSelectContent",
  "GlassSelectGroup",
  "GlassSelectItem",
  "GlassSelectLabel",
  "GlassSelectScrollDownButton",
  "GlassSelectScrollUpButton",
  "GlassSelectSeparator",
  "GlassSelectTrigger",
  "GlassSelectValue",
  "SpatialComputingEngine",
  "VoiceGlassControl",
  "DimensionalGlass",
  "FrostedGlass",
  "HeatGlass",
  "PageGlassContainer",
  "WidgetGlass",
  "AtmosphericBackground",
  "ParticleBackground",
  "SpeedDialAction",
  "SpeedDialIcon",
  "FocusIndicator",
  "RippleButton",
  "StateIndicator",
  "VisualFeedback",
  "GlassAccordionUI",
  "GlassCheckboxUI",
]);

// These names are compatibility identities for another public visual export.
// They retain independent coverageIds and therefore do not reduce screenshot
// scope; aliasOf records the identity relationship only.
const publicVisualAliases = new Map([
  ["GlassPrimitive", "Glass"],
  ["LiquidGlassSourceTransition", "LiquidGlassTransitionProvider"],
  ["GlassNavbar", "GlassNavigation"],
  ["ResponsiveNavigation", "GlassResponsiveNav"],
  ["Button", "GlassButton"],
  ["Card", "GlassCard"],
  ["DataChart", "GlassDataChart"],
  ["SmartShoppingCart", "GlassSmartShoppingCart"],
  ["GlassMediaControls", "LiquidGlassMediaControls"],
  ["VoiceGlassDemo", "VoiceGlassControl"],
  ["GalileoElementInteractionPlugin", "AuraElementInteractionPlugin"],
]);

// Public support values that do not themselves return DOM are still part of
// the established 470-symbol visual scope. Their dedicated coverage identity
// must demonstrate them through the named public visual target.
const publicVisualCoverageRelationships = new Map([
  ["GlassContext", "ThemeProvider"],
  ["GlassMenuPrimitive", "GlassMenuPrimitiveRoot"],
  ["AuraElementInteractionPlugin", "GlassDataChart"],
  ["LiquidGlassGPUDriver", "LiquidGlassGPU"],
  ["BiometricAdaptationEngine", "GlassBiometricAdaptation"],
  ["BiometricStressDetector", "GlassBiometricAdaptation"],
  ["GlassVoiceCommands", "VoiceGlassControl"],
]);

const cleanMember = (member) =>
  member
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .trim();

const parseMember = (member) => {
  const cleaned = cleanMember(member)
    .replace(/^type\s+/, "")
    .trim();
  if (!cleaned) return null;

  const aliasMatch = cleaned.match(/^(.+?)\s+as\s+(.+)$/);
  if (aliasMatch) {
    return {
      importedName: aliasMatch[1].trim(),
      exportName: aliasMatch[2].trim(),
      isAlias: true,
    };
  }

  return {
    importedName: cleaned,
    exportName: cleaned,
    isAlias: false,
  };
};

const parseRootExports = (source) => {
  const exports = [];
  const exportStars = [];

  const namedExportRegex =
    /export\s+(type\s+)?\{([\s\S]*?)\}\s+from\s+["']([^"']+)["'];?/g;
  let match;
  while ((match = namedExportRegex.exec(source))) {
    const isTypeOnly = Boolean(match[1]);
    const specifier = match[3];
    const sourceFile = resolveSourceFile(specifier);

    for (const rawMember of match[2].split(",")) {
      const parsed = parseMember(rawMember);
      if (!parsed) continue;

      exports.push({
        ...parsed,
        kind:
          isTypeOnly || rawMember.trim().startsWith("type ") ? "type" : "value",
        specifier,
        sourceFile,
      });
    }
  }

  const starExportRegex = /export\s+\*\s+from\s+["']([^"']+)["'];?/g;
  while ((match = starExportRegex.exec(source))) {
    exportStars.push({
      specifier: match[1],
      sourceFile: resolveSourceFile(match[1]),
    });
  }

  const constExportRegex = /export\s+const\s+([A-Za-z0-9_$]+)/g;
  while ((match = constExportRegex.exec(source))) {
    exports.push({
      importedName: match[1],
      exportName: match[1],
      isAlias: false,
      kind: "const",
      specifier: "./index.ts",
      sourceFile: indexPath,
    });
  }

  return { exports, exportStars };
};

const inventoryPath = path.join(root, "reports/component_inventory.json");
const inventory = JSON.parse(read(inventoryPath));
const inventoryByName = new Map(
  inventory.components.map((component) => [
    normalizeName(component.name),
    component,
  ])
);

const storyNameSet = toNameSet(
  walk(path.join(root, "src"), (filePath) => filePath.endsWith(".stories.tsx"))
);
const testNameSet = toNameSet(
  walk(path.join(root, "src"), (filePath) =>
    /\.(test|spec)\.[cm]?[jt]sx?$/.test(filePath)
  )
);
const docsNameSet = toNameSet(
  walk(path.join(root, "docs"), (filePath) => filePath.endsWith(".md"))
);

const { exports: rootExports, exportStars } = parseRootExports(read(indexPath));

// Retained only to reconcile the legacy audit's former 43-gap headline. These
// 30 public targets were accepted by name even though they are not entries in
// the frozen 356-source historical inventory. The allowance is no longer used
// to claim inventory membership.
const legacyUpgradeInventoryAllowances = [
  "LiquidGlassMaterial",
  "LiquidGlassEffectGroup",
  "LiquidGlassScrollEdge",
  "LiquidGlassBackdropSampler",
  "LiquidGlassConcentricFrame",
  "LiquidGlassLayerProvider",
  "LiquidGlassSurfaceLayer",
  "LiquidGlassSource",
  "LiquidGlassDestination",
  "LiquidGlassTransitionProvider",
  "LiquidGlassToolbar",
  "LiquidGlassInsetSidebar",
  "LiquidGlassTabBar",
  "LiquidGlassBottomAccessory",
  "LiquidGlassInspectorPanel",
  "LiquidGlassSegmentedControl",
  "LiquidGlassSearchField",
  "LiquidGlassSearchTab",
  "LiquidGlassAdaptiveSheet",
  "LiquidGlassPopoverMenu",
  "LiquidGlassButtonStyle",
  "LiquidGlassControlGroup",
  "LiquidGlassBadgeCluster",
  "LiquidGlassCarouselRail",
  "LiquidGlassMediaControls",
  "LiquidGlassNowPlayingBar",
  "LiquidGlassPhotoInspector",
  "LiquidGlassMapControls",
  "LiquidGlassCommandSurface",
  "LiquidGlassShowcase",
];

const entries = rootExports.map((entry) => {
  const relativeSource = entry.sourceFile
    ? path.relative(root, entry.sourceFile)
    : null;
  const declarationPath = declarationPathForSource(entry.sourceFile);
  const sourceExists = Boolean(entry.sourceFile);
  const declarationExists = Boolean(
    declarationPath && fs.existsSync(declarationPath)
  );
  const inventoryMatch =
    [...candidateNames(entry.exportName, relativeSource)]
      .map((name) => inventoryByName.get(name))
      .find(Boolean) || null;
  const nonVisualReason = nonVisualPublicExports.get(entry.exportName) || null;
  const isComponentLike =
    entry.kind === "value" &&
    /^[A-Z]/.test(entry.exportName) &&
    relativeSource &&
    /(^|\/)(components|primitives|client|theme|contexts)\//.test(
      relativeSource
    ) &&
    !nonVisualReason;

  return {
    exportName: entry.exportName,
    importedName: entry.importedName,
    kind: entry.kind,
    isAlias: entry.isAlias,
    isComponentLike,
    nonVisualReason,
    specifier: entry.specifier,
    sourcePath: relativeSource,
    sourceExists,
    declarationPath: declarationPath
      ? path.relative(root, declarationPath)
      : null,
    declarationExists,
    inventoryName: inventoryMatch ? inventoryMatch.name : null,
    hasInventoryEntry: Boolean(inventoryMatch),
    hasLegacyUpgradeInventoryAllowance:
      legacyUpgradeInventoryAllowances.includes(entry.exportName),
    hasDirectStory: hasDirectMatch(
      storyNameSet,
      entry.exportName,
      relativeSource
    ),
    hasDirectTest: hasDirectMatch(
      testNameSet,
      entry.exportName,
      relativeSource
    ),
    hasDirectDocs: hasDirectMatch(
      docsNameSet,
      entry.exportName,
      relativeSource
    ),
  };
});

const componentEntries = entries.filter((entry) => entry.isComponentLike);
const componentEntryByName = new Map(
  componentEntries.map((entry) => [entry.exportName, entry])
);

const toCoverageId = (name, fallbackIndex) => {
  const base = String(name)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .toLowerCase()
    .replace(/^-+|-+$/g, "");
  return `${base}${fallbackIndex === undefined ? "" : `-${fallbackIndex}`}`;
};

const coverageIdOccurrences = new Map();
const classifyVisualTarget = (entry) => {
  const aliasOf = publicVisualAliases.get(entry.exportName) || null;
  if (aliasOf) {
    return {
      classification: componentEntryByName.has(aliasOf) ? "alias" : "unclassified",
      canonicalExportName: componentEntryByName.has(aliasOf) ? aliasOf : null,
      aliasOf: componentEntryByName.has(aliasOf) ? aliasOf : null,
      coveredBy: null,
      reason: componentEntryByName.has(aliasOf)
        ? `Compatibility alias of the public ${aliasOf} visual export; this alias keeps independent symbol-level evidence.`
        : `Alias target ${aliasOf} is not a current component-like public export.`,
    };
  }

  const coveredBy = publicVisualCoverageRelationships.get(entry.exportName) || null;
  if (coveredBy) {
    return {
      classification: componentEntryByName.has(coveredBy)
        ? "coveredBy"
        : "unclassified",
      canonicalExportName: componentEntryByName.has(coveredBy) ? coveredBy : null,
      aliasOf: null,
      coveredBy: componentEntryByName.has(coveredBy) ? coveredBy : null,
      reason: componentEntryByName.has(coveredBy)
        ? `Non-DOM public support value demonstrated through ${coveredBy}; this symbol keeps independent coverage evidence.`
        : `Coverage target ${coveredBy} is not a current component-like public export.`,
    };
  }

  if (!entry.isAlias || reviewedCanonicalReexports.has(entry.exportName)) {
    return {
      classification: "canonical",
      canonicalExportName: entry.exportName,
      aliasOf: null,
      coveredBy: null,
      reason: entry.isAlias
        ? "Reviewed public visual identity whose root re-export name is canonical for certification."
        : "Canonical public visual target derived directly from the root value export.",
    };
  }

  return {
    classification: "unclassified",
    canonicalExportName: null,
    aliasOf: null,
    coveredBy: null,
    reason:
      "Root alias syntax has no reviewed canonical, aliasOf, or coveredBy classification.",
  };
};

const visualTargetEntries = componentEntries.map((entry) => {
  const repeat = coverageIdOccurrences.get(entry.exportName) || 0;
  coverageIdOccurrences.set(entry.exportName, repeat + 1);
  const classification = classifyVisualTarget(entry);
  return {
    exportName: entry.exportName,
    sourcePath: entry.sourcePath,
    classification: classification.classification,
    coverageId: toCoverageId(
      entry.exportName,
      repeat > 0 ? repeat + 1 : undefined
    ),
    canonicalExportName: classification.canonicalExportName,
    aliasOf: classification.aliasOf,
    coveredBy: classification.coveredBy,
    reason: classification.reason,
  };
});
const visualTargetByExportName = new Map(
  visualTargetEntries.map((entry) => [entry.exportName, entry])
);
const unclassifiedVisualTargets = visualTargetEntries.filter(
  (entry) => entry.classification === "unclassified"
);
const duplicateCoverageIds = visualTargetEntries.filter(
  (entry, index, all) =>
    all.findIndex((candidate) => candidate.coverageId === entry.coverageId) !==
    index
);
const nonvisualExclusions = entries
  .filter((entry) => entry.nonVisualReason)
  .map(({ exportName, sourcePath, nonVisualReason }) => ({
    exportName,
    sourcePath,
    classification: "nonvisual",
    reason: nonVisualReason,
  }));

for (const entry of entries) {
  const visualTarget = visualTargetByExportName.get(entry.exportName);
  entry.visualTargetClassification = visualTarget?.classification || null;
  entry.visualCoverageId = visualTarget?.coverageId || null;
  entry.canonicalExportName = visualTarget?.canonicalExportName || null;
  entry.aliasOf = visualTarget?.aliasOf || null;
  entry.coveredBy = visualTarget?.coveredBy || null;
}

const issues = {
  missingSource: entries.filter((entry) => !entry.sourceExists),
  missingDeclarations: entries.filter(
    (entry) => entry.kind !== "const" && !entry.declarationExists
  ),
  componentExportsMissingInventory: componentEntries.filter(
    (entry) => !entry.hasInventoryEntry
  ),
  componentExportsMissingDirectStory: componentEntries.filter(
    (entry) => !entry.hasDirectStory
  ),
  componentExportsMissingDirectTest: componentEntries.filter(
    (entry) => !entry.hasDirectTest
  ),
  componentExportsMissingDirectDocs: componentEntries.filter(
    (entry) => !entry.hasDirectDocs
  ),
  unresolvedExportStars: exportStars.filter((entry) => !entry.sourceFile),
  unclassifiedVisualTargets,
  duplicateVisualCoverageIds: duplicateCoverageIds,
};

const summary = {
  generatedAt: new Date().toISOString(),
  rootExportCount: entries.length,
  valueExportCount: entries.filter((entry) => entry.kind === "value").length,
  typeExportCount: entries.filter((entry) => entry.kind === "type").length,
  constExportCount: entries.filter((entry) => entry.kind === "const").length,
  exportStarCount: exportStars.length,
  componentLikeExportCount: componentEntries.length,
  visualTargetCount: visualTargetEntries.length,
  visualCoverageIdentityCount: new Set(
    visualTargetEntries.map((entry) => entry.coverageId)
  ).size,
  canonicalVisualTargetCount: visualTargetEntries.filter(
    (entry) => entry.classification === "canonical"
  ).length,
  aliasVisualTargetCount: visualTargetEntries.filter(
    (entry) => entry.classification === "alias"
  ).length,
  coveredByVisualTargetCount: visualTargetEntries.filter(
    (entry) => entry.classification === "coveredBy"
  ).length,
  unclassifiedVisualTargetCount: unclassifiedVisualTargets.length,
  nonVisualPublicExportCount: entries.filter((entry) => entry.nonVisualReason)
    .length,
  missingSourceCount: issues.missingSource.length,
  missingDeclarationCount: issues.missingDeclarations.length,
  componentExportsMissingInventoryCount:
    issues.componentExportsMissingInventory.length,
  historicalInventoryEntryCount: inventory.components.length,
  legacyUpgradeInventoryAllowanceCount: componentEntries.filter(
    (entry) =>
      !entry.hasInventoryEntry && entry.hasLegacyUpgradeInventoryAllowance
  ).length,
  componentExportsMissingDirectStoryCount:
    issues.componentExportsMissingDirectStory.length,
  componentExportsMissingDirectTestCount:
    issues.componentExportsMissingDirectTest.length,
  componentExportsMissingDirectDocsCount:
    issues.componentExportsMissingDirectDocs.length,
  unresolvedExportStarCount: issues.unresolvedExportStars.length,
};

const report = {
  objective:
    "Audit the src/index.ts public export surface against source, declarations, the frozen historical inventory, Storybook, tests, documentation, and the current visual-target manifest.",
  summary,
  inputs: {
    rootIndex: "src/index.ts",
    historicalComponentInventory: "reports/component_inventory.json",
  },
  visualTargetManifest: path.relative(root, visualTargetManifestPath),
  exportStars: exportStars.map((entry) => ({
    specifier: entry.specifier,
    sourcePath: entry.sourceFile ? path.relative(root, entry.sourceFile) : null,
    sourceExists: Boolean(entry.sourceFile),
  })),
  issues,
  entries,
  nonVisualPublicExports: nonvisualExclusions.map(
    ({ exportName, sourcePath, reason }) => ({
      exportName,
      sourcePath,
      reason,
    })
  ),
  legacyUpgradeInventoryAllowances: legacyUpgradeInventoryAllowances.map(
    (exportName) => ({
      exportName,
      exported: entries.some((entry) => entry.exportName === exportName),
      historicalInventoryEntry:
        componentEntryByName.get(exportName)?.hasInventoryEntry || false,
    })
  ),
};

const visualTargetManifest = {
  schemaVersion: 1,
  generatedAt: summary.generatedAt,
  objective:
    "Classify every current component-like public export as a canonical visual target, compatibility alias, or support value covered through another public visual target without reducing symbol-level screenshot coverage.",
  inputs: {
    publicExportAudit: path.relative(root, reportJsonPath),
    rootIndex: "src/index.ts",
    historicalComponentInventory: "reports/component_inventory.json",
  },
  summary: {
    publicVisualExportCount: visualTargetEntries.length,
    coverageIdentityCount: summary.visualCoverageIdentityCount,
    canonicalCount: summary.canonicalVisualTargetCount,
    aliasCount: summary.aliasVisualTargetCount,
    coveredByCount: summary.coveredByVisualTargetCount,
    unclassifiedCount: summary.unclassifiedVisualTargetCount,
    nonvisualExclusionCount: nonvisualExclusions.length,
    historicalInventoryEntryCount: inventory.components.length,
    publicVisualExportsOutsideHistoricalInventoryCount:
      issues.componentExportsMissingInventory.length,
    legacyUpgradeInventoryAllowanceCount:
      summary.legacyUpgradeInventoryAllowanceCount,
  },
  entries: visualTargetEntries,
  nonvisualExclusions,
};

fs.mkdirSync(path.dirname(reportJsonPath), { recursive: true });
fs.writeFileSync(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(
  visualTargetManifestPath,
  `${JSON.stringify(visualTargetManifest, null, 2)}\n`
);

const formatList = (list, limit = 20) => {
  if (list.length === 0) return "- None\n";
  return list
    .slice(0, limit)
    .map(
      (entry) =>
        `- ${entry.exportName || entry.specifier} (${entry.sourcePath || entry.specifier || "unknown source"})`
    )
    .join("\n")
    .concat(
      list.length > limit ? `\n- ... ${list.length - limit} more\n` : "\n"
    );
};

const markdown = `# Public Export Audit

Generated: ${summary.generatedAt}

## Summary

- Root named exports: ${summary.rootExportCount}
- Value exports: ${summary.valueExportCount}
- Type exports: ${summary.typeExportCount}
- Const exports: ${summary.constExportCount}
- Export-star declarations: ${summary.exportStarCount}
- Component-like value exports: ${summary.componentLikeExportCount}
- Current visual-target manifest entries: ${summary.visualTargetCount}
- Unique symbol-level coverage identities: ${summary.visualCoverageIdentityCount}
- Visual classifications (canonical / alias / coveredBy / unclassified): ${summary.canonicalVisualTargetCount} / ${summary.aliasVisualTargetCount} / ${summary.coveredByVisualTargetCount} / ${summary.unclassifiedVisualTargetCount}
- Explicitly classified nonvisual public exports: ${summary.nonVisualPublicExportCount}
- Missing source files: ${summary.missingSourceCount}
- Missing declaration files: ${summary.missingDeclarationCount}
- Frozen historical inventory entries: ${summary.historicalInventoryEntryCount}
- Current visual exports outside the frozen historical inventory: ${summary.componentExportsMissingInventoryCount}
- Of those, names formerly hidden by the legacy upgrade allowance: ${summary.legacyUpgradeInventoryAllowanceCount}
- Component-like exports missing direct Storybook stories: ${summary.componentExportsMissingDirectStoryCount}
- Component-like exports missing direct unit tests: ${summary.componentExportsMissingDirectTestCount}
- Component-like exports missing direct docs: ${summary.componentExportsMissingDirectDocsCount}
- Unresolved export-star declarations: ${summary.unresolvedExportStarCount}

## Missing Source Files

${formatList(issues.missingSource)}
## Missing Declaration Files

${formatList(issues.missingDeclarations)}
## Current Visual Exports Outside the Frozen Historical Inventory

${formatList(issues.componentExportsMissingInventory)}
## Unclassified Visual Targets

${formatList(issues.unclassifiedVisualTargets)}
## Component-Like Exports Missing Direct Storybook Stories

${formatList(issues.componentExportsMissingDirectStory)}
## Component-Like Exports Missing Direct Unit Tests

${formatList(issues.componentExportsMissingDirectTest)}
## Component-Like Exports Missing Direct Docs

${formatList(issues.componentExportsMissingDirectDocs)}
## Nonvisual Public Exports

${formatList(
  entries
    .filter((entry) => entry.nonVisualReason)
    .map((entry) => ({
      ...entry,
      exportName: `${entry.exportName}: ${entry.nonVisualReason}`,
    }))
)}
## Legacy Upgrade Inventory Allowances (Reconciliation Only)

These names were previously counted as if they were inventory entries. They remain current visual targets, but do not mutate or bypass the frozen 356-entry historical inventory.

${legacyUpgradeInventoryAllowances
  .map((exportName) => {
    const entry = componentEntryByName.get(exportName);
    return `- ${exportName}: ${entry ? "current public visual target" : "not currently exported"}; historical inventory entry: ${entry?.hasInventoryEntry ? "yes" : "no"}`;
  })
  .join("\n")}
`;

fs.writeFileSync(reportMdPath, markdown);

console.log(
  `Public export audit written to ${path.relative(root, reportJsonPath)}`
);
console.log(`Markdown summary written to ${path.relative(root, reportMdPath)}`);
console.log(
  `Visual target manifest written to ${path.relative(root, visualTargetManifestPath)}`
);
console.log(JSON.stringify(summary, null, 2));

if (
  summary.missingSourceCount > 0 ||
  summary.missingDeclarationCount > 0 ||
  summary.unclassifiedVisualTargetCount > 0 ||
  summary.visualCoverageIdentityCount !== summary.visualTargetCount ||
  duplicateCoverageIds.length > 0
) {
  process.exit(1);
}
