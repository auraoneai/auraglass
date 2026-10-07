import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ProductionAIIntegration as ProductionAIIntegrationComponent } from "./ProductionAIIntegration";

const meta: Meta = {
  title: "AI + Intelligence/Production AI Integration",
  component: ProductionAIIntegrationComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "The actual ProductionAIIntegration export with optional backend initialization disabled for deterministic Storybook review.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

const stageStyle: CSSProperties = {
  alignItems: "center",
  background:
    "radial-gradient(circle at 18% 14%, rgba(255, 255, 255, 0.98), transparent 34%), radial-gradient(circle at 82% 82%, rgba(148, 163, 184, 0.18), transparent 32%), linear-gradient(145deg, #dfe5ec 0%, #f8fafc 50%, #e2e8f0 100%)",
  boxSizing: "border-box",
  display: "flex",
  justifyContent: "center",
  minHeight: "100dvh",
  padding: "clamp(16px, 4vw, 48px)",
  width: "100%",
};

export const ProductionAIIntegration: Story = {
  name: "ProductionAIIntegration",
  args: {
    disableServiceInitialization: true,
  },
  render: (args) => (
    <main data-bg="light" style={stageStyle}>
      <div style={{ minWidth: 0, width: "min(100%, 1040px)" }}>
        <ProductionAIIntegrationComponent
          {...args}
          className="glass-w-full"
          data-testid="production-ai-integration-story"
        />
      </div>
    </main>
  ),
};
