import { cn } from "../../lib/utilsComprehensive";
import React, { forwardRef } from "react";
import { OptimizedGlass } from "../../primitives";
import { useA11yId } from "@/utils/a11y";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface GlassBreadcrumbProps
  extends React.HTMLAttributes<HTMLElement> {
  /**
   * Breadcrumb separator
   */
  separator?: React.ReactNode;
  /**
   * Breadcrumb items
   */
  children: React.ReactNode;
  /**
   * Maximum items to show
   */
  maxItems?: number;
  /**
   * Show ellipsis for collapsed items
   */
  showEllipsis?: boolean;
  /**
   * Custom ellipsis component
   */
  ellipsisComponent?: React.ReactNode;
  /**
   * Glass elevation
   */
  elevation?: "level1" | "level2" | "level3" | "level4";
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg";
  /**
   * Whether to respect motion preferences for animations
   */
  respectMotionPreference?: boolean;
}

export interface GlassBreadcrumbItemProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Whether this is the current page
   */
  isCurrentPage?: boolean;
  /**
   * Item content
   */
  children: React.ReactNode;
  /**
   * Whether to respect motion preferences for animations
   */
  respectMotionPreference?: boolean;
}

export interface GlassBreadcrumbSeparatorProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Custom separator content
   */
  children?: React.ReactNode;
}

export interface GlassBreadcrumbLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Link content
   */
  children: React.ReactNode;
  /**
   * Link href
   */
  href?: string;
  /**
   * Whether this is the current page
   */
  isCurrentPage?: boolean;
  /**
   * Whether to respect motion preferences for animations
   */
  respectMotionPreference?: boolean;
}

/**
 * GlassBreadcrumb component
 * A glassmorphism breadcrumb navigation component
 */
export const GlassBreadcrumb = forwardRef<HTMLElement, GlassBreadcrumbProps>(
  (
    {
      separator = "/",
      children,
      maxItems,
      showEllipsis = true,
      ellipsisComponent = "...",
      elevation = "level1",
      size = "md",
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    // Accessibility and motion preferences
    const navId = useA11yId("breadcrumb");
    const prefersReducedMotion = useReducedMotion();
    const shouldReduceMotion = respectMotionPreference && prefersReducedMotion;
    const childArray = React.Children.toArray(children);
    let itemsToRender = childArray;

    // Handle max items with ellipsis
    if (maxItems && (childArray?.length || 0) > maxItems) {
      const startItems = childArray.slice(0, Math.ceil(maxItems / 2));
      const endItems = childArray.slice(-Math.floor(maxItems / 2));
      itemsToRender = [
        ...startItems,
        ...(showEllipsis ? [ellipsisComponent] : []),
        ...endItems,
      ].filter(
        (item): item is React.ReactElement =>
          React.isValidElement(item) ||
          typeof item === "string" ||
          typeof item === "number"
      );
    }

    const sizeClasses = {
      sm: "glass-text-xs",
      md: "glass-text-sm",
      lg: "glass-text-base",
    };

    return (
      <OptimizedGlass
        ref={ref as any}
        elevation={elevation}
        intensity="medium"
        depth={2}
        tint="neutral"
        border="subtle"
        animation={shouldReduceMotion ? "none" : "gentle"}
        performanceMode="medium"
        className={cn(
          "inline-flex items-center glass-px-3 glass-py-1.5 glass-backdrop-blur-md ring-1 ring-white/10 bg-white/5",
          sizeClasses?.[size],
          className
        )}
        {...props}
      >
        <nav aria-label="Breadcrumb" id={navId}>
          <ol className="glass-flex glass-items-center glass-gap-2">
            {itemsToRender.map((item, index) => (
              <li key={index} className="glass-flex glass-items-center">
                {index > 0 && (
                  <span
                    className="glass-mx-2 text-primary/40"
                    aria-hidden="true"
                  >
                    {separator}
                  </span>
                )}
                {item}
              </li>
            ))}
          </ol>
        </nav>
      </OptimizedGlass>
    );
  }
);

GlassBreadcrumb.displayName = "GlassBreadcrumb";

/**
 * GlassBreadcrumbItem component
 * Individual breadcrumb item
 */
export const GlassBreadcrumbItem = forwardRef<
  HTMLSpanElement,
  GlassBreadcrumbItemProps
>(
  (
    {
      isCurrentPage = false,
      children,
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const shouldReduceMotion = respectMotionPreference && prefersReducedMotion;
    return (
      <span
        ref={ref}
        className={cn(
          "glass-text-primary/80 transition-all duration-200",
          !isCurrentPage && !shouldReduceMotion && "hover:-translate-y-0.5",
          isCurrentPage && "glass-text-primary font-medium",
          className
        )}
        aria-current={isCurrentPage ? "page" : undefined}
        {...props}
      >
        {children}
      </span>
    );
  }
);

GlassBreadcrumbItem.displayName = "GlassBreadcrumbItem";

/**
 * GlassBreadcrumbSeparator component
 * Separator between breadcrumb items
 */
export const GlassBreadcrumbSeparator = forwardRef<
  HTMLSpanElement,
  GlassBreadcrumbSeparatorProps
>(({ children = "/", className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn("glass-text-primary/60 glass-mx-2 select-none", className)}
      aria-hidden="true"
      {...props}
    >
      {children}
    </span>
  );
});

GlassBreadcrumbSeparator.displayName = "GlassBreadcrumbSeparator";

/**
 * GlassBreadcrumbLink component
 * Clickable breadcrumb link
 */
export const GlassBreadcrumbLink = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  GlassBreadcrumbLinkProps
>(
  (
    {
      children,
      href,
      isCurrentPage = false,
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const shouldReduceMotion = respectMotionPreference && prefersReducedMotion;
    const linkClasses = cn(
      "glass-text-primary/70 hover:glass-text-primary transition-all duration-200",
      "focus:outline-none glass-pulse-ring",
      "glass-radius-sm glass-px-1 glass-py-0.5 -glass-mx-1 -glass-my-0.5",
      !isCurrentPage && !shouldReduceMotion && "hover:-translate-y-0.5",
      isCurrentPage && "glass-text-primary font-medium cursor-default",
      className
    );

    if (isCurrentPage) {
      return (
        <span className={linkClasses} aria-current="page">
          {children}
        </span>
      );
    }

    if (href) {
      return (
        <a
          ref={ref as React.RefObject<HTMLAnchorElement>}
          href={href}
          className={linkClasses}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.RefObject<HTMLButtonElement>}
        className={linkClasses}
        onClick={props?.onClick as any}
        {...(props as any)}
      >
        {children}
      </button>
    );
  }
);

GlassBreadcrumbLink.displayName = "GlassBreadcrumbLink";

/**
 * Compound Breadcrumb component with built-in structure
 */
export interface GlassBreadcrumbCompoundProps
  extends Omit<GlassBreadcrumbProps, "children"> {
  /**
   * Breadcrumb items
   */
  items: Array<{
    label: string;
    href?: string;
    isCurrentPage?: boolean;
  }>;
}

export const GlassBreadcrumbCompound: React.FC<
  GlassBreadcrumbCompoundProps
> = ({ items, ...props }) => {
  return (
    <GlassBreadcrumb {...props}>
      {items.map((item, index) => (
        <GlassBreadcrumbItem key={index} isCurrentPage={item?.isCurrentPage}>
          <GlassBreadcrumbLink
            href={item?.href}
            isCurrentPage={item?.isCurrentPage}
          >
            {item?.label}
          </GlassBreadcrumbLink>
        </GlassBreadcrumbItem>
      ))}
    </GlassBreadcrumb>
  );
};
