# Manual Browser QA Checklist

Generated: 2026-05-06

This checklist captures the manual browser and assistive-technology checks that remain outside the automated AuraGlass release gates.

## Automated Baseline Already Covered

- `npm run test:visual:ci`: Chromium release visual/audit guardrails.
- `npm run test:visual:matrix`: Chromium, Firefox, WebKit, and Mobile Safari emulation visual/audit guardrails.
- `npm run test:a11y`: automated accessibility checks.
- `npm run test:glass-contrast`: automated contrast guardrails.
- Next 14 / React 18 and Next 15 / React 19 integration smoke tests through `prepublishOnly` and publish dry-run.

## Required Manual Matrix

| Area | Target | Minimum check |
| --- | --- | --- |
| Desktop Safari | Latest stable Safari on macOS | Storybook loads, certified components render, keyboard focus is visible, no hydration/runtime console errors. |
| Mobile Safari device | Latest stable iOS Safari on physical iPhone or iPad | Layouts fit viewport, touch targets are usable, overlays and scroll containers work, no critical console errors through remote inspection. |
| Firefox desktop | Latest stable Firefox | Run representative keyboard navigation, forms, popovers, modals, charts, and reduced-motion examples beyond the automated audit story. |
| Chromium desktop | Latest stable Chrome or Edge | Run representative keyboard navigation, forms, popovers, modals, charts, and high-density dashboards beyond the automated audit story. |
| Reduced motion | macOS/iOS reduced-motion enabled | Motion-heavy components reduce or suppress nonessential animation and remain readable/operable. |
| Forced colors / high contrast | Windows High Contrast or forced-colors emulation | Text, borders, focus indicators, buttons, form controls, modals, and menus remain perceivable and operable. |
| Screen reader smoke | VoiceOver on macOS or iOS | Navigation landmarks, labels, dialogs, menus, tabs, and form controls announce useful names/states. |

## Evidence To Record Before Publish

- Browser, OS, and device versions.
- Storybook or fixture URL used.
- Pass/fail summary for each target above.
- Screenshots or short notes for any visual or interaction defect.
- Console errors that are not expected development warnings.
- Follow-up issue IDs for defects accepted as non-blocking.

## Current Status

Manual browser QA is not complete until a human records evidence for every target in the required matrix.
