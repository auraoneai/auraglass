import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  CollaborativeGlassWorkspace,
  GlassTeamCursors as GlassTeamCursorsComponent,
  GlassTeamCursorsWithEffects as GlassTeamCursorsWithEffectsComponent,
} from "./CollaborativeGlassWorkspace";

const WorkspaceStoryFrame = ({ children }: { children: ReactNode }) => (
  <div
    className="collaborative-workspace-story-frame"
    style={{
      width: "100%",
      height: "100dvh",
      maxHeight: "100vh",
      minHeight: 0,
      minWidth: 0,
      boxSizing: "border-box",
      overflow: "hidden",
      color: "inherit",
    }}
  >
    {children}
    <style>{`
      .collaborative-workspace-story-frame .glass-collaborative-workspace.workspace-glass-shell {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2)), rgba(255, 255, 255, 0.28) !important;
        background-color: rgba(255, 255, 255, 0.28) !important;
        color: rgba(15, 23, 42, 0.85) !important;
      }

      .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.24)), rgba(255, 255, 255, 0.3) !important;
        background-color: rgba(255, 255, 255, 0.3) !important;
      }

      .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-inset,
      .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel button,
      .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel .workspace-glass-button {
        background: rgba(255, 255, 255, 0.14) !important;
        background-color: rgba(255, 255, 255, 0.14) !important;
      }

      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace.workspace-glass-shell {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.24)), rgba(255, 255, 255, 0.3) !important;
        background-color: rgba(255, 255, 255, 0.3) !important;
        color: rgba(15, 23, 42, 0.85) !important;
      }

      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.24)), rgba(255, 255, 255, 0.3) !important;
        background-color: rgba(255, 255, 255, 0.3) !important;
        border-color: rgba(255, 255, 255, 0.32) !important;
        color: rgba(15, 23, 42, 0.85) !important;
      }

      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel .glass-text-primary,
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel .glass-text-secondary,
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel .glass-text-tertiary,
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel [class*="glass-text-primary"],
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel [class*="glass-text-secondary"],
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel label,
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel div,
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel p,
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel span {
        color: rgba(15, 23, 42, 0.85) !important;
      }

      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-inset,
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel button,
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel .workspace-glass-button {
        background: rgba(255, 255, 255, 0.18) !important;
        background-color: rgba(255, 255, 255, 0.18) !important;
        border-color: rgba(255, 255, 255, 0.32) !important;
        color: rgba(15, 23, 42, 0.85) !important;
      }

      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-button-primary {
        color: rgba(255, 255, 255, 0.95) !important;
      }
    `}</style>
  </div>
);

const meta: Meta<typeof CollaborativeGlassWorkspace> = {
  title: "Workflows/Collaborative Glass Workspace",
  component: CollaborativeGlassWorkspace,
  decorators: [
    (Story) => (
      <WorkspaceStoryFrame>
        <Story />
      </WorkspaceStoryFrame>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "A complete real-time collaborative design environment with multi-user editing, voice chat, version control, and live cursors.",
      },
    },
  },
  argTypes: {
    layout: {
      control: {
        type: "select",
        options: ["split", "tabs", "canvas-focused", "editor-focused"],
      },
      description: "Workspace layout mode",
    },
    theme: {
      control: { type: "select", options: ["dark", "light", "auto"] },
      description: "UI theme preference",
    },
    showMiniMap: {
      control: "boolean",
      description: "Show workspace minimap",
    },
    showOnlineUsers: {
      control: "boolean",
      description: "Show online users panel",
    },
    showCursors: {
      control: "boolean",
      description: "Show collaborative cursors",
    },
    enableVoiceChat: {
      control: "boolean",
      description: "Enable voice communication",
    },
    enableVersionControl: {
      control: "boolean",
      description: "Enable version control features",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CollaborativeGlassWorkspace>;

export const Default: Story = {
  args: {
    workspaceId: "demo-workspace-1",
    userId: "user-demo-1",
    userName: "Demo User",
    userEmail: "demo@example.com",
    userRole: "admin",
    layout: "split",
    theme: "dark",
    showMiniMap: true,
    showOnlineUsers: true,
    showCursors: true,
    enableVoiceChat: true,
    enableVersionControl: true,
    canvasWidth: 1200,
    canvasHeight: 800,
  },
};

export const GlassTeamCursors: Story = {
  render: () => (
    <div
      className="glass-relative glass-h-full glass-min-h-80 glass-w-full glass-overflow-hidden glass-radius-3xl glass-neutral-level1"
      aria-label="Team cursor collaboration canvas"
    >
      <GlassTeamCursorsComponent
        showNames
        showVoiceIndicators
        glassLevel="medium"
      />
    </div>
  ),
};

export const GlassTeamCursorsWithEffects: Story = {
  render: () => (
    <div
      className="glass-relative glass-h-full glass-min-h-80 glass-w-full glass-overflow-hidden glass-radius-3xl glass-neutral-level1"
      aria-label="Team cursor effects collaboration canvas"
    >
      <GlassTeamCursorsWithEffectsComponent
        showNames
        showVoiceIndicators
        enableRippleEffect
        enableGlowEffect
      />
    </div>
  ),
};

export const DesignStudio: Story = {
  args: {
    workspaceId: "design-studio",
    userId: "designer-1",
    userName: "Design Pro",
    userEmail: "designer@studio.com",
    userRole: "admin",
    layout: "canvas-focused",
    theme: "dark",
    showMiniMap: true,
    showOnlineUsers: true,
    showCursors: true,
    enableVoiceChat: true,
    enableVersionControl: true,
    enableAdvancedEffects: true,
    canvasWidth: 1920,
    canvasHeight: 1080,
    gridSize: 15,
  },
};

export const CodeCollaboration: Story = {
  args: {
    workspaceId: "code-session",
    userId: "developer-1",
    userName: "Code Master",
    userEmail: "dev@company.com",
    userRole: "editor",
    layout: "editor-focused",
    theme: "dark",
    showMiniMap: false,
    showOnlineUsers: true,
    showCursors: true,
    enableVoiceChat: false,
    enableVersionControl: true,
    enableRealTimeSync: true,
  },
};

export const MinimalWorkspace: Story = {
  args: {
    workspaceId: "minimal-workspace",
    userId: "user-minimal",
    userName: "Minimal User",
    userEmail: "minimal@example.com",
    userRole: "viewer",
    layout: "tabs",
    theme: "light",
    showMiniMap: false,
    showOnlineUsers: false,
    showCursors: false,
    enableVoiceChat: false,
    enableVersionControl: false,
  },
};

export const VoiceEnabled: Story = {
  args: {
    workspaceId: "voice-workspace",
    userId: "voice-user",
    userName: "Voice User",
    userEmail: "voice@example.com",
    userRole: "admin",
    layout: "split",
    theme: "dark",
    showMiniMap: true,
    showOnlineUsers: true,
    showCursors: true,
    enableVoiceChat: true,
    enableScreenSharing: true,
    enableComments: true,
    enableVersionControl: true,
  },
};
