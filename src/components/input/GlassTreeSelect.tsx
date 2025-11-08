import { cn } from "../../lib/utilsComprehensive";
import React, {
  forwardRef,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { OptimizedGlass } from "../../primitives";

export interface TreeNode {
  /**
   * Unique identifier
   */
  id: string | number;
  /**
   * Display label
   */
  label: string;
  /**
   * Optional icon
   */
  icon?: React.ReactNode;
  /**
   * Child nodes
   */
  children?: TreeNode[];
  /**
   * Whether the node is disabled
   */
  disabled?: boolean;
  /**
   * Parent node ID
   */
  parentId?: string | number;
}

export interface GlassTreeSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * Tree data
   */
  data: TreeNode[];
  /**
   * Selected node IDs
   */
  value?: (string | number)[];
  /**
   * Callback when selection changes
   */
  onChange?: (selectedIds: (string | number)[]) => void;
  /**
   * Placeholder text
   * @default 'Select...'
   */
  placeholder?: string;
  /**
   * Allow multiple selection
   * @default false
   */
  multiple?: boolean;
  /**
   * Enable search/filter
   * @default true
   */
  searchable?: boolean;
  /**
   * Search placeholder
   * @default 'Search...'
   */
  searchPlaceholder?: string;
  /**
   * Show checkbox for each item
   * @default true for multiple, false for single
   */
  showCheckbox?: boolean;
  /**
   * Expand all nodes by default
   * @default false
   */
  defaultExpanded?: boolean;
  /**
   * Maximum height of dropdown
   * @default '300px'
   */
  maxHeight?: string;
  /**
   * Glassmorphism elevation level
   * @default 'level3'
   */
  elevation?: "level1" | "level2" | "level3" | "level4" | "level5";
  /**
   * Whether the component is disabled
   * @default false
   */
  disabled?: boolean;
}

export const GlassTreeSelect = forwardRef<HTMLDivElement, GlassTreeSelectProps>(
  (
    {
      data,
      value = [],
      onChange,
      placeholder = "Select...",
      multiple = false,
      searchable = true,
      searchPlaceholder = "Search...",
      showCheckbox,
      defaultExpanded = false,
      maxHeight = "300px",
      elevation = "level3",
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [expandedNodes, setExpandedNodes] = useState<Set<string | number>>(
      new Set()
    );
    const containerRef = useRef<HTMLDivElement>(null);

    const shouldShowCheckbox = showCheckbox ?? multiple;

    useEffect(() => {
      if (defaultExpanded) {
        const allIds = new Set<string | number>();
        const collectIds = (nodes: TreeNode[]) => {
          nodes.forEach((node) => {
            if (node.children && node.children.length > 0) {
              allIds.add(node.id);
              collectIds(node.children);
            }
          });
        };
        collectIds(data);
        setExpandedNodes(allIds);
      }
    }, [data, defaultExpanded]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    const flattenTree = useCallback(
      (nodes: TreeNode[], parentId?: string | number): TreeNode[] => {
        return nodes.reduce<TreeNode[]>((acc, node) => {
          const nodeWithParent = { ...node, parentId };
          acc.push(nodeWithParent);
          if (node.children) {
            acc.push(...flattenTree(node.children, node.id));
          }
          return acc;
        }, []);
      },
      []
    );

    const flatNodes = useMemo(() => flattenTree(data), [data, flattenTree]);

    const getNodeById = useCallback(
      (id: string | number): TreeNode | undefined => {
        return flatNodes.find((node) => node.id === id);
      },
      [flatNodes]
    );

    const getSelectedLabels = useCallback(() => {
      return value.map((id) => getNodeById(id)?.label).filter(Boolean);
    }, [value, getNodeById]);

    const filteredData = useMemo(() => {
      if (!search) return data;

      const matchingIds = new Set<string | number>();
      const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
        return nodes
          .map((node) => {
            const matches = node.label
              .toLowerCase()
              .includes(search.toLowerCase());
            const filteredChildren = node.children
              ? filterNodes(node.children)
              : [];

            if (matches || filteredChildren.length > 0) {
              matchingIds.add(node.id);
              if (matches) {
                setExpandedNodes((prev) => new Set([...prev, node.id]));
              }
              return {
                ...node,
                children:
                  filteredChildren.length > 0
                    ? filteredChildren
                    : node.children,
              } as TreeNode;
            }
            return null;
          })
          .filter((node): node is TreeNode => node !== null);
      };

      return filterNodes(data);
    }, [data, search]);

    const toggleExpand = useCallback((id: string | number) => {
      setExpandedNodes((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    }, []);

    const handleSelect = useCallback(
      (id: string | number) => {
        if (disabled) return;

        const node = getNodeById(id);
        if (node?.disabled) return;

        if (multiple) {
          const newValue = value.includes(id)
            ? value.filter((v) => v !== id)
            : [...value, id];
          onChange?.(newValue);
        } else {
          onChange?.([id]);
          setIsOpen(false);
        }
      },
      [disabled, multiple, value, onChange, getNodeById]
    );

    const renderTreeNode = (node: TreeNode, level: number = 0) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedNodes.has(node.id);
      const isSelected = value.includes(node.id);

      return (
        <div data-glass-component key={node.id}>
          <div
            className={cn(
              "flex items-center gap-2 glass-p-2 glass-radius-md cursor-pointer",
              "transition-all duration-200",
              "hover:bg-white/5",
              "glass-focus glass-touch-target glass-contrast-guard",
              isSelected && "bg-white/10",
              node.disabled && "opacity-50 cursor-not-allowed"
            )}
            style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
            onClick={() => !node.disabled && handleSelect(node.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (!node.disabled) handleSelect(node.id);
              }
            }}
            tabIndex={0}
            role="button"
          >
            {hasChildren && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(node.id);
                }}
                className="glass-flex-shrink-0 glass-text-secondary hover:glass-text-primary transition-colors glass-focus glass-touch-target glass-radius-sm glass-p-0.5"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    isExpanded && "rotate-90"
                  )}
                >
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            {!hasChildren && <div className="w-4" />}

            {shouldShowCheckbox && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleSelect(node.id)}
                disabled={disabled || node.disabled}
                onClick={(e) => e.stopPropagation()}
                className="glass-flex-shrink-0 glass-focus"
              />
            )}

            {node.icon && (
              <span className="glass-flex-shrink-0">{node.icon}</span>
            )}

            <span className="glass-flex-1 glass-text-sm glass-text-primary truncate">
              {node.label}
            </span>
          </div>

          {hasChildren && isExpanded && (
            <div>
              {node.children!.map((child) => renderTreeNode(child, level + 1))}
            </div>
          )}
        </div>
      );
    };

    const selectedLabels = getSelectedLabels();

    return (
      <div ref={containerRef} className={cn("relative", className)} {...props}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full flex items-center justify-between gap-2",
            "glass-p-3 glass-radius-md",
            "bg-white/5 border glass-border-subtle",
            "transition-all duration-200",
            "hover:bg-white/10",
            "focus:outline-none glass-focus glass-touch-target glass-contrast-guard",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isOpen && "ring-2 ring-blue-500/50"
          )}
        >
          <span
            className={cn(
              "glass-text-sm truncate",
              selectedLabels.length === 0 && "glass-text-secondary"
            )}
          >
            {selectedLabels.length > 0
              ? selectedLabels.join(", ")
              : placeholder}
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={cn(
              "w-4 h-4 glass-text-secondary flex-shrink-0 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <OptimizedGlass
            elevation={elevation}
            className={cn(
              "absolute top-full left-0 right-0 mt-2 z-50",
              "glass-radius-lg overflow-hidden"
            )}
          >
            {searchable && (
              <div className="glass-p-2 glass-border-b glass-border-subtle">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={cn(
                    "w-full glass-p-2 glass-radius-md",
                    "glass-text-sm glass-text-primary",
                    "bg-white/5 border glass-border-subtle",
                    "focus:outline-none glass-focus"
                  )}
                  autoFocus
                />
              </div>
            )}

            <div className="overflow-y-auto glass-p-2" style={{ maxHeight }}>
              {filteredData.length === 0 ? (
                <div className="glass-p-4 text-center glass-text-sm glass-text-secondary">
                  No results found
                </div>
              ) : (
                filteredData.map((node) => renderTreeNode(node))
              )}
            </div>
          </OptimizedGlass>
        )}
      </div>
    );
  }
);

GlassTreeSelect.displayName = "GlassTreeSelect";

export default GlassTreeSelect;
