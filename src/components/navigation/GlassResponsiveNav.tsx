'use client';
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

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
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
            className='z-40'
          />
        )}

        {/* Custom content */}
        {children}
      </div>
    );
  }
);

GlassResponsiveNav.displayName = "GlassResponsiveNav";