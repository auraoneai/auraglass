import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import {
  GlassMenuPrimitive as GlassMenuPrimitiveNamespace,
  GlassMenuPrimitiveContent as GlassMenuPrimitiveContentComponent,
  GlassMenuPrimitiveItem as GlassMenuPrimitiveItemComponent,
  GlassMenuPrimitiveRoot as GlassMenuPrimitiveRootComponent,
} from "./GlassMenuPrimitive";

const namespaceDismiss = fn();
const namedDismiss = fn();

const meta = {
  title: "Navigation/Glass Menu Primitive",
  component: GlassMenuPrimitiveRootComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "Direct coverage for the GlassMenuPrimitive namespace and its exported Root, Content, and Item components.",
      },
    },
  },
} satisfies Meta<typeof GlassMenuPrimitiveRootComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GlassMenuPrimitive: Story = {
  name: "GlassMenuPrimitive",
  render: () => (
    <div
      className="glass-grid glass-w-full glass-gap-4 glass-p-4"
      style={{
        minHeight: "100vh",
        alignContent: "center",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      }}
    >
      <section className="glass-mx-auto glass-w-full glass-max-w-md glass-space-y-3">
        <h2 className="glass-m-0 glass-text-lg glass-font-semibold glass-text-primary">
          Namespace API
        </h2>
        <GlassMenuPrimitiveNamespace.Root
          orientation="vertical"
          aria-label="Workspace actions"
          className="glass-w-full"
        >
          <GlassMenuPrimitiveNamespace.Content
            positionStrategy="contained"
            onDismiss={namespaceDismiss}
          >
            <GlassMenuPrimitiveNamespace.Item className="glass-px-3 glass-py-2">
              Open workspace
              <span className="glass-text-xs glass-text-secondary">Enter</span>
            </GlassMenuPrimitiveNamespace.Item>
            <GlassMenuPrimitiveNamespace.Item className="glass-px-3 glass-py-2">
              Duplicate view
              <span className="glass-text-xs glass-text-secondary">⌘D</span>
            </GlassMenuPrimitiveNamespace.Item>
            <GlassMenuPrimitiveNamespace.Item
              className="glass-px-3 glass-py-2"
              disabled
            >
              Archive locked view
            </GlassMenuPrimitiveNamespace.Item>
          </GlassMenuPrimitiveNamespace.Content>
        </GlassMenuPrimitiveNamespace.Root>
      </section>

      <section className="glass-mx-auto glass-w-full glass-max-w-md glass-space-y-3">
        <h2 className="glass-m-0 glass-text-lg glass-font-semibold glass-text-primary">
          Named exports
        </h2>
        <GlassMenuPrimitiveRootComponent
          orientation="vertical"
          aria-label="Document actions"
          className="glass-w-full"
        >
          <GlassMenuPrimitiveContentComponent
            positionStrategy="contained"
            onDismiss={namedDismiss}
          >
            <GlassMenuPrimitiveItemComponent className="glass-px-3 glass-py-2">
              Share document
            </GlassMenuPrimitiveItemComponent>
            <GlassMenuPrimitiveItemComponent className="glass-px-3 glass-py-2">
              Export snapshot
            </GlassMenuPrimitiveItemComponent>
          </GlassMenuPrimitiveContentComponent>
        </GlassMenuPrimitiveRootComponent>
      </section>
    </div>
  ),
};

export const GlassMenuPrimitiveRoot: Story = {
  name: "GlassMenuPrimitiveRoot",
  render: () => (
    <div className="glass-mx-auto glass-w-full glass-max-w-md glass-p-4">
      <GlassMenuPrimitiveRootComponent
        aria-label="Root-only navigation menu"
        className="glass-w-full"
      >
        <GlassMenuPrimitiveContentComponent
          positionStrategy="contained"
          aria-label="Root-contained actions"
        >
          <GlassMenuPrimitiveItemComponent className="glass-px-3 glass-py-2">
            Root-contained action
          </GlassMenuPrimitiveItemComponent>
        </GlassMenuPrimitiveContentComponent>
      </GlassMenuPrimitiveRootComponent>
    </div>
  ),
};

export const GlassMenuPrimitiveContent: Story = {
  name: "GlassMenuPrimitiveContent",
  render: () => (
    <div className="glass-mx-auto glass-w-full glass-max-w-md glass-p-4">
      <GlassMenuPrimitiveContentComponent
        positionStrategy="contained"
        onDismiss={namedDismiss}
        aria-label="Contained menu content"
      >
        <GlassMenuPrimitiveItemComponent className="glass-px-3 glass-py-2">
          Content-contained action
        </GlassMenuPrimitiveItemComponent>
      </GlassMenuPrimitiveContentComponent>
    </div>
  ),
};

export const GlassMenuPrimitiveItem: Story = {
  name: "GlassMenuPrimitiveItem",
  render: () => (
    <div className="glass-mx-auto glass-w-full glass-max-w-md glass-p-4">
      <GlassMenuPrimitiveRootComponent
        aria-label="Menu item example"
        className="glass-w-full"
      >
        <GlassMenuPrimitiveContentComponent
          positionStrategy="contained"
          aria-label="Item export menu"
        >
          <GlassMenuPrimitiveItemComponent className="glass-px-3 glass-py-2">
            Individually exported menu item
            <span className="glass-text-xs glass-text-secondary">⌘I</span>
          </GlassMenuPrimitiveItemComponent>
        </GlassMenuPrimitiveContentComponent>
      </GlassMenuPrimitiveRootComponent>
    </div>
  ),
};
