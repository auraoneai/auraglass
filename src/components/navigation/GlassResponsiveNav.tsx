"use client";
import React, { forwardRef, useState, useEffect } from "react";
import {
  GlassMobileNav,
  MobileNavItem,
  MobileNavSection,
} from "./GlassMobileNav";
import { GlassBottomNav, BottomNavItem } from "./GlassBottomNav";
import { cn } from "../../lib/utilsComprehensive";
import { useA11yId } from "@/utils/a11y";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface ResponsiveNavConfig {
  /**
   * Mobile breakpoint (px)
   */
  mobileBreakpoint?: number;
  /**
   * Tablet breakpoint (px)
   */
  tabletBreakpoint?: number;
  /**
   * Navigation behavior on mobile
   */
  mobileNavType?: "drawer" | "bottom" | "both";
  /**
   * Navigation behavior on tablet
   */
  tabletNavType?: "drawer" | "bottom" | "sidebar";
}

export interface GlassResponsiveNavProps {
  /**
   * Responsive configuration
   */
  config?: ResponsiveNavConfig;
  /**
   * Whether mobile nav is open
   */
  mobileNavOpen?: boolean;
  /**
   * Mobile nav open state change handler
   */
  onMobileNavOpenChange?: (open: boolean) => void;
  /**
   * Navigation sections (for drawer/sidebar)
   */
  navigation?: MobileNavSection[];
  /**
   * Bottom navigation items
   */
  bottomNavItems?: BottomNavItem[];
  /**
   * Current active path
   */
  activePath?: string;
  /**
   * Active bottom nav item ID
   */
  activeBottomNavId?: string;
  /**
   * Bottom nav active change handler
   */
  onBottomNavActiveChange?: (id: string) => void;
  /**
   * Path matcher function
   */
  isActive?: (href: string, activePath: string) => boolean;
  /**
   * Logo/brand component
   */
  logo?: React.ReactNode;
  /**
   * Navigation title
   */
  title?: string;
  /**
   * Footer content for mobile nav
   */
  footer?: React.ReactNode;
  /**
   * Glass elevation
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | "float" | "modal";
  /**
   * Custom classes
   */
  className?: string;
  /**
   * Children content
   */
  children?: React.ReactNode;
  /**
   * Whether to respect motion preferences for animations
   */
  respectMotionPreference?: boolean;
  /**
   * ARIA label for the navigation
   */
  "aria-label"?: string;
}

/**
 * GlassResponsiveNav component
 * Adaptive navigation that switches between mobile drawer and bottom nav based on screen size
 */
export const GlassResponsiveNav = forwardRef<
  HTMLDivElement,
  GlassResponsiveNavProps
>(
  (
    {
      config = {},
      mobileNavOpen = false,
      onMobileNavOpenChange,
      navigation = [],
      bottomNavItems = [],
      activePath = "",
      activeBottomNavId,
      onBottomNavActiveChange,
      isActive,
      logo,
      title,
      footer,
      elevation = "level2",
      respectMotionPreference = true,
      className,
      children,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    // Accessibility and motion preferences
    const navId = useA11yId("responsive-nav");
    const prefersReducedMotion = useReducedMotion();
    const shouldReduceMotion = respectMotionPreference && prefersReducedMotion;
    const {
      mobileBreakpoint = 768,
      tabletBreakpoint = 1024,
      mobileNavType = "both",
      tabletNavType = "sidebar",
    } = config;

    const [screenSize, setScreenSize] = useState<
      "mobile" | "tablet" | "desktop"
    >("desktop");

    // Handle responsive behavior
    useEffect(() => {
      const checkScreenSize = () => {
        const width = window.innerWidth;
        if (width < mobileBreakpoint) {
          setScreenSize("mobile");
        } else if (width < tabletBreakpoint) {
          setScreenSize("tablet");
        } else {
          setScreenSize("desktop");
        }
      };

      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
      return () => window.removeEventListener("resize", checkScreenSize);
    }, [mobileBreakpoint, tabletBreakpoint]);

    // Determine which navigation to show
    const shouldShowMobileNav = () => {
      if (screenSize === "mobile") {
        return mobileNavType === "drawer" || mobileNavType === "both";
      }
      if (screenSize === "tablet") {
        return tabletNavType === "drawer";
      }
      return false;
    };

    const shouldShowBottomNav = () => {
      if (screenSize === "mobile") {
        return mobileNavType === "bottom" || mobileNavType === "both";
      }
      if (screenSize === "tablet") {
        return tabletNavType === "bottom";
      }
      return false;
    };

    const desktopItems = navigation.flatMap((section) => section.items ?? []);
    const shouldShowDesktopNav =
      screenSize === "desktop" &&
      !children &&
      (desktopItems.length > 0 || bottomNavItems.length > 0);
    const renderedDesktopItems =
      desktopItems.length > 0
        ? desktopItems
        : bottomNavItems.map((item) => ({
            id: item.id,
            label: item.label,
            icon: item.icon,
            href: "#",
          }));

    return (
      <div
        ref={ref}
        className={cn("glass-relative glass-w-full", className)}
        id={navId}
        role="navigation"
        aria-label={ariaLabel || "Responsive navigation"}
      >
        {/* Mobile/Drawer Navigation */}
        {shouldShowMobileNav() && (
          <GlassMobileNav
            open={mobileNavOpen}
            onOpenChange={onMobileNavOpenChange}
            navigation={navigation}
            activePath={activePath}
            isActive={isActive}
            logo={logo}
            title={title}
            footer={footer}
            elevation={elevation as 0 | 1 | 2 | 3 | 4 | "float" | "modal"}
          />
        )}

        {/* Bottom Navigation */}
        {shouldShowBottomNav() && bottomNavItems.length > 0 && (
          <GlassBottomNav
            items={bottomNavItems}
            activeId={activeBottomNavId}
            onActiveChange={onBottomNavActiveChange}
            elevation={elevation as 0 | 1 | 2 | 3 | 4 | "float" | "modal"}
            variant="default"
            className="glass-z-40"
          />
        )}

        {shouldShowDesktopNav && (
          <div
            className="glass-flex glass-max-w-full glass-min-w-0 glass-flex-wrap glass-items-center glass-justify-center glass-gap-2 glass-overflow-hidden glass-p-2 glass-radius-xl glass-border glass-surface-overlay"
            style={{ maxWidth: "100%" }}
          >
            {logo && (
              <div className="glass-flex glass-min-w-0 glass-items-center">
                {logo}
              </div>
            )}
            {title && (
              <div className="glass-min-w-0 glass-truncate glass-text-sm glass-font-semibold glass-text-primary">
                {title}
              </div>
            )}
            {renderedDesktopItems.map((item) => {
              const active =
                "href" in item && typeof item.href === "string"
                  ? (isActive?.(item.href, activePath) ??
                    item.href === activePath)
                  : item.id === activeBottomNavId;

              return (
                <a
                  key={item.id}
                  href={"href" in item && item.href ? item.href : "#"}
                  className={cn(
                    "glass-flex glass-min-w-0 glass-items-center glass-gap-2 glass-radius-lg glass-px-2 glass-py-1.5 glass-text-sm glass-transition-all",
                    active
                      ? "glass-surface-primary glass-text-primary"
                      : "glass-text-primary-opacity-80"
                  )}
                  style={{
                    maxWidth: "8rem",
                    transition:
                      "background-color var(--glass-motion-duration-fast, 160ms) var(--glass-motion-easing-standard, ease), color var(--glass-motion-duration-fast, 160ms) var(--glass-motion-easing-standard, ease)",
                  }}
                  aria-current={active ? "page" : undefined}
                >
                  {item.icon && (
                    <span className="glass-flex glass-items-center glass-justify-center glass-w-4 glass-h-4">
                      {item.icon}
                    </span>
                  )}
                  <span className="glass-truncate">{item.label}</span>
                </a>
              );
            })}
            {footer && <div style={{ marginLeft: "auto" }}>{footer}</div>}
          </div>
        )}

        {/* Custom content */}
        {children}
      </div>
    );
  }
);

GlassResponsiveNav.displayName = "GlassResponsiveNav";
