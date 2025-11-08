import { cn } from "../../lib/utilsComprehensive";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";
import React from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";
import {
  createPaginationA11y,
  useA11yId,
  announceToScreenReader,
  keyboardHandlers,
} from "../../utils/a11y";

export interface GlassPaginationProps {
  /**
   * Current page (1-based)
   */
  currentPage: number;
  /**
   * Total number of pages
   */
  totalPages: number;
  /**
   * Callback when page changes
   */
  onPageChange: (page: number) => void;
  /**
   * Maximum number of page buttons to show
   */
  maxPageButtons?: number;
  /**
   * Show first/last page buttons
   */
  showFirstLast?: boolean;
  /**
   * Show previous/next buttons
   */
  showPrevNext?: boolean;
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg";
  /**
   * Custom className
   */
  className?: string;
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Loading state
   */
  loading?: boolean;

  // Accessibility props
  /**
   * Accessible label for the pagination component
   */
  "aria-label"?: string;
  /**
   * Whether to announce page changes to screen readers
   */
  announcePageChanges?: boolean;
}

export interface GlassPaginationContentProps {
  /**
   * Pagination content
   */
  children: React.ReactNode;
  /**
   * Custom className
   */
  className?: string;
}

export interface GlassPaginationItemProps {
  /**
   * Item content
   */
  children: React.ReactNode;
  /**
   * Whether item is active
   */
  isActive?: boolean;
  /**
   * Whether item is disabled
   */
  disabled?: boolean;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg";
  /**
   * Custom className
   */
  className?: string;
  /**
   * Accessible label
   */
  ariaLabel?: string;
  /**
   * Internal ref for page registration
   */
  innerRef?: (el: HTMLDivElement | null) => void;
}

/**
 * GlassPagination component
 * A glassmorphism pagination component
 */
export const GlassPagination: React.FC<GlassPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxPageButtons = 7,
  showFirstLast = true,
  showPrevNext = true,
  size = "md",
  className,
  disabled = false,
  loading = false,
  "aria-label": ariaLabel = "Pagination",
  announcePageChanges = true,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const halfMax = Math.floor(maxPageButtons / 2);

    if (totalPages <= maxPageButtons) {
      // Show all pages if total is less than max buttons
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of middle section
      let start = Math.max(2, currentPage - halfMax);
      let end = Math.min(totalPages - 1, currentPage + halfMax);

      // Adjust if we're near the beginning
      if (currentPage <= halfMax + 1) {
        end = Math.min(totalPages - 1, maxPageButtons - 1);
      }
      // Adjust if we're near the end
      else if (currentPage >= totalPages - halfMax) {
        start = Math.max(2, totalPages - maxPageButtons + 2);
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (
      page >= 1 &&
      page <= totalPages &&
      page !== currentPage &&
      !disabled &&
      !loading
    ) {
      const previousPage = currentPage;
      onPageChange(page);

      // Announce page change to screen readers
      if (announcePageChanges) {
        const direction = page > previousPage ? "next" : "previous";
        announceToScreenReader(
          `Moved to page ${page} of ${totalPages}`,
          "polite"
        );
      }
    }
  };

  const sizeClasses = {
    sm: "h-8 glass-px-2 glass-text-sm",
    md: "h-10 glass-px-3 glass-text-base",
    lg: "h-12 glass-px-4 glass-text-lg",
  };

  const pageNumbers = getPageNumbers();

  // Ink highlight for active page number
  const pagesRef = React.useRef<HTMLDivElement>(null);
  const pageRefMap = React.useRef(new Map<number, HTMLDivElement>());
  const [ink, setInk] = React.useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  const updateInk = React.useCallback(() => {
    const activeEl = pageRefMap.current.get(currentPage);
    const container = pagesRef.current;
    if (!activeEl || !container) return;
    const cr = container.getBoundingClientRect();
    const ar = activeEl.getBoundingClientRect();
    setInk({ left: ar.left - cr.left, width: ar.width });
  }, [currentPage]);

  const registerPageRef = (page: number, el: HTMLDivElement | null) => {
    const map = pageRefMap.current;
    if (el) map.set(page, el);
    else map.delete(page);
    // Defer measure to next frame
    requestAnimationFrame(updateInk);
  };

  React.useEffect(() => {
    updateInk();
    const onResize = () => updateInk();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updateInk]);

  return (
    <nav data-glass-component aria-label={ariaLabel} role="navigation">
      <OptimizedGlass
        intent="neutral"
        elevation="level2"
        intensity="medium"
        depth={2}
        tint="neutral"
        border="subtle"
        animation="none"
        performanceMode="medium"
        className={cn(
          "inline-flex items-center glass-gap-1 glass-p-1 glass-backdrop-blur-md ring-1 ring-white/10 bg-white/5",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        aria-busy={loading || undefined}
      >
        {/* First page button */}
        {showFirstLast && totalPages > 3 && (
          <GlassPaginationItem
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1 || disabled || loading}
            size={size}
            ariaLabel="First page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </GlassPaginationItem>
        )}

        {/* Previous page button */}
        {showPrevNext && (
          <GlassPaginationItem
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || disabled || loading}
            size={size}
            ariaLabel="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </GlassPaginationItem>
        )}

        {/* Page numbers */}
        <div
          ref={pagesRef}
          className="relative glass-inline-flex glass-items-center glass-gap-1"
        >
          {/* Ink indicator */}
          <div
            className="absolute bottom-0 h-0-5 glass-surface-primary transition-all duration-200"
            style={{ left: ink.left, width: ink.width }}
          />
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <GlassPaginationItem disabled size={size}>
                  <MoreHorizontal className="w-4 h-4" />
                </GlassPaginationItem>
              ) : (
                <GlassPaginationItem
                  isActive={page === currentPage}
                  onClick={() => handlePageChange(page as number)}
                  disabled={disabled || loading}
                  size={size}
                  ariaLabel={`Page ${page}`}
                  innerRef={(el) => registerPageRef(page as number, el)}
                >
                  {page}
                </GlassPaginationItem>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next page button */}
        {showPrevNext && (
          <GlassPaginationItem
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || disabled || loading}
            size={size}
            ariaLabel="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </GlassPaginationItem>
        )}

        {/* Last page button */}
        {showFirstLast && totalPages > 3 && (
          <GlassPaginationItem
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || disabled || loading}
            size={size}
            ariaLabel="Last page"
          >
            <ChevronsRight className="w-4 h-4" />
          </GlassPaginationItem>
        )}

        {loading && (
          <div className="glass-ml-2">
            <div className="w-4 h-4 glass-border-2 glass-border-white/30 glass-border-t-white/60 glass-radius-full animate-spin" />
          </div>
        )}
      </OptimizedGlass>
    </nav>
  );
};

/**
 * GlassPaginationContent component
 * Wrapper for pagination content
 */
export const GlassPaginationContent: React.FC<GlassPaginationContentProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      {children}
    </div>
  );
};

/**
 * GlassPaginationItem component
 * Individual pagination item/button
 */
export const GlassPaginationItem: React.FC<GlassPaginationItemProps> = ({
  children,
  isActive = false,
  disabled = false,
  onClick,
  size = "md",
  className,
  ariaLabel,
  innerRef,
}) => {
  // Create accessibility attributes
  const a11yProps = createPaginationA11y({
    label: ariaLabel,
    current: isActive,
    disabled,
  });
  const sizeClasses = {
    sm: "h-8 w-8 glass-text-sm",
    md: "h-10 w-10 glass-text-base",
    lg: "h-12 w-12 glass-text-lg",
  };

  return (
    <Motion preset="none">
      <OptimizedGlass
        intent="neutral"
        elevation={isActive ? "level3" : "level1"}
        intensity="medium"
        depth={2}
        tint="neutral"
        border="subtle"
        animation="none"
        performanceMode="medium"
        liftOnHover
        press
        ref={innerRef}
        className={cn(
          "relative flex items-center justify-center font-medium glass-radius-md",
          "glass-backdrop-blur-md border border-white/20",
          "transition-all duration-200 glass-sheen",
          "focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none",
          sizeClasses[size],
          {
            "bg-black/40 glass-text-primary shadow-lg ring-1 ring-white/30 border-white/30":
              isActive,
            "bg-black/20 hover:bg-black/30 glass-text-primary/80 hover:glass-text-primary hover:-translate-y-0.5 border-white/20 hover:border-white/30":
              !isActive && !disabled,
          },
          className
        )}
        onClick={onClick}
        {...a11yProps}
      >
        {children}
      </OptimizedGlass>
    </Motion>
  );
};

/**
 * Hook for managing pagination state
 */
export const usePagination = (
  initialPage = 1,
  totalItems = 0,
  itemsPerPage = 10
) => {
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [itemsPerPageState, setItemsPerPage] = React.useState(itemsPerPage);

  const totalPages = Math.ceil(totalItems / itemsPerPageState);
  const startIndex = (currentPage - 1) * itemsPerPageState;
  const endIndex = startIndex + itemsPerPageState;
  const currentItems = React.useMemo(() => {
    // This would typically slice from your data array
    return { startIndex, endIndex };
  }, [startIndex, endIndex]);

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  const firstPage = () => goToPage(1);
  const lastPage = () => goToPage(totalPages);

  return {
    currentPage,
    totalPages,
    itemsPerPage: itemsPerPageState,
    setItemsPerPage,
    currentItems,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

/**
 * Compound pagination component with item info
 */
export interface GlassPaginationWithInfoProps extends GlassPaginationProps {
  /**
   * Total number of items
   */
  totalItems: number;
  /**
   * Items per page
   */
  itemsPerPage: number;
  /**
   * Item name (e.g., "items", "results", "products")
   */
  itemName?: string;
  /**
   * Show item range info
   */
  showItemInfo?: boolean;
}

export const GlassPaginationWithInfo: React.FC<
  GlassPaginationWithInfoProps
> = ({
  totalItems,
  itemsPerPage,
  itemName = "items",
  showItemInfo = true,
  currentPage,
  totalPages,
  onPageChange,
  ...paginationProps
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="glass-flex glass-flex-col sm:flex-row glass-items-center glass-justify-between glass-gap-4">
      {showItemInfo && (
        <div className="text-primary/60 glass-text-sm">
          Showing{" "}
          <span className="font-medium text-primary">
            {startItem}-{endItem}
          </span>{" "}
          of{" "}
          <span className="font-medium text-primary">
            {totalItems.toLocaleString()}
          </span>{" "}
          {itemName}
        </div>
      )}

      <GlassPaginationContent>
        <GlassPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          {...paginationProps}
        />
      </GlassPaginationContent>
    </div>
  );
};
