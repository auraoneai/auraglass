### Device Capabilities
Device detection and capability-based optimization.

```tsx
import { detectDevice, deviceOptimizations } from 'aura-glass';

// Detect device capabilities
const device = detectDevice();
console.log('Device type:', device.type);
console.log('Performance tier:', device.performance.tier);
console.log('Supports WebGL:', device.capabilities.webgl);

// Apply device-specific optimizations
if (device.type === 'mobile') {
  const mobileOptimizations = deviceOptimizations.mobile.reduceMotion();
  // Apply mobile optimizations
}

// Get optimal settings based on device
const optimalAnimation = performanceOptimizations.getOptimalAnimationSettings(device);
const optimalRendering = performanceOptimizations.getOptimalRenderingSettings(device);
```