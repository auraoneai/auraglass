import type { Meta, StoryObj } from "@storybook/react";
import { InstallCommand } from "./InstallCommand";

const meta: Meta<typeof InstallCommand> = {
  title: "Marketing/Install Command",
  component: InstallCommand,
  parameters: { layout: "centered" },
  argTypes: {
    packageManager: {
      control: "select",
      options: ["npm", "pnpm", "yarn", "bun"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof InstallCommand>;

export const Npm: Story = {
  args: {
    packageManager: "npm",
  },
};

export const CustomCommand: Story = {
  args: {
    command: "npm install auraglass@latest",
    copiedLabel: "Copied",
  },
};
