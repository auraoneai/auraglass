import type { Meta, StoryObj } from "@storybook/react";
import type { CSSProperties } from "react";
import inventory from "../../reports/component_inventory.json";

type InventoryComponent = {
  name: string;
  path: string;
  category?: string;
  hasARIA?: boolean;
  hasContrastGuard?: boolean;
  hasFocusManagement?: boolean;
  hasReducedMotion?: boolean;
  hasTypescript?: boolean;
};

const components = inventory.components as InventoryComponent[];
const componentCount = components.length;
const liquidGlassModuleCount = 29;
const liquidGlassExportCount = 65;

const categoryCount = (category: string) =>
  components.filter((component) => component.category === category).length;

const shellStyle = {
  height: "100vh",
  padding: "32px",
  boxSizing: "border-box",
  overflowY: "auto",
  color: "#102033",
  background:
    "linear-gradient(135deg, #f8fafc 0%, #eaf3ff 34%, #f4fbf7 100%)",
} satisfies CSSProperties;

const pageStyle = {
  display: "grid",
  gap: 24,
  maxWidth: 1180,
  margin: "0 auto",
} satisfies CSSProperties;

const panelStyle = {
  border: "1px solid rgba(15, 23, 42, 0.10)",
  borderRadius: 8,
  background: "rgba(255, 255, 255, 0.78)",
  boxShadow: "0 18px 56px rgba(15, 23, 42, 0.10)",
} satisfies CSSProperties;

const sectionHeadingStyle = {
  margin: 0,
  color: "#0f172a",
  fontSize: 18,
  lineHeight: 1.25,
  fontWeight: 760,
} satisfies CSSProperties;

const bodyTextStyle = {
  margin: "8px 0 0",
  color: "#475569",
  fontSize: 14,
  lineHeight: 1.55,
} satisfies CSSProperties;

const statTiles = [
  {
    label: "Certified Components",
    value: componentCount,
    detail: "Complete public inventory",
    color: "#1d4ed8",
  },
  {
    label: "Liquid Glass Modules",
    value: liquidGlassModuleCount,
    detail: `${liquidGlassExportCount} public Liquid Glass exports across primitives and composed UI`,
    color: "#0f766e",
  },
  {
    label: "Storybook Entries",
    value: "1,600+",
    detail: "Public examples plus certification coverage",
    color: "#b45309",
  },
  {
    label: "3.0 Release Scope",
    value: "Major",
    detail: "Liquid Glass, tokens, SSR, packaging, docs, QA",
    color: "#be123c",
  },
];

const lanes = [
  {
    title: "Start With App Chrome",
    description:
      "Use these for production shells, dashboards, admin surfaces, and app navigation.",
    links: [
      "Showcases/Liquid Glass Showcase",
      "Navigation/LiquidGlassToolbar",
      "Navigation/LiquidGlassInsetSidebar",
      "Navigation/LiquidGlassTabBar",
      "Surfaces/App Shells + Layout/Glass App Shell",
    ],
  },
  {
    title: "Build Core Screens",
    description:
      "Use these families for buttons, forms, cards, tables, charts, and layout foundations.",
    links: [
      "Controls/Buttons",
      "Controls/Inputs",
      "Data + Visualization",
      "Surfaces/App Shells + Layout",
      "Foundations/Liquid Glass Primitives",
    ],
  },
  {
    title: "Add Liquid Glass Moments",
    description:
      "Use these for premium transient UI, media controls, command/search, and adaptive sheets.",
    links: [
      "Showcases/Liquid Glass State Matrix",
      "Media/Liquid Glass Media Controls",
      "Media/Liquid Glass Now Playing Bar",
      "Controls/Search/Liquid Glass Search Field",
      "Surfaces/Modals/Liquid Glass Adaptive Sheet",
    ],
  },
  {
    title: "Verify Before Shipping",
    description:
      "Keep generated inventory and visual certification separate from the public showroom.",
    links: [
      "Certification/Glass Audit Coverage",
      "Certification/Glass Missing Inventory Certification",
      "Reference/Category Galleries",
      "Foundations/Accessibility",
      "Effects + Advanced",
    ],
  },
];

const categoryTiles = [
  {
    title: "Navigation",
    count: categoryCount("navigation"),
    description: "Sidebars, toolbars, tabs, breadcrumbs, app shell controls.",
  },
  {
    title: "Buttons",
    count: categoryCount("button"),
    description: "Glass buttons, icon actions, liquid variants, control states.",
  },
  {
    title: "Forms",
    count: categoryCount("form"),
    description: "Inputs, fields, selectors, validation, upload flows.",
  },
  {
    title: "Data Display",
    count: categoryCount("data-display"),
    description: "Cards, badges, tables, lists, metrics, dense display UI.",
  },
  {
    title: "Charts",
    count: categoryCount("chart"),
    description: "Analytics, graph surfaces, telemetry, dashboard charts.",
  },
  {
    title: "Layout",
    count: categoryCount("layout"),
    description: "Containers, grids, panels, responsive composition helpers.",
  },
  {
    title: "Modals",
    count: categoryCount("modal"),
    description: "Dialogs, sheets, drawers, transient glass overlays.",
  },
  {
    title: "System",
    count: categoryCount("misc"),
    description: "Accessibility, primitives, advanced engines, utilities.",
  },
];

function CuratedComponentGuide() {
  return (
    <div style={shellStyle}>
      <div style={pageStyle}>
        <header
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            gap: 24,
            alignItems: "end",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 8px",
                color: "#0f766e",
                fontSize: 13,
                fontWeight: 760,
                textTransform: "uppercase",
                letterSpacing: 0,
              }}
            >
              AuraGlass 3.0 Storybook
            </p>
            <h1
              style={{
                margin: 0,
                maxWidth: 720,
                fontSize: 42,
                lineHeight: 1.05,
                letterSpacing: 0,
              }}
            >
              Curated entry points for a 356-component design system.
            </h1>
            <p style={{ ...bodyTextStyle, maxWidth: 760, fontSize: 16 }}>
              The public showroom starts with high-signal product surfaces, then
              branches into component families, Liquid Glass examples, reference
              galleries, and certification-only coverage.
            </p>
          </div>
          <div
            style={{
              ...panelStyle,
              padding: 16,
              minWidth: 220,
              borderColor: "rgba(15, 118, 110, 0.24)",
            }}
          >
            <strong style={{ display: "block", fontSize: 28 }}>{componentCount}</strong>
            <span style={{ display: "block", color: "#475569" }}>
              certified components in the inventory
            </span>
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {statTiles.map((tile) => (
            <article key={tile.label} style={{ ...panelStyle, padding: 18 }}>
              <div
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 999,
                  background: tile.color,
                  marginBottom: 14,
                }}
              />
              <strong style={{ display: "block", fontSize: 30 }}>{tile.value}</strong>
              <span style={{ display: "block", fontWeight: 720 }}>{tile.label}</span>
              <p style={bodyTextStyle}>{tile.detail}</p>
            </article>
          ))}
        </section>

        <section style={{ display: "grid", gap: 16 }}>
          <div>
            <h2 style={sectionHeadingStyle}>Developer Paths</h2>
            <p style={bodyTextStyle}>
              These paths keep everyday builders out of generated inventory
              noise while preserving complete coverage for audits and agents.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {lanes.map((lane) => (
              <article key={lane.title} style={{ ...panelStyle, padding: 18 }}>
                <h3 style={sectionHeadingStyle}>{lane.title}</h3>
                <p style={bodyTextStyle}>{lane.description}</p>
                <div style={{ display: "grid", gap: 8, marginTop: 16 }}>
                  {lane.links.map((link) => (
                    <code
                      key={link}
                      style={{
                        display: "block",
                        padding: "8px 10px",
                        borderRadius: 6,
                        background: "rgba(15, 23, 42, 0.06)",
                        color: "#0f172a",
                        fontSize: 12,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {link}
                    </code>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: 16 }}>
          <div>
            <h2 style={sectionHeadingStyle}>Component Families</h2>
            <p style={bodyTextStyle}>
              The inventory is grouped by job-to-be-done so developers can pick
              a family first, then choose the exact primitive or composed surface.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 12,
            }}
          >
            {categoryTiles.map((category) => (
              <article
                key={category.title}
                style={{
                  ...panelStyle,
                  padding: 16,
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 12,
                  alignItems: "start",
                }}
              >
                <div>
                  <h3 style={{ ...sectionHeadingStyle, fontSize: 16 }}>
                    {category.title}
                  </h3>
                  <p style={bodyTextStyle}>{category.description}</p>
                </div>
                <strong style={{ fontSize: 24 }}>{category.count}</strong>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const meta: Meta<typeof CuratedComponentGuide> = {
  title: 'Start Here/Guide',
  component: CuratedComponentGuide,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "Curated Storybook entry point that separates public showroom examples from generated reference and certification stories.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CuratedComponentGuide>;

export const Guide: Story = {};
