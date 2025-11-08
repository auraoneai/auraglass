import React, { useState } from "react";
import { Glass } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import {
  useDragDrop,
  PageComponent,
  ComponentDefinition,
} from "./GlassDragDropProvider";

interface PageStructureProps {
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface TreeItemProps {
  component: PageComponent;
  level: number;
  isSelected?: boolean;
  onSelect: (id: string) => void;
  onToggleExpand: (id: string) => void;
  expandedItems: Set<string>;
  componentDefinition?: ComponentDefinition;
}

const TreeItem: React.FC<TreeItemProps> = ({
  component,
  level,
  isSelected,
  onSelect,
  onToggleExpand,
  expandedItems,
  componentDefinition,
}) => {
  const {
    deleteComponent,
    duplicateComponent,
    onDragStart,
    dragDropState,
    componentLibrary,
  } = useDragDrop();

  const [showActions, setShowActions] = useState(false);
  const isExpanded = expandedItems.has(component.id);
  const hasChildren = component.children.length > 0;

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    onDragStart(component, "element");
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(component.id);
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggleExpand(component.id);
    }
  };

  const getComponentIcon = (type: string): string => {
    const definition = componentLibrary.find((def) => def.type === type);
    return definition?.icon || "📦";
  };

  return (
    <div data-glass-component>
      <div
        draggable
        onDragStart={handleDragStart}
        onClick={handleClick}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        className={cn(
          "flex items-center gap-2 py-1 px-2 rounded-md cursor-pointer transition-colors relative group",
          isSelected ? "bg-blue-100 text-blue-900" : "hover:bg-gray-50",
          dragDropState.draggedItem?.id === component.id && "opacity-50"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {/* Expand/Collapse Button */}
        <button
          onClick={handleToggleExpand}
          className={cn(
            "w-4 h-4 flex items-center justify-center text-xs transition-transform glass-focus glass-touch-target",
            hasChildren
              ? "text-gray-500 hover:text-gray-700"
              : "text-transparent",
            isExpanded ? "rotate-90" : "rotate-0"
          )}
        >
          {hasChildren && "▶"}
        </button>

        {/* Component Icon */}
        <span className="glass-text-sm">
          {getComponentIcon(component.type)}
        </span>

        {/* Component Name */}
        <div className="glass-flex-1 min-glass-w-0">
          <span className="glass-text-sm font-medium truncate">
            {componentDefinition?.name || component.type}
          </span>
          {component.props.content && (
            <span className="glass-text-xs glass-text-secondary ml-1 truncate">
              "{component.props.content.substring(0, 20)}
              {component.props.content.length > 20 ? "..." : ""}"
            </span>
          )}
        </div>

        {/* Children Count */}
        {hasChildren && (
          <span className="glass-text-xs glass-text-secondary glass-surface-subtle glass-px-1.5 glass-py-0.5 glass-radius">
            {component.children.length}
          </span>
        )}

        {/* Component Status Indicators */}
        <div className="glass-flex glass-items-center glass-gap-1">
          {component.locked && (
            <span className="glass-text-xs text-primary" title="Locked">
              🔒
            </span>
          )}
          {!component.props.visible && (
            <span className="glass-text-xs glass-text-secondary" title="Hidden">
              👁️‍🗨️
            </span>
          )}
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="glass-flex glass-items-center glass-gap-1 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                duplicateComponent(component.id);
              }}
              className="w-6 h-6 glass-flex glass-items-center glass-justify-center glass-text-xs glass-text-secondary hover:text-primary hover:glass-surface-subtle glass-radius glass-focus glass-touch-target"
              title="Duplicate"
            >
              📋
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteComponent(component.id);
              }}
              className="w-6 h-6 glass-flex glass-items-center glass-justify-center glass-text-xs glass-text-secondary hover:text-primary hover:glass-surface-subtle glass-radius glass-focus glass-touch-target"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {component.children.map((child: any) => (
            <TreeItem
              key={child.id}
              component={child}
              level={level + 1}
              isSelected={isSelected}
              onSelect={onSelect}
              onToggleExpand={onToggleExpand}
              expandedItems={expandedItems}
              componentDefinition={componentLibrary.find(
                (def) => def.type === child.type
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const GlassPageStructure: React.FC<PageStructureProps> = ({
  className,
  collapsed = false,
  onToggleCollapse,
}) => {
  const {
    pageState,
    componentLibrary,
    selectComponent,
    getSelectedComponent,
    clearPage,
    exportPage,
    importPage,
  } = useDragDrop();

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const selectedComponent = getSelectedComponent();

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev: Set<string>) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const addIds = (components: PageComponent[]) => {
      components.forEach((component: any) => {
        allIds.add(component.id);
        addIds(component.children);
      });
    };
    addIds(pageState.components);
    setExpandedItems(allIds);
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  const handleExport = () => {
    const data = exportPage();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "page-structure.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            importPage(data);
          } catch (error) {
            alert("Error importing page structure: Invalid JSON file");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Filter components based on search
  const filteredComponents = searchQuery
    ? pageState.components.filter((component: any) => {
        const searchInComponent = (comp: PageComponent): boolean => {
          const definition = componentLibrary.find(
            (def) => def.type === comp.type
          );
          const name = definition?.name || comp.type;
          const content = comp.props.content || "";

          const matches =
            name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comp.type.toLowerCase().includes(searchQuery.toLowerCase());

          return matches || comp.children.some(searchInComponent);
        };
        return searchInComponent(component);
      })
    : pageState.components;

  if (collapsed) {
    return (
      <div className={cn("w-12", className)}>
        <Glass className="glass-h-full glass-contrast-guard">
          <button
            onClick={onToggleCollapse}
            className="glass-flex glass-items-center glass-justify-center glass-w-full h-12 glass-text-secondary hover:glass-text-secondary transition-colors glass-focus glass-touch-target glass-focus glass-touch-target glass-contrast-guard"
            title="Expand Page Structure"
          >
            <div className="glass-text-lg">🌳</div>
          </button>
        </Glass>
      </div>
    );
  }

  return (
    <div className={cn("w-80 h-full flex flex-col", className)}>
      <Glass className="glass-h-full glass-flex glass-flex-col glass-contrast-guard">
        {/* Header */}
        <div className="glass-flex glass-items-center glass-justify-between glass-p-4 glass-border-b glass-border-subtle">
          <h2 className="glass-text-lg font-semibold glass-text-secondary">
            Structure
          </h2>
          <button
            onClick={onToggleCollapse}
            className="glass-p-2 glass-text-secondary hover:glass-text-secondary transition-colors glass-focus glass-touch-target glass-focus glass-touch-target glass-contrast-guard"
            title="Collapse Structure"
          >
            ◀
          </button>
        </div>

        {/* Controls */}
        <div className="glass-p-4 glass-border-b glass-border-subtle space-y-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-w-full glass-px-3 glass-py-2 pl-10 glass-text-sm glass-border glass-border-subtle glass-radius-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 glass-top-1/2 transform -translate-y-1/2 glass-text-secondary">
              🔍
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 glass-top-1/2 transform -translate-y-1/2 glass-text-secondary hover:glass-text-secondary glass-focus glass-touch-target"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="glass-flex glass-items-center glass-justify-between glass-text-xs">
            <div className="glass-flex glass-items-center glass-gap-2">
              <button
                onClick={expandAll}
                className="text-primary hover:text-primary glass-focus glass-touch-target glass-focus glass-touch-target glass-contrast-guard"
              >
                Expand All
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={collapseAll}
                className="text-primary hover:text-primary glass-focus glass-touch-target glass-focus glass-touch-target glass-contrast-guard"
              >
                Collapse All
              </button>
            </div>
            <div className="glass-flex glass-items-center glass-gap-2">
              <button
                onClick={handleExport}
                className="text-primary hover:text-primary glass-focus glass-touch-target glass-focus glass-touch-target glass-contrast-guard"
                title="Export Structure"
              >
                💾
              </button>
              <button
                onClick={handleImport}
                className="text-primary hover:text-primary glass-focus glass-touch-target glass-focus glass-touch-target glass-contrast-guard"
                title="Import Structure"
              >
                📁
              </button>
              <button
                onClick={clearPage}
                className="text-primary hover:text-primary glass-focus glass-touch-target glass-focus glass-touch-target glass-contrast-guard"
                title="Clear All"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        {/* Component Tree */}
        <div className="glass-flex-1 overflow-y-auto glass-p-2">
          {filteredComponents.length === 0 ? (
            <div className="glass-flex glass-items-center glass-justify-center glass-h-full">
              <div className="text-center">
                <div className="glass-text-4xl mb-4">🌳</div>
                <h3 className="glass-text-lg font-medium glass-text-secondary mb-2">
                  {searchQuery ? "No matches found" : "Empty Page"}
                </h3>
                <p className="glass-text-secondary glass-text-sm">
                  {searchQuery
                    ? "Try a different search term"
                    : "Start by adding components to your page"}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredComponents
                .filter((component: any) => !component.parent) // Only show root components
                .map((component: any) => (
                  <TreeItem
                    key={component.id}
                    component={component}
                    level={0}
                    isSelected={selectedComponent?.id === component.id}
                    onSelect={selectComponent}
                    onToggleExpand={toggleExpanded}
                    expandedItems={expandedItems}
                    componentDefinition={componentLibrary.find(
                      (def) => def.type === component.type
                    )}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="glass-p-4 glass-surface-subtle glass-border-t glass-border-subtle">
          <div className="glass-text-xs glass-text-secondary space-y-1">
            <div className="glass-flex glass-justify-between">
              <span>Total Components:</span>
              <span>{pageState.components.length}</span>
            </div>
            <div className="glass-flex glass-justify-between">
              <span>Root Components:</span>
              <span>
                {pageState.components.filter((c: any) => !c.parent).length}
              </span>
            </div>
            <div className="glass-flex glass-justify-between">
              <span>Selected:</span>
              <span>{selectedComponent ? selectedComponent.type : "None"}</span>
            </div>
          </div>
        </div>
      </Glass>
    </div>
  );
};
