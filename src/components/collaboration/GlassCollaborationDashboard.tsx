"use client";
import React, { useState } from "react";
import { Glass } from "../../primitives";
import {
  useCollaboration,
  CollaborationUser,
  CollaborationActivity,
} from "./GlassCollaborationProvider";
import { cn } from "../../lib/utilsComprehensive";

interface CollaborationDashboardProps {
  className?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  fixed?: boolean;
  showUserList?: boolean;
  showActivityFeed?: boolean;
  showControls?: boolean;
  "data-testid"?: string;
}

const createDemoUsers = (): CollaborationUser[] => {
  const now = Date.now();
  return [
    {
      id: "demo-current",
      name: "Aurora",
      email: "aurora@example.com",
      color: "#38bdf8",
      lastActive: now - 12000,
      cursor: { x: 148, y: 80 },
    },
    {
      id: "demo-reviewer",
      name: "Lumen",
      email: "lumen@example.com",
      color: "#a3e635",
      lastActive: now - 36000,
    },
    {
      id: "demo-editor",
      name: "Orbit",
      email: "orbit@example.com",
      color: "#f59e0b",
      lastActive: now - 82000,
    },
  ];
};

const createDemoActivities = (): CollaborationActivity[] => {
  const now = Date.now();
  return [
    {
      id: "demo-activity-1",
      userId: "demo-current",
      type: "edit",
      description: "Aurora updated the dashboard copy",
      timestamp: now - 45000,
    },
    {
      id: "demo-activity-2",
      userId: "demo-reviewer",
      type: "comment",
      description: "Lumen left a review note",
      timestamp: now - 125000,
    },
  ];
};

const UserAvatar: React.FC<{
  user: CollaborationUser;
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
}> = ({ user, size = "md", showStatus = true }) => {
  const sizeClasses = {
    sm: "glass-w-6 glass-h-6 glass-text-xs",
    md: "glass-w-8 glass-h-8 glass-text-sm",
    lg: "glass-w-10 glass-h-10 glass-text-base",
  };

  const isActive = Date.now() - user.lastActive < 60000; // Active within last minute

  return (
    <div data-glass-component className="glass-relative">
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className={cn(
            "glass-radius-full glass-object-cover glass-border-2",
            sizeClasses[size],
            isActive ? "glass-border-success" : "glass-border-subtle"
          )}
        />
      ) : (
        <div
          className={cn(
            "glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-primary glass-font-medium glass-border-2",
            sizeClasses[size],
            isActive ? "glass-border-success" : "glass-border-subtle"
          )}
          style={{ backgroundColor: user.color }}
        >
          {user.name[0]?.toUpperCase()}
        </div>
      )}

      {showStatus && (
        <div
          className={cn(
            "glass-absolute glass-w-3 glass-h-3 glass-radius-full glass-border-2 glass-border-white",
            isActive ? "glass-surface-success" : "glass-surface-subtle"
          )}
          style={{ right: -2, bottom: -2 }}
        />
      )}
    </div>
  );
};

const ActivityItem: React.FC<{
  activity: CollaborationActivity;
  user?: CollaborationUser;
}> = ({ activity, user }) => {
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getActivityIcon = () => {
    switch (activity.type) {
      case "join":
        return "🟢";
      case "leave":
        return "🔴";
      case "edit":
        return "✏️";
      case "comment":
        return "💬";
      case "cursor_move":
        return "👆";
      default:
        return "•";
    }
  };

  const getActivityColor = () => {
    switch (activity.type) {
      case "join":
        return "glass-text-success";
      case "leave":
        return "glass-text-danger";
      case "edit":
        return "glass-text-primary";
      case "comment":
        return "glass-text-secondary";
      default:
        return "glass-text-secondary";
    }
  };

  return (
    <div className="glass-flex glass-items-center glass-gap-3 glass-p-2 glass-radius hover:glass-surface-subtle glass-transition-colors">
      <div className="glass-flex glass-items-center glass-gap-2">
        {user && <UserAvatar user={user} size="sm" showStatus={false} />}
        <span className="glass-text-lg">{getActivityIcon()}</span>
      </div>

      <div className="glass-flex-1 glass-min-w-0">
        <p className={cn("glass-text-sm", getActivityColor())}>
          {activity.description}
        </p>
      </div>

      <span className="glass-text-xs glass-text-secondary glass-whitespace-nowrap">
        {formatTime(activity.timestamp)}
      </span>
    </div>
  );
};

const ConnectionStatus: React.FC = () => {
  const { connectionStatus, isConnected } = useCollaboration();

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "glass-text-success";
      case "connecting":
      case "reconnecting":
        return "glass-text-warning";
      case "disconnected":
        return "glass-text-danger";
      default:
        return "glass-text-secondary";
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return "🟢";
      case "connecting":
      case "reconnecting":
        return "🟡";
      case "disconnected":
        return "🔴";
      default:
        return "⚫";
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting...";
      case "reconnecting":
        return "Reconnecting...";
      case "disconnected":
        return "Disconnected";
      default:
        return "Unknown";
    }
  };

  return (
    <div
      className={cn(
        "glass-flex glass-items-center glass-gap-2 glass-text-sm",
        getStatusColor()
      )}
    >
      <span>{getStatusIcon()}</span>
      <span>{getStatusText()}</span>
    </div>
  );
};

export const GlassCollaborationDashboard: React.FC<
  CollaborationDashboardProps
> = ({
  className,
  position = "top-right",
  fixed = false,
  showUserList = true,
  showActivityFeed = true,
  showControls = true,
  "data-testid": dataTestId,
}) => {
  const {
    users,
    currentUser,
    activities,
    comments,
    showCursors,
    showComments,
    showActivity,
    toggleCursors,
    toggleComments,
    toggleActivity,
  } = useCollaboration();

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "activity">("users");
  const isDemoContent =
    users.length === 0 && activities.length === 0 && comments.length === 0;
  const demoUsers = isDemoContent ? createDemoUsers() : [];
  const resolvedUsers = isDemoContent ? demoUsers : users;
  const resolvedCurrentUser = currentUser ?? resolvedUsers[0];
  const resolvedActivities = isDemoContent
    ? createDemoActivities()
    : activities;
  const resolvedComments = comments;

  const positionClasses = {
    "top-left": "glass-top-4 glass-left-4",
    "top-right": "glass-top-4 glass-right-4",
    "bottom-left": "glass-bottom-4 glass-left-4",
    "bottom-right": "glass-bottom-4 glass-right-4",
  };

  const activeUsers = resolvedUsers.filter(
    (user: any) => Date.now() - user.lastActive < 300000
  ); // Active within 5 minutes
  const recentActivities = resolvedActivities.slice(0, 20);
  const unresolvedComments = resolvedComments.filter((c: any) => !c.resolved);

  return (
    <div
      className={cn(
        fixed
          ? ["glass-fixed glass-z-40", positionClasses[position]]
          : "glass-relative glass-inline-flex glass-z-0",
        className
      )}
      data-testid={dataTestId}
    >
      {!isExpanded ? (
        // Collapsed state
        <Glass className="glass-p-3 glass-contrast-guard">
          <button
            onClick={() => setIsExpanded(true)}
            className="glass-flex glass-items-center glass-gap-3 hover:glass-surface-subtle glass-radius glass-p-2 glass-transition-colors glass-focus glass-touch-target glass-contrast-guard"
          >
            <div className="glass-flex">
              {activeUsers.slice(0, 3).map((user: any, index: number) => (
                <span
                  key={user.id}
                  style={{ marginLeft: index === 0 ? 0 : -8 }}
                >
                  <UserAvatar user={user} size="sm" />
                </span>
              ))}
              {activeUsers.length > 3 && (
                <div className="glass-w-6 glass-h-6 glass-surface-subtle glass-text-secondary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-xs glass-border-2 glass-border-white">
                  +{activeUsers.length - 3}
                </div>
              )}
            </div>

            <div className="glass-text-left">
              <div className="glass-text-sm glass-font-medium glass-text-secondary">
                {activeUsers.length} online
              </div>
              <ConnectionStatus />
            </div>

            {unresolvedComments.length > 0 && (
              <div className="glass-w-5 glass-h-5 glass-surface-danger glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-xs">
                {unresolvedComments.length}
              </div>
            )}
          </button>
        </Glass>
      ) : (
        // Expanded state
        <Glass className="glass-w-80 glass-max-h-96 glass-overflow-hidden glass-contrast-guard">
          {/* Header */}
          <div className="glass-flex glass-items-center glass-justify-between glass-p-4 glass-border-b glass-border-subtle">
            <h3 className="glass-font-semibold glass-text-secondary">
              Collaboration
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="glass-text-secondary hover:glass-text-secondary glass-p-1 glass-focus glass-touch-target glass-contrast-guard"
            >
              ✕
            </button>
          </div>

          {/* Connection Status */}
          <div className="glass-px-4 glass-py-2 glass-surface-subtle glass-border-b glass-border-subtle">
            <ConnectionStatus />
          </div>

          {/* Controls */}
          {showControls && (
            <div className="glass-p-4 glass-border-b glass-border-subtle">
              <div className="glass-grid glass-grid-cols-3 glass-gap-2">
                <button
                  onClick={toggleCursors}
                  className={cn(
                    "glass-flex glass-flex-col glass-items-center glass-gap-1 glass-p-2 glass-radius glass-text-xs glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",
                    showCursors
                      ? "glass-surface-info glass-text-primary"
                      : "glass-surface-subtle glass-text-secondary"
                  )}
                >
                  <span>👆</span>
                  Cursors
                </button>

                <button
                  onClick={toggleComments}
                  className={cn(
                    "glass-relative glass-flex glass-flex-col glass-items-center glass-gap-1 glass-p-2 glass-radius glass-text-xs glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",
                    showComments
                      ? "glass-surface-primary glass-text-primary"
                      : "glass-surface-subtle glass-text-secondary"
                  )}
                >
                  <span>💬</span>
                  Comments
                  {unresolvedComments.length > 0 && (
                    <div
                      className="glass-absolute glass-top-1 glass-w-4 glass-h-4 glass-surface-danger glass-text-primary glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-xs"
                      style={{ right: -4 }}
                    >
                      {unresolvedComments.length}
                    </div>
                  )}
                </button>

                <button
                  onClick={toggleActivity}
                  className={cn(
                    "glass-flex glass-flex-col glass-items-center glass-gap-1 glass-p-2 glass-radius glass-text-xs glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",
                    showActivity
                      ? "glass-surface-success glass-text-primary"
                      : "glass-surface-subtle glass-text-secondary"
                  )}
                >
                  <span>📊</span>
                  Activity
                </button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="glass-flex glass-border-b glass-border-subtle">
            <button
              onClick={() => setActiveTab("users")}
              className={cn(
                "glass-flex-1 glass-px-4 glass-py-2 glass-text-sm glass-font-medium glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",
                activeTab === "users"
                  ? "glass-text-primary glass-border-b glass-border-primary glass-surface-subtle/10"
                  : "glass-text-secondary"
              )}
            >
              Users ({activeUsers.length})
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={cn(
                "glass-flex-1 glass-px-4 glass-py-2 glass-text-sm glass-font-medium glass-transition-colors glass-focus glass-touch-target glass-contrast-guard",
                activeTab === "activity"
                  ? "glass-text-primary glass-border-b glass-border-primary glass-surface-subtle/10"
                  : "glass-text-secondary"
              )}
            >
              Activity
            </button>
          </div>

          {/* Content */}
          <div className="glass-max-h-64 glass-overflow-y-auto">
            {activeTab === "users" && showUserList && (
              <div className="glass-p-4 glass-space-y-3">
                {activeUsers.map((user: any) => {
                  const isCurrentUser = user.id === resolvedCurrentUser?.id;
                  const isActive = Date.now() - user.lastActive < 60000;

                  return (
                    <div
                      key={user.id}
                      className={cn(
                        "glass-flex glass-items-center glass-gap-3 glass-p-2 glass-radius",
                        isCurrentUser
                          ? "glass-surface-info"
                          : "glass-surface-transparent"
                      )}
                    >
                      <UserAvatar user={user} size="md" />

                      <div className="glass-flex-1 glass-min-w-0">
                        <div className="glass-flex glass-items-center glass-gap-2">
                          <span className="glass-text-sm glass-font-medium glass-text-secondary glass-truncate">
                            {user.name}
                            {isCurrentUser && " (You)"}
                          </span>
                          {!isActive && (
                            <span className="glass-text-xs glass-text-secondary">
                              Away
                            </span>
                          )}
                        </div>
                        <span className="glass-text-xs glass-text-secondary glass-truncate">
                          {user.email}
                        </span>
                      </div>

                      {user.cursor && (
                        <span className="glass-text-xs glass-text-primary">
                          📍
                        </span>
                      )}
                    </div>
                  );
                })}

                {activeUsers.length === 0 && (
                  <div className="glass-text-center glass-py-6 glass-text-secondary">
                    <div className="glass-text-2xl glass-mb-2">👥</div>
                    <p className="glass-text-sm">No users online</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "activity" && showActivityFeed && (
              <div className="glass-p-4 glass-space-y-1">
                {recentActivities.map((activity: any) => {
                  const user = resolvedUsers.find(
                    (u) => u.id === activity.userId
                  );
                  return (
                    <ActivityItem
                      key={activity.id}
                      activity={activity}
                      user={user}
                    />
                  );
                })}

                {recentActivities.length === 0 && (
                  <div className="glass-text-center glass-py-6 glass-text-secondary">
                    <div className="glass-text-2xl glass-mb-2">📊</div>
                    <p className="glass-text-sm">No recent activity</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Stats */}
          <div className="glass-px-4 glass-py-2 glass-surface-subtle glass-border-t glass-border-subtle glass-text-xs glass-text-secondary">
            <div className="glass-flex glass-justify-between">
              <span>{resolvedComments.length} comments</span>
              <span>{resolvedActivities.length} activities</span>
            </div>
          </div>
        </Glass>
      )}
    </div>
  );
};
