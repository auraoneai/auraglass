export const GLASSMORPHISM_AUDIT_PROMPT_PATH =
  "docs/prompts/glassmorphism-component-audit-master-prompt.md";

export const GLASSMORPHISM_AUDIT_COVERAGE_REPORT_PATH =
  "src/reports/glassmorphismAuditCoverage.ts";

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
      covered: 278,
      total: 356,
      percent: 78.1,
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
      covered: 78,
      total: 78,
      percent: 100,
      storyPath: "src/stories/GlassMissingInventoryCertification.stories.tsx",
    } satisfies GlassAuditGeneratedStoryCoverage,
    directDocsCoverage: {
      covered: 213,
      total: 356,
      percent: 59.8,
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
      stories: 130,
      tests: 195,
      docs: 100,
      contrastGuard: 1,
      aria: 45,
      focus: 33,
      reducedMotion: 195,
    },
    "data-display": {
      total: 46,
      stories: 39,
      tests: 46,
      docs: 34,
      contrastGuard: 0,
      aria: 21,
      focus: 8,
      reducedMotion: 46,
    },
    button: {
      total: 10,
      stories: 10,
      tests: 10,
      docs: 7,
      contrastGuard: 0,
      aria: 6,
      focus: 1,
      reducedMotion: 10,
    },
    form: {
      total: 36,
      stories: 32,
      tests: 36,
      docs: 30,
      contrastGuard: 0,
      aria: 19,
      focus: 12,
      reducedMotion: 36,
    },
    chart: {
      total: 18,
      stories: 18,
      tests: 18,
      docs: 7,
      contrastGuard: 0,
      aria: 6,
      focus: 3,
      reducedMotion: 18,
    },
    layout: {
      total: 21,
      stories: 19,
      tests: 21,
      docs: 13,
      contrastGuard: 0,
      aria: 16,
      focus: 2,
      reducedMotion: 21,
    },
    modal: {
      total: 7,
      stories: 7,
      tests: 7,
      docs: 6,
      contrastGuard: 0,
      aria: 6,
      focus: 4,
      reducedMotion: 7,
    },
    navigation: {
      total: 23,
      stories: 23,
      tests: 23,
      docs: 16,
      contrastGuard: 0,
      aria: 18,
      focus: 9,
      reducedMotion: 23,
    },
  } satisfies Record<string, GlassAuditCategoryCoverage>,
  missingStoryExamples: [
    "ContrastGuard",
    "GlassAutoComposer",
    "GlassLiquidTransition",
    "GlassMetaEngine",
    "AIGlassThemeProvider",
    "GlassTransitions",
    "GlowingCard",
    "GlassChip",
    "GlassKanbanBoard",
    "GlassActionSheet",
  ],
  missingDocsExamples: [
    "GlassErrorBoundary",
    "AccessibilityProvider",
    "ContrastGuard",
    "EnhancedGlassButton",
    "ModularGlassDataChart",
    "GlassTypingIndicator",
    "GlassPageBuilder",
    "GlassAvatar",
    "GlassChartWidget",
    "GlassConnectionStatus",
  ],
  priorityGaps: [
    {
      severity: "Critical",
      area: "Glass contrast instrumentation",
      finding:
        "Only 1 of 356 inventory components is marked with ContrastGuard coverage in the source inventory.",
      recommendation:
        "Prioritize docs, stories, and visual tests that prove readable text over translucent surfaces before expanding component implementations.",
    },
    {
      severity: "High",
      area: "Direct Storybook coverage",
      finding:
        "78 inventory components do not have a direct normalized component-owned story match, but all 78 are covered by the generated certification story and the full 356-component Storybook visual certification pass.",
      recommendation:
        "Backfill component-owned stories for the certified components without removing the generated certification story or lowering the 356/356 visual pass requirement.",
    },
    {
      severity: "High",
      area: "Direct component docs coverage",
      finding:
        "143 inventory components do not have a direct normalized docs match, including accessibility primitives and several chart internals.",
      recommendation:
        "Document glass contract, accessibility contract, fallback behavior, and visual-test expectations for each uncovered component family.",
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
