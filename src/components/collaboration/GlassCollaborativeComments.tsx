"use client";
import React, { useState, useRef, useEffect } from "react";
import { Glass } from "../../primitives";
import {
  useCollaboration,
  CollaborationComment,
  CollaborationUser,
} from "./GlassCollaborationProvider";
import { cn } from "../../lib/utilsComprehensive";

interface CollaborativeCommentsProps {
  className?: string;
  allowComments?: boolean;
  compact?: boolean;
  contained?: boolean;
  maxHeight?: number | string;
  "aria-label"?: string;
  "data-testid"?: string;
}

const DEMO_COMMENT_USER: CollaborationUser = {
  id: "demo-reviewer",
  name: "Lumen",
  email: "lumen@example.com",
  color: "#38bdf8",
  lastActive: Date.now(),
};

const DEMO_COMMENTS: CollaborationComment[] = [
  {
    id: "demo-comment-1",
    userId: "demo-reviewer",
    content: "Tighten this surface copy before launch.",
    position: { x: 188, y: 128 },
    timestamp: Date.now() - 90000,
    resolved: false,
    replies: [
      {
        id: "demo-reply-1",
        userId: "demo-reviewer",
        content: "Keeping the note visible for review.",
        position: { x: 188, y: 128 },
        timestamp: Date.now() - 45000,
      },
    ],
  },
];

const CommentBubble: React.FC<{
  comment: CollaborationComment;
  user: any;
  onReply: (commentId: string, content: string) => void;
  onResolve: (commentId: string) => void;
  isOwner: boolean;
  compact?: boolean;
}> = ({ comment, user, onReply, onResolve, isOwner, compact = false }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);

  // Apply dynamic positioning and colors without JSX style attribute
  useEffect(() => {
    const el = bubbleRef.current;
    if (!el) return;
    if (compact) {
      el.style.left = `${Math.min(Math.max(comment.position.x, 104), 210)}px`;
      el.style.top = "28px";
      el.style.transform = "translateX(-50%)";
      return;
    }
    el.style.left = `${comment.position.x}px`;
    el.style.top = `${comment.position.y}px`;
    el.style.transform = "translate(-50%, -100%)";
  }, [comment.position.x, comment.position.y, compact]);

  useEffect(() => {
    const ptr = pointerRef.current;
    if (!ptr) return;
    ptr.style.left = "50%";
    ptr.style.top = "100%";
    ptr.style.transform = "translateX(-50%)";
    ptr.style.filter =
      "drop-shadow(0 2px 4px color-mix(in srgb, var(--glass-black) 10%, transparent))";
  }, []);

  useEffect(() => {
    if (avatarRef.current) {
      avatarRef.current.style.backgroundColor =
        user?.color || "var(--glass-gray-500)";
    }
  }, [user?.color]);

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText.trim());
      setReplyText("");
      setIsReplying(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div
      data-glass-component
      ref={bubbleRef}
      className="glass-absolute glass-z-40 glass-container-xs"
      style={{
        opacity: comment.resolved ? 0.6 : 1,
        width: compact ? 180 : undefined,
        maxWidth: compact ? "calc(100% - 32px)" : undefined,
      }}
    >
      <div className="glass-relative">
        {/* Main comment */}
        <Glass
          className={cn(
            "glass-mb-2 glass-shadow-lg glass-border-l glass-contrast-guard",
            compact ? "glass-p-2" : "glass-p-3"
          )}
          style={{
            borderLeftWidth: 4,
            borderLeftColor: comment.resolved
              ? "rgba(148, 163, 184, 0.8)"
              : "var(--glass-color-primary)",
          }}
        >
          <div
            className={cn(
              "glass-flex glass-items-start glass-justify-between",
              compact ? "glass-mb-1" : "glass-mb-2"
            )}
          >
            <div className="glass-flex glass-items-center glass-gap-2">
              <div
                ref={avatarRef}
                className="glass-w-6 glass-h-6 glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-primary glass-text-xs glass-font-medium"
              >
                {user?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <span
                className={cn(
                  "glass-font-medium glass-text-secondary",
                  compact ? "glass-text-xs" : "glass-text-sm"
                )}
              >
                {user?.name || "Unknown User"}
              </span>
              {!compact && (
                <span className="glass-text-xs glass-text-secondary">
                  {formatTime(comment.timestamp)}
                </span>
              )}
            </div>
            <div className="glass-flex glass-gap-1">
              {!comment.resolved &&
                (isOwner || user?.id === comment.userId) && (
                  <button
                    onClick={() => onResolve(comment.id)}
                    className="glass-text-primary hover:glass-text-primary glass-text-xs glass-p-1 glass-focus glass-touch-target glass-contrast-guard"
                    title="Resolve comment"
                  >
                    ✓
                  </button>
                )}
              {comment.resolved && (
                <span className="glass-text-primary glass-text-xs">
                  Resolved
                </span>
              )}
            </div>
          </div>

          <p
            className={cn(
              "glass-text-secondary glass-mb-2",
              compact ? "glass-text-xs" : "glass-text-sm"
            )}
          >
            {comment.content}
          </p>

          <div className="glass-flex glass-items-center glass-gap-3 glass-text-xs">
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="glass-text-primary hover:glass-text-primary glass-focus glass-touch-target glass-contrast-guard"
            >
              Reply
            </button>

            {!compact && (comment.replies?.length || 0) > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="glass-text-secondary hover:glass-text-secondary glass-focus glass-touch-target glass-contrast-guard"
              >
                {showReplies ? "Hide" : "Show"} {comment.replies?.length}{" "}
                replies
              </button>
            )}
          </div>
        </Glass>

        {/* Reply input */}
        {isReplying && (
          <Glass className="glass-p-3 glass-mb-2 glass-surface-subtle glass-contrast-guard">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="glass-w-full glass-p-2 glass-text-sm glass-border glass-border-subtle glass-radius glass-focus glass-touch-target glass-contrast-guard"
              style={{ resize: "none" }}
              rows={2}
              autoFocus
            />
            <div className="glass-flex glass-justify-end glass-gap-2 glass-mt-2">
              <button
                onClick={() => setIsReplying(false)}
                className="glass-px-3 glass-py-1 glass-text-xs glass-text-secondary hover:glass-text-secondary glass-focus glass-touch-target glass-contrast-guard"
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                disabled={!replyText.trim()}
                className="glass-px-3 glass-py-1 glass-text-xs glass-surface-primary glass-text-primary glass-radius disabled:glass-opacity-50 glass-disabled-cursor-not-allowed glass-focus glass-touch-target glass-focus glass-touch-target glass-contrast-guard"
              >
                Reply
              </button>
            </div>
          </Glass>
        )}

        {/* Replies */}
        {!compact &&
          showReplies &&
          comment.replies &&
          comment.replies.length > 0 && (
            <div className="glass-ml-4 glass-space-y-2">
              {comment.replies.map((reply: any) => {
                const replyUser = user; // In real app, would look up by reply.userId
                return (
                  <Glass
                    key={reply.id}
                    className="glass-p-2 glass-surface-subtle glass-contrast-guard"
                  >
                    <div className="glass-flex glass-items-center glass-gap-2 glass-mb-1">
                      <div
                        ref={(el) => {
                          if (el)
                            el.style.backgroundColor =
                              replyUser?.color || "var(--glass-gray-500)";
                        }}
                        className="glass-w-4 glass-h-4 glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-primary glass-text-xs"
                      >
                        {replyUser?.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <span className="glass-text-xs glass-font-medium glass-text-secondary">
                        {replyUser?.name || "Unknown User"}
                      </span>
                      <span className="glass-text-xs glass-text-secondary">
                        {formatTime(reply.timestamp)}
                      </span>
                    </div>
                    <p className="glass-text-xs glass-text-secondary">
                      {reply.content}
                    </p>
                  </Glass>
                );
              })}
            </div>
          )}

        {/* Comment pointer */}
        <div
          ref={pointerRef}
          className="glass-absolute"
          style={{
            width: 0,
            height: 0,
            borderLeft: "4px solid transparent",
            borderRight: "4px solid transparent",
            borderTop: "4px solid rgba(255, 255, 255, 0.9)",
          }}
        />
      </div>
    </div>
  );
};

const CommentDot: React.FC<{
  position: { x: number; y: number };
  color: string;
  count?: number;
  onClick: () => void;
  resolved?: boolean;
}> = ({ position, color, count = 1, onClick, resolved }) => {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.left = `${position.x}px`;
    el.style.top = `${position.y}px`;
    el.style.transform = "translate(-50%, -50%)";
    el.style.backgroundColor = resolved ? "var(--glass-gray-500)" : color;
  }, [position.x, position.y, color, resolved]);
  return (
    <button
      ref={ref}
      className={cn(
        "glass-absolute glass-z-30 glass-w-6 glass-h-6 glass-radius-full glass-border glass-shadow-lg glass-transition glass-focus glass-touch-target glass-contrast-guard"
      )}
      style={{ opacity: resolved ? 0.6 : 1 }}
      onClick={onClick}
      aria-label={resolved ? "Resolved comment" : "Comment"}
    >
      <span className="glass-text-primary glass-text-xs glass-font-bold">
        {count}
      </span>
    </button>
  );
};

export const GlassCollaborativeComments: React.FC<
  CollaborativeCommentsProps
> = ({
  className,
  allowComments = true,
  compact = false,
  contained = false,
  maxHeight,
  "aria-label": ariaLabel,
  "data-testid": dataTestId,
}) => {
  const {
    comments,
    users,
    currentUser,
    addComment,
    resolveComment,
    replyToComment,
    showComments,
  } = useCollaboration();

  const [isAddingComment, setIsAddingComment] = useState(false);
  const [newCommentPosition, setNewCommentPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [selectedComment, setSelectedComment] = useState<string | null>(null);
  const isCompactMode = compact || contained;
  const boundedHeight = maxHeight ?? (isCompactMode ? 220 : undefined);

  const containerRef = useRef<HTMLDivElement>(null);
  const newBubbleRef = useRef<HTMLDivElement>(null);
  const newAvatarRef = useRef<HTMLDivElement>(null);
  const newPointerRef = useRef<HTMLDivElement>(null);
  const shouldUseDemoContent =
    comments.length === 0 && users.length === 0 && !currentUser;
  const resolvedComments = shouldUseDemoContent ? DEMO_COMMENTS : comments;
  const resolvedUsers = shouldUseDemoContent ? [DEMO_COMMENT_USER] : users;
  const resolvedCurrentUser = currentUser ?? resolvedUsers[0] ?? null;
  const visibleSelectedComment =
    selectedComment ??
    (shouldUseDemoContent ? (resolvedComments[0]?.id ?? null) : null);

  // Position and color for the new comment bubble (no JSX style attr)
  useEffect(() => {
    const el = newBubbleRef.current;
    if (!el || !newCommentPosition) return;
    el.style.left = `${newCommentPosition.x}px`;
    el.style.top = `${newCommentPosition.y}px`;
    el.style.transform = isCompactMode
      ? "translateX(-50%)"
      : "translate(-50%, -100%)";
  }, [newCommentPosition, isCompactMode]);

  useEffect(() => {
    if (newAvatarRef.current) {
      newAvatarRef.current.style.backgroundColor =
        resolvedCurrentUser?.color || "var(--glass-gray-500)";
    }
  }, [resolvedCurrentUser?.color]);

  useEffect(() => {
    if (newPointerRef.current) {
      const ptr = newPointerRef.current;
      ptr.style.left = "50%";
      ptr.style.top = "100%";
      ptr.style.transform = "translateX(-50%)";
      ptr.style.filter =
        "drop-shadow(0 2px 4px color-mix(in srgb, var(--glass-black) 10%, transparent))";
    }
  }, [isAddingComment, newCommentPosition]);

  useEffect(() => {
    if (!allowComments || !showComments) return;

    const handleDoubleClick = (e: MouseEvent) => {
      if (!resolvedCurrentUser) return;

      // Don't add comments on UI elements
      const target = e.target as HTMLElement;
      if (target.closest("button, input, textarea, select, a")) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      setNewCommentPosition(
        isCompactMode
          ? {
              x: Math.min(Math.max(position.x, 104), 210),
              y: 28,
            }
          : position
      );
      setIsAddingComment(true);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("dblclick", handleDoubleClick);
    }

    return () => {
      if (container) {
        container.removeEventListener("dblclick", handleDoubleClick);
      }
    };
  }, [allowComments, showComments, resolvedCurrentUser, isCompactMode]);

  const handleAddComment = () => {
    if (!newCommentText.trim() || !newCommentPosition || !resolvedCurrentUser)
      return;

    addComment({
      userId: resolvedCurrentUser.id,
      content: newCommentText.trim(),
      position: newCommentPosition,
    });

    setNewCommentText("");
    setIsAddingComment(false);
    setNewCommentPosition(null);
  };

  const handleReply = (commentId: string, content: string) => {
    if (!resolvedCurrentUser) return;

    replyToComment(commentId, {
      userId: resolvedCurrentUser.id,
      content,
    });
  };

  const handleResolve = (commentId: string) => {
    resolveComment(commentId);
  };

  // Group comments by position for clustering
  const groupedComments = React.useMemo(() => {
    const groups: { [key: string]: CollaborationComment[] } = {};

    resolvedComments.forEach((comment: any) => {
      const key = `${Math.floor(comment.position.x / 50)}-${Math.floor(comment.position.y / 50)}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(comment);
    });

    return Object.values(groups);
  }, [resolvedComments]);

  if (!showComments || !allowComments) {
    return null;
  }

  const clampPosition = (position: { x: number; y: number }) => {
    if (!isCompactMode) return position;
    return {
      x: Math.min(Math.max(position.x, 44), 260),
      y: Math.min(Math.max(position.y, 138), 168),
    };
  };

  const withClampedPosition = (comment: CollaborationComment) => ({
    ...comment,
    position: clampPosition(comment.position),
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        "glass-relative glass-w-full glass-h-full glass-min-h-48",
        isCompactMode && "glass-overflow-hidden",
        className
      )}
      style={{
        ...(boundedHeight !== undefined
          ? {
              maxHeight:
                typeof boundedHeight === "number"
                  ? `${boundedHeight}px`
                  : boundedHeight,
              minHeight: isCompactMode ? "180px" : undefined,
              overflow: "hidden",
            }
          : null),
      }}
      aria-label={ariaLabel}
      data-testid={dataTestId}
    >
      {/* Comment dots */}
      {groupedComments.map((group, index) => {
        const firstComment = group[0];
        const user =
          resolvedUsers.find((u) => u.id === firstComment.userId) ||
          resolvedCurrentUser;
        const hasUnresolved = group.some((c) => !c.resolved);

        return (
          <CommentDot
            key={`group-${index}`}
            position={clampPosition(firstComment.position)}
            color={user?.color || "var(--glass-gray-500)"}
            count={group.length}
            resolved={!hasUnresolved}
            onClick={() =>
              setSelectedComment(
                selectedComment === firstComment.id ? null : firstComment.id
              )
            }
          />
        );
      })}

      {/* Selected comment bubble */}
      {visibleSelectedComment && (
        <>
          {resolvedComments
            .filter((comment: any) =>
              groupedComments.find(
                (group) =>
                  group.some((c) => c.id === visibleSelectedComment) &&
                  group.includes(comment)
              )
            )
            .map((comment: any) => {
              const user =
                resolvedUsers.find((u) => u.id === comment.userId) ||
                resolvedCurrentUser;

              return (
                <CommentBubble
                  key={comment.id}
                  comment={withClampedPosition(comment)}
                  user={user}
                  onReply={handleReply}
                  onResolve={handleResolve}
                  isOwner={resolvedCurrentUser?.id === comment.userId}
                  compact={isCompactMode}
                />
              );
            })}
        </>
      )}

      {/* New comment input */}
      {isAddingComment && newCommentPosition && (
        <div
          ref={newBubbleRef}
          className="glass-absolute glass-z-40 glass-container-xs"
          style={{
            width: isCompactMode ? 180 : undefined,
            maxWidth: isCompactMode ? "calc(100% - 32px)" : undefined,
          }}
        >
          <Glass
            className={cn(
              "glass-shadow-lg glass-border-l glass-contrast-guard",
              isCompactMode ? "glass-p-2" : "glass-p-3"
            )}
            style={{
              borderLeftWidth: 4,
              borderLeftColor: "var(--glass-color-primary)",
            }}
          >
            <div className="glass-flex glass-items-center glass-gap-2 glass-mb-2">
              <div
                ref={newAvatarRef}
                className="glass-w-6 glass-h-6 glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-primary glass-text-xs glass-font-medium"
              >
                {resolvedCurrentUser?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <span className="glass-text-sm glass-font-medium glass-text-secondary">
                {resolvedCurrentUser?.name || "You"}
              </span>
            </div>

            <textarea
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="glass-w-full glass-p-2 glass-text-sm glass-border glass-border-subtle glass-radius glass-focus glass-touch-target glass-contrast-guard"
              style={{ resize: "none" }}
              rows={isCompactMode ? 2 : 3}
              autoFocus
            />

            <div className="glass-flex glass-justify-end glass-gap-2 glass-mt-2">
              <button
                onClick={() => {
                  setIsAddingComment(false);
                  setNewCommentPosition(null);
                  setNewCommentText("");
                }}
                className="glass-px-3 glass-py-1 glass-text-xs glass-text-secondary hover:glass-text-secondary glass-focus glass-touch-target glass-contrast-guard"
              >
                Cancel
              </button>
              <button
                onClick={handleAddComment}
                disabled={!newCommentText.trim()}
                className="glass-px-3 glass-py-1 glass-text-xs glass-surface-primary glass-text-primary glass-radius disabled:glass-opacity-50 glass-disabled-cursor-not-allowed glass-focus glass-touch-target glass-focus glass-touch-target glass-contrast-guard"
              >
                Comment
              </button>
            </div>
          </Glass>

          {/* Comment pointer */}
          <div
            ref={newPointerRef}
            className="glass-absolute"
            style={{
              width: 0,
              height: 0,
              borderLeft: "4px solid transparent",
              borderRight: "4px solid transparent",
              borderTop: "4px solid rgba(255, 255, 255, 0.9)",
            }}
          />
        </div>
      )}

      {/* Click outside to close */}
      {(selectedComment || isAddingComment) && (
        <div
          className="glass-fixed glass-inset-0 glass-z-20"
          onClick={() => {
            setSelectedComment(null);
            if (isAddingComment) {
              setIsAddingComment(false);
              setNewCommentPosition(null);
              setNewCommentText("");
            }
          }}
        />
      )}

      {/* Helper text */}
      {resolvedComments.length === 0 && resolvedCurrentUser && (
        <div className="glass-absolute glass-bottom-4 glass-right-4 glass-surface-subtle glass-text-primary glass-p-3 glass-radius-lg glass-text-sm glass-max-w-xs">
          💡 Double-click anywhere to add a comment
        </div>
      )}
    </div>
  );
};
