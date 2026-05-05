"use client";
import { cn } from "../../lib/utilsComprehensive";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";
import { FocusTrap } from "../../primitives/focus/FocusTrap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { GlassButton, IconButton } from "../button/GlassButton";
import { GlassBadge } from "../data-display/GlassBadge";
import { HStack, VStack } from "../layout/GlassStack";

export interface MobileNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
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
  children?: MobileNavItem[];
}

export interface MobileNavSection {
  id: string;
  label?: string;
  items: MobileNavItem[];
}

export interface GlassMobileNavProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether mobile nav is open
   */
  open?: boolean;
  /**
   * Open state change handler
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Navigation variant
   */
  variant?: "overlay" | "push" | "slide";
  /**
   * Navigation position
   */
  position?: "left" | "right" | "top" | "bottom";
  /**
   * Glass elevation
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | "float" | "modal";
  /**
   * Logo/brand component
   */
  logo?: React.ReactNode;
  /**
   * Navigation title
   */
  title?: string;
  /**
   * Navigation sections
   */
  navigation?: MobileNavSection[];
  /**
   * Current active path
   */
  activePath?: string;
  /**
   * Path matcher function
   */
  isActive?: (href: string, activePath: string) => boolean;
  /**
   * Footer content
   */
  footer?: React.ReactNode;
  /**
   * Close on item click
   */
  closeOnClick?: boolean;
  /**
   * Show backdrop
   */
  showBackdrop?: boolean;
  /**
   * Custom item renderer
   */
  renderItem?: (item: MobileNavItem, level: number) => React.ReactNode;
}

/**
 * GlassMobileNav component
 * Mobile-first navigation with glassmorphism design
 */
export const GlassMobileNav = forwardRef<HTMLDivElement, GlassMobileNavProps>(
  (
    {
      open = false,
      onOpenChange,
      variant = "overlay",
      position = "left",
      elevation = "modal",
      logo,
      title,
      navigation = [],
      activePath = "",
      isActive,
      footer,
      closeOnClick = true,
      showBackdrop = true,
      renderItem,
      className,
      children,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const previousBodyOverflowRef = useRef<string | null>(null);
    const prefersReducedMotion = useReducedMotion();

    // Default active path matcher
    const defaultIsActive = (href: string, currentPath: string) => {
      if (href === "/") return currentPath === "/";
      return currentPath.startsWith(href);
    };

    const checkIsActive = isActive || defaultIsActive;

    // Position classes
    const positionClasses = {
      left: {
        overlay: "fixed inset-y-0 left-0 w-80 max-w-[85vw]",
        push: "fixed inset-y-0 left-0 w-80 max-w-[85vw]",
        slide: "fixed inset-y-0 left-0 w-80 max-w-[85vw]",
      },
      right: {
        overlay: "fixed inset-y-0 right-0 w-80 max-w-[85vw]",
        push: "fixed inset-y-0 right-0 w-80 max-w-[85vw]",
        slide: "fixed inset-y-0 right-0 w-80 max-w-[85vw]",
      },
      top: {
        overlay: "fixed inset-x-0 top-0 h-96 max-h-[85vh]",
        push: "fixed inset-x-0 top-0 h-96 max-h-[85vh]",
        slide: "fixed inset-x-0 top-0 h-96 max-h-[85vh]",
      },
      bottom: {
        overlay: "fixed inset-x-0 bottom-0 h-96 max-h-[85vh]",
        push: "fixed inset-x-0 bottom-0 h-96 max-h-[85vh]",
        slide: "fixed inset-x-0 bottom-0 h-96 max-h-[85vh]",
      },
    };

    // Transform classes for animations
    const transformClasses = {
      left: open ? "translate-x-0" : "-translate-x-full",
      right: open ? "translate-x-0" : "translate-x-full",
      top: open ? "translate-y-0" : "-translate-y-full",
      bottom: open ? "translate-y-0" : "translate-y-full",
    };

    // Toggle item expansion
    const toggleItem = (itemId: string) => {
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(itemId)) {
        newExpanded.delete(itemId);
      } else {
        newExpanded.add(itemId);
      }
      setExpandedItems(newExpanded);
    };

    // Handle item click
    const handleItemClick = (item: MobileNavItem) => {
      if (item?.children && item?.children.length > 0) {
        toggleItem(item?.id);
      } else {
        if (item?.href && closeOnClick) {
          onOpenChange?.(false);
        }
        item?.onClick?.();
      }
    };

    // Render navigation item
    const renderNavigationItem = (item: MobileNavItem, level = 0) => {
      if (renderItem) {
        return renderItem(item, level);
      }

      const active = item?.href ? checkIsActive(item?.href, activePath) : false;
      const hasChildren = item?.children && item?.children.length > 0;
      const isExpanded = expandedItems.has(item?.id);

      const itemContent = (
        <>
          <div className="glass-flex glass-items-center glass-gap-3 glass-flex-1 glass-min-w-0">
            <div className="glass-flex-shrink-0 glass-text-lg">
              {item?.icon}
            </div>
            <span className="glass-font-medium glass-truncate">
              {item?.label}
            </span>
            {item?.badge && (
              <GlassBadge
                variant={item?.badgeVariant || "outline"}
                size="xs"
                className="glass-ml-auto"
              >
                {item?.badge}
              </GlassBadge>
            )}
          </div>
          {hasChildren && (
            <div className="glass-flex-shrink-0 glass-ml-2">
              <div
                className={cn(
                  "transition-transform duration-200",
                  isExpanded && "rotate-90"
                )}
              >
                ▶
              </div>
            </div>
          )}
        </>
      );

      return (
        <div data-glass-component key={item?.id}>
          <GlassButton
            variant={active ? "primary" : "ghost"}
            size="md"
            disabled={item?.disabled}
            className={cn(
              "w-full justify-start h-12 glass-px-4",
              level > 0 && "ml-6 glass-mr-2"
            )}
            onClick={(e) => handleItemClick(item)}
          >
            {itemContent}
          </GlassButton>

          {/* Render children */}
          {hasChildren && isExpanded && (
            <Motion preset="slideDown" className="glass-mt-1">
              <VStack space="xs">
                {item?.children!.map((child: any) =>
                  renderNavigationItem(child, level + 1)
                )}
              </VStack>
            </Motion>
          )}
        </div>
      );
    };

    // Render section
    const renderSection = (section: MobileNavSection) => {
      return (
        <div key={section.id}>
          {/* Section header */}
          {section.label && (
            <div className="glass-px-4 glass-py-2">
              <h3 className="glass-text-xs glass-font-medium glass-text-secondary glass-uppercase glass-tracking-wide">
                {section.label}
              </h3>
            </div>
          )}

          {/* Section items */}
          <VStack space="xs">
            {section.items.map((item: any) => renderNavigationItem(item))}
          </VStack>
        </div>
      );
    };

    // Handle backdrop click
    const handleClose = useCallback(() => {
      onOpenChange?.(false);
    }, [onOpenChange]);

    const handleBackdropClick = useCallback(() => {
      handleClose();
    }, [handleClose]);

    // Prevent body scroll when open
    useEffect(() => {
      if (open) {
        previousBodyOverflowRef.current = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = previousBodyOverflowRef.current || "";
          previousBodyOverflowRef.current = null;
        };
      }
    }, [open]);

    return (
      <>
        {/* Backdrop */}
        {showBackdrop && open && (
          <Motion
            preset="fadeIn"
            className="glass-fixed glass-inset-0 glass-surface-dark/50 glass-backdrop-blur-md glass-z-100 glass-contrast-guard"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--glass-black) 40%, transparent)",
            }}
            onClick={handleBackdropClick}
            aria-hidden="true"
          />
        )}

        {/* Navigation */}
        <FocusTrap
          active={open}
          restoreFocus
          autoFocus
          allowEscape
          onEscape={handleClose}
        >
          <OptimizedGlass
            intent="neutral"
            elevation="level2"
            intensity="medium"
            depth={2}
            tint="neutral"
            border="subtle"
            animation="none"
            performanceMode="medium"
            ref={ref}
            role="dialog"
            aria-modal={open ? true : undefined}
            aria-hidden={!open}
            aria-label={ariaLabel || title || "Mobile navigation"}
            {...(!open ? { inert: "" } : {})}
            className={cn(
              "flex flex-col z-[101] max-w-[100vw] max-h-[100dvh] motion-reduce:transition-none",
              prefersReducedMotion
                ? "transition-none"
                : "transition-transform duration-300 ease-out",
              !open && "pointer-events-none",
              positionClasses?.[position][variant],
              transformClasses?.[position],
              className
            )}
            {...props}
          >
            {/* Header */}
            <div className="glass-flex glass-items-center glass-justify-between glass-p-4 glass-border-b glass-border-glass-border/20">
              <HStack
                space="sm"
                align="center"
                className="glass-flex-1 glass-min-w-0"
              >
                {logo && <div className="glass-flex-shrink-0">{logo}</div>}
                {title && (
                  <h1 className="glass-font-bold glass-text-lg glass-text-primary glass-truncate">
                    {title}
                  </h1>
                )}
              </HStack>

              <IconButton
                icon="×"
                variant="ghost"
                size="sm"
                onClick={handleClose}
                aria-label="Close navigation"
                className="glass-focus glass-touch-target"
              />
            </div>

            {/* Navigation content */}
            <nav className="glass-flex-1 glass-p-4 glass-overflow-y-auto glass-overscroll-contain">
              <VStack space="lg">
                {navigation.map((section: any) => renderSection(section))}
                {children}
              </VStack>
            </nav>

            {/* Footer */}
            {footer && (
              <div className="glass-p-4 glass-border-t glass-border-glass-border/20">
                {footer}
              </div>
            )}
          </OptimizedGlass>
        </FocusTrap>
      </>
    );
  }
);

GlassMobileNav.displayName = "GlassMobileNav";
