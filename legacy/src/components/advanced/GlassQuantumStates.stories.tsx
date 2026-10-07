import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  GlassQuantumButton as GlassQuantumButtonComponent,
  GlassQuantumCoherenceIndicator as GlassQuantumCoherenceIndicatorComponent,
  GlassQuantumEntangledPair as GlassQuantumEntangledPairComponent,
  GlassQuantumStates as GlassQuantumStatesComponent,
  GlassQuantumStatesProvider as GlassQuantumStatesProviderComponent,
  QuantumInterferencePattern as QuantumInterferencePatternComponent,
  type QuantumButtonState,
} from "./GlassQuantumStates";

const meta = {
  title: "Effects + Advanced/Glass Quantum States",
  component: GlassQuantumStatesComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Direct, provider-backed stories for every visual GlassQuantumStates export with stable state identifiers and neutral liquid-glass surfaces.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassQuantumStatesComponent>;

export default meta;
type Story = StoryObj;

const stageStyle: CSSProperties = {
  boxSizing: "border-box",
  display: "grid",
  minHeight: "100vh",
  minWidth: 0,
  padding: "clamp(20px, 6vw, 72px)",
  placeItems: "center",
  width: "100%",
};

const panelStyle: CSSProperties = {
  maxWidth: 720,
  padding: "clamp(24px, 5vw, 44px)",
  width: "100%",
};

const buttonStates: QuantumButtonState[] = [
  {
    action: () => undefined,
    color: "rgba(255, 255, 255, 0.14)",
    label: "Plan",
  },
  {
    action: () => undefined,
    color: "rgba(255, 255, 255, 0.2)",
    label: "Review",
  },
  {
    action: () => undefined,
    color: "rgba(255, 255, 255, 0.26)",
    label: "Ship",
  },
];

const entangledStates = ["focused", "balanced", "exploratory"];

function StoryStage({ children }: { children: ReactNode }) {
  return (
    <div style={stageStyle}>
      <div style={{ minWidth: 0, width: "min(100%, 720px)" }}>{children}</div>
    </div>
  );
}

function QuantumPanel({
  children,
  eyebrow,
  title,
}: {
  children?: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <section
      className="glass-foundation-complete glass-radius-3xl glass-shadow-soft-xl"
      style={panelStyle}
    >
      <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-tertiary">
        {eyebrow}
      </p>
      <h2 className="glass-mt-2 glass-text-3xl glass-font-semibold glass-text-primary">
        {title}
      </h2>
      <p className="glass-mt-3 glass-text-base glass-leading-relaxed glass-text-secondary">
        Multiple potential interface states remain legible and calm until an
        explicit observation resolves the next action.
      </p>
      {children ? <div className="glass-mt-6">{children}</div> : null}
    </section>
  );
}

function QuantumButtonPreview({ stateId }: { stateId: string }) {
  return (
    <GlassQuantumStatesProviderComponent>
      <GlassQuantumButtonComponent
        possibleStates={buttonStates}
        stateId={stateId}
      >
        Resolve next step
      </GlassQuantumButtonComponent>
    </GlassQuantumStatesProviderComponent>
  );
}

export const GlassQuantumStates: Story = {
  name: "GlassQuantumStates",
  render: () => (
    <StoryStage>
      <GlassQuantumStatesComponent className="glass-w-full">
        <QuantumPanel eyebrow="Probabilistic interface" title="Quantum states">
          <GlassQuantumButtonComponent
            possibleStates={buttonStates}
            stateId="story-quantum-states"
          >
            Resolve next step
          </GlassQuantumButtonComponent>
        </QuantumPanel>
      </GlassQuantumStatesComponent>
    </StoryStage>
  ),
};

export const GlassQuantumStatesProvider: Story = {
  name: "GlassQuantumStatesProvider",
  render: () => (
    <StoryStage>
      <QuantumPanel eyebrow="Context established" title="State system ready">
        <QuantumButtonPreview stateId="story-quantum-provider" />
      </QuantumPanel>
    </StoryStage>
  ),
};

export const GlassQuantumButton: Story = {
  name: "GlassQuantumButton",
  render: () => (
    <StoryStage>
      <QuantumPanel
        eyebrow="Three possible outcomes"
        title="Observe to resolve"
      >
        <QuantumButtonPreview stateId="story-quantum-button" />
      </QuantumPanel>
    </StoryStage>
  ),
};

export const QuantumInterferencePattern: Story = {
  name: "QuantumInterferencePattern",
  render: () => (
    <StoryStage>
      <GlassQuantumStatesProviderComponent>
        <QuantumPanel eyebrow="Wave field" title="Interference pattern">
          <div className="glass-h-40 glass-w-full glass-overflow-hidden glass-radius-2xl glass-surface-subtle/10">
            <QuantumInterferencePatternComponent
              className="glass-h-full glass-w-full"
              height={160}
              speed={0}
              width={640}
            />
          </div>
        </QuantumPanel>
      </GlassQuantumStatesProviderComponent>
    </StoryStage>
  ),
};

export const GlassQuantumEntangledPair: Story = {
  name: "GlassQuantumEntangledPair",
  render: () => (
    <StoryStage>
      <GlassQuantumStatesProviderComponent>
        <QuantumPanel eyebrow="Linked state" title="Entangled workspaces">
          <GlassQuantumEntangledPairComponent
            className="glass-relative glass-w-full"
            entanglementStrength={0.8}
            entanglementType="positive"
            possibleStates={entangledStates}
            stateId1="story-entangled-planning"
            stateId2="story-entangled-delivery"
          >
            {[
              <div
                className="glass-foundation-complete glass-radius-2xl glass-p-5 glass-text-center"
                key="planning"
              >
                <p className="glass-text-sm glass-font-medium glass-text-primary">
                  Planning
                </p>
              </div>,
              <div
                className="glass-foundation-complete glass-radius-2xl glass-p-5 glass-text-center"
                key="delivery"
              >
                <p className="glass-text-sm glass-font-medium glass-text-primary">
                  Delivery
                </p>
              </div>,
            ]}
          </GlassQuantumEntangledPairComponent>
        </QuantumPanel>
      </GlassQuantumStatesProviderComponent>
    </StoryStage>
  ),
};

export const GlassQuantumCoherenceIndicator: Story = {
  name: "GlassQuantumCoherenceIndicator",
  render: () => (
    <StoryStage>
      <GlassQuantumStatesProviderComponent>
        <QuantumPanel eyebrow="Signal integrity" title="Coherence monitor">
          <GlassQuantumCoherenceIndicatorComponent stateId="story-coherence" />
        </QuantumPanel>
      </GlassQuantumStatesProviderComponent>
    </StoryStage>
  ),
};
