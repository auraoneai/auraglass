import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BarChart3, Home, Menu, Settings, Users } from "lucide-react";
import { GlassButton } from "../button/GlassButton";
import { GlassMobileNav, type MobileNavSection } from "./GlassMobileNav";

const navigation: MobileNavSection[] = [
  {
    id: "primary",
    label: "Workspace",
    items: [
      { id: "home", label: "Home", icon: <Home size={18} />, href: "/home" },
      { id: "audience", label: "Audience", icon: <Users size={18} />, href: "/audience", badge: "12", badgeVariant: "primary" },
      { id: "metrics", label: "Metrics", icon: <BarChart3 size={18} />, href: "/metrics" },
      { id: "settings", label: "Settings", icon: <Settings size={18} />, href: "/settings" },
    ],
  },
];

const meta: Meta<typeof GlassMobileNav> = {
  title: 'Navigation/Glass Mobile Nav',
  component: GlassMobileNav,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "A mobile glass navigation sheet with app context, backdrop, and scroll-safe menu content.",
      },
    },
  },
  args: {
    title: "Aura Workspace",
    activePath: "/audience",
    navigation,
    position: "left",
    variant: "overlay",
  },
};

export default meta;
type Story = StoryObj<typeof GlassMobileNav>;

const MobileNavFrame = (args: ComponentProps<typeof GlassMobileNav>) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="glass-relative glass-min-h-screen glass-w-full glass-overflow-hidden glass-p-4 md:glass-p-8">
      <div className="glass-mx-auto glass-max-w-4xl glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-5 glass-shadow-2xl glass-backdrop-blur-xl">
        <div className="glass-flex glass-items-center glass-justify-between glass-gap-3">
          <div>
            <h2 className="glass-m-0 glass-text-2xl glass-font-semibold glass-text-primary">Mobile shell</h2>
            <p className="glass-mt-1 glass-text-sm glass-text-secondary">The sheet opens inside a full app surface instead of a tiny centered trigger.</p>
          </div>
          <GlassButton leftIcon={<Menu size={16} />} onClick={() => setOpen(true)}>
            Menu
          </GlassButton>
        </div>
        <div className="glass-mt-5 glass-grid glass-gap-3 sm:glass-grid-cols-3">
          {["Live cohorts", "Delivery", "Approvals"].map((label) => (
            <div key={label} className="glass-rounded-2xl glass-border glass-border-white/20 glass-bg-white/25 glass-p-4">
              <div className="glass-text-sm glass-font-medium glass-text-primary">{label}</div>
              <div className="glass-text-xs glass-text-secondary">Navigation remains available.</div>
            </div>
          ))}
        </div>
      </div>
      <GlassMobileNav
        {...args}
        open={open}
        onOpenChange={setOpen}
        logo={<div className="glass-grid glass-h-9 glass-w-9 glass-place-items-center glass-rounded-xl glass-bg-primary/15">AG</div>}
        footer={<div className="glass-text-xs glass-text-secondary">Signed in as ops@auraglass.dev</div>}
      />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <MobileNavFrame {...args} />,
};

export const BottomSheet: Story = {
  args: {
    position: "bottom",
  },
  render: (args) => <MobileNavFrame {...args} />,
};
