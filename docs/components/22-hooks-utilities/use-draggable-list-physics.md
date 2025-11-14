### useDraggableListPhysics
Physics-based drag and drop with realistic animations.

```tsx
import { useDraggableListPhysics } from 'aura-glass';

function DraggableList({ items, onReorder }) {
  const {
    dragState,
    containerRef,
    handleDragStart,
    selectedItems,
    toggleItemSelection,
  } = useDraggableListPhysics(items, onReorder, {
    enablePhysics: true,
    springConfig: { stiffness: 300, damping: 30, mass: 1 },
    multiSelect: true,
    enableHaptics: true,
  });

  return (
    <div ref={containerRef}>
      {items.map((item, index) => (
        <div
          key={item.id}
          data-draggable-item
          data-index={index}
          onMouseDown={(e) => handleDragStart(e, item, index)}
          style={{
            opacity: dragState.isDragging && dragState.dragIndex === index ? 0.5 : 1,
            transform: selectedItems.includes(item.id) ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
```