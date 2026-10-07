import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ContemplativeAnimation as ContemplativeAnimationComponent,
  EnergeticAnimation as EnergeticAnimationComponent,
  GentleAnimation as GentleAnimationComponent,
  InteractiveAnimation as InteractiveAnimationComponent,
  OrganicAnimationEngine as OrganicAnimationEngineComponent,
} from "./OrganicAnimationEngine";

const meta: Meta<typeof OrganicAnimationEngineComponent> = {
  title: "Foundations/Motion/Organic Animation Engine",
  component: OrganicAnimationEngineComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "Direct coverage for OrganicAnimationEngine and its four specialized public animation exports using fixed motion settings and neutral liquid-glass content.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    children: null,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const stageStyle: CSSProperties = {
  alignItems: "center",
  background:
    "radial-gradient(circle at 20% 16%, rgba(255, 255, 255, 0.98), transparent 35%), radial-gradient(circle at 80% 78%, rgba(255, 255, 255, 0.42), transparent 32%), linear-gradient(145deg, #f4f4f3 0%, #fafafa 52%, #e7e7e5 100%)",
  boxSizing: "border-box",
  display: "flex",
  justifyContent: "center",
  minHeight: "100dvh",
  padding: "clamp(20px, 5vw, 64px)",
  width: "100%",
};

const deterministicMotionProps = {
  enableAdaptiveSpeed: false,
  enableMicroInteractions: false,
  enablePhysics: false,
  performanceLevel: "low" as const,
  showDebugHud: false,
};

function StoryFrame({ children }: { children: ReactNode }) {
  return (
    <main data-bg="light" style={stageStyle}>
      <div style={{ minWidth: 0, width: "min(100%, 680px)" }}>{children}</div>
    </main>
  );
}

function MotionSpecimen({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <article className="glass-p-8 glass-space-y-4">
      <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-tertiary">
        {eyebrow}
      </p>
      <h2 className="glass-text-3xl glass-font-semibold glass-text-primary">
        {title}
      </h2>
      <p className="glass-text-base glass-leading-relaxed glass-text-secondary">
        {description}
      </p>
    </article>
  );
}

const engineClassName =
  "glass-foundation-complete glass-bg-black/20 glass-w-full glass-radius-2xl glass-shadow-soft-xl";

export const OrganicAnimationEngine: Story = {
  name: "OrganicAnimationEngine",
  render: () => (
    <StoryFrame>
      <OrganicAnimationEngineComponent
        {...deterministicMotionProps}
        emotionalContext="calm"
        sequences={[]}
        className={engineClassName}
      >
        <MotionSpecimen
          eyebrow="Deterministic baseline"
          title="Organic motion, held at rest"
          description="The public engine is mounted directly with its physics and interaction channels disabled so material geometry can be inspected consistently at every viewport."
        />
      </OrganicAnimationEngineComponent>
    </StoryFrame>
  ),
};

export const GentleAnimation: Story = {
  name: "GentleAnimation",
  render: () => (
    <StoryFrame>
      <GentleAnimationComponent
        {...deterministicMotionProps}
        emotionalContext="calm"
        className={engineClassName}
      >
        <MotionSpecimen
          eyebrow="Gentle sequence"
          title="A quiet breathing rhythm"
          description="The specialized gentle export applies its predefined calm sequence to the same bounded, neutral liquid-glass surface."
        />
      </GentleAnimationComponent>
    </StoryFrame>
  ),
};

export const EnergeticAnimation: Story = {
  name: "EnergeticAnimation",
  render: () => (
    <StoryFrame>
      <EnergeticAnimationComponent
        {...deterministicMotionProps}
        emotionalContext="energetic"
        className={engineClassName}
      >
        <MotionSpecimen
          eyebrow="Energetic sequence"
          title="Responsive motion with restraint"
          description="The energetic public export is rendered without pointer-driven physics, keeping its authored sequence isolated and reviewable."
        />
      </EnergeticAnimationComponent>
    </StoryFrame>
  ),
};

export const InteractiveAnimation: Story = {
  name: "InteractiveAnimation",
  render: () => (
    <StoryFrame>
      <InteractiveAnimationComponent
        {...deterministicMotionProps}
        emotionalContext="focused"
        className={engineClassName}
      >
        <MotionSpecimen
          eyebrow="Interaction sequence"
          title="Focused by design"
          description="The real interactive wrapper remains mounted while hover, click, and physics responses are intentionally disabled for a stable baseline."
        />
      </InteractiveAnimationComponent>
    </StoryFrame>
  ),
};

export const ContemplativeAnimation: Story = {
  name: "ContemplativeAnimation",
  render: () => (
    <StoryFrame>
      <ContemplativeAnimationComponent
        {...deterministicMotionProps}
        emotionalContext="contemplative"
        className={engineClassName}
      >
        <MotionSpecimen
          eyebrow="Contemplative sequence"
          title="Slow movement, clear hierarchy"
          description="The contemplative public export uses its authored drift sequence over a responsive surface with no decorative color contamination."
        />
      </ContemplativeAnimationComponent>
    </StoryFrame>
  ),
};
