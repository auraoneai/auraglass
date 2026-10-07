import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassTrophyCase as GlassTrophyCaseComponent } from "./GlassTrophyCase";

const meta = {
  title: "Effects + Advanced/Glass Trophy Case",
  component: GlassTrophyCaseComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "The actual GlassTrophyCase export with its built-in deterministic achievement collection, responsive controls, and optional audio disabled.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassTrophyCaseComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const stageStyle: CSSProperties = {
  boxSizing: "border-box",
  minHeight: "100vh",
  minWidth: 0,
  padding: "clamp(20px, 5vw, 64px)",
  width: "100%",
};

export const GlassTrophyCase: Story = {
  name: "GlassTrophyCase",
  render: () => (
    <div style={stageStyle}>
      <GlassTrophyCaseComponent enableSound={false} showProgress />
    </div>
  ),
};
