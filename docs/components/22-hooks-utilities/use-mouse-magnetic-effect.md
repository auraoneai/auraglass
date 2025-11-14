### useMouseMagneticEffect
Magnetic interaction effects with customizable strength and range.

```tsx
import { useMouseMagneticEffect } from 'aura-glass';

function MagneticButton() {
  const { ref, state, reset } = useMouseMagneticEffect({
    strength: 0.3,
    range: 100,
    scale: 1.1,
    rotation: 5,
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    duration: 300,
  });

  return (
    <button
      ref={ref}
      style={{
        padding: '12px 24px',
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '8px',
        color: 'white',
        cursor: 'pointer',
      }}
      onDoubleClick={reset}
    >
      Magnetic Button
      {state.isActive && (
        <span style={{ marginLeft: 8 }}>
          (Intensity: {(state.intensity * 100).toFixed(0)}%)
        </span>
      )}
    </button>
  );
}
```