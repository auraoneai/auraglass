### Performance Monitoring
Real-time performance monitoring with adaptive quality adjustment.

```tsx
import { PerformanceMonitor, AdaptiveQuality } from 'aura-glass';

// Get performance monitor instance
const monitor = PerformanceMonitor.getInstance();

// Start monitoring
monitor.startMeasure('component-render');
// ... component logic
const renderTime = monitor.endMeasure('component-render');

// Adaptive quality based on performance
const adaptiveQuality = AdaptiveQuality.getInstance();
const currentQuality = adaptiveQuality.getCurrentQuality();
const recommendations = adaptiveQuality.getOptimizationSuggestions();
```