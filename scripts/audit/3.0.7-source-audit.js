#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const srcRoot = path.join(root, 'src');
const reportJsonPath = path.join(root, 'reports/3.0.7-source-audit.json');
const reportMdPath = path.join(root, 'reports/3.0.7-source-audit.md');
const strict = process.argv.includes('--strict');

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
  if (/\.(test|spec)\.[cm]?[jt]sx?$/.test(filePath)) return false;
  if (filePath.endsWith('.stories.tsx') || filePath.endsWith('.stories.ts')) return false;
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

const stripBlockComments = (source) => source.replace(/\/\*[\s\S]*?\*\//g, '');

const lineContext = (lines, index, radius = 6) => {
  const start = Math.max(0, index - radius);
  const end = Math.min(lines.length, index + radius + 1);
  return lines.slice(start, end).join('\n');
};

const makeFinding = ({ issue, kind, filePath, line, excerpt, severity, note }) => ({
  issue,
  kind,
  filePath,
  line,
  excerpt: excerpt.trim().slice(0, 240),
  severity,
  note,
});

const patterns = {
  b14: /\b(readPixels|getImageData|toDataURL|readRenderTargetPixels|preserveDrawingBuffer)\b/g,
  b15: /\b(score gloss|debug|stats|fps|score)\b/gi,
  colorInput: /type\s*=\s*["']color["']|type\s*=\s*\{\s*["']color["']\s*\}/,
  directVarColorValue: /value\s*=\s*(?:["']var\(|\{[^}\n]*var\()/,
};

const perFrameSignals = [
  'requestAnimationFrame',
  'useFrame',
  'setAnimationLoop',
  'setInterval',
  'animationLoop',
  'animate(',
];

const sourceFiles = walk(srcRoot).sort();
const findings = [];
const colorInputSites = [];

for (const absolutePath of sourceFiles) {
  const filePath = path.relative(root, absolutePath);
  const source = stripBlockComments(fs.readFileSync(absolutePath, 'utf8'));
  const lines = source.split(/\r?\n/);

  lines.forEach((lineText, index) => {
    patterns.b14.lastIndex = 0;
    const b14Matches = [...lineText.matchAll(patterns.b14)];
    for (const match of b14Matches) {
      const context = lineContext(lines, index);
      const perFrameSignal = perFrameSignals.find((signal) => context.includes(signal));
      const kind = match[1];
      const highConfidenceReadback = ['readPixels', 'readRenderTargetPixels'].includes(kind);
      findings.push(
        makeFinding({
          issue: 'B14',
          kind,
          filePath,
          line: index + 1,
          excerpt: lineText,
          severity: highConfidenceReadback || perFrameSignal ? 'review-required' : 'evidence',
          note: perFrameSignal
            ? `Nearby per-frame signal: ${perFrameSignal}`
            : 'Review whether this readback is event-driven, export-only, debug-only, or default-render reachable.',
        })
      );
    }

    patterns.b15.lastIndex = 0;
    const b15Matches = [...lineText.matchAll(patterns.b15)];
    for (const match of b15Matches) {
      const exactLeak = /score gloss/i.test(match[1]);
      const debugPropOrIdentifier = /\b(debug|showDebug|showStats|stats|fps)\b/i.test(lineText);
      findings.push(
        makeFinding({
          issue: 'B15',
          kind: match[1],
          filePath,
          line: index + 1,
          excerpt: lineText,
          severity: exactLeak ? 'fail' : 'evidence',
          note: debugPropOrIdentifier
            ? 'Likely debug/stats API or implementation signal; verify default render gates it.'
            : 'Review for default-visible debug copy.',
        })
      );
    }

    if (patterns.colorInput.test(lineText)) {
      const context = lineContext(lines, index, 4);
      const directVar = patterns.directVarColorValue.test(context);
      const hasValueSignal = /\bvalue\s*=/.test(context);
      colorInputSites.push(
        makeFinding({
          issue: 'B16',
          kind: directVar ? 'color-input-direct-var-value' : 'color-input-site',
          filePath,
          line: index + 1,
          excerpt: lineText,
          severity: directVar ? 'fail' : 'review-required',
          note: hasValueSignal
            ? 'Verify the value expression normalizes to #rrggbb before reaching input[type=color].'
            : 'Color input found; inspect surrounding value/defaultValue handling.',
        })
      );
    }
  });
}

findings.push(...colorInputSites);

const byIssue = (issue) => findings.filter((finding) => finding.issue === issue);
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

const summary = {
  generatedAt: new Date().toISOString(),
  scannedRoot: 'src',
  scannedFileCount: sourceFiles.length,
  findingCount: findings.length,
  b14FindingCount: byIssue('B14').length,
  b15FindingCount: byIssue('B15').length,
  b16FindingCount: byIssue('B16').length,
  failCount: findings.filter((finding) => finding.severity === 'fail').length,
  reviewRequiredCount: findings.filter((finding) => finding.severity === 'review-required').length,
  countsByIssue: countBy(findings, (finding) => finding.issue),
  countsByKind: countBy(findings, (finding) => `${finding.issue}:${finding.kind}`),
};

const report = {
  objective:
    'Source-only 3.0.7 audit for B14 GPU/canvas readback, B15 debug text leakage, and B16 color input value safety.',
  summary,
  strict,
  exclusions: {
    fileGlobs: ['*.stories.*', '*.test.*', '*.spec.*', '**/__snapshots__/**', 'src/docs/**', 'src/scripts/**'],
    basenames: [...excludedBasenames].sort(),
  },
  findings,
};

const formatFindings = (issue, limit = 80) => {
  const issueFindings = byIssue(issue);
  if (issueFindings.length === 0) return '- None\n';

  return issueFindings
    .slice(0, limit)
    .map(
      (finding) =>
        `- ${finding.severity}: ${finding.kind} at ${finding.filePath}:${finding.line} - ${finding.excerpt}`
    )
    .join('\n')
    .concat(issueFindings.length > limit ? `\n- ... ${issueFindings.length - limit} more\n` : '\n');
};

const markdown = `# 3.0.7 Source Audit

Generated: ${summary.generatedAt}

## Summary

- Scanned root: ${summary.scannedRoot}
- Scanned files: ${summary.scannedFileCount}
- Total findings: ${summary.findingCount}
- B14 findings: ${summary.b14FindingCount}
- B15 findings: ${summary.b15FindingCount}
- B16 findings: ${summary.b16FindingCount}
- Fail findings: ${summary.failCount}
- Review-required findings: ${summary.reviewRequiredCount}
- Strict mode: ${strict ? 'yes' : 'no'}

## B14 GPU/Canvas Readback Findings

${formatFindings('B14')}
## B15 Debug Text Findings

${formatFindings('B15')}
## B16 Color Input Findings

${formatFindings('B16')}
## Closure Use

This audit is source evidence only. Each finding still needs a closure-report disposition:

- event-driven/export-only and acceptable,
- debug-only/explicitly gated,
- default-render reachable and fixed,
- false positive with rationale,
- or deferred with owner sign-off.
`;

fs.mkdirSync(path.dirname(reportJsonPath), { recursive: true });
fs.writeFileSync(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(reportMdPath, markdown);

console.log(`3.0.7 source audit written to ${path.relative(root, reportJsonPath)}`);
console.log(`Markdown summary written to ${path.relative(root, reportMdPath)}`);
console.log(JSON.stringify(summary, null, 2));

if (strict && (summary.failCount > 0 || summary.reviewRequiredCount > 0)) {
  process.exit(1);
}
