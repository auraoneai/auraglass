"use client";
import { cn } from "../../lib/utilsComprehensive";
import React, { forwardRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { OptimizedGlass } from "../../primitives";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";

export interface GlassTypingIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the indicator is shown
   * @default true
   */
  isTyping?: boolean;
  /**
   * User or users who are typing
   */
  users?: string | string[];
  /**
   * Show user names
   * @default true
   */
  showUsers?: boolean;
  /**
   * Typing text template
   * @default '{users} {isAre} typing...'
   */
  text?: string;
  /**
   * Size of the indicator
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";
  /**
   * Glassmorphism elevation level
   * @default 'level1'
   */
  elevation?: "level1" | "level2" | "level3" | "level4" | "level5";
  /**
   * Dot variant style
   * @default 'bounce'
   */
  variant?: "bounce" | "pulse" | "wave" | "fade";
  /**
   * Dot color
   * @default 'primary'
   */
  dotColor?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "neutral";
  /**
   * Number of dots
   * @default 3
   */
  dotCount?: number;
  /**
   * Enable glassmorphism container
   * @default true
   */
  glass?: boolean;
}

export const GlassTypingIndicator = forwardRef<
  HTMLDivElement,
  GlassTypingIndicatorProps
>(
  (
    {
      isTyping = true,
      users,
      showUsers = true,
      text,
      size = "md",
      elevation = "level1",
      variant = "bounce",
      dotColor = "primary",
      dotCount = 3,
      glass = true,
      className,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    if (!isTyping) return null;

    const userList = Array.isArray(users) ? users : users ? [users] : [];
    const hasUsers = userList.length > 0;

    const getUserText = () => {
      if (!hasUsers || !showUsers) return null;

      if (userList.length === 1) {
        return `${userList[0]} is`;
      } else if (userList.length === 2) {
        return `${userList[0]} and ${userList[1]} are`;
      } else if (userList.length > 2) {
        return `${userList[0]}, ${userList[1]} and ${userList.length - 2} other${userList.length - 2 > 1 ? "s" : ""} are`;
      }
      return null;
    };

    const displayText = text
      ? text
          .replace("{users}", userList.join(", "))
          .replace("{isAre}", userList.length === 1 ? "is" : "are")
      : null;

    const sizeClasses = {
      sm: {
        dot: "w-1.5 h-1.5",
        text: "glass-text-xs",
        gap: "gap-1",
        padding: "glass-px-2 glass-py-1",
      },
      md: {
        dot: "w-2 h-2",
        text: "glass-text-sm",
        gap: "gap-1.5",
        padding: "glass-px-3 glass-py-2",
      },
      lg: {
        dot: "w-2.5 h-2.5",
        text: "glass-text-base",
        gap: "gap-2",
        padding: "glass-px-4 glass-py-3",
      },
    };

    const dotColorClasses = {
      primary: "bg-blue-500",
      secondary: "bg-purple-500",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      danger: "bg-red-500",
      neutral: "glass-surface-subtle",
    };

    const animations = {
      bounce: `animate-bounce`,
      pulse: `animate-pulse`,
      wave: ``,
      fade: `animate-pulse`,
    };

    const getAnimationStyle = (index: number) => {
      const delay = index * 150;

      const styles: React.CSSProperties = {
        animationDelay: `${delay}ms`,
      };

      if (variant === "wave") {
        styles.animation = `wave 1.4s ease-in-out infinite`;
        styles.animationDelay = `${delay}ms`;
      }

      return styles;
    };

    const dots = Array.from({ length: dotCount }, (_, index) => (
      <div
        key={index}
        className={cn(
          sizeClasses[size].dot,
          dotColorClasses[dotColor],
          "rounded-full",
          variant !== "wave" && animations[variant]
        )}
        style={getAnimationStyle(index)}
        aria-hidden="true"
      />
    ));

    const content = (
      <div
        className={cn(
          "inline-flex items-center",
          sizeClasses[size].gap,
          !glass && sizeClasses[size].padding
        )}
      >
        {showUsers && hasUsers && (
          <span
            className={cn(
              sizeClasses[size].text,
              "glass-text-secondary font-medium"
            )}
          >
            {displayText || (
              <>
                {getUserText()} typing
                <span className="glass-inline-glass-flex glass-ml-1 glass-gap-0.5">
                  {Array.from({ length: 3 }, (_, i) => (
                    <span
                      key={i}
                      className="glass-animate-pulse"
                      style={{ animationDelay: `${i * 200}ms` }}
                    >
                      .
                    </span>
                  ))}
                </span>
              </>
            )}
          </span>
        )}
        {(!showUsers || !hasUsers) && (
          <div className={cn("flex items-center", sizeClasses[size].gap)}>
            {dots}
          </div>
        )}
      </div>
    );

    if (!glass) {
      return (
        <div
          data-glass-component
          ref={ref}
          className={cn("inline-flex", className)}
          role="status"
          aria-live="polite"
          aria-label={
            hasUsers && showUsers
              ? `${userList.join(", ")} ${userList.length === 1 ? "is" : "are"} typing`
              : "Someone is typing"
          }
          {...props}
        >
          {content}
        </div>
      );
    }

    return (
      <OptimizedGlass
        ref={ref}
        elevation={elevation}
        className={cn(
          "inline-flex glass-radius-full",
          sizeClasses[size].padding,
          className
        )}
        role="status"
        aria-live="polite"
        aria-label={
          hasUsers && showUsers
            ? `${userList.join(", ")} ${userList.length === 1 ? "is" : "are"} typing`
            : "Someone is typing"
        }
        {...props}
      >
        {content}
      </OptimizedGlass>
    );
  }
);

GlassTypingIndicator.displayName = "GlassTypingIndicator";

const animations = {
  bounce: "animate-bounce",
  pulse: "animate-pulse",
  wave: "",
  fade: "animate-pulse",
};

if (
  typeof document !== "undefined" &&
  !document.getElementById("typing-indicator-keyframes")
) {
  const style = document.createElement("style");
  style.id = "typing-indicator-keyframes";
  style.textContent = `
    @keyframes wave {
      0%, 60%, 100% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-8px);
      }
    }
  `;
  document.head.appendChild(style);
}

export default GlassTypingIndicator;
