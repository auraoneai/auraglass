import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useRef, type ReactNode } from "react";
import {
  GlassAchievementDashboard as GlassAchievementDashboardComponent,
  GlassAchievementNotifications as GlassAchievementNotificationsComponent,
  GlassAchievementProvider as GlassAchievementProviderComponent,
  GlassAchievementSystem as GlassAchievementSystemComponent,
  useAchievements,
} from "./GlassAchievementSystem";

const meta: Meta = {
  title: "Effects + Advanced/Glass Achievement System",
  component: GlassAchievementSystemComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "The real achievement exports, mounted individually with live provider state and deterministic Storybook content.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

const Scene = ({ children }: { children: ReactNode }) => (
  <main
    style={{
      minHeight: "100vh",
      padding: "clamp(1.25rem, 5vw, 4rem)",
      color: "rgba(15, 23, 42, 0.92)",
      background:
        "radial-gradient(circle at 82% 12%, rgba(255, 255, 255, 0.98), transparent 32%), linear-gradient(145deg, #ececec 0%, #fafafa 50%, #e2e2e2 100%)",
    }}
  >
    <div style={{ width: "min(100%, 58rem)", margin: "0 auto" }}>
      {children}
    </div>
  </main>
);

const DemoSurface = ({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) => (
  <section className="glass-surface-primary glass-blur-backdrop glass-border glass-border-white/20 glass-radius-2xl glass-p-6 glass-space-y-3">
    <p className="glass-text-xs glass-text-tertiary glass-uppercase glass-tracking-wide">
      {eyebrow}
    </p>
    <h2 className="glass-text-2xl glass-text-primary glass-font-semibold">
      {title}
    </h2>
    <p className="glass-text-sm glass-text-secondary">
      {children ??
        "Progress, unlocks, and rewards update through live context."}
    </p>
  </section>
);

function AchievementProviderConsumer() {
  const { progress, notifications } = useAchievements();

  return (
    <DemoSurface
      eyebrow="Live provider context"
      title={progress ? `Level ${progress.level}` : "Calibrating progress"}
    >
      {progress?.stats.totalInteractions ?? 0} interactions and{" "}
      {notifications.length} queued notifications.
    </DemoSurface>
  );
}

function NotificationTrigger() {
  const { progress, recordAction } = useAchievements();
  const triggered = useRef(false);

  useEffect(() => {
    if (!progress || triggered.current) return;
    triggered.current = true;
    recordAction("click", { component: "storybook-achievement-preview" });
  }, [progress, recordAction]);

  return (
    <>
      <DemoSurface eyebrow="Live notification" title="Achievement unlocked">
        The actual notification export is triggered from the achievement engine
        after its provider initializes.
      </DemoSurface>
      <GlassAchievementNotificationsComponent position="top-right" />
    </>
  );
}

export const GlassAchievementSystem: Story = {
  name: "GlassAchievementSystem",
  render: () => (
    <Scene>
      <GlassAchievementSystemComponent
        userId={`storybook-achievement-system-${Date.now()}`}
        showDashboard={false}
        showNotifications={false}
      />
    </Scene>
  ),
};

export const GlassAchievementProvider: Story = {
  name: "GlassAchievementProvider",
  render: () => (
    <Scene>
      <GlassAchievementProviderComponent
        userId={`storybook-achievement-provider-${Date.now()}`}
      >
        <AchievementProviderConsumer />
      </GlassAchievementProviderComponent>
    </Scene>
  ),
};

export const GlassAchievementDashboard: Story = {
  name: "GlassAchievementDashboard",
  render: () => (
    <Scene>
      <DemoSurface eyebrow="Achievement telemetry" title="Progress dashboard">
        The actual dashboard export is mounted below with live initialized
        progress.
      </DemoSurface>
      <GlassAchievementProviderComponent
        userId={`storybook-achievement-dashboard-${Date.now()}`}
      >
        <GlassAchievementDashboardComponent show />
      </GlassAchievementProviderComponent>
    </Scene>
  ),
};

export const GlassAchievementNotifications: Story = {
  name: "GlassAchievementNotifications",
  render: () => (
    <Scene>
      <GlassAchievementProviderComponent
        userId={`storybook-achievement-notifications-${Date.now()}`}
      >
        <NotificationTrigger />
      </GlassAchievementProviderComponent>
    </Scene>
  ),
};
