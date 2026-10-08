#!/usr/bin/env node

/**
 * Human/CSV/HTML reporting adapter for the authoritative static material gate.
 *
 * Classification and invariant checks intentionally live in
 * scripts/audit/static-glass-material-audit.js. That engine parses CSS with
 * PostCSS and TS/TSX with Babel; keeping a second collection of regular
 * expressions here caused ordinary className lines to be reported as glass
 * and focus violations. This adapter cannot weaken or drift from that gate.
 *
 * Scope is shipped source under src/. Tests, stories, snapshots, reports,
 * docs, scripts, generated output and dependencies are excluded by the shared
 * isExcludedSourcePath policy. Unresolved authored composition is reported as
 * blocking triage and exits non-zero, just like a definite violation.
 */

const fs = require("node:fs");
const path = require("node:path");
const { evidenceDir } = require("./ci/lib/evidence-dir");
const {
  auditSourceSet,
  isExcludedSourcePath,
} = require("./audit/static-glass-material-audit.js");

const REPO_ROOT = path.resolve(__dirname, "..");
const REPORT_DIRECTORY = evidenceDir('glass');
const CSV_REPORT = path.join(REPORT_DIRECTORY, "_auto-findings.csv");
const HTML_REPORT = path.join(REPORT_DIRECTORY, "_auto-findings.html");

const normalizePath = (filePath) => filePath.split(path.sep).join("/");

function walk(directory, output = []) {
  if (!fs.existsSync(directory)) return output;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolutePath, output);
    else output.push(absolutePath);
  }
  return output;
}

function repositorySources() {
  const files = walk(path.join(REPO_ROOT, "src")).filter((absolutePath) => {
    const relativePath = path.relative(REPO_ROOT, absolutePath);
    return !isExcludedSourcePath(relativePath);
  });

  return {
    cssSources: files
      .filter((filePath) => filePath.endsWith(".css"))
      .map((filePath) => ({
        file: normalizePath(path.relative(REPO_ROOT, filePath)),
        css: fs.readFileSync(filePath, "utf8"),
        lineOffset: 0,
        sourceKind:
          filePath.includes(".generated.") || normalizePath(filePath).includes("/generated/")
            ? "generated-css"
            : "css",
        label: path.basename(filePath),
      })),
    tsSources: files
      .filter((filePath) => /\.[cm]?tsx?$/.test(filePath))
      .map((filePath) => ({
        file: normalizePath(path.relative(REPO_ROOT, filePath)),
        source: fs.readFileSync(filePath, "utf8"),
      })),
  };
}

function severityFor(finding, disposition) {
  if (disposition === "BLOCKING_TRIAGE") return "HIGH";
  if (/^(?:dark-or-chromatic-material-fill|missing-(?:standard|webkit)-backdrop-filter|ts-surface-missing-|noncanonical-blur|white-frost-alpha-outside-contract)/.test(finding.code)) {
    return "HIGH";
  }
  return "MEDIUM";
}

function fixFor(finding, disposition) {
  if (disposition === "BLOCKING_TRIAGE") {
    return "Resolve the authored value/composition statically or document and prove its producer; triage is blocking.";
  }
  return "Remediate the named material invariant at the exact source location, then rerun this gate.";
}

function toReportFinding(finding, disposition) {
  return {
    file: finding.file,
    pattern: finding.code,
    severity: severityFor(finding, disposition),
    description: finding.message,
    fix: fixFor(finding, disposition),
    match: finding.subject,
    line: finding.line,
    disposition,
    sourceKind: finding.sourceKind,
  };
}

function findingsFromReport(report) {
  return [
    ...report.violations.map((finding) => toReportFinding(finding, "VIOLATION")),
    ...report.triage.map((finding) => toReportFinding(finding, "BLOCKING_TRIAGE")),
  ].sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.pattern.localeCompare(b.pattern));
}

// Compatibility helper for callers that previously scanned one file. It now
// uses the same AST/PostCSS classifier and returns no findings for excluded
// story/test paths.
function scanFile(filePath) {
  const absolutePath = path.resolve(REPO_ROOT, filePath);
  const relativePath = normalizePath(path.relative(REPO_ROOT, absolutePath));
  if (isExcludedSourcePath(relativePath)) return [];
  const content = fs.readFileSync(absolutePath, "utf8");
  const sourceSet = absolutePath.endsWith(".css")
    ? { cssSources: [{ file: relativePath, css: content, lineOffset: 0, sourceKind: "css", label: path.basename(filePath) }], tsSources: [] }
    : { cssSources: [], tsSources: [{ file: relativePath, source: content }] };
  return findingsFromReport(auditSourceSet(sourceSet));
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function generateCSVReport(findings) {
  const header = "File,Pattern,Severity,Description,Fix,Match,Line,Disposition,SourceKind\n";
  return header + findings.map((finding) => [
    finding.file,
    finding.pattern,
    finding.severity,
    finding.description,
    finding.fix,
    finding.match,
    finding.line,
    finding.disposition,
    finding.sourceKind,
  ].map(csvCell).join(",")).join("\n") + (findings.length ? "\n" : "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function generateHTMLReport(findings, report = null) {
  const violationCount = findings.filter((finding) => finding.disposition === "VIOLATION").length;
  const triageCount = findings.filter((finding) => finding.disposition === "BLOCKING_TRIAGE").length;
  const metrics = report?.metrics
    ? `${report.metrics.cssFiles} CSS and ${report.metrics.tsFiles} TS/TSX files; ${report.metrics.cssSurfaces} CSS surfaces and ${report.metrics.tsMaterialSpecs + report.metrics.tsStyleObjects} TypeScript material/style records classified.`
    : "A single source file was classified.";
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Glass Violation Scanner Report</title>
<style>body{font:14px/1.5 system-ui,sans-serif;margin:2rem;color:#171717}.summary{padding:1rem;background:#f5f5f5;border-radius:.5rem}.finding{border:1px solid #ddd;border-left:4px solid #d97706;margin:1rem 0;padding:1rem;border-radius:.4rem}.finding.high{border-left-color:#dc2626}.location{font-weight:700;color:#1d4ed8}.code{font-family:ui-monospace,monospace}.badge{font-size:.75rem;padding:.15rem .4rem;color:white;background:#525252;border-radius:.25rem}code{white-space:pre-wrap}</style></head>
<body><h1>Glass Violation Scanner Report</h1>
<div class="summary"><p><strong>Status:</strong> ${findings.length ? "FAIL" : "PASS"}</p><p><strong>Definite violations:</strong> ${violationCount}</p><p><strong>Blocking triage:</strong> ${triageCount}</p><p>${escapeHtml(metrics)}</p><p>Scope: shipped <code>src/</code> sources. Stories, tests, snapshots, reports, docs, scripts, build output, and dependencies are excluded by the shared certification policy.</p></div>
<h2>Actionable findings</h2>${findings.length ? findings.map((finding) => `
<article class="finding ${finding.severity.toLowerCase()}"><div class="location">${escapeHtml(finding.file)}:${finding.line}</div><div><span class="badge">${escapeHtml(finding.disposition)}</span> <span class="code">${escapeHtml(finding.pattern)}</span></div><p><strong>Subject:</strong> <code>${escapeHtml(finding.match)}</code></p><p>${escapeHtml(finding.description)}</p><p><strong>Next action:</strong> ${escapeHtml(finding.fix)}</p></article>`).join("") : "<p>No violations or unresolved authored material composition found.</p>"}
</body></html>\n`;
}

function main() {
  console.log("Glass violation scanner (AST/PostCSS certification adapter)");
  console.log("=========================================================");
  const report = auditSourceSet(repositorySources());
  const findings = findingsFromReport(report);

  fs.mkdirSync(REPORT_DIRECTORY, { recursive: true });
  fs.writeFileSync(CSV_REPORT, generateCSVReport(findings));
  fs.writeFileSync(HTML_REPORT, generateHTMLReport(findings, report));

  console.log(`Status: ${report.status.toUpperCase()}`);
  console.log(`Scanned: ${report.metrics.cssFiles} CSS files, ${report.metrics.tsFiles} TS/TSX files, ${report.metrics.tsCssTemplates} AST-classified inline CSS templates`);
  console.log(`Classified: ${report.metrics.cssSurfaces} CSS surfaces, ${report.metrics.tsMaterialSpecs} TS material specs, ${report.metrics.tsStyleObjects} TS style objects`);
  console.log(`Definite violations: ${report.summary.violationCount}`);
  console.log(`Blocking triage: ${report.summary.blockingTriageCount}`);

  if (findings.length) {
    console.log("\nActionable findings:");
    for (const finding of findings) {
      console.log(`- ${finding.disposition} ${finding.file}:${finding.line} [${finding.pattern}] (${finding.match}) — ${finding.description}`);
    }
  } else {
    console.log("\nNo glass material invariant violations found.");
  }
  console.log(`\nCSV: ${normalizePath(path.relative(REPO_ROOT, CSV_REPORT))}`);
  console.log(`HTML: ${normalizePath(path.relative(REPO_ROOT, HTML_REPORT))}`);
  process.exitCode = findings.length ? 1 : 0;
}

if (require.main === module) main();

module.exports = {
  scanFile,
  findingsFromReport,
  generateCSVReport,
  generateHTMLReport,
  repositorySources,
};
