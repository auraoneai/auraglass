### useGalileoSprings
Multi-spring physics system for complex animations.

```tsx
import { useGalileoSprings } from 'aura-glass';

function PhysicsPlayground() {
  const targets = [
    { id: 'ball1', position: { x: 100, y: 100 }, velocity: { x: 0, y: 0 } },
    { id: 'ball2', position: { x: 200, y: 150 }, velocity: { x: 10, y: -5 } },
  ];

  const {
    positions,
    springTo,
    impulse,
    addBody,
    removeBody,
    isAnimating
  } = useGalileoSprings(targets, {
    stiffness: 100,
    damping: 10,
    gravity: true,
    gravityStrength: 9.81,
  });

  return (
    <div style={{ position: 'relative', width: 400, height: 300 }}>
      {Object.entries(positions).map(([id, pos]) => (
        <div
          key={id}
          style={{
            position: 'absolute',
            left: pos.x,
            top: pos.y,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#3b82f6',
            cursor: 'pointer',
          }}
          onClick={() => impulse(id, { x: Math.random() * 50 - 25, y: -50 })}
        />
      ))}
      <p>Animating: {isAnimating ? 'Yes' : 'No'}</p>
    </div>
  );
}
```