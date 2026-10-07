import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ZSpaceAppLayout as ZSpaceAppLayoutComponent,
  type ZSpaceAppLayoutProps,
} from "./ZSpaceAppLayout";

const appHeader = (
  <header
    style={{
      alignItems: "center",
      display: "flex",
      gap: 16,
      height: "100%",
      justifyContent: "space-between",
      padding: "0 20px",
    }}
  >
    <div>
      <div style={{ color: "rgba(15, 23, 42, 0.92)", fontWeight: 700 }}>
        Aura Workspace
      </div>
      <div style={{ color: "rgba(15, 23, 42, 0.72)", fontSize: 12 }}>
        Product operations
      </div>
    </div>
    <div
      aria-label="Workspace is synchronized"
      style={{
        alignItems: "center",
        color: "rgba(15, 23, 42, 0.74)",
        display: "flex",
        fontSize: 13,
        gap: 8,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          background: "rgba(255, 255, 255, 0.32)",
          border: "1px solid rgba(255, 255, 255, 0.72)",
          borderRadius: 999,
          boxShadow: "0 1px 5px rgba(15, 23, 42, 0.12)",
          height: 8,
          width: 8,
        }}
      />
      Synced
    </div>
  </header>
);

const appSidebar = (
  <nav
    aria-label="Workspace sections"
    style={{
      display: "grid",
      gap: 8,
      padding: 16,
    }}
  >
    {[
      ["Overview", "12"],
      ["Projects", "08"],
      ["Signals", "24"],
      ["Archive", "36"],
    ].map(([label, count], index) => (
      <div
        key={label}
        style={{
          alignItems: "center",
          background:
            index === 0
              ? "rgba(255, 255, 255, 0.24)"
              : "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.38)",
          borderRadius: 14,
          color: "rgba(15, 23, 42, 0.82)",
          display: "flex",
          fontSize: 13,
          justifyContent: "space-between",
          padding: "11px 12px",
        }}
      >
        <span>{label}</span>
        <span style={{ color: "rgba(15, 23, 42, 0.7)", fontSize: 11 }}>
          {count}
        </span>
      </div>
    ))}
  </nav>
);

const appFooter = (
  <footer
    style={{
      alignItems: "center",
      color: "rgba(15, 23, 42, 0.7)",
      display: "flex",
      fontSize: 12,
      height: "100%",
      justifyContent: "space-between",
      padding: "0 20px",
    }}
  >
    <span>Workspace health: excellent</span>
    <span>Updated moments ago</span>
  </footer>
);

const appContent = (
  <section aria-labelledby="workspace-heading">
    <p
      style={{
        color: "rgba(15, 23, 42, 0.7)",
        fontSize: 12,
        letterSpacing: "0.08em",
        margin: "0 0 6px",
        textTransform: "uppercase",
      }}
    >
      Command center
    </p>
    <h2
      id="workspace-heading"
      style={{
        color: "rgba(15, 23, 42, 0.92)",
        fontSize: "clamp(24px, 4vw, 38px)",
        letterSpacing: "-0.035em",
        margin: 0,
      }}
    >
      Good morning
    </h2>
    <p
      style={{
        color: "rgba(15, 23, 42, 0.72)",
        lineHeight: 1.6,
        margin: "10px 0 18px",
        maxWidth: 560,
      }}
    >
      Review the latest product signals across a layered workspace designed to
      keep navigation, content, and system status visually distinct.
    </p>
    <div
      style={{
        display: "grid",
        gap: 10,
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
      }}
    >
      {[
        ["Active projects", "18", "+3 this week"],
        ["Open decisions", "07", "2 need review"],
        ["Signal quality", "96%", "Stable"],
      ].map(([label, value, detail]) => (
        <article
          key={label}
          style={{
            background: "rgba(255, 255, 255, 0.16)",
            border: "1px solid rgba(255, 255, 255, 0.42)",
            borderRadius: 18,
            boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
            minWidth: 0,
            padding: 14,
          }}
        >
          <div style={{ color: "rgba(15, 23, 42, 0.7)", fontSize: 12 }}>
            {label}
          </div>
          <div
            style={{
              color: "rgba(15, 23, 42, 0.92)",
              fontSize: 28,
              fontWeight: 700,
              marginTop: 8,
            }}
          >
            {value}
          </div>
          <div
            style={{
              color: "rgba(15, 23, 42, 0.7)",
              fontSize: 12,
              marginTop: 5,
            }}
          >
            {detail}
          </div>
        </article>
      ))}
    </div>
  </section>
);

const storyArgs = {
  "aria-label": "Aura product operations workspace",
  children: appContent,
  footer: appFooter,
  footerHeight: 54,
  header: appHeader,
  headerHeight: 68,
  positionStrategy: "absolute",
  sidebar: appSidebar,
  sidebarWidth: 224,
  style: {
    height: "min(720px, 100vh)",
    width: "100%",
  },
} satisfies ZSpaceAppLayoutProps;

const meta = {
  title: "Surfaces/App Shells + Layout/ZSpace App Layout",
  component: ZSpaceAppLayoutComponent,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A direct, production-shaped mount of ZSpaceAppLayout with bounded header, sidebar, content, and footer layers.",
      },
    },
  },
  args: storyArgs,
} satisfies Meta<typeof ZSpaceAppLayoutComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ZSpaceAppLayout: Story = {
  name: "ZSpaceAppLayout",
};
