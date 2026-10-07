import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { PersonaPicker as PersonaPickerComponent } from "./PersonaPicker";

const meta = {
  title: "Foundations/Theming/Persona Picker",
  component: PersonaPickerComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "Direct coverage for the interactive PersonaPicker backed by the live ThemeProvider supplied by Storybook.",
      },
    },
  },
  args: {
    orientation: "auto",
    showMeta: true,
    compact: false,
    contained: true,
    maxHeight: "min(72vh, 620px)",
    onPersonaChange: fn(),
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["auto", "horizontal", "vertical"],
    },
    showMeta: { control: "boolean" },
    compact: { control: "boolean" },
    contained: { control: "boolean" },
  },
} satisfies Meta<typeof PersonaPickerComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PersonaPicker: Story = {
  name: "PersonaPicker",
  render: (args) => (
    <div
      className="glass-grid glass-w-full glass-p-4"
      style={{ minHeight: "100vh", placeItems: "center" }}
    >
      <section
        className="glass-foundation-complete glass-w-full glass-p-5"
        style={{ maxWidth: 960 }}
      >
        <PersonaPickerComponent {...args} />
      </section>
    </div>
  ),
};

export const CompactHorizontal: Story = {
  args: {
    orientation: "horizontal",
    showMeta: false,
    compact: true,
    maxHeight: 280,
  },
  render: (args) => (
    <div className="glass-w-full glass-p-4">
      <PersonaPickerComponent {...args} />
    </div>
  ),
};
