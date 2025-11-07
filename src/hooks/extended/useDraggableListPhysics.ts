import React from 'react';
import { useRef, useState, useCallback, useEffect } from 'react';
import { useMultiSpring, SpringConfig } from '../../animations/hooks/useMultiSpringBasic';

export interface DraggableItem {
  id: string;
  content: React.ReactNode;
  data?: any;
}

export interface DragState {
  isDragging: boolean;
  draggedItem: DraggableItem | null;
  dragIndex: number;
  hoverIndex: number;
  dragOffset: { x: number; y: number };
  dropTarget: HTMLElement | null;
}

export interface DraggableListPhysicsOptions {
  /** Enable physics-based animations */
  enablePhysics?: boolean;
  /** Spring configuration for drag animations */
  springConfig?: SpringConfig;
  /** Drag threshold in pixels */
  dragThreshold?: number;
  /** Enable haptic feedback on mobile */
  enableHaptics?: boolean;
  /** Custom drag handle selector */
  dragHandle?: string;
  /** Enable auto-scroll when dragging near edges */
  autoScroll?: boolean;
  /** Auto-scroll threshold from edges */
  autoScrollThreshold?: number;
  /** Auto-scroll speed */
  autoScrollSpeed?: number;
  /** Enable drop zones */
  enableDropZones?: boolean;
  /** Custom drop zone validator */
  validateDrop?: (draggedItem: DraggableItem, targetIndex: number) => boolean;
  /** Enable multi-select drag */
  multiSelect?: boolean;
  /** Selected items for multi-select */
  selectedItems?: string[];
}

const DEFAULT_OPTIONS: Required<DraggableListPhysicsOptions> = {
  enablePhysics: true,
  springConfig: { stiffness: 300, damping: 30, mass: 1 },
  dragThreshold: 5,
  enableHaptics: true,
  dragHandle: '',
  autoScroll: true,
  autoScrollThreshold: 50,
  autoScrollSpeed: 10,
  enableDropZones: false,
  validateDrop: () => true,
  multiSelect: false,
  selectedItems: [],
};

export function useDraggableListPhysics(
  items: DraggableItem[],
  onReorder: (fromIndex: number, toIndex: number, draggedItems?: DraggableItem[]) => void,
  options: DraggableListPhysicsOptions = {}
) {
  const finalOptions = { ...DEFAULT_OPTIONS, ...options };

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItem: null,
    dragIndex: -1,
    hoverIndex: -1,
    dragOffset: { x: 0, y: 0 },
    dropTarget: null,
  });

  const [selectedItems, setSelectedItems] = useState<string[]>(finalOptions.selectedItems);

  const containerRef = useRef<HTMLElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragElement = useRef<HTMLElement | null>(null);
  const autoScrollInterval = useRef<NodeJS.Timeout>();
  const physicsSprings = useMultiSpring({}, { config: finalOptions.springConfig });

  // Physics-based animations for list items
  const animateListReorder = useCallback((
    fromIndex: number,
    toIndex: number,
    draggedItems: DraggableItem[]
  ) => {
    if (!finalOptions.enablePhysics) {
      onReorder(fromIndex, toIndex, draggedItems);
      return;
    }

    const springTargets: Record<string, number> = {};

    // Calculate new positions for all items
    items.forEach((item, index) => {
      let newIndex = index;

      if (finalOptions.multiSelect && (draggedItems?.length || 0) > 1) {
        // Handle multi-item drag
        const draggedIndices = draggedItems.map((item: any) =>
          items.findIndex(i => i.id === item?.id)
        ).sort((a, b) => a - b);

        if (draggedIndices.includes(index)) {
          // This item is being dragged
          const relativeIndex = draggedIndices.indexOf(index);
          newIndex = toIndex + relativeIndex;
        } else if (index >= Math.min(fromIndex, toIndex) && index <= Math.max(fromIndex, toIndex)) {
          // This item needs to shift
          if (fromIndex < toIndex) {
            newIndex = index - (draggedIndices?.length || 0);
          } else {
            newIndex = index + (draggedIndices?.length || 0);
          }
        }
      } else {
        // Single item drag
        if (index === fromIndex) {
          newIndex = toIndex;
        } else if (fromIndex < toIndex) {
          if (index > fromIndex && index <= toIndex) {
            newIndex = index - 1;
          }
        } else {
          if (index < fromIndex && index >= toIndex) {
            newIndex = index + 1;
          }
        }
      }

      if (springTargets) {
        springTargets[`item-${item?.id}`] = newIndex * 60; // Assume 60px item height
      }
    });

    physicsSprings.start(springTargets);

    // Trigger reorder after animation completes
    setTimeout(() => {
      onReorder(fromIndex, toIndex, draggedItems);
    }, 300);
  }, [items, onReorder, finalOptions, physicsSprings]);

  // Handle drag start
  const handleDragStart = useCallback((
    event: React.DragEvent | React.TouchEvent | MouseEvent,
    item: DraggableItem,
    index: number
  ) => {
    event.preventDefault();

    const clientX = 'touches' in event ? event.touches[0].clientX : (event as MouseEvent).clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : (event as MouseEvent).clientY;

    dragStartPos.current = { x: clientX, y: clientY };
    dragElement.current = event.target as HTMLElement;

    // Handle multi-select
    let draggedItems = [item];
    if (finalOptions.multiSelect && (selectedItems?.length || 0) > 1 && selectedItems.includes(item?.id)) {
      draggedItems = items.filter((item: any) => selectedItems.includes(item?.id));
    }

    setDragState({
      isDragging: true,
      draggedItem: item,
      dragIndex: index,
      hoverIndex: index,
      dragOffset: { x: 0, y: 0 },
      dropTarget: null,
    });

    // Add global drag listeners
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);

    // Trigger haptic feedback
    if (finalOptions.enableHaptics && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [items, selectedItems, finalOptions]);

  // Handle drag move
  const handleDragMove = useCallback((event: MouseEvent | TouchEvent) => {
    if (!dragState.isDragging) return;

    event.preventDefault();

    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    const deltaX = clientX - dragStartPos.current.x;
    const deltaY = clientY - dragStartPos.current.y;

    // Check drag threshold
    if (Math.abs(deltaX) < finalOptions.dragThreshold && Math.abs(deltaY) < finalOptions.dragThreshold) {
      return;
    }

    setDragState((prev: any) => ({
      ...prev,
      dragOffset: { x: deltaX, y: deltaY },
    }));

    // Auto-scroll functionality
    if (finalOptions.autoScroll && containerRef.current) {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const threshold = finalOptions.autoScrollThreshold;

      if (clientY < rect.top + threshold) {
        // Scroll up
        container.scrollTop -= finalOptions.autoScrollSpeed;
      } else if (clientY > rect.bottom - threshold) {
        // Scroll down
        container.scrollTop += finalOptions.autoScrollSpeed;
      }
    }

    // Find hover index
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll('[data-draggable-item]');
      let hoverIndex = -1;

      for (let i = 0; i < (elements?.length || 0); i++) {
        const element = elements[i] as HTMLElement;
        const rect = element.getBoundingClientRect();

        if (clientY >= rect.top && clientY <= rect.bottom) {
          hoverIndex = parseInt(element.getAttribute('data-index') || '-1');
          break;
        }
      }

      if (hoverIndex !== -1 && hoverIndex !== dragState.hoverIndex) {
        setDragState((prev: any) => ({
          ...prev,
          hoverIndex,
        }));
      }
    }
  }, [dragState, finalOptions]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (!dragState.isDragging) return;

    // Clear auto-scroll
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = undefined;
    }

    // Validate drop
    const draggedItems = finalOptions.multiSelect && (selectedItems?.length || 0) > 1
      ? items.filter((item: any) => selectedItems.includes(item?.id))
      : [dragState.draggedItem!];

    const isValidDrop = finalOptions.validateDrop(
      dragState.draggedItem!,
      dragState.hoverIndex
    );

    if (isValidDrop && dragState.dragIndex !== dragState.hoverIndex) {
      animateListReorder(dragState.dragIndex, dragState.hoverIndex, draggedItems);
    }

    // Reset drag state
    setDragState({
      isDragging: false,
      draggedItem: null,
      dragIndex: -1,
      hoverIndex: -1,
      dragOffset: { x: 0, y: 0 },
      dropTarget: null,
    });

    // Remove global listeners
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('touchmove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchend', handleDragEnd);

    dragElement.current = null;
  }, [dragState, selectedItems, items, finalOptions, animateListReorder]);

  // Multi-select functionality
  const toggleItemSelection = useCallback((itemId: string) => {
    if (!finalOptions.multiSelect) return;

    setSelectedItems((prev: any) => {
      if (prev.includes(itemId)) {
        return prev.filter((id: any) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  }, [finalOptions.multiSelect]);

  const selectItemRange = useCallback((startId: string, endId: string) => {
    if (!finalOptions.multiSelect) return;

    const startIndex = items.findIndex(item => item?.id === startId);
    const endIndex = items.findIndex(item => item?.id === endId);

    if (startIndex === -1 || endIndex === -1) return;

    const minIndex = Math.min(startIndex, endIndex);
    const maxIndex = Math.max(startIndex, endIndex);

    const rangeIds = items.slice(minIndex, maxIndex + 1).map((item: any) => item?.id);
    setSelectedItems(rangeIds);
  }, [items, finalOptions.multiSelect]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  // Keyboard navigation for accessibility
  const handleKeyDown = useCallback((event: KeyboardEvent, itemId: string) => {
    const currentIndex = items.findIndex(item => item?.id === itemId);
    if (currentIndex === -1) return;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) {
          const targetItem = items[currentIndex - 1];
          animateListReorder(currentIndex, currentIndex - 1, [items[currentIndex]]);
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < (items?.length || 0) - 1) {
          const targetItem = items[currentIndex + 1];
          animateListReorder(currentIndex, currentIndex + 1, [items[currentIndex]]);
        }
        break;

      case 'Enter':
      case ' ':
        if (finalOptions.multiSelect) {
          event.preventDefault();
          toggleItemSelection(itemId);
        }
        break;
    }
  }, [items, animateListReorder, toggleItemSelection, finalOptions.multiSelect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, []);

  return {
    dragState,
    containerRef,
    selectedItems,
    physicsValues: physicsSprings.values,

    // Event handlers
    handleDragStart,
    handleKeyDown,

    // Multi-select methods
    toggleItemSelection,
    selectItemRange,
    clearSelection,

    // Utility methods
    isSelected: (itemId: string) => selectedItems.includes(itemId),
    isDragging: dragState.isDragging,
    canDrop: (targetIndex: number) => finalOptions.validateDrop(
      dragState.draggedItem!,
      targetIndex
    ),
  };
}

// Hook for physics-based item transitions
export function useItemTransitions(
  items: DraggableItem[],
  transitionType: 'slide' | 'fade' | 'scale' | 'bounce' = 'slide',
  options: {
    duration?: number;
    stagger?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    easing?: string;
  } = {}
) {
  const {
    duration = 300,
    stagger = 50,
    direction = 'up',
    easing = 'ease-out',
  } = options;

  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set());

  const getTransitionStyle = useCallback((itemId: string, index: number) => {
    const delay = index * stagger;
    const isAnimating = animatingItems.has(itemId);

    let transform = '';
    let opacity = 1;

    if (!isAnimating) {
      switch (transitionType) {
        case 'slide':
          switch (direction) {
            case 'up': transform = 'translateY(20px)'; break;
            case 'down': transform = 'translateY(-20px)'; break;
            case 'left': transform = 'translateX(20px)'; break;
            case 'right': transform = 'translateX(-20px)'; break;
          }
          opacity = 0;
          break;

        case 'fade':
          opacity = 0;
          break;

        case 'scale':
          transform = 'scale(0.8)';
          opacity = 0;
          break;

        case 'bounce':
          transform = 'scale(0.3) translateY(10px)';
          opacity = 0;
          break;
      }
    }

    return {
      transition: `all ${duration}ms ${easing} ${delay}ms`,
      transform,
      opacity,
    };
  }, [transitionType, direction, duration, stagger, easing, animatingItems]);

  const animateItem = useCallback((itemId: string) => {
    setAnimatingItems((prev: any) => new Set(prev).add(itemId));

    setTimeout(() => {
      setAnimatingItems((prev: any) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }, duration);
  }, [duration]);

  const animateAllItems = useCallback(() => {
    items.forEach((item, index) => {
      setTimeout(() => animateItem(item?.id), index * stagger);
    });
  }, [items, animateItem, stagger]);

  return {
    getTransitionStyle,
    animateItem,
    animateAllItems,
    isAnimating: animatingItems.size > 0,
  };
}

// Hook for physics-based drop zones
export function useDropZones(
  zones: Array<{
    id: string;
    accepts: (item: DraggableItem) => boolean;
    onDrop: (item: DraggableItem, zoneId: string) => void;
  }>
) {
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [isOverZone, setIsOverZone] = useState(false);

  const handleDragOver = useCallback((event: React.DragEvent, zoneId: string) => {
    event.preventDefault();

    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return;

    // You would need to pass the dragged item data through the drag event
    // For now, this is a placeholder structure
    const draggedItem = (event as any).draggedItem as DraggableItem;

    if (draggedItem && zone.accepts(draggedItem)) {
      setActiveZone(zoneId);
      setIsOverZone(true);
    }
  }, [zones]);

  const handleDragLeave = useCallback(() => {
    setIsOverZone(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent, zoneId: string) => {
    event.preventDefault();

    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return;

    const draggedItem = (event as any).draggedItem as DraggableItem;

    if (draggedItem && zone.accepts(draggedItem)) {
      zone.onDrop(draggedItem, zoneId);
    }

    setActiveZone(null);
    setIsOverZone(false);
  }, [zones]);

  return {
    activeZone,
    isOverZone,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    isValidDrop: (zoneId: string, item: DraggableItem) => {
      const zone = zones.find(z => z.id === zoneId);
      return zone ? zone.accepts(item) : false;
    },
  };
}
