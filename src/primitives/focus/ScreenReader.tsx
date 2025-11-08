import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/design-system/utilsCore";

export interface ScreenReaderProps {
  /**
   * Content to be announced
   */
  children: React.ReactNode;
  /**
   * ARIA live region politeness
   */
  politeness?: "polite" | "assertive" | "off";
  /**
   * Whether to clear announcements after a delay
   */
  clearAfter?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * ARIA atomic - whether to announce the entire region
   */
  atomic?: boolean;
  /**
   * ARIA relevant - what changes to announce
   */
  relevant?: "additions" | "removals" | "text" | "all" | "additions text";
}

/**
 * ScreenReader component
 * Provides screen reader only content and announcements
 */
export function ScreenReader({
  children,
  politeness = "polite",
  clearAfter,
  className,
  atomic = false,
  relevant = "additions text",
}: ScreenReaderProps) {
  const [content, setContent] = useState(children);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    setContent(children);

    if (clearAfter) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setContent("");
      }, clearAfter);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [children, clearAfter]);

  return (
    <div
      className={cn("sr-only", className)}
      role="status"
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant as any}
    >
      {content}
    </div>
  );
}

/**
 * ScreenReaderOnly component
 * Visually hidden content for screen readers
 */
export function ScreenReaderOnly({
  children,
  as: Component = "span",
  className,
  ...props
}: {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
} & React.HTMLAttributes<HTMLElement>) {
  return React.createElement(
    Component as any,
    { className: cn("sr-only", className), ...props },
    children
  );
}

/**
 * LiveRegion component
 * Announces dynamic content changes to screen readers
 */
export function LiveRegion({
  children,
  politeness = "polite",
  atomic = false,
  relevant = "additions text",
  className,
  ...props
}: {
  children: React.ReactNode;
  politeness?: "polite" | "assertive" | "off";
  atomic?: boolean;
  relevant?: string;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="region"
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant as any}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Announcer component
 * Global announcer for screen reader messages
 */
let announcer: HTMLDivElement | null = null;

function getAnnouncer() {
  if (typeof document === "undefined") return null;

  if (!announcer) {
    announcer = document.createElement("div");
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    announcer.style.position = "absolute";
    announcer.style.left = "-10000px";
    announcer.style.width = "1px";
    announcer.style.height = "1px";
    announcer.style.overflow = "hidden";
    document.body.appendChild(announcer);
  }

  return announcer;
}

/**
 * Announce a message to screen readers
 */
export function announce(
  message: string,
  options: {
    politeness?: "polite" | "assertive";
    clearAfter?: number;
  } = {}
) {
  const { politeness = "polite", clearAfter = 3000 } = options;
  const announcer = getAnnouncer();

  if (!announcer) return;

  // Set politeness level
  announcer.setAttribute("aria-live", politeness);

  // Clear previous message
  announcer.textContent = "";

  // Announce new message after a brief delay
  setTimeout(() => {
    announcer.textContent = message;

    // Clear after delay
    if (clearAfter) {
      setTimeout(() => {
        announcer.textContent = "";
      }, clearAfter);
    }
  }, 100);
}

/**
 * Hook for screen reader announcements
 */
export function useAnnounce() {
  const announcerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;

    // Create local announcer
    const div = document.createElement("div");
    div.setAttribute("aria-live", "polite");
    div.setAttribute("aria-atomic", "true");
    div.className = "sr-only";
    document.body.appendChild(div);
    announcerRef.current = div;

    return () => {
      if (
        announcerRef.current &&
        document.body.contains(announcerRef.current)
      ) {
        document.body.removeChild(announcerRef.current);
      }
    };
  }, []);

  const announceMessage = (
    message: string,
    politeness: "polite" | "assertive" = "polite"
  ) => {
    if (!announcerRef.current) return;

    announcerRef.current.setAttribute("aria-live", politeness);
    announcerRef.current.textContent = "";

    setTimeout(() => {
      if (announcerRef.current) {
        announcerRef.current.textContent = message;
      }
    }, 100);
  };

  const clearAnnouncement = () => {
    if (announcerRef.current) {
      announcerRef.current.textContent = "";
    }
  };

  return {
    announce: announceMessage,
    clear: clearAnnouncement,
  };
}

/**
 * DescribedBy component
 * Associates descriptive text with an element
 */
export function DescribedBy({
  children,
  description,
  id,
}: {
  children: React.ReactElement;
  description: string;
  id?: string;
}) {
  const descriptionId =
    id || `description-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <>
      {React.cloneElement(children as any, {
        "aria-describedby": descriptionId,
      })}
      <span id={descriptionId} className="sr-only">
        {description}
      </span>
    </>
  );
}

/**
 * LabelledBy component
 * Associates label text with an element
 */
export function LabelledBy({
  children,
  label,
  id,
}: {
  children: React.ReactElement;
  label: string;
  id?: string;
}) {
  const labelId = id || `label-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <>
      <span id={labelId} className="sr-only">
        {label}
      </span>
      {React.cloneElement(children as any, {
        "aria-labelledby": labelId,
      })}
    </>
  );
}

/**
 * Loading announcement component
 */
export function LoadingAnnouncement({
  loading,
  loadingMessage = "Loading...",
  completeMessage = "Loading complete",
  errorMessage = "Loading failed",
  status,
}: {
  loading: boolean;
  loadingMessage?: string;
  completeMessage?: string;
  errorMessage?: string;
  status?: "loading" | "complete" | "error";
}) {
  const { announce } = useAnnounce();

  useEffect(() => {
    if (loading) {
      announce(loadingMessage);
    } else if (status === "complete") {
      announce(completeMessage);
    } else if (status === "error") {
      announce(errorMessage, "assertive");
    }
  }, [
    loading,
    status,
    loadingMessage,
    completeMessage,
    errorMessage,
    announce,
  ]);

  return null;
}

/**
 * Form validation announcements
 */
export function ValidationAnnouncement({
  errors,
  successMessage,
}: {
  errors?: string[];
  successMessage?: string;
}) {
  const { announce } = useAnnounce();

  useEffect(() => {
    if (errors && Array.isArray(errors) && errors.length > 0) {
      const message = `${errors.length} error${errors.length > 1 ? "s" : ""}: ${errors.join(", ")}`;
      announce(message, "assertive");
    } else if (successMessage) {
      announce(successMessage);
    }
  }, [errors, successMessage, announce]);

  return null;
}
