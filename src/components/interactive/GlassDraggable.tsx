import { cn } from "../../lib/utilsComprehensive";
import { GripVertical, Move } from "lucide-react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Motion } from "../../primitives";

export interface DragData {
  id: string;
  type: string;
  data?: any;
}

export interface GlassDraggableProps {
  /**
   * Unique identifier for the draggable item
   */
  id: string;
  /**
   * Drag type/category
   */
  type: string;
  /**
   * Additional data to pass during drag
   */
  data?: any;
  /**
   * Drag handle element
   */
  handle?: React.ReactNode;
  /**
   * Children to render
   */
  children: React.ReactNode;
  /**
   * Enable dragging
   */
  disabled?: boolean;
  /**
   * Drag start handler
   */
  onDragStart?: (data: DragData) => void;
  /**
   * Drag end handler
   */
  onDragEnd?: (data: DragData) => void;
  /**
   * Custom className
   */
  className?: string;
}

// Drag Context
interface DragContextType {
  draggedItem: DragData | null;
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  setDraggedItem: (item: DragData | null) => void;
  setIsDragging: (dragging: boolean) => void;
  setDragOffset: (offset: { x: number; y: number }) => void;
}

const DragContext = createContext<DragContextType | null>(null);

export const useDragContext = () => {
  const context = useContext(DragContext);
  if (!context) {
    console.warn(
      "useDragContext must be used within a DragProvider. Using default values."
    );
    return {
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      setIsDragging: () => {},
      setDragOffset: () => {},
    };
  }
  return context;
};

/**
 * GlassDraggable component
 * Makes any element draggable with visual feedback
 */
export const GlassDraggable: React.FC<GlassDraggableProps> = ({
  id,
  type,
  data,
  handle,
  children,
  disabled = false,
  onDragStart,
  onDragEnd,
  className,
  ...props
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const elementStartPos = useRef({ x: 0, y: 0 });

  const dragData: DragData = { id, type, data };

  // Handle mouse down
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;

      e.preventDefault();
      const rect = dragRef.current?.getBoundingClientRect();
      if (!rect) return;

      dragStartPos.current = { x: e.clientX, y: e.clientY };
      elementStartPos.current = { x: rect.left, y: rect.top };

      setIsDragging(true);
      setDragOffset({ x: 0, y: 0 });

      onDragStart?.(dragData);

      // Add global event listeners
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [disabled, dragData, onDragStart]
  );

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;

      setDragOffset({ x: deltaX, y: deltaY });
    },
    [isDragging]
  );

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });

    onDragEnd?.(dragData);

    // Remove global event listeners
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [isDragging, dragData, onDragEnd]);

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Default drag handle
  const defaultHandle = handle || (
    <div className="glass-flex glass-items-center glass-justify-center w-6 h-6 text-primary/60 hover:text-primary cursor-grab active:cursor-grabbing">
      <GripVertical className="w-4 h-4" />
    </div>
  );

  return (
    <Motion
      data-glass-component
      preset="fadeIn"
      className={cn(
        "relative cursor-grab active:cursor-grabbing select-none",
        isDragging && "z-50",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      style={
        isDragging
          ? {
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
              zIndex: 50,
            }
          : undefined
      }
      ref={dragRef}
      onMouseDown={handleMouseDown}
      {...props}
    >
      {/* Drag Handle */}
      <div className="absolute glass-top-2 right-2 z-10">{defaultHandle}</div>

      {/* Content */}
      <div
        className={cn(
          "transition-all duration-200",
          isDragging && "shadow-2xl scale-105 rotate-2"
        )}
      >
        {children}
      </div>

      {/* Drag Preview (ghost image) */}
      {isDragging && (
        <div
          className="fixed pointer-events-none z-40 opacity-50"
          style={{
            left: elementStartPos.current.x,
            top: elementStartPos.current.y,
            transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
          }}
        >
          <div className="scale-95">{children}</div>
        </div>
      )}
    </Motion>
  );
};

/**
 * GlassDroppable component
 * Drop zone that accepts draggable items
 */
export interface GlassDroppableProps {
  /**
   * Unique identifier for the drop zone
   */
  id: string;
  /**
   * Accepted drag types
   */
  accept?: string[];
  /**
   * Children to render
   */
  children: React.ReactNode;
  /**
   * Disable dropping
   */
  disabled?: boolean;
  /**
   * Drop handler
   */
  onDrop?: (data: DragData, dropZoneId: string) => void;
  /**
   * Drag over handler
   */
  onDragOver?: (data: DragData, dropZoneId: string) => void;
  /**
   * Drag leave handler
   */
  onDragLeave?: (data: DragData, dropZoneId: string) => void;
  /**
   * Custom className
   */
  className?: string;
}

export const GlassDroppable: React.FC<GlassDroppableProps> = ({
  id,
  accept = [],
  children,
  disabled = false,
  onDrop,
  onDragOver,
  onDragLeave,
  className,
  ...props
}) => {
  const [isOver, setIsOver] = useState(false);
  const [isValidDrop, setIsValidDrop] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Handle drag over
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled) return;

      const dragData = JSON.parse(e.dataTransfer.getData("application/json"));
      const isAccepted =
        (accept?.length || 0) === 0 || accept.includes(dragData.type);

      setIsOver(true);
      setIsValidDrop(isAccepted);

      if (isAccepted) {
        onDragOver?.(dragData, id);
      }
    },
    [disabled, accept, onDragOver, id]
  );

  // Handle drag leave
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    // Only trigger leave if we're actually leaving the drop zone
    const rect = dropRef.current?.getBoundingClientRect();
    if (rect) {
      const { clientX, clientY } = e;
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        setIsOver(false);
        setIsValidDrop(false);
      }
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled) return;

      const dragData = JSON.parse(e.dataTransfer.getData("application/json"));
      const isAccepted =
        (accept?.length || 0) === 0 || accept.includes(dragData.type);

      setIsOver(false);
      setIsValidDrop(false);

      if (isAccepted) {
        onDrop?.(dragData, id);
      }
    },
    [disabled, accept, onDrop, id]
  );

  return (
    <div
      ref={dropRef}
      className={cn(
        "relative transition-all duration-200",
        isOver && isValidDrop && "ring-2 ring-primary ring-opacity-50",
        isOver && !isValidDrop && "ring-2 ring-red-500 ring-opacity-50",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      {...props}
    >
      {/* Drop Indicator */}
      {isOver && (
        <div
          className={cn(
            "absolute inset-0 border-2 border-dashed glass-radius-lg flex items-center justify-center",
            isValidDrop
              ? "border-primary bg-primary/10"
              : "border-red-500 bg-red-500/10"
          )}
        >
          <div className="text-center">
            <Move
              className={cn(
                "w-8 h-8 mx-auto glass-mb-2",
                isValidDrop ? "text-primary" : "text-red-500"
              )}
            />
            <p
              className={cn(
                "glass-text-sm font-medium",
                isValidDrop ? "text-primary" : "text-red-500"
              )}
            >
              {isValidDrop ? "Drop here" : "Cannot drop here"}
            </p>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

/**
 * GlassSortable component
 * Sortable list with drag-and-drop reordering
 */
export interface SortableItem {
  id: string;
  content: React.ReactNode;
  data?: any;
}

export interface GlassSortableProps {
  /**
   * Items to sort
   */
  items: SortableItem[];
  /**
   * Sort direction
   */
  direction?: "vertical" | "horizontal";
  /**
   * Item change handler
   */
  onChange?: (items: SortableItem[]) => void;
  /**
   * Custom className
   */
  className?: string;
}

export const GlassSortable: React.FC<GlassSortableProps> = ({
  items,
  direction = "vertical",
  onChange,
  className,
  ...props
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Handle drag start
  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  }, []);

  // Handle drop
  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();

      if (draggedIndex === null || draggedIndex === dropIndex) {
        setDraggedIndex(null);
        setDragOverIndex(null);
        return;
      }

      const newItems = [...items];
      const [draggedItem] = newItems.splice(draggedIndex, 1);
      newItems.splice(dropIndex, 0, draggedItem);

      onChange?.(newItems);
      setDraggedIndex(null);
      setDragOverIndex(null);
    },
    [draggedIndex, items, onChange]
  );

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  return (
    <div
      className={cn(
        "glass-gap-2",
        direction === "horizontal" && "flex space-y-0 glass-gap-2",
        className
      )}
      {...props}
    >
      {items.map((item, index) => (
        <div
          key={item?.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={cn(
            "relative cursor-move transition-all duration-200",
            draggedIndex === index && "opacity-50 scale-95",
            dragOverIndex === index && "ring-2 ring-primary ring-opacity-50"
          )}
        >
          {/* Drag Handle */}
          <div className="absolute glass-top-2 right-2 z-10">
            <div className="glass-flex glass-items-center glass-justify-center w-6 h-6 text-primary/60 hover:text-primary cursor-grab active:cursor-grabbing glass-surface-dark/20 glass-radius-md">
              <Move className="w-4 h-4" />
            </div>
          </div>

          {/* Content */}
          <div className={cn(dragOverIndex === index && "scale-105")}>
            {item?.content}
          </div>

          {/* Drop Indicator */}
          {dragOverIndex === index && draggedIndex !== index && (
            <div
              className={cn(
                "absolute inset-0 border-2 border-dashed border-primary glass-radius-lg pointer-events-none",
                direction === "vertical"
                  ? "border-t-0 border-b-0"
                  : "border-l-0 border-r-0"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * DragProvider component
 * Provides drag context for advanced drag-and-drop scenarios
 */
export interface DragProviderProps {
  children: React.ReactNode;
  onDragStart?: (data: DragData) => void;
  onDragEnd?: (data: DragData) => void;
}

export const DragProvider: React.FC<DragProviderProps> = ({
  children,
  onDragStart,
  onDragEnd,
}) => {
  const [draggedItem, setDraggedItem] = useState<DragData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const contextValue: DragContextType = {
    draggedItem,
    isDragging,
    dragOffset,
    setDraggedItem: (item) => {
      setDraggedItem(item);
      onDragStart?.(item!);
    },
    setIsDragging,
    setDragOffset,
  };

  return (
    <DragContext.Provider value={contextValue}>{children}</DragContext.Provider>
  );
};

export default GlassDraggable;
