#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const publicExportReportPath = path.join(root, 'reports/public-export-audit.json');
const reportJsonPath = path.join(root, 'reports/api-surface-audit.json');
const reportMdPath = path.join(root, 'reports/api-surface-audit.md');

const read = (filePath) => fs.readFileSync(filePath, 'utf8');

if (!fs.existsSync(publicExportReportPath)) {
  console.error('Missing reports/public-export-audit.json. Run npm run audit:exports first.');
  process.exit(1);
}

const stripComments = (source) =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');

const countMatches = (source, regex) => {
  const matches = source.match(regex);
  return matches ? matches.length : 0;
};

const issueLines = (filePath, regex, limit = 20) => {
  if (!filePath || !fs.existsSync(filePath)) return [];
  return stripComments(read(filePath))
    .split(/\r?\n/)
    .map((line, index) => ({ line: index + 1, text: line.trim() }))
    .filter((entry) => regex.test(entry.text))
    .slice(0, limit);
};

const publicExportReport = JSON.parse(read(publicExportReportPath));
const entries = publicExportReport.entries || [];

const sourcePaths = [
  ...new Set(
    entries
      .map((entry) => entry.sourcePath)
      .filter(Boolean)
      .map((relativePath) => path.join(root, relativePath))
  ),
].filter((filePath) => fs.existsSync(filePath));

const declarationPaths = [
  ...new Set(
    entries
      .map((entry) => entry.declarationPath)
      .filter(Boolean)
      .map((relativePath) => path.join(root, relativePath))
  ),
].filter((filePath) => fs.existsSync(filePath));

const countAnyInFile = (filePath) =>
  countMatches(stripComments(read(filePath)), /\bany\b/g);

const sourceAnyFiles = sourcePaths
  .map((filePath) => ({
    filePath: path.relative(root, filePath),
    anyCount: countAnyInFile(filePath),
    samples: issueLines(filePath, /\bany\b/g, 5),
  }))
  .filter((entry) => entry.anyCount > 0)
  .sort((a, b) => b.anyCount - a.anyCount || a.filePath.localeCompare(b.filePath));

const declarationAnyFiles = declarationPaths
  .map((filePath) => ({
    filePath: path.relative(root, filePath),
    anyCount: countAnyInFile(filePath),
    samples: issueLines(filePath, /\bany\b/g, 5),
  }))
  .filter((entry) => entry.anyCount > 0)
  .sort((a, b) => b.anyCount - a.anyCount || a.filePath.localeCompare(b.filePath));

const forwardRefBySourcePath = new Map(
  sourcePaths.map((filePath) => {
    const source = stripComments(read(filePath));
    return [
      path.relative(root, filePath),
      /\bforwardRef\b|React\.forwardRef\b|ForwardRefExoticComponent\b/.test(source),
    ];
  })
);

const declarationForwardRefByPath = new Map(
  declarationPaths.map((filePath) => {
    const declaration = stripComments(read(filePath));
    return [
      path.relative(root, filePath),
      /ForwardRefExoticComponent|RefAttributes|ref\?:/.test(declaration),
    ];
  })
);

const providerOrSupportExport = (entry) =>
  /(Provider|Context|Boundary|Plugin|Engine)$/.test(entry.exportName) ||
  /(^|\/)(contexts|theme|client)\//.test(entry.sourcePath || '') ||
  /\/plugins\//.test(entry.sourcePath || '');

const refAuditEntries = entries
  .filter(
    (entry) =>
      entry.kind === 'value' &&
      entry.isComponentLike &&
      /^[A-Z]/.test(entry.exportName) &&
      entry.sourcePath
  )
  .map((entry) => ({
    exportName: entry.exportName,
    sourcePath: entry.sourcePath,
    declarationPath: entry.declarationPath,
    supportExport: providerOrSupportExport(entry),
    hasForwardRefSignal:
      forwardRefBySourcePath.get(entry.sourcePath) ||
      declarationForwardRefByPath.get(entry.declarationPath),
  }));

const componentRefFollowups = refAuditEntries
  .filter((entry) => !entry.supportExport && !entry.hasForwardRefSignal)
  .sort((a, b) => a.sourcePath.localeCompare(b.sourcePath) || a.exportName.localeCompare(b.exportName));

const supportRefFollowups = refAuditEntries
  .filter((entry) => entry.supportExport && !entry.hasForwardRefSignal)
  .sort((a, b) => a.sourcePath.localeCompare(b.sourcePath) || a.exportName.localeCompare(b.exportName));

const declarationFilesMissingReactTypes = declarationPaths
  .map((filePath) => {
    const declaration = read(filePath);
    const referencesReactTypes = /\bReact\.|import\(["']react["']\)|from ["']react["']/.test(declaration);
    const usesDomProps = /\b(HTMLAttributes|ButtonHTMLAttributes|InputHTMLAttributes|TextareaHTMLAttributes|ComponentProps|CSSProperties)\b/.test(
      declaration
    );
    return {
      filePath: path.relative(root, filePath),
      referencesReactTypes,
      usesDomProps,
    };
  })
  .filter((entry) => entry.usesDomProps && !entry.referencesReactTypes);

const summary = {
  generatedAt: new Date().toISOString(),
  publicExportCount: entries.length,
  publicSourceFileCount: sourcePaths.length,
  publicDeclarationFileCount: declarationPaths.length,
  sourceFilesWithAnyCount: sourceAnyFiles.length,
  sourceAnyCount: sourceAnyFiles.reduce((sum, entry) => sum + entry.anyCount, 0),
  declarationFilesWithAnyCount: declarationAnyFiles.length,
  declarationAnyCount: declarationAnyFiles.reduce((sum, entry) => sum + entry.anyCount, 0),
  componentLikeValueExportCount: refAuditEntries.length,
  componentRefFollowupCount: componentRefFollowups.length,
  supportRefFollowupCount: supportRefFollowups.length,
  declarationFilesMissingReactTypeReferenceCount:
    declarationFilesMissingReactTypes.length,
};

const report = {
  objective:
    'Audit public API declaration quality, explicit any usage, and likely ref-forwarding follow-ups for root public exports.',
  inputs: {
    publicExportAudit: 'reports/public-export-audit.json',
  },
  summary,
  sourceAnyFiles,
  declarationAnyFiles,
  componentRefFollowups,
  supportRefFollowups,
  declarationFilesMissingReactTypes,
};

const formatAnyFiles = (files, limit = 30) => {
  if (files.length === 0) return '- None\n';
  return files
    .slice(0, limit)
    .map((entry) => `- ${entry.filePath}: ${entry.anyCount}`)
    .join('\n')
    .concat(files.length > limit ? `\n- ... ${files.length - limit} more\n` : '\n');
};

const formatRefList = (files, limit = 40) => {
  if (files.length === 0) return '- None\n';
  return files
    .slice(0, limit)
    .map((entry) => `- ${entry.exportName} (${entry.sourcePath})`)
    .join('\n')
    .concat(files.length > limit ? `\n- ... ${files.length - limit} more\n` : '\n');
};

const markdown = `# API Surface Audit

Generated: ${summary.generatedAt}

## Summary

- Public root exports audited: ${summary.publicExportCount}
- Public source files audited: ${summary.publicSourceFileCount}
- Public declaration files audited: ${summary.publicDeclarationFileCount}
- Public source files with explicit \`any\`: ${summary.sourceFilesWithAnyCount}
- Public source explicit \`any\` count: ${summary.sourceAnyCount}
- Public declaration files with explicit \`any\`: ${summary.declarationFilesWithAnyCount}
- Public declaration explicit \`any\` count: ${summary.declarationAnyCount}
- Component-like value exports checked for ref signals: ${summary.componentLikeValueExportCount}
- Non-support component exports needing ref-forwarding review: ${summary.componentRefFollowupCount}
- Provider/support exports needing intentional no-ref review: ${summary.supportRefFollowupCount}
- Declaration files missing React type references: ${summary.declarationFilesMissingReactTypeReferenceCount}

## Public Declaration Files With \`any\`

${formatAnyFiles(declarationAnyFiles)}
## Public Source Files With \`any\`

${formatAnyFiles(sourceAnyFiles)}
## Component Ref Follow-Ups

${formatRefList(componentRefFollowups)}
## Provider/Support Ref Follow-Ups

${formatRefList(supportRefFollowups)}
`;

fs.mkdirSync(path.dirname(reportJsonPath), { recursive: true });
fs.writeFileSync(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(reportMdPath, markdown);

console.log(`API surface audit written to ${path.relative(root, reportJsonPath)}`);
console.log(`Markdown summary written to ${path.relative(root, reportMdPath)}`);
console.log(JSON.stringify(summary, null, 2));

if (summary.publicExportCount === 0 || summary.publicDeclarationFileCount === 0) {
  process.exit(1);
}
