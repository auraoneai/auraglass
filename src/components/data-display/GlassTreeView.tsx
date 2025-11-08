import React, {
  forwardRef,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import { useGlassSound } from "../../utils/soundDesign";
import {
  ContrastGuard,
  TextWithContrast,
} from "@/components/accessibility/ContrastGuard";

export interface GlassTreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: GlassTreeNode[];
  disabled?: boolean;
  metadata?: Record<string, any>;
}

export interface GlassTreeViewProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onSelect" | "onDragStart" | "onDrop"
  > {
  /** Tree data */
  data: GlassTreeNode[];
  /** Currently selected node */
  selectedId?: string;
  /** Expanded node IDs */
  expandedIds?: string[];
  /** Default expanded node IDs */
  defaultExpandedIds?: string[];
  /** Selection mode */
  selectionMode?: "none" | "single" | "multiple";
  /** Multiple selected node IDs */
  selectedIds?: string[];
  /** Default selected node IDs */
  defaultSelectedIds?: string[];
  /** Whether to show connecting lines */
  showLines?: boolean;
  /** Whether to show icons */
  showIcons?: boolean;
  /** Whether nodes are draggable */
  draggable?: boolean;
  /** Whether to show checkboxes for multi-select */
  showCheckboxes?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Visual variant */
  variant?: "default" | "minimal" | "bordered" | "filled";
  /** Indentation per level */
  indentation?: number;
  /** Custom node renderer */
  renderNode?: (
    node: GlassTreeNode,
    level: number,
    isSelected: boolean,
    isExpanded: boolean
  ) => React.ReactNode;
  /** Custom expand/collapse icon */
  expandIcon?: React.ReactNode;
  /** Custom collapse icon */
  collapseIcon?: React.ReactNode;
  /** Selection change handler */
  onSelect?: (nodeId: string, node: GlassTreeNode) => void;
  /** Multi-selection change handler */
  onSelectionChange?: (nodeIds: string[], nodes: GlassTreeNode[]) => void;
  /** Expand/collapse handler */
  onExpand?: (nodeId: string, expanded: boolean) => void;
  /** Drag start handler */
  onDragStart?: (node: GlassTreeNode, event: React.DragEvent) => void;
  /** Drop handler */
  onDrop?: (
    draggedNode: GlassTreeNode,
    targetNode: GlassTreeNode,
    position: "before" | "after" | "inside"
  ) => void;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
}

interface TreeContextValue {
  selectedId?: string;
  selectedIds: string[];
  expandedIds: string[];
  selectionMode: "none" | "single" | "multiple";
  showLines: boolean;
  showIcons: boolean;
  showCheckboxes: boolean;
  draggable: boolean;
  size: "sm" | "md" | "lg";
  variant: "default" | "minimal" | "bordered" | "filled";
  indentation: number;
  expandIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
  renderNode?: (
    node: GlassTreeNode,
    level: number,
    isSelected: boolean,
    isExpanded: boolean
  ) => React.ReactNode;
  respectMotionPreference: boolean;
  onNodeSelect: (nodeId: string, node: GlassTreeNode) => void;
  onNodeToggle: (nodeId: string) => void;
  onNodeCheck: (nodeId: string, checked: boolean) => void;
  onDragStart?: (node: GlassTreeNode, event: React.DragEvent) => void;
  onDrop?: (
    draggedNode: GlassTreeNode,
    targetNode: GlassTreeNode,
    position: "before" | "after" | "inside"
  ) => void;
}

const TreeContext = createContext<TreeContextValue | null>(null);

const useTreeContext = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error("Tree components must be used within GlassTreeView");
  }
  return context;
};

interface GlassTreeNodeProps {
  node: GlassTreeNode;
  level: number;
}

const GlassTreeNodeComponent = ({ node, level }: GlassTreeNodeProps) => {
  const { shouldAnimate } = useMotionPreference();
  const { play } = useGlassSound();
  const [isDragOver, setIsDragOver] = useState<
    "before" | "after" | "inside" | null
  >(null);
  const nodeId = useA11yId("tree-node");

  const {
    selectedId,
    selectedIds,
    expandedIds,
    selectionMode,
    showLines,
    showIcons,
    showCheckboxes,
    draggable,
    size,
    variant,
    indentation,
    expandIcon,
    collapseIcon,
    renderNode,
    respectMotionPreference,
    onNodeSelect,
    onNodeToggle,
    onNodeCheck,
    onDragStart,
    onDrop,
  } = useTreeContext();

  const isExpanded = expandedIds.includes(node.id);
  const isSelected =
    selectionMode === "single"
      ? selectedId === node.id
      : selectedIds.includes(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const isChecked = selectedIds.includes(node.id);

  const sizeConfig = {
    sm: {
      node: "h-8 glass-px-2 glass-text-sm",
      icon: "w-4 h-4",
      checkbox: "w-3 h-3",
      expandIcon: "w-3 h-3",
    },
    md: {
      node: "h-10 glass-px-3 glass-text-sm",
      icon: "w-5 h-5",
      checkbox: "w-4 h-4",
      expandIcon: "w-4 h-4",
    },
    lg: {
      node: "h-12 glass-px-4 glass-text-base",
      icon: "w-6 h-6",
      checkbox: "w-5 h-5",
      expandIcon: "w-5 h-5",
    },
  };

  const variantConfig = {
    default: {
      node: "hover:bg-background/20 focus:bg-background/30",
      selected: "bg-primary/20 text-primary",
      dragOver: "bg-primary/10 border-primary/30",
    },
    minimal: {
      node: "hover:bg-transparent focus:bg-transparent hover:text-foreground",
      selected: "text-primary font-medium",
      dragOver: "bg-primary/5",
    },
    bordered: {
      node: "border border-transparent hover:border-border/20 focus:border-primary/30",
      selected: "border-primary/50 bg-primary/10 text-primary",
      dragOver: "border-primary/50 bg-primary/5",
    },
    filled: {
      node: "bg-background/10 hover:bg-background/20 focus:bg-background/30",
      selected: "bg-primary/20 text-primary",
      dragOver: "bg-primary/15 border-primary/30",
    },
  };

  const config = sizeConfig[size];
  const colors = variantConfig[variant];

  const handleNodeClick = () => {
    if (node.disabled) return;
    onNodeSelect(node.id, node);
    play("select");
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren && !node.disabled) {
      onNodeToggle(node.id);
      play(isExpanded ? "collapse" : "expand");
    }
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (!node.disabled) {
      onNodeCheck(node.id, e.target.checked);
      play(e.target.checked ? "check" : "uncheck");
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (!draggable || node.disabled) return;
    e.dataTransfer.setData("text/plain", node.id);
    onDragStart?.(node, e);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!draggable) return;
    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;

    if (y < height * 0.25) {
      setIsDragOver("before");
    } else if (y > height * 0.75) {
      setIsDragOver("after");
    } else {
      setIsDragOver("inside");
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!draggable) return;
    e.preventDefault();

    const draggedNodeId = e.dataTransfer.getData("text/plain");
    // Find dragged node (would need to be passed through context or prop)
    // This is a simplified version
    const draggedNode = { id: draggedNodeId } as GlassTreeNode;

    if (isDragOver && onDrop) {
      onDrop(draggedNode, node, isDragOver);
    }

    setIsDragOver(null);
  };

  const defaultExpandIcon = (
    <svg
      className="glass-w-full glass-h-full transition-transform duration-200"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );

  const defaultCollapseIcon = (
    <svg
      className="glass-w-full glass-h-full transition-transform duration-200 rotate-90"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );

  if (renderNode) {
    return (
      <div data-glass-component>
        {renderNode(node, level, isSelected, isExpanded)}
        {hasChildren && isExpanded && (
          <Motion
            preset={
              shouldAnimate && respectMotionPreference ? "slideDown" : "none"
            }
            className="relative"
          >
            {node.children?.map((child) => (
              <GlassTreeNodeComponent
                key={child.id}
                node={child}
                level={level + 1}
              />
            ))}
          </Motion>
        )}
      </div>
    );
  }

  return (
    <Motion
      preset={shouldAnimate && respectMotionPreference ? "slideIn" : "none"}
      delay={level * 50}
    >
      <OptimizedGlass
        elevation="level1"
        intensity="subtle"
        depth={0.5}
        tint="neutral"
        border={variant === "bordered" ? "subtle" : "none"}
        className={cn(
          "glass-tree-node flex items-center cursor-pointer transition-all duration-200 glass-radius-md",
          config.node,
          colors.node,
          isSelected && colors.selected,
          isDragOver && colors.dragOver,
          node.disabled && "opacity-50 cursor-not-allowed",
          variant === "bordered" && "border glass-radius-md"
        )}
        style={{ paddingLeft: `${level * indentation}px` }}
        onClick={handleNodeClick}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        draggable={draggable && !node.disabled}
        id={nodeId}
        role="treeitem"
        aria-selected={isSelected}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-level={level + 1}
        aria-disabled={node.disabled}
        tabIndex={node.disabled ? -1 : 0}
      >
        {/* Connecting lines */}
        {showLines && level > 0 && (
          <div className="absolute left-0 top-0 glass-h-full glass-flex glass-items-center">
            <div
              className="glass-border-l glass-border-glass-border/20 glass-h-full"
              style={{
                left: `${(level - 1) * indentation + indentation / 2}px`,
              }}
            />
            <div
              className="glass-border-t glass-border-glass-border/20 w-2"
              style={{
                left: `${(level - 1) * indentation + indentation / 2}px`,
              }}
            />
          </div>
        )}

        {/* Expand/collapse button */}
        <div
          className={cn(
            "flex items-center justify-center flex-shrink-0 glass-mr-1",
            config.expandIcon
          )}
        >
          {hasChildren ? (
            <button
              onClick={handleToggle}
              className="glass-p-1 glass-radius-md hover:glass-surface-overlay transition-colors glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded
                ? collapseIcon || defaultCollapseIcon
                : expandIcon || defaultExpandIcon}
            </button>
          ) : (
            <div className={config.expandIcon} /> // Spacer
          )}
        </div>

        {/* Checkbox */}
        {showCheckboxes && (
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheck}
            disabled={node.disabled}
            className={cn(
              "flex-shrink-0 glass-mr-2 glass-radius-md",
              config.checkbox
            )}
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {/* Icon */}
        {showIcons && node.icon && (
          <div className={cn("flex-shrink-0 glass-mr-2", config.icon)}>
            {node.icon}
          </div>
        )}

        {/* Label */}
        <span className="glass-flex-1 truncate">{node.label}</span>

        {/* Drag indicator */}
        {isDragOver && (
          <div
            className={cn(
              "absolute left-0 right-0 h-0.5 bg-primary pointer-events-none",
              isDragOver === "before" && "top-0",
              isDragOver === "after" && "bottom-0",
              isDragOver === "inside" &&
                "top-1/2 transform -translate-y-1/2 h-full bg-primary/10"
            )}
          />
        )}

        {/* Children */}
        {hasChildren && isExpanded && (
          <Motion
            preset={
              shouldAnimate && respectMotionPreference ? "slideDown" : "none"
            }
            className="relative"
          >
            {node.children?.map((child) => (
              <GlassTreeNodeComponent
                key={child.id}
                node={child}
                level={level + 1}
              />
            ))}
          </Motion>
        )}
      </OptimizedGlass>
    </Motion>
  );
};

export const GlassTreeView = forwardRef<HTMLDivElement, GlassTreeViewProps>(
  (
    {
      // TODO: Integrate ContrastGuard for table cells, list items, badges, card titles, and other text content for WCAG AA compliance

      data,
      selectedId,
      expandedIds,
      defaultExpandedIds = [],
      selectionMode = "single",
      selectedIds,
      defaultSelectedIds = [],
      showLines = true,
      showIcons = true,
      draggable = false,
      showCheckboxes = false,
      size = "md",
      variant = "default",
      indentation = 24,
      renderNode,
      expandIcon,
      collapseIcon,
      onSelect,
      onSelectionChange,
      onExpand,
      onDragStart,
      onDrop,
      respectMotionPreference = true,
      className,
      ...props
    },
    ref
  ) => {
    const treeId = useA11yId("glass-tree");

    const [internalExpandedIds, setInternalExpandedIds] = useState<string[]>(
      expandedIds || defaultExpandedIds
    );
    const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(
      selectedIds || defaultSelectedIds
    );

    const currentExpandedIds =
      expandedIds !== undefined ? expandedIds : internalExpandedIds;
    const currentSelectedIds =
      selectedIds !== undefined ? selectedIds : internalSelectedIds;

    const handleNodeSelect = useCallback(
      (nodeId: string, node: GlassTreeNode) => {
        if (selectionMode === "single") {
          onSelect?.(nodeId, node);
        } else if (selectionMode === "multiple") {
          let newSelection: string[];
          if (currentSelectedIds.includes(nodeId)) {
            newSelection = currentSelectedIds.filter(
              (id: any) => id !== nodeId
            );
          } else {
            newSelection = [...currentSelectedIds, nodeId];
          }

          if (selectedIds === undefined) {
            setInternalSelectedIds(newSelection);
          }

          // Find all nodes for the callback
          const findNodes = (
            nodes: GlassTreeNode[],
            ids: string[]
          ): GlassTreeNode[] => {
            const result: GlassTreeNode[] = [];
            for (const node of nodes) {
              if (ids.includes(node.id)) result.push(node);
              if (node.children) result.push(...findNodes(node.children, ids));
            }
            return result;
          };

          onSelectionChange?.(newSelection, findNodes(data, newSelection));
        }
      },
      [
        selectionMode,
        currentSelectedIds,
        selectedIds,
        onSelect,
        onSelectionChange,
        data,
      ]
    );

    const handleNodeToggle = useCallback(
      (nodeId: string) => {
        let newExpandedIds: string[];

        if (currentExpandedIds.includes(nodeId)) {
          newExpandedIds = currentExpandedIds.filter(
            (id: any) => id !== nodeId
          );
        } else {
          newExpandedIds = [...currentExpandedIds, nodeId];
        }

        if (expandedIds === undefined) {
          setInternalExpandedIds(newExpandedIds);
        }

        onExpand?.(nodeId, !currentExpandedIds.includes(nodeId));
      },
      [currentExpandedIds, expandedIds, onExpand]
    );

    const handleNodeCheck = useCallback(
      (nodeId: string, checked: boolean) => {
        handleNodeSelect(nodeId, data.find((node) => node.id === nodeId)!);
      },
      [handleNodeSelect, data]
    );

    const contextValue: TreeContextValue = {
      selectedId,
      selectedIds: currentSelectedIds,
      expandedIds: currentExpandedIds,
      selectionMode,
      showLines,
      showIcons,
      showCheckboxes: showCheckboxes || selectionMode === "multiple",
      draggable,
      size,
      variant,
      indentation,
      expandIcon,
      collapseIcon,
      renderNode,
      respectMotionPreference,
      onNodeSelect: handleNodeSelect,
      onNodeToggle: handleNodeToggle,
      onNodeCheck: handleNodeCheck,
      onDragStart,
      onDrop,
    };

    return (
      <TreeContext.Provider value={contextValue}>
        <OptimizedGlass
          ref={ref}
          id={treeId}
          elevation="level1"
          intensity="subtle"
          depth={1}
          tint="neutral"
          border="subtle"
          className={cn(
            "glass-tree-view glass-p-2 glass-radius-lg glass-backdrop-blur-md",
            "border border-border/20",
            className
          )}
          role="tree"
          aria-multiselectable={selectionMode === "multiple"}
          {...props}
        >
          {data.map((node) => (
            <GlassTreeNodeComponent key={node.id} node={node} level={0} />
          ))}
        </OptimizedGlass>
      </TreeContext.Provider>
    );
  }
);

GlassTreeView.displayName = "GlassTreeView";

export default GlassTreeView;
