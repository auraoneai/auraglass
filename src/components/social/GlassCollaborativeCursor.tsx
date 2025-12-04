"use client";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import React, {
  forwardRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OptimizedGlass } from "../../primitives";
import { cn } from "@/lib/utils";
import { createGlassStyle } from "../../utils/createGlassStyle";
import { useGlassSound } from "../../utils/soundDesign";
import { useA11yId } from "../../utils/a11y";

export interface CursorUser {
  id: string;
  name: string;
  color: string;
  avatar?: string;
  x: number;
  y: number;
  lastActivity: number;
  isActive: boolean;
  selection?: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  };
  action?: "typing" | "selecting" | "drawing" | "idle";
}

export interface GlassCollaborativeCursorProps {
  users?: CursorUser[];
  currentUserId?: string;
  showCursorTails?: boolean;
  showUserLabels?: boolean;
  showAvatars?: boolean;
  cursorSize?: "small" | "medium" | "large";
  fadeTimeout?: number;
  maxTrailLength?: number;
  realTimeMode?: boolean;
  soundEnabled?: boolean;
  showSelections?: boolean;
  showActions?: boolean;
  onCursorMove?: (userId: string, x: number, y: number) => void;
  onUserAction?: (userId: string, action: string) => void;
  className?: string;
}

const cursorColors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FECA57",
  "#FF9FF3",
  "#54A0FF",
  "#5F27CD",
  "#00D2D3",
  "#FF9F43",
  "#EE5A6F",
  "#0FB9B1",
  "#3867D6",
  "#1DD1A1",
  "#FD79A8",
];

export const GlassCollaborativeCursor = forwardRef<
  HTMLDivElement,
  GlassCollaborativeCursorProps
>(
  (
    {
      users = [],
      currentUserId,
      showCursorTails = true,
      showUserLabels = true,
      showAvatars = false,
      cursorSize = "medium",
      fadeTimeout = 3000,
      maxTrailLength = 10,
      realTimeMode = false,
      soundEnabled = true,
      showSelections = true,
      showActions = true,
      onCursorMove,
      onUserAction,
      className="",
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const [cursorTrails, setCursorTrails] = useState<
      Record<string, Array<{ x: number; y: number; timestamp: number }>>
    >({});
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [simulatedUsers, setSimulatedUsers] = useState(users);
    const { play } = useGlassSound();
    const id = useA11yId("glass-collaborative-cursor");

    // Simulated cursor movement for demo
    useEffect(() => {
      if (!realTimeMode) return;

      const interval = setInterval(() => {
        setSimulatedUsers((prev: any) =>
          prev.map((user: any) => {
            if (user.id === currentUserId) return user;

            const deltaX = (Math.random() - 0.5) * 20;
            const deltaY = (Math.random() - 0.5) * 20;
            const newX = Math.max(
              0,
              Math.min(containerSize.width, user.x + deltaX)
            );
            const newY = Math.max(
              0,
              Math.min(containerSize.height, user.y + deltaY)
            );

            const newUser = {
              ...user,
              x: newX,
              y: newY,
              lastActivity: Date.now(),
              isActive: Math.random() > 0.3,
              action: ["typing", "selecting", "drawing", "idle"][
                Math.floor(Math.random() * 4)
              ] as any,
            };

            onCursorMove?.(user.id, newX, newY);
            return newUser;
          })
        );
      }, 100);

      return () => clearInterval(interval);
    }, [realTimeMode, currentUserId, containerSize, onCursorMove]);

    // Update cursor trails
    useEffect(() => {
      if (!simulatedUsers || simulatedUsers.length === 0) return;
      simulatedUsers.forEach((user: any) => {
        if (!user.isActive || user.id === currentUserId) return;

        setCursorTrails((prev: any) => {
          const userTrails = prev[user.id] || [];
          const newTrail = { x: user.x, y: user.y, timestamp: Date.now() };

          const updatedTrails = [...userTrails, newTrail]
            .filter((trail: any) => Date.now() - trail.timestamp < fadeTimeout)
            .slice(-maxTrailLength);

          return {
            ...prev,
            [user.id]: updatedTrails,
          };
        });
      });
    }, [simulatedUsers, currentUserId, fadeTimeout, maxTrailLength]);

    // Container resize observer
    useEffect(() => {
      const container = document.getElementById(id);
      if (!container) return;

      const resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          setContainerSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      });

      resizeObserver.observe(container);
      return () => resizeObserver.disconnect();
    }, [id]);

    // Sound effects
    useEffect(() => {
      if (soundEnabled && simulatedUsers && simulatedUsers.length > 0) {
        simulatedUsers.forEach((user: any) => {
          if (user.action === "typing") {
            play("type");
          } else if (user.action === "selecting") {
            play("select");
          }
        });
      }
    }, [simulatedUsers, soundEnabled, play]);

    const getCursorSize = () => {
      switch (cursorSize) {
        case "small":
          return 16;
        case "large":
          return 28;
        default:
          return 20;
      }
    };

    const getUserColor = (userId: string) => {
      if (!simulatedUsers || simulatedUsers.length === 0) {
        const index = parseInt(userId, 36) % cursorColors.length;
        return cursorColors[index];
      }
      const user = simulatedUsers.find((u) => u.id === userId);
      if (user?.color) return user.color;

      const index = parseInt(userId, 36) % cursorColors.length;
      return cursorColors[index];
    };

    const CursorIcon = ({ user, size }: { user: CursorUser; size: number }) => (
      <motion.div
        className={cn("glass-absolute glass-pointer-events-none glass-z-50")}
        style={{
          left: user.x,
          top: user.y,
          transform: "translate(-2px, -2px)",
        }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: 0,
                y: 0,
                scale: user.isActive ? 1 : 0.8,
                opacity: user.isActive ? 1 : 0.6,
              }
        }
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          style={{
            filter: `drop-shadow(0 2px 4px rgba(var(--glass-color-black) / var(--glass-opacity-30)))`,
          }}
        >
          <path
            d="M5 3L19 12L12 14L9 21L5 3Z"
            fill={getUserColor(user.id)}
            stroke="white"
            strokeWidth="1"
          />
        </svg>
      </motion.div>
    );

    const CursorLabel = ({ user }: { user: CursorUser }) => (
      <motion.div
        className={cn("glass-absolute glass-pointer-events-none glass-z-40")}
        style={{
          left: user.x + 15,
          top: user.y - 5,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                opacity: user.isActive ? 1 : 0.7,
                scale: user.isActive ? 1 : 0.9,
              }
        }
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
      >
        <div
          className={cn(
            "glass-px-2 glass-py-1 glass-radius-md glass-text-xs glass-font-medium glass-text-primary glass-border glass-border-white/20"
          )}
          style={createGlassStyle({ opacity: 0.8, blur: "sm" })}
        >
          <div className={cn("glass-flex glass-items-center glass-space-x-1")}>
            {showAvatars && user.avatar && (
              <img
                src={user.avatar}
                alt={user.name}
                className={cn("glass-w-4 glass-h-4 glass-radius-full")}
              />
            )}
            <span>{user.name}</span>
            {showActions && user.action !== "idle" && (
              <span className={cn("glass-text-xs glass-opacity-75")}>
                {user.action === "typing" && "✏️"}
                {user.action === "selecting" && "🔍"}
                {user.action === "drawing" && "✨"}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );

    const CursorTrail = ({ userId }: { userId: string }) => {
      const trails = cursorTrails[userId] || [];
      const color = getUserColor(userId);

      return (
        <g>
          {trails.map((trail, index) => {
            const age = Date.now() - trail.timestamp;
            const opacity = Math.max(0, 1 - age / fadeTimeout);
            const size = (index / trails.length) * 4 + 2;

            return (
              <circle
                key={`${userId}-${trail.timestamp}`}
                cx={trail.x}
                cy={trail.y}
                r={size}
                fill={color}
                opacity={opacity * 0.6}
              />
            );
          })}
        </g>
      );
    };

    const SelectionOverlay = ({ user }: { user: CursorUser }) => {
      if (!user.selection || !showSelections) return null;

      const { startX, startY, endX, endY } = user.selection;
      const width = Math.abs(endX - startX);
      const height = Math.abs(endY - startY);
      const x = Math.min(startX, endX);
      const y = Math.min(startY, endY);

      return (
        <motion.div
          className={cn(
            "glass-absolute glass-pointer-events-none glass-border-2 glass-border-dashed"
          )}
          style={{
            left: x,
            top: y,
            width,
            height,
            borderColor: getUserColor(user.id),
            backgroundColor: `${getUserColor(user.id)}20`,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={prefersReducedMotion ? {} : { opacity: 0.5, scale: 1 }}
          transition={
            prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }
          }
        />
      );
    };

    const activeCursors = useMemo(
      () =>
        (simulatedUsers || []).filter(
          (user: any) =>
            user.id !== currentUserId &&
            user.isActive &&
            Date.now() - user.lastActivity < fadeTimeout
        ),
      [simulatedUsers, currentUserId, fadeTimeout]
    );

    return (
      <OptimizedGlass
        ref={ref}
        id={id}
        intensity="subtle"
        className={cn(
          "glass-relative glass-overflow-hidden glass-min-h-96",
          className
        )}
        {...props}
      >
        <div className={cn("glass-absolute glass-inset-0")}>
          {/* Cursor trails */}
          {showCursorTails && (
            <svg
              className={cn(
                "glass-absolute glass-inset-0 glass-pointer-events-none"
              )}
              style={{ zIndex: 10 }}
            >
              {activeCursors.map((user: any) => (
                <CursorTrail key={user.id} userId={user.id} />
              ))}
            </svg>
          )}

          {/* Selection overlays */}
          <AnimatePresence>
            {activeCursors.map((user: any) => (
              <SelectionOverlay key={`selection-${user.id}`} user={user} />
            ))}
          </AnimatePresence>

          {/* Cursor icons */}
          <AnimatePresence>
            {activeCursors.map((user: any) => (
              <CursorIcon
                key={`cursor-${user.id}`}
                user={user}
                size={getCursorSize()}
              />
            ))}
          </AnimatePresence>

          {/* User labels */}
          {showUserLabels && (
            <AnimatePresence>
              {activeCursors.map((user: any) => (
                <CursorLabel key={`label-${user.id}`} user={user} />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Demo content */}
        <div
          className={cn(
            "glass-relative glass-z-0 glass-p-8 glass-space-y-4 glass-text-secondary"
          )}
        >
          <h2 className={cn("glass-text-2xl glass-font-bold")}>
            Collaborative Workspace
          </h2>
          <p>
            This is a collaborative document where multiple users can work
            together.
          </p>
          <div className={cn("glass-grid glass-grid-cols-2 glass-gap-4")}>
            <div
              className={cn(
                "glass-p-4 glass-surface-secondary glass-radius-lg"
              )}
            >
              <h3 className={cn("glass-font-semibold glass-mb-2")}>
                Section A
              </h3>
              <p>Content that users can interact with...</p>
            </div>
            <div
              className={cn(
                "glass-p-4 glass-surface-secondary glass-radius-lg"
              )}
            >
              <h3 className={cn("glass-font-semibold glass-mb-2")}>
                Section B
              </h3>
              <p>More interactive content here...</p>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div
          className={cn(
            "glass-absolute glass-bottom-0 glass-left-0 glass-right-0 glass-p-3 glass-surface-overlay glass-blur-backdrop glass-border-t glass-border-white/10"
          )}
        >
          <div
            className={cn(
              "glass-flex glass-items-center glass-justify-between glass-text-xs glass-text-muted"
            )}
          >
            <div
              className={cn("glass-flex glass-items-center glass-space-x-4")}
            >
              <span>{activeCursors.length} active users</span>
              {realTimeMode && (
                <span
                  className={cn(
                    "glass-flex glass-items-center glass-space-x-1"
                  )}
                >
                  <div
                    className={cn(
                      "glass-w-2 glass-h-2 glass-surface-success glass-radius-full glass-animate-pulse"
                    )}
                  />
                  <span>Real-time</span>
                </span>
              )}
            </div>
            <div
              className={cn("glass-flex glass-items-center glass-space-x-2")}
            >
              {activeCursors.slice(0, 5).map((user: any) => (
                <div
                  key={user.id}
                  className={cn(
                    "glass-w-3 glass-h-3 glass-radius-full glass-border glass-border-white/30"
                  )}
                  style={{ backgroundColor: getUserColor(user.id) }}
                  title={user.name}
                />
              ))}
              {activeCursors.length > 5 && (
                <span className={cn("glass-text-xs")}>
                  +{activeCursors.length - 5}
                </span>
              )}
            </div>
          </div>
        </div>
      </OptimizedGlass>
    );
  }
);
