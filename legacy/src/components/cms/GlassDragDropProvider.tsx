"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  forwardRef,
} from "react";
import { cn } from "../../lib/utilsComprehensive";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export type ComponentPropValue = string | number | boolean | undefined;
export type ComponentProps = React.CSSProperties &
  Record<string, ComponentPropValue>;

export interface ComponentDefinition {
  id: string;
  type: string;
  name: string;
  icon: string;
  category: "layout" | "content" | "media" | "interactive" | "advanced";
  defaultProps: ComponentProps;
  editableProps: {
    [key: string]: {
      type:
        | "text"
        | "number"
        | "color"
        | "boolean"
        | "select"
        | "image"
        | "range";
      label: string;
      options?: string[];
      min?: number;
      max?: number;
      step?: number;
    };
  };
  allowChildren?: boolean;
  maxChildren?: number;
  acceptsTypes?: string[];
}

export interface PageComponent {
  id: string;
  type: string;
  props: ComponentProps;
  children: PageComponent[];
  parent?: string;
  order: number;
  locked?: boolean;
}

export interface DragDropState {
  isDragging: boolean;
  draggedItem?: ComponentDefinition | PageComponent;
  draggedType: "component" | "element" | null;
  dropTarget?: string;
  dropPosition?: "before" | "after" | "inside";
  previewPosition?: { x: number; y: number };
}

export interface PageBuilderState {
  components: PageComponent[];
  selectedComponent?: string;
  clipboardComponent?: PageComponent;
  history: PageComponent[][];
  historyIndex: number;
  previewMode: boolean;
  activeBreakpoint: "desktop" | "tablet" | "mobile";
  showGrid: boolean;
  snapToGrid: boolean;
}

export interface PageExportData {
  components: PageComponent[];
  timestamp: string;
  version: string;
}

interface DragDropContextValue {
  // Page Builder State
  pageState: PageBuilderState;

  // Component Library
  componentLibrary: ComponentDefinition[];

  // Drag & Drop
  dragDropState: DragDropState;
  onDragStart: (
    item: ComponentDefinition | PageComponent,
    type: "component" | "element"
  ) => void;
  onDragEnd: () => void;
  onDragOver: (
    targetId: string,
    position: "before" | "after" | "inside"
  ) => void;
  onDrop: (targetId?: string, position?: "before" | "after" | "inside") => void;

  // Component Management
  addComponent: (
    definition: ComponentDefinition,
    targetId?: string,
    position?: "before" | "after" | "inside"
  ) => void;
  updateComponent: (id: string, props: Partial<ComponentProps>) => void;
  deleteComponent: (id: string) => void;
  duplicateComponent: (id: string) => void;
  moveComponent: (
    id: string,
    targetId: string,
    position: "before" | "after" | "inside"
  ) => void;

  // Selection & Editing
  selectComponent: (id?: string) => void;
  getSelectedComponent: () => PageComponent | undefined;
  getComponentById: (id: string) => PageComponent | undefined;

  // History & Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveToHistory: () => void;

  // Clipboard
  copyComponent: (id: string) => void;
  pasteComponent: (targetId?: string) => void;

  // Page Management
  clearPage: () => void;
  exportPage: () => PageExportData;
  importPage: (data: Partial<PageExportData>) => void;

  // View Options
  togglePreviewMode: () => void;
  setActiveBreakpoint: (breakpoint: "desktop" | "tablet" | "mobile") => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;
}

const DragDropContext = createContext<DragDropContextValue | null>(null);

// Default component library
const defaultComponentLibrary: ComponentDefinition[] = [
  // Layout Components
  {
    id: "container",
    type: "container",
    name: "Container",
    icon: "📦",
    category: "layout",
    defaultProps: {
      padding: "16px",
      margin: "0px",
      backgroundColor: "transparent",
      borderRadius: "0px",
      maxWidth: "100%",
      display: "block",
    },
    editableProps: {
      padding: { type: "text", label: "Padding" },
      margin: { type: "text", label: "Margin" },
      backgroundColor: { type: "color", label: "Background Color" },
      borderRadius: { type: "text", label: "Border Radius" },
      maxWidth: { type: "text", label: "Max Width" },
      display: {
        type: "select",
        label: "Display",
        options: ["block", "flex", "grid", "inline-block"],
      },
    },
    allowChildren: true,
  },
  {
    id: "row",
    type: "row",
    name: "Row",
    icon: "↔️",
    category: "layout",
    defaultProps: {
      gap: "16px",
      justifyContent: "flex-start",
      alignItems: "stretch",
      wrap: "nowrap",
      padding: "0px",
    },
    editableProps: {
      gap: { type: "text", label: "Gap" },
      justifyContent: {
        type: "select",
        label: "Justify Content",
        options: [
          "flex-start",
          "center",
          "flex-end",
          "space-between",
          "space-around",
        ],
      },
      alignItems: {
        type: "select",
        label: "Align Items",
        options: ["stretch", "flex-start", "center", "flex-end"],
      },
      wrap: {
        type: "select",
        label: "Flex Wrap",
        options: ["nowrap", "wrap", "wrap-reverse"],
      },
      padding: { type: "text", label: "Padding" },
    },
    allowChildren: true,
    acceptsTypes: ["column", "container", "text", "image", "button"],
  },
  {
    id: "column",
    type: "column",
    name: "Column",
    icon: "↕️",
    category: "layout",
    defaultProps: {
      flex: "1",
      padding: "16px",
      gap: "8px",
      alignItems: "stretch",
    },
    editableProps: {
      flex: { type: "text", label: "Flex" },
      padding: { type: "text", label: "Padding" },
      gap: { type: "text", label: "Gap" },
      alignItems: {
        type: "select",
        label: "Align Items",
        options: ["stretch", "flex-start", "center", "flex-end"],
      },
    },
    allowChildren: true,
  },

  // Content Components
  {
    id: "text",
    type: "text",
    name: "Text",
    icon: "📝",
    category: "content",
    defaultProps: {
      content: "Edit this text",
      fontSize: "16px",
      fontWeight: "400",
      color: "var(--glass-gray-700)",
      textAlign: "left",
      lineHeight: "1.5",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    editableProps: {
      content: { type: "text", label: "Content" },
      fontSize: { type: "text", label: "Font Size" },
      fontWeight: {
        type: "select",
        label: "Font Weight",
        options: [
          "100",
          "200",
          "300",
          "400",
          "500",
          "600",
          "700",
          "800",
          "900",
        ],
      },
      color: { type: "color", label: "Text Color" },
      textAlign: {
        type: "select",
        label: "Text Align",
        options: ["left", "center", "right", "justify"],
      },
      lineHeight: { type: "text", label: "Line Height" },
      fontFamily: { type: "text", label: "Font Family" },
    },
    allowChildren: false,
  },
  {
    id: "heading",
    type: "heading",
    name: "Heading",
    icon: "🏷️",
    category: "content",
    defaultProps: {
      content: "Heading Text",
      level: "h2",
      fontSize: "32px",
      fontWeight: "600",
      color: "var(--glass-gray-900)",
      textAlign: "left",
      margin: "16px 0",
    },
    editableProps: {
      content: { type: "text", label: "Content" },
      level: {
        type: "select",
        label: "Heading Level",
        options: ["h1", "h2", "h3", "h4", "h5", "h6"],
      },
      fontSize: { type: "text", label: "Font Size" },
      fontWeight: {
        type: "select",
        label: "Font Weight",
        options: ["300", "400", "500", "600", "700", "800", "900"],
      },
      color: { type: "color", label: "Text Color" },
      textAlign: {
        type: "select",
        label: "Text Align",
        options: ["left", "center", "right"],
      },
      margin: { type: "text", label: "Margin" },
    },
    allowChildren: false,
  },

  // Media Components
  {
    id: "image",
    type: "image",
    name: "Image",
    icon: "🖼️",
    category: "media",
    defaultProps: {
      src: "https://via.placeholder.com/400x300",
      alt: "Placeholder image",
      width: "100%",
      height: "auto",
      borderRadius: "0px",
      objectFit: "cover",
    },
    editableProps: {
      src: { type: "image", label: "Image Source" },
      alt: { type: "text", label: "Alt Text" },
      width: { type: "text", label: "Width" },
      height: { type: "text", label: "Height" },
      borderRadius: { type: "text", label: "Border Radius" },
      objectFit: {
        type: "select",
        label: "Object Fit",
        options: ["cover", "contain", "fill", "scale-down", "none"],
      },
    },
    allowChildren: false,
  },

  // Interactive Components
  {
    id: "button",
    type: "button",
    name: "Button",
    icon: "🔘",
    category: "interactive",
    defaultProps: {
      text: "Click me",
      variant: "primary",
      size: "medium",
      disabled: false,
      href: "",
      onClick: 'alert("Button clicked!")',
    },
    editableProps: {
      text: { type: "text", label: "Button Text" },
      variant: {
        type: "select",
        label: "Variant",
        options: ["primary", "secondary", "outline", "ghost"],
      },
      size: {
        type: "select",
        label: "Size",
        options: ["small", "medium", "large"],
      },
      disabled: { type: "boolean", label: "Disabled" },
      href: { type: "text", label: "Link URL" },
      onClick: { type: "text", label: "On Click (JavaScript)" },
    },
    allowChildren: false,
  },

  // Advanced Components
  {
    id: "card",
    type: "card",
    name: "Card",
    icon: "🃏",
    category: "advanced",
    defaultProps: {
      padding: "24px",
      borderRadius: "12px",
      backgroundColor: "var(--glass-white)",
      boxShadow: "var(--glass-elev-2)",
      border: "1px solid var(--glass-gray-200)",
    },
    editableProps: {
      padding: { type: "text", label: "Padding" },
      borderRadius: { type: "text", label: "Border Radius" },
      backgroundColor: { type: "color", label: "Background Color" },
      boxShadow: { type: "text", label: "Box Shadow" },
      border: { type: "text", label: "Border" },
    },
    allowChildren: true,
  },
];

export interface GlassDragDropProviderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const DragDropProvider = forwardRef<
  HTMLDivElement,
  GlassDragDropProviderProps
>(({ children, className, ...props }, ref) => {
  const [dragDropState, setDragDropState] = useState<DragDropState>({
    isDragging: false,
    draggedType: null,
  });

  const [pageState, setPageState] = useState<PageBuilderState>({
    components: [],
    history: [[]],
    historyIndex: 0,
    previewMode: false,
    activeBreakpoint: "desktop",
    showGrid: false,
    snapToGrid: true,
  });

  const componentCounter = useRef(0);

  const generateId = useCallback(() => {
    return `comp_${Date.now()}_${++componentCounter.current}`;
  }, []);

  const saveToHistory = useCallback(() => {
    setPageState((prev) => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push([...prev.components]);
      return {
        ...prev,
        history: newHistory.slice(-50), // Keep last 50 states
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  const onDragStart = useCallback(
    (
      item: ComponentDefinition | PageComponent,
      type: "component" | "element"
    ) => {
      setDragDropState({
        isDragging: true,
        draggedItem: item,
        draggedType: type,
      });
    },
    []
  );

  const onDragEnd = useCallback(() => {
    setDragDropState({
      isDragging: false,
      draggedType: null,
    });
  }, []);

  const onDragOver = useCallback(
    (targetId: string, position: "before" | "after" | "inside") => {
      setDragDropState((prev) => ({
        ...prev,
        dropTarget: targetId,
        dropPosition: position,
      }));
    },
    []
  );

  const onDrop = useCallback(
    (targetId?: string, position?: "before" | "after" | "inside") => {
      if (!dragDropState.draggedItem || !dragDropState.draggedType) return;

      if (dragDropState.draggedType === "component") {
        addComponent(
          dragDropState.draggedItem as ComponentDefinition,
          targetId,
          position
        );
      } else if (dragDropState.draggedType === "element") {
        const element = dragDropState.draggedItem as PageComponent;
        if (targetId && element.id !== targetId) {
          moveComponent(element.id, targetId, position || "inside");
        }
      }

      onDragEnd();
    },
    [dragDropState]
  );

  const addComponent = useCallback(
    (
      definition: ComponentDefinition,
      targetId?: string,
      position?: "before" | "after" | "inside"
    ) => {
      const newComponent: PageComponent = {
        id: generateId(),
        type: definition.type,
        props: { ...definition.defaultProps },
        children: [],
        parent: targetId && position === "inside" ? targetId : undefined,
        order: 0,
      };

      setPageState((prev) => {
        const components = [...prev.components];

        if (targetId && position) {
          const targetIndex = components.findIndex((c) => c.id === targetId);
          if (targetIndex !== -1) {
            switch (position) {
              case "before":
                components.splice(targetIndex, 0, newComponent);
                break;
              case "after":
                components.splice(targetIndex + 1, 0, newComponent);
                break;
              case "inside":
                newComponent.parent = targetId;
                const target = components[targetIndex];
                if (target) {
                  target.children.push(newComponent);
                }
                break;
            }
          }
        } else {
          components.push(newComponent);
        }

        return {
          ...prev,
          components,
          selectedComponent: newComponent.id,
        };
      });

      saveToHistory();
    },
    [generateId, saveToHistory]
  );

  const updateComponent = useCallback(
    (id: string, props: Partial<ComponentProps>) => {
      setPageState((prev) => {
        const updateInArray = (
          components: PageComponent[]
        ): PageComponent[] => {
          return components.map((component) => {
            if (component.id === id) {
              return { ...component, props: { ...component.props, ...props } };
            }
            if (component.children.length > 0) {
              return {
                ...component,
                children: updateInArray(component.children),
              };
            }
            return component;
          });
        };

        return {
          ...prev,
          components: updateInArray(prev.components),
        };
      });
    },
    []
  );

  const deleteComponent = useCallback(
    (id: string) => {
      setPageState((prev) => {
        const removeFromArray = (
          components: PageComponent[]
        ): PageComponent[] => {
          return components.filter((component) => {
            if (component.id === id) return false;
            component.children = removeFromArray(component.children);
            return true;
          });
        };

        return {
          ...prev,
          components: removeFromArray(prev.components),
          selectedComponent:
            prev.selectedComponent === id ? undefined : prev.selectedComponent,
        };
      });
      saveToHistory();
    },
    [saveToHistory]
  );

  const duplicateComponent = useCallback(
    (id: string) => {
      setPageState((prev) => {
        const findComponent = (
          components: PageComponent[]
        ): PageComponent | null => {
          for (const component of components) {
            if (component.id === id) return component;
            const found = findComponent(component.children);
            if (found) return found;
          }
          return null;
        };

        const original = findComponent(prev.components);
        if (!original) return prev;

        const duplicateRecursive = (comp: PageComponent): PageComponent => ({
          ...comp,
          id: generateId(),
          children: comp.children.map(duplicateRecursive),
        });

        const duplicate = duplicateRecursive(original);

        return {
          ...prev,
          components: [...prev.components, duplicate],
          selectedComponent: duplicate.id,
        };
      });
      saveToHistory();
    },
    [generateId, saveToHistory]
  );

  const moveComponent = useCallback(
    (id: string, targetId: string, position: "before" | "after" | "inside") => {
      // Implementation for moving components within the tree
      saveToHistory();
    },
    [saveToHistory]
  );

  const selectComponent = useCallback((id?: string) => {
    setPageState((prev) => ({
      ...prev,
      selectedComponent: id,
    }));
  }, []);

  const getSelectedComponent = useCallback((): PageComponent | undefined => {
    if (!pageState.selectedComponent) return undefined;

    const findInArray = (
      components: PageComponent[]
    ): PageComponent | undefined => {
      for (const component of components) {
        if (component.id === pageState.selectedComponent) return component;
        const found = findInArray(component.children);
        if (found) return found;
      }
      return undefined;
    };

    return findInArray(pageState.components);
  }, [pageState.selectedComponent, pageState.components]);

  const getComponentById = useCallback(
    (id: string): PageComponent | undefined => {
      const findInArray = (
        components: PageComponent[]
      ): PageComponent | undefined => {
        for (const component of components) {
          if (component.id === id) return component;
          const found = findInArray(component.children);
          if (found) return found;
        }
        return undefined;
      };

      return findInArray(pageState.components);
    },
    [pageState.components]
  );

  const undo = useCallback(() => {
    setPageState((prev) => {
      if (prev.historyIndex > 0) {
        return {
          ...prev,
          components: prev.history[prev.historyIndex - 1],
          historyIndex: prev.historyIndex - 1,
        };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setPageState((prev) => {
      if (prev.historyIndex < prev.history.length - 1) {
        return {
          ...prev,
          components: prev.history[prev.historyIndex + 1],
          historyIndex: prev.historyIndex + 1,
        };
      }
      return prev;
    });
  }, []);

  const canUndo = useCallback(
    () => pageState.historyIndex > 0,
    [pageState.historyIndex]
  );
  const canRedo = useCallback(
    () => pageState.historyIndex < pageState.history.length - 1,
    [pageState.historyIndex, pageState.history.length]
  );

  const copyComponent = useCallback(
    (id: string) => {
      const component = getComponentById(id);
      if (component) {
        setPageState((prev) => ({
          ...prev,
          clipboardComponent: component,
        }));
      }
    },
    [getComponentById]
  );

  const pasteComponent = useCallback(
    (targetId?: string) => {
      if (pageState.clipboardComponent) {
        const definition: ComponentDefinition = {
          id: pageState.clipboardComponent.type,
          type: pageState.clipboardComponent.type,
          name: pageState.clipboardComponent.type,
          icon: "📋",
          category: "content",
          defaultProps: pageState.clipboardComponent.props,
          editableProps: {},
        };
        addComponent(definition, targetId);
      }
    },
    [pageState.clipboardComponent, addComponent]
  );

  const clearPage = useCallback(() => {
    setPageState((prev) => ({
      ...prev,
      components: [],
      selectedComponent: undefined,
    }));
    saveToHistory();
  }, [saveToHistory]);

  const exportPage = useCallback((): PageExportData => {
    return {
      components: pageState.components,
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    };
  }, [pageState.components]);

  const importPage = useCallback(
    (data: Partial<PageExportData>) => {
      const importedComponents = data.components;
      if (importedComponents) {
        setPageState((prev) => ({
          ...prev,
          components: importedComponents,
          selectedComponent: undefined,
        }));
        saveToHistory();
      }
    },
    [saveToHistory]
  );

  const togglePreviewMode = useCallback(() => {
    setPageState((prev) => ({ ...prev, previewMode: !prev.previewMode }));
  }, []);

  const setActiveBreakpoint = useCallback(
    (breakpoint: "desktop" | "tablet" | "mobile") => {
      setPageState((prev) => ({ ...prev, activeBreakpoint: breakpoint }));
    },
    []
  );

  const toggleGrid = useCallback(() => {
    setPageState((prev) => ({ ...prev, showGrid: !prev.showGrid }));
  }, []);

  const toggleSnapToGrid = useCallback(() => {
    setPageState((prev) => ({ ...prev, snapToGrid: !prev.snapToGrid }));
  }, []);

  const value: DragDropContextValue = {
    pageState,
    componentLibrary: defaultComponentLibrary,
    dragDropState,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    addComponent,
    updateComponent,
    deleteComponent,
    duplicateComponent,
    moveComponent,
    selectComponent,
    getSelectedComponent,
    getComponentById,
    undo,
    redo,
    canUndo,
    canRedo,
    saveToHistory,
    copyComponent,
    pasteComponent,
    clearPage,
    exportPage,
    importPage,
    togglePreviewMode,
    setActiveBreakpoint,
    toggleGrid,
    toggleSnapToGrid,
  };

  return (
    <div
      ref={ref}
      className={cn("glass-dragdrop-provider", className)}
      data-glass-component
      {...props}
    >
      <DragDropContext.Provider value={value}>
        {children}
      </DragDropContext.Provider>
    </div>
  );
});

DragDropProvider.displayName = "GlassDragDropProvider";

export { DragDropProvider as GlassDragDropProvider };

const defaultDragDropContext: DragDropContextValue = {
  pageState: {
    components: [],
    history: [[]],
    historyIndex: 0,
    previewMode: false,
    activeBreakpoint: "desktop",
    showGrid: true,
    snapToGrid: true,
  },
  componentLibrary: defaultComponentLibrary,
  dragDropState: {
    isDragging: false,
    draggedType: null,
  },
  onDragStart: () => {},
  onDragEnd: () => {},
  onDragOver: () => {},
  onDrop: () => {},
  addComponent: () => {},
  updateComponent: () => {},
  deleteComponent: () => {},
  duplicateComponent: () => {},
  moveComponent: () => {},
  selectComponent: () => {},
  getSelectedComponent: () => undefined,
  getComponentById: () => undefined,
  undo: () => {},
  redo: () => {},
  canUndo: () => false,
  canRedo: () => false,
  saveToHistory: () => {},
  copyComponent: () => {},
  pasteComponent: () => {},
  clearPage: () => {},
  exportPage: () => ({
    components: [],
    timestamp: new Date(0).toISOString(),
    version: "standalone",
  }),
  importPage: () => {},
  togglePreviewMode: () => {},
  setActiveBreakpoint: () => {},
  toggleGrid: () => {},
  toggleSnapToGrid: () => {},
};

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  return context ?? defaultDragDropContext;
};
