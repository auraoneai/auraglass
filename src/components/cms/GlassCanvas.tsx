import React, { useRef, useCallback, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Glass } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import { useDragDrop, PageComponent } from "./GlassDragDropProvider";

interface CanvasProps {
  className?: string;
}

interface DropZoneProps {
  targetId?: string;
  position: "before" | "after" | "inside";
  isActive?: boolean;
  onDrop: (targetId?: string, position?: "before" | "after" | "inside") => void;
}

const DropZone: React.FC<DropZoneProps> = ({
  targetId,
  position,
  isActive,
  onDrop,
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(targetId, position);
  };

  return (
    <div
      data-glass-component
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        "transition-all duration-200",
        position === "inside"
          ? "absolute inset-0 rounded-lg"
          : "h-2 rounded-full my-1",
        isActive
          ? "bg-blue-500 bg-opacity-20 border-2 border-blue-500 border-dashed"
          : "bg-transparent hover:bg-blue-100 border-2 border-transparent"
      )}
    />
  );
};

const ComponentRenderer: React.FC<{
  component: PageComponent;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}> = ({ component, isSelected, onSelect }) => {
  const { updateComponent, dragDropState, onDragStart } = useDragDrop();
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(component.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (component.type === "text" || component.type === "heading") {
      setIsEditing("content");
    }
  };

  const handleInlineEdit = (prop: string, value: any) => {
    updateComponent(component.id, { [prop]: value });
    setIsEditing(null);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    onDragStart(component, "element");
  };

  const renderComponent = () => {
    const baseStyle: React.CSSProperties = {
      position: "relative",
      ...component.props,
    };

    switch (component.type) {
      case "container":
        return (
          <div
            style={{
              ...baseStyle,
              display: component.props.display || "block",
              padding: component.props.padding,
              margin: component.props.margin,
              backgroundColor: component.props.backgroundColor,
              borderRadius: component.props.borderRadius,
              maxWidth: component.props.maxWidth,
              minHeight: component.children.length === 0 ? "100px" : "auto",
            }}
            className={cn(
              "glass-relative",
              component.children.length === 0 &&
                "glass-border glass-border-2 glass-border-dashed glass-flex glass-items-center glass-justify-center"
            )}
          >
            {component.children.length === 0 ? (
              <span className="glass-text-secondary glass-text-sm">
                Drop components here
              </span>
            ) : (
              component.children.map((child: any) => (
                <ComponentRenderer
                  key={child.id}
                  component={child}
                  isSelected={isSelected}
                  onSelect={onSelect}
                />
              ))
            )}
          </div>
        );

      case "row":
        return (
          <div
            style={{
              ...baseStyle,
              display: "flex",
              gap: component.props.gap,
              justifyContent: component.props.justifyContent,
              alignItems: component.props.alignItems,
              flexWrap: component.props.wrap,
              padding: component.props.padding,
              minHeight: component.children.length === 0 ? "80px" : "auto",
            }}
            className={cn(
              "glass-relative",
              component.children.length === 0 &&
                "glass-border glass-border-2 glass-border-dashed glass-flex glass-items-center glass-justify-center"
            )}
          >
            {component.children.length === 0 ? (
              <span className="glass-text-secondary glass-text-sm">
                Add columns here
              </span>
            ) : (
              component.children.map((child: any) => (
                <ComponentRenderer
                  key={child.id}
                  component={child}
                  isSelected={isSelected}
                  onSelect={onSelect}
                />
              ))
            )}
          </div>
        );

      case "column":
        return (
          <div
            style={{
              ...baseStyle,
              display: "flex",
              flexDirection: "column",
              flex: component.props.flex,
              padding: component.props.padding,
              gap: component.props.gap,
              alignItems: component.props.alignItems,
              minHeight: component.children.length === 0 ? "120px" : "auto",
            }}
            className={cn(
              "glass-relative",
              component.children.length === 0 &&
                "glass-border glass-border-2 glass-border-dashed glass-flex glass-items-center glass-justify-center"
            )}
          >
            {component.children.length === 0 ? (
              <span className="glass-text-secondary glass-text-sm">
                Column content
              </span>
            ) : (
              component.children.map((child: any) => (
                <ComponentRenderer
                  key={child.id}
                  component={child}
                  isSelected={isSelected}
                  onSelect={onSelect}
                />
              ))
            )}
          </div>
        );

      case "text":
        return (
          <div
            style={{
              ...baseStyle,
              fontSize: component.props.fontSize,
              fontWeight: component.props.fontWeight,
              color: component.props.color,
              textAlign: component.props.textAlign,
              lineHeight: component.props.lineHeight,
              fontFamily: component.props.fontFamily,
            }}
          >
            {isEditing === "content" ? (
              <input
                type="text"
                value={component.props.content}
                onChange={(e) => handleInlineEdit("content", e.target.value)}
                onBlur={() => setIsEditing(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setIsEditing(null);
                  if (e.key === "Escape") setIsEditing(null);
                }}
                autoFocus
                className="bg-transparent glass-border-none outline-none glass-w-full"
              />
            ) : (
              component.props.content
            )}
          </div>
        );

      case "heading":
        const HeadingTag = component.props.level as keyof JSX.IntrinsicElements;
        const Tag = HeadingTag as any;
        return (
          <Tag
            style={{
              ...baseStyle,
              fontSize: component.props.fontSize,
              fontWeight: component.props.fontWeight,
              color: component.props.color,
              textAlign: component.props.textAlign,
              margin: component.props.margin,
            }}
          >
            {isEditing === "content" ? (
              <input
                type="text"
                value={component.props.content}
                onChange={(e) => handleInlineEdit("content", e.target.value)}
                onBlur={() => setIsEditing(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setIsEditing(null);
                  if (e.key === "Escape") setIsEditing(null);
                }}
                autoFocus
                className="bg-transparent glass-border-none outline-none glass-w-full"
              />
            ) : (
              component.props.content
            )}
          </Tag>
        );

      case "image":
        return (
          <img
            src={component.props.src}
            alt={component.props.alt}
            style={{
              ...baseStyle,
              width: component.props.width,
              height: component.props.height,
              borderRadius: component.props.borderRadius,
              objectFit: component.props.objectFit,
            }}
          />
        );

      case "button":
        const ButtonTag = component.props.href ? "a" : "button";
        return (
          <ButtonTag
            href={component.props.href || undefined}
            disabled={component.props.disabled}
            onClick={
              component.props.href
                ? undefined
                : () => {
                    if (component.props.onClick) {
                      try {
                        // eslint-disable-next-line no-new-func
                        new Function(component.props.onClick)();
                      } catch (e) {
                        console.warn("Button onClick error:", e);
                      }
                    }
                  }
            }
            className={cn(
              "glass-inline-flex glass-items-center glass-justify-center glass-font-medium glass-radius-lg",
              // Size variants
              component.props.size === "small" &&
                "glass-px-3 glass-py-1-5 glass-text-sm",
              component.props.size === "medium" &&
                "glass-px-4 glass-py-2 glass-text-base",
              component.props.size === "large" &&
                "glass-px-6 glass-py-3 glass-text-lg",
              // Variant styles
              component.props.variant === "primary" &&
                "glass-surface-primary glass-text-primary",
              component.props.variant === "secondary" &&
                "glass-surface-secondary glass-text-primary",
              component.props.variant === "outline" &&
                "glass-border glass-text-secondary",
              component.props.variant === "ghost" && "glass-text-secondary",
              // Disabled state
              component.props.disabled &&
                "glass-opacity-90 glass-cursor-pointer"
            )}
            style={baseStyle}
          >
            {component.props.text}
          </ButtonTag>
        );

      case "card":
        return (
          <div
            style={{
              ...baseStyle,
              padding: component.props.padding,
              borderRadius: component.props.borderRadius,
              backgroundColor: component.props.backgroundColor,
              boxShadow: component.props.boxShadow,
              border: component.props.border,
              minHeight: component.children.length === 0 ? "150px" : "auto",
            }}
            className={cn(
              "glass-relative",
              component.children.length === 0 &&
                "glass-border glass-border-2 glass-border-dashed glass-flex glass-items-center glass-justify-center"
            )}
          >
            {component.children.length === 0 ? (
              <span className="glass-text-secondary glass-text-sm glass-focus glass-touch-target glass-contrast-guard">
                Card content goes here
              </span>
            ) : (
              component.children.map((child: any) => (
                <ComponentRenderer
                  key={child.id}
                  component={child}
                  isSelected={isSelected}
                  onSelect={onSelect}
                />
              ))
            )}
          </div>
        );

      default:
        return (
          <div
            style={baseStyle}
            className="glass-p-4 glass-border glass-border-subtle glass-surface-subtle text-primary glass-contrast-guard"
          >
            Unknown component type: {component.type}
          </div>
        );
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={cn(
        "relative group transition-all duration-200 glass-focus glass-touch-target",
        isSelected && "ring-2 ring-blue-500 ring-opacity-50",
        dragDropState.draggedItem?.id === component.id && "opacity-50"
      )}
    >
      {renderComponent()}

      {/* Selection Overlay */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none glass-border-2 glass-radius glass-surface-overlay glass-focus glass-touch-target glass-contrast-guard">
          <div className="absolute glass-top-2 left-0 glass-surface-overlay text-primary glass-px-2 glass-py-1 glass-text-xs glass-radius-t font-medium glass-contrast-guard">
            {component.type}
          </div>
        </div>
      )}

      {/* Hover Overlay */}
      {!isSelected && (
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity glass-border-2 glass-border-blue glass-radius glass-surface-subtle bg-opacity-5 glass-contrast-guard">
          <div className="absolute -top-6 left-0 glass-surface-subtle text-primary glass-px-2 glass-py-1 glass-text-xs glass-radius-t font-medium glass-contrast-guard">
            {component.type}
          </div>
        </div>
      )}
    </div>
  );
};

export const GlassCanvas: React.FC<CanvasProps> = ({ className }) => {
  const prefersReducedMotion = useReducedMotion();
  const {
    pageState,
    dragDropState,
    onDrop,
    selectComponent,
    getSelectedComponent,
  } = useDragDrop();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragOverTarget, setDragOverTarget] = useState<{
    id?: string;
    position?: "before" | "after" | "inside";
  }>({});

  const handleCanvasClick = () => {
    selectComponent(undefined);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect =
      dragDropState.draggedType === "component" ? "copy" : "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop();
    setDragOverTarget({});
  };

  const breakpointStyles = {
    desktop: { maxWidth: "none", width: "100%" },
    tablet: { maxWidth: "768px", width: "768px" },
    mobile: { maxWidth: "375px", width: "375px" },
  };

  const selectedComponent = getSelectedComponent();

  return (
    <div
      className={cn("flex-1 h-full flex flex-col overflow-hidden", className)}
    >
      <Glass className="glass-flex-1 glass-flex glass-flex-col glass-contrast-guard">
        {/* Canvas Header */}
        <div className="glass-flex glass-items-center glass-justify-between glass-p-4 glass-border-b glass-border-subtle">
          <div className="glass-flex glass-items-center glass-gap-2">
            <span className="glass-text-sm font-medium glass-text-secondary">
              Canvas
            </span>
            <span className="glass-text-xs glass-text-secondary capitalize">
              ({pageState.activeBreakpoint})
            </span>
            {pageState.previewMode && (
              <span className="glass-px-2 glass-py-1 glass-text-xs glass-surface-subtle text-primary glass-radius glass-contrast-guard">
                Preview Mode
              </span>
            )}
          </div>

          <div className="glass-text-xs glass-text-secondary">
            {pageState.components.length} components
          </div>
        </div>

        {/* Canvas Content */}
        <div
          className="glass-flex-1 overflow-auto glass-p-6 glass-surface-subtle glass-contrast-guard"
          style={{
            backgroundImage: pageState.showGrid
              ? "radial-gradient(circle, var(--glass-gray-200) 1px, transparent 1px)"
              : "none",
            backgroundSize: pageState.showGrid ? "20px 20px" : "auto",
          }}
        >
          <div
            className="glass-mx-auto glass-surface-subtle glass-min-h-full glass-shadow-sm transition-all duration-300 glass-contrast-guard"
            style={breakpointStyles[pageState.activeBreakpoint]}
          >
            <div
              ref={canvasRef}
              onClick={handleCanvasClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={cn(
                "min-h-full relative transition-all duration-200 glass-focus glass-touch-target",
                dragDropState.isDragging && "bg-blue-50 bg-opacity-50"
              )}
            >
              {pageState.components.length === 0 ? (
                // Empty State
                <div className="glass-flex glass-items-center glass-justify-center glass-min-glass-h-96 glass-p-12 glass-focus glass-touch-target glass-contrast-guard">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="glass-text-lg font-medium glass-text-secondary mb-2">
                      Start Building Your Page
                    </h3>
                    <p className="glass-text-secondary mb-6 max-w-sm">
                      Drag components from the palette on the left to start
                      building your page.
                    </p>
                    <div className="space-y-2 glass-text-sm glass-text-secondary">
                      <p>💡 Try dragging a Container or Row component first</p>
                      <p>🖱️ Double-click text elements to edit them inline</p>
                      <p>⌨️ Use Ctrl+Z to undo changes</p>
                    </div>
                  </div>
                </div>
              ) : (
                // Render Components
                <div className="glass-p-4 space-y-4">
                  {pageState.components
                    .filter((component: any) => !component.parent) // Only root components
                    .map((component: any) => (
                      <div key={component.id} className="relative">
                        <DropZone
                          position="before"
                          isActive={
                            dragOverTarget.id === component.id &&
                            dragOverTarget.position === "before"
                          }
                          onDrop={onDrop}
                        />
                        <ComponentRenderer
                          component={component}
                          isSelected={
                            pageState.selectedComponent === component.id
                          }
                          onSelect={selectComponent}
                        />
                        <DropZone
                          position="after"
                          isActive={
                            dragOverTarget.id === component.id &&
                            dragOverTarget.position === "after"
                          }
                          onDrop={onDrop}
                        />
                      </div>
                    ))}

                  {/* Final Drop Zone */}
                  <DropZone
                    position="inside"
                    isActive={dragDropState.isDragging && !dragOverTarget.id}
                    onDrop={onDrop}
                  />
                </div>
              )}

              {/* Global Drop Zone Overlay */}
              {dragDropState.isDragging && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="glass-h-full glass-w-full glass-border-4 glass-border-dashed glass-border-blue opacity-50 glass-radius-lg" />
                </div>
              )}
            </div>
          </div>
        </div>
      </Glass>
    </div>
  );
};
