#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const srcRoot = path.join(root, 'src');
const reportJsonPath = path.join(root, 'reports/runtime-cleanliness-audit.json');
const reportMdPath = path.join(root, 'reports/runtime-cleanliness-audit.md');

const issuePatterns = [
  { key: 'console.log', regex: /\bconsole\.log\b/g },
  { key: 'console.debug', regex: /\bconsole\.debug\b/g },
  { key: 'console.info', regex: /\bconsole\.info\b/g },
  { key: 'console.warn', regex: /\bconsole\.warn\b/g },
  { key: 'console.error', regex: /\bconsole\.error\b/g },
  { key: 'console.trace', regex: /\bconsole\.trace\b/g },
  { key: 'debugger', regex: /\bdebugger\b/g },
  { key: 'TODO', regex: /\bTODO\b/g },
  { key: 'FIXME', regex: /\bFIXME\b/g },
  { key: 'XXX', regex: /\bXXX\b/g },
];

const excludedPathParts = [
  `${path.sep}__snapshots__${path.sep}`,
  `${path.sep}docs${path.sep}`,
  `${path.sep}scripts${path.sep}`,
];

const excludedBasenames = new Set([
  'testSetup.ts',
  'testSetup.tsx',
  'testingUtils.ts',
  'testingUtils.tsx',
]);

const shouldScanFile = (filePath) => {
  if (!/\.[cm]?[jt]sx?$/.test(filePath)) return false;
  if (/\.(stories|test|spec)\.[cm]?[jt]sx?$/.test(filePath)) return false;
  if (excludedBasenames.has(path.basename(filePath))) return false;
  return !excludedPathParts.some((part) => filePath.includes(part));
};

const walk = (dir, out = []) => {
  if (!fs.existsSync(dir)) return out;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, out);
      continue;
    }
    if (shouldScanFile(fullPath)) out.push(fullPath);
  }

  return out;
};

const sourceFiles = walk(srcRoot);
const findings = [];

for (const filePath of sourceFiles) {
  const relativePath = path.relative(root, filePath);
  const source = fs.readFileSync(filePath, 'utf8');
  const lines = source.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const pattern of issuePatterns) {
      const matches = line.match(pattern.regex);
      if (!matches) continue;

      for (const match of matches) {
        findings.push({
          kind: pattern.key,
          filePath: relativePath,
          line: index + 1,
          excerpt: line.trim().slice(0, 220),
        });
      }
    }
  });
}

const countBy = (values, keyForValue) => {
  const counts = new Map();
  for (const value of values) {
    const key = keyForValue(value);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return Object.fromEntries(
    [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  );
};

const consoleFindings = findings.filter((finding) => finding.kind.startsWith('console.'));
const todoFindings = findings.filter((finding) => ['TODO', 'FIXME', 'XXX'].includes(finding.kind));
const debuggerFindings = findings.filter((finding) => finding.kind === 'debugger');

const summary = {
  generatedAt: new Date().toISOString(),
  scannedRoot: 'src',
  scannedFileCount: sourceFiles.length,
  findingCount: findings.length,
  fileWithFindingsCount: new Set(findings.map((finding) => finding.filePath)).size,
  consoleFindingCount: consoleFindings.length,
  todoFindingCount: todoFindings.length,
  debuggerFindingCount: debuggerFindings.length,
  countsByKind: countBy(findings, (finding) => finding.kind),
};

const report = {
  objective:
    'Audit production-source runtime cleanliness for console calls, debugger statements, and TODO/FIXME/XXX markers.',
  summary,
  exclusions: {
    fileGlobs: [
      '*.stories.*',
      '*.test.*',
      '*.spec.*',
      '**/__snapshots__/**',
      'src/docs/**',
      'src/scripts/**',
    ],
    basenames: [...excludedBasenames].sort(),
  },
  findings,
};

const formatFindings = (list, limit = 40) => {
  if (list.length === 0) return '- None\n';
  return list
    .slice(0, limit)
    .map(
      (finding) =>
        `- ${finding.kind}: ${finding.filePath}:${finding.line} - ${finding.excerpt}`
    )
    .join('\n')
    .concat(list.length > limit ? `\n- ... ${list.length - limit} more\n` : '\n');
};

const markdown = `# Runtime Cleanliness Audit

Generated: ${summary.generatedAt}

## Summary

- Scanned root: ${summary.scannedRoot}
- Scanned files: ${summary.scannedFileCount}
- Files with findings: ${summary.fileWithFindingsCount}
- Total findings: ${summary.findingCount}
- Console findings: ${summary.consoleFindingCount}
- TODO/FIXME/XXX findings: ${summary.todoFindingCount}
- Debugger findings: ${summary.debuggerFindingCount}

## Counts By Kind

${Object.entries(summary.countsByKind)
  .map(([kind, count]) => `- ${kind}: ${count}`)
  .join('\n')}

## Debugger Findings

${formatFindings(debuggerFindings)}
## Console Findings

${formatFindings(consoleFindings)}
## TODO/FIXME/XXX Findings

${formatFindings(todoFindings)}
`;

fs.mkdirSync(path.dirname(reportJsonPath), { recursive: true });
fs.writeFileSync(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(reportMdPath, markdown);

console.log(`Runtime cleanliness audit written to ${path.relative(root, reportJsonPath)}`);
console.log(`Markdown summary written to ${path.relative(root, reportMdPath)}`);
console.log(JSON.stringify(summary, null, 2));

if (summary.debuggerFindingCount > 0) {
  process.exit(1);
}
