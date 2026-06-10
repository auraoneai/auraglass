"use client";
/**
 * @demo DEMO / SHOWCASE COMPONENT — uses in-component mock data.
 *
 * CollaborativeGlassWorkspace illustrates real-time multi-user collaboration UI
 * (cursors, presence, comments) on a glass surface. It does NOT connect to a real
 * collaboration backend (CRDT/OT/WebSocket sync) — collaborator presence and edits
 * are simulated locally. Wire it to a real sync provider before production use.
 */
import React from "react";
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
  Wifi,
} from "@/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { createGlassStyle } from "../../core/mixins/glassMixins";
import { ANIMATION } from "../../tokens/designConstants";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { CollaborationProvider } from "./GlassCollaborationProvider";

type WorkspaceLayout = "split" | "tabs" | "canvas-focused" | "editor-focused";
type WorkspaceTheme = "dark" | "light" | "auto";
type WorkspaceRole = "admin" | "editor" | "viewer";
type CursorSize = "sm" | "md" | "lg";
type CursorGlassLevel = "low" | "medium" | "high";

interface WorkspaceSummary {
  id: string;
  name: string;
}

interface WorkspaceUser {
  id: string;
  name: string;
  role: WorkspaceRole;
  avatar?: string;
  color?: string;
}

type WorkspaceError = Error | string | { message?: string; code?: string };

interface CollaborativeGlassWorkspaceProps {
  workspaceId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole?: WorkspaceRole;
  userAvatar?: string;
  className?: string;
  "aria-label"?: string;

  // Workspace configuration
  enableVoiceChat?: boolean;
  enableScreenSharing?: boolean;
  enableComments?: boolean;
  enableVersionControl?: boolean;
  enableRealTimeSync?: boolean;

  // UI configuration
  layout?: WorkspaceLayout;
  theme?: WorkspaceTheme;
  showMiniMap?: boolean;
  showOnlineUsers?: boolean;
  showCursors?: boolean;
  enableAdvancedEffects?: boolean;
  compact?: boolean;
  contained?: boolean;
  maxHeight?: number | string;

  // Canvas configuration
  canvasWidth?: number;
  canvasHeight?: number;
  gridSize?: number;
  showGrid?: boolean;
  showRulers?: boolean;
  enableSnapping?: boolean;

  // Callbacks
  onWorkspaceReady?: (workspace: WorkspaceSummary) => void;
  onUserJoined?: (user: WorkspaceUser) => void;
  onUserLeft?: (userId: string) => void;
  onElementSelected?: (elementId: string | null) => void;
  onError?: (error: WorkspaceError) => void;
}

interface WorkspaceHeaderProps {
  workspace: WorkspaceSummary;
  currentUser: WorkspaceUser;
  onlineUsers: WorkspaceUser[];
  canEdit: boolean;
  isVoiceActive: boolean;
  voiceUsers: string[];
  onToggleVoice: () => void;
  onCreateSnapshot: (name: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onLayoutChange: (layout: WorkspaceLayout) => void;
  activeLayout: WorkspaceLayout;
  onToggleSidebar: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  showOnlineUsers: boolean;
  enableVoiceChat: boolean;
  enableVersionControl: boolean;
}

interface CollaborativeGlassCanvasProps {
  width?: number;
  height?: number;
  gridSize?: number;
  showGrid?: boolean;
  showRulers?: boolean;
  enableSnapping?: boolean;
  onElementSelect?: (elementId: string | null) => void;
  className?: string;
}

interface MultiUserGlassEditorProps {
  target?: string;
  showPreview?: boolean;
  showHistory?: boolean;
  showComments?: boolean;
  enableRealTimeSync?: boolean;
  layout?: "vertical" | "horizontal";
  className?: string;
}

interface WorkspaceTabsProps extends CollaborativeGlassCanvasProps {
  selectedElementId: string | null;
  onElementSelect: (elementId: string | null) => void;
  enableComments?: boolean;
  enableRealTimeSync?: boolean;
}

interface WorkspaceSidebarProps {
  selectedElementId: string | null;
  onElementSelect: (elementId: string | null) => void;
  showMiniMap: boolean;
  showOnlineUsers: boolean;
  onlineUsers: WorkspaceUser[];
  currentUser: WorkspaceUser;
  isVoiceActive: boolean;
  voiceUsers: string[];
  enableComments: boolean;
}

export interface GlassTeamCursorsProps {
  showNames?: boolean;
  showVoiceIndicators?: boolean;
  cursorSize?: CursorSize;
  glassLevel?: CursorGlassLevel;
}

export interface GlassTeamCursorsWithEffectsProps
  extends GlassTeamCursorsProps {
  enableRippleEffect?: boolean;
  enableGlowEffect?: boolean;
}

interface VoiceChatPanelProps {
  isActive: boolean;
  voiceUsers: string[];
  onClose: () => void;
  onToggleVoice: () => void;
}

interface VersionControlPanelProps {
  onClose: () => void;
  onCreateSnapshot: (name: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

interface WorkspaceFloatingActionsProps {
  isVoiceActive: boolean;
  onToggleVoice: () => void;
  onShowVoicePanel: () => void;
  onShowVersionPanel: () => void;
  onToggleFullscreen: () => void;
  enableVoiceChat: boolean;
  enableVersionControl: boolean;
}

export function CollaborativeGlassWorkspace(
  props: CollaborativeGlassWorkspaceProps
) {
  return (
    <CollaborationProvider
      roomId={props.workspaceId}
      enableRealTime={props.enableRealTimeSync}
    >
      <WorkspaceContent {...props} />
    </CollaborationProvider>
  );
}

function WorkspaceContent({
  className = "",
  layout = "split",
  theme = "dark",
  showMiniMap = true,
  showOnlineUsers = true,
  showCursors = true,
  enableAdvancedEffects = true,
  compact = false,
  contained = false,
  maxHeight,
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
  onError,
  "aria-label": ariaLabel,
}: Omit<
  CollaborativeGlassWorkspaceProps,
  "workspaceId" | "userId" | "userName" | "userEmail"
>) {
  // Mock collaboration context - in real implementation this would use actual context
  const mockCollaborationContext: {
    isConnected: boolean;
    isConnecting: boolean;
    workspace: WorkspaceSummary;
    users: WorkspaceUser[];
    currentUser: WorkspaceUser;
    onlineUsers: WorkspaceUser[];
    canEdit: boolean;
    isVoiceActive: boolean;
    voiceUsers: string[];
    toggleVoice: () => void;
    addComment: () => void;
    createSnapshot: (name: string) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    connect: () => void;
    disconnect: () => void;
  } = {
    isConnected: true,
    isConnecting: false,
    workspace: { id: "workspace-1", name: "Collaborative Design Session" },
    users: [],
    currentUser: { id: "user-1", name: "Current User", role: "admin" },
    onlineUsers: [
      {
        id: "user-1",
        name: "Alice Johnson",
        role: "admin",
        avatar: "",
        color: "hsl(var(--glass-color-primary))",
      },
      {
        id: "user-2",
        name: "Bob Smith",
        role: "editor",
        avatar: "",
        color: "hsl(var(--glass-color-success))",
      },
      {
        id: "user-3",
        name: "Carol Davis",
        role: "viewer",
        avatar: "",
        color: "hsl(var(--glass-color-warning))",
      },
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
    disconnect: () => {},
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
    canRedo,
  } = mockCollaborationContext;

  // Local state
  const [activeLayout, setActiveLayout] = useState(layout);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [showSidebar, setShowSidebar] = useState(!compact);
  const [showToolbar, setShowToolbar] = useState(!compact);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVoicePanel, setShowVoicePanel] = useState(false);
  const [showVersionPanel, setShowVersionPanel] = useState(false);
  const boundedHeight = maxHeight ?? (compact || contained ? 260 : undefined);

  // Handle workspace events
  useEffect(() => {
    if (workspace) {
      onWorkspaceReady?.(workspace);
    }
  }, [workspace, onWorkspaceReady]);

  // Handle element selection
  const handleElementSelect = useCallback(
    (elementId: string | null) => {
      setSelectedElementId(elementId);
      onElementSelected?.(elementId);
    },
    [onElementSelected]
  );

  // Layout configurations
  const layoutConfig = useMemo(() => {
    switch (activeLayout) {
      case "canvas-focused":
        return {
          canvasSize: "glass-flex-1",
          editorSize: "glass-w-80",
          direction: "row",
          canvasFirst: true,
        };
      case "editor-focused":
        return {
          canvasSize: "glass-w-80",
          editorSize: "glass-flex-1",
          direction: "row",
          canvasFirst: false,
        };
      case "tabs":
        return {
          canvasSize: "glass-w-full",
          editorSize: "glass-w-full",
          direction: "col",
          canvasFirst: true,
        };
      default: // 'split'
        return {
          canvasSize: "glass-flex-1",
          editorSize: "glass-flex-1",
          direction: "row",
          canvasFirst: true,
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
      className={cn(
        "glass-collaborative-workspace workspace-glass-shell glass-relative glass-flex glass-flex-col glass-surface-overlay",
        compact || contained
          ? "glass-h-full glass-min-h-0 glass-overflow-hidden"
          : "glass-h-screen",
        className
      )}
      style={{
        ...(boundedHeight !== undefined
          ? {
              maxHeight:
                typeof boundedHeight === "number"
                  ? `${boundedHeight}px`
                  : boundedHeight,
              height:
                typeof boundedHeight === "number"
                  ? `${boundedHeight}px`
                  : boundedHeight,
            }
          : null),
      }}
      role="main"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <style>{`
        .glass-collaborative-workspace.workspace-glass-shell {
          background: linear-gradient(135deg, #07111f 0%, #0f172a 44%, #111827 100%);
          color: var(--glass-text-primary);
        }

        .glass-collaborative-workspace .workspace-glass-panel {
          background: var(--glass-neutral-level3-surface);
          border-color: var(--glass-neutral-level3-border-color);
          color: var(--glass-neutral-level3-text-primary);
          backdrop-filter: blur(var(--glass-neutral-level3-blur)) var(--glass-filter-base);
          -webkit-backdrop-filter: blur(var(--glass-neutral-level3-blur)) var(--glass-filter-base);
          box-shadow: var(--glass-neutral-level3-shadow);
        }

        .glass-collaborative-workspace .workspace-glass-panel label,
        .glass-collaborative-workspace .workspace-glass-panel p,
        .glass-collaborative-workspace .workspace-glass-panel span {
          color: inherit;
        }

        .glass-collaborative-workspace .workspace-glass-panel button,
        .glass-collaborative-workspace .workspace-glass-panel .workspace-glass-button {
          background-color: rgba(var(--glass-color-white) / 0.1);
          border: 1px solid var(--glass-border-default);
          color: var(--glass-text-primary);
        }

        .glass-collaborative-workspace .workspace-glass-panel .glass-surface-primary,
        .glass-collaborative-workspace .workspace-glass-button-primary {
          background: var(--glass-primary-level3-surface);
          border-color: var(--glass-primary-level3-border-color);
          color: var(--glass-primary-level3-text-primary);
        }

        .glass-collaborative-workspace .workspace-glass-inset {
          background: rgba(var(--glass-color-white) / 0.06);
          border: 1px solid var(--glass-border-default);
          color: var(--glass-text-primary);
        }

        .glass-collaborative-workspace .glass-collaboration-number,
        .glass-collaborative-workspace .glass-collaboration-range {
          appearance: none;
          -webkit-appearance: none;
        }

        .glass-collaborative-workspace .glass-collaboration-number {
          background: rgba(var(--glass-color-white) / 0.08);
          border: 1px solid var(--glass-border-default);
          box-shadow: inset 0 1px 0 rgba(var(--glass-color-white) / 0.12);
          color: var(--glass-text-primary);
        }

        .glass-collaborative-workspace .glass-collaboration-number::placeholder {
          color: var(--glass-text-tertiary);
        }

        .glass-collaborative-workspace .glass-collaboration-number::-webkit-outer-spin-button,
        .glass-collaborative-workspace .glass-collaboration-number::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .glass-collaborative-workspace .glass-collaboration-range {
          height: 0.625rem;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.42);
          background:
            linear-gradient(90deg, rgba(56, 189, 248, 0.9), rgba(34, 197, 94, 0.5)),
            rgba(15, 23, 42, 0.72);
          box-shadow:
            inset 0 1px 2px rgba(2, 6, 23, 0.28),
            0 1px 0 rgba(255, 255, 255, 0.08);
          cursor: pointer;
        }

        .glass-collaborative-workspace .glass-collaboration-range::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 1.125rem;
          height: 1.125rem;
          border-radius: 999px;
          border: 2px solid rgba(248, 250, 252, 0.96);
          background: #38bdf8;
          box-shadow: 0 6px 18px rgba(14, 165, 233, 0.4);
        }

        .glass-collaborative-workspace .glass-collaboration-range::-moz-range-thumb {
          width: 1.125rem;
          height: 1.125rem;
          border-radius: 999px;
          border: 2px solid rgba(248, 250, 252, 0.96);
          background: #38bdf8;
          box-shadow: 0 6px 18px rgba(14, 165, 233, 0.4);
        }
      `}</style>
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
      <div
        className={cn(
          "glass-flex-1 glass-flex glass-min-h-0",
          layoutConfig.direction === "col" ? "glass-flex-col" : "glass-flex-row"
        )}
      >
        {activeLayout === "tabs" ? (
          <WorkspaceTabs
            selectedElementId={selectedElementId}
            onElementSelect={handleElementSelect}
            width={canvasWidth}
            height={canvasHeight}
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
              <div
                className={cn(
                  layoutConfig.canvasSize,
                  "glass-min-w-0 glass-p-4"
                )}
              >
                <CollaborativeGlassCanvas
                  width={canvasWidth}
                  height={canvasHeight}
                  gridSize={gridSize}
                  showGrid={showGrid}
                  showRulers={showRulers}
                  enableSnapping={enableSnapping}
                  onElementSelect={handleElementSelect}
                  className={cn("glass-h-full")}
                />
              </div>
            )}

            {/* Editor Section */}
            {!compact && (
              <div
                className={cn(
                  layoutConfig.editorSize,
                  "glass-min-w-0 glass-p-4"
                )}
              >
                <MultiUserGlassEditor
                  target={selectedElementId || "global"}
                  showPreview={true}
                  showHistory={enableVersionControl}
                  showComments={enableComments}
                  enableRealTimeSync={enableRealTimeSync}
                  layout="vertical"
                  className="glass-h-full"
                />
              </div>
            )}

            {/* Canvas Section (if not first) */}
            {!layoutConfig.canvasFirst && (
              <div
                className={cn(
                  layoutConfig.canvasSize,
                  "glass-min-w-0 glass-p-4"
                )}
              >
                <CollaborativeGlassCanvas
                  width={canvasWidth}
                  height={canvasHeight}
                  gridSize={gridSize}
                  showGrid={showGrid}
                  showRulers={showRulers}
                  enableSnapping={enableSnapping}
                  onElementSelect={handleElementSelect}
                  className={cn("glass-h-full")}
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
      {!compact &&
        showCursors &&
        (enableAdvancedEffects ? (
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
        ))}

      {/* Voice Chat Panel */}
      {!compact && showVoicePanel && enableVoiceChat && (
        <VoiceChatPanel
          isActive={isVoiceActive}
          voiceUsers={voiceUsers}
          onClose={() => setShowVoicePanel(false)}
          onToggleVoice={toggleVoice}
        />
      )}

      {/* Version Control Panel */}
      {!compact && showVersionPanel && enableVersionControl && (
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
  enableVersionControl,
}: WorkspaceHeaderProps) {
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);

  return (
    <div
      className="workspace-header workspace-glass-panel glass-flex glass-items-center glass-justify-between glass-px-4 glass-py-3 glass-border-b glass-border-white/10"
      style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
    >
      {/* Left Section */}
      <div className="glass-flex glass-items-center glass-gap-4">
        <h1 className="glass-text-xl glass-font-bold glass-text-primary">
          {workspace.name}
        </h1>
        <div
          className="glass-text-sm glass-text-primary"
          style={{ opacity: "var(--glass-opacity-60)" }}
        >
          {canEdit ? "✏️ Editing" : "👁️ Viewing"}
        </div>
      </div>

      {/* Center Section - Tools */}
      <div className="glass-flex glass-items-center glass-gap-2">
        {/* Undo/Redo */}
        {enableVersionControl && (
          <>
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary glass-focus glass-touch-target glass-contrast-guard"
              style={{ opacity: "var(--glass-opacity-50)" }}
              title="Undo"
              aria-label="Undo last action"
            >
              <Undo className="glass-w-4 glass-h-4" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary glass-focus glass-touch-target glass-contrast-guard"
              style={{ opacity: "var(--glass-opacity-50)" }}
              title="Redo"
              aria-label="Redo last action"
            >
              <Redo className="glass-w-4 glass-h-4" />
            </button>
            <button
              onClick={() => onCreateSnapshot(`Snapshot ${Date.now()}`)}
              className="workspace-glass-button-primary glass-px-3 glass-py-2 glass-text-sm glass-surface-primary glass-text-primary glass-radius"
              title="Create Snapshot"
            >
              📷 Snapshot
            </button>
          </>
        )}

        {/* Layout Switcher */}
        <div className="glass-relative">
          <button
            onClick={() => setShowLayoutMenu(!showLayoutMenu)}
            className="glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary"
            title="Change Layout"
            aria-label="Change workspace layout"
          >
            🔀
          </button>
          {showLayoutMenu && (
            <div className="glass-absolute glass-top-full glass-left-0 glass-mt-2 glass-p-2 glass-surface-overlay glass-border glass-border-white/20 glass-radius glass-shadow-lg glass-z-50">
              {(
                ["split", "tabs", "canvas-focused", "editor-focused"] as const
              ).map((layout) => (
                <button
                  key={layout}
                  onClick={() => {
                    onLayoutChange(layout);
                    setShowLayoutMenu(false);
                  }}
                  className={cn(
                    "glass-block glass-w-full glass-text-left glass-px-3 glass-py-2 glass-text-sm glass-radius glass-text-primary",
                    activeLayout === layout
                      ? "glass-surface-primary"
                      : "glass-surface-transparent"
                  )}
                >
                  {layout.charAt(0).toUpperCase() +
                    layout.slice(1).replace("-", " ")}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Voice Chat Toggle */}
        {enableVoiceChat && (
          <button
            onClick={onToggleVoice}
            className={cn(
              "glass-p-2 glass-radius glass-text-primary",
              isVoiceActive
                ? "glass-surface-success"
                : "glass-surface-transparent"
            )}
            title={isVoiceActive ? "Leave Voice Chat" : "Join Voice Chat"}
            aria-label={isVoiceActive ? "Leave voice chat" : "Join voice chat"}
          >
            {isVoiceActive ? (
              <Mic className="glass-w-4 glass-h-4" />
            ) : (
              <MicOff className="glass-w-4 glass-h-4" />
            )}
            {voiceUsers.length > 0 && ` (${voiceUsers.length})`}
          </button>
        )}
      </div>

      {/* Right Section */}
      <div className="glass-flex glass-items-center glass-gap-2">
        {/* Online Users */}
        {showOnlineUsers && (
          <div className="glass-flex glass-items-center glass-gap-2">
            <div className="glass-flex">
              {onlineUsers.slice(0, 5).map((user, index) => (
                <div
                  key={user.id}
                  className="glass-w-8 glass-h-8 glass-radius-full glass-border-2 glass-border-white glass-flex glass-items-center glass-justify-center glass-text-xs glass-font-bold glass-text-primary"
                  style={{
                    backgroundColor: user.color,
                    marginLeft: index === 0 ? 0 : -8,
                  }}
                  title={user.name}
                >
                  {user.name[0]}
                </div>
              ))}
              {onlineUsers.length > 5 && (
                <div className="glass-w-8 glass-h-8 glass-radius-full glass-surface-primary glass-border-2 glass-border-white glass-flex glass-items-center glass-justify-center glass-text-xs glass-text-primary">
                  +{onlineUsers.length - 5}
                </div>
              )}
            </div>
            <span
              className="glass-text-sm glass-text-primary"
              style={{ opacity: "var(--glass-opacity-60)" }}
            >
              {onlineUsers.length} online
            </span>
          </div>
        )}

        {/* Controls */}
        <button
          onClick={onToggleSidebar}
          className="glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
          title="Toggle Sidebar"
          aria-label="Toggle sidebar"
        >
          <Layers className="glass-w-4 glass-h-4" />
        </button>
        <button
          onClick={onToggleFullscreen}
          className="glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
          title="Toggle Fullscreen"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <Minimize className="glass-w-4 glass-h-4" />
          ) : (
            <Maximize className="glass-w-4 glass-h-4" />
          )}
        </button>
      </div>
    </div>
  );
}

// Mock sub-components - in real implementation these would be actual components
function WorkspaceTabs({
  selectedElementId,
  onElementSelect,
  enableComments,
  enableRealTimeSync,
  ...props
}: WorkspaceTabsProps) {
  const [activeTab, setActiveTab] = useState<"canvas" | "editor">("canvas");

  return (
    <div className="glass-flex glass-flex-col glass-h-full">
      {/* Tab Navigation */}
      <div className="glass-flex glass-border-b glass-border-white/20 glass-surface-overlay">
        <button
          onClick={() => setActiveTab("canvas")}
          className={`glass-px-6 glass-py-3 glass-font-medium ${
            activeTab === "canvas"
              ? "glass-text-white glass-border-b-2 glass-border-blue-400 glass-surface-overlay"
              : "glass-text-white-opacity-70 glass-hover-text-white"
          }`}
        >
          🎨 Canvas
        </button>
        <button
          onClick={() => setActiveTab("editor")}
          className={`glass-px-6 glass-py-3 glass-font-medium ${
            activeTab === "editor"
              ? "glass-text-white glass-border-b-2 glass-border-blue-400 glass-surface-overlay"
              : "glass-text-white-opacity-70 glass-hover-text-white"
          }`}
        >
          ⚙️ Properties
        </button>
      </div>

      {/* Tab Content */}
      <div className="glass-flex-1 glass-p-4">
        {activeTab === "canvas" ? (
          <CollaborativeGlassCanvas
            {...props}
            onElementSelect={onElementSelect}
            className="glass-h-full"
          />
        ) : (
          <MultiUserGlassEditor
            showComments={enableComments}
            enableRealTimeSync={enableRealTimeSync}
            className="glass-h-full"
          />
        )}
      </div>
    </div>
  );
}

function CollaborativeGlassCanvas({
  width,
  height,
  gridSize,
  showGrid,
  showRulers,
  enableSnapping,
  onElementSelect,
  className,
}: CollaborativeGlassCanvasProps) {
  return (
    <div
      className={`collaborative-canvas workspace-glass-panel relative ${className}`}
      style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
    >
      {showGrid && (
        <div
          className="glass-absolute glass-inset-0 glass-opacity-20"
          style={{
            backgroundImage: `linear-gradient(var(--glass-bg-default) 1px, transparent 1px), linear-gradient(90deg, var(--glass-bg-default) 1px, transparent 1px)`,
            backgroundSize: `${gridSize}px ${gridSize}px`,
          }}
        />
      )}

      <div className="glass-flex glass-items-center glass-justify-center glass-h-full glass-text-primary-glass-opacity-60">
        <div className="glass-text-center">
          <div className="glass-text-4xl glass-mb-4">🎨</div>
          <p className="glass-text-lg">Collaborative Canvas</p>
          <p className="glass-text-sm">Click to start designing together</p>
        </div>
      </div>
    </div>
  );
}

function MultiUserGlassEditor({
  target,
  showPreview,
  showHistory,
  showComments,
  enableRealTimeSync,
  layout,
  className,
}: MultiUserGlassEditorProps) {
  return (
    <div
      className={`multi-user-editor workspace-glass-panel ${className}`}
      style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
    >
      <div className="glass-p-4">
        <div className="glass-flex glass-items-center glass-justify-between glass-mb-4">
          <h2 className="glass-text-primary glass-font-semibold">
            Properties Editor
          </h2>
          <div className="glass-flex glass-gap-2">
            {showHistory && (
              <button className="glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary">
                📜
              </button>
            )}
            {showComments && (
              <button className="glass-p-2 glass-radius hover:glass-surface-subtle/10 glass-text-primary">
                💬
              </button>
            )}
            {enableRealTimeSync && (
              <div className="glass-flex glass-items-center glass-gap-1 glass-text-primary glass-text-sm">
                <Wifi className="glass-w-3 glass-h-3" /> Live
              </div>
            )}
          </div>
        </div>

        <div className="glass-space-y-4">
          <div>
            <label className="glass-block glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80 glass-mb-2">
              Target Element
            </label>
            <div className="workspace-glass-inset glass-p-2 glass-surface-subtle/5 glass-radius glass-text-primary glass-text-sm">
              {target}
            </div>
          </div>

          <div>
            <label className="glass-block glass-text-sm glass-font-medium glass-text-primary-glass-opacity-80 glass-mb-2">
              Properties
            </label>
            <div className="glass-space-y-2">
              <div className="glass-flex glass-items-center glass-gap-2">
                <span className="glass-text-primary-glass-opacity-60 glass-text-sm glass-w-20">
                  Width:
                </span>
                <input
                  type="number"
                  data-glass-component="number"
                  className="glass-collaboration-number glass-flex-1 glass-p-2 glass-surface-subtle/10 glass-radius glass-text-primary glass-text-sm glass-touch-target glass-contrast-guard"
                  placeholder="Auto"
                  aria-label="Width"
                />
              </div>
              <div className="glass-flex glass-items-center glass-gap-2">
                <span className="glass-text-primary-glass-opacity-60 glass-text-sm glass-w-20">
                  Height:
                </span>
                <input
                  type="number"
                  data-glass-component="number"
                  className="glass-collaboration-number glass-flex-1 glass-p-2 glass-surface-subtle/10 glass-radius glass-text-primary glass-text-sm glass-touch-target glass-contrast-guard"
                  placeholder="Auto"
                  aria-label="Height"
                />
              </div>
              <div className="glass-flex glass-items-center glass-gap-2">
                <span className="glass-text-primary-glass-opacity-60 glass-text-sm glass-w-20">
                  Opacity:
                </span>
                <input
                  type="range"
                  data-glass-component="range"
                  min="0"
                  max="1"
                  step="0.1"
                  className="glass-collaboration-range glass-flex-1 glass-touch-target glass-contrast-guard"
                  aria-label="Opacity"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkspaceSidebar({
  selectedElementId,
  onElementSelect,
  showMiniMap,
  showOnlineUsers,
  onlineUsers,
  currentUser,
  isVoiceActive,
  voiceUsers,
  enableComments,
}: WorkspaceSidebarProps) {
  return (
    <div
      className="workspace-sidebar workspace-glass-panel glass-w-80 glass-border-l glass-border-white/20 glass-p-4 glass-space-y-4"
      style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
    >
      {/* Mini Map */}
      {showMiniMap && (
        <div className="glass-space-y-2">
          <h3 className="glass-text-sm glass-font-semibold glass-text-primary-glass-opacity-80 glass-uppercase">
            Mini Map
          </h3>
          <div className="workspace-glass-inset glass-aspect-video glass-surface-overlay glass-border glass-border-white/20 glass-radius glass-p-2">
            <div className="glass-text-xs glass-text-primary glass-text-center glass-mt-8">
              Canvas overview
            </div>
          </div>
        </div>
      )}

      {/* Online Users */}
      {showOnlineUsers && (
        <div className="glass-space-y-2">
          <h3 className="glass-text-sm glass-font-semibold glass-text-primary-glass-opacity-80 glass-uppercase">
            Online Users
          </h3>
          <div className="glass-space-y-2">
            {onlineUsers.map((user) => (
              <div
                key={user.id}
                className="glass-flex glass-items-center glass-gap-3 glass-p-2 glass-radius hover:glass-surface-subtle/5"
              >
                <div
                  className="glass-w-6 glass-h-6 glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-xs glass-font-bold glass-text-primary"
                  style={{ backgroundColor: user.color }}
                >
                  {user.name[0]}
                </div>
                <div className="glass-flex-1">
                  <div className="glass-text-sm glass-text-primary">
                    {user.name}
                  </div>
                  <div className="glass-text-xs glass-text-primary-glass-opacity-50">
                    {user.role}
                  </div>
                </div>
                {voiceUsers.includes(user.id) && (
                  <div className="glass-text-primary glass-text-xs">🎤</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="glass-space-y-2">
        <h3 className="glass-text-sm glass-font-semibold glass-text-primary-glass-opacity-80 glass-uppercase">
          Quick Actions
        </h3>
        <div className="glass-space-y-2">
          <button className="glass-w-full glass-text-left glass-px-3 glass-py-2 glass-text-sm glass-surface-subtle/5 hover:glass-surface-subtle/10 glass-radius glass-text-primary">
            <Copy className="glass-w-4 glass-h-4 glass-inline glass-mr-2" />
            Copy Selected
          </button>
          <button className="glass-w-full glass-text-left glass-px-3 glass-py-2 glass-text-sm glass-surface-subtle/5 hover:glass-surface-subtle/10 glass-radius glass-text-primary">
            <ClipboardPaste className="glass-w-4 glass-h-4 glass-inline glass-mr-2" />
            Paste
          </button>
          <button className="glass-w-full glass-text-left glass-px-3 glass-py-2 glass-text-sm glass-surface-subtle/5 hover:glass-surface-subtle/10 glass-radius glass-text-primary">
            <Trash2 className="glass-w-4 glass-h-4 glass-inline glass-mr-2" />
            Delete Selected
          </button>
        </div>
      </div>
    </div>
  );
}

export function GlassTeamCursors({
  showNames,
  showVoiceIndicators,
  cursorSize,
  glassLevel,
}: GlassTeamCursorsProps) {
  const size = cursorSize === "lg" ? 18 : cursorSize === "sm" ? 12 : 15;
  const users = [
    { id: "aurora", name: "Aurora", color: "#38bdf8", x: "24%", y: "34%" },
    { id: "lumen", name: "Lumen", color: "#c084fc", x: "58%", y: "48%" },
    { id: "orbit", name: "Orbit", color: "#facc15", x: "72%", y: "26%" },
  ];

  return (
    <div className="glass-pointer-events-none glass-absolute glass-inset-0 glass-z-30">
      {users.map((user) => (
        <div
          key={user.id}
          className="glass-absolute glass-flex glass-items-start glass-gap-1.5"
          style={{ left: user.x, top: user.y }}
        >
          <svg
            width={size}
            height={Math.round(size * 1.32)}
            viewBox="0 0 18 24"
            aria-hidden="true"
            style={{
              color: user.color,
              filter:
                glassLevel === "high"
                  ? `drop-shadow(0 0 12px ${user.color})`
                  : `drop-shadow(0 4px 10px rgba(0,0,0,0.35))`,
            }}
          >
            <path
              d="M2 2L16 14.5L10.3 15.2L7.4 22L2 2Z"
              fill="currentColor"
              stroke="rgba(255,255,255,0.88)"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
          {showNames && (
            <span
              className="glass-radius-full glass-px-2 glass-py-0.5 glass-text-xs glass-font-medium glass-text-primary glass-shadow-lg glass-backdrop-blur-md"
              style={{
                ...createGlassStyle({ intent: "neutral", elevation: "level2" }),
                border: `1px solid ${user.color}`,
              }}
            >
              {user.name}
              {showVoiceIndicators ? " mic" : ""}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function GlassTeamCursorsWithEffects({
  showNames,
  showVoiceIndicators,
  cursorSize,
  glassLevel,
  enableRippleEffect,
  enableGlowEffect,
}: GlassTeamCursorsWithEffectsProps) {
  return (
    <>
      {enableRippleEffect && (
        <>
          <span
            className="glass-pointer-events-none glass-absolute glass-z-20 glass-radius-full"
            style={{
              left: "48%",
              top: "52%",
              width: 72,
              height: 72,
              border: "1px solid rgba(56,189,248,0.42)",
              boxShadow: "0 0 38px rgba(56,189,248,0.16)",
              transform: "translate(-50%, -50%)",
            }}
          />
          <span
            className="glass-pointer-events-none glass-absolute glass-z-20 glass-radius-full"
            style={{
              left: "48%",
              top: "52%",
              width: 34,
              height: 34,
              border: "1px solid rgba(192,132,252,0.5)",
              transform: "translate(-50%, -50%)",
            }}
          />
        </>
      )}
      <GlassTeamCursors
        showNames={showNames}
        showVoiceIndicators={showVoiceIndicators}
        cursorSize={cursorSize}
        glassLevel={enableGlowEffect ? "high" : glassLevel}
      />
    </>
  );
}

function VoiceChatPanel({
  isActive,
  voiceUsers,
  onClose,
  onToggleVoice,
}: VoiceChatPanelProps) {
  return (
    <div
      className="glass-fixed glass-bottom-4 glass-right-4 glass-w-80 glass-p-4 glass-radius-lg glass-border glass-border-white/20"
      style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
    >
      <div className="glass-flex glass-items-center glass-justify-between glass-mb-4">
        <h3 className="glass-text-primary glass-font-semibold">Voice Chat</h3>
        <button
          onClick={onClose}
          className="glass-contrast-guard glass-focus glass-touch-target hover:glass-text-primary glass-text-primary-opacity-70"
          aria-label="Close voice chat panel"
        >
          ✕
        </button>
      </div>

      <div className="glass-space-y-2 glass-mb-4">
        {voiceUsers.map((userId: string) => (
          <div
            key={userId}
            className="glass-flex glass-items-center glass-gap-2 glass-text-primary glass-text-sm"
          >
            <div className="glass-w-2 glass-h-2 glass-surface-success glass-radius-full glass-animate-pulse" />
            User {userId}
          </div>
        ))}
      </div>

      <button
        onClick={onToggleVoice}
        className={cn(
          "glass-w-full glass-py-2 glass-radius glass-text-primary glass-transition",
          isActive ? "glass-surface-danger" : "glass-surface-success"
        )}
      >
        {isActive ? "🔇 Leave" : "🎤 Join"} Voice Chat
      </button>
    </div>
  );
}

function VersionControlPanel({
  onClose,
  onCreateSnapshot,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: VersionControlPanelProps) {
  return (
    <div
      className="glass-fixed glass-bottom-4 glass-left-4 glass-w-80 glass-p-4 glass-radius-lg glass-border glass-border-white/20"
      style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
    >
      <div className="glass-flex glass-items-center glass-justify-between glass-mb-4">
        <h3 className="glass-text-primary glass-font-semibold">
          Version Control
        </h3>
        <button
          onClick={onClose}
          className="glass-contrast-guard glass-focus glass-touch-target hover:glass-text-primary glass-text-primary-opacity-70"
          aria-label="Close version control panel"
        >
          ✕
        </button>
      </div>

      <div className="glass-space-y-2">
        <div className="glass-flex glass-gap-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="glass-flex-1 glass-py-2 glass-px-3 glass-radius glass-surface-subtle/10 glass-text-primary disabled:glass-opacity-50 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
          >
            <Undo className="glass-w-4 glass-h-4 glass-inline glass-mr-1" />
            Undo
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="glass-flex-1 glass-py-2 glass-px-3 glass-radius glass-surface-subtle/10 glass-text-primary disabled:glass-opacity-50 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
          >
            <Redo className="glass-w-4 glass-h-4 glass-inline glass-mr-1" />
            Redo
          </button>
        </div>

        <button
          onClick={() => onCreateSnapshot(`Manual snapshot ${Date.now()}`)}
          className="glass-w-full glass-py-2 glass-px-3 glass-radius glass-surface-primary glass-text-primary"
        >
          <Save className="glass-w-4 glass-h-4 glass-inline glass-mr-1" />
          Create Snapshot
        </button>
      </div>
    </div>
  );
}

function WorkspaceFloatingActions({
  isVoiceActive,
  onToggleVoice,
  onShowVoicePanel,
  onShowVersionPanel,
  onToggleFullscreen,
  enableVoiceChat,
  enableVersionControl,
}: WorkspaceFloatingActionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="glass-fixed glass-bottom-6 glass-right-6">
      <div
        className={cn(
          "glass-flex glass-flex-col glass-gap-2",
          !isExpanded && "glass-pointer-events-none"
        )}
        style={{
          opacity: isExpanded ? 1 : 0,
          pointerEvents: isExpanded ? "auto" : "none",
          transition: "opacity 160ms ease",
        }}
      >
        {enableVoiceChat && (
          <button
            onClick={onShowVoicePanel}
            className="glass-w-12 glass-h-12 glass-radius-full glass-surface-success glass-text-primary glass-flex glass-items-center glass-justify-center glass-shadow-lg glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
            title="Voice Chat"
            aria-label="Open voice chat panel"
          >
            <Mic className="glass-w-4 glass-h-4" />
          </button>
        )}

        {enableVersionControl && (
          <button
            onClick={onShowVersionPanel}
            className="glass-w-12 glass-h-12 glass-radius-full glass-surface-primary glass-text-primary glass-flex glass-items-center glass-justify-center glass-shadow-lg glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
            title="Version Control"
            aria-label="Open version control panel"
          >
            <Settings className="glass-w-4 glass-h-4" />
          </button>
        )}

        <button
          onClick={onToggleFullscreen}
          className="glass-w-12 glass-h-12 glass-radius-full glass-surface-primary glass-text-primary glass-flex glass-items-center glass-justify-center glass-shadow-lg hover:glass-surface-subtle glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
          title="Fullscreen"
          aria-label="Toggle fullscreen mode"
        >
          <Maximize className="glass-w-4 glass-h-4" />
        </button>
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="glass-w-14 glass-h-14 glass-radius-full glass-surface-overlay glass-text-primary glass-flex glass-items-center glass-justify-center glass-shadow-lg glass-hover-bg-slate-600 glass-mt-2"
        style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
        aria-label={
          isExpanded
            ? "Close floating actions menu"
            : "Open floating actions menu"
        }
      >
        {isExpanded ? "✕" : "⚡"}
      </button>
    </div>
  );
}

// Loading and Error Components
function WorkspaceLoadingState({
  message = "Connecting to workspace...",
}: {
  message?: string;
}) {
  return (
    <div className="glass-h-screen glass-flex glass-items-center glass-justify-center glass-surface-overlay">
      <div className="glass-text-center glass-space-y-4">
        <div className="glass-w-16 glass-h-16 glass-border-4 glass-border-blue glass-border-t-transparent glass-radius-full glass-animate-spin glass-mx-auto" />
        <div className="glass-text-primary glass-text-lg">{message}</div>
        <div className="glass-text-primary-glass-opacity-60 glass-text-sm">
          Please wait...
        </div>
      </div>
    </div>
  );
}

function WorkspaceConnectionError({
  onRetry,
  error,
}: {
  onRetry: () => void;
  error: string;
}) {
  return (
    <div className="glass-h-screen glass-flex glass-items-center glass-justify-center glass-surface-overlay">
      <div className="glass-text-center glass-space-y-4 glass-max-w-md">
        <div className="glass-text-primary glass-text-6xl glass-mb-4">⚠️</div>
        <div className="glass-text-primary glass-text-xl glass-font-semibold">
          Connection Error
        </div>
        <div className="glass-text-primary-opacity-70">{error}</div>
        <button
          onClick={onRetry}
          className="glass-px-6 glass-py-3 glass-surface-primary glass-text-primary glass-radius glass-transition-colors glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
}

export default CollaborativeGlassWorkspace;
