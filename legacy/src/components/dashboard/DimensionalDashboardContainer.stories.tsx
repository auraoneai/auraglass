import type { Meta, StoryObj } from "@storybook/react";
import * as DimensionalDashboardContainerModule from "./DimensionalDashboardContainer";
import { Glass } from "../../primitives";

const meta = {
  title: "Reference/Legacy Components/Dimensional Dashboard Container",
  component:
    DimensionalDashboardContainerModule.DimensionalDashboardContainer,
  parameters: {
    layout: "centered",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "The real dimensional container presenting a complete dashboard surface inside its perspective-aware scene.",
      },
    },
  },
} satisfies Meta<
  typeof DimensionalDashboardContainerModule.DimensionalDashboardContainer
>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DimensionalDashboardContainer: Story = {
  render: () => (
    <div
      style={{
        width: "min(780px, calc(100vw - 32px))",
        height: "min(500px, calc(100vh - 32px))",
        minWidth: 0,
        minHeight: 360,
      }}
    >
      <DimensionalDashboardContainerModule.DimensionalDashboardContainer
        perspective={1400}
        depth={72}
      >
        <Glass
          className="glass-h-full glass-w-full glass-p-6 glass-contrast-guard"
          style={{ boxSizing: "border-box" }}
        >
          <div
            style={{
              height: "100%",
              minWidth: 0,
              display: "grid",
              alignContent: "center",
              gap: 18,
            }}
          >
            <div>
              <span className="glass-text-xs glass-font-semibold glass-text-secondary">
                LIVE OVERVIEW
              </span>
              <h2 className="glass-text-2xl glass-font-semibold glass-text-primary glass-mt-2">
                Dimensional Operations
              </h2>
              <p className="glass-text-sm glass-text-secondary glass-mt-2">
                Perspective-aware content remains crisp, bounded, and fully
                interactive across the dashboard plane.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: 12,
              }}
            >
              {["12 active spaces", "99.98% available", "42 ms response"].map(
                (metric) => (
                  <div
                    key={metric}
                    className="glass-surface-subtle glass-radius-lg glass-border glass-border-subtle glass-p-4 glass-text-sm glass-text-primary"
                    style={{ minWidth: 0 }}
                  >
                    {metric}
                  </div>
                )
              )}
            </div>
          </div>
        </Glass>
      </DimensionalDashboardContainerModule.DimensionalDashboardContainer>
    </div>
  ),
};
