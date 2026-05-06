import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassBadgeCluster } from "../data-display/LiquidGlassBadgeCluster";
import { LiquidGlassMediaControls } from "../media/LiquidGlassMediaControls";
import { LiquidGlassInsetSidebar } from "../navigation/LiquidGlassInsetSidebar";
import { LiquidGlassTabBar } from "../navigation/LiquidGlassTabBar";
import { LiquidGlassToolbar } from "../navigation/LiquidGlassToolbar";
import { LiquidGlassSearchField } from "../search/LiquidGlassSearchField";

const meta: Meta = {
  title: "Showcase/LiquidGlassStateMatrix",
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

function MatrixSurface({ label, dark = false, dense = false, media = false }: { label: string; dark?: boolean; dense?: boolean; media?: boolean }) {
  return (
    <section
      className="glass-grid glass-gap-3 glass-p-4"
      style={{
        minHeight: 320,
        background: media
          ? "linear-gradient(135deg, #0f172a, #2563eb 45%, #14b8a6)"
          : dark
            ? "#0f172a"
            : "#f8fafc",
        color: dark || media ? "white" : "#111827",
      }}
      data-liquid-glass-state={label}
    >
      <LiquidGlassToolbar
        density={dense ? "compact" : "comfortable"}
        materialVariant={media ? "clear" : "regular"}
        left={<strong>{label}</strong>}
        center={<LiquidGlassSearchField minimized={dense} results={[{ id: "result", label }]} />}
        right={<button type="button">Action</button>}
        groups={[{ id: "view", items: [{ id: "grid", label: "Grid" }, { id: "list", label: "List" }] }]}
      />
      <div className="glass-flex glass-gap-4">
        <LiquidGlassInsetSidebar
          collapsed={dense}
          materialVariant={media ? "clear" : "regular"}
          items={[{ id: "home", label: "Home" }, { id: "media", label: "Media" }]}
          selectedId="home"
        />
        <div className="glass-flex glass-flex-1 glass-flex-col glass-gap-3">
          <LiquidGlassBadgeCluster
            expanded={!dense}
            items={[
              { id: "adaptive", label: "Adaptive" },
              { id: "grouped", label: "Grouped" },
              { id: "motion", label: "Motion-safe" },
            ]}
          />
          <LiquidGlassMediaControls playing={false} variant={media ? "clear" : "regular"} compact={dense} />
          <LiquidGlassTabBar
            tabs={[{ id: "home", label: "Home" }, { id: "search", label: "Search" }]}
            activeTab="home"
            searchTabId="search"
          />
        </div>
      </div>
    </section>
  );
}

export const LightDarkDenseMedia: Story = {
  render: () => (
    <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4">
      <MatrixSurface label="Light" />
      <MatrixSurface label="Dark" dark />
      <MatrixSurface label="Dense" dense />
      <MatrixSurface label="Media Clear" media />
    </div>
  ),
};
