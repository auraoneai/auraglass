---
"aura-glass": minor
---

cmp lane 3e (modal overlays): overlay seam (`overlays/_shared`) — portal-to-layer
mounting, per-instance layer stack, enter/exit state machine, overlayMaterial()
attribute contract — plus Dialog (flagship 15), AlertDialog (16), Sheet (17) on
Base UI 1.8.0: compound parts, scrim/backdrop, non-modal mode, intent=danger,
side/bottom detents with snap physics + handle, action preset, live announce.
Lint rule auraglass/no-overlay-global-listeners + _strict scope; harnesses:
overlay-layer/dom-contract/idle/dev-counter/popup-contract/ssr/provider-mount/
lint-overlays/deprecations; subjects registry; stories incl. overlay matrix;
root exports incl. frozen seed interfaces (Popover/Tooltip/Menu/Toast);
verify-side-effects + selector-table generator.
