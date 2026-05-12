#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const srcRoot = path.join(root, 'src');
const reportDir = path.join(root, 'reports/3.1-release');
const reportJsonPath = path.join(reportDir, 'frame-loop-canvas-audit.json');
const reportMdPath = path.join(reportDir, 'frame-loop-canvas-audit.md');
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

const categoryPatterns = {
  frameLoop: [
    /\brequestAnimationFrame\b/g,
    /\bcancelAnimationFrame\b/g,
    /\bsetAnimationLoop\b/g,
    /\buseFrame\s*\(/g,
  ],
  canvas: [
    /<canvas\b/g,
    /\bHTMLCanvasElement\b/g,
    /\bOffscreenCanvas\b/g,
    /\bcreateElement\s*\(\s*["']canvas["']\s*\)/g,
    /\bgetContext\s*\(/g,
  ],
  readback: [
    /\bgetImageData\s*\(/g,
    /\breadPixels\s*\(/g,
    /\breadRenderTargetPixels\s*\(/g,
    /\btoDataURL\s*\(/g,
    /\btoBlob\s*\(/g,
    /\bpreserveDrawingBuffer\b/g,
  ],
  audioAnalyser: [
    /\bAnalyserNode\b/g,
    /\bcreateAnalyser\s*\(/g,
    /\bAudioContext\b/g,
    /\bwebkitAudioContext\b/g,
    /\bgetByteFrequencyData\s*\(/g,
    /\bgetByteTimeDomainData\s*\(/g,
    /\bgetFloatFrequencyData\s*\(/g,
    /\bgetFloatTimeDomainData\s*\(/g,
  ],
  webgl: [
    /\bWebGL(?:2)?RenderingContext\b/g,
    /\bWebGL(?:Program|Shader|Texture|Buffer|UniformLocation)\b/g,
    /\bgetContext\s*\(\s*["']webgl2?["']\s*\)/g,
    /\bgetContext\s*\(\s*["']experimental-webgl["']\s*\)/g,
    /\bthree\b/g,
    /\bTHREE\b/g,
  ],
};

const guardTerms = [
  { term: 'prefersReducedMotion', regex: /\bprefersReducedMotion\b/g },
  { term: 'prefers-reduced-motion', regex: /prefers-reduced-motion/g },
  { term: 'useReducedMotion', regex: /\buseReducedMotion\b/g },
  { term: 'useMotionPreference', regex: /\buseMotionPreference\b/g },
  { term: 'isReducedMotion', regex: /\bisReducedMotion\b/g },
  { term: 'reducedMotion', regex: /\breducedMotion\b/g },
  { term: 'reduceMotion', regex: /\breduceMotion\b/g },
  { term: 'shouldAnimate', regex: /\bshouldAnimate\b/g },
  { term: 'animationEnabled', regex: /\banimationEnabled\b/g },
  { term: 'animationsEnabled', regex: /\banimationsEnabled\b/g },
  { term: 'disableAnimation', regex: /\bdisableAnimations?\b/g },
  { term: 'enableAnimation', regex: /\benableAnimations?\b/g },
  { term: 'isPlaying', regex: /\bisPlaying\b/g },
  { term: 'paused', regex: /\bpaused\b/g },
  { term: 'document.hidden', regex: /\bdocument\.hidden\b/g },
  { term: 'visibilityState', regex: /\bvisibilityState\b/g },
  { term: 'IntersectionObserver', regex: /\bIntersectionObserver\b/g },
  { term: 'isIntersecting', regex: /\bisIntersecting\b/g },
  { term: 'performanceMode', regex: /\bperformanceMode\b/g },
];

const shouldScanFile = (filePath) => {
  if (!/\.[cm]?[jt]sx?$/.test(filePath)) return false;
  if (/\.(test|spec|stories)\.[cm]?[jt]sx?$/.test(filePath)) return false;
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

const stripComments = (source) =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');

const lineForIndex = (source, index) => source.slice(0, index).split(/\r?\n/).length;

const lineText = (source, line) => source.split(/\r?\n/)[line - 1]?.trim().slice(0, 220) || '';

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

const collectMatches = (source, patterns) => {
  const matches = [];

  for (const regex of patterns) {
    regex.lastIndex = 0;
    for (const match of source.matchAll(regex)) {
      matches.push({
        pattern: regex.source,
        token: match[0],
        line: lineForIndex(source, match.index || 0),
      });
    }
  }

  return matches.sort((a, b) => a.line - b.line || a.token.localeCompare(b.token));
};

const collectGuardMatches = (source) =>
  guardTerms
    .map(({ term, regex }) => {
      regex.lastIndex = 0;
      const matches = [...source.matchAll(regex)];
      return matches.length > 0
        ? {
            term,
            count: matches.length,
            firstLine: lineForIndex(source, matches[0].index || 0),
          }
        : null;
    })
    .filter(Boolean);

const sourceFiles = walk(srcRoot).sort();
const filesWithSignals = [];
const findings = [];
const categoryTotals = Object.fromEntries(Object.keys(categoryPatterns).map((category) => [category, 0]));

for (const absolutePath of sourceFiles) {
  const relativePath = path.relative(root, absolutePath);
  const rawSource = fs.readFileSync(absolutePath, 'utf8');
  const source = stripComments(rawSource);
  const categories = {};
  const signals = [];

  for (const [category, patterns] of Object.entries(categoryPatterns)) {
    const matches = collectMatches(source, patterns);
    if (matches.length === 0) continue;

    categories[category] = {
      count: matches.length,
      firstLine: matches[0].line,
      tokens: [...new Set(matches.map((match) => match.token))].sort(),
    };
    categoryTotals[category] += matches.length;

    matches.slice(0, 20).forEach((match) => {
      signals.push({
        category,
        token: match.token,
        line: match.line,
        excerpt: lineText(source, match.line),
      });
    });
  }

  if (Object.keys(categories).length === 0) continue;

  const guardMatches = collectGuardMatches(source);
  const isComponentFile =
    relativePath.startsWith(`src${path.sep}components${path.sep}`) && relativePath.endsWith('.tsx');
  const highCostCategories = ['frameLoop', 'readback', 'audioAnalyser', 'webgl'].filter(
    (category) => categories[category]
  );
  const hasCanvasOnly = categories.canvas && highCostCategories.length === 0;
  const missingGuard = isComponentFile && highCostCategories.length > 0 && guardMatches.length === 0;
  const severity =
    missingGuard || categories.readback
      ? 'review-required'
      : hasCanvasOnly
        ? 'inventory'
        : 'guarded-or-explicit';

  const fileRecord = {
    filePath: relativePath,
    isComponentFile,
    severity,
    categories,
    guardTerms: guardMatches,
    signals,
  };

  filesWithSignals.push(fileRecord);

  if (missingGuard) {
    findings.push({
      severity: 'review-required',
      issue: 'missing-animation-or-motion-guard',
      filePath: relativePath,
      categories: highCostCategories,
      line: Math.min(...highCostCategories.map((category) => categories[category].firstLine)),
      note:
        'Component uses frame-loop, readback, audio analyser, or WebGL signals without obvious reduced-motion or explicit animation guard terms.',
    });
  }

  if (categories.readback) {
    findings.push({
      severity: 'review-required',
      issue: 'canvas-or-gpu-readback-review',
      filePath: relativePath,
      categories: ['readback'],
      line: categories.readback.firstLine,
      note:
        'Readbacks can block rendering if used per-frame. Verify they are user-triggered, export-only, setup-only, or otherwise throttled.',
    });
  }
}

const summary = {
  generatedAt: new Date().toISOString(),
  scannedRoot: 'src',
  scannedFileCount: sourceFiles.length,
  filesWithSignalsCount: filesWithSignals.length,
  componentFilesWithSignalsCount: filesWithSignals.filter((file) => file.isComponentFile).length,
  reviewRequiredFileCount: new Set(findings.map((finding) => finding.filePath)).size,
  findingCount: findings.length,
  strict,
  categoryTotals,
  filesBySeverity: countBy(filesWithSignals, (file) => file.severity),
  findingsByIssue: countBy(findings, (finding) => finding.issue),
};

const report = {
  objective:
    'AuraGlass 3.1 release-candidate audit for frame loops, canvas, readbacks, audio analysers, WebGL, and obvious reduced-motion or animation guard terms.',
  summary,
  strict,
  guardTerms: guardTerms.map(({ term }) => term),
  exclusions: {
    fileGlobs: ['*.stories.*', '*.test.*', '*.spec.*', '**/__snapshots__/**', 'src/docs/**', 'src/scripts/**'],
    basenames: [...excludedBasenames].sort(),
  },
  findings,
  filesWithSignals,
};

const formatCategoryTotals = () =>
  Object.entries(summary.categoryTotals)
    .map(([category, count]) => `- ${category}: ${count}`)
    .join('\n');

const formatFindings = (limit = 80) => {
  if (findings.length === 0) return '- None\n';

  return findings
    .slice(0, limit)
    .map(
      (finding) =>
        `- ${finding.severity}: ${finding.issue} at ${finding.filePath}:${finding.line} (${finding.categories.join(
          ', '
        )}) - ${finding.note}`
    )
    .join('\n')
    .concat(findings.length > limit ? `\n- ... ${findings.length - limit} more\n` : '\n');
};

const formatInventory = (limit = 120) => {
  if (filesWithSignals.length === 0) return '- None\n';

  return filesWithSignals
    .slice(0, limit)
    .map((file) => {
      const categorySummary = Object.entries(file.categories)
        .map(([category, data]) => `${category}:${data.count}`)
        .join(', ');
      const guardSummary =
        file.guardTerms.length > 0
          ? file.guardTerms.map((guard) => `${guard.term}:${guard.count}`).join(', ')
          : 'none';
      return `- ${file.severity}: ${file.filePath} - ${categorySummary}; guards: ${guardSummary}`;
    })
    .join('\n')
    .concat(filesWithSignals.length > limit ? `\n- ... ${filesWithSignals.length - limit} more\n` : '\n');
};

const markdown = `# 3.1 Frame Loop, Canvas, Audio, and WebGL Audit

Generated: ${summary.generatedAt}

## Summary

- Scanned root: ${summary.scannedRoot}
- Scanned files: ${summary.scannedFileCount}
- Files with frame/canvas/audio/WebGL signals: ${summary.filesWithSignalsCount}
- Component files with signals: ${summary.componentFilesWithSignalsCount}
- Review-required files: ${summary.reviewRequiredFileCount}
- Findings: ${summary.findingCount}
- Strict mode: ${strict ? 'yes' : 'no'}

## Category Totals

${formatCategoryTotals()}

## Findings

${formatFindings()}
## Inventory

${formatInventory()}
## Gate Notes

- This is a source audit gate for 3.1 release-candidate evidence.
- Default mode is report-only so release owners can inventory risk without blocking unrelated work.
- Run \`npm run audit:3.1-frame-loop:strict\` to fail on review-required findings.
- A file is flagged when a production component has frame-loop, readback, audio analyser, or WebGL signals and lacks obvious reduced-motion or explicit animation guard terms.
`;

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(reportMdPath, markdown);

console.log(`3.1 frame-loop/canvas audit written to ${path.relative(root, reportJsonPath)}`);
console.log(`Markdown summary written to ${path.relative(root, reportMdPath)}`);
console.log(JSON.stringify(summary, null, 2));

if (strict && findings.length > 0) {
  process.exit(1);
}
