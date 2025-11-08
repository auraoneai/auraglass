'use client';
import { useReducedMotion } from "@/hooks/useReducedMotion";
import React, { forwardRef, useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { OptimizedGlass } from "../../primitives";
import { useGlassSound } from "../../utils/soundDesign";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import { createGlassStyle } from "../../utils/createGlassStyle";

export interface GlassPresenceIndicatorProps {
  users: Array<{
    id: string;
    name: string;
    avatar?: string;
    status: "online" | "away" | "busy" | "offline";
    lastSeen?: Date;
    activity?: string;
    location?: string;
    timezone?: string;
    isTyping?: boolean;
    customStatus?: {
      emoji?: string;
      text?: string;
    };
  }>;
  maxVisible?: number;
  showAvatars?: boolean;
  showNames?: boolean;
  showStatus?: boolean;
  showActivity?: boolean;
  showLastSeen?: boolean;
  showTypingIndicator?: boolean;
  layout?: "horizontal" | "vertical" | "grid" | "stack";
  size?: "small" | "medium" | "large";
  groupSimilarStatus?: boolean;
  realTimeSync?: boolean;
  soundEnabled?: boolean;
  animateChanges?: boolean;
  theme?: "light" | "dark" | "auto";
  onUserClick?: (userId: string) => void;
  onStatusChange?: (userId: string, status: string) => void;
  className?: string;
}

const statusColors = {
  online: "var(--glass-color-success)",
  away: "var(--glass-color-warning)",
  busy: "var(--glass-color-danger)",
  offline: "var(--glass-gray-500)",
};

const statusLabels = {
  online: "Online",
  away: "Away",
  busy: "Busy",
  offline: "Offline",
};

export const GlassPresenceIndicator = forwardRef<
  HTMLDivElement,
  GlassPresenceIndicatorProps
>(
  (
    {
      users,
      maxVisible = 5,
      showAvatars = true,
      showNames = true,
      showStatus = true,
      showActivity = false,
      showLastSeen = true,
      showTypingIndicator = true,
      layout = "horizontal",
      size = "medium",
      groupSimilarStatus = false,
      realTimeSync = false,
      soundEnabled = true,
      animateChanges = true,
      theme = "auto",
      onUserClick,
      onStatusChange,
      className = "",
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const [presenceData, setPresenceData] = useState(users);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const { play } = useGlassSound();
    const id = useA11yId("glass-presence");
    const { shouldAnimate } = useMotionPreference();

    // Helper function to respect motion preferences
    const respectMotionPreference = (config: any) =>
      shouldAnimate ? config : { duration: 0 };

    // Simulated real-time updates
    useEffect(() => {
      if (!realTimeSync) return;

      const interval = setInterval(() => {
        setPresenceData((prev: any) =>
          prev.map((user: any) => ({
            ...user,
            lastSeen: user.status !== "offline" ? new Date() : user.lastSeen,
            isTyping: Math.random() < 0.1 ? !user.isTyping : user.isTyping,
          }))
        );
      }, 5000);

      return () => clearInterval(interval);
    }, [realTimeSync]);

    // Track typing users
    useEffect(() => {
      const typing = presenceData
        .filter((user: any) => user.isTyping)
        .map((user: any) => user.id);
      setTypingUsers(typing);
    }, [presenceData]);

    // Sound notifications for status changes
    useEffect(() => {
      if (soundEnabled) {
        presenceData.forEach((user: any) => {
          if (user.status === "online") {
            play("notification");
          }
        });
      }
    }, [presenceData, soundEnabled, play]);

    const processedUsers = useMemo(() => {
      let processedData = [...presenceData];

      // Group similar statuses if enabled
      if (groupSimilarStatus) {
        processedData.sort((a, b) => {
          const statusOrder = { online: 0, away: 1, busy: 2, offline: 3 };
          return statusOrder[a.status] - statusOrder[b.status];
        });
      }

      // Limit visible users
      const visibleUsers = processedData.slice(0, maxVisible);
      const hiddenCount = Math.max(0, processedData.length - maxVisible);

      return {
        visibleUsers,
        hiddenCount,
        totalOnline: processedData.filter((u: any) => u.status === "online")
          .length,
      };
    }, [presenceData, maxVisible, groupSimilarStatus]);

    const formatLastSeen = (lastSeen?: Date) => {
      if (!lastSeen) return "Never";
      const now = new Date();
      const diff = now.getTime() - lastSeen.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return "Just now";
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      return `${days}d ago`;
    };

    const getSizeClasses = () => {
      switch (size) {
        case "small":
          return "text-xs";
        case "large":
          return "text-lg";
        default:
          return "text-sm";
      }
    };

    const getLayoutClasses = () => {
      switch (layout) {
        case "vertical":
          return "flex flex-col space-y-2";
        case "grid":
          return "grid grid-cols-2 gap-2";
        case "stack":
          return "flex flex-col space-y-1";
        default:
          return "flex flex-wrap gap-2";
      }
    };

    const UserPresence = ({
      user,
      index,
    }: {
      user: (typeof users)[0];
      index: number;
    }) => (
      <motion.div
        key={user.id}
        layout={animateChanges}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={respectMotionPreference({
          duration: 0.3,
          delay: index * 0.05,
        })}
        className={`
          flex items-center space-x-2 p-2 rounded-lg cursor-pointer
          ${createGlassStyle({ variant: "default" })}
          hover:bg-white/10 transition-colors duration-200
        `}
        onClick={() => onUserClick?.(user.id)}
      >
        {showAvatars && (
          <div className="relative">
            <div
              className={`
              ${size === "small" ? "w-6 h-6" : size === "large" ? "w-12 h-12" : "w-8 h-8"}
              rounded-full bg-gradient-to-br from-gray-300 to-gray-500 
              flex items-center justify-center text-white font-semibold
              ${createGlassStyle({ variant: "default" })}
            `}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="glass-w-full glass-h-full glass-radius-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>

            {showStatus && (
              <motion.div
                className={`
                  absolute -bottom-0.5 -right-0.5 
                  ${size === "small" ? "w-3 h-3" : size === "large" ? "w-4 h-4" : "w-3 h-3"}
                  rounded-full border-2 border-white
                `}
                style={{ backgroundColor: statusColors[user.status] }}
                animate={user.status === "online" ? { scale: [1, 1.2, 1] } : {}}
                transition={respectMotionPreference({
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                })}
              />
            )}
          </div>
        )}

        <div className="glass-flex-1 glass-min-w-0">
          {showNames && (
            <div className="glass-flex glass-items-center space-x-1">
              <p
                className={`font-medium text-white/90 truncate ${getSizeClasses()}`}
              >
                {user.name}
              </p>
              {user.customStatus?.emoji && (
                <span className="glass-text-xs">{user.customStatus.emoji}</span>
              )}
            </div>
          )}

          {showActivity && user.activity && (
            <p
              className={`text-white/60 truncate ${size === "large" ? "text-sm" : "text-xs"}`}
            >
              {user.activity}
            </p>
          )}

          {user.customStatus?.text && (
            <p
              className={`text-white/60 truncate ${size === "large" ? "text-sm" : "text-xs"}`}
            >
              {user.customStatus.text}
            </p>
          )}

          {showLastSeen && user.status === "offline" && (
            <p
              className={`text-white/40 ${size === "large" ? "text-sm" : "text-xs"}`}
            >
              {formatLastSeen(user.lastSeen)}
            </p>
          )}
        </div>

        {showTypingIndicator && user.isTyping && (
          <motion.div
            className="glass-flex space-x-1"
            animate={prefersReducedMotion ? {} : { opacity: [0.4, 1, 0.4] }}
            transition={respectMotionPreference({
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            })}
          >
            {[0, 1, 2].map((i: any) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 glass-surface-blue glass-radius-full"
                animate={prefersReducedMotion ? {} : { y: [-2, 0, -2] }}
                transition={respectMotionPreference({
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut",
                })}
              />
            ))}
          </motion.div>
        )}

        {showStatus && !showAvatars && (
          <div
            className="w-3 h-3 glass-radius-full"
            style={{ backgroundColor: statusColors[user.status] }}
          />
        )}
      </motion.div>
    );

    return (
      <OptimizedGlass
        ref={ref}
        intensity="subtle"
        className={`p-4 ${className}`}
        {...props}
      >
        <div className={getLayoutClasses()}>
          {processedUsers.visibleUsers.map((user, index) => (
            <UserPresence key={user.id} user={user} index={index} />
          ))}

          {processedUsers.hiddenCount > 0 && (
            <motion.div
              className={`
                flex items-center space-x-2 p-2 rounded-lg text-white/60
                ${createGlassStyle({ variant: "default" })}
              `}
              initial={{ opacity: 0 }}
              animate={prefersReducedMotion ? {} : { opacity: 1 }}
              transition={respectMotionPreference({ delay: 0.3 })}
            >
              <div
                className={`
                ${size === "small" ? "w-6 h-6" : size === "large" ? "w-12 h-12" : "w-8 h-8"}
                rounded-full bg-white/20 flex items-center justify-center
                ${getSizeClasses()} font-medium
              `}
              >
                +{processedUsers.hiddenCount}
              </div>
              <span className={getSizeClasses()}>
                {processedUsers.hiddenCount} more{" "}
                {processedUsers.hiddenCount === 1 ? "user" : "users"}
              </span>
            </motion.div>
          )}
        </div>

        {showTypingIndicator && typingUsers.length > 0 && (
          <motion.div
            className="mt-3 pt-3 glass-border-t glass-border-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <p className="glass-text-xs text-primary/60">
              {typingUsers.length === 1
                ? `${presenceData.find((u) => u.id === typingUsers[0])?.name} is typing...`
                : typingUsers.length === 2
                  ? `${presenceData.find((u) => u.id === typingUsers[0])?.name} and ${presenceData.find((u) => u.id === typingUsers[1])?.name} are typing...`
                  : `${typingUsers.length} people are typing...`}
            </p>
          </motion.div>
        )}

        <motion.div
          className="mt-3 pt-3 glass-border-t glass-border-white/10 glass-flex glass-justify-between glass-items-center glass-text-xs text-primary/50"
          initial={{ opacity: 0 }}
          animate={prefersReducedMotion ? {} : { opacity: 1 }}
          transition={respectMotionPreference({ delay: 0.5 })}
        >
          <span>{processedUsers.totalOnline} online</span>
          <span>{users.length} total</span>
        </motion.div>
      </OptimizedGlass>
    );
  }
);