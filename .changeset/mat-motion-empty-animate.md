---
"aura-glass": minor
---

MAT-186 (REQ-MOT-64, 4.x): add `auraglass/motion-no-empty-animate` to the 4.x
lint plugin (absorbing `no-empty-reduced-animate` under one name) at error
severity on src/** — blocks `animate={{}}` and faded-in `initial` with a
conditional `animate` from reaching dev builds on release/4.x.
