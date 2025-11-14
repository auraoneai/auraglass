### Production Utilities
Comprehensive production utilities for deployment and monitoring.

```tsx
import { 
  productionUtils,
  getAuraGlass,
  devUtils 
} from 'aura-glass';

// Production validation
const validation = productionUtils.validateProduction();
console.log('Production ready:', validation.ready);

// Performance metrics
const metrics = productionUtils.getMetrics();
console.log('Performance:', metrics);

// Development utilities (only in dev mode)
if (process.env.NODE_ENV === 'development') {
  devUtils.enableDebug();
  devUtils.logMetrics();
}
```