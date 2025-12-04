'use client';
import { cn } from "../../lib/utilsComprehensive";
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  HTMLAttributes,
} from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";
import { useA11yId } from "@/utils/a11y";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  separator?: boolean;
  children?: ContextMenuItem[];
  action?: () => void;
  onClick?: () => void;
}

export interface GlassContextMenuProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * Menu items
   */
  items?: ContextMenuItem[];
  /**
   * Children to trigger the context menu
   */
  children: React.ReactNode;
  /**
   * Custom trigger element
   */
  trigger?: React.ReactNode;
  /**
   * Whether menu is open
   */
  open?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Menu alignment
   */
  align?: "start" | "center" | "end";
  /**
   * Menu side
   */
  side?: "top" | "right" | "bottom" | "left";
  /**
   * Custom className
   */
  className?: string;
  /**
   * Additional className for menu content element
   */
  menuClassName?: string;
  /**
   * Whether to respect motion preferences for animations
   */
  respectMotionPreference?: boolean;
}

export interface GlassContextMenuContentProps {
  /**
   * Menu items
   */
  items: ContextMenuItem[];
  /**
   * Position of the menu
   */
  position: { x: number; y: number };
  /**
   * Callback to close menu
   */
  onClose: () => void;
  /**
   * Maximum width
   */
  maxWidth?: string;
  /**
   * Custom className
   */
  className?: string;
}

export interface GlassContextMenuItemProps {
  /**
   * Menu item data
   */
  item: ContextMenuItem;
  /**
   * Whether item is selected
   */
  isSelected?: boolean;
  /**
   * Callback when item is clicked
   */
  onClick: (item: ContextMenuItem) => void;
  /**
   * Callback to close menu
   */
  onClose: () => void;
  /**
   * Whether this is a submenu
   */
  isSubmenu?: boolean;
}

/**
 * GlassContextMenu component
 * A glassmorphism context menu that appears on right-click
 */
export const GlassContextMenu: React.FC<GlassContextMenuProps> = ({
  items = [],
  children,
  trigger,
  open: controlledOpen,
  onOpenChange,
  align = "start",
  side = "bottom",
  className,
  menuClassName,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const open = controlledOpen !== undefined ? controlledOpen : isOpen;
  const setOpen = onOpenChange || setIsOpen;

  // Handle right-click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      let x = e.clientX;
      let y = e.clientY;

      // Adjust position based on alignment and side
      if (align === "end") x = rect.right;
      else if (align === "center") x = rect.left + rect.width / 2;

      if (side === "top") y = rect.top;
      else if (side === "bottom") y = rect.bottom;
      else if (side === "left") x = rect.left;
      else if (side === "right") x = rect.right;

      setPosition({ x, y });
      setOpen(true);
    }
  };

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = () => {
      if (open) setOpen(false);
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, setOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open, setOpen]);

  return (
    <>
      <div
        ref={triggerRef}
        onContextMenu={handleContextMenu}
        className={cn("cursor-context-menu", className)}
        {...rest}
      >
        {trigger || children}
      </div>

      {open && (
        <GlassContextMenuContent
          items={items}
          position={position}
          onClose={() => setOpen(false)}
          className={menuClassName ?? className}
        />
      )}
    </>
  );
};

/**
 * GlassContextMenuContent component
 * The actual menu content with positioning
 */
export const GlassContextMenuContent: React.FC<
  GlassContextMenuContentProps
> = ({ items, position, onClose, maxWidth = "200px", className }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);

  // Adjust position to keep menu in viewport
  useEffect(() => {
    if (menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newX = position.x;
      let newY = position.y;

      // Adjust horizontal position
      if (newX + rect.width > viewportWidth) {
        newX = viewportWidth - rect.width - 10;
      }

      // Adjust vertical position
      if (newY + rect.height > viewportHeight) {
        newY = viewportHeight - rect.height - 10;
      }

      if (newX !== position.x || newY !== position.y) {
        menu.style.left = `${newX}px`;
        menu.style.top = `${newY}px`;
      }
    }
  }, [position]);

  return (
    <Motion preset="scaleIn" className='glass-fixed glass-z-9999'>
      <OptimizedGlass
        intent="neutral"
        elevation="level4"
        intensity="strong"
        depth={2}
        tint="neutral"
        border="subtle"
        animation="none"
        performanceMode="medium"
        ref={menuRef}
        liftOnHover
        hoverSheen
        role="menu"
        aria-label="Context menu"
        aria-orientation="vertical"
        className={cn(
          "glass-backdrop-blur-md bg-black/20 border border-white/20 shadow-2xl",
          "min-w-48 max-w-xs overflow-hidden glass-radial-reveal glass-lift",
          className
        )}
        style={{
          left: position.x,
          top: position.y,
          maxWidth,
        }}
      >
        <div className="glass-py-1">
          {items.map((item, index) => (
            <React.Fragment key={item?.id}>
              {item?.separator && index > 0 && (
                <div
                  className='glass-h-px glass-surface-subtle/20 glass-mx-2 glass-my-1'
                  role="separator"
                />
              )}
              <GlassContextMenuItem
                item={item}
                onClick={(clickedItem) => {
                  if (clickedItem.children) {
                    setSubmenuOpen(
                      submenuOpen === clickedItem.id ? null : clickedItem.id
                    );
                  } else {
                    clickedItem.action?.();
                    clickedItem.onClick?.();
                    onClose();
                  }
                }}
                onClose={onClose}
                isSubmenu={false}
              />
              {item?.children && submenuOpen === item?.id && (
                <div className='glass-absolute glass-left-full glass-top-0 glass-ml-1'>
                  <GlassContextMenuContent
                    items={item?.children}
                    position={{ x: 0, y: 0 }}
                    onClose={() => setSubmenuOpen(null)}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </OptimizedGlass>
    </Motion>
  );
};

/**
 * GlassContextMenuItem component
 * Individual menu item
 */
export const GlassContextMenuItem: React.FC<GlassContextMenuItemProps> = ({
  item,
  isSelected = false,
  onClick,
  onClose,
  isSubmenu = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  if (item?.separator) {
    return (
      <div
        className='glass-h-px glass-surface-subtle/20 glass-mx-2 glass-my-1'
        role="separator"
      />
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const menuContainer = itemRef.current?.closest('[role="menu"]');
    if (!menuContainer) return;

    const menuItems = Array.from(
      menuContainer.querySelectorAll(
        '[role="menuitem"]:not([aria-disabled="true"])'
      )
    ) as HTMLElement[];
    const currentIndex = menuItems.indexOf(itemRef.current!);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        const nextItem = menuItems[currentIndex + 1] || menuItems[0];
        nextItem?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        const prevItem =
          menuItems[currentIndex - 1] || menuItems[menuItems.length - 1];
        prevItem?.focus();
        break;
      case "ArrowRight":
        if (item?.children) {
          e.preventDefault();
          onClick(item);
        }
        break;
      case "ArrowLeft":
        if (isSubmenu) {
          e.preventDefault();
          onClose();
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (!item?.disabled) onClick(item);
        break;
      case "Escape":
        e.preventDefault();
        onClose();
        break;
      case "Home":
        e.preventDefault();
        menuItems[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        menuItems[menuItems.length - 1]?.focus();
        break;
    }
  };

  return (
    <div
      ref={itemRef}
      role="menuitem"
      aria-disabled={item?.disabled}
      aria-haspopup={item?.children ? "menu" : undefined}
      tabIndex={item?.disabled ? -1 : 0}
      className={cn(
        "relative flex items-center glass-px-3 glass-py-2 cursor-pointer transition-all duration-200",
        "glass-text-primary/90 hover:glass-text-primary glass-radius-lg",
        "hover:bg-white/10 glass-hover--translate-y-0-5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/10",
        "glass-press",
        {
          "bg-white/20 glass-text-primary": isSelected,
          "opacity-50 cursor-not-allowed": item?.disabled,
          "text-red-400 hover:text-red-300": item?.destructive,
        }
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => !item?.disabled && onClick(item)}
      onKeyDown={handleKeyDown}
    >
      {item?.icon && (
        <div className='glass-flex glass-items-center glass-justify-center glass-w-4 glass-h-4 glass-mr-3'>
          {item?.icon}
        </div>
      )}

      <span className='glass-flex-1 glass-text-sm glass-font-medium glass-truncate'>
        {item?.label}
      </span>

      {item?.shortcut && (
        <span className='glass-ml-6 glass-text-xs glass-text-primary-glass-opacity-50 glass-font-mono'>
          {item?.shortcut}
        </span>
      )}

      {item?.children && (
        <div className='glass-ml-3 glass-text-primary-glass-opacity-50' aria-hidden="true">
          ▶
        </div>
      )}
    </div>
  );
};

/**
 * Hook for creating context menu items
 */
export const useContextMenu = () => {
  const createItem = (
    id: string,
    label: string,
    action?: () => void,
    options?: Partial<Omit<ContextMenuItem, "id" | "label" | "action">>
  ): ContextMenuItem => ({
    id,
    label,
    action,
    ...options,
  });

  const createSeparator = (): ContextMenuItem => ({
    id: `separator-${Date.now()}`,
    label: "",
    separator: true,
  });

  return {
    createItem,
    createSeparator,
  };
};