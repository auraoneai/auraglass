import React from "react";
import { cn } from "@/design-system/utilsCore";

export interface SkipLink {
  id: string;
  label: string;
  href: string;
}

export interface SkipLinksProps {
  /**
   * Array of skip links
   */
  links?: SkipLink[];
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Position of skip links
   */
  position?: "top-left" | "top-center" | "top-right";
  /**
   * Z-index for skip links
   */
  zIndex?: number;
  /**
   * Custom styles for skip links
   */
  styles?: React.CSSProperties;
}

const defaultLinks: SkipLink[] = [
  {
    id: "skip-to-main",
    label: "Skip to main content",
    href: "#main-content",
  },
  {
    id: "skip-to-nav",
    label: "Skip to navigation",
    href: "#main-navigation",
  },
  {
    id: "skip-to-search",
    label: "Skip to search",
    href: "#search",
  },
];

/**
 * SkipLinks component
 * Provides keyboard navigation shortcuts for screen reader users
 */
export function SkipLinks({
  links = defaultLinks,
  className,
  position = "top-left",
  zIndex = 9999,
  styles,
}: SkipLinksProps) {
  const positionClasses = {
    "top-left": "left-4",
    "top-center": "left-1/2 -translate-x-1/2",
    "top-right": "right-4",
  };

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    event.preventDefault();

    // Remove the # from href
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      // Focus the target element
      targetElement.focus();

      // If element can't be focused, add tabindex
      if (document.activeElement !== targetElement) {
        targetElement.setAttribute("tabindex", "-1");
        targetElement.focus();
      }

      // Scroll to element
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <nav
      className={cn(
        "skip-links",
        "fixed top-4",
        "flex flex-col gap-2",
        positionClasses[position],
        className
      )}
      style={{
        zIndex,
        ...styles,
      }}
      aria-label="Skip links"
    >
      {links.map((link) => (
        <a
          key={link.id}
          id={link.id}
          href={link.href}
          onClick={(e) => handleClick(e, link.href)}
          className={cn(
            // Visually hidden by default
            "absolute -left-[10000px] top-auto",
            "w-[1px] h-[1px] overflow-hidden",
            // Visible on focus
            "focus:static focus:w-auto focus:h-auto",
            "focus:overflow-visible",
            // Styling when visible
            "focus:inline-block",
            "focus:px-4 focus:py-2",
            "focus:bg-primary focus:text-primary-foreground",
            "focus:rounded-md",
            "focus:shadow-lg",
            "focus:no-underline",
            "focus:outline-none",
            "focus:ring-2 focus:ring-primary focus:ring-offset-2",
            // Animation
            "transition-all duration-200 ease-out",
            // High contrast mode
            "forced-colors:focus:forced-color-adjust-none",
            "forced-colors:focus:outline forced-colors:focus:outline-2",
            "forced-colors:focus:outline-[ButtonText]",
            // Glass classes
            "glass-focus glass-touch-target glass-contrast-guard"
          )}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

/**
 * Main content landmark component
 * Wrapper for main content with proper ARIA attributes
 */
export function MainContent({
  children,
  className,
  id = "main-content",
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <main
      id={id}
      className={className}
      role="main"
      aria-label="Main content"
      tabIndex={-1}
      {...props}
    >
      {children}
    </main>
  );
}

/**
 * Navigation landmark component
 * Wrapper for navigation with proper ARIA attributes
 */
export function Navigation({
  children,
  className,
  id = "main-navigation",
  label = "Main navigation",
  ...props
}: React.HTMLAttributes<HTMLElement> & { label?: string }) {
  return (
    <nav
      id={id}
      className={className}
      role="navigation"
      aria-label={label}
      tabIndex={-1}
      {...props}
    >
      {children}
    </nav>
  );
}

/**
 * Search landmark component
 * Wrapper for search with proper ARIA attributes
 */
export function SearchLandmark({
  children,
  className,
  id = "search",
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <search
      id={id}
      className={className}
      role="search"
      aria-label="Search"
      tabIndex={-1}
      {...props}
    >
      {children}
    </search>
  );
}

/**
 * Custom skip link hook
 * Programmatically manage skip links
 */
export function useSkipLinks() {
  const skipToElement = (elementId: string) => {
    const element = document.getElementById(elementId);

    if (element) {
      // Add tabindex if needed
      if (!element.hasAttribute("tabindex")) {
        element.setAttribute("tabindex", "-1");
      }

      // Focus and scroll
      element.focus();
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const createSkipLink = (link: SkipLink) => {
    const anchor = document.createElement("a");
    anchor.id = link.id;
    anchor.href = link.href;
    anchor.textContent = link.label;
    anchor.className = "skip-link";

    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.href.replace("#", "");
      skipToElement(targetId);
    });

    return anchor;
  };

  const addSkipLink = (link: SkipLink, container?: HTMLElement) => {
    const target = container || document.body;
    const anchor = createSkipLink(link);
    target.insertBefore(anchor, target.firstChild);
    return anchor;
  };

  const removeSkipLink = (linkId: string) => {
    const link = document.getElementById(linkId);
    if (link) {
      link.remove();
    }
  };

  return {
    skipToElement,
    createSkipLink,
    addSkipLink,
    removeSkipLink,
  };
}
