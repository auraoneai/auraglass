"use client";
import React, {
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  ForwardedRef,
  ReactNode,
} from "react";
import { cn } from "../../lib/utilsComprehensive";
import { OptimizedGlass, Motion } from "../../primitives";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useAnimationContext } from "../../contexts/AnimationContext";
import {
  SpringConfig,
  SpringPresets,
} from "../../animations/physics/springPhysics";
import {
  createNavigationA11y,
  useA11yId,
  announceToScreenReader,
  keyboardHandlers,
  KEYS,
} from "../../utils/a11y";
import { useKeyboardNavigation } from "../../utils/a11yHooks";

// Helper components
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="glass-inline-glass-flex glass-items-center glass-justify-center glass-min-w-18px glass-h-18px glass-px-1.5 glass-text-xs glass-font-semibold glass-text-primary glass-surface-blue glass-radius-full">
    {children}
  </span>
);

const Icon = ({ name, size = 24 }: { name: string; size?: number }) => (
  <span style={{ fontSize: size }} aria-hidden="true">
    🔹
  </span>
);

const Tooltip = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => <div title={title}>{children}</div>;

// Simple animation hook for indicator position
const INITIAL_INDICATOR_STYLE = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  opacity: 0,
};

const useIndicatorAnimation = (_prefersReducedMotion: boolean) => {
  const [indicatorStyle, setIndicatorStyle] = useState(INITIAL_INDICATOR_STYLE);

  const animateIndicator = useCallback(
    (nextStyle: typeof INITIAL_INDICATOR_STYLE) => {
      setIndicatorStyle((prev) => {
        if (
          prev.left === nextStyle.left &&
          prev.top === nextStyle.top &&
          prev.width === nextStyle.width &&
          prev.height === nextStyle.height &&
          prev.opacity === nextStyle.opacity
        ) {
          return prev;
        }
        return nextStyle;
      });
    },
    []
  );

  return { indicatorStyle, animateIndicator };
};

import { GlassNavigationProps, NavigationItem } from "./types";

// Navigation component with glass styling

// Remove styled components

/**
 * A glass-styled navigation component with various layout options
 */
export const GlassNavigation = forwardRef<HTMLDivElement, GlassNavigationProps>(
  (
    {
      items = [],
      activeItem,
      onItemClick,
      onMenuToggle,
      position = "top",
      variant = "standard",
      className,
      style,
      logo,
      actions,
      showDivider = false,
      glassIntensity = 0.7,
      sticky = false,
      maxWidth,
      compact = false,
      centered = false,
      zIndex = 100,
      width,
      initialExpandedItems = [],
      collapsible = false,
      initialCollapsed = false,
      ...rest
    }: GlassNavigationProps,
    ref: ForwardedRef<HTMLDivElement>
  ): React.ReactElement | null => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedItems, setExpandedItems] =
      useState<string[]>(initialExpandedItems);
    const [collapsed, setCollapsed] = useState(initialCollapsed);
    const prefersReducedMotion = useReducedMotion();
    const navItemsRef = useRef<HTMLUListElement>(null);
    const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
    const { defaultSpring } = useAnimationContext();

    // Enhanced keyboard navigation with accessibility
    const navigationItems = items
      .filter((item: any) => !item.disabled)
      .map((item: any) => ({
        id: item.id || item.key,
        disabled: item.disabled,
      }));

    const {
      focusedIndex,
      selectedIds,
      handleKeyDown: handleNavKeyDown,
      registerItem,
      focusItem,
    } = useKeyboardNavigation({
      items: navigationItems,
      orientation:
        position === "left" || position === "right" ? "vertical" : "horizontal",
      loop: true,
      homeEndKeys: true,
      onActivate: (id) => {
        const item = items.find((item) => (item.id || item.key) === id);
        if (item) {
          handleItemClick(id, item);
        }
      },
    });

    const navId = useA11yId("glass-navigation");

    const finalChildAnimationConfig = useMemo(() => {
      const baseFallback: SpringConfig = SpringPresets.default;
      let resolvedConfig: SpringConfig;

      if (typeof defaultSpring === "object" && defaultSpring !== null) {
        resolvedConfig = { ...baseFallback, ...defaultSpring };
      } else if (
        typeof defaultSpring === "string" &&
        defaultSpring in SpringPresets
      ) {
        resolvedConfig =
          SpringPresets?.[defaultSpring as keyof typeof SpringPresets];
      } else {
        resolvedConfig = baseFallback;
      }

      return resolvedConfig;
    }, [defaultSpring]);

    const disableChildAnimation = useMemo(() => {
      return prefersReducedMotion;
    }, [prefersReducedMotion]);

    const { indicatorStyle, animateIndicator } =
      useIndicatorAnimation(prefersReducedMotion);

    useEffect(() => {
      if (disableChildAnimation) {
        animateIndicator(INITIAL_INDICATOR_STYLE);
        return;
      }

      const activeElement = activeItem ? itemRefs.current?.[activeItem] : null;
      const containerElement = navItemsRef.current;

      if (activeElement && containerElement) {
        const itemRect = activeElement.getBoundingClientRect();
        const containerRect = containerElement.getBoundingClientRect();

        let newStyle: typeof indicatorStyle;
        if (position === "left" || position === "right") {
          newStyle = {
            left: position === "left" ? 0 : containerRect.width - 3,
            top: itemRect.top - containerRect.top,
            width: 3,
            height: itemRect.height,
            opacity: 1,
          };
        } else {
          newStyle = {
            left: itemRect.left - containerRect.left,
            top: position === "top" ? containerRect.height - 3 : 0,
            width: itemRect.width,
            height: 3,
            opacity: 1,
          };
        }
        animateIndicator(newStyle);
      } else {
        animateIndicator(INITIAL_INDICATOR_STYLE);
      }
    }, [
      activeItem,
      position,
      collapsed,
      disableChildAnimation,
      animateIndicator,
    ]);

    const toggleMobileMenu = useCallback(() => {
      const newState = !mobileMenuOpen;
      setMobileMenuOpen(newState);
      if (onMenuToggle) {
        onMenuToggle(newState);
      }
    }, [mobileMenuOpen, onMenuToggle]);

    const handleItemClick = useCallback(
      (id: string, item: NavigationItem) => {
        if (item?.onClick) {
          item?.onClick();
        }

        if (onItemClick) {
          onItemClick(item);
        }

        if (item?.children && item?.children.length > 0) {
          setExpandedItems((prev: any) =>
            prev.includes(id)
              ? prev.filter((itemId: any) => itemId !== id)
              : [...prev, id]
          );
        }

        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
          if (onMenuToggle) {
            onMenuToggle(false);
          }
        }
      },
      [onItemClick, mobileMenuOpen, onMenuToggle]
    );

    const toggleCollapsed = useCallback(() => {
      setCollapsed((prev: boolean) => !prev);
    }, []);

    // Navigation positioning and styling classes
    const getPositionClasses = (position: GlassNavigationProps["position"]) => {
      const base = "flex items-center box-border";
      switch (position) {
        case "left":
        case "right":
          return cn(base, "flex-col h-full");
        default:
          return cn(base, "flex-row w-full");
      }
    };

    const getPositionStyles = (position: GlassNavigationProps["position"]) => {
      switch (position) {
        case "left":
          return { left: 0, height: "100vh" };
        case "right":
          return { right: 0, height: "100vh" };
        case "bottom":
          return { bottom: 0, width: "100%" };
        case "top":
        default:
          return { top: 0, width: "100%" };
      }
    };

    const renderNavItem = useCallback(
      (item: NavigationItem, level = 0): ReactNode => {
        const itemId = item?.id || item?.key;
        const isActive = Boolean(activeItem === item?.id || item?.active);
        const hasChildren = item?.children && item?.children.length > 0;
        const isExpanded = itemId ? expandedItems.includes(itemId) : false;

        const assignRef = (el: HTMLLIElement | null) => {
          if (item?.id) {
            if (itemRefs.current) itemRefs.current[item?.id] = el;
          }
        };

        if (item?.customElement) {
          return (
            <li
              ref={assignRef}
              key={item?.id || item?.key}
              className={cn("relative z-10", item?.className)}
            >
              {item?.customElement}
            </li>
          );
        }

        const content = (
          <>
            {item?.icon && (
              <span className="nav-item-icon" aria-hidden="true">
                {item?.icon}
              </span>
            )}

            {(!collapsed || level > 0) && (
              <span className="nav-item-label">{item?.label}</span>
            )}

            {item?.badge && <Badge>{String(item?.badge)}</Badge>}

            {hasChildren && !collapsed && (
              <span className="nav-item-expand-icon" aria-hidden="true">
                <Icon name={isExpanded ? "expand_less" : "expand_more"} />
              </span>
            )}
          </>
        );

        const itemClasses = cn(
          "flex items-center glass-gap-2 text-decoration-none border-none bg-transparent cursor-pointer transition-all duration-200",
          "glass-radius-md border-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
          "glass-focus glass-touch-target glass-contrast-guard",
          {
            "glass-px-2 glass-py-1.5 glass-text-sm": variant === "minimal",
            "glass-px-4 glass-py-2.5 glass-text-base": variant !== "minimal",
            "text-blue-200 font-semibold bg-blue-500/15": isActive,
            "glass-text-secondary font-normal hover:bg-white/10": !isActive,
            "opacity-50 pointer-events-none": item?.disabled,
            "active:scale-[0.98]": !item?.disabled,
          }
        );

        // Create accessibility attributes for navigation items
        const itemA11yProps = createNavigationA11y({
          id: itemId,
          current: isActive ? "page" : undefined,
          expanded: hasChildren ? isExpanded : undefined,
          controls: hasChildren ? `${itemId}-submenu` : undefined,
          posinset:
            level === 0
              ? items.findIndex((i) => i.id === item?.id) + 1
              : undefined,
          setsize: level === 0 ? items.length : undefined,
        });

        const navItem = item?.href ? (
          <a
            href={item?.href}
            target={item?.external ? "_blank" : undefined}
            rel={item?.external ? "noopener noreferrer" : undefined}
            className={itemClasses}
            onClick={(e) => {
              if (item?.disabled) {
                e.preventDefault();
                return;
              }
              handleItemClick(item?.id || item?.key, item);
            }}
            onKeyDown={handleNavKeyDown}
            {...itemA11yProps}
            aria-disabled={item?.disabled}
            ref={(el) => {
              registerItem(item?.id || item?.key, el);
              assignRef(el as any);
            }}
          >
            {content}
          </a>
        ) : (
          <button
            type="button"
            className={itemClasses}
            onClick={(e) => handleItemClick(item?.id || item?.key, item)}
            onKeyDown={handleNavKeyDown}
            disabled={item?.disabled}
            {...itemA11yProps}
            ref={(el) => {
              registerItem(item?.id || item?.key, el);
              assignRef(el as any);
            }}
          >
            {content}
          </button>
        );

        return (
          <li
            ref={assignRef}
            key={itemId}
            className={cn(
              "relative z-10",
              (position === "top" || position === "bottom") && "flex-none",
              item?.className
            )}
          >
            {item?.tooltip && !collapsed ? (
              <Tooltip title={item?.tooltip}>{navItem}</Tooltip>
            ) : collapsed && level === 0 ? (
              <Tooltip title={item?.label}>{navItem}</Tooltip>
            ) : (
              navItem
            )}

            {hasChildren && (
              <ul
                id={`${itemId}-submenu`}
                aria-hidden={!isExpanded || collapsed}
                className={cn(
                  "list-none m-0 glass-p-2 glass-mt-1 glass-radius-md bg-white/5 overflow-hidden transition-all duration-300",
                  {
                    "opacity-100 max-glass-h-500px visible":
                      isExpanded && !collapsed,
                    "opacity-0 max-h-0 invisible": !isExpanded || collapsed,
                  }
                )}
                style={
                  !isExpanded || collapsed ? { display: "none" } : undefined
                }
              >
                {item?.children?.map((child: any) =>
                  renderNavItem(child, level + 1)
                )}
              </ul>
            )}
          </li>
        );
      },
      [activeItem, expandedItems, collapsed, variant, handleItemClick]
    );

    // Determine glass elevation based on variant
    const glassElevation = variant === "minimal" ? "level1" : "level2";
    const glassTier = variant === "minimal" ? "low" : "medium";

    return (
      <nav>
        <OptimizedGlass
          ref={ref as React.RefObject<HTMLDivElement>}
          intent="neutral"
          elevation={glassElevation}
          tier={glassTier}
          intensity="medium"
          depth={variant === "prominent" ? 3 : 2}
          tint="neutral"
          border="subtle"
          animation={prefersReducedMotion ? "none" : "gentle"}
          performanceMode="medium"
          id={navId}
          role="navigation"
          aria-label="Main navigation"
          onKeyDown={handleNavKeyDown}
          className={cn(
            // Base navigation styles
            getPositionClasses(position),
            {
              "justify-center": centered,
              "justify-between": !centered,
              "glass-p-2 glass-px-4": compact,
              "glass-p-3 glass-px-6": !compact,
              "sticky top-0": sticky,
            },
            // Position-specific styling
            position === "left" || position === "right" ? "w-60" : "w-full",
            position === "left" || position === "right" ? "h-screen" : "h-auto",
            // Mobile responsive
            "md:glass-p-2 md:glass-px-4",
            className
          )}
          style={{
            ...getPositionStyles(position),
            ...style,
            zIndex,
            width: width
              ? typeof width === "number"
                ? `${width}px`
                : width
              : position === "left" || position === "right"
                ? "240px"
                : "100%",
            maxWidth: maxWidth
              ? typeof maxWidth === "number"
                ? `${maxWidth}px`
                : maxWidth
              : undefined,
          }}
          {...rest}
        >
          {/* Mobile menu toggle */}
          <button
            onClick={toggleMobileMenu}
            className={cn(
              "hidden md:hidden lg:hidden",
              "bg-transparent border-none cursor-pointer glass-p-2 text-inherit",
              "flex items-center justify-center",
              "glass-focus glass-touch-target glass-contrast-guard",
              "max-md:flex"
            )}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <Icon name={mobileMenuOpen ? "close" : "menu"} />
          </button>

          {/* Logo container */}
          {logo && (
            <div
              className={cn("flex items-center", {
                "justify-center w-full glass-p-4":
                  position === "left" || position === "right",
              })}
            >
              {logo}
            </div>
          )}

          {/* Navigation items container */}
          <ul
            ref={navItemsRef}
            className={cn(
              "flex list-none m-0 glass-p-0 flex-1 items-center relative",
              {
                "flex-col glass-gap-4":
                  position === "left" || position === "right",
                "flex-row flex-wrap glass-gap-3":
                  position === "top" || position === "bottom",
                "glass-gap-3": variant === "minimal",
                "mt-6 w-full": position === "left" || position === "right",
                "mobile-open": mobileMenuOpen,
              }
            )}
            role="menubar"
            aria-orientation={
              position === "left" || position === "right"
                ? "vertical"
                : "horizontal"
            }
          >
            {/* Active indicator */}
            {!prefersReducedMotion && (
              <div
                className="glass-absolute glass-surface-blue glass-radius-sm glass-z-0 glass-pointer-events-none glass-transition-all glass-duration-300 glass-ease-out"
                style={{
                  left: `${indicatorStyle.left}px`,
                  top: `${indicatorStyle.top}px`,
                  width: `${indicatorStyle.width}px`,
                  height: `${indicatorStyle.height}px`,
                  opacity: indicatorStyle.opacity,
                }}
              />
            )}

            {/* Navigation items */}
            {items.map((item: any) => renderNavItem(item))}
          </ul>

          {/* Divider */}
          {showDivider && (
            <div
              className={cn("bg-white/20", {
                "w-4/5 h-px my-3 mx-auto":
                  position === "left" || position === "right",
                "w-px h-6 mx-3": position === "top" || position === "bottom",
              })}
            />
          )}

          {/* Actions container */}
          {actions && (
            <div className="glass-flex glass-items-center glass-gap-3">
              {actions}
            </div>
          )}

          {/* Collapsible button */}
          {collapsible && (position === "left" || position === "right") && (
            <button
              onClick={toggleCollapsed}
              title={collapsed ? "Expand" : "Collapse"}
              aria-label={
                collapsed ? "Expand navigation" : "Collapse navigation"
              }
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-6 h-6 glass-radius-full",
                "flex items-center justify-center cursor-pointer",
                "bg-white/10 border border-white/20 transition-all duration-200",
                "glass-focus glass-touch-target glass-contrast-guard",
                "hover:bg-white/20",
                {
                  "-right-3": !collapsed,
                  "-left-3": collapsed,
                }
              )}
            >
              <Icon
                name={
                  position === "left"
                    ? collapsed
                      ? "chevron_right"
                      : "chevron_left"
                    : collapsed
                      ? "chevron_left"
                      : "chevron_right"
                }
              />
            </button>
          )}
        </OptimizedGlass>
      </nav>
    );
  }
);

GlassNavigation.displayName = "GlassNavigation";
