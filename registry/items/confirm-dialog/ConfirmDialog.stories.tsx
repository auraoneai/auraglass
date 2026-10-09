// ConfirmDialog.stories.tsx — showcase stories (kind 'showcase').
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "aura-glass";
import { ConfirmDialog } from "./index";
import { confirmNeutralProps, confirmDestructiveProps } from "./fixtures";

const meta: Meta<typeof ConfirmDialog> = {
  title: "cmp/items/confirm-dialog",
  component: ConfirmDialog,
  args: { ...confirmNeutralProps, defaultOpen: true },
  parameters: { ag: { subject: "confirm-dialog", kind: "showcase" } },
};
export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

export const Default: Story = {};
export const Destructive: Story = {
  args: { ...confirmDestructiveProps, defaultOpen: true },
};
export const WithTrigger: Story = {
  args: { defaultOpen: false, trigger: <Button>Delete project</Button> },
};
export const ForcedColors: Story = {
  parameters: { globals: { forcedColors: "active" } },
};
