### Error Boundaries
Production-ready error boundaries with glassmorphism styling.

```tsx
import { 
  GlassErrorBoundary, 
  GlassAsyncErrorBoundary,
  withGlassErrorBoundary 
} from 'aura-glass';

// Wrap components with error boundaries
<GlassErrorBoundary
  fallback={<div>Something went wrong</div>}
  onError={(error, errorInfo) => console.error(error)}
>
  <YourComponent />
</GlassErrorBoundary>

// Async error boundary for promises
<GlassAsyncErrorBoundary timeout={5000}>
  <AsyncComponent />
</GlassAsyncErrorBoundary>

// HOC for error boundary
const SafeComponent = withGlassErrorBoundary(YourComponent);
```