### AuraElementInteractionPlugin

Advanced Chart.js plugin for physics-based chart interactions.

```tsx
import { Chart as ChartJS, AuraElementInteractionPlugin } from "aura-glass";

// Register the plugin
ChartJS.register(AuraElementInteractionPlugin);

// Use in chart configuration
const chartConfig = {
  plugins: {
    [AuraElementInteractionPlugin.id]: {
      magneticEffect: true,
      magneticStrength: 0.3,
      magneticRange: 50,
      rippleEffect: true,
      hoverGlow: true,
      physicsAnimations: true,
    },
  },
};
```

`GalileoElementInteractionPlugin` remains available as a deprecated
compatibility alias for older apps. New AuraGlass code should import
`AuraElementInteractionPlugin`.
