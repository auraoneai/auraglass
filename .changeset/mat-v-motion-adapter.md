---
"aura-glass": minor
---

MAT lane V (motion): `aura-glass/motion` adapter — toMotionTransition (spring stiffness/damping per REQ-MAT-08, duration ms→s + ease, exit→durationExit+accelerate), MotionProvider (MotionConfig reducedMotion mapping + MotionCapabilityContext), useDragDetents (detent projection v*0.2, rubber-band 0.55, dismiss 25%/800px/s), useMomentum (inertia tc=325, bounds clamp, ≤1s settle, pointerdown stops), magnetic (strength≤0.3, ≤8px offset, fine-pointer+full only, zero state), SharedLayout/Shared (LayoutGroup + layoutId + data-ag-animating/optics lifecycle). Springs analytic response + linear() equivalence tests (MAT-188/189/190/223) + type contract (MAT-235). api-report etc/api/motion.* (7 exports).
