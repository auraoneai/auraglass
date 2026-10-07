"use client";
import React, { useEffect, useState } from "react";
import {
  useCollaboration,
  type CollaborationUser,
} from "./GlassCollaborationProvider";
import { cn } from "../../lib/utilsComprehensive";
import { ANIMATION } from "../../tokens/designConstants";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface CollaborativeCursorProps {
  className?: string;
  previewUsers?: CollaborationUser[];
  positionStrategy?: "fixed" | "absolute";
  "data-testid"?: string;
}

const CursorIcon: React.FC<{ color: string; name: string }> = ({
  color,
  name,
}) => (
  <div className="glass-relative">
    {/* Cursor pointer */}
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="glass-drop-glass-shadow-sm"
    >
      <path
        d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
        fill={color}
        stroke="white"
        strokeWidth="1"
      />
    </svg>

    {/* User name label */}
    <div
      className="glass-absolute glass-left-6 glass-top-1 glass-px-2 glass-py-1 glass-radius glass-text-primary glass-text-xs glass-font-medium glass-whitespace-nowrap glass-pointer-events-none glass-select-none"
      style={{ backgroundColor: color }}
    >
      {name}
    </div>
  </div>
);

export const GlassCollaborativeCursor: React.FC<CollaborativeCursorProps> = ({
  className,
  previewUsers,
  positionStrategy = "fixed",
  "data-testid": dataTestId,
}) => {
  const { users, currentUser, showCursors } = useCollaboration();
  const [visibleCursors, setVisibleCursors] = useState<typeof users>([]);

  useEffect(() => {
    if (!showCursors) {
      setVisibleCursors([]);
      return;
    }

    // Filter out current user and users without cursor data
    const sourceUsers = previewUsers ?? users;
    const otherUsers = sourceUsers.filter(
      (user: any) =>
        user.id !== currentUser?.id &&
        user.cursor &&
        Date.now() - user.lastActive < ANIMATION.DURATION.slower * 50 // Show cursor for 30 seconds after last activity
    );

    setVisibleCursors(otherUsers);
  }, [users, previewUsers, currentUser, showCursors]);

  if (!showCursors) {
    return null;
  }

  return (
    <div
      data-glass-component
      className={cn(
        positionStrategy === "absolute" ? "glass-absolute" : "glass-fixed",
        "glass-inset-0 glass-pointer-events-none glass-z-50",
        className
      )}
      data-testid={dataTestId}
    >
      {visibleCursors.length > 0 &&
        visibleCursors.map((user: any) => {
          if (!user.cursor) return null;

          return (
            <div
              key={user.id}
              className="glass-absolute"
              style={{
                left: user.cursor.x,
                top: user.cursor.y,
                transform: "translate(-2px, -2px)",
                transition: `all ${ANIMATION.DURATION.fast}ms ease-out`,
              }}
            >
              <CursorIcon color={user.color} name={user.name} />
            </div>
          );
        })}
    </div>
  );
};
