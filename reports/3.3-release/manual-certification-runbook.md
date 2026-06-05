# 3.3 Manual Accessibility Certification Runbook

This runbook covers the external manual checks required by `auraglass33PRD.md` Pillar 7. These checks require real assistive technology and physical devices; they cannot be completed by CI or by this automated agent.

Record results in `reports/3.3-release/accessibility-certification.md` before making final 3.3 accessibility certification claims.

## Required Metadata

Record this metadata for every pass:

- Reviewer:
- Date:
- Package:
- Commit:
- Surface:
- OS:
- Browser:
- Screen reader:
- Device:
- Viewport:
- Orientation:
- Motion setting:
- Contrast setting:
- Result: Pass / Fail / Partial
- Notes:
- Follow-ups:

## Required Environments

- macOS with VoiceOver and Safari or Chrome.
- Windows with NVDA or JAWS, if available.
- One physical iOS or Android phone.
- One physical tablet, or explicit unavailable rationale.
- Reduced-motion preference enabled and disabled.
- High-contrast or increased-contrast setting where supported.

## Screen-Reader Pass

Record one result block per environment and surface group.

- [ ] Menu / dropdown: trigger announces name and expanded state; ArrowDown, ArrowUp, Home, End, Enter, Space, and Escape are understandable; focus returns to the trigger on close.
- [ ] Menubar: root items announce menu context; arrow navigation is predictable; submenu open/close is announced; checkbox/radio item state is announced; Escape unwinds focus.
- [ ] Select: trigger announces selected value and expanded state; options announce active/selected state; committed value is reflected in the form value.
- [ ] Combobox: input remains focused while options update; grouped options announce group context; committed option is announced.
- [ ] Dialog: title and description announce before content; Tab and Shift+Tab stay in the dialog; Escape closes and restores focus.
- [ ] Drawer: title and placement are understandable; focus moves into the drawer; Escape closes and restores focus.
- [ ] Popover: trigger relationship is understandable; outside click and Escape close without losing focus context.
- [ ] Tooltip: trigger has a useful accessible name; tooltip content is discoverable on keyboard focus where supported.
- [ ] Tabs: horizontal and vertical arrow navigation is predictable; selected tab and disabled tab states are announced.
- [ ] Command palette: input receives focus; filtered results are understandable; empty state is announced; selection action is clear.
- [ ] App shell navigation: landmarks are discoverable; rail icon buttons have names; mobile shell menu state is announced.
- [ ] Workspace tabs: tab list is announced; selected tab and panel relationship are understandable; keyboard activation is predictable.
- [ ] Toast / notification center: announcements occur without stealing focus; dismiss and action controls are reachable and named; repeated notifications remain understandable.
- [ ] Production workflow components: empty, loading, validation, error, filter, search, date/time, and grouped-combobox states are announced at the right urgency.

## Physical Phone / Touch Pass

Record device, OS, browser, viewport, orientation, reviewer, date, and result.

- [ ] Mobile app shell renders without clipping at common phone widths.
- [ ] Header, rail, menu, drawer, and command controls are reachable by touch.
- [ ] Touch targets are large enough for reliable activation.
- [ ] Overlays do not trap the page in an unrecoverable scroll or focus state.
- [ ] Drawer and popover outside-tap dismissal works where enabled.
- [ ] Select and combobox can be opened, scrolled, and committed by touch.
- [ ] Dialog and drawer close controls are reachable without overlap.
- [ ] Toast dismiss controls are reachable and do not overlap page controls.
- [ ] Notification-center action and dismiss controls are reachable and do not overlap page controls.
- [ ] Reduced-motion preference is respected when enabled at OS/browser level.
- [ ] High-contrast or increased-contrast setting remains legible where supported.
- [ ] Orientation changes do not break app-shell layout.

## Physical Tablet / Touch Pass

Record device, OS, browser, viewport, orientation, reviewer, date, and result. If no tablet is available, record the explicit unavailable rationale in the certification report.

- [ ] Tablet app shell uses the expected navigation density.
- [ ] Header, rail, menu, drawer, and command controls are reachable by touch.
- [ ] Overlays remain positioned and dismissable in portrait and landscape.
- [ ] Select and combobox can be opened, scrolled, and committed by touch.
- [ ] Dialog and drawer close controls are reachable without overlap.
- [ ] Toast and notification-center controls remain reachable at tablet breakpoints.
- [ ] Reduced-motion preference is respected.
- [ ] High-contrast or increased-contrast setting remains legible where supported.

## Result Template

```markdown
### Manual Certification Result

- Reviewer:
- Date:
- Package:
- Commit:
- Surface:
- Environment:
- Screen reader:
- Device:
- Viewport:
- Orientation:
- Motion setting:
- Contrast setting:
- Result: Pass / Fail / Partial
- Notes:
- Follow-ups:
```

## Failure Handling

- Convert each manual failure into a code task before 3.3 release sign-off.
- Record the failing surface, environment, reproduction steps, expected behavior, actual behavior, severity, and owner.
- Do not mark the certification complete while a blocking failure remains unresolved.
- Non-blocking deferrals must include user impact, release rationale, and the follow-up issue link.

## Current Status

- [x] 3.3 manual certification runbook created.
- [x] 3.3 certification evidence scaffold created.
- [ ] Manual screen-reader certification recorded. Pending external.
- [ ] Physical phone/touch certification recorded. Pending external.
- [ ] Physical tablet/touch certification recorded or explicitly unavailable. Pending external.
