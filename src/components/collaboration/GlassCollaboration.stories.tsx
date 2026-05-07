import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useEffect } from 'react';
import { CollaborationProvider, CollaborationUser, useCollaboration } from './GlassCollaborationProvider';
import { GlassCollaborativeCursor } from './GlassCollaborativeCursor';
import { GlassCollaborativeComments } from './GlassCollaborativeComments';
import { GlassCollaborationDashboard } from './GlassCollaborationDashboard';
import { Glass } from '../../primitives';

const meta: Meta = {
  title: 'Workflows/Glass Collaboration',
  decorators: [
    (Story) => (
      <CollaborationStoryFrame>
        <Story />
      </CollaborationStoryFrame>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    previewSurface: 'app',
    docs: {
      description: {
        component: 'Complete real-time collaboration system with live cursors, comments, user presence, and activity tracking - like Google Docs, Figma, or Miro.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const CollaborationStoryFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="glass-collaboration-story-frame"
    style={{
      width: '100%',
      height: '100dvh',
      maxHeight: '100vh',
      minHeight: 0,
      minWidth: 0,
      boxSizing: 'border-box',
      overflowX: 'hidden',
      overflowY: 'auto',
      color: 'inherit',
    }}
  >
    {children}
  </div>
);

// Bridge component to set current user via context with stable hook order
const CurrentUserBridge: React.FC<{ user: CollaborationUser | null }> = ({ user }) => {
  const { setCurrentUser } = useCollaboration();
  useEffect(() => {
    if (user) setCurrentUser(user);
  }, [user, setCurrentUser]);
  return null;
};

const CollaborationDemo: React.FC<{
  roomId: string;
  currentUser?: CollaborationUser;
  showCursors?: boolean;
  showComments?: boolean;
  showDashboard?: boolean;
}> = ({ 
  roomId, 
  currentUser,
  showCursors = true,
  showComments = true,
  showDashboard = true
}) => {
  const [user, setUser] = useState<CollaborationUser | null>(currentUser || null);

  // Auto-login for demo
  useEffect(() => {
    if (!user) {
      const demoUser: CollaborationUser = {
        id: `user-${Date.now()}`,
        name: 'Demo User',
        email: 'demo@example.com',
        color: 'var(--glass-color-primary)',
        lastActive: Date.now()
      };
      setUser(demoUser);
    }
  }, [user]);

  // Keep internal user in sync with prop changes (e.g., MultipleUsers story)
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser]);

  return (
    <CollaborationProvider roomId={roomId} enableRealTime={true}>
      <div className="glass-min-glass-h-screen glass-gradient-primary glass-gradient-primary via-white glass-gradient-primary glass-relative">
        {/* Header */}
        <div className="glass-relative glass-z-10 glass-p-8">
          <div className="max-w-4xl glass-mx-auto">
            <h1 className="glass-text-4xl glass-font-bold glass-text-secondary glass-mb-4">
              Real-Time Collaboration Demo
            </h1>
            <p className="glass-text-lg glass-text-secondary mb-8">
              Experience the future of collaborative work with live cursors, comments, and real-time activity tracking.
            </p>

            <div className="glass-grid glass-glass-grid-cols-1 lg:glass-glass-grid-cols-2 glass-gap-8">
              {/* Interactive Content Area */}
              <Glass className="glass-relative glass-p-8 glass-min-glass-h-96">
                <h2 className="glass-text-2xl glass-font-semibold glass-text-secondary glass-mb-4">
                  Interactive Workspace
                </h2>
                <p className="glass-text-secondary mb-6">
                  Double-click anywhere to add comments. Move your cursor to see live collaboration in action.
                </p>

                {/* Sample content to interact with */}
                <div className="space-y-6">
                  <div className="glass-p-4 glass-surface-subtle glass-radius-lg">
                    <h3 className="glass-font-semibold glass-text-primary glass-mb-2">Project Overview</h3>
                    <p className="glass-text-primary glass-text-sm">
                      This is a sample content area where you can add comments and see other users' cursors.
                      Try double-clicking on different parts of this text to leave comments.
                    </p>
                  </div>

                  <div className="glass-p-4 glass-surface-subtle glass-radius-lg">
                    <h3 className="glass-font-semibold glass-text-primary glass-mb-2">Features Implemented</h3>
                    <ul className="glass-text-primary glass-text-sm space-y-1">
                      <li>• Real-time cursor tracking</li>
                      <li>• Collaborative commenting system</li>
                      <li>• User presence indicators</li>
                      <li>• Activity feed and history</li>
                      <li>• Live connection status</li>
                    </ul>
                  </div>

                  <div className="glass-p-4 glass-surface-subtle glass-radius-lg">
                    <h3 className="glass-font-semibold glass-text-primary glass-mb-2">Try It Out</h3>
                    <p className="glass-text-primary glass-text-sm">
                      Watch as simulated users join the session and move their cursors around.
                      You can interact with their comments and see live activity updates.
                    </p>
                  </div>
                </div>

                {/* Collaboration layers */}
                {showComments && (
                  <GlassCollaborativeComments 
                    className="glass-absolute glass-inset-0"
                    allowComments={true}
                  />
                )}
              </Glass>

              {/* Features Overview */}
              <div className="space-y-6">
                <Glass className="glass-p-6">
                  <h3 className="glass-text-xl glass-font-semibold glass-text-secondary glass-mb-4">🚀 Collaboration Features</h3>
                  <div className="glass-space-y-4">
                    <div className="glass-flex glass-items-start glass-gap-3">
                      <div className="glass-w-8 glass-h-8 glass-surface-subtle glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-sm">
                        👆
                      </div>
                      <div>
                        <h4 className="glass-font-medium glass-text-secondary">Live Cursors</h4>
                        <p className="glass-text-sm glass-text-secondary">See where other users are working in real-time</p>
                      </div>
                    </div>
                    
                    <div className="glass-flex glass-items-start glass-gap-3">
                      <div className="glass-w-8 glass-h-8 glass-surface-subtle glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-sm">
                        💬
                      </div>
                      <div>
                        <h4 className="glass-font-medium glass-text-secondary">Smart Comments</h4>
                        <p className="glass-text-sm glass-text-secondary">Add contextual comments with replies and resolution</p>
                      </div>
                    </div>
                    
                    <div className="glass-flex glass-items-start glass-gap-3">
                      <div className="glass-w-8 glass-h-8 glass-surface-subtle glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-sm">
                        👥
                      </div>
                      <div>
                        <h4 className="glass-font-medium glass-text-secondary">User Presence</h4>
                        <p className="glass-text-sm glass-text-secondary">See who's online and their activity status</p>
                      </div>
                    </div>
                    
                    <div className="glass-flex glass-items-start glass-gap-3">
                      <div className="glass-w-8 glass-h-8 glass-surface-subtle glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-sm">
                        📊
                      </div>
                      <div>
                        <h4 className="glass-font-medium glass-text-secondary">Activity Feed</h4>
                        <p className="glass-text-sm glass-text-secondary">Track all collaboration events and changes</p>
                      </div>
                    </div>
                  </div>
                </Glass>

                <Glass className="glass-p-6">
                  <h3 className="glass-text-xl glass-font-semibold glass-text-secondary glass-mb-4">💡 How to Use</h3>
                  <div className="glass-space-y-3 glass-text-sm glass-text-secondary">
                    <div className="glass-flex glass-items-center glass-gap-2">
                      <span className="glass-w-5 glass-h-5 glass-surface-blue glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-xs">1</span>
                      <span>Move your cursor around to see live tracking</span>
                    </div>
                    <div className="glass-flex glass-items-center glass-gap-2">
                      <span className="glass-w-5 glass-h-5 glass-surface-primary glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-xs">2</span>
                      <span>Double-click anywhere to add a comment</span>
                    </div>
                    <div className="glass-flex glass-items-center glass-gap-2">
                      <span className="glass-w-5 glass-h-5 glass-surface-green glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-xs">3</span>
                      <span>Click comment dots to view and reply</span>
                    </div>
                    <div className="glass-flex glass-items-center glass-gap-2">
                      <span className="glass-w-5 glass-h-5 glass-surface-primary glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-xs">4</span>
                      <span>Watch the collaboration dashboard for activity</span>
                    </div>
                  </div>
                </Glass>
              </div>
            </div>
          </div>
        </div>

        {/* Collaboration Overlays */}
        {showCursors && <GlassCollaborativeCursor />}
        
        {showDashboard && (
          <GlassCollaborationDashboard 
            position="top-right"
            showUserList={true}
            showActivityFeed={true}
            showControls={true}
          />
        )}

        {/* Set current user via bridge with stable hooks */}
        <CurrentUserBridge user={user} />
      </div>
    </CollaborationProvider>
  );
};

export const FullDemo: Story = {
  render: () => (
    <CollaborationDemo 
      roomId="demo-room-1"
      showCursors={true}
      showComments={true}
      showDashboard={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete collaboration demo with all features enabled. Watch as simulated users join and interact with the workspace.',
      },
    },
  },
};

export const CursorsOnly: Story = {
  render: () => (
    <CollaborationDemo 
      roomId="cursors-demo"
      showCursors={true}
      showComments={false}
      showDashboard={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstration focusing on real-time cursor tracking and user presence.',
      },
    },
  },
};

export const CommentsOnly: Story = {
  render: () => (
    <CollaborationDemo 
      roomId="comments-demo"
      showCursors={false}
      showComments={true}
      showDashboard={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstration focusing on the collaborative commenting system with replies and resolution.',
      },
    },
  },
};

export const MultipleUsers: Story = {
  render: () => {
    const [selectedUser, setSelectedUser] = useState<CollaborationUser>();

    const demoUsers: CollaborationUser[] = [
      {
        id: 'user-1',
        name: 'Alice Johnson',
        email: 'alice@company.com',
        color: 'var(--glass-color-primary)',
        lastActive: Date.now()
      },
      {
        id: 'user-2',
        name: 'Bob Smith',
        email: 'bob@company.com',
        color: 'var(--glass-color-danger)',
        lastActive: Date.now()
      },
      {
        id: 'user-3',
        name: 'Carol Davis',
        email: 'carol@company.com',
        color: 'var(--glass-color-success)',
        lastActive: Date.now()
      }
    ];

    return (
      <div
        className="glass-collaboration-multiple-users glass-space-y-4"
        style={{ maxWidth: "100vw", overflowX: "hidden" }}
      >
        <div
          className="glass-collaboration-user-switch glass-surface-overlay glass-border glass-border-subtle glass-p-4 glass-radius-lg"
          style={{
            background: "rgba(255, 255, 255, 0.88)",
            borderColor: "rgba(15, 23, 42, 0.16)",
            color: "#0f172a",
          }}
        >
          <h3
            className="glass-collaboration-user-switch-title glass-font-semibold glass-mb-2"
            style={{ color: "#0f172a" }}
          >
            Switch User Perspective
          </h3>
          <div className="glass-flex glass-flex-wrap glass-gap-2">
            {demoUsers.map(user => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`glass-collaboration-user-switch-button glass-px-3 glass-py-2 glass-radius-lg glass-text-sm glass-font-medium glass-focus glass-touch-target glass-contrast-guard ${
                  selectedUser?.id === user.id ? "is-selected" : ""
                }`}
                style={{
                  appearance: "none",
                  WebkitAppearance: "none",
                  border: `1px solid ${user.color}`,
                  background:
                    selectedUser?.id === user.id
                      ? "linear-gradient(135deg, rgba(29, 78, 216, 0.95), rgba(13, 148, 136, 0.95))"
                      : "rgba(255,255,255,0.62)",
                  color: selectedUser?.id === user.id ? "#fff" : "#0f172a",
                  boxShadow:
                    selectedUser?.id === user.id
                      ? "0 8px 22px rgba(37,99,235,0.22)"
                      : "inset 0 1px 0 rgba(255,255,255,0.72)",
                }}
              >
                {user.name}
              </button>
            ))}
          </div>
        </div>

        <CollaborationDemo 
          roomId="multi-user-demo"
          currentUser={selectedUser || demoUsers[0]}
          showCursors={true}
          showComments={true}
          showDashboard={true}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Switch between different user perspectives to see how collaboration looks from each user\'s viewpoint.',
      },
    },
  },
};

export const CollaborationShowcase: Story = {
  render: () => {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="glass-text-center glass-py-8 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-xl">
          <h1 className="glass-text-3xl glass-font-bold glass-text-secondary glass-mb-4">🤝 Real-Time Collaboration System</h1>
          <p className="glass-text-lg glass-text-secondary max-w-3xl glass-mx-auto leading-relaxed">
            Experience the next generation of collaborative interfaces with live cursors, 
            contextual comments, user presence, and real-time activity tracking.
          </p>
          
          <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-4 glass-gap-6 mt-8 max-w-4xl glass-mx-auto">
            <div className="glass-text-center">
              <div className="glass-w-12 glass-h-12 glass-surface-blue glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3">
                👆
              </div>
              <h3 className="glass-font-semibold">Live Cursors</h3>
              <p className="glass-text-sm glass-text-secondary mt-1">See exactly where other users are working</p>
            </div>
            <div className="glass-text-center">
              <div className="glass-w-12 glass-h-12 glass-surface-primary glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3">
                💬
              </div>
              <h3 className="glass-font-semibold">Smart Comments</h3>
              <p className="glass-text-sm glass-text-secondary mt-1">Contextual discussions with replies and resolution</p>
            </div>
            <div className="glass-text-center">
              <div className="glass-w-12 glass-h-12 glass-surface-green glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3">
                👥
              </div>
              <h3 className="glass-font-semibold">User Presence</h3>
              <p className="glass-text-sm glass-text-secondary mt-1">Real-time online status and activity indicators</p>
            </div>
            <div className="glass-text-center">
              <div className="glass-w-12 glass-h-12 glass-surface-primary glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-mx-auto glass-mb-3">
                📊
              </div>
              <h3 className="glass-font-semibold">Activity Feed</h3>
              <p className="glass-text-sm glass-text-secondary mt-1">Complete history of all collaboration events</p>
            </div>
          </div>
        </div>

        <CollaborationDemo 
          roomId="showcase-demo"
          showCursors={true}
          showComments={true}
          showDashboard={true}
        />

        <div className="glass-surface-subtle glass-border-l-4 glass-border-yellow glass-p-6 glass-radius-r-lg">
          <h3 className="glass-font-semibold glass-text-primary glass-mb-2">🚀 Advanced Collaboration Features</h3>
          <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-2 glass-gap-6 glass-text-sm glass-text-primary">
            <div>
              <h4 className="glass-font-medium glass-mb-2">Real-Time Features:</h4>
              <ul className="space-y-1">
                <li>• Live cursor tracking with user identification</li>
                <li>• Instant comment synchronization</li>
                <li>• Real-time user presence indicators</li>
                <li>• Connection status monitoring</li>
                <li>• Activity feed with live updates</li>
              </ul>
            </div>
            <div>
              <h4 className="glass-font-medium glass-mb-2">Collaboration Tools:</h4>
              <ul className="space-y-1">
                <li>• Contextual commenting system</li>
                <li>• Comment replies and resolution</li>
                <li>• User avatars and color coding</li>
                <li>• Expandable collaboration dashboard</li>
                <li>• Toggle controls for all features</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-text-primary glass-p-8 glass-radius-xl">
          <h2 className="glass-text-2xl glass-font-bold glass-mb-4">🎯 Perfect for Modern Applications</h2>
          <div className="glass-grid glass-glass-grid-cols-1 md:glass-glass-grid-cols-3 glass-gap-6">
            <div>
              <h3 className="glass-font-semibold glass-mb-2">Document Editing</h3>
              <ul className="glass-text-sm space-y-1 glass-opacity-90">
                <li>• Google Docs-style collaboration</li>
                <li>• Real-time text editing</li>
                <li>• Comment threads</li>
                <li>• User presence awareness</li>
              </ul>
            </div>
            <div>
              <h3 className="glass-font-semibold glass-mb-2">Design Tools</h3>
              <ul className="glass-text-sm space-y-1 glass-opacity-90">
                <li>• Figma-like cursor tracking</li>
                <li>• Live design feedback</li>
                <li>• Collaborative annotations</li>
                <li>• Multi-user workspaces</li>
              </ul>
            </div>
            <div>
              <h3 className="glass-font-semibold glass-mb-2">Project Management</h3>
              <ul className="glass-text-sm space-y-1 glass-opacity-90">
                <li>• Team activity monitoring</li>
                <li>• Real-time discussions</li>
                <li>• Progress tracking</li>
                <li>• Instant notifications</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete showcase of the collaboration system with detailed feature explanations and use cases.',
      },
    },
  },
};
