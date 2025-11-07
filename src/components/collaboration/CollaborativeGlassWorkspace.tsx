'use client';

import {
    ClipboardPaste,
    Copy,
    Layers,
    Maximize,
    Mic,
    MicOff,
    Minimize,
    Redo,
    Save,
    Settings,
    Trash2,
    Undo,
    Wifi
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { createGlassStyle } from '../../core/mixins/glassMixins';

interface CollaborativeGlassWorkspaceProps {
  workspaceId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole?: 'admin' | 'editor' | 'viewer';
  userAvatar?: string;
  className?: string;

  // Workspace configuration
  enableVoiceChat?: boolean;
  enableScreenSharing?: boolean;
  enableComments?: boolean;
  enableVersionControl?: boolean;
  enableRealTimeSync?: boolean;

  // UI configuration
  layout?: 'split' | 'tabs' | 'canvas-focused' | 'editor-focused';
  theme?: 'dark' | 'light' | 'auto';
  showMiniMap?: boolean;
  showOnlineUsers?: boolean;
  showCursors?: boolean;
  enableAdvancedEffects?: boolean;

  // Canvas configuration
  canvasWidth?: number;
  canvasHeight?: number;
  gridSize?: number;
  showGrid?: boolean;
  showRulers?: boolean;
  enableSnapping?: boolean;

  // Callbacks
  onWorkspaceReady?: (workspace: any) => void;
  onUserJoined?: (user: any) => void;
  onUserLeft?: (userId: string) => void;
  onElementSelected?: (elementId: string | null) => void;
  onError?: (error: any) => void;
}

export function CollaborativeGlassWorkspace(props: CollaborativeGlassWorkspaceProps) {
  // Wrap the workspace in providers - in real implementation this would use actual providers
  return (
    <GlassCollaborationProvider
      workspaceId={props.workspaceId}
      userId={props.userId}
      userName={props.userName}
      userEmail={props.userEmail}
      userRole={props.userRole}
      userAvatar={props.userAvatar}
      autoConnect={true}
      enableVoice={props.enableVoiceChat}
      enableCursorTracking={props.showCursors}
      enableComments={props.enableComments}
      showDebugInfo={false}
    >
      <WorkspaceContent {...props} />
    </GlassCollaborationProvider>
  );
}

function WorkspaceContent({
  className='',
  layout = 'split',
  theme = 'dark',
  showMiniMap = true,
  showOnlineUsers = true,
  showCursors = true,
  enableAdvancedEffects = true,
  canvasWidth = 1200,
  canvasHeight = 800,
  gridSize = 20,
  showGrid = true,
  showRulers = false,
  enableSnapping = true,
  enableVoiceChat = false,
  enableScreenSharing = false,
  enableComments = true,
  enableVersionControl = true,
  enableRealTimeSync = true,
  onWorkspaceReady,
  onUserJoined,
  onUserLeft,
  onElementSelected,
  onError
}: Omit<CollaborativeGlassWorkspaceProps, 'workspaceId' | 'userId' | 'userName' | 'userEmail'>) {
  // Mock collaboration context - in real implementation this would use actual context
  const mockCollaborationContext = {
    isConnected: true,
    isConnecting: false,
    workspace: { id: 'workspace-1', name: 'Collaborative Design Session' },
    users: [],
    currentUser: { id: 'user-1', name: 'Current User', role: 'admin' },
    onlineUsers: [
      { id: 'user-1', name: 'Alice Johnson', role: 'admin', avatar: '', color: '#3B82F6' },
      { id: 'user-2', name: 'Bob Smith', role: 'editor', avatar: '', color: '#10B981' },
      { id: 'user-3', name: 'Carol Davis', role: 'viewer', avatar: '', color: '#F59E0B' }
    ],
    canEdit: true,
    isVoiceActive: false,
    voiceUsers: [],
    toggleVoice: () => {},
    addComment: () => {},
    createSnapshot: () => {},
    undo: () => {},
    redo: () => {},
    canUndo: true,
    canRedo: false,
    connect: () => {},
    disconnect: () => {}
  };

  const {
    isConnected,
    isConnecting,
    workspace,
    currentUser,
    onlineUsers,
    canEdit,
    isVoiceActive,
    voiceUsers,
    toggleVoice,
    createSnapshot,
    undo,
    redo,
    canUndo,
    canRedo
  } = mockCollaborationContext;

  // Local state
  const [activeLayout, setActiveLayout] = useState(layout);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showToolbar, setShowToolbar] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVoicePanel, setShowVoicePanel] = useState(false);
  const [showVersionPanel, setShowVersionPanel] = useState(false);

  // Handle workspace events
  useEffect(() => {
    if (workspace) {
      onWorkspaceReady?.(workspace);
    }
  }, [workspace, onWorkspaceReady]);

  // Handle element selection
  const handleElementSelect = useCallback((elementId: string | null) => {
    setSelectedElementId(elementId);
    onElementSelected?.(elementId);
  }, [onElementSelected]);

  // Layout configurations
  const layoutConfig = useMemo(() => {
    switch (activeLayout) {
      case 'canvas-focused':
        return {
          canvasSize: 'flex-1',
          editorSize: 'w-80',
          direction: 'row',
          canvasFirst: true
        };
      case 'editor-focused':
        return {
          canvasSize: 'w-80',
          editorSize: 'flex-1',
          direction: 'row',
          canvasFirst: false
        };
      case 'tabs':
        return {
          canvasSize: 'w-full',
          editorSize: 'w-full',
          direction: 'col',
          canvasFirst: true
        };
      default: // 'split'
        return {
          canvasSize: 'flex-1',
          editorSize: 'flex-1',
          direction: 'row',
          canvasFirst: true
        };
    }
  }, [activeLayout]);

  // Connection status
  if (!isConnected && !isConnecting) {
    return (
      <WorkspaceConnectionError
        onRetry={() => {}}
        error="Failed to connect to collaboration server"
      />
    );
  }

  if (isConnecting) {
    return <WorkspaceLoadingState />;
  }

  if (!workspace || !currentUser) {
    return <WorkspaceLoadingState message="Setting up workspace..." />;
  }

  return (
    <div
      className={cn('glass-collaborative-workspace glass-h-screen glass-flex glass-flex-col glass-surface-dark', className)}
      role="main"
      aria-live="polite"
    >
      {/* Workspace Header */}
      {showToolbar && (
        <WorkspaceHeader
          workspace={workspace}
          currentUser={currentUser}
          onlineUsers={onlineUsers}
          canEdit={canEdit}
          isVoiceActive={isVoiceActive}
          voiceUsers={voiceUsers}
          onToggleVoice={toggleVoice}
          onCreateSnapshot={createSnapshot}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          onLayoutChange={setActiveLayout}
          activeLayout={activeLayout}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          isFullscreen={isFullscreen}
          showOnlineUsers={showOnlineUsers}
          enableVoiceChat={enableVoiceChat}
          enableVersionControl={enableVersionControl}
        />
      )}

      {/* Main Workspace Content */}
      <div className={cn('glass-flex-1 glass-flex glass-min-h-0', layoutConfig.direction === 'col' ? 'glass-flex-col' : 'glass-flex-row')}>
        {activeLayout === 'tabs' ? (
          <WorkspaceTabs
            selectedElementId={selectedElementId}
            onElementSelect={handleElementSelect}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            gridSize={gridSize}
            showGrid={showGrid}
            showRulers={showRulers}
            enableSnapping={enableSnapping}
            enableComments={enableComments}
            enableRealTimeSync={enableRealTimeSync}
          />
        ) : (
          <>
            {/* Canvas Section */}
            {layoutConfig.canvasFirst && (
              <div className={cn(layoutConfig.canvasSize, 'glass-min-w-0 glass-p-4')}>
                <CollaborativeGlassCanvas
                  width={canvasWidth}
                  height={canvasHeight}
                  gridSize={gridSize}
                  showGrid={showGrid}
                  showRulers={showRulers}
                  enableSnapping={enableSnapping}
                  onElementSelect={handleElementSelect}
                  className={cn('glass-h-full')}
                />
              </div>
            )}

            {/* Editor Section */}
            <div className={cn(layoutConfig.editorSize, 'glass-min-w-0 glass-p-4')}>
              <MultiUserGlassEditor
                target={selectedElementId || 'global'}
                showPreview={true}
                showHistory={enableVersionControl}
                showComments={enableComments}
                enableRealTimeSync={enableRealTimeSync}
                layout="vertical"
                className="h-full"
              />
            </div>

            {/* Canvas Section (if not first) */}
            {!layoutConfig.canvasFirst && (
              <div className={cn(layoutConfig.canvasSize, 'glass-min-w-0 glass-p-4')}>
                <CollaborativeGlassCanvas
                  width={canvasWidth}
                  height={canvasHeight}
                  gridSize={gridSize}
                  showGrid={showGrid}
                  showRulers={showRulers}
                  enableSnapping={enableSnapping}
                  onElementSelect={handleElementSelect}
                  className={cn('glass-h-full')}
                />
              </div>
            )}
          </>
        )}

        {/* Sidebar */}
        {showSidebar && (
          <WorkspaceSidebar
            selectedElementId={selectedElementId}
            onElementSelect={handleElementSelect}
            showMiniMap={showMiniMap}
            showOnlineUsers={showOnlineUsers}
            onlineUsers={onlineUsers}
            currentUser={currentUser}
            isVoiceActive={isVoiceActive}
            voiceUsers={voiceUsers}
            enableComments={enableComments}
          />
        )}
      </div>

      {/* Floating Elements */}
      {showCursors && (
        enableAdvancedEffects ? (
          <GlassTeamCursorsWithEffects
            showNames={true}
            showVoiceIndicators={enableVoiceChat}
            cursorSize="md"
            glassLevel="medium"
            enableRippleEffect={true}
            enableGlowEffect={true}
          />
        ) : (
          <GlassTeamCursors
            showNames={true}
            showVoiceIndicators={enableVoiceChat}
            cursorSize="md"
            glassLevel="medium"
          />
        )
      )}

      {/* Voice Chat Panel */}
      {showVoicePanel && enableVoiceChat && (
        <VoiceChatPanel
          isActive={isVoiceActive}
          voiceUsers={voiceUsers}
          onClose={() => setShowVoicePanel(false)}
          onToggleVoice={toggleVoice}
        />
      )}

      {/* Version Control Panel */}
      {showVersionPanel && enableVersionControl && (
        <VersionControlPanel
          onClose={() => setShowVersionPanel(false)}
          onCreateSnapshot={createSnapshot}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
        />
      )}

      {/* Floating Action Button */}
      <WorkspaceFloatingActions
        isVoiceActive={isVoiceActive}
        onToggleVoice={toggleVoice}
        onShowVoicePanel={() => setShowVoicePanel(true)}
        onShowVersionPanel={() => setShowVersionPanel(true)}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        enableVoiceChat={enableVoiceChat}
        enableVersionControl={enableVersionControl}
      />
    </div>
  );
}

// Mock provider components - in real implementation these would be actual providers
function GlassCollaborationProvider({ children, ...props }: any) {
  return <>{children}</>;
}

// Workspace Header Component
function WorkspaceHeader({
  workspace,
  currentUser,
  onlineUsers,
  canEdit,
  isVoiceActive,
  voiceUsers,
  onToggleVoice,
  onCreateSnapshot,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onLayoutChange,
  activeLayout,
  onToggleSidebar,
  onToggleFullscreen,
  isFullscreen,
  showOnlineUsers,
  enableVoiceChat,
  enableVersionControl
}: any) {
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);

  return (
    <div
      className="workspace-header flex items-center justify-between px-4 py-3 border-b border-white/10"
      style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-primary">{workspace.name}</h1>
        <div className="text-sm text-primary/60">
          {canEdit ? '✏️ Editing' : '👁️ Viewing'}
        </div>
      </div>

      {/* Center Section - Tools */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        {enableVersionControl && (
          <>
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-2 glass-radius hover:glass-surface-subtle/10 disabled:opacity-50 text-primary"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-2 glass-radius hover:glass-surface-subtle/10 disabled:opacity-50 text-primary"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
            <button
              onClick={() => onCreateSnapshot(`Snapshot ${Date.now()}`)}
              className="px-3 py-2 text-sm glass-surface-blue text-primary glass-radius hover:glass-surface-blue"
              title="Create Snapshot"
            >
              📷 Snapshot
            </button>
          </>
        )}

        {/* Layout Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowLayoutMenu(!showLayoutMenu)}
            className="p-2 glass-radius hover:glass-surface-subtle/10 text-primary"
            title="Change Layout"
          >
            🔀
          </button>
          {showLayoutMenu && (
            <div className="absolute top-full left-0 mt-2 p-2 bg-slate-800 border border-white/20 glass-radius shadow-lg z-50">
              {['split', 'tabs', 'canvas-focused', 'editor-focused'].map(layout => (
                <button
                  key={layout}
                  onClick={() => {
                    onLayoutChange(layout);
                    setShowLayoutMenu(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-sm rounded hover:bg-white/10 text-white ${
                    activeLayout === layout ? 'bg-blue-600' : ''
                  }`}
                >
                  {layout.charAt(0).toUpperCase() + layout.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Voice Chat Toggle */}
        {enableVoiceChat && (
          <button
            onClick={onToggleVoice}
            className={`p-2 rounded ${
              isVoiceActive ? 'bg-green-600 text-white' : 'hover:bg-white/10 text-white'
            }`}
            title={isVoiceActive ? 'Leave Voice Chat' : 'Join Voice Chat'}
          >
            {isVoiceActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            {voiceUsers.length > 0 && ` (${voiceUsers.length})`}
          </button>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Online Users */}
        {showOnlineUsers && (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {onlineUsers.slice(0, 5).map((user: any) => (
                <div
                  key={user.id}
                  className="w-8 h-8 glass-radius-full border-2 border-white flex items-center justify-center text-xs font-bold text-primary"
                  style={{ backgroundColor: user.color }}
                  title={user.name}
                >
                  {user.name[0]}
                </div>
              ))}
              {onlineUsers.length > 5 && (
                <div className="w-8 h-8 glass-radius-full glass-surface-primary border-2 border-white flex items-center justify-center text-xs text-primary">
                  +{onlineUsers.length - 5}
                </div>
              )}
            </div>
            <span className="text-sm text-primary/60">
              {onlineUsers.length} online
            </span>
          </div>
        )}

        {/* Controls */}
        <button
          onClick={onToggleSidebar}
          className="p-2 glass-radius hover:glass-surface-subtle/10 text-primary"
          title="Toggle Sidebar"
        >
          <Layers className="w-4 h-4" />
        </button>
        <button
          onClick={onToggleFullscreen}
          className="p-2 glass-radius hover:glass-surface-subtle/10 text-primary"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

// Mock sub-components - in real implementation these would be actual components
function WorkspaceTabs({ selectedElementId, onElementSelect, ...props }: any) {
  const [activeTab, setActiveTab] = useState<'canvas' | 'editor'>('canvas');

  return (
    <div className="flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-white/20 bg-slate-800">
        <button
          onClick={() => setActiveTab('canvas')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'canvas'
              ? 'text-white border-b-2 border-blue-400 bg-slate-700'
              : 'text-white/70 hover:text-white'
          }`}
        >
          🎨 Canvas
        </button>
        <button
          onClick={() => setActiveTab('editor')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'editor'
              ? 'text-white border-b-2 border-blue-400 bg-slate-700'
              : 'text-white/70 hover:text-white'
          }`}
        >
          ⚙️ Properties
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-4">
        {activeTab === 'canvas' ? (
          <CollaborativeGlassCanvas {...props} onElementSelect={onElementSelect} className="h-full" />
        ) : (
          <MultiUserGlassEditor {...props} className="h-full" />
        )}
      </div>
    </div>
  );
}

function CollaborativeGlassCanvas({ width, height, gridSize, showGrid, showRulers, enableSnapping, onElementSelect, className }: any) {
  return (
    <div
      className={`collaborative-canvas relative ${className}`}
      style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
    >
      {showGrid && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: `${gridSize}px ${gridSize}px`
          }}
        />
      )}

      <div className="flex items-center justify-center h-full text-primary/60">
        <div className="text-center">
          <div className="text-4xl mb-4">🎨</div>
          <p className="text-lg">Collaborative Canvas</p>
          <p className="text-sm">Click to start designing together</p>
        </div>
      </div>
    </div>
  );
}

function MultiUserGlassEditor({ target, showPreview, showHistory, showComments, enableRealTimeSync, layout, className }: any) {
  return (
    <div
      className={`multi-user-editor ${className}`}
      style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-primary font-semibold">Properties Editor</h3>
          <div className="flex gap-2">
            {showHistory && <button className="p-2 glass-radius hover:glass-surface-subtle/10 text-primary">📜</button>}
            {showComments && <button className="p-2 glass-radius hover:glass-surface-subtle/10 text-primary">💬</button>}
            {enableRealTimeSync && <div className="flex items-center gap-1 text-primary text-sm"><Wifi className="w-3 h-3" /> Live</div>}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary/80 mb-2">Target Element</label>
            <div className="p-2 glass-surface-subtle/5 glass-radius text-primary text-sm">{target}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary/80 mb-2">Properties</label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-primary/60 text-sm w-20">Width:</span>
                <input type="number" className="flex-1 p-2 glass-surface-subtle/10 glass-radius text-primary text-sm" placeholder="Auto" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary/60 text-sm w-20">Height:</span>
                <input type="number" className="flex-1 p-2 glass-surface-subtle/10 glass-radius text-primary text-sm" placeholder="Auto" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary/60 text-sm w-20">Opacity:</span>
                <input type="range" min="0" max="1" step="0.1" className="flex-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkspaceSidebar({ selectedElementId, onElementSelect, showMiniMap, showOnlineUsers, onlineUsers, currentUser, isVoiceActive, voiceUsers, enableComments }: any) {
  return (
    <div
      className="workspace-sidebar w-80 border-l border-white/20 p-4 space-y-4"
      style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
    >
      {/* Mini Map */}
      {showMiniMap && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-primary/80 uppercase">Mini Map</h3>
          <div className="aspect-video bg-slate-800 border border-white/20 glass-radius p-2">
            <div className="text-xs text-primary/50 text-center mt-8">
              Canvas overview
            </div>
          </div>
        </div>
      )}

      {/* Online Users */}
      {showOnlineUsers && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-primary/80 uppercase">Online Users</h3>
          <div className="space-y-2">
            {onlineUsers.map((user: any) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-2 glass-radius hover:glass-surface-subtle/5"
              >
                <div
                  className="w-6 h-6 glass-radius-full flex items-center justify-center text-xs font-bold text-primary"
                  style={{ backgroundColor: user.color }}
                >
                  {user.name[0]}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-primary">{user.name}</div>
                  <div className="text-xs text-primary/50">{user.role}</div>
                </div>
                {voiceUsers.includes(user.id) && (
                  <div className="text-primary text-xs">🎤</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-primary/80 uppercase">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 text-sm glass-surface-subtle/5 hover:glass-surface-subtle/10 glass-radius text-primary">
            <Copy className="w-4 h-4 inline mr-2" />
            Copy Selected
          </button>
          <button className="w-full text-left px-3 py-2 text-sm glass-surface-subtle/5 hover:glass-surface-subtle/10 glass-radius text-primary">
            <ClipboardPaste className="w-4 h-4 inline mr-2" />
            Paste
          </button>
          <button className="w-full text-left px-3 py-2 text-sm glass-surface-subtle/5 hover:glass-surface-subtle/10 glass-radius text-primary">
            <Trash2 className="w-4 h-4 inline mr-2" />
            Delete Selected
          </button>
        </div>
      </div>
    </div>
  );
}

function GlassTeamCursors({ showNames, showVoiceIndicators, cursorSize, glassLevel }: any) {
  return null; // Mock component
}

function GlassTeamCursorsWithEffects({ showNames, showVoiceIndicators, cursorSize, glassLevel, enableRippleEffect, enableGlowEffect }: any) {
  return null; // Mock component
}

function VoiceChatPanel({ isActive, voiceUsers, onClose, onToggleVoice }: any) {
  return (
    <div
      className="fixed bottom-4 right-4 w-80 p-4 glass-radius-lg border border-white/20"
      style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-primary font-semibold">Voice Chat</h3>
        <button onClick={onClose} className="text-primary/70 hover:text-primary">
          ✕
        </button>
      </div>

      <div className="space-y-2 mb-4">
        {voiceUsers.map((userId: string) => (
          <div key={userId} className="flex items-center gap-2 text-primary text-sm">
            <div className="w-2 h-2 glass-surface-green glass-radius-full animate-pulse" />
            User {userId}
          </div>
        ))}
      </div>

      <button
        onClick={onToggleVoice}
        className={`w-full py-2 rounded ${
          isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
        } text-white transition-colors`}
      >
        {isActive ? '🔇 Leave' : '🎤 Join'} Voice Chat
      </button>
    </div>
  );
}

function VersionControlPanel({ onClose, onCreateSnapshot, canUndo, canRedo, onUndo, onRedo }: any) {
  return (
    <div
      className="fixed bottom-4 left-4 w-80 p-4 glass-radius-lg border border-white/20"
      style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-primary font-semibold">Version Control</h3>
        <button onClick={onClose} className="text-primary/70 hover:text-primary">
          ✕
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="flex-1 py-2 px-3 glass-radius glass-surface-subtle/10 text-primary disabled:opacity-50"
          >
            <Undo className="w-4 h-4 inline mr-1" />
            Undo
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="flex-1 py-2 px-3 glass-radius glass-surface-subtle/10 text-primary disabled:opacity-50"
          >
            <Redo className="w-4 h-4 inline mr-1" />
            Redo
          </button>
        </div>

        <button
          onClick={() => onCreateSnapshot(`Manual snapshot ${Date.now()}`)}
          className="w-full py-2 px-3 glass-radius glass-surface-blue text-primary hover:glass-surface-blue"
        >
          <Save className="w-4 h-4 inline mr-1" />
          Create Snapshot
        </button>
      </div>
    </div>
  );
}

function WorkspaceFloatingActions({ isVoiceActive, onToggleVoice, onShowVoicePanel, onShowVersionPanel, onToggleFullscreen, enableVoiceChat, enableVersionControl }: any) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6">
      <div
        className={`flex flex-col gap-2 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity`}
      >
        {enableVoiceChat && (
          <button
            onClick={onShowVoicePanel}
            className="w-12 h-12 glass-radius-full glass-surface-green text-primary flex items-center justify-center shadow-lg hover:glass-surface-green"
            title="Voice Chat"
          >
            <Mic className="w-4 h-4" />
          </button>
        )}

        {enableVersionControl && (
          <button
            onClick={onShowVersionPanel}
            className="w-12 h-12 glass-radius-full glass-surface-blue text-primary flex items-center justify-center shadow-lg hover:glass-surface-blue"
            title="Version Control"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onToggleFullscreen}
          className="w-12 h-12 glass-radius-full glass-surface-primary text-primary flex items-center justify-center shadow-lg hover:glass-surface-subtle"
          title="Fullscreen"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 glass-radius-full bg-slate-700 text-primary flex items-center justify-center shadow-lg hover:bg-slate-600 mt-2"
        style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
      >
        {isExpanded ? '✕' : '⚡'}
      </button>
    </div>
  );
}

// Loading and Error Components
function WorkspaceLoadingState({ message = "Connecting to workspace..." }: { message?: string }) {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center space-y-4">
        <div
          className="w-16 h-16 border-4 border-blue border-t-transparent glass-radius-full animate-spin mx-auto"
        />
        <div className="text-primary text-lg">{message}</div>
        <div className="text-primary/60 text-sm">Please wait...</div>
      </div>
    </div>
  );
}

function WorkspaceConnectionError({ onRetry, error }: { onRetry: () => void; error: string }) {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-primary text-6xl mb-4">⚠️</div>
        <div className="text-primary text-xl font-semibold">Connection Error</div>
        <div className="text-primary/70">{error}</div>
        <button
          onClick={onRetry}
          className="px-6 py-3 glass-surface-blue text-primary glass-radius hover:glass-surface-blue transition-colors"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
}

export default CollaborativeGlassWorkspace;
