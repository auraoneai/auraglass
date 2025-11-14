### useZSpaceAnimation
3D depth and layering animations with z-space management.

```tsx
import { useZSpaceAnimation } from 'aura-glass';

function LayeredInterface() {
  const layers = [
    { id: 'background', zIndex: 1, elevation: 0, opacity: 1, scale: 1, blur: 0 },
    { id: 'content', zIndex: 2, elevation: 10, opacity: 1, scale: 1, blur: 0 },
    { id: 'modal', zIndex: 3, elevation: 20, opacity: 1, scale: 1, blur: 0 },
  ];

  const {
    getLayerStyles,
    animateToZSpace,
    bringToFront,
    animateFocusTransition,
    isLayerAnimating
  } = useZSpaceAnimation(layers, {
    enabled: true,
    springConfig: { stiffness: 200, damping: 25, mass: 1 },
    depthScaling: true,
    depthBlur: true,
  });

  return (
    <div style={{ position: 'relative' }}>
      <div style={getLayerStyles('background')}>
        Background Layer
      </div>
      <div 
        style={getLayerStyles('content')}
        onClick={() => bringToFront('content')}
      >
        Content Layer (click to bring to front)
      </div>
      <div style={getLayerStyles('modal')}>
        Modal Layer
      </div>
    </div>
  );
}
```