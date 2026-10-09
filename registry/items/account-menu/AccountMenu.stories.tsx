// AccountMenu.stories.tsx — showcase stories (kind 'showcase').
import type { Meta, StoryObj } from "@storybook/react";
import { AccountMenu } from "./index";
import { accountMenuProps } from "./fixtures";

const meta: Meta<typeof AccountMenu> = {
  title: "cmp/items/account-menu",
  component: AccountMenu,
  args: accountMenuProps,
  parameters: { ag: { subject: "account-menu", kind: "showcase" } },
};
export default meta;
type Story = StoryObj<typeof AccountMenu>;

export const Default: Story = {};
export const RTL: Story = { parameters: { globals: { dir: "rtl" } } };
export const ForcedColors: Story = {
  parameters: { globals: { forcedColors: "active" } },
};
