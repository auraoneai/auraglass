"use client";
import React, { useState, useRef, useEffect } from "react";
import { Glass } from "../../primitives";
import {
  useCollaboration,
  CollaborationComment,
} from "./GlassCollaborationProvider";
import { cn } from "../../lib/utilsComprehensive";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface CollaborativeCommentsProps {
  className?: string;
  allowComments?: boolean;
  "aria-label"?: string;
  "data-testid"?: string;
}

const CommentBubble: React.FC<{
  comment: CollaborationComment;
  user: any;
  onReply: (commentId: string, content: string) => void;
  onResolve: (commentId: string) => void;
  isOwner: boolean;
}> = ({ comment, user, onReply, onResolve, isOwner }) => {
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
    el.style.left = `${comment.position.x}px`;
    el.style.top = `${comment.position.y}px`;
    el.style.transform = "translate(-50%, -100%)";
  }, [comment.position.x, comment.position.y]);

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
      className={cn(
        "glass-absolute glass-z-40 glass-container-xs",
        comment.resolved && "opacity-60"
      )}
    >
      <div className="glass-relative">
        {/* Main comment */}
        <Glass
          className={cn(
            "p-3 mb-2 shadow-lg border-l-4 glass-contrast-guard",
            comment.resolved
              ? "border-gray-400"
              : "border-[var(--glass-color-primary)]"
          )}
        >
          <div className="glass-flex glass-items-start glass-justify-between glass-mb-2">
            <div className="glass-flex glass-items-center glass-gap-2">
              <div
                ref={avatarRef}
                className="glass-w-6 glass-h-6 glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-primary glass-text-xs glass-font-medium"
              >
                {user?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <span className="glass-text-sm glass-font-medium glass-text-secondary">
                {user?.name || "Unknown User"}
              </span>
              <span className="glass-text-xs glass-text-secondary">
                {formatTime(comment.timestamp)}
              </span>
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

          <p className="glass-text-sm glass-text-secondary glass-mb-2">
            {comment.content}
          </p>

          <div className="glass-flex glass-items-center glass-gap-3 glass-text-xs">
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="glass-text-primary hover:glass-text-primary glass-focus glass-touch-target glass-contrast-guard"
            >
              Reply
            </button>

            {(comment.replies?.length || 0) > 0 && (
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
              className="glass-w-full glass-p-2 glass-text-sm glass-border glass-border-subtle glass-radius glass-resize-none glass-focus-ring-2 glass-focus-ring-blue-500 focus:glass-border-blue"
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
                className="glass-px-3 glass-py-1 glass-text-xs glass-surface-blue glass-text-primary glass-radius hover:glass-surface-blue disabled:glass-opacity-50 glass-disabled-cursor-not-allowed glass-focus glass-touch-target glass-focus glass-touch-target glass-contrast-guard"
              >
                Reply
              </button>
            </div>
          </Glass>
        )}

        {/* Replies */}
        {showReplies && comment.replies && comment.replies.length > 0 && (
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
          className="glass-absolute glass-w-0 glass-h-0 glass-border-l-4 glass-border-r-4 glass-border-t-4 glass-border-transparent glass-border-t-white"
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
        "glass-absolute glass-z-30 glass-w-6 glass-h-6 glass-radius-full glass-border glass-shadow-lg glass-transition glass-focus glass-touch-target glass-contrast-guard",
        resolved ? "opacity-60" : "animate-pulse"
      )}
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

  const containerRef = useRef<HTMLDivElement>(null);
  const newBubbleRef = useRef<HTMLDivElement>(null);
  const newAvatarRef = useRef<HTMLDivElement>(null);
  const newPointerRef = useRef<HTMLDivElement>(null);

  // Position and color for the new comment bubble (no JSX style attr)
  useEffect(() => {
    const el = newBubbleRef.current;
    if (!el || !newCommentPosition) return;
    el.style.left = `${newCommentPosition.x}px`;
    el.style.top = `${newCommentPosition.y}px`;
    el.style.transform = "translate(-50%, -100%)";
  }, [newCommentPosition]);

  useEffect(() => {
    if (newAvatarRef.current) {
      newAvatarRef.current.style.backgroundColor =
        currentUser?.color || "var(--glass-gray-500)";
    }
  }, [currentUser?.color]);

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
      if (!currentUser) return;

      // Don't add comments on UI elements
      const target = e.target as HTMLElement;
      if (target.closest("button, input, textarea, select, a")) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      setNewCommentPosition(position);
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
  }, [allowComments, showComments, currentUser]);

  const handleAddComment = () => {
    if (!newCommentText.trim() || !newCommentPosition || !currentUser) return;

    addComment({
      userId: currentUser.id,
      content: newCommentText.trim(),
      position: newCommentPosition,
    });

    setNewCommentText("");
    setIsAddingComment(false);
    setNewCommentPosition(null);
  };

  const handleReply = (commentId: string, content: string) => {
    if (!currentUser) return;

    replyToComment(commentId, {
      userId: currentUser.id,
      content,
    });
  };

  const handleResolve = (commentId: string) => {
    resolveComment(commentId);
  };

  // Group comments by position for clustering
  const groupedComments = React.useMemo(() => {
    const groups: { [key: string]: CollaborationComment[] } = {};

    comments.forEach((comment: any) => {
      const key = `${Math.floor(comment.position.x / 50)}-${Math.floor(comment.position.y / 50)}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(comment);
    });

    return Object.values(groups);
  }, [comments]);

  if (!showComments || !allowComments) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full", className)}
      aria-label={ariaLabel}
      data-testid={dataTestId}
    >
      {/* Comment dots */}
      {groupedComments.map((group, index) => {
        const firstComment = group[0];
        const user =
          users.find((u) => u.id === firstComment.userId) || currentUser;
        const hasUnresolved = group.some((c) => !c.resolved);

        return (
          <CommentDot
            key={`group-${index}`}
            position={firstComment.position}
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
      {selectedComment && (
        <>
          {comments
            .filter((comment: any) =>
              groupedComments.find(
                (group) =>
                  group.some((c) => c.id === selectedComment) &&
                  group.includes(comment)
              )
            )
            .map((comment: any) => {
              const user =
                users.find((u) => u.id === comment.userId) || currentUser;

              return (
                <CommentBubble
                  key={comment.id}
                  comment={comment}
                  user={user}
                  onReply={handleReply}
                  onResolve={handleResolve}
                  isOwner={currentUser?.id === comment.userId}
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
        >
          <Glass className="glass-p-3 glass-shadow-lg glass-border-l-4 glass-border-blue glass-contrast-guard">
            <div className="glass-flex glass-items-center glass-gap-2 glass-mb-2">
              <div
                ref={newAvatarRef}
                className="glass-w-6 glass-h-6 glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-primary glass-text-xs glass-font-medium"
              >
                {currentUser?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <span className="glass-text-sm glass-font-medium glass-text-secondary">
                {currentUser?.name || "You"}
              </span>
            </div>

            <textarea
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="glass-w-full glass-p-2 glass-text-sm glass-border glass-border-subtle glass-radius glass-resize-none glass-focus-ring-2 glass-focus-ring-blue-500 focus:glass-border-blue"
              rows={3}
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
                className="glass-px-3 glass-py-1 glass-text-xs glass-surface-blue glass-text-primary glass-radius hover:glass-surface-blue disabled:glass-opacity-50 glass-disabled-cursor-not-allowed glass-focus glass-touch-target glass-focus glass-touch-target glass-contrast-guard"
              >
                Comment
              </button>
            </div>
          </Glass>

          {/* Comment pointer */}
          <div
            ref={newPointerRef}
            className="glass-absolute glass-w-0 glass-h-0 glass-border-l-4 glass-border-r-4 glass-border-t-4 glass-border-transparent glass-border-t-white"
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
      {comments.length === 0 && currentUser && (
        <div className="glass-absolute glass-bottom-4 glass-right-4 glass-surface-subtle glass-text-primary glass-p-3 glass-radius-lg glass-text-sm glass-max-w-xs">
          💡 Double-click anywhere to add a comment
        </div>
      )}
    </div>
  );
};
