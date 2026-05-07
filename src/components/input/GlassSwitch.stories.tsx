import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Bell, ShieldCheck, Zap } from "lucide-react";
import { GlassSwitch } from "./GlassSwitch";

const meta: Meta<typeof GlassSwitch> = {
  title: 'Controls/Inputs/Glass Switch',
  component: GlassSwitch,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A glass switch for binary preferences with label, description, size, and validation states.",
      },
    },
  },
  args: {
    label: "Realtime alerts",
    description: "Notify operators when delivery health changes.",
    defaultChecked: true,
    variant: "info",
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof GlassSwitch>;

const SwitchFrame = (args: ComponentProps<typeof GlassSwitch>) => {
  const [checked, setChecked] = useState(args.checked ?? args.defaultChecked ?? true);

  return (
    <div className="glass-grid glass-w-[min(560px,calc(100vw-48px))] glass-gap-4 glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl">
      <GlassSwitch {...args} checked={checked} onChange={setChecked} />
      <div className="glass-grid glass-gap-3">
        <GlassSwitch label="Protected mode" description="Require approval for risky changes." defaultChecked variant="success" icons={{ checked: <ShieldCheck size={12} />, unchecked: <ShieldCheck size={12} /> }} />
        <GlassSwitch label="Performance boost" description="Use higher refresh frequency during launch windows." variant="warning" icons={{ checked: <Zap size={12} />, unchecked: <Zap size={12} /> }} />
        <GlassSwitch label="Muted digest" description="Paused while incident mode is active." disabled icons={{ checked: <Bell size={12} />, unchecked: <Bell size={12} /> }} />
      </div>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <SwitchFrame {...args} />,
};

export const Error: Story = {
  args: {
    label: "Public sharing",
    description: "Share dashboards outside the workspace.",
    error: "Workspace policy blocks external sharing.",
    variant: "error",
    defaultChecked: false,
  },
  render: (args) => <SwitchFrame {...args} />,
};
