import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useEffect } from 'react';
import { CollaborationProvider, CollaborationUser, useCollaboration } from './GlassCollaborationProvider';
import { GlassCollaborativeCursor } from './GlassCollaborativeCursor';
import { GlassCollaborativeComments } from './GlassCollaborativeComments';
import { GlassCollaborationDashboard } from './GlassCollaborationDashboard';
import { Glass } from '../../primitives';

const meta: Meta = {
  title: 'Collaboration/GlassCollaboration',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete real-time collaboration system with live cursors, comments, user presence, and activity tracking - like Google Docs, Figma, or Miro.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

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
      <div className="glass-min-h-screen glass-gradient-primary glass-gradient-primary via-white glass-gradient-primary relative">
        {/* Header */}
        <div className="relative z-10 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold glass-text-secondary mb-4">
              Real-Time Collaboration Demo
            </h1>
            <p className="text-lg glass-text-secondary mb-8">
              Experience the future of collaborative work with live cursors, comments, and real-time activity tracking.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Interactive Content Area */}
              <Glass className="relative p-8 glass-min-h-96">
                <h2 className="text-2xl font-semibold glass-text-secondary mb-4">
                  Interactive Workspace
                </h2>
                <p className="glass-text-secondary mb-6">
                  Double-click anywhere to add comments. Move your cursor to see live collaboration in action.
                </p>

                {/* Sample content to interact with */}
                <div className="space-y-6">
                  <div className="p-4 glass-surface-subtle glass-radius-lg">
                    <h3 className="font-semibold text-primary mb-2">Project Overview</h3>
                    <p className="text-primary text-sm">
                      This is a sample content area where you can add comments and see other users' cursors.
                      Try double-clicking on different parts of this text to leave comments.
                    </p>
                  </div>

                  <div className="p-4 glass-surface-subtle glass-radius-lg">
                    <h3 className="font-semibold text-primary mb-2">Features Implemented</h3>
                    <ul className="text-primary text-sm space-y-1">
                      <li>• Real-time cursor tracking</li>
                      <li>• Collaborative commenting system</li>
                      <li>• User presence indicators</li>
                      <li>• Activity feed and history</li>
                      <li>• Live connection status</li>
                    </ul>
                  </div>

                  <div className="p-4 glass-surface-subtle glass-radius-lg">
                    <h3 className="font-semibold text-primary mb-2">Try It Out</h3>
                    <p className="text-primary text-sm">
                      Watch as simulated users join the session and move their cursors around.
                      You can interact with their comments and see live activity updates.
                    </p>
                  </div>
                </div>

                {/* Collaboration layers */}
                {showComments && (
                  <GlassCollaborativeComments 
                    className="absolute inset-0"
                    allowComments={true}
                  />
                )}
              </Glass>

              {/* Features Overview */}
              <div className="space-y-6">
                <Glass className="p-6">
                  <h3 className="text-xl font-semibold glass-text-secondary mb-4">🚀 Collaboration Features</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 glass-surface-subtle text-primary glass-radius-full flex items-center justify-center text-sm">
                        👆
                      </div>
                      <div>
                        <h4 className="font-medium glass-text-secondary">Live Cursors</h4>
                        <p className="text-sm glass-text-secondary">See where other users are working in real-time</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 glass-surface-subtle text-primary glass-radius-full flex items-center justify-center text-sm">
                        💬
                      </div>
                      <div>
                        <h4 className="font-medium glass-text-secondary">Smart Comments</h4>
                        <p className="text-sm glass-text-secondary">Add contextual comments with replies and resolution</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 glass-surface-subtle text-primary glass-radius-full flex items-center justify-center text-sm">
                        👥
                      </div>
                      <div>
                        <h4 className="font-medium glass-text-secondary">User Presence</h4>
                        <p className="text-sm glass-text-secondary">See who's online and their activity status</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 glass-surface-subtle text-primary glass-radius-full flex items-center justify-center text-sm">
                        📊
                      </div>
                      <div>
                        <h4 className="font-medium glass-text-secondary">Activity Feed</h4>
                        <p className="text-sm glass-text-secondary">Track all collaboration events and changes</p>
                      </div>
                    </div>
                  </div>
                </Glass>

                <Glass className="p-6">
                  <h3 className="text-xl font-semibold glass-text-secondary mb-4">💡 How to Use</h3>
                  <div className="space-y-3 text-sm glass-text-secondary">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 glass-surface-blue text-primary glass-radius-full flex items-center justify-center text-xs">1</span>
                      <span>Move your cursor around to see live tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 glass-surface-primary text-primary glass-radius-full flex items-center justify-center text-xs">2</span>
                      <span>Double-click anywhere to add a comment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 glass-surface-green text-primary glass-radius-full flex items-center justify-center text-xs">3</span>
                      <span>Click comment dots to view and reply</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 glass-surface-primary text-primary glass-radius-full flex items-center justify-center text-xs">4</span>
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
      <div className="space-y-4">
        <div className="glass-surface-subtle p-4 glass-radius-lg">
          <h3 className="font-semibold text-primary mb-2">Switch User Perspective</h3>
          <div className="flex gap-2">
            {demoUsers.map(user => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`px-3 py-2 rounded text-sm ${
                  selectedUser?.id === user.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-600 hover:bg-blue-100'
                }`}
                style={{ borderColor: user.color }}
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
        <div className="text-center py-8 glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-xl">
          <h1 className="text-3xl font-bold glass-text-secondary mb-4">🤝 Real-Time Collaboration System</h1>
          <p className="text-lg glass-text-secondary max-w-3xl mx-auto leading-relaxed">
            Experience the next generation of collaborative interfaces with live cursors, 
            contextual comments, user presence, and real-time activity tracking.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 glass-surface-blue text-primary glass-radius-full flex items-center justify-center mx-auto mb-3">
                👆
              </div>
              <h3 className="font-semibold">Live Cursors</h3>
              <p className="text-sm glass-text-secondary mt-1">See exactly where other users are working</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 glass-surface-primary text-primary glass-radius-full flex items-center justify-center mx-auto mb-3">
                💬
              </div>
              <h3 className="font-semibold">Smart Comments</h3>
              <p className="text-sm glass-text-secondary mt-1">Contextual discussions with replies and resolution</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 glass-surface-green text-primary glass-radius-full flex items-center justify-center mx-auto mb-3">
                👥
              </div>
              <h3 className="font-semibold">User Presence</h3>
              <p className="text-sm glass-text-secondary mt-1">Real-time online status and activity indicators</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 glass-surface-primary text-primary glass-radius-full flex items-center justify-center mx-auto mb-3">
                📊
              </div>
              <h3 className="font-semibold">Activity Feed</h3>
              <p className="text-sm glass-text-secondary mt-1">Complete history of all collaboration events</p>
            </div>
          </div>
        </div>

        <CollaborationDemo 
          roomId="showcase-demo"
          showCursors={true}
          showComments={true}
          showDashboard={true}
        />

        <div className="glass-surface-subtle border-l-4 border-yellow p-6 glass-radius-r-lg">
          <h3 className="font-semibold text-primary mb-2">🚀 Advanced Collaboration Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-primary">
            <div>
              <h4 className="font-medium mb-2">Real-Time Features:</h4>
              <ul className="space-y-1">
                <li>• Live cursor tracking with user identification</li>
                <li>• Instant comment synchronization</li>
                <li>• Real-time user presence indicators</li>
                <li>• Connection status monitoring</li>
                <li>• Activity feed with live updates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Collaboration Tools:</h4>
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

        <div className="glass-gradient-primary glass-gradient-primary glass-gradient-primary text-primary p-8 glass-radius-xl">
          <h2 className="text-2xl font-bold mb-4">🎯 Perfect for Modern Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Document Editing</h3>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Google Docs-style collaboration</li>
                <li>• Real-time text editing</li>
                <li>• Comment threads</li>
                <li>• User presence awareness</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Design Tools</h3>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Figma-like cursor tracking</li>
                <li>• Live design feedback</li>
                <li>• Collaborative annotations</li>
                <li>• Multi-user workspaces</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Project Management</h3>
              <ul className="text-sm space-y-1 opacity-90">
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
