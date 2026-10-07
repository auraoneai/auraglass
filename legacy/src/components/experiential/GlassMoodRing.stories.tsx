import type { Meta, StoryObj } from "@storybook/react";
import {
  GlassMoodRing as GlassMoodRingComponent,
  type MoodState,
} from "./GlassMoodRing";

const meta = {
  title: "Reference/Legacy Components/Glass Mood Ring",
  component: GlassMoodRingComponent,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A direct rendering of GlassMoodRing in a restrained neutral state, with its semantic accent confined to the ring rather than the glass material.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassMoodRingComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const composedMood: MoodState = {
  name: "Composed",
  color: "#475569",
  description: "Clear, balanced, and ready to focus",
  intensity: 0.42,
};

export const GlassMoodRing: Story = {
  args: {
    mood: composedMood,
  },
  render: () => (
    <main
      style={{
        alignItems: "center",
        background:
          "radial-gradient(circle at 22% 14%, rgba(255, 255, 255, 0.98), transparent 36%), radial-gradient(circle at 78% 82%, rgba(214, 213, 210, 0.42), transparent 34%), linear-gradient(145deg, #fafaf9 0%, #e8e7e4 100%)",
        boxSizing: "border-box",
        color: "rgba(15, 23, 42, 0.92)",
        display: "flex",
        justifyContent: "center",
        minHeight: "100dvh",
        overflow: "auto",
        padding: "clamp(20px, 5vw, 64px)",
        width: "100%",
      }}
    >
      <GlassMoodRingComponent
        animated={false}
        glowIntensity="subtle"
        interactive={false}
        mood={composedMood}
        moodStates={[composedMood]}
        pulse={false}
        showDescription
        showLabels
        size="xl"
      />
    </main>
  ),
};
