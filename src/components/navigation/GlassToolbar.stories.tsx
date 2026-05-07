import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { Bell, Filter, Search, Share2 } from "lucide-react";
import { GlassButton } from "../button/GlassButton";
import { GlassToolbar } from "./GlassToolbar";

const meta: Meta<typeof GlassToolbar> = {
  title: 'Navigation/Glass Toolbar',
  component: GlassToolbar,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "A glass toolbar for app chrome, filters, and persistent page actions.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GlassToolbar>;

const ToolbarFrame = (args: ComponentProps<typeof GlassToolbar>) => (
  <div className="glass-min-h-screen glass-w-full glass-p-4 md:glass-p-8">
    <div className="glass-mx-auto glass-grid glass-max-w-5xl glass-gap-5">
      <GlassToolbar
        {...args}
        floating
        left={
          <div className="glass-flex glass-min-w-0 glass-items-center glass-gap-3">
            <div className="glass-grid glass-h-10 glass-w-10 glass-place-items-center glass-rounded-xl glass-bg-primary/15 glass-text-primary">
              AG
            </div>
            <div className="glass-min-w-0">
              <div className="glass-truncate glass-text-sm glass-font-semibold glass-text-primary">
                Launch workspace
              </div>
              <div className="glass-truncate glass-text-xs glass-text-secondary">
                Updated 4 minutes ago
              </div>
            </div>
          </div>
        }
        center={
          <div className="glass-hidden glass-items-center glass-gap-2 md:glass-flex">
            <GlassButton size="sm" variant="ghost" leftIcon={<Search size={15} />}>
              Search
            </GlassButton>
            <GlassButton size="sm" variant="ghost" leftIcon={<Filter size={15} />}>
              Filters
            </GlassButton>
          </div>
        }
        right={
          <>
            <GlassButton size="sm" variant="ghost" leftIcon={<Bell size={15} />}>
              Alerts
            </GlassButton>
            <GlassButton size="sm" leftIcon={<Share2 size={15} />}>
              Share
            </GlassButton>
          </>
        }
      />
      <section className="glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl">
        <h2 className="glass-m-0 glass-text-2xl glass-font-semibold glass-text-primary">
          Toolbar over working content
        </h2>
        <p className="glass-mt-2 glass-max-w-2xl glass-text-sm glass-text-secondary">
          The example keeps text truncation, wrapped actions, and mobile-safe spacing visible in the story canvas.
        </p>
      </section>
    </div>
  </div>
);

export const Default: Story = {
  render: (args) => <ToolbarFrame {...args} />,
};

export const Sticky: Story = {
  args: { sticky: true },
  render: (args) => <ToolbarFrame {...args} />,
};
