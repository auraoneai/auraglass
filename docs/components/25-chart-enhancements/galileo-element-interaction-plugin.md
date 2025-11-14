### GalileoElementInteractionPlugin
Advanced Chart.js plugin for physics-based chart interactions.

```tsx
import { 
  Chart as ChartJS,
  GalileoElementInteractionPlugin 
} from 'aura-glass';

// Register the plugin
ChartJS.register(GalileoElementInteractionPlugin);

// Use in chart configuration
const chartConfig = {
  plugins: {
    [GalileoElementInteractionPlugin.id]: {
      magneticEffect: true,
      magneticStrength: 0.3,
      magneticRange: 50,
      rippleEffect: true,
      hoverGlow: true,
      physicsAnimations: true,
    }
  }
};
```