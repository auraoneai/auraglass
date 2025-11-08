// Removed circular import - using regular button element

import { cn } from "../../lib/utilsComprehensive";
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  description?: string;
  badge?: string | number;
  disabled?: boolean;
  external?: boolean;
  children?: NavigationItem[];
  action?: () => void;
  separator?: boolean;
  featured?: boolean;
}

export interface GlassNavigationMenuProps {
  /**
   * Navigation items
   */
  items: NavigationItem[];
  /**
   * Menu orientation
   */
  orientation?: "horizontal" | "vertical";
  /**
   * Menu variant
   */
  variant?: "default" | "sidebar" | "header";
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg";
  /**
   * Active item ID
   */
  activeItem?: string;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Whether menu is collapsed (for sidebar variant)
   */
  collapsed?: boolean;
  /**
   * Callback when item is clicked
   */
  onItemClick?: (item: NavigationItem) => void;
}

export interface GlassNavigationMenuContentProps {
  /**
   * Menu content
   */
  children: React.ReactNode;
  /**
   * Content className
   */
  className?: string;
  /**
   * Whether content is open
   */
  isOpen?: boolean;
}

export interface GlassNavigationMenuItemProps {
  /**
   * Navigation item
   */
  item: NavigationItem;
  /**
   * Whether item is active
   */
  isActive?: boolean;
  /**
   * Whether item has submenu open
   */
  hasSubmenuOpen?: boolean;
  /**
   * Whether menu is collapsed
   */
  collapsed?: boolean;
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg";
  /**
   * Callback when item is clicked
   */
  onClick: (item: NavigationItem) => void;
  /**
   * Callback to toggle submenu
   */
  onToggleSubmenu: (itemId: string) => void;
  /**
   * Custom className
   */
  className?: string;
}

/**
 * GlassNavigationMenu component
 * Advanced glassmorphism navigation menu with nested items
 */
export const GlassNavigationMenu: React.FC<GlassNavigationMenuProps> = ({
  items,
  orientation = "vertical",
  variant = "default",
  size = "md",
  activeItem,
  className,
  collapsed = false,
  onItemClick,
}) => {
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());

  const handleItemClick = (item: NavigationItem) => {
    if (item?.disabled) return;

    if (item?.children && item?.children.length > 0) {
      // Toggle submenu
      setOpenSubmenus((prev: Set<string>) => {
        const newSet = new Set(prev);
        if (newSet.has(item?.id)) {
          newSet.delete(item?.id);
        } else {
          newSet.add(item?.id);
        }
        return newSet;
      });
    } else {
      // Execute action
      if (item?.href) {
        if (item?.external) {
          window.open(item?.href, "_blank");
        } else {
          window.location.href = item?.href;
        }
      } else {
        item?.action?.();
      }
      onItemClick?.(item);
    }
  };

  const toggleSubmenu = (itemId: string) => {
    setOpenSubmenus((prev: Set<string>) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const variantClasses = {
    default: "glass-glass-backdrop-blur-md ring-1 ring-white/10 bg-white/5",
    sidebar:
      "glass-glass-backdrop-blur-md ring-0 border-r border-white/10 bg-white/5",
    header:
      "glass-glass-backdrop-blur-md ring-0 border-b border-white/10 bg-white/5",
  };

  return (
    <OptimizedGlass
      data-glass-component
      intent="neutral"
      elevation="level1"
      intensity="medium"
      depth={2}
      tint="neutral"
      border="subtle"
      animation="none"
      performanceMode="medium"
      className={cn(
        variantClasses?.[variant],
        orientation === "horizontal" ? "flex flex-row" : "flex flex-col",
        className
      )}
    >
      {items.map((item, index) => (
        <React.Fragment key={item?.id}>
          {item?.separator && (
            <div
              className={cn(
                "bg-white/20",
                orientation === "horizontal"
                  ? "w-px h-8 glass-mx-4"
                  : "h-px w-full glass-my-2 glass-mx-4"
              )}
            />
          )}

          <GlassNavigationMenuItem
            item={item}
            isActive={activeItem === item?.id}
            hasSubmenuOpen={openSubmenus.has(item?.id)}
            collapsed={collapsed}
            size={size}
            onClick={handleItemClick}
            onToggleSubmenu={toggleSubmenu}
          />

          {/* Submenu */}
          {item?.children && openSubmenus.has(item?.id) && !collapsed && (
            <Motion preset="slideDown" duration={200}>
              <div
                className={cn(
                  "glass-ml-4 border-l border-white/20 pl-4",
                  orientation === "horizontal" &&
                    "absolute top-full left-0 glass-mt-2 z-50"
                )}
              >
                <GlassNavigationMenu
                  items={item?.children}
                  orientation="vertical"
                  variant="default"
                  size={size}
                  activeItem={activeItem}
                  onItemClick={onItemClick}
                />
              </div>
            </Motion>
          )}
        </React.Fragment>
      ))}
    </OptimizedGlass>
  );
};

/**
 * GlassNavigationMenuContent component
 * Container for navigation menu content
 */
export const GlassNavigationMenuContent: React.FC<
  GlassNavigationMenuContentProps
> = ({ children, className, isOpen = true }) => {
  if (!isOpen) return null;

  return (
    <Motion preset="slideDown" duration={200}>
      <div className={className}>{children}</div>
    </Motion>
  );
};

/**
 * GlassNavigationMenuItem component
 * Individual navigation menu item
 */
export const GlassNavigationMenuItem: React.FC<
  GlassNavigationMenuItemProps
> = ({
  item,
  isActive = false,
  hasSubmenuOpen = false,
  collapsed = false,
  size = "md",
  onClick,
  onToggleSubmenu,
  className,
}) => {
  const hoverTimer = React.useRef<number | null>(null);

  const clearHoverTimer = () => {
    if (hoverTimer.current) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  const onHoverEnter = () => {
    if (!item?.children || item?.children.length === 0 || collapsed) return;
    clearHoverTimer();
    hoverTimer.current = window.setTimeout(() => {
      if (!hasSubmenuOpen) onToggleSubmenu(item?.id);
    }, 120);
  };

  const onHoverLeave = () => {
    if (!item?.children || item?.children.length === 0 || collapsed) return;
    clearHoverTimer();
    hoverTimer.current = window.setTimeout(() => {
      if (hasSubmenuOpen) onToggleSubmenu(item?.id);
    }, 180);
  };

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      clearHoverTimer();
    };
  }, []);

  const sizeClasses = {
    sm: "h-8 glass-px-3 glass-text-sm",
    md: "h-10 glass-px-4 glass-text-base",
    lg: "h-12 glass-px-6 glass-text-lg",
  };

  const handleClick = () => {
    onClick(item);
  };

  const handleSubmenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSubmenu(item?.id);
  };

  if (item?.separator) {
    return (
      <div className="h-px glass-surface-subtle/20 glass-mx-4 glass-my-2" />
    );
  }

  if (collapsed) {
    return (
      <Motion preset="none">
        <button
          className={cn(
            "relative flex items-center justify-center w-full",
            "glass-text-primary/70 hover:glass-text-primary transition-colors duration-200",
            "hover:bg-white/10 glass-radius-lg",
            "glass-focus glass-touch-target glass-contrast-guard",
            "focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            sizeClasses?.[size],
            {
              "bg-white/20 glass-text-primary": isActive,
              "glass-text-primary": isActive,
            },
            className
          )}
          onClick={handleClick}
          disabled={item?.disabled}
          title={item?.label}
          type="button"
        >
          {item?.icon && (
            <div className="glass-flex glass-items-center glass-justify-center">
              {item?.icon}
            </div>
          )}

          {item?.badge && (
            <div className="absolute glass-top-1 -right-1 w-5 h-5 glass-surface-red glass-radius-full glass-flex glass-items-center glass-justify-center glass-text-xs font-bold text-primary">
              {typeof item?.badge === "number" && item?.badge > 99
                ? "99+"
                : item?.badge}
            </div>
          )}
        </button>
      </Motion>
    );
  }

  return (
    <Motion preset="none">
      <button
        className={cn(
          "relative flex items-center justify-between w-full",
          "glass-text-primary/70 hover:glass-text-primary transition-all duration-200",
          "hover:bg-white/10 glass-radius-lg",
          "glass-focus glass-touch-target glass-contrast-guard",
          "focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          sizeClasses?.[size],
          {
            "bg-white/20 glass-text-primary shadow-md": isActive,
            "glass-text-primary": isActive,
          },
          className
        )}
        onClick={handleClick}
        onMouseEnter={onHoverEnter}
        onMouseLeave={onHoverLeave}
        disabled={item?.disabled}
        type="button"
      >
        <div className="glass-flex glass-items-center glass-gap-3 glass-flex-1 min-glass-w-0">
          {/* Icon */}
          {item?.icon && (
            <div className="glass-flex glass-items-center glass-justify-center glass-flex-shrink-0">
              {item?.icon}
            </div>
          )}

          {/* Content */}
          <div className="glass-flex-1 min-glass-w-0 text-left">
            <div className="glass-flex glass-items-center glass-gap-2">
              <span className="truncate font-medium">{item?.label}</span>

              {item?.badge && (
                <span className="glass-flex-shrink-0 glass-px-2 glass-py-0.5 glass-surface-red/20 glass-text-secondary glass-radius-full glass-text-xs font-medium">
                  {typeof item?.badge === "number" && item?.badge > 99
                    ? "99+"
                    : item?.badge}
                </span>
              )}
            </div>

            {item?.description && (
              <p className="text-primary/50 glass-text-sm truncate glass-mt-0-5">
                {item?.description}
              </p>
            )}
          </div>
        </div>

        {/* Right side actions */}
        <div className="glass-flex glass-items-center glass-gap-2 glass-flex-shrink-0">
          {/* External link indicator */}
          {item?.external && <div className="w-3 h-3 text-primary/50">↗</div>}

          {/* Featured indicator */}
          {item?.featured && (
            <div className="w-2 h-2 glass-surface-yellow glass-radius-full animate-pulse" />
          )}

          {/* Submenu toggle */}
          {item?.children && item?.children.length > 0 && (
            <button
              onClick={handleSubmenuToggle}
              className="glass-p-1 hover:glass-surface-subtle/10 glass-radius-md transition-colors duration-200 glass-focus glass-touch-target glass-focus glass-touch-target glass-contrast-guard"
              aria-label="Toggle submenu"
            >
              <Motion preset="rotateIn" duration={200}>
                <ChevronRight className="w-4 h-4 text-primary/50" />
              </Motion>
            </button>
          )}
        </div>
      </button>
    </Motion>
  );
};

/**
 * Hook for managing navigation menu state
 */
export const useNavigationMenu = (initialActiveItem?: string) => {
  const [activeItem, setActiveItem] = useState(initialActiveItem);
  const [collapsed, setCollapsed] = useState(false);

  const navigateTo = (item: NavigationItem) => {
    setActiveItem(item?.id);
    if (item?.href) {
      if (item?.external) {
        window.open(item?.href, "_blank");
      } else {
        window.location.href = item?.href;
      }
    } else {
      item?.action?.();
    }
  };

  return {
    activeItem,
    setActiveItem,
    collapsed,
    setCollapsed,
    navigateTo,
    toggleCollapsed: () => setCollapsed(!collapsed),
  };
};

/**
 * Preset navigation configurations
 */
export const createDashboardNavigation = (): NavigationItem[] => [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "📊",
    href: "/dashboard",
    description: "Overview and analytics",
  },
  {
    id: "projects",
    label: "Projects",
    icon: "📁",
    href: "/projects",
    badge: 3,
    children: [
      {
        id: "projects-active",
        label: "Active Projects",
        href: "/projects/active",
        badge: 2,
      },
      {
        id: "projects-completed",
        label: "Completed",
        href: "/projects/completed",
        badge: 1,
      },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: "📈",
    href: "/analytics",
    featured: true,
  },
];

export const createAdminNavigation = (): NavigationItem[] => [
  {
    id: "users",
    label: "User Management",
    icon: "👥",
    href: "/admin/users",
    children: [
      {
        id: "users-list",
        label: "All Users",
        href: "/admin/users",
      },
      {
        id: "users-roles",
        label: "Roles & Permissions",
        href: "/admin/users/roles",
      },
    ],
  },
  {
    id: "system",
    label: "System Settings",
    icon: "⚙️",
    href: "/admin/system",
  },
  {
    id: "logs",
    label: "Audit Logs",
    icon: "📋",
    href: "/admin/logs",
  },
];
