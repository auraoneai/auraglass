# 3.2 Accessibility Primitives

This ledger tracks accessibility proof for the native primitive layer replacing Radix-backed behavior.

## Primitive Matrix

| Primitive | Keyboard requirements | Focus requirements | SSR requirements | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| `GlassSlot` / `Slot` | Does not swallow event handlers. | Composes refs. | No browser globals during render. | Pass | `src/primitives/native-primitives.test.tsx` |
| `Label` | Preserves label activation. | Supports `htmlFor`. | No browser globals during render. | Pass | `src/primitives/native-primitives.test.tsx` |
| `GlassPortal` / `Portal` | Does not disrupt keyboard events. | Mounts into supplied container. | No-op before mount. | Pass | `src/primitives/native-primitives.test.tsx` |
| `GlassDismissableLayer` / `DismissableLayer` | Escape, outside pointer, outside focus, prevented dismissal, and nested content coverage. | Keeps children reachable. | No browser globals during render. | Pass | `src/primitives/native-primitives.test.tsx` |
| `GlassFocusScope` / `FocusScope` | Tab loop and trapped focus coverage. | Focus loop and restoration coverage. | No browser globals during render. | Pass | `src/primitives/native-primitives.test.tsx` |
| `GlassRovingFocusGroup` / `RovingFocusGroup` | Arrow-key, Home, End, disabled item, loop, and RTL coverage. | Roving focus movement covered. | No browser globals during render. | Pass | `src/primitives/native-primitives.test.tsx` |
| `GlassPositioner` / `Positioner` | Placement does not trap keyboard users. | Annotates side/align and clamps within collision padding. | No layout reads during SSR render. | Pass | `src/primitives/native-primitives.test.tsx` |
| `GlassMenuPrimitiveRoot` / `GlassMenuPrimitiveContent` / `GlassMenuPrimitiveItem` | Menubar composition, arrow-key movement, dropdown menu keyboard navigation, checkbox/radio item selection, and keyboard submenu opening. | Shared menu root and content keep focusable menu items reachable. | No browser globals during render. | Pass | `src/components/navigation/GlassMenubar.test.tsx`, `src/components/navigation/GlassDropdownMenu.test.tsx` |

## Test Command

```bash
npm test -- --runTestsByPath src/app-shell/app-shell.test.tsx src/workspace/workspace.test.tsx src/theme/theme-engine.test.tsx src/primitives/native-primitives.test.tsx src/components/button/GlassButton.test.tsx src/components/button/GlassMagneticButton.test.tsx src/components/input/GlassForm.test.tsx src/components/navigation/GlassDropdownMenu.test.tsx src/components/input/GlassSelectCompound.test.tsx --runInBand
```

Result: pass, 9 suites / 45 tests / 5 snapshots.

App-chrome hardening command:

```bash
npm test -- --runTestsByPath src/components/navigation/GlassMenubar.test.tsx src/components/navigation/GlassDropdownMenu.test.tsx src/components/input/GlassSelectCompound.test.tsx src/components/input/GlassMultiSelect.test.tsx src/components/data-display/GlassDataTable.test.tsx --runInBand
```

Result: pass, 5 suites / 47 tests / 5 snapshots.

Primitive-focused command:

```bash
npm test -- --runTestsByPath src/primitives/native-primitives.test.tsx --runInBand
```

Result: pass, 1 suite / 13 tests.

The full Jest suite was also run after the icon snapshot refresh:

```bash
npm test -- --runInBand
```

Result: pass, 419 suites / 2,265 tests / 339 snapshots.

## Covered Behavior

- Slot prop merging, event handler composition, style merging, and ref composition.
- Label activation through native label/input association.
- Portal container rendering.
- Dismissable layer Escape, outside click, outside focus, prevented dismissal, and nested-content behavior.
- Focus scope tab looping, trapped outside focus, and focus restoration.
- Roving focus arrow movement, Home, End, disabled item skip, loop, and RTL behavior.
- Positioner side/alignment annotation and viewport collision padding clamp.
- Updated app-chrome consumers: `GlassButton`, `GlassMagneticButton`, `GlassForm`, `GlassDropdownMenu`, and `GlassSelectCompound`.
- Shared menu primitive composition through `GlassMenubar`.
- Dropdown keyboard navigation, checkbox/radio menu items, and keyboard submenu opening.
- Select controlled/uncontrolled/form/typeahead/mobile-contained behavior.
- Multiselect grouped keyboard selection, disabled option, and controlled value behavior.
- Data table sorting, selection, loading, empty, row action, and pagination states.

## Manual QA Notes

- Reviewer: pending
- Date: pending final release day
- Browser: pending
- Screen reader: pending
- Result: automated primitive tests pass; manual SR/browser pass remains before full accessibility certification
- Follow-ups: expand nested overlay and focus restoration coverage if 3.2 final scope requires certification language beyond automated evidence
