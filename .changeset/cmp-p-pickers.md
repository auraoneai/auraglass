---
"aura-glass": minor
---

CMP lane 3d (Pickers): Select + Combobox on BU 1.8.0

- Select (flagship 11): Root/Trigger/Value/Content/Item/ItemIndicator/Group/GroupLabel/Label/Separator — BU Select trigger with sunken material shell, overlay popup (positioner/list/scroll arrows, keepMounted indicators), items-map labels, side=bottom align=start sideOffset=6, pointer-aware alignItemWithTrigger, name/form/required hidden input, form-reset remount, ≤390px/coarse dvh popup caps + reduced-motion entrance.
- Combobox (flagship 12): Root/Input/Trigger/Clear/Content/Item/Empty/Chips/Chip/ChipRemove/Group/GroupLabel/Loading — InputGroup shell (input+clear+trigger), aria-autocomplete for mode="autocomplete", focus stays on input with aria-activedescendant, loading → aria-busy list + ≤1/500ms polite announce, Empty role=status (own element — BU Empty snapshots live-region text), loadOptions(q,{signal}) debounced 250ms with abort+seq guard (stale/aborted never render; rejection → loadError Empty, keeps query), creatable (single create-item "Create \"<query>\"", no whitespace offers), >200 items → lazy @tanstack/react-virtual window (aria-setsize/posinset, ≤60 DOM rows), chips content-raised capsules.
- Form/async coverage: select-form (hidden input, required checkValidity, reset→defaultValue), combobox-async (aria-busy+announcer, debounce+abort, load-error Empty, stale-drop, virtual bounds) — all real assertions, no PENDINGs added.
- Contract: 23 root exports in api report; CMP-188 (delete 4.x input paths) open — paths absent on `next`.
