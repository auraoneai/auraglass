'use client';
import { cn } from "../../lib/utilsComprehensive";
import React, {
  forwardRef,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { OptimizedGlass } from "../../primitives";
import { createPortal } from "react-dom";

export interface SpotlightAction {
  /**
   * Unique identifier
   */
  id: string;
  /**
   * Display title
   */
  title: string;
  /**
   * Description
   */
  description?: string;
  /**
   * Icon
   */
  icon?: React.ReactNode;
  /**
   * Category/section
   */
  category?: string;
  /**
   * Keywords for search matching
   */
  keywords?: string[];
  /**
   * Keyboard shortcut display
   */
  shortcut?: string;
  /**
   * Action callback
   */
  onAction: () => void;
}

export interface GlassSpotlightSearchProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /**
   * Whether the spotlight is open
   */
  open: boolean;
  /**
   * Callback when the spotlight should close
   */
  onClose: () => void;
  /**
   * Available actions
   */
  actions: SpotlightAction[];
  /**
   * Placeholder text
   * @default 'Search for actions...'
   */
  placeholder?: string;
  /**
   * Maximum number of results to show
   * @default 10
   */
  maxResults?: number;
  /**
   * Glassmorphism elevation level
   * @default 'level5'
   */
  elevation?: "level1" | "level2" | "level3" | "level4" | "level5";
  /**
   * Show recent actions
   * @default true
   */
  showRecent?: boolean;
  /**
   * Maximum recent actions to track
   * @default 5
   */
  maxRecent?: number;
  /**
   * Enable fuzzy search
   * @default true
   */
  fuzzySearch?: boolean;
  /**
   * Group results by category
   * @default true
   */
  groupByCategory?: boolean;
}

export const GlassSpotlightSearch = forwardRef<
  HTMLDivElement,
  GlassSpotlightSearchProps
>(
  (
    {
      open,
      onClose,
      actions,
      placeholder = "Search for actions...",
      maxResults = 10,
      elevation = "level5",
      showRecent = true,
      maxRecent = 5,
      fuzzySearch = true,
      groupByCategory = true,
      className,
      ...props
    },
    ref
  ) => {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [recentActions, setRecentActions] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (open) {
        setQuery("");
        setSelectedIndex(0);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }, [open]);

    useEffect(() => {
      if (!open) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case "Escape":
            e.preventDefault();
            onClose();
            break;
          case "ArrowDown":
            e.preventDefault();
            setSelectedIndex((prev) =>
              Math.min(prev + 1, filteredActions.length - 1)
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
            break;
          case "Enter":
            e.preventDefault();
            if (filteredActions[selectedIndex]) {
              handleActionSelect(filteredActions[selectedIndex]);
            }
            break;
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, selectedIndex, onClose]);

    useEffect(() => {
      if (resultsRef.current && open) {
        const selectedElement = resultsRef.current.children[
          selectedIndex
        ] as HTMLElement;
        if (selectedElement && typeof selectedElement.scrollIntoView === 'function') { // Add check here
          selectedElement.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
          });
        }
      }
    }, [selectedIndex, open]);

    const fuzzyMatch = useCallback((text: string, query: string): boolean => {
      const textLower = text.toLowerCase();
      const queryLower = query.toLowerCase();

      if (textLower.includes(queryLower)) return true;

      let queryIndex = 0;
      for (
        let i = 0;
        i < textLower.length && queryIndex < queryLower.length;
        i++
      ) {
        if (textLower[i] === queryLower[queryIndex]) {
          queryIndex++;
        }
      }
      return queryIndex === queryLower.length;
    }, []);

    const filteredActions = useMemo(() => {
      if (!query) {
        if (showRecent && recentActions.length > 0) {
          return actions
            .filter((action) => recentActions.includes(action.id))
            .slice(0, maxRecent);
        }
        return actions.slice(0, maxResults);
      }

      const matches = actions.filter((action) => {
        const searchText = [
          action.title,
          action.description || "",
          ...(action.keywords || []),
        ].join(" ");

        return fuzzySearch
          ? fuzzyMatch(searchText, query)
          : searchText.toLowerCase().includes(query.toLowerCase());
      });

      return matches.slice(0, maxResults);
    }, [
      query,
      actions,
      showRecent,
      recentActions,
      maxRecent,
      maxResults,
      fuzzySearch,
      fuzzyMatch,
    ]);

    const groupedActions = useMemo(() => {
      if (!groupByCategory) return { "": filteredActions };

      return filteredActions.reduce<Record<string, SpotlightAction[]>>(
        (acc, action) => {
          const category = action.category || "Other";
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(action);
          return acc;
        },
        {}
      );
    }, [filteredActions, groupByCategory]);

    const handleActionSelect = useCallback(
      (action: SpotlightAction) => {
        action.onAction();

        setRecentActions((prev) => {
          const updated = [
            action.id,
            ...prev.filter((id) => id !== action.id),
          ].slice(0, maxRecent);
          localStorage.setItem("spotlight-recent", JSON.stringify(updated));
          return updated;
        });

        onClose();
      },
      [onClose, maxRecent]
    );

    useEffect(() => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("spotlight-recent");
        if (stored) {
          try {
            setRecentActions(JSON.parse(stored));
          } catch (e) {
            console.error("Failed to parse recent actions", e);
          }
        }
      }
    }, []);

    if (!open) return null;

    const content = (
      <div
        className='glass-fixed glass-inset-0 glass-z-50 glass-flex glass-items-start glass-justify-center glass-p-4 glass-pt-24 glass-surface-dark/40 glass-backdrop-blur-sm glass-contrast-guard'
        onClick={onClose}
        role="presentation"
      >
        <OptimizedGlass
          ref={ref}
          elevation={elevation}
          className={cn(
            "w-full max-w-2xl overflow-hidden glass-radius-2xl",
            "transform transition-all duration-200 ease-out",
            open ? "scale-100 opacity-100" : "scale-95 opacity-0",
            className
          )}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Command search"
          {...props}
        >
          <div className="glass-flex glass-items-center glass-gap-3 glass-p-4 glass-border-b glass-border-subtle">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className='glass-w-5 glass-h-5 glass-text-secondary glass-flex-shrink-0'
            >
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder={placeholder}
              className='glass-flex-1 glass-bg-transparent glass-text-base glass-text-primary glass-outline-none glass-placeholder-text-secondary glass-focus glass-touch-target glass-contrast-guard'
            />
            <kbd className="glass-px-2 glass-py-1 glass-text-xs glass-text-secondary glass-surface-subtle/10 glass-radius-sm">
              ESC
            </kbd>
          </div>

          <div ref={resultsRef} className='glass-max-h-96 glass-overflow-y-auto glass-p-2'>
            {filteredActions.length === 0 ? (
              <div className='glass-p-8 glass-text-center glass-text-secondary'>
                {query ? "No results found" : "No actions available"}
              </div>
            ) : (
              <>
                {!query && showRecent && recentActions.length > 0 && (
                  <div className='glass-px-3 glass-py-2 glass-text-xs glass-font-semibold glass-text-secondary glass-uppercase glass-tracking-wider'>
                    Recent
                  </div>
                )}
                {Object.entries(groupedActions).map(
                  ([category, categoryActions]) => (
                    <div key={category}>
                      {groupByCategory && category && (
                        <div className='glass-px-3 glass-py-2 glass-text-xs glass-font-semibold glass-text-secondary glass-uppercase glass-tracking-wider'>
                          {category}
                        </div>
                      )}
                      {categoryActions.map((action, index) => {
                        const globalIndex = filteredActions.indexOf(action);
                        const isSelected = globalIndex === selectedIndex;

                        return (
                          <button
                            data-glass-component
                            key={action.id}
                            type="button"
                            onClick={() => handleActionSelect(action)}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={cn(
                              "w-full flex items-center gap-3 glass-p-3 glass-radius-lg",
                              "transition-all duration-200",
                              "text-left glass-focus glass-touch-target glass-contrast-guard",
                              isSelected
                                ? "bg-white/15 shadow-lg"
                                : "hover:bg-white/5"
                            )}
                          >
                            {action.icon && (
                              <div className="glass-flex-shrink-0 glass-text-primary">
                                {action.icon}
                              </div>
                            )}
                            <div className="glass-flex-1 glass-min-glass-w-0">
                              <div className='glass-text-sm glass-font-medium glass-text-primary glass-truncate'>
                                {action.title}
                              </div>
                              {action.description && (
                                <div className='glass-text-xs glass-text-secondary glass-truncate'>
                                  {action.description}
                                </div>
                              )}
                            </div>
                            {action.shortcut && (
                              <kbd className="glass-px-2 glass-py-1 glass-text-xs glass-text-secondary glass-surface-subtle/10 glass-radius-sm glass-flex-shrink-0">
                                {action.shortcut}
                              </kbd>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )
                )}
              </>
            )}
          </div>
        </OptimizedGlass>
      </div>
    );

    return createPortal(content, document.body);
  }
);

GlassSpotlightSearch.displayName = "GlassSpotlightSearch";

export default GlassSpotlightSearch;