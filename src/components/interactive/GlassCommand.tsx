"use client";
import { GlassInput } from "../input/GlassInput";

import { cn } from "../../lib/utilsComprehensive";
import { Search } from "lucide-react";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  keywords?: string[];
  action: () => void;
  group?: string;
  disabled?: boolean;
}

export interface GlassCommandProps {
  /**
   * Command items to display
   */
  items?: CommandItem[];
  /**
   * Placeholder text for search input
   */
  placeholder?: string;
  /**
   * Empty state message
   */
  emptyMessage?: string;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Maximum height of the command list
   */
  maxHeight?: string;
  /**
   * Custom filter function
   */
  filterItems?: (items: CommandItem[], query: string) => CommandItem[];
  /**
   * Group items by category
   */
  groupBy?: (item: CommandItem) => string;
  /**
   * Custom render function for items
   */
  renderItem?: (item: CommandItem, isSelected: boolean) => React.ReactNode;
  /**
   * Custom render function for empty state
   */
  renderEmpty?: () => React.ReactNode;
  /**
   * Callback when command is selected
   */
  onSelect?: (item: CommandItem) => void;
  /**
   * Callback when search query changes
   */
  onSearchChange?: (query: string) => void;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Accessible label for the command palette
   */
  "aria-label"?: string;
  /**
   * Custom data-testid
   */
  "data-testid"?: string;
}

export interface GlassCommandDialogProps extends GlassCommandProps {
  /**
   * Whether dialog is open
   */
  open: boolean;
  /**
   * Callback when dialog closes
   */
  onOpenChange: (open: boolean) => void;
  /**
   * Dialog title
   */
  title?: string;
  /**
   * Dialog description
   */
  description?: string;
}

export interface GlassCommandInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  /**
   * Custom className
   */
  className?: string;
}

export interface GlassCommandListProps {
  /**
   * Command items to display
   */
  children: React.ReactNode;
  /**
   * Maximum height
   */
  maxHeight?: string;
  /**
   * Custom className
   */
  className?: string;
}

const DEFAULT_COMMAND_ITEMS: CommandItem[] = [
  {
    id: "open-file",
    label: "Open file",
    description: "Open a workspace file",
    keywords: ["open", "file"],
    group: "Quick actions",
    action: () => {},
  },
  {
    id: "save",
    label: "Save",
    description: "Persist current changes",
    keywords: ["save", "write"],
    group: "Quick actions",
    action: () => {},
  },
  {
    id: "find",
    label: "Find",
    description: "Search the current view",
    keywords: ["search", "find"],
    group: "Navigation",
    action: () => {},
  },
];

// Context for command state
const CommandContext = createContext<{
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  query: string;
  setQuery: (query: string) => void;
} | null>(null);

const useCommandContext = () => {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error(
      "Command components must be used within a Command provider"
    );
  }
  return context;
};

/**
 * GlassCommand component
 * A glassmorphism command palette with search functionality
 */
export const GlassCommand: React.FC<GlassCommandProps> = ({
  items = DEFAULT_COMMAND_ITEMS,
  placeholder = "Search commands...",
  emptyMessage = "No commands found",
  loading = false,
  maxHeight = "300px",
  filterItems,
  groupBy,
  renderItem,
  renderEmpty,
  onSelect,
  onSearchChange,
  className,
  "aria-label": ariaLabel,
  "data-testid": dataTestId,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredItems, setFilteredItems] = useState(items);
  const listRef = useRef<HTMLDivElement>(null);

  // Default filter function
  const defaultFilter = (
    items: CommandItem[],
    query: string
  ): CommandItem[] => {
    if (!query) return items;

    const lowerQuery = query.toLowerCase();
    return items.filter((item: any) => {
      const searchableText = [
        item?.label,
        item?.description,
        ...(item?.keywords || []),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(lowerQuery);
    });
  };

  // Filter items when query changes
  useEffect(() => {
    const filtered = filterItems
      ? filterItems(items, query)
      : defaultFilter(items, query);
    setFilteredItems(filtered);
    setSelectedIndex(0);
    onSearchChange?.(query);
  }, [query, items, filterItems, onSearchChange]);

  // Group items if groupBy is provided
  const groupedItems = React.useMemo(() => {
    if (!groupBy) return { "": filteredItems };

    const groups: Record<string, CommandItem[]> = {};
    filteredItems.forEach((item: any) => {
      const group = groupBy(item);
      if (!groups[group]) groups[group] = [];
      groups[group].push(item);
    });

    return groups;
  }, [filteredItems, groupBy]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = filteredItems?.length || 0;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (totalItems === 0) break;
        setSelectedIndex((prev: any) => (prev + 1) % totalItems);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (totalItems === 0) break;
        setSelectedIndex((prev: any) => (prev - 1 + totalItems) % totalItems);
        break;
      case "Enter":
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setQuery("");
        setSelectedIndex(0);
        break;
    }
  };

  const handleSelect = (item: CommandItem) => {
    if (item?.disabled) return;
    item?.action();
    onSelect?.(item);
  };

  return (
    <CommandContext.Provider
      data-glass-component
      value={{ selectedIndex, setSelectedIndex, query, setQuery }}
    >
      <OptimizedGlass
        intent="neutral"
        elevation="level1"
        intensity="subtle"
        depth={2}
        tint="neutral"
        border="subtle"
        animation="none"
        performanceMode="medium"
        className={cn(
          "glass-radius-lg glass-surface-dark/30 glass-border glass-border-white/10 glass-overflow-hidden",
          className
        )}
        style={{
          background:
            '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',
          border: "1px solid rgba(148, 163, 184, 0.18)",
          boxShadow:
            "0 18px 44px rgba(2, 6, 23, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        }}
        aria-label={ariaLabel}
        data-testid={dataTestId}
      >
        <div className="glass-p-3">
          {/* Search Input */}
          <GlassCommandInput
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />

          {/* Command List */}
          <GlassCommandList maxHeight={maxHeight}>
            {loading ? (
              <div className="glass-flex glass-items-center glass-justify-center glass-py-8">
                <div className="glass-w-6 glass-h-6 glass-border-2 glass-border-white/30 glass-border-t-white/60 glass-radius-full glass-animate-spin" />
              </div>
            ) : (filteredItems?.length || 0) === 0 ? (
              renderEmpty ? (
                renderEmpty()
              ) : (
                <div className="glass-text-center glass-py-6 glass-text-secondary">
                  {emptyMessage}
                </div>
              )
            ) : (
              Object.entries(groupedItems).map(([groupName, groupItems]) => (
                <div key={groupName}>
                  {groupName && (
                    <div className="glass-px-3 glass-py-2 glass-text-xs glass-font-medium glass-text-secondary glass-border-b glass-border-white/10">
                      {groupName}
                    </div>
                  )}
                  {groupItems.map((item, itemIndex) => {
                    const globalIndex = filteredItems.indexOf(item);
                    const isSelected = globalIndex === selectedIndex;

                    return (
                      <div
                        key={item?.id}
                        className={cn(
                          "glass-flex glass-items-center glass-px-3 glass-py-2 glass-cursor-pointer glass-transition-all glass-duration-200 glass-radius-md",
                          "hover:glass-surface-subtle/10 glass-hover--translate-y-0-5",
                          {
                            "glass-surface-primary/20 glass-text-primary glass-ring-1 glass-ring-primary":
                              isSelected,
                            "glass-opacity-50 glass-cursor-not-allowed":
                              item?.disabled,
                          }
                        )}
                        onClick={(e) => handleSelect(item)}
                      >
                        {renderItem ? (
                          renderItem(item, isSelected)
                        ) : (
                          <>
                            {item?.icon && (
                              <div className="glass-flex glass-items-center glass-justify-center glass-w-5 glass-h-5 glass-mr-3 glass-text-secondary">
                                {item?.icon}
                              </div>
                            )}
                            <div className="glass-flex-1 glass-min-w-0">
                              <div className="glass-text-primary glass-font-medium glass-truncate">
                                {item?.label}
                              </div>
                              {item?.description && (
                                <div className="glass-text-secondary glass-text-sm glass-truncate">
                                  {item?.description}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </GlassCommandList>
        </div>
      </OptimizedGlass>
    </CommandContext.Provider>
  );
};

/**
 * GlassCommandDialog component
 * A modal dialog containing the command palette
 */
export const GlassCommandDialog: React.FC<GlassCommandDialogProps> = ({
  open,
  onOpenChange,
  title = "Command Palette",
  description = "Search for commands...",
  ...commandProps
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onOpenChange]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(e.target as Node) &&
        open
      ) {
        onOpenChange(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="glass-fixed glass-inset-0 glass-z-9999 glass-flex glass-items-center glass-justify-center glass-p-4 glass-surface-dark/50 glass-backdrop-blur-md glass-contrast-guard">
      <Motion
        preset="scaleIn"
        className="glass-w-full glass-max-w-lg"
        onAnimationEnd={() => {
          // Focus first input when animation completes
          const input = dialogRef.current?.querySelector("input");
          input?.focus();
        }}
      >
        <div ref={dialogRef}>
          <GlassCommand {...commandProps} />
        </div>
      </Motion>
    </div>
  );
};

/**
 * GlassCommandInput component
 * Search input for the command palette
 */
export const GlassCommandInput: React.FC<GlassCommandInputProps> = ({
  className,
  ...props
}) => {
  // Convert Booleanish ARIA attributes to boolean
  const inputProps = {
    ...props,
    "aria-required":
      props["aria-required"] === "true"
        ? true
        : props["aria-required"] === "false"
          ? false
          : props["aria-required"],
    "aria-invalid":
      typeof props["aria-invalid"] === "boolean"
        ? props["aria-invalid"]
        : props["aria-invalid"] === "true"
          ? true
          : props["aria-invalid"] === "false"
            ? false
            : undefined,
  };

  return (
    <div className="glass-relative glass-mb-3">
      <Search className="glass-absolute glass-left-3 glass-top-1/2 glass-transform glass--translate-y-1-2 glass-w-4 glass-h-4 glass-text-secondary" />
      <OptimizedGlass
        elevation={"level1"}
        intensity="subtle"
        animation="none"
        className="glass-backdrop-blur-md glass-radius-lg glass-border glass-border-white/10 glass-surface-dark/40 glass-contrast-guard"
        style={{
          background:
            '/* Use createGlassStyle({ intent: "primary", elevation: "level3" }) */',
          border: "1px solid rgba(148, 163, 184, 0.2)",
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        }}
      >
        <GlassInput
          {...inputProps}
          className={cn(
            "glass-w-full glass-py-2 glass-bg-transparent glass-border-0 glass-outline-none",
            "glass-text-primary",
            className
          )}
          style={{
            paddingLeft: "2.5rem",
            paddingRight: "1rem",
            background: "transparent",
            border: 0,
            boxShadow: "none",
            ...(inputProps.style || {}),
          }}
        />
      </OptimizedGlass>
    </div>
  );
};

/**
 * GlassCommandList component
 * Scrollable list container for command items
 */
export const GlassCommandList: React.FC<GlassCommandListProps> = ({
  children,
  maxHeight = "300px",
  className,
}) => {
  return (
    <div
      className={cn("glass-overflow-y-auto", className)}
      style={{ maxHeight }}
    >
      {children}
    </div>
  );
};

/**
 * Hook for using command palette globally
 */
export const useCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CommandItem[]>([]);

  const openPalette = (commands: CommandItem[]) => {
    setItems(commands);
    setIsOpen(true);
  };

  const closePalette = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    items,
    openPalette,
    closePalette,
    setIsOpen,
  };
};
