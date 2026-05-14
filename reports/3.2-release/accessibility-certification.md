# 3.2 Accessibility Certification

This matrix records automated accessibility evidence for native app-chrome replacements. It is not a completed manual screen-reader certification report.

## Component Matrix

| Component | Keyboard behavior | ARIA behavior | Focus lifecycle | Reduced motion | Mobile/touch | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Button | Automated role/name coverage | axe smoke coverage | Native button focus | Reduced-motion magnetic test | Native pointer behavior | Pass | `GlassButton.test.tsx`, `GlassMagneticButton.test.tsx` |
| Form | Automated role/label/help text coverage | axe smoke coverage | Native form focus | Static form behavior | Native input behavior | Pass | `GlassForm.test.tsx` |
| Menu / dropdown menu | Browser keyboard open/escape checks and component tests | axe smoke coverage and menu/item roles | Native primitive replacement covered | Static menu behavior | Pending manual touch QA | Partial | `GlassDropdownMenu.test.tsx`, primitive tests, `npm run test:visual:app-chrome` |
| Menubar | Source component retained and no forbidden dependency gate passes | Needs focused axe/browser keyboard expansion | Roving/menu focus behavior needs focused certification | Static menu behavior | Pending manual touch QA | Partial | `verify-no-core-ui-deps`, `src/components/navigation/GlassMenubar.tsx` |
| Select | Browser keyboard open/escape checks, controlled/uncontrolled tests | axe smoke coverage | Native primitive replacement covered | Static select behavior | Pending manual touch QA | Partial | `GlassSelectCompound.test.tsx`, primitive tests, `npm run test:visual:app-chrome` |
| Combobox | Focused test covers grouped option keyboard commit | `combobox`, `listbox`, `option`, and `group` roles | Input focus retained while listbox opens | Static listbox behavior | Pending manual touch QA | Partial | `src/__tests__/production-workflow-components.test.tsx` |
| Dialog | Browser open/escape close checks | Focused axe checks pass | Browser escape close covered; manual SR focus narration pending | Reduced-motion visual baseline captured | Pending manual touch QA | Partial | `npm run test:visual:app-chrome`, `npm run test:a11y:app-chrome` |
| Drawer | Browser open/escape close checks | Focused axe checks pass | Browser escape close covered; manual SR focus narration pending | Reduced-motion visual baseline captured | Pending manual touch QA | Partial | `npm run test:visual:app-chrome`, `npm run test:a11y:app-chrome` |
| Popover | Visual render baseline and axe coverage | Focused axe checks pass | Dismissable-layer coverage plus manual SR pending | Reduced-motion visual baseline captured | Pending manual touch QA | Partial | `npm run test:visual:app-chrome`, `npm run test:a11y:app-chrome` |
| Tooltip | Pointer hover check and axe coverage | Focused axe checks pass | Hover path covered; keyboard/SR description pending | Reduced-motion visual baseline captured | Pending manual touch QA | Partial | `npm run test:visual:app-chrome`, `npm run test:a11y:app-chrome` |
| Tabs | Browser arrow-key activation and focused workflow tests | Focused axe checks pass | Roving tab focus smoke covered | Reduced-motion visual baseline captured | Mobile shell visual baseline captured | Partial | `npm run test:visual:app-chrome`, `npm run test:a11y:app-chrome`, workflow tests |
| Command palette | Browser search filtering and axe coverage | Focused axe checks pass | Search input focus covered; manual SR narration pending | Reduced-motion visual baseline captured | Mobile shell visual baseline captured | Partial | `npm run test:visual:app-chrome`, `npm run test:a11y:app-chrome` |
| App shell navigation | Accessible nav labels and icon button names | Role/name tests | Native button focus | Static shell behavior | Pending manual touch QA | Partial | `src/app-shell/app-shell.test.tsx` |
| Workspace tabs | `role=tablist` and `role=tab` coverage | `aria-selected` tested | Native button focus | Static workspace behavior | Pending manual touch QA | Partial | `src/workspace/workspace.test.tsx` |
| Toast and notification center | Provider and notification stack retain dismiss buttons; workflow layer exports toast provider | Existing live-region behavior, plus notification center live region | Toast focus remains caller-owned | Static notification behavior | Pending manual touch QA | Partial | `GlassToast.test.tsx`, `GlassNotificationCenter.test.tsx` if present, `src/components/data-display/GlassToast.tsx` |

## Automated Test Summary

Command:

```bash
npm test -- --runTestsByPath src/app-shell/app-shell.test.tsx src/workspace/workspace.test.tsx src/theme/theme-engine.test.tsx src/primitives/native-primitives.test.tsx src/components/button/GlassButton.test.tsx src/components/button/GlassMagneticButton.test.tsx src/components/input/GlassForm.test.tsx src/components/navigation/GlassDropdownMenu.test.tsx src/components/input/GlassSelectCompound.test.tsx --runInBand
```

Result: pass, 9 suites / 45 tests / 5 snapshots.

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

Package a11y script:

```bash
npm run test:a11y
```

Result: pass, 3 suites / 14 tests / 2 snapshots.

App-chrome visual and keyboard baseline:

```bash
npm run test:visual:app-chrome
```

Result: pass, 11 packed-package Chromium screenshots covering icons, dropdown menu, select, dialog, drawer, popover, tooltip, tabs, command palette, mobile shell, and reduced motion. The same packed-package fixture also passes 7 browser keyboard/interaction checks covering dropdown open/escape, select open/escape, tab arrow activation, dialog escape close, drawer escape close, tooltip hover, and command search filtering.

Latest rerun: 2026-05-14T06:56Z. Result: pass, 11 targets / 7 keyboard checks. The 390x844 mobile shell baseline renders without visible clipping or overlap in [mobile-shell.png](./app-chrome-visuals/mobile-shell.png). This is automated mobile viewport evidence, not a physical-device touch certification pass.

App-chrome axe checks:

```bash
npm run test:a11y:app-chrome
```

Result: pass, 8 tests covering dropdown menu, select, dialog, drawer, popover, tooltip, tabs, and command palette. Component-level axe disables the `region` landmark rule because these are isolated component fixtures rather than full pages.

Latest rerun: 2026-05-14T06:56Z. Result: pass, 8 tests / 1 suite.

Production workflow checks:

```bash
npm test -- --runTestsByPath src/__tests__/production-workflow-components.test.tsx --runInBand
```

Result: pass, 1 suite / 5 tests. The test covers empty/error/loading states, filter chip controls, grouped combobox keyboard selection, form field wrappers, date/time/search fields, validation messages, and page-tab arrow-key activation.

## Manual QA Checklist

The final release candidate still needs this manual pass recorded with browser, OS, viewport, and assistive technology notes:

- Menu: open from trigger, arrow through items, activate item, Escape closes, focus returns.
- Menubar: arrow through root items, open submenu, typeahead where supported, Escape closes.
- Select: open from trigger, arrow through options, commit value, verify form value.
- Combobox: type query, arrow through grouped options, commit option, verify active descendant.
- Dialog: initial focus, Tab loop, Shift+Tab loop, Escape close, focus return.
- Drawer: placement focus behavior, Escape close, outside click close when enabled.
- Popover: trigger focus, collision placement, outside click close, Escape close.
- Tooltip: hover and keyboard focus description behavior.
- Tabs: horizontal and vertical arrow navigation, disabled tab skip, manual activation where configured.
- Command palette: focus input, filter items, select item, empty state narration.
- App shell navigation: skip link, landmark navigation, rail icon names, mobile shell menu.
- Toast and notification center: live-region announcement, dismiss button, action button.

## Screen-Reader Smoke Notes

Screen-reader smoke notes are documented as required release work, but they are not yet final sign-off evidence. The release should record at least one pass with VoiceOver on macOS/Safari or Chrome, plus one Windows screen-reader pass if available.

Current expected narration targets:

- Icon-only controls expose accessible names or are hidden with `aria-hidden`.
- Menus, selects, comboboxes, tabs, and command palette expose role, expanded/selected state, and active option or tab state.
- Dialogs and drawers announce title and description before interactive content.
- Toasts and notifications announce without moving focus.
- Loading, empty, and error states announce politely or assertively based on severity.

## Known Limits

- Manual screen-reader QA has not yet been recorded for the final 3.2 candidate.
- Mobile viewport rendering now has packed-package Chromium evidence, including the 390x844 mobile shell baseline, but touch behavior has not yet been manually verified on physical devices.
- Menubar, toast, and notification-center certification are documented in the matrix, but still need focused automated and manual certification beyond source/export evidence.
- Dialog, drawer, popover, tooltip, tabs, and command palette now have packed-package visual evidence, focused axe checks, and browser keyboard/interaction smoke coverage, but still need screen-reader certification before the matrix can be marked complete.

## Release Blocker Rule

Do not describe 3.2 as fully accessibility certified until manual browser and screen-reader notes are added for the final release candidate. It is accurate to say the new package primitives and touched app-chrome surfaces have automated accessibility smoke coverage.
