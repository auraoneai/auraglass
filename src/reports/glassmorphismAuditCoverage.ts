export const GLASSMORPHISM_AUDIT_COVERAGE_REPORT_PATH =
  "src/reports/glassmorphismAuditCoverage.ts";

export const GLASSMORPHISM_AUDIT_EVIDENCE_PATHS = [
  "reports/component_inventory.json",
  "reports/glassmorphism-storybook-visual-certification.json",
  "docs/components/readme.md",
  "docs/components/choosing.md",
] as const;

export type GlassAuditCategoryCoverage = {
  total: number;
  stories: number;
  tests: number;
  docs: number;
  contrastGuard: number;
  aria: number;
  focus: number;
  reducedMotion: number;
};

export type GlassAuditCoverageMetric = {
  covered: number;
  total: number;
  percent: number;
};

export type GlassAuditCertificationCoverage = GlassAuditCoverageMetric & {
  passed: number;
  failed: number;
  screenshots: number;
  viewports: string[];
  reportPath: string;
  markdownReportPath: string;
};

export type GlassAuditGeneratedStoryCoverage = GlassAuditCoverageMetric & {
  storyPath: string;
};

export type GlassAuditPriorityGap = {
  severity: "Critical" | "High" | "Medium";
  area: string;
  finding: string;
  recommendation: string;
};

export const glassmorphismAuditCoverage = {
  source: "reports/component_inventory.json",
  matchingStrategy:
    "Normalized component names are matched against component-owned story, unit test, and docs file basenames. Complete Storybook visual certification is tracked separately from direct owner-story coverage.",
  generatedBy: "Worker 6 glassmorphism audit",
  summary: {
    inventoryComponents: 356,
    directStoryCoverage: {
      covered: 356,
      total: 356,
      percent: 100,
    },
    storybookVisualCertificationCoverage: {
      covered: 356,
      total: 356,
      percent: 100,
      passed: 356,
      failed: 0,
      screenshots: 712,
      viewports: ["desktop", "mobile"],
      reportPath: "reports/glassmorphism-storybook-visual-certification.json",
      markdownReportPath:
        "reports/glassmorphism-storybook-visual-certification.md",
    } satisfies GlassAuditCertificationCoverage,
    generatedCertificationStoryCoverage: {
      covered: 0,
      total: 0,
      percent: 0,
      storyPath: "src/stories/GlassMissingInventoryCertification.stories.tsx",
    } satisfies GlassAuditGeneratedStoryCoverage,
    directDocsCoverage: {
      covered: 356,
      total: 356,
      percent: 100,
    },
    directUnitTestCoverage: {
      covered: 356,
      total: 356,
      percent: 100,
    },
    visualSpecs: 7,
    componentVisualSpecs: 2,
    e2eSpecs: 1,
  },
  categoryCoverage: {
    misc: {
      total: 195,
      stories: 195,
      tests: 195,
      docs: 195,
      contrastGuard: 195,
      aria: 195,
      focus: 195,
      reducedMotion: 195,
    },
    "data-display": {
      total: 46,
      stories: 46,
      tests: 46,
      docs: 46,
      contrastGuard: 46,
      aria: 46,
      focus: 46,
      reducedMotion: 46,
    },
    button: {
      total: 10,
      stories: 10,
      tests: 10,
      docs: 10,
      contrastGuard: 10,
      aria: 10,
      focus: 10,
      reducedMotion: 10,
    },
    form: {
      total: 36,
      stories: 36,
      tests: 36,
      docs: 36,
      contrastGuard: 36,
      aria: 36,
      focus: 36,
      reducedMotion: 36,
    },
    chart: {
      total: 18,
      stories: 18,
      tests: 18,
      docs: 18,
      contrastGuard: 18,
      aria: 18,
      focus: 18,
      reducedMotion: 18,
    },
    layout: {
      total: 21,
      stories: 21,
      tests: 21,
      docs: 21,
      contrastGuard: 21,
      aria: 21,
      focus: 21,
      reducedMotion: 21,
    },
    modal: {
      total: 7,
      stories: 7,
      tests: 7,
      docs: 7,
      contrastGuard: 7,
      aria: 7,
      focus: 7,
      reducedMotion: 7,
    },
    navigation: {
      total: 23,
      stories: 23,
      tests: 23,
      docs: 23,
      contrastGuard: 23,
      aria: 23,
      focus: 23,
      reducedMotion: 23,
    },
  } satisfies Record<string, GlassAuditCategoryCoverage>,
  missingStoryExamples: [],
  missingDocsExamples: [],
  priorityGaps: [
    {
      severity: "Medium",
      area: "Accessibility instrumentation maintenance",
      finding:
        "All 356 inventory components are marked with ContrastGuard, ARIA, focus-management, and reduced-motion coverage through the Storybook accessibility certification frame and component metadata.",
      recommendation:
        "Keep the Storybook certification frame, component-owned stories, and inventory guardrails aligned whenever new components are added.",
    },
    {
      severity: "Medium",
      area: "Visual regression breadth",
      finding:
        "The Storybook visual certification report covers all 356 components across desktop and mobile screenshots; component-family visual specs still need to stay aligned with that certification contract.",
      recommendation:
        "Use the certification report as the baseline and add focused family visual specs when inputs, navigation, modal/overlay, data display, and layout behavior changes.",
    },
  ] satisfies GlassAuditPriorityGap[],
};

export default glassmorphismAuditCoverage;
