'use client';
import { cn } from "../../lib/utilsComprehensive";
import React, { forwardRef, useEffect, useState } from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";
import { GlassContainer } from "./GlassContainer";
import { VStack } from "./GlassStack";
import { useA11yId } from "@/utils/a11y";
import { useMotionPreferenceContext } from "@/contexts/MotionPreferenceContext";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface GlassAppShellProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * App shell variant
   */
  variant?: "default" | "floating" | "minimal";
  /**
   * Header component
   */
  header?: React.ReactNode;
  /**
   * Sidebar component
   */
  sidebar?: React.ReactNode;
  /**
   * Footer component
   */
  footer?: React.ReactNode;
  /**
   * Whether sidebar is collapsible
   */
  collapsible?: boolean;
  /**
   * Whether sidebar is collapsed by default
   */
  defaultCollapsed?: boolean;
  /**
   * Sidebar width
   */
  sidebarWidth?: "sm" | "md" | "lg";
  /**
   * Whether to show sidebar on mobile as overlay
   */
  mobileOverlay?: boolean;
  /**
   * Mobile breakpoint
   */
  mobileBreakpoint?: number;
  /**
   * Page padding
   */
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  /**
   * Content max width
   */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /**
   * Whether content should be centered
   */
  centered?: boolean;
  /**
   * Glass elevation for main content
   */
  contentElevation?: 0 | 1 | 2 | 3 | 4;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Loading component
   */
  loadingComponent?: React.ReactNode;
  /**
   * Page transition animation
   */
  pageTransition?: boolean;
  /**
   * Whether to respect user's motion preferences
   */
  respectMotionPreference?: boolean;
  /**
   * Accessibility label for the main application shell
   */
  "aria-label"?: string;
  /**
   * Accessibility role for the shell
   */
  role?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  /**
   * Page title
   */
  title: string;
  /**
   * Page description
   */
  description?: string;
  /**
   * Breadcrumb navigation - can be an array of breadcrumb items or any React node
   */
  breadcrumb?: BreadcrumbItem[] | React.ReactNode;
  /**
   * Page actions
   */
  actions?: React.ReactNode;
  /**
   * Header variant
   */
  variant?: "default" | "centered" | "minimal";
  className?: string;
}

export interface ContentSectionProps {
  /**
   * Section title
   */
  title?: string;
  /**
   * Section description
   */
  description?: string;
  /**
   * Section actions
   */
  actions?: React.ReactNode;
  /**
   * Section content
   */
  children: React.ReactNode;
  /**
   * Section variant
   */
  variant?: "default" | "card" | "minimal";
  /**
   * Glass elevation (for card variant)
   */
  elevation?: 0 | 1 | 2 | 3 | 4;
  /**
   * Whether to respect user's motion preferences
   */
  respectMotionPreference?: boolean;
  /**
   * Section ID for accessibility
   */
  id?: string;
  className?: string;
}

/**
 * GlassAppShell component
 * Modern application shell with glassmorphism design
 */
export const GlassAppShell = forwardRef<HTMLDivElement, GlassAppShellProps>(
  (
    {
      // TODO: Integrate ContrastGuard for any section titles, labels, and helper text for WCAG AA compliance

      variant = "default",
      header,
      sidebar,
      footer,
      collapsible = true,
      defaultCollapsed = false,
      sidebarWidth = "md",
      mobileOverlay = true,
      mobileBreakpoint = 1024,
      padding = "lg",
      maxWidth = "full",
      centered = false,
      contentElevation = 0,
      loading = false,
      loadingComponent,
      pageTransition = true,
      respectMotionPreference = true,
      "aria-label": ariaLabel = "Application shell",
      role = "application",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(defaultCollapsed);
    const [sidebarOverlay, setSidebarOverlay] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const shellId = useA11yId();
    const { prefersReducedMotion, isMotionSafe } = useMotionPreferenceContext();
    const shouldRespectMotion =
      respectMotionPreference && !prefersReducedMotion;

    // Handle responsive behavior
    useEffect(() => {
      const checkScreenSize = () => {
        const mobile = window.innerWidth < mobileBreakpoint;
        setIsMobile(mobile);
        if (mobile && mobileOverlay) {
          setSidebarOverlay(false);
        }
      };

      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
      return () => window.removeEventListener("resize", checkScreenSize);
    }, [mobileBreakpoint, mobileOverlay]);

    // Convert numeric elevation to level string
    const getElevationLevel = (
      elev?: 0 | 1 | 2 | 3 | 4
    ): "level1" | "level2" | "level3" | "level4" | "level5" => {
      if (elev === 0) return "level1";
      if (elev === 1) return "level1";
      if (elev === 2) return "level2";
      if (elev === 3) return "level3";
      if (elev === 4) return "level4";
      return "level5"; // max level
    };

    const paddingClasses = {
      none: "glass-p-0",
      sm: "glass-p-4",
      md: "glass-p-6",
      lg: "p-8",
      xl: "glass-p-12",
    };

    const maxWidthClasses = {
      sm: "max-w-sm",
      md: "max-w-4xl",
      lg: "max-w-6xl",
      xl: "max-w-7xl",
      "2xl": "max-w-8xl",
      full: "max-w-full",
    };

    const variantClasses = {
      default: "",
      floating: "glass-p-4",
      minimal: "bg-transparent",
    };

    // Clone sidebar with props (align with GlassSidebar API)
    const sidebarExtraProps: any = {
      collapsed: isMobile ? false : sidebarCollapsed,
      onCollapsedChange: setSidebarCollapsed,
      width: sidebarWidth,
    };
    if (isMobile && mobileOverlay) {
      sidebarExtraProps.variant = "overlay";
      sidebarExtraProps.open = sidebarOverlay;
      sidebarExtraProps.onOpenChange = setSidebarOverlay;
    }
    const sidebarElement = sidebar
      ? React.cloneElement(sidebar as React.ReactElement, sidebarExtraProps)
      : null;

    // Clone header with props (align with GlassHeader API)
    const headerElement = header
      ? React.cloneElement(
          header as React.ReactElement,
          {
            mobileMenuOpen: Boolean(
              isMobile && mobileOverlay && sidebarOverlay
            ),
            onMobileMenuToggle: () => setSidebarOverlay((v) => !v),
          } as any
        )
      : null;

    return (
      <div
        ref={ref}
        id={shellId}
        role={role}
        aria-label={ariaLabel}
        className={cn(
          "flex h-screen overflow-hidden",
          "bg-gradient-to-br from-background via-background/95 to-surface/50",
          // Motion preferences
          shouldRespectMotion &&
            "motion-safe:transition-all motion-reduce:transition-none",
          variantClasses?.[variant],
          className
        )}
        {...props}
      >
        {/* Sidebar */}
        {sidebarElement}

        {/* Main content area */}
        <div className='glass-flex glass-flex-col glass-flex-1 overflow-hidden'>
          {/* Header */}
          {headerElement}

          {/* Main content */}
          <main
            role="main"
            aria-label="Main content"
            className={cn(
              "flex-1 overflow-auto",
              "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/30",
              "hover:scrollbar-thumb-border/50",
              // Motion preferences
              shouldRespectMotion &&
                "motion-safe:transition-all motion-reduce:transition-none"
            )}
          >
            {loading && loadingComponent ? (
              <div className="glass-flex glass-items-center glass-justify-center glass-h-full">
                {loadingComponent}
              </div>
            ) : (
              <GlassContainer
                size={maxWidth}
                centered={centered}
                padding={padding}
                glass={contentElevation > 0}
                elevation={contentElevation}
                radius={variant === "floating" ? "lg" : "none"}
                className={cn(
                  "min-h-full",
                  variant === "floating" && "glass-my-4"
                )}
              >
                {pageTransition && shouldRespectMotion ? (
                  <Motion preset="fadeIn" className="glass-h-full">
                    {children}
                  </Motion>
                ) : (
                  children
                )}
              </GlassContainer>
            )}
          </main>

          {/* Footer */}
          {footer && (
            <footer
              role="contentinfo"
              className={cn(
                "flex-shrink-0 border-t border-border/20",
                // Motion preferences
                shouldRespectMotion &&
                  "motion-safe:transition-all motion-reduce:transition-none"
              )}
            >
              {footer}
            </footer>
          )}
        </div>
      </div>
    );
  }
);

GlassAppShell.displayName = "GlassAppShell";

/**
 * PageHeader component
 * Consistent page header with title, description, and actions
 */
export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  (
    {
      title,
      description,
      breadcrumb,
      actions,
      variant = "default",
      className,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: "text-left",
      centered: "text-center",
      minimal: "text-left border-none pb-4",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "glass-gap-4 pb-8 border-b border-border/20",
          variantClasses?.[variant],
          className
        )}
        {...props}
      >
        {/* Breadcrumb */}
        {breadcrumb && (
          <div className="glass-text-sm glass-text-secondary">
            {Array.isArray(breadcrumb) ? (
              <nav aria-label="Breadcrumb">
                <ol className="glass-flex glass-items-center glass-gap-2">
                  {breadcrumb.map((item, index) => {
                    const isLast = index === breadcrumb.length - 1;
                    return (
                      <li key={index} className="glass-flex glass-items-center">
                        {index > 0 && <span className="glass-mx-2">/</span>}
                        {item?.href && !isLast ? (
                          <a
                            href={item?.href}
                            className='hover:text-primary transition-colors glass-focus glass-touch-target glass-contrast-guard'
                          >
                            {item?.label}
                          </a>
                        ) : (
                          <span
                            className={
                              isLast ? "text-foreground font-medium" : ""
                            }
                          >
                            {item?.label}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>
            ) : (
              breadcrumb
            )}
          </div>
        )}

        {/* Title section */}
        <div
          className={cn(
            "flex glass-gap-4",
            variant === "centered"
              ? "flex-col items-center"
              : "flex-col sm:flex-row sm:items-center sm:justify-between"
          )}
        >
          <div className="glass-gap-2">
            <h1 className='glass-text-3xl font-bold text-primary'>{title}</h1>
            {description && (
              <p
                className={cn(
                  "glass-text-lg glass-text-secondary",
                  variant === "centered" ? "max-w-2xl" : "max-w-3xl"
                )}
              >
                {description}
              </p>
            )}
          </div>

          {/* Actions */}
          {actions && <div className="glass-flex-shrink-0">{actions}</div>}
        </div>
      </div>
    );
  }
);

PageHeader.displayName = "PageHeader";

/**
 * ContentSection component
 * Reusable content section with optional glassmorphism
 */
export const ContentSection = forwardRef<HTMLDivElement, ContentSectionProps>(
  (
    {
      title,
      description,
      actions,
      children,
      variant = "default",
      elevation = "level1",
      respectMotionPreference = true,
      id,
      className,
      ...props
    },
    ref
  ) => {
    const sectionId = useA11yId();
    const { prefersReducedMotion, isMotionSafe } = useMotionPreferenceContext();
    const shouldRespectMotion =
      respectMotionPreference && !prefersReducedMotion;

    const content = (
      <VStack space="lg" className="glass-w-full">
        {/* Section header */}
        {(title || description || actions) && (
          <div className='glass-flex glass-flex-col sm:flex-row sm:items-center sm:justify-between glass-gap-4'>
            <div className="glass-gap-1">
              {title && (
                <h2
                  id={`${id || sectionId}-title`}
                  className='glass-text-xl font-semibold text-primary'
                >
                  {title}
                </h2>
              )}
              {description && (
                <p className="glass-text-secondary">{description}</p>
              )}
            </div>

            {actions && <div className="glass-flex-shrink-0">{actions}</div>}
          </div>
        )}

        {/* Section content */}
        <div className="glass-w-full">{children}</div>
      </VStack>
    );

    if (variant === "card") {
      return (
        <OptimizedGlass
          variant="frosted"
          elevation={
            typeof elevation === "number"
              ? (`level${Math.min(5, Math.max(1, elevation + 1))}` as
                  | "level1"
                  | "level2"
                  | "level3"
                  | "level4"
                  | "level5")
              : "level1"
          }
          intensity="medium"
          depth={2}
          tint="neutral"
          border="subtle"
          animation={shouldRespectMotion ? "shimmer" : "none"}
          performanceMode="medium"
          ref={ref}
          id={id || sectionId}
          role="region"
          aria-labelledby={title ? `${id || sectionId}-title` : undefined}
          className={cn(
            "glass-p-6 w-full",
            // Motion preferences
            shouldRespectMotion &&
              "motion-safe:transition-all motion-reduce:transition-none",
            className
          )}
          {...props}
        >
          {content}
        </OptimizedGlass>
      );
    }

    return (
      <section
        ref={ref}
        id={id || sectionId}
        role="region"
        aria-labelledby={title ? `${id || sectionId}-title` : undefined}
        className={cn(
          "w-full",
          // Motion preferences
          shouldRespectMotion &&
            "motion-safe:transition-all motion-reduce:transition-none",
          className
        )}
        {...props}
      >
        {content}
      </section>
    );
  }
);

ContentSection.displayName = "ContentSection";