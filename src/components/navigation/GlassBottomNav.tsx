"use client";
import { cn } from "../../lib/utilsComprehensive";
import React, { forwardRef } from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";
import { GlassButton } from "../button/GlassButton";
import { GlassBadge } from "../data-display/GlassBadge";
import { HStack } from "../layout/GlassStack";
import { useA11yId } from "@/utils/a11y";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface BottomNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  badgeVariant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error";
  disabled?: boolean;
}

export interface GlassBottomNavProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Navigation items
   */
  items: BottomNavItem[];
  /**
   * Current active item ID
   */
  activeId?: string;
  /**
   * Active item change handler
   */
  onActiveChange?: (id: string) => void;
  /**
   * Bottom nav variant
   */
  variant?: "default" | "floating" | "minimal";
  /**
   * Glass elevation
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | "float" | "modal";
  /**
   * Whether to show labels
   */
  showLabels?: boolean;
  /**
   * Label position
   */
  labelPosition?: "below" | "beside";
  /**
   * Navigation size
   */
  size?: "sm" | "md" | "lg";
  /**
   * Whether navigation is sticky
   */
  sticky?: boolean;
  /**
   * Safe area padding for devices with home indicator
   */
  safeArea?: boolean;
  /**
   * Custom item renderer
   */
  renderItem?: (item: BottomNavItem, active: boolean) => React.ReactNode;
  /**
   * Whether to respect motion preferences for animations
   */
  respectMotionPreference?: boolean;
}

/**
 * GlassBottomNav component
 * Mobile bottom navigation with glassmorphism design
 */
export const GlassBottomNav = forwardRef<HTMLDivElement, GlassBottomNavProps>(
  (
    {
      items,
      activeId,
      onActiveChange,
      variant = "default",
      elevation = "level2",
      showLabels = true,
      labelPosition = "below",
      size = "md",
      sticky = true,
      safeArea = true,
      renderItem,
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    // Accessibility and motion preferences
    const navId = useA11yId("bottom-nav");
    const prefersReducedMotion = useReducedMotion();
    const shouldReduceMotion = respectMotionPreference && prefersReducedMotion;
    const sizeClasses = {
      sm: {
        height: "glass-h-14",
        padding: "glass-px-2 glass-py-2",
        iconSize: "glass-text-base",
        labelSize: "glass-text-xs",
      },
      md: {
        height: "glass-h-16",
        padding: "glass-px-4 glass-py-3",
        iconSize: "glass-text-lg",
        labelSize: "glass-text-xs",
      },
      lg: {
        height: "glass-h-20",
        padding: "glass-px-6 glass-py-4",
        iconSize: "glass-text-xl",
        labelSize: "glass-text-sm",
      },
    };

    const variantClasses = {
      default: "glass-border-t glass-border-glass-border/20",
      floating:
        "glass-mx-4 glass-mb-4 glass-radius-xl glass-border glass-border-glass-border/20",
      minimal: "glass-border-t glass-border-glass-border/10",
    };

    const config = sizeClasses?.[size];

    // Handle item click
    const handleItemClick = (item: BottomNavItem) => {
      if (item?.disabled) return;

      onActiveChange?.(item?.id);
      item?.onClick?.();
    };

    // Render navigation item
    const renderNavigationItem = (item: BottomNavItem) => {
      if (renderItem) {
        const active = activeId === item?.id;
        return renderItem(item, active);
      }

      const active = activeId === item?.id;
      const iconToShow =
        active && item?.activeIcon ? item?.activeIcon : item?.icon;

      return (
        <div key={item?.id} className="glass-relative glass-flex-1">
          <GlassButton
            variant={active ? "primary" : "ghost"}
            size="sm"
            disabled={item?.disabled}
            onClick={(e) => handleItemClick(item)}
            role="tab"
            aria-selected={active}
            aria-controls={`nav-panel-${item.id}`}
            tabIndex={active ? 0 : -1}
            className={cn(
              "glass-w-full glass-h-full glass-flex glass-flex-col glass-items-center glass-justify-center glass-gap-1 glass-relative",
              labelPosition === "beside" && "glass-flex-row glass-gap-2",
              !showLabels && "glass-gap-0"
            )}
            style={{
              border: 0,
              background: active ? undefined : "transparent",
              font: "inherit",
              display: "flex",
              flexDirection: labelPosition === "beside" ? "row" : "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            {/* Icon */}
            <div
              className={cn(
                "glass-flex-shrink-0 glass-transition-all glass-duration-200",
                config.iconSize,
                active && !shouldReduceMotion && "glass-scale-110"
              )}
            >
              {iconToShow}
            </div>

            {/* Label */}
            {showLabels && (
              <span
                className={cn(
                  "glass-font-medium glass-transition-all glass-duration-200 glass-truncate",
                  config.labelSize,
                  active ? "glass-text-primary" : "glass-text-secondary"
                )}
                style={{ maxWidth: "100%" }}
              >
                {item?.label}
              </span>
            )}

            {/* Active indicator */}
            {active && !showLabels && (
              <Motion
                preset={respectMotionPreference ? "scaleIn" : "none"}
                className="glass-absolute glass--glass-bottom-0-5 glass--left-1-2 glass--translate-x-1-2 glass-w-1 glass-h-1 glass-surface-primary glass-radius-full"
              />
            )}
          </GlassButton>

          {/* Badge */}
          {item?.badge && (
            <GlassBadge
              variant={item?.badgeVariant || "error"}
              size="xs"
              className="glass-absolute glass-top-1 glass--right-1 glass-min-w-1-25rem glass-h-5 glass-flex glass-items-center glass-justify-center"
            >
              {item?.badge}
            </GlassBadge>
          )}
        </div>
      );
    };

    return (
      <OptimizedGlass
        intent="neutral"
        elevation="level2"
        intensity="medium"
        depth={2}
        tint="neutral"
        border="subtle"
        animation={shouldReduceMotion ? "none" : "gentle"}
        performanceMode="medium"
        ref={ref}
        className={cn(
          "glass-w-full glass-flex glass-items-center",
          config.height,
          config.padding,
          variantClasses?.[variant],
          sticky && "glass-sticky glass-bottom-0",
          safeArea && "pb-safe",
          className
        )}
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          ...(sticky ? { position: "sticky", bottom: 0 } : {}),
        }}
        role="tablist"
        aria-label="Bottom navigation"
        id={navId}
        {...props}
      >
        <HStack space="none" className="glass-w-full">
          {items.map((item: any) => renderNavigationItem(item))}
        </HStack>
      </OptimizedGlass>
    );
  }
);

GlassBottomNav.displayName = "GlassBottomNav";
