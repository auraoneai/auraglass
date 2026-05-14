import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  BarChart3,
  FileText,
  FolderSearch,
  Settings,
  ShieldCheck,
} from "@/icons";
import {
  GlassSpotlightSearch,
  type SpotlightAction,
} from "./GlassSpotlightSearch";

const actions: SpotlightAction[] = [
  {
    id: "open-report",
    title: "Open performance report",
    description: "Jump to campaign pacing and conversion metrics.",
    category: "Reports",
    keywords: ["metrics", "analytics", "performance"],
    shortcut: "G R",
    icon: <BarChart3 size={18} />,
    onAction: () => undefined,
  },
  {
    id: "search-assets",
    title: "Search creative assets",
    description: "Find approved copy, images, and landing page variants.",
    category: "Assets",
    keywords: ["creative", "copy", "images"],
    shortcut: "G A",
    icon: <FolderSearch size={18} />,
    onAction: () => undefined,
  },
  {
    id: "export-brief",
    title: "Export launch brief",
    description: "Generate a PDF summary for stakeholders.",
    category: "Documents",
    keywords: ["pdf", "summary", "brief"],
    shortcut: "E B",
    icon: <FileText size={18} />,
    onAction: () => undefined,
  },
  {
    id: "review-access",
    title: "Review access policy",
    description: "Inspect roles and permissions before publishing.",
    category: "Security",
    keywords: ["roles", "permissions", "security"],
    shortcut: "G S",
    icon: <ShieldCheck size={18} />,
    onAction: () => undefined,
  },
  {
    id: "workspace-settings",
    title: "Workspace settings",
    description: "Configure notifications, billing, and default views.",
    category: "Settings",
    keywords: ["preferences", "billing", "notifications"],
    shortcut: "G ,",
    icon: <Settings size={18} />,
    onAction: () => undefined,
  },
];

const SpotlightStory = (
  args: React.ComponentProps<typeof GlassSpotlightSearch>
) => {
  const [open, setOpen] = useState(args.open ?? true);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        padding: 32,
        boxSizing: "border-box",
        background:
          "linear-gradient(135deg, rgba(239,246,255,0.96), rgba(240,253,250,0.9))",
      }}
    >
      <div
        className="glass-flex glass-flex-col glass-gap-4"
        style={{
          maxWidth: 640,
          borderRadius: 24,
          border: "1px solid rgba(15,23,42,0.12)",
          background: "rgba(255,255,255,0.72)",
          padding: 24,
          boxShadow: "0 24px 70px rgba(15,23,42,0.12)",
          color: "#0f172a",
        }}
      >
        <h3 className="glass-text-lg glass-font-semibold" style={{ margin: 0, color: "#0f172a" }}>
          Workspace search
        </h3>
        <p className="glass-text-sm" style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
          The command palette starts open so grouping, shortcuts, and glass
          layering are visible without keyboard setup.
        </p>
        <button
          className="glass-px-4 glass-py-2 glass-radius-md glass-surface-blue glass-text-primary glass-text-sm"
          style={{
            alignSelf: "flex-start",
            border: 0,
            background: "#2563eb",
            color: "#f8fafc",
            cursor: "pointer",
            font: "inherit",
          }}
          onClick={() => setOpen(true)}
        >
          Open spotlight
        </button>
      </div>
      <GlassSpotlightSearch
        {...args}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

const meta = {
  title: 'Controls/Search/Glass Spotlight Search',
  component: GlassSpotlightSearch,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "A full-screen glass command palette for action search, shortcuts, and grouped results.",
      },
    },
  },
  args: {
    open: true,
    onClose: () => undefined,
    actions,
    placeholder: "Search reports, assets, settings...",
    maxResults: 8,
    showRecent: true,
    fuzzySearch: true,
    groupByCategory: true,
  },
} satisfies Meta<typeof GlassSpotlightSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <SpotlightStory {...args} />,
};

export const Ungrouped: Story = {
  args: {
    groupByCategory: false,
    placeholder: "Type an action or destination...",
  },
  render: (args) => <SpotlightStory {...args} />,
};
