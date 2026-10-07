import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  GlassDrawingCanvas as GlassDrawingCanvasComponent,
  type DrawingStroke,
} from "./GlassDrawingCanvas";

const frameStyle: CSSProperties = {
  boxSizing: "border-box",
  maxWidth: "100%",
  minWidth: 0,
  width: "min(352px, calc(100vw - 32px))",
};

const previewStrokes: DrawingStroke[] = [
  {
    id: "story-horizon",
    timestamp: 1_725_000_000_000,
    tool: { type: "brush", color: "#526273", opacity: 0.76, size: 8 },
    points: [
      { x: 36, y: 156 },
      { x: 74, y: 132 },
      { x: 112, y: 142 },
      { x: 154, y: 104 },
      { x: 198, y: 120 },
      { x: 242, y: 82 },
      { x: 286, y: 96 },
    ],
  },
  {
    id: "story-detail",
    timestamp: 1_725_000_000_200,
    tool: { type: "pen", color: "#94a3b8", opacity: 0.9, size: 3 },
    points: [
      { x: 52, y: 190 },
      { x: 104, y: 178 },
      { x: 154, y: 188 },
      { x: 208, y: 166 },
      { x: 270, y: 178 },
    ],
  },
];

const meta = {
  title: "Effects + Advanced/Glass Drawing Canvas",
  component: GlassDrawingCanvasComponent,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    controls: {
      exclude: ["onChange", "onStrokeComplete", "onExport"],
    },
    docs: {
      description: {
        component:
          "The real GlassDrawingCanvas export with deterministic vector strokes on a compact, responsive working canvas. The read-only specimen keeps visual review stable without replacing the component's own material.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    availableTools: ["pen", "brush", "eraser"],
    backgroundColor: "#f8fafc",
    data: previewStrokes,
    gridSize: 24,
    height: 240,
    pressureSensitive: false,
    readOnly: true,
    respectMotionPreference: false,
    showGrid: true,
    showToolPanel: false,
    smoothStrokes: true,
    tool: { type: "pen", color: "#334155", opacity: 1, size: 3 },
    width: 320,
  },
} satisfies Meta<typeof GlassDrawingCanvasComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GlassDrawingCanvas: Story = {
  name: "GlassDrawingCanvas",
  render: (args) => (
    <div style={frameStyle}>
      <GlassDrawingCanvasComponent
        {...args}
        aria-label="Concept sketch canvas"
        data-testid="glass-drawing-canvas-story"
      />
    </div>
  ),
};
