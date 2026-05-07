import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { GlassMenubar, type MenuItem } from "./GlassMenubar";

const items: MenuItem[] = [
  {
    id: "file",
    label: "File",
    children: [
      { id: "new", label: "New campaign", shortcut: "Ctrl+N" },
      { id: "open", label: "Open workspace", shortcut: "Ctrl+O" },
      { id: "save", label: "Save", shortcut: "Ctrl+S" },
    ],
  },
  {
    id: "view",
    label: "View",
    children: [
      { id: "toolbar", label: "Show toolbar", type: "checkbox", checked: true },
      { id: "sidebar", label: "Show sidebar", type: "checkbox", checked: true },
    ],
  },
  {
    id: "help",
    label: "Help",
    children: [{ id: "shortcuts", label: "Keyboard shortcuts", shortcut: "?" }],
  },
];

const meta: Meta<typeof GlassMenubar> = {
  title: 'Navigation/Glass Menubar',
  component: GlassMenubar,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "A glass menubar with dropdown actions, shortcuts, and checkbox items.",
      },
    },
  },
  args: {
    items,
    orientation: "horizontal",
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof GlassMenubar>;

const MenubarFrame = (args: ComponentProps<typeof GlassMenubar>) => (
  <div className="glass-flex glass-min-h-screen glass-w-full glass-items-start glass-justify-center glass-p-6">
    <div className="glass-w-full glass-max-w-4xl glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-5 glass-shadow-2xl glass-backdrop-blur-xl">
      <GlassMenubar {...args} />
      <section className="glass-mt-5 glass-rounded-2xl glass-border glass-border-white/20 glass-bg-white/25 glass-p-5">
        <h2 className="glass-m-0 glass-text-xl glass-font-semibold glass-text-primary">Document workspace</h2>
        <p className="glass-mt-2 glass-text-sm glass-text-secondary">
          Dropdown content opens from a realistic toolbar surface with room to inspect menu alignment.
        </p>
      </section>
    </div>
  </div>
);

export const Default: Story = {
  render: (args) => <MenubarFrame {...args} />,
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  render: (args) => <MenubarFrame {...args} />,
};
