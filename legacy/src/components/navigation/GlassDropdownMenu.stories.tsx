import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { GlassButton } from "../button/GlassButton";
import {
  GlassDropdownMenu,
  GlassDropdownMenuCheckboxItem,
  GlassDropdownMenuContent,
  GlassDropdownMenuItem,
  GlassDropdownMenuLabel,
  GlassDropdownMenuRadioGroup,
  GlassDropdownMenuRadioItem,
  GlassDropdownMenuSeparator,
  GlassDropdownMenuShortcut,
  GlassDropdownMenuSub,
  GlassDropdownMenuSubContent,
  GlassDropdownMenuSubTrigger,
  GlassDropdownMenuTrigger,
} from "./GlassDropdownMenu";

const meta: Meta<typeof GlassDropdownMenu> = {
  title: "Navigation/Glass Dropdown Menu",
  component: GlassDropdownMenu,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A glass morphism dropdown menu system with various menu item types.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GlassDropdownMenu>;

const BasicDropdown = () => {
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [theme, setTheme] = useState("system");

  return (
    <GlassDropdownMenu defaultOpen className="glass-relative glass-w-56">
      <GlassDropdownMenuTrigger asChild>
        <GlassButton variant="outline">Open Menu</GlassButton>
      </GlassDropdownMenuTrigger>

      <GlassDropdownMenuContent
        className="glass-w-56"
        contained
        portalled={false}
      >
        <GlassDropdownMenuLabel>My Account</GlassDropdownMenuLabel>
        <GlassDropdownMenuSeparator />

        <GlassDropdownMenuItem>
          Profile
          <GlassDropdownMenuShortcut>⇧⌘P</GlassDropdownMenuShortcut>
        </GlassDropdownMenuItem>

        <GlassDropdownMenuSub defaultOpen>
          <GlassDropdownMenuSubTrigger>More tools</GlassDropdownMenuSubTrigger>
          <GlassDropdownMenuSubContent
            contained
            portalled={false}
            className="glass-mt-2 glass-w-full"
            style={{ position: "relative", left: 0, top: 0, transform: "none" }}
          >
            <GlassDropdownMenuItem>Import workspace</GlassDropdownMenuItem>
          </GlassDropdownMenuSubContent>
        </GlassDropdownMenuSub>

        <GlassDropdownMenuSeparator />

        <GlassDropdownMenuCheckboxItem
          checked={showStatusBar}
          onCheckedChange={setShowStatusBar}
        >
          Status Bar
        </GlassDropdownMenuCheckboxItem>

        <GlassDropdownMenuSeparator />

        <GlassDropdownMenuLabel>Theme</GlassDropdownMenuLabel>

        <GlassDropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <GlassDropdownMenuRadioItem value="light">
            Light
          </GlassDropdownMenuRadioItem>
          <GlassDropdownMenuRadioItem value="system">
            System
          </GlassDropdownMenuRadioItem>
        </GlassDropdownMenuRadioGroup>
      </GlassDropdownMenuContent>
    </GlassDropdownMenu>
  );
};

export const Default: Story = {
  render: () => <BasicDropdown />,
};

export const WithIcons: Story = {
  render: () => (
    <GlassDropdownMenu>
      <GlassDropdownMenuTrigger asChild>
        <GlassButton variant="outline">Menu with Icons</GlassButton>
      </GlassDropdownMenuTrigger>

      <GlassDropdownMenuContent className="w-56">
        <GlassDropdownMenuItem>
          <span className="glass-mr-2">📝</span>
          New File
          <GlassDropdownMenuShortcut>⌘N</GlassDropdownMenuShortcut>
        </GlassDropdownMenuItem>

        <GlassDropdownMenuItem>
          <span className="glass-mr-2">📁</span>
          Open Folder
          <GlassDropdownMenuShortcut>⌘O</GlassDropdownMenuShortcut>
        </GlassDropdownMenuItem>

        <GlassDropdownMenuSeparator />

        <GlassDropdownMenuItem>
          <span className="glass-mr-2">💾</span>
          Save
          <GlassDropdownMenuShortcut>⌘S</GlassDropdownMenuShortcut>
        </GlassDropdownMenuItem>

        <GlassDropdownMenuItem>
          <span className="glass-mr-2">🔄</span>
          Refresh
          <GlassDropdownMenuShortcut>⌘R</GlassDropdownMenuShortcut>
        </GlassDropdownMenuItem>
      </GlassDropdownMenuContent>
    </GlassDropdownMenu>
  ),
};

export const DestructiveItems: Story = {
  render: () => (
    <GlassDropdownMenu>
      <GlassDropdownMenuTrigger asChild>
        <GlassButton variant="outline">Actions</GlassButton>
      </GlassDropdownMenuTrigger>

      <GlassDropdownMenuContent className="w-56">
        <GlassDropdownMenuItem>
          <span className="glass-mr-2">✏️</span>
          Edit
        </GlassDropdownMenuItem>

        <GlassDropdownMenuItem>
          <span className="glass-mr-2">📋</span>
          Duplicate
        </GlassDropdownMenuItem>

        <GlassDropdownMenuSeparator />

        <GlassDropdownMenuItem variant="destructive">
          <span className="glass-mr-2">🗑️</span>
          Delete
        </GlassDropdownMenuItem>
      </GlassDropdownMenuContent>
    </GlassDropdownMenu>
  ),
};
