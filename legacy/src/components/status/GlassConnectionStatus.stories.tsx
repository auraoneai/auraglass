import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassConnectionStatus as GlassConnectionStatusComponent } from "./GlassConnectionStatus";

const frameStyle: CSSProperties = {
  alignItems: "center",
  boxSizing: "border-box",
  display: "flex",
  justifyContent: "center",
  maxWidth: "100%",
  minWidth: 0,
  padding: "clamp(4px, 2vw, 12px)",
  width: "min(360px, calc(100vw - 32px))",
};

const connectionLabels = {
  offline: "Connection unavailable",
  online: "Private relay connected",
  slow: "Limited connection",
} as const;

const meta = {
  title: "Reference/Legacy Components/Glass Connection Status",
  component: GlassConnectionStatusComponent,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    controls: {
      exclude: ["onStatusChange"],
    },
    docs: {
      description: {
        component:
          "The real GlassConnectionStatus export in a stable inline state, using a restrained semantic signal over the component's neutral liquid-glass material.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    animate: false,
    autoHideDelay: 0,
    elevation: "level3",
    labels: connectionLabels,
    position: "inline",
    showQuality: false,
    showText: true,
    size: "lg",
    status: "online",
  },
} satisfies Meta<typeof GlassConnectionStatusComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GlassConnectionStatus: Story = {
  name: "GlassConnectionStatus",
  render: (args) => (
    <div style={frameStyle}>
      <GlassConnectionStatusComponent
        {...args}
        aria-label="Network connection status"
        data-testid="glass-connection-status-story"
      />
    </div>
  ),
};
