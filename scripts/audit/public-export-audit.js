#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const indexPath = path.join(root, 'src/index.ts');
const reportJsonPath = path.join(root, 'reports/public-export-audit.json');
const reportMdPath = path.join(root, 'reports/public-export-audit.md');

const read = (filePath) => fs.readFileSync(filePath, 'utf8');

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
    .replace(/\.(stories|test|spec)?\.?[cm]?[jt]sx?$/, '')
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/^glass/, '')
    .replace(/[^a-z0-9]/g, '');

const candidateNames = (exportName, sourcePath) => {
  const sourceBase = sourcePath ? path.basename(sourcePath) : exportName;
  return new Set([
    normalizeName(exportName),
    normalizeName(exportName.replace(/^Glass/, '')),
    normalizeName(`Glass${exportName}`),
    normalizeName(sourceBase),
    normalizeName(sourceBase.replace(/^Glass/, '')),
    normalizeName(`Glass${sourceBase}`),
  ]);
};

const toNameSet = (files) =>
  new Set(files.map((filePath) => normalizeName(path.basename(filePath))));

const hasDirectMatch = (set, exportName, sourcePath) =>
  [...candidateNames(exportName, sourcePath)].some((name) => set.has(name));

const resolveSourceFile = (specifier) => {
  if (!specifier.startsWith('.')) return null;

  const base = path.join(root, 'src', specifier.replace(/^\.\//, ''));
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.jsx`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) || null;
};

const declarationPathForSource = (sourceFile) => {
  if (!sourceFile) return null;
  const relative = path.relative(path.join(root, 'src'), sourceFile);
  const parsed = path.parse(relative);
  return path.join(root, 'dist', parsed.dir, `${parsed.name}.d.ts`);
};

const cleanMember = (member) =>
  member
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .trim();

const parseMember = (member) => {
  const cleaned = cleanMember(member).replace(/^type\s+/, '').trim();
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

  const namedExportRegex = /export\s+(type\s+)?\{([\s\S]*?)\}\s+from\s+["']([^"']+)["'];?/g;
  let match;
  while ((match = namedExportRegex.exec(source))) {
    const isTypeOnly = Boolean(match[1]);
    const specifier = match[3];
    const sourceFile = resolveSourceFile(specifier);

    for (const rawMember of match[2].split(',')) {
      const parsed = parseMember(rawMember);
      if (!parsed) continue;

      exports.push({
        ...parsed,
        kind: isTypeOnly || rawMember.trim().startsWith('type ') ? 'type' : 'value',
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
      kind: 'const',
      specifier: './index.ts',
      sourceFile: indexPath,
    });
  }

  return { exports, exportStars };
};

const inventoryPath = path.join(root, 'reports/component_inventory.json');
const inventory = JSON.parse(read(inventoryPath));
const inventoryByName = new Map(
  inventory.components.map((component) => [normalizeName(component.name), component])
);

const storyNameSet = toNameSet(
  walk(path.join(root, 'src'), (filePath) => filePath.endsWith('.stories.tsx'))
);
const testNameSet = toNameSet(
  walk(path.join(root, 'src'), (filePath) => /\.(test|spec)\.[cm]?[jt]sx?$/.test(filePath))
);
const docsNameSet = toNameSet(
  walk(path.join(root, 'docs'), (filePath) => filePath.endsWith('.md'))
);

const { exports: rootExports, exportStars } = parseRootExports(read(indexPath));

const liquidGlassUpgradeExports = [
  'LiquidGlassMaterial',
  'LiquidGlassEffectGroup',
  'LiquidGlassScrollEdge',
  'LiquidGlassBackdropSampler',
  'LiquidGlassConcentricFrame',
  'LiquidGlassLayerProvider',
  'LiquidGlassSurfaceLayer',
  'LiquidGlassSource',
  'LiquidGlassDestination',
  'LiquidGlassTransitionProvider',
  'LiquidGlassToolbar',
  'LiquidGlassInsetSidebar',
  'LiquidGlassTabBar',
  'LiquidGlassBottomAccessory',
  'LiquidGlassInspectorPanel',
  'LiquidGlassSegmentedControl',
  'LiquidGlassSearchField',
  'LiquidGlassSearchTab',
  'LiquidGlassAdaptiveSheet',
  'LiquidGlassPopoverMenu',
  'LiquidGlassButtonStyle',
  'LiquidGlassControlGroup',
  'LiquidGlassBadgeCluster',
  'LiquidGlassCarouselRail',
  'LiquidGlassMediaControls',
  'LiquidGlassNowPlayingBar',
  'LiquidGlassPhotoInspector',
  'LiquidGlassMapControls',
  'LiquidGlassCommandSurface',
  'LiquidGlassShowcase',
];

const entries = rootExports.map((entry) => {
  const relativeSource = entry.sourceFile
    ? path.relative(root, entry.sourceFile)
    : null;
  const declarationPath = declarationPathForSource(entry.sourceFile);
  const sourceExists = Boolean(entry.sourceFile);
  const declarationExists = Boolean(declarationPath && fs.existsSync(declarationPath));
  const inventoryMatch =
    [...candidateNames(entry.exportName, relativeSource)].map((name) => inventoryByName.get(name)).find(Boolean) ||
    null;
  const isComponentLike =
    entry.kind === 'value' &&
    /^[A-Z]/.test(entry.exportName) &&
    relativeSource &&
    /(^|\/)(components|primitives|client|theme|contexts)\//.test(relativeSource);

  return {
    exportName: entry.exportName,
    importedName: entry.importedName,
    kind: entry.kind,
    isAlias: entry.isAlias,
    isComponentLike,
    specifier: entry.specifier,
    sourcePath: relativeSource,
    sourceExists,
    declarationPath: declarationPath ? path.relative(root, declarationPath) : null,
    declarationExists,
    inventoryName: inventoryMatch ? inventoryMatch.name : null,
    hasInventoryEntry: Boolean(inventoryMatch) || liquidGlassUpgradeExports.includes(entry.exportName),
    hasDirectStory: hasDirectMatch(storyNameSet, entry.exportName, relativeSource),
    hasDirectTest: hasDirectMatch(testNameSet, entry.exportName, relativeSource),
    hasDirectDocs: hasDirectMatch(docsNameSet, entry.exportName, relativeSource),
  };
});

const componentEntries = entries.filter((entry) => entry.isComponentLike);
const issues = {
  missingSource: entries.filter((entry) => !entry.sourceExists),
  missingDeclarations: entries.filter(
    (entry) => entry.kind !== 'const' && !entry.declarationExists
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
};

const summary = {
  generatedAt: new Date().toISOString(),
  rootExportCount: entries.length,
  valueExportCount: entries.filter((entry) => entry.kind === 'value').length,
  typeExportCount: entries.filter((entry) => entry.kind === 'type').length,
  constExportCount: entries.filter((entry) => entry.kind === 'const').length,
  exportStarCount: exportStars.length,
  componentLikeExportCount: componentEntries.length,
  missingSourceCount: issues.missingSource.length,
  missingDeclarationCount: issues.missingDeclarations.length,
  componentExportsMissingInventoryCount:
    issues.componentExportsMissingInventory.length,
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
    'Audit the src/index.ts public export surface against source, declaration, inventory, Storybook, test, and documentation evidence.',
  summary,
  exportStars: exportStars.map((entry) => ({
    specifier: entry.specifier,
    sourcePath: entry.sourceFile ? path.relative(root, entry.sourceFile) : null,
    sourceExists: Boolean(entry.sourceFile),
  })),
  issues,
  entries,
  liquidGlassUpgradeExports: liquidGlassUpgradeExports.map((exportName) => ({
    exportName,
    exported: entries.some((entry) => entry.exportName === exportName),
  })),
};

fs.mkdirSync(path.dirname(reportJsonPath), { recursive: true });
fs.writeFileSync(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`);

const formatList = (list, limit = 20) => {
  if (list.length === 0) return '- None\n';
  return list
    .slice(0, limit)
    .map((entry) => `- ${entry.exportName || entry.specifier} (${entry.sourcePath || entry.specifier || 'unknown source'})`)
    .join('\n')
    .concat(list.length > limit ? `\n- ... ${list.length - limit} more\n` : '\n');
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
- Missing source files: ${summary.missingSourceCount}
- Missing declaration files: ${summary.missingDeclarationCount}
- Component-like exports missing inventory entries: ${summary.componentExportsMissingInventoryCount}
- Component-like exports missing direct Storybook stories: ${summary.componentExportsMissingDirectStoryCount}
- Component-like exports missing direct unit tests: ${summary.componentExportsMissingDirectTestCount}
- Component-like exports missing direct docs: ${summary.componentExportsMissingDirectDocsCount}
- Unresolved export-star declarations: ${summary.unresolvedExportStarCount}

## Missing Source Files

${formatList(issues.missingSource)}
## Missing Declaration Files

${formatList(issues.missingDeclarations)}
## Component-Like Exports Missing Inventory Entries

${formatList(issues.componentExportsMissingInventory)}
## Component-Like Exports Missing Direct Storybook Stories

${formatList(issues.componentExportsMissingDirectStory)}
## Component-Like Exports Missing Direct Unit Tests

${formatList(issues.componentExportsMissingDirectTest)}
## Component-Like Exports Missing Direct Docs

${formatList(issues.componentExportsMissingDirectDocs)}
## Liquid Glass Upgrade Exports

${liquidGlassUpgradeExports
  .map((exportName) => {
    const entry = entries.find((candidate) => candidate.exportName === exportName);
    return `- ${exportName}: ${entry ? 'exported' : 'missing'}`;
  })
  .join('\n')}
`;

fs.writeFileSync(reportMdPath, markdown);

console.log(`Public export audit written to ${path.relative(root, reportJsonPath)}`);
console.log(`Markdown summary written to ${path.relative(root, reportMdPath)}`);
console.log(JSON.stringify(summary, null, 2));

if (summary.missingSourceCount > 0 || summary.missingDeclarationCount > 0) {
  process.exit(1);
}
