# 3.2 Manual Certification Runbook

AuraGlass 3.2 is published to npm and GitHub. This runbook covers the remaining
manual certification work that cannot be honestly completed by automated CI.

## Scope

Run this pass against `aura-glass@3.2.0` and record results in
`reports/3.2-release/accessibility-certification.md` before describing 3.2 as
fully screen-reader or physical-touch certified.

## Required Environments

- macOS with VoiceOver and Safari or Chrome.
- Windows with NVDA or JAWS, if available.
- One physical iOS or Android phone.
- One physical tablet, if available.

## Screen-Reader Pass

Record browser, OS, screen reader, viewport, reviewer, date, and result.

Checklist:

- Menu / dropdown: trigger announces name and expanded state; ArrowDown, ArrowUp,
  Home, End, Enter, Space, and Escape are understandable; focus returns to the
  trigger on close.
- Menubar: root items announce menu context; arrow navigation is predictable;
  submenu open/close is announced; Escape unwinds focus.
- Select: trigger announces selected value and expanded state; options announce
  active/selected state; committed value is reflected in the form value.
- Combobox: input remains focused while options update; grouped options announce
  group context; committed option is announced.
- Dialog: title and description announce before content; Tab and Shift+Tab stay
  in the dialog; Escape closes and restores focus.
- Drawer: title and placement are understandable; focus moves into the drawer;
  Escape closes and restores focus.
- Popover: trigger relationship is understandable; outside click and Escape close
  without losing focus context.
- Tooltip: trigger has a useful accessible name; tooltip content is discoverable
  on keyboard focus where supported.
- Tabs: horizontal and vertical arrow navigation is predictable; selected tab and
  disabled tab states are announced.
- Command palette: input receives focus; filtered results are understandable;
  empty state is announced; selection action is clear.
- App shell navigation: landmarks are discoverable; rail icon buttons have names;
  mobile shell menu state is announced.
- Toast / notification: announcements occur without stealing focus; dismiss and
  action buttons are reachable and named.

## Physical Mobile / Touch Pass

Record device, OS, browser, viewport, reviewer, date, and result.

Checklist:

- Mobile app shell renders without clipping at common phone widths.
- Header, rail, menu, drawer, and command controls are reachable by touch.
- Touch targets are large enough for reliable activation.
- Overlays do not trap the page in an unrecoverable scroll or focus state.
- Drawer and popover outside-tap dismissal works where enabled.
- Select and combobox can be opened, scrolled, and committed by touch.
- Dialog and drawer close controls are reachable without overlap.
- Toast dismiss controls are reachable and do not overlap page controls.
- Reduced-motion preference is respected when enabled at OS/browser level.
- Orientation changes do not break app-shell layout.

## Result Template

```markdown
### Manual Certification Result

- Reviewer:
- Date:
- Package:
- Commit:
- Screen reader:
- OS/browser:
- Devices:
- Result: Pass / Fail / Partial
- Notes:
- Follow-ups:
```

## Current Status

- Automated app-chrome axe, keyboard, visual, mobile viewport, export, pack,
  Next, Vite, Storybook, and no-core-UI-dependency gates pass.
- Manual screen-reader certification is not yet recorded.
- Physical-device mobile/touch certification is not yet recorded.
