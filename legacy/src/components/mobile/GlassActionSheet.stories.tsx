import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  GlassActionSheet as GlassActionSheetComponent,
  type GlassActionSheetAction,
} from "./GlassActionSheet";

const stableActions: GlassActionSheetAction[] = [
  {
    label: "Save to reading list",
    onAction: () => undefined,
  },
  {
    label: "Copy link",
    onAction: () => undefined,
  },
  {
    label: "Add a reminder",
    onAction: () => undefined,
  },
];

const storybookPortalCompatibility = `
  body > [role="presentation"]:has(> .ag-action-sheet-story-dialog) {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    transition-property: background-color;
    transition-duration: 300ms;
  }

  body > [role="presentation"]:has(> .ag-action-sheet-story-dialog.bg-black\\/40) {
    background: rgba(0, 0, 0, 0.4);
  }

  body > [role="presentation"] > .ag-action-sheet-story-dialog {
    box-sizing: border-box;
    width: 100%;
    max-width: 42rem;
    margin-inline: auto;
    padding-bottom: env(safe-area-inset-bottom, 0px);
    transition: transform 300ms ease-out;
  }

  body > [role="presentation"] > .ag-action-sheet-story-dialog.translate-y-0 {
    transform: translateY(0);
  }

  body > [role="presentation"] > .ag-action-sheet-story-dialog.translate-y-full {
    transform: translateY(100%);
  }

  .ag-action-sheet-story-dialog .overflow-hidden {
    overflow: hidden;
  }

  .ag-action-sheet-story-dialog button.w-full {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }
`;

const meta = {
  title: "Effects + Advanced/Glass Action Sheet",
  component: GlassActionSheetComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    controls: {
      exclude: ["actions", "onClose"],
    },
    docs: {
      description: {
        component:
          "A mobile action sheet rendered open with its real glass panels, action rows, and cancel affordance.",
      },
    },
  },
  args: {
    open: true,
    onClose: () => undefined,
    title: "Share this article",
    message: "Choose what you would like to do with this story.",
    actions: stableActions,
    showCancel: true,
    cancelText: "Cancel",
    elevation: "level4",
    closeOnBackdrop: false,
    animationDuration: 300,
    material: "glass",
    className: "ag-action-sheet-story-dialog",
    "aria-label": "Article actions",
  },
} satisfies Meta<typeof GlassActionSheetComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GlassActionSheet: Story = {
  render: (args) => (
    <>
      <style>{storybookPortalCompatibility}</style>
      <div
        style={{
          minHeight: "100vh",
          padding: "48px",
          color: "rgba(15, 23, 42, 0.92)",
          background:
            "linear-gradient(145deg, rgb(236, 241, 246) 0%, rgb(250, 252, 254) 48%, rgb(225, 232, 239) 100%)",
        }}
      >
        <div style={{ maxWidth: 560 }}>
          <p className="glass-text-xs glass-font-medium glass-tracking-wide glass-uppercase">
            Weekend edition
          </p>
          <h2 className="glass-mt-3 glass-text-3xl glass-font-semibold">
            Designing calmer digital spaces
          </h2>
          <p className="glass-mt-3 glass-text-base" style={{ opacity: 0.72 }}>
            A quiet canvas behind the sheet makes its edge treatment and
            material response easy to inspect.
          </p>
        </div>
        <GlassActionSheetComponent {...args} />
      </div>
    </>
  ),
};
