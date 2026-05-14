import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  GlassButton,
  GlassCard,
  GlassCommandPalette,
  GlassDropdownMenu,
  GlassDropdownMenuContent,
  GlassDropdownMenuItem,
  GlassDropdownMenuLabel,
  GlassDropdownMenuSeparator,
  GlassDropdownMenuTrigger,
  GlassSelectContent,
  GlassSelectItem,
  GlassSelectRoot,
  GlassSelectTrigger,
  GlassSelectValue,
  GlassTabs,
  GlassTabsContent,
  GlassTabsList,
  GlassTabsTrigger,
  GlassTooltip,
} from "../index";
import { GlassPageHeader, GlassSidebarRail, GlassTopBar } from "../app-shell";
import {
  DashboardIcon,
  DatabaseIcon,
  SearchIcon,
  SettingsIcon,
  SparkIcon,
} from "../icons";

const AppChromeVisualBaseline = () => (
  <main style={styles.page}>
    <section style={styles.shell}>
      <GlassTopBar
        brand="AuraGlass"
        actions={
          <GlassButton leftIcon={<SearchIcon aria-hidden="true" />} size="sm">
            Search
          </GlassButton>
        }
      />
      <div style={styles.body}>
        <GlassSidebarRail
          items={[
            { id: "dashboard", label: "Dashboard", icon: <DashboardIcon />, active: true },
            { id: "data", label: "Data", icon: <DatabaseIcon /> },
            { id: "settings", label: "Settings", icon: <SettingsIcon /> },
          ]}
        />
        <section style={styles.content}>
          <GlassPageHeader
            title="Native app chrome"
            description="First-party AuraGlass surfaces without MUI, Radix, or Lucide."
          />
          <div style={styles.grid}>
            <GlassCard style={styles.card}>
              <h2 style={styles.cardTitle}>Menu and select</h2>
              <div style={styles.controls}>
                <GlassDropdownMenu open>
                  <GlassDropdownMenuTrigger>Workspace actions</GlassDropdownMenuTrigger>
                  <GlassDropdownMenuContent
                    contained
                    portalled={false}
                    positionStrategy="contained"
                    style={styles.menu}
                  >
                    <GlassDropdownMenuLabel>Project</GlassDropdownMenuLabel>
                    <GlassDropdownMenuItem>Open command center</GlassDropdownMenuItem>
                    <GlassDropdownMenuItem>Duplicate workspace</GlassDropdownMenuItem>
                    <GlassDropdownMenuSeparator />
                    <GlassDropdownMenuItem>Archive surface</GlassDropdownMenuItem>
                  </GlassDropdownMenuContent>
                </GlassDropdownMenu>
                <GlassSelectRoot open value="balanced">
                  <GlassSelectTrigger style={styles.selectTrigger}>
                    <GlassSelectValue placeholder="Choose density" />
                  </GlassSelectTrigger>
                  <GlassSelectContent contained portalled={false} positionStrategy="contained">
                    <GlassSelectItem value="compact">Compact UI</GlassSelectItem>
                    <GlassSelectItem value="balanced">Balanced product surface</GlassSelectItem>
                    <GlassSelectItem value="comfortable">Comfortable media controls</GlassSelectItem>
                  </GlassSelectContent>
                </GlassSelectRoot>
              </div>
            </GlassCard>

            <GlassCard style={styles.card}>
              <h2 style={styles.cardTitle}>Tabs and command UI</h2>
              <GlassTabs defaultValue="overview">
                <GlassTabsList>
                  <GlassTabsTrigger value="overview">Overview</GlassTabsTrigger>
                  <GlassTabsTrigger value="gates">Gates</GlassTabsTrigger>
                  <GlassTabsTrigger value="docs">Docs</GlassTabsTrigger>
                </GlassTabsList>
                <GlassTabsContent value="overview">
                  <p style={styles.copy}>App chrome is composed from AuraGlass primitives.</p>
                </GlassTabsContent>
                <GlassTabsContent value="gates">
                  <p style={styles.copy}>Export, pack, Vite, and visual gates cover the package.</p>
                </GlassTabsContent>
                <GlassTabsContent value="docs">
                  <p style={styles.copy}>Migration docs map MUI, Radix, and Lucide replacements.</p>
                </GlassTabsContent>
              </GlassTabs>
            </GlassCard>

            <GlassCard style={styles.wideCard}>
              <GlassCommandPalette
                open
                contained
                positionStrategy="inline"
                enableRecents={false}
                showFooter={false}
                placeholder="Search AuraGlass actions"
                items={[
                  {
                    id: "audit-deps",
                    label: "Audit dependencies",
                    category: "Release",
                    shortcut: "CMD A",
                  },
                  {
                    id: "capture-visuals",
                    label: "Capture visual baselines",
                    category: "Visual QA",
                    shortcut: "CMD V",
                  },
                  {
                    id: "publish-docs",
                    label: "Publish package docs",
                    category: "Docs",
                    shortcut: "CMD P",
                  },
                ]}
              />
            </GlassCard>

            <GlassCard style={styles.card}>
              <h2 style={styles.cardTitle}>Tooltip</h2>
              <GlassTooltip content="AuraGlass tooltip behavior without Radix." showDelay={0}>
                <button style={styles.trigger} type="button">
                  Hover target
                </button>
              </GlassTooltip>
            </GlassCard>

            <GlassCard style={styles.card}>
              <h2 style={styles.cardTitle}>Icon action</h2>
              <GlassButton leftIcon={<SparkIcon aria-hidden="true" />}>
                Generate evidence
              </GlassButton>
            </GlassCard>
          </div>
        </section>
      </div>
    </section>
  </main>
);

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100dvh",
    padding: 24,
    color: "#f8fafc",
    background:
      "radial-gradient(circle at 16% 14%, rgba(94,234,212,0.32), transparent 36%), radial-gradient(circle at 86% 24%, rgba(168,85,247,0.30), transparent 38%), #07111f",
  },
  shell: {
    maxWidth: 1180,
    margin: "0 auto",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 24,
    overflow: "hidden",
    background: "rgba(7,17,31,0.70)",
    boxShadow: "0 32px 120px rgba(0,0,0,0.42)",
  },
  body: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    minHeight: 720,
  },
  content: {
    padding: 24,
    display: "grid",
    alignContent: "start",
    gap: 20,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
  },
  card: {
    minHeight: 260,
    padding: 18,
  },
  wideCard: {
    gridColumn: "1 / -1",
    padding: 18,
    minHeight: 300,
  },
  cardTitle: {
    margin: "0 0 14px",
    fontSize: 18,
    fontWeight: 650,
  },
  controls: {
    display: "grid",
    gap: 18,
    alignItems: "start",
  },
  menu: {
    width: 280,
  },
  selectTrigger: {
    minWidth: 300,
  },
  copy: {
    margin: "12px 0 0",
    color: "rgba(248,250,252,0.70)",
    lineHeight: 1.55,
  },
  trigger: {
    minHeight: 44,
    padding: "0 18px",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 999,
    background: "rgba(255,255,255,0.10)",
    color: "#f8fafc",
    font: "inherit",
  },
};

const meta: Meta<typeof AppChromeVisualBaseline> = {
  title: "Reference/3.2/App Chrome Visual Baseline",
  component: AppChromeVisualBaseline,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FullSurface: Story = {};
