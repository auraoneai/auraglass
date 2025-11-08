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

export interface GlassBottomNavProps
  extends React.HTMLAttributes<HTMLDivElement> {
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
        height: "h-14",
        padding: "glass-px-2 glass-py-2",
        iconSize: "glass-text-base",
        labelSize: "glass-text-xs",
      },
      md: {
        height: "h-16",
        padding: "glass-px-4 glass-py-3",
        iconSize: "glass-text-lg",
        labelSize: "glass-text-xs",
      },
      lg: {
        height: "h-20",
        padding: "glass-px-6 glass-py-4",
        iconSize: "glass-text-xl",
        labelSize: "glass-text-sm",
      },
    };

    const variantClasses = {
      default: "border-t border-border/20",
      floating: "glass-mx-4 glass-mb-4 glass-radius-xl border border-border/20",
      minimal: "border-t border-border/10",
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
        <div key={item?.id} className="relative glass-flex-1">
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
              "w-full h-full flex flex-col items-center justify-center glass-gap-1 relative",
              labelPosition === "beside" && "flex-row glass-gap-2",
              !showLabels && "glass-gap-0"
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "flex-shrink-0 transition-all duration-200",
                config.iconSize,
                active && !shouldReduceMotion && "scale-110"
              )}
            >
              {iconToShow}
            </div>

            {/* Label */}
            {showLabels && (
              <span
                className={cn(
                  "font-medium transition-all duration-200 truncate",
                  config.labelSize,
                  active ? "text-primary-foreground" : "glass-text-secondary"
                )}
              >
                {item?.label}
              </span>
            )}

            {/* Active indicator */}
            {active && !showLabels && (
              <Motion
                preset={respectMotionPreference ? "scaleIn" : "none"}
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 glass-surface-primary glass-radius-full"
              />
            )}
          </GlassButton>

          {/* Badge */}
          {item?.badge && (
            <GlassBadge
              variant={item?.badgeVariant || "error"}
              size="xs"
              className="absolute glass-top-1 -right-1 min-w-[1.25rem] h-5 glass-flex glass-items-center glass-justify-center"
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
          "w-full flex items-center",
          config.height,
          config.padding,
          variantClasses?.[variant],
          sticky && "sticky bottom-0",
          safeArea && "pb-safe",
          className
        )}
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
