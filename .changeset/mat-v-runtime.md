---
"aura-glass": minor
---

MAT lane V (motion): src/motion runtime — ticker.ts (shared rAF, dt≤50ms, hidden-pause, shared IntersectionObserver sole owner of data-ag-offscreen, observeOffscreen), tween/onMotionChange/announceFinal, pointerLight.ts (ref-counted per-document install, ≤1 setProperty/frame, rect cache, pointerLightActive gate), viewTransition.ts (startMorph with object+callback VT forms, FLIP fallback, data-ag-vt/-settled lifecycle, useMorphName, reactViewTransition), capability.ts (MotionCapabilityContext). Unit suites MAT-204/207/213 (MAT-203..215).
