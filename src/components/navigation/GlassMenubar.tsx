import { GlassButton } from "../button/GlassButton";

import { cn } from "../../lib/utilsComprehensive";
import { ChevronRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  children?: MenuItem[];
  action?: () => void;
  separator?: boolean;
  checked?: boolean;
  type?: "normal" | "checkbox" | "radio";
  group?: string;
}

export interface GlassMenubarProps {
  /**
   * Menu items
   */
  items: MenuItem[];
  /**
   * Menubar orientation
   */
  orientation?: "horizontal" | "vertical";
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg";
  /**
   * Custom className
   */
  className?: string;
  /**
   * Whether menubar is disabled
   */
  disabled?: boolean;
  /**
   * Accessible label for the menubar
   */
  "aria-label"?: string;
}

export interface GlassMenubarContentProps {
  /**
   * Menu content
   */
  children: React.ReactNode;
  /**
   * Content position
   */
  position?: { x: number; y: number };
  /**
   * Whether content is open
   */
  isOpen: boolean;
  /**
   * Callback to close content
   */
  onClose: () => void;
  /**
   * Custom className
   */
  className?: string;
}

export interface GlassMenubarItemProps {
  /**
   * Menu item data
   */
  item: MenuItem;
  /**
   * Whether item is hovered
   */
  isHovered?: boolean;
  /**
   * Whether item has submenu open
   */
  hasSubmenuOpen?: boolean;
  /**
   * Callback when item is clicked
   */
  onClick: (item: MenuItem) => void;
  /**
   * Callback to open submenu
   */
  onOpenSubmenu: (item: MenuItem) => void;
  /**
   * Callback to close submenu
   */
  onCloseSubmenu: () => void;
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg";
  /**
   * Custom className
   */
  className?: string;
  /**
   * ARIA haspopup attribute
   */
  "aria-haspopup"?: "menu" | undefined;
  /**
   * ARIA expanded attribute
   */
  "aria-expanded"?: boolean | undefined;
}

/**
 * GlassMenubar component
 * A glassmorphism menubar with dropdown menus
 */
export const GlassMenubar: React.FC<GlassMenubarProps> = ({
  items,
  orientation = "horizontal",
  size = "md",
  className,
  disabled = false,
  "aria-label": ariaLabel = "Menu bar",
}) => {
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleItemClick = (item: MenuItem) => {
    if (item?.disabled) return;

    if (item?.children && item?.children.length > 0) {
      // Toggle submenu
      setOpenMenus((prev: Set<string>) => {
        const newSet = new Set(prev);
        if (newSet.has(item?.id)) {
          newSet.delete(item?.id);
        } else {
          // Close other menus
          newSet.clear();
          newSet.add(item?.id);
        }
        return newSet;
      });
    } else {
      // Execute action and close all menus
      item?.action?.();
      setOpenMenus(new Set());
    }
  };

  const handleMouseEnter = (item: MenuItem) => {
    if (item?.disabled) return;
    setHoveredItem(item?.id);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const sizeClasses = {
    sm: "h-8 glass-px-3 glass-text-sm",
    md: "h-10 glass-px-4 glass-text-base",
    lg: "h-12 glass-px-6 glass-text-lg",
  };

  return (
    <OptimizedGlass
      data-glass-component
      intent="neutral"
      elevation="level2"
      intensity="medium"
      depth={2}
      tint="neutral"
      border="subtle"
      animation="none"
      performanceMode="medium"
      className={cn(
        "relative glass-backdrop-blur-md ring-1 ring-white/10 bg-white/5",
        orientation === "horizontal" ? "flex flex-row" : "flex flex-col",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      role="menubar"
      aria-label={ariaLabel}
      aria-orientation={orientation}
      aria-disabled={disabled}
    >
      {items.map((item, index) => (
        <React.Fragment key={item?.id}>
          {item?.separator && (
            <div
              className={cn(
                "bg-white/20",
                orientation === "horizontal"
                  ? "w-px h-6 glass-mx-2"
                  : "h-px w-6 glass-my-2"
              )}
            />
          )}

          <GlassMenubarItem
            item={item}
            isHovered={hoveredItem === item?.id}
            hasSubmenuOpen={openMenus.has(item?.id)}
            onClick={handleItemClick}
            onOpenSubmenu={(item) =>
              setOpenMenus((prev: any) => new Set([...prev, item?.id]))
            }
            onCloseSubmenu={() => setOpenMenus(new Set())}
            size={size}
            aria-haspopup={
              item?.children && item?.children.length > 0 ? "menu" : undefined
            }
            aria-expanded={openMenus.has(item?.id) ? true : undefined}
          />

          {/* Submenu */}
          {item?.children && openMenus.has(item?.id) && (
            <GlassMenubarContent
              isOpen={true}
              onClose={() => setOpenMenus(new Set())}
              className={cn(
                "absolute z-[9999]",
                orientation === "horizontal"
                  ? "top-full left-0 glass-mt-1"
                  : "top-0 left-full glass-ml-1"
              )}
            >
              <GlassMenubar
                items={item?.children}
                orientation="vertical"
                size={size}
                disabled={disabled}
              />
            </GlassMenubarContent>
          )}
        </React.Fragment>
      ))}
    </OptimizedGlass>
  );
};

/**
 * GlassMenubarContent component
 * Container for menubar dropdown content
 */
export const GlassMenubarContent: React.FC<GlassMenubarContentProps> = ({
  children,
  position,
  isOpen,
  onClose,
  className,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Motion
      preset="scaleIn"
      duration={150}
      style={position ? { left: position.x, top: position.y } : undefined}
    >
      <OptimizedGlass
        intent="neutral"
        elevation={"level3"}
        intensity="strong"
        depth={2}
        tint="neutral"
        border="subtle"
        animation="none"
        performanceMode="medium"
        ref={contentRef}
        className={cn(
          "glass-backdrop-blur-md bg-black/20 border border-white/20 shadow-2xl",
          "min-w-48 glass-py-1",
          className
        )}
      >
        {children}
      </OptimizedGlass>
    </Motion>
  );
};

/**
 * GlassMenubarItem component
 * Individual menubar item
 */
export const GlassMenubarItem: React.FC<GlassMenubarItemProps> = ({
  item,
  isHovered = false,
  hasSubmenuOpen = false,
  onClick,
  onOpenSubmenu,
  onCloseSubmenu,
  size = "md",
  className,
  "aria-haspopup": ariaHasPopup,
  "aria-expanded": ariaExpanded,
}) => {
  const sizeClasses = {
    sm: "h-8 glass-px-3 glass-text-sm",
    md: "h-10 glass-px-4 glass-text-base",
    lg: "h-12 glass-px-6 glass-text-lg",
  };

  const handleClick = () => {
    onClick(item);
  };

  const handleMouseEnter = () => {
    if (item?.children && item?.children.length > 0) {
      onOpenSubmenu(item);
    }
  };

  const handleMouseLeave = () => {
    onCloseSubmenu();
  };

  if (item?.separator) {
    return (
      <div
        className="h-px glass-surface-subtle/20 glass-mx-2 glass-my-1"
        role="separator"
      />
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const current = e.currentTarget;
    const menubar = current.closest('[role="menubar"]') as HTMLElement | null;
    if (!menubar) return;
    const items = Array.from(
      menubar.querySelectorAll('button?.[role="menuitem"]')
    ) as HTMLButtonElement[];
    const index = items.indexOf(current);
    if (index === -1) return;

    if (e.key === "ArrowRight") {
      items[(index + 1) % (items?.length || 0)]?.focus();
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      items[(index - 1 + (items?.length || 0)) % (items?.length || 0)]?.focus();
      e.preventDefault();
    } else if (
      e.key === "ArrowDown" &&
      item?.children &&
      item?.children.length > 0
    ) {
      onOpenSubmenu(item);
      e.preventDefault();
    } else if (e.key === "Escape") {
      onCloseSubmenu();
      current.blur();
      e.preventDefault();
    } else if (e.key === "Home") {
      items[0]?.focus();
      e.preventDefault();
    } else if (e.key === "End") {
      items[items.length - 1]?.focus();
      e.preventDefault();
    } else if (e.key === "Enter" || e.key === " ") {
      handleClick();
      e.preventDefault();
    }
  };

  return (
    <GlassButton
      className={cn(
        "relative flex items-center justify-between w-full",
        "glass-text-primary/80 hover:glass-text-primary transition-colors duration-200",
        "hover:bg-white/10 glass-radius-md hover:-translate-y-0.5",
        "after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-primary after:transition-all after:duration-200",
        isHovered || hasSubmenuOpen
          ? "after:opacity-100 after:w-full"
          : "after:opacity-0 after:w-0",
        "focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        sizeClasses?.[size],
        {
          "bg-white/20 glass-text-primary": isHovered || hasSubmenuOpen,
          "font-medium": item?.checked,
        },
        className
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={item?.disabled}
      type="button"
      role="menuitem"
      aria-haspopup={ariaHasPopup}
      aria-expanded={ariaExpanded}
      aria-disabled={item?.disabled}
      aria-checked={
        item?.type === "checkbox" || item?.type === "radio"
          ? item?.checked
          : undefined
      }
      onKeyDown={handleKeyDown}
    >
      <div className="glass-flex glass-items-center glass-gap-3">
        {/* Icon */}
        {item?.icon && (
          <div className="glass-flex glass-items-center glass-justify-center w-4 h-4">
            {item?.icon}
          </div>
        )}

        {/* Checkbox/Radio indicator */}
        {item?.type === "checkbox" && (
          <div
            className={cn(
              "w-4 h-4 border border-white/40 glass-radius-md",
              item?.checked && "bg-white border-white"
            )}
          >
            {item?.checked && (
              <div className="glass-w-full glass-h-full glass-flex glass-items-center glass-justify-center">
                <div className="w-2 h-2 glass-surface-dark glass-radius-sm" />
              </div>
            )}
          </div>
        )}

        {item?.type === "radio" && (
          <div
            className={cn(
              "w-4 h-4 border border-white/40 glass-radius-full",
              item?.checked && "border-white"
            )}
          >
            {item?.checked && (
              <div className="glass-w-full glass-h-full glass-flex glass-items-center glass-justify-center">
                <div className="w-2 h-2 glass-surface-subtle glass-radius-full" />
              </div>
            )}
          </div>
        )}

        {/* Label */}
        <span className="glass-flex-1 text-left truncate">{item?.label}</span>
      </div>

      <div className="glass-flex glass-items-center glass-gap-2">
        {/* Shortcut */}
        {item?.shortcut && (
          <span className="text-primary/50 glass-text-xs font-mono">
            {item?.shortcut}
          </span>
        )}

        {/* Submenu indicator */}
        {item?.children && item?.children.length > 0 && (
          <ChevronRight className="w-4 h-4 text-primary/50" />
        )}
      </div>
    </GlassButton>
  );
};

/**
 * Hook for creating menubar items
 */
export const useMenubar = () => {
  const createItem = (
    id: string,
    label: string,
    action?: () => void,
    options?: Partial<Omit<MenuItem, "id" | "label" | "action">>
  ): MenuItem => ({
    id,
    label,
    action,
    ...options,
  });

  const createSeparator = (): MenuItem => ({
    id: `separator-${Date.now()}`,
    label: "",
    separator: true,
  });

  const createCheckboxItem = (
    id: string,
    label: string,
    checked: boolean,
    onChange: (checked: boolean) => void,
    options?: Partial<Omit<MenuItem, "id" | "label" | "type" | "checked">>
  ): MenuItem => ({
    id,
    label,
    type: "checkbox",
    checked,
    action: () => onChange(!checked),
    ...options,
  });

  const createRadioItem = (
    id: string,
    label: string,
    checked: boolean,
    onChange: (checked: boolean) => void,
    options?: Partial<Omit<MenuItem, "id" | "label" | "type" | "checked">>
  ): MenuItem => ({
    id,
    label,
    type: "radio",
    checked,
    action: () => onChange(!checked),
    ...options,
  });

  return {
    createItem,
    createSeparator,
    createCheckboxItem,
    createRadioItem,
  };
};

/**
 * Preset menubar configurations
 */
export const createFileMenu = (): MenuItem[] => [
  {
    id: "file-new",
    label: "New",
    shortcut: "Ctrl+N",
    action: () => {
      // New file action - implement based on your needs
    },
  },
  {
    id: "file-open",
    label: "Open",
    shortcut: "Ctrl+O",
    action: () => {
      // Open file action - implement based on your needs
    },
  },
  {
    id: "file-separator-1",
    label: "",
    separator: true,
  },
  {
    id: "file-save",
    label: "Save",
    shortcut: "Ctrl+S",
    action: () => {
      // Save file action - implement based on your needs
    },
  },
  {
    id: "file-save-as",
    label: "Save As",
    shortcut: "Ctrl+Shift+S",
    action: () => {
      // Save as action - implement based on your needs
    },
  },
];

export const createEditMenu = (): MenuItem[] => [
  {
    id: "edit-undo",
    label: "Undo",
    shortcut: "Ctrl+Z",
    action: () => {
      // Undo action - implement based on your needs
    },
  },
  {
    id: "edit-redo",
    label: "Redo",
    shortcut: "Ctrl+Y",
    action: () => {
      // Redo action - implement based on your needs
    },
  },
  {
    id: "edit-separator-1",
    label: "",
    separator: true,
  },
  {
    id: "edit-cut",
    label: "Cut",
    shortcut: "Ctrl+X",
    action: () => {
      // Cut action - implement based on your needs
    },
  },
  {
    id: "edit-copy",
    label: "Copy",
    shortcut: "Ctrl+C",
    action: () => {
      // Copy action - implement based on your needs
    },
  },
  {
    id: "edit-paste",
    label: "Paste",
    shortcut: "Ctrl+V",
    action: () => {
      // Paste action - implement based on your needs
    },
  },
];
