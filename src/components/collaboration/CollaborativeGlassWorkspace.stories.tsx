import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CollaborativeGlassWorkspace } from './CollaborativeGlassWorkspace';

const WorkspaceStoryFrame = ({ children }: { children: ReactNode }) => (
  <div
    className="collaborative-workspace-story-frame"
    style={{
      width: '100%',
      height: '100dvh',
      maxHeight: '100vh',
      minHeight: 0,
      minWidth: 0,
      boxSizing: 'border-box',
      overflow: 'hidden',
      color: 'inherit',
    }}
  >
    {children}
    <style>{`
      .collaborative-workspace-story-frame .glass-collaborative-workspace.workspace-glass-shell {
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.76), rgba(30, 41, 59, 0.68)), rgba(15, 23, 42, 0.76) !important;
        background-color: rgba(15, 23, 42, 0.76) !important;
        color: #f8fafc !important;
      }

      .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel {
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.78), rgba(30, 41, 59, 0.7)), rgba(15, 23, 42, 0.78) !important;
        background-color: rgba(15, 23, 42, 0.78) !important;
      }

      .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-inset,
      .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel button,
      .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel .workspace-glass-button {
        background: rgba(15, 23, 42, 0.7) !important;
        background-color: rgba(15, 23, 42, 0.7) !important;
      }

      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace.workspace-glass-shell {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.52), rgba(226, 232, 240, 0.42)), rgba(255, 255, 255, 0.46) !important;
        background-color: rgba(255, 255, 255, 0.46) !important;
        color: #0f172a !important;
      }

      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.68), rgba(226, 232, 240, 0.54)), rgba(255, 255, 255, 0.62) !important;
        background-color: rgba(255, 255, 255, 0.62) !important;
        border-color: rgba(15, 23, 42, 0.16) !important;
        color: #0f172a !important;
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
        color: #0f172a !important;
      }

      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-inset,
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel button,
      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-panel .workspace-glass-button {
        background: rgba(255, 255, 255, 0.62) !important;
        background-color: rgba(255, 255, 255, 0.62) !important;
        border-color: rgba(15, 23, 42, 0.18) !important;
        color: #0f172a !important;
      }

      [data-storybook-preview-mode="liquid"] .collaborative-workspace-story-frame .glass-collaborative-workspace .workspace-glass-button-primary {
        color: #f8fafc !important;
      }
    `}</style>
  </div>
);

const meta: Meta<typeof CollaborativeGlassWorkspace> = {
  title: 'Workflows/Collaborative Glass Workspace',
  component: CollaborativeGlassWorkspace,
  decorators: [
    (Story) => (
      <WorkspaceStoryFrame>
        <Story />
      </WorkspaceStoryFrame>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    previewSurface: 'app',
    docs: {
      description: {
        component: 'A complete real-time collaborative design environment with multi-user editing, voice chat, version control, and live cursors.'
      }
    }
  },
  argTypes: {
    layout: {
      control: { type: 'select', options: ['split', 'tabs', 'canvas-focused', 'editor-focused'] },
      description: 'Workspace layout mode'
    },
    theme: {
      control: { type: 'select', options: ['dark', 'light', 'auto'] },
      description: 'UI theme preference'
    },
    showMiniMap: {
      control: 'boolean',
      description: 'Show workspace minimap'
    },
    showOnlineUsers: {
      control: 'boolean',
      description: 'Show online users panel'
    },
    showCursors: {
      control: 'boolean',
      description: 'Show collaborative cursors'
    },
    enableVoiceChat: {
      control: 'boolean',
      description: 'Enable voice communication'
    },
    enableVersionControl: {
      control: 'boolean',
      description: 'Enable version control features'
    }
  }
};

export default meta;
type Story = StoryObj<typeof CollaborativeGlassWorkspace>;

export const Default: Story = {
  args: {
    workspaceId: 'demo-workspace-1',
    userId: 'user-demo-1',
    userName: 'Demo User',
    userEmail: 'demo@example.com',
    userRole: 'admin',
    layout: 'split',
    theme: 'dark',
    showMiniMap: true,
    showOnlineUsers: true,
    showCursors: true,
    enableVoiceChat: true,
    enableVersionControl: true,
    canvasWidth: 1200,
    canvasHeight: 800
  }
};

export const DesignStudio: Story = {
  args: {
    workspaceId: 'design-studio',
    userId: 'designer-1',
    userName: 'Design Pro',
    userEmail: 'designer@studio.com',
    userRole: 'admin',
    layout: 'canvas-focused',
    theme: 'dark',
    showMiniMap: true,
    showOnlineUsers: true,
    showCursors: true,
    enableVoiceChat: true,
    enableVersionControl: true,
    enableAdvancedEffects: true,
    canvasWidth: 1920,
    canvasHeight: 1080,
    gridSize: 15
  }
};

export const CodeCollaboration: Story = {
  args: {
    workspaceId: 'code-session',
    userId: 'developer-1',
    userName: 'Code Master',
    userEmail: 'dev@company.com',
    userRole: 'editor',
    layout: 'editor-focused',
    theme: 'dark',
    showMiniMap: false,
    showOnlineUsers: true,
    showCursors: true,
    enableVoiceChat: false,
    enableVersionControl: true,
    enableRealTimeSync: true
  }
};

export const MinimalWorkspace: Story = {
  args: {
    workspaceId: 'minimal-workspace',
    userId: 'user-minimal',
    userName: 'Minimal User',
    userEmail: 'minimal@example.com',
    userRole: 'viewer',
    layout: 'tabs',
    theme: 'light',
    showMiniMap: false,
    showOnlineUsers: false,
    showCursors: false,
    enableVoiceChat: false,
    enableVersionControl: false
  }
};

export const VoiceEnabled: Story = {
  args: {
    workspaceId: 'voice-workspace',
    userId: 'voice-user',
    userName: 'Voice User',
    userEmail: 'voice@example.com',
    userRole: 'admin',
    layout: 'split',
    theme: 'dark',
    showMiniMap: true,
    showOnlineUsers: true,
    showCursors: true,
    enableVoiceChat: true,
    enableScreenSharing: true,
    enableComments: true,
    enableVersionControl: true
  }
};
