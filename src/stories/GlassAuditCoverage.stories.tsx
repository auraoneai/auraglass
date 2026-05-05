import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { createGlassStyle } from "../core/mixins/glassMixins";
import {
  GLASSMORPHISM_AUDIT_PROMPT_PATH,
  glassmorphismAuditCoverage,
} from "../reports/glassmorphismAuditCoverage";

const percent = (covered: number, total: number) =>
  total === 0 ? "0.0%" : `${((covered / total) * 100).toFixed(1)}%`;

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: "32px",
  color: "#f8fafc",
  background:
    "radial-gradient(circle at 14% 18%, rgba(34, 211, 238, 0.28), transparent 30%), linear-gradient(135deg, #101827 0%, #172033 48%, #331b2f 100%)",
};

const headerStyle: React.CSSProperties = {
  maxWidth: 1180,
  margin: "0 auto 24px",
};

const titleStyle: React.CSSProperties = {
  margin: "0 0 8px",
  fontSize: "2rem",
  lineHeight: 1.2,
  letterSpacing: 0,
};

const bodyStyle: React.CSSProperties = {
  margin: 0,
  maxWidth: 840,
  color: "rgba(248, 250, 252, 0.78)",
  lineHeight: 1.6,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  maxWidth: 1180,
  margin: "0 auto 24px",
};

const tableWrapStyle: React.CSSProperties = {
  ...createGlassStyle({ intent: "neutral", elevation: "level2" }),
  maxWidth: 1180,
  margin: "0 auto 24px",
  overflowX: "auto",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 780,
};

const thStyle: React.CSSProperties = {
  padding: "12px",
  textAlign: "left",
  fontSize: "0.78rem",
  color: "rgba(248, 250, 252, 0.68)",
  borderBottom: "1px solid rgba(248, 250, 252, 0.16)",
};

const tdStyle: React.CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid rgba(248, 250, 252, 0.1)",
};

const chipStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 28,
  padding: "4px 10px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  color: "#f8fafc",
  fontSize: "0.8rem",
};

const listStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: 18,
  color: "rgba(248, 250, 252, 0.82)",
  lineHeight: 1.55,
};

const metricCards = [
  {
    label: "Inventory",
    value: glassmorphismAuditCoverage.summary.inventoryComponents,
    detail: "components tracked",
  },
  {
    label: "Direct Stories",
    value: `${glassmorphismAuditCoverage.summary.directStoryCoverage.covered}/${glassmorphismAuditCoverage.summary.directStoryCoverage.total}`,
    detail: `${glassmorphismAuditCoverage.summary.directStoryCoverage.percent}% coverage`,
  },
  {
    label: "Storybook Certified",
    value: `${glassmorphismAuditCoverage.summary.storybookVisualCertificationCoverage.covered}/${glassmorphismAuditCoverage.summary.storybookVisualCertificationCoverage.total}`,
    detail: `${glassmorphismAuditCoverage.summary.storybookVisualCertificationCoverage.screenshots} screenshots inspected`,
  },
  {
    label: "Generated Story",
    value: `${glassmorphismAuditCoverage.summary.generatedCertificationStoryCoverage.covered}/${glassmorphismAuditCoverage.summary.generatedCertificationStoryCoverage.total}`,
    detail:
      glassmorphismAuditCoverage.summary.generatedCertificationStoryCoverage
        .total === 0
        ? "no direct-story gaps"
        : "direct-story gap certified",
  },
  {
    label: "Direct Docs",
    value: `${glassmorphismAuditCoverage.summary.directDocsCoverage.covered}/${glassmorphismAuditCoverage.summary.directDocsCoverage.total}`,
    detail: `${glassmorphismAuditCoverage.summary.directDocsCoverage.percent}% coverage`,
  },
  {
    label: "Visual Specs",
    value: glassmorphismAuditCoverage.summary.visualSpecs,
    detail: `${glassmorphismAuditCoverage.summary.componentVisualSpecs} component-specific`,
  },
];

const GlassAuditCoverage: React.FC = () => (
  <main style={pageStyle}>
    <header style={headerStyle}>
      <span style={chipStyle}>{GLASSMORPHISM_AUDIT_PROMPT_PATH}</span>
      <h1 style={titleStyle}>Glassmorphism audit coverage matrix</h1>
      <p style={bodyStyle}>
        Static snapshot for the reusable full-library audit prompt. The matrix
        separates component-owned stories from the complete Storybook visual
        certification pass, docs, unit tests, and owned visual-test breadth so
        remaining coverage debt is visible without contradicting the certified
        356-component pass.
      </p>
    </header>

    <section style={gridStyle} aria-label="Glass audit summary metrics">
      {metricCards.map((metric) => (
        <article
          key={metric.label}
          style={createGlassStyle({ intent: "primary", elevation: "level2" })}
        >
          <p style={{ margin: "0 0 8px", color: "rgba(248, 250, 252, 0.68)" }}>
            {metric.label}
          </p>
          <strong style={{ display: "block", fontSize: "1.55rem" }}>
            {metric.value}
          </strong>
          <span style={{ color: "rgba(248, 250, 252, 0.72)" }}>
            {metric.detail}
          </span>
        </article>
      ))}
    </section>

    <section style={tableWrapStyle} aria-label="Glass audit category coverage">
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Stories</th>
            <th style={thStyle}>Docs</th>
            <th style={thStyle}>Unit tests</th>
            <th style={thStyle}>ContrastGuard</th>
            <th style={thStyle}>ARIA</th>
            <th style={thStyle}>Focus</th>
            <th style={thStyle}>Reduced motion</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(glassmorphismAuditCoverage.categoryCoverage).map(
            ([category, coverage]) => (
              <tr key={category}>
                <td style={tdStyle}>{category}</td>
                <td style={tdStyle}>
                  {coverage.stories}/{coverage.total}{" "}
                  <span style={{ color: "rgba(248, 250, 252, 0.58)" }}>
                    {percent(coverage.stories, coverage.total)}
                  </span>
                </td>
                <td style={tdStyle}>
                  {coverage.docs}/{coverage.total}{" "}
                  <span style={{ color: "rgba(248, 250, 252, 0.58)" }}>
                    {percent(coverage.docs, coverage.total)}
                  </span>
                </td>
                <td style={tdStyle}>
                  {coverage.tests}/{coverage.total}
                </td>
                <td style={tdStyle}>{coverage.contrastGuard}</td>
                <td style={tdStyle}>{coverage.aria}</td>
                <td style={tdStyle}>{coverage.focus}</td>
                <td style={tdStyle}>{coverage.reducedMotion}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </section>

    <section style={gridStyle} aria-label="Glass audit priority gaps">
      {glassmorphismAuditCoverage.priorityGaps.map((gap) => (
        <article
          key={gap.area}
          style={createGlassStyle({
            intent: gap.severity === "Critical" ? "danger" : "warning",
            elevation: "level2",
          })}
        >
          <span style={chipStyle}>{gap.severity}</span>
          <h2 style={{ margin: "12px 0 8px", fontSize: "1rem" }}>{gap.area}</h2>
          <p style={bodyStyle}>{gap.finding}</p>
          <p style={{ ...bodyStyle, marginTop: 10 }}>{gap.recommendation}</p>
        </article>
      ))}
    </section>

    <section style={gridStyle} aria-label="Glass audit missing examples">
      <article
        style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
      >
        <h2 style={{ marginTop: 0, fontSize: "1rem" }}>
          Missing direct story examples
        </h2>
        <ul style={listStyle}>
          {glassmorphismAuditCoverage.missingStoryExamples.length === 0 ? (
            <li>None</li>
          ) : (
            glassmorphismAuditCoverage.missingStoryExamples.map((name) => (
              <li key={name}>{name}</li>
            ))
          )}
        </ul>
      </article>
      <article
        style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
      >
        <h2 style={{ marginTop: 0, fontSize: "1rem" }}>
          Missing direct docs examples
        </h2>
        <ul style={listStyle}>
          {glassmorphismAuditCoverage.missingDocsExamples.length === 0 ? (
            <li>None</li>
          ) : (
            glassmorphismAuditCoverage.missingDocsExamples.map((name) => (
              <li key={name}>{name}</li>
            ))
          )}
        </ul>
      </article>
    </section>
  </main>
);

const meta: Meta<typeof GlassAuditCoverage> = {
  title: "Audits/Glassmorphism Coverage",
  component: GlassAuditCoverage,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Matrix: Story = {};
