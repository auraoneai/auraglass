# Genesis Revolutionary Performance Guide

Genesis revolutionary components may use realtime collaboration, browser APIs, Houdini worklets, or speech features. Treat those capabilities as performance-sensitive surfaces.

## Checks

- Prefer lazy loading for advanced providers.
- Use browser feature detection before enabling Houdini or speech APIs.
- Keep animation work reduced-motion aware.
- Monitor frame rate, memory use, and connection churn during collaboration sessions.
