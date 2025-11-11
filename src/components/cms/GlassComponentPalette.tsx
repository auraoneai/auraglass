"use client";
import React, { useState } from "react";
import { Glass } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import { useDragDrop, ComponentDefinition } from "./GlassDragDropProvider";

interface ComponentPaletteProps {
  className?: string;
  "data-testid"?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const CategoryIcon: React.FC<{ category: ComponentDefinition["category"] }> = ({
  category,
}) => {
  const icons = {
    layout: "🏗️",
    content: "📝",
    media: "🎬",
    interactive: "🎯",
    advanced: "⚡",
  };

  return <span className="glass-text-lg">{icons[category]}</span>;
};

const ComponentItem: React.FC<{
  component: ComponentDefinition;
  isDragging?: boolean;
}> = ({ component, isDragging }) => {
  const { onDragStart } = useDragDrop();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "copy";
    onDragStart(component, "component");
  };

  const handleMouseDown = () => {
    onDragStart(component, "component");
  };

  return (
    <div
      data-glass-component
      draggable
      onDragStart={handleDragStart}
      onMouseDown={handleMouseDown}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-grab",
        "hover:border-blue-300 hover:bg-blue-50 transition-colors",
        "active:cursor-grabbing active:scale-95",
        isDragging && "opacity-50 scale-95"
      )}
      title={`Drag to add ${component.name}`}
    >
      <div className="glass-text-2xl">{component.icon}</div>
      <div className="glass-flex-1 min-glass-w-0">
        <div className="glass-text-sm font-medium glass-text-secondary truncate">
          {component.name}
        </div>
        <div className="glass-text-xs glass-text-secondary capitalize">
          {component.category}
        </div>
      </div>
      <div className="glass-text-xs glass-text-secondary">⋯</div>
    </div>
  );
};

const CategorySection: React.FC<{
  category: ComponentDefinition["category"];
  components: ComponentDefinition[];
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ category, components, isExpanded, onToggle }) => {
  const categoryNames = {
    layout: "Layout",
    content: "Content",
    media: "Media",
    interactive: "Interactive",
    advanced: "Advanced",
  };

  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="glass-flex glass-items-center glass-justify-between glass-w-full glass-p-2 glass-radius-lg hover:glass-surface-subtle transition-colors glass-focus glass-touch-target glass-focus glass-touch-target glass-contrast-guard"
      >
        <div className="glass-flex glass-items-center glass-gap-2">
          <CategoryIcon category={category} />
          <span className="glass-text-sm font-medium glass-text-secondary">
            {categoryNames[category]}
          </span>
          <span className="glass-text-xs glass-text-secondary">
            ({components.length})
          </span>
        </div>
        <div
          className={cn(
            "text-gray-400 transition-transform",
            isExpanded ? "rotate-90" : "rotate-0"
          )}
        >
          ▶
        </div>
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-2 pl-4">
          {components.map((component: any) => (
            <ComponentItem key={component.id} component={component} />
          ))}
        </div>
      )}
    </div>
  );
};

export const GlassComponentPalette: React.FC<ComponentPaletteProps> = ({
  className,
  "data-testid": testId,
  collapsed = false,
  onToggleCollapse,
}) => {
  const { componentLibrary, dragDropState } = useDragDrop();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["layout", "content"])
  );
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev: Set<string>) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // Group components by category
  const componentsByCategory = componentLibrary.reduce(
    (acc, component) => {
      if (!acc[component.category]) {
        acc[component.category] = [];
      }
      acc[component.category].push(component);
      return acc;
    },
    {} as Record<string, ComponentDefinition[]>
  );

  // Filter components by search query
  const filteredComponents = searchQuery
    ? componentLibrary.filter(
        (component: any) =>
          component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          component.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  if (collapsed) {
    return (
      <div className={cn("w-12", className)} data-testid={testId}>
        <Glass className="glass-h-full glass-contrast-guard">
          <button
            onClick={onToggleCollapse}
            className="glass-flex glass-items-center glass-justify-center glass-w-full h-12 glass-text-secondary hover:glass-text-secondary transition-colors glass-focus glass-touch-target glass-focus glass-touch-target glass-contrast-guard"
            title="Expand Component Palette"
          >
            <div className="glass-text-lg">📦</div>
          </button>
        </Glass>
      </div>
    );
  }

  return (
    <div
      className={cn("w-80 h-full flex flex-col", className)}
      data-testid={testId}
      role="complementary"
      aria-label="Component palette"
    >
      <Glass className="glass-h-full glass-flex glass-flex-col glass-contrast-guard">
        {/* Header */}
        <div className="glass-flex glass-items-center glass-justify-between glass-p-4 glass-border-b glass-border-subtle">
          <h2 className="glass-text-lg font-semibold glass-text-secondary">
            Components
          </h2>
          <button
            onClick={onToggleCollapse}
            className="glass-p-2 glass-text-secondary hover:glass-text-secondary transition-colors glass-focus glass-touch-target glass-focus glass-touch-target glass-contrast-guard"
            title="Collapse Palette"
          >
            ◀
          </button>
        </div>

        {/* Search */}
        <div className="glass-p-4 glass-border-b glass-border-subtle">
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
        </div>

        {/* Components */}
        <div className="glass-flex-1 overflow-y-auto glass-p-4">
          {searchQuery && filteredComponents ? (
            // Search Results
            <div className="space-y-2">
              <div className="glass-text-sm glass-text-secondary mb-3">
                {filteredComponents.length} components found
              </div>
              {filteredComponents.map((component: any) => (
                <ComponentItem
                  key={component.id}
                  component={component}
                  isDragging={dragDropState.draggedItem?.id === component.id}
                />
              ))}
              {filteredComponents.length === 0 && (
                <div className="text-center glass-py-8 glass-text-secondary">
                  <div className="glass-text-2xl mb-2">🔍</div>
                  <p>No components found</p>
                  <p className="glass-text-xs">Try a different search term</p>
                </div>
              )}
            </div>
          ) : (
            // Categories
            <div>
              {Object.entries(componentsByCategory).map(
                ([category, components]) => (
                  <CategorySection
                    key={category}
                    category={category as ComponentDefinition["category"]}
                    components={components}
                    isExpanded={expandedCategories.has(category)}
                    onToggle={() => toggleCategory(category)}
                  />
                )
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="glass-p-4 glass-border-t glass-border-subtle glass-surface-subtle">
          <div className="glass-text-xs glass-text-secondary text-center">
            💡 Drag components onto the canvas to add them
          </div>
        </div>
      </Glass>
    </div>
  );
};
