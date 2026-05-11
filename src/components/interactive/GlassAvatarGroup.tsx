"use client";
import React, { forwardRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { useA11yId } from "../../utils/a11y";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";
import { createGlassStyle } from "../../core/mixins/glassMixins";

const avatarFallbackStyle = createGlassStyle({
  intent: "neutral",
  elevation: "level2",
});

export interface AvatarItem {
  name: string;
  avatar?: string;
  status?: "online" | "away" | "busy" | "offline";
}

export interface GlassAvatarGroupProps {
  users?: AvatarItem[];
  children?: React.ReactNode;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Custom ID */
  id?: string;
  /** Custom ARIA label */
  "aria-label"?: string;
}

export const GlassAvatarGroup = forwardRef<
  HTMLDivElement,
  GlassAvatarGroupProps
>(
  (
    {
      // ContrastGuard text coverage is tracked in the manual accessibility QA report.

      users = [],
      children,
      max = 5,
      size = "md",
      className,
      id,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const componentId = useA11yId(id || "avatar-group");
    const s = size === "sm" ? 24 : size === "lg" ? 40 : 32;
    const overlap = size === "sm" ? -8 : size === "lg" ? -12 : -10;
    const childArray = React.Children.toArray(children);
    const hasChildren = childArray.length > 0;
    const shown = users.slice(0, max);
    const visibleChildren = childArray.slice(0, max);
    const rest = hasChildren
      ? childArray.length - visibleChildren.length
      : users.length - shown.length;

    const total = hasChildren ? childArray.length : users.length;
    const shownCount = hasChildren ? visibleChildren.length : shown.length;
    const defaultAriaLabel = `Group of ${total} users${rest > 0 ? `, showing ${shownCount} of ${total}` : ""}`;
    return (
      <div
        data-glass-component
        ref={ref}
        id={componentId}
        className={cn(
          "glass-flex glass-items-center glass-justify-center glass-min-w-0",
          className
        )}
        role="group"
        aria-label={ariaLabel || defaultAriaLabel}
        {...props}
      >
        {hasChildren
          ? visibleChildren.map((child, i) => (
              <div
                key={i}
                className="glass-relative"
                style={{
                  marginLeft: i === 0 ? 0 : overlap,
                  zIndex: shownCount - i,
                }}
              >
                {child}
              </div>
            ))
          : shown.map((u, i) => (
              <div
                key={u.name + i}
                className="glass-relative"
                style={{
                  marginLeft: i === 0 ? 0 : overlap,
                  zIndex: shownCount - i,
                }}
                role="img"
                aria-label={`${u.name}${u.status ? ` (${u.status})` : ""}`}
              >
                {u.avatar ? (
                  <img
                    src={u.avatar}
                    alt={u.name}
                    width={s}
                    height={s}
                    className="glass-radius-full glass-object-cover glass-border glass-border-white/20"
                    style={{
                      display: "block",
                      width: s,
                      height: s,
                      borderRadius: 9999,
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="glass-radius-full glass-surface-subtle/10 glass-border glass-border-white/20 glass-flex glass-items-center glass-justify-center"
                    style={{
                      ...avatarFallbackStyle,
                      width: s,
                      height: s,
                      borderRadius: 9999,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid rgba(255, 255, 255, 0.22)",
                    }}
                  >
                    <span
                      className="glass-text-xs glass-text-primary"
                      style={{
                        color: "rgba(248, 250, 252, 0.92)",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                      aria-hidden="true"
                    >
                      {u.name.charAt(0)}
                    </span>
                  </div>
                )}
                {u.status && (
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-3 h-3 glass-radius-full border-2 border-background",
                      u.status === "online"
                        ? "bg-green-500"
                        : u.status === "away"
                          ? "bg-yellow-500"
                          : u.status === "busy"
                            ? "bg-red-500"
                            : "bg-slate-500"
                    )}
                    style={{
                      position: "absolute",
                      right: -2,
                      bottom: -2,
                      width: 12,
                      height: 12,
                      borderRadius: 9999,
                    }}
                    aria-label={`Status: ${u.status}`}
                    role="img"
                  />
                )}
              </div>
            ))}
        {rest > 0 && (
          <div
            className="glass-radius-full glass-surface-subtle/10 glass-border glass-border-white/20 glass-flex glass-items-center glass-justify-center glass-ml--10px"
            style={{
              ...avatarFallbackStyle,
              width: s,
              height: s,
              marginLeft: overlap,
              borderRadius: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255, 255, 255, 0.22)",
            }}
            role="img"
            aria-label={`${rest} more users`}
          >
            <span
              className="glass-text-xs glass-text-primary"
              aria-hidden="true"
            >
              +{rest}
            </span>
          </div>
        )}
      </div>
    );
  }
);

GlassAvatarGroup.displayName = "GlassAvatarGroup";

export default GlassAvatarGroup;
