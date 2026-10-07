# PROMPT-12g (DATA): `aura-glass/date` — fields, calendars, pickers, ISO weeks

You are implementing part of PRD-DATA (Data and Date; self-id PRD-12) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Branch: `main`.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_DATA_PRD.md` §2.4 (E-27..E-31), §3 (`./date` set and its deviation), §4.2 (date roles), §4.5, §5.10 (REQ-DATA-62..69), §8 `src/date/*` rows, §11 items 5, 6, 9, §12.1/§12.2 date rows, §13 date row, §14 DatePicker row, §15, §16 date lines, §20 step 8.
- Architecture: D-13 (RA optional peer for `/date`), §11.1 (selection convention), §11.2 #14.
- PRD-CTL controls (field shell, flagship 14 shared): `docs/auraglass-5/prd/AURAGLASS_FLAGSHIP_CONTROLS_PRD.md` §4.4.
- Evidence: `docs/auraglass-5/autopsy/accessibility.md` ACCESSIBILITY-09 (the architecture cites it as -08).
- Tasks: `docs/auraglass-5/tasks/DATA.json` DATA-092..DATA-107.

Requirements: REQ-DATA-62, -63, -64, -65, -66, -67, -68, -69. Acceptance: AC-DATA-08 (date specs), AC-DATA-12 (date case), AC-DATA-17 (date).

Numbering: cite PRDs by key (SC-01: TRUST, REL, PKG, DS, MAT, A11Y, MOT, PERF, FND, CTL, OVL, NAV, DATA, AI, DX, QA, SB). `DATA.json` `depends_on` holds only real anchor task ids (SC-40); the PRD body uses §16 numbers with the key authoritative. Crosswalk and the shared contracts this PRD consumes: `prompts/PROMPT_12_DATA.md`; binding registry: `docs/auraglass-5/prd/_shared-contracts.md`.

## 2. Scope
May create: `src/date/{DateProvider.tsx,DateField.tsx,TimeField.tsx,Calendar.tsx,RangeCalendar.tsx,DatePicker.tsx,DateRangePicker.tsx,TimePicker.tsx,week-number.ts,week-number.test.ts,date-props.test.tsx,date-props.types.ts,DatePicker.test.tsx,DateRangePicker.test.tsx,TimePicker.test.tsx,DateField.stories.tsx,DatePicker.stories.tsx,DateRangePicker.stories.tsx,Calendar.stories.tsx,TimePicker.stories.tsx}`, `tests/date/{date-picker.responsive,date.locale}.spec.ts`, the APG specs `tests/a11y/apg/{calendar,date-picker,time-picker}.apg.spec.ts` (SC-30; harness A11Y-073), and the `deps` codemod fixture `packages/cli/src/migrate/4to5/__fixtures__/deps/data-date-peers-missing/{input,output}.*` (SC-33 case naming; PRD-DX owns the engine and runner, DX-041).
May modify: `src/date/index.ts`, `src/date/date.css`, `tests/rsc/data-hydration.test.tsx` (add the `date` case), `tests/exports/data-date-entries.test.ts` (flip the `./date` set to required).
Must NOT touch: `src/components/input/GlassDate*.tsx`, `src/components/calendar/**`, `src/utils/dateAdapters.ts` (12h removes them), `package.json`, `src/data/**`.

## 3. Prerequisites (check each; stop with a blocker report if one fails)
- 12b merged: RAC and `@internationalized/date` are optional peers (PKG-059) + devDependencies (`rg -n '"@internationalized/date"' package.json`); `no-restricted-properties` block present.
- PRD-CTL field shell (CTL-007; label/description/error parts, `size` scale, `content-sunken`): `test -f src/components/field/Field.client.tsx`. PRD-CTL `Button` (CTL-055).
- PRD-OVL `Popover` (OVL-063) and bottom `Sheet` (OVL-097) with focus return: `test -f src/components/popover/Popover.client.tsx && test -f src/components/sheet/Sheet.client.tsx`.
- PRD-A11Y provider (A11Y-029) exposes `locale`, `dir`, `timeZone`; announcer (A11Y-054): `rg -n "timeZone" src/theme/AuraGlassProvider.tsx`.
- PRD-A11Y APG harness (A11Y-073) and L5 Behaviour (QA-082): `test -f tests/a11y/apg/harness.ts`.
- PRD-DX `doctor` (DX-035) and codemod engine (DX-041): `test -f packages/cli/src/commands/doctor.ts`.
- PRD-FND alpha check (FND-001, D-13): if Base UI Calendar coverage was judged sufficient, RAC may be dropped before beta. Record the decision. `@internationalized/date` stays either way.

## 4. Steps
1. **DATA-093 week-number.ts** first (pure). Write all 20 fixed cases in `week-number.test.ts`, including 2020-12-31 → 2020-W53, 2021-01-03 → 2020-W53, 2021-01-04 → 2021-W1, 2026-12-31 → 2026-W53, 2027-01-03 → 2026-W53, 2027-01-04 → 2027-W1.
2. **DATA-092 DateProvider.** Bridge PRD-A11Y locale to RAC `I18nProvider`; `useDateEnv()`.
3. **DATA-094 DateField/TimeField.** RAC `DateField`/`TimeField` + `DateInput`/`DateSegment` inside the PRD-CTL field shell. The public props are exactly the REQ-DATA-63 list. `onValueChange` is wired to RAC `onChange`, and `onChange` is `Omit`ted from the public type. `name` submits an ISO string.
4. **DATA-095 Calendar/RangeCalendar.** RAC grid with every key in REQ-DATA-64, `aria-selected`, a polite month heading, unavailable cells `aria-disabled="true"` and focusable with a visible PRD-A11Y focus ring, `showWeekNumbers` rowheaders from `week-number.ts`, and `firstDayOfWeek`. Selection is never class-only.
5. **DATA-096 DatePicker.** Trigger `Button` "Choose date" (from `messages`) with `aria-describedby` → current value; `role="dialog"` with `aria-label` = field label; PRD-OVL `Popover` ≥ 640 px container width, bottom `Sheet` below; focus on selected/today on open; Escape returns focus to the trigger.
6. **DATA-097 DateRangePicker.** `presets` listbox beside (≥ 640 px) or above (< 640 px); `visibleMonths` default 2 at ≥ 768 px container width, else 1.
7. **DATA-098 TimePicker.** `TimeField` + `Popover` with hour/minute (and AM/PM for `hourCycle` 12) listbox columns; `minuteStep` 1|5|10|15|30, default 5.
8. **DATA-099 date.css.** Target `data-ag-part` and RAC state attributes; cells ≥ 44×44 under coarse pointer and ≥ 24×24 always; forced-colors `Highlight` selection; no literals.
9. **DATA-100/101** unit tests and stories per §13 (each with a `Locales` story: en-US, de-DE, ja-JP, ar-EG).
10. **DATA-102, 103, 105, 106** Playwright specs as described, three engines, remote.
11. **DATA-104** hydration `date` case with the TZ child-process split.
12. **DATA-107** exports (7 components + 5 helpers), flip the `./date` set to required, and write the `deps` fixture plus the exact message "aura-glass/date requires react-aria-components and @internationalized/date" for PRD-DX `doctor` (DX-035).

## 5. Tests to run
Local: `./node_modules/.bin/jest src/date`, `./node_modules/.bin/tsc --noEmit -p tsconfig.json`, `./node_modules/.bin/eslint src/date`. Remote: `tests/date/*.spec.ts` and `tests/a11y/apg/{calendar,date-picker,time-picker}.apg.spec.ts` on Chromium/WebKit/Firefox against the built Storybook, `tests/rsc/data-hydration.test.tsx` (TZ lane), `tests/exports/data-date-entries.test.ts`, `scripts/ci/verify-side-effects.mjs` (PKG-042, `./date` entry), and `scripts/ci/verify-size-budgets.mjs` for the `docs/size-budgets.json` rows `{ DatePicker }` ≤ 10 KB, `{ DateRangePicker }` ≤ 12 KB, `date.css` ≤ 4 KB.
Remote means GitHub Actions (public/private handling per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`) or an ephemeral EC2 runner via the `auraone-remote-run` skill. Never local Docker, never a local browser, no `npx` when `./node_modules/.bin/<tool>` exists.

## 6. Visual evidence
Remote screenshots (three engines, light/dark, 1440 and 390 px): DatePicker open as a Popover (selected + today + unavailable + focused cells distinguishable) and as a Sheet at 390 px; `WeekNumbers` across the 2026-W53 boundary (December 2026); DateRangePicker `Presets` + `TwoMonths`; TimePicker 12h open; `Locales` for ar-EG (RTL) and de-DE (Monday first); a forced-colors capture of the calendar. Upload as a CI artifact gallery for human review.

## 7. Integrity rules (binding)
No `Date.prototype.toLocale*` and no implicit time zone in `src/date/**`. Don't add a format-string prop. Don't mock RAC or `@internationalized/date` in browser specs. Don't reduce the 20 ISO-week cases or drop an engine. No `.skip`/`.only`, no snapshot updates to pass. No local Docker or local browser.

## 8. Exit criteria
- REQ-DATA-62/63: `date-props.test.tsx` and the type test green; `onValueChange` emits `CalendarDate`/`Time`.
- REQ-DATA-64 / AC-DATA-08: `calendar.apg.spec.ts` green in three engines.
- REQ-DATA-65/66 / AC-DATA-08, AC-DATA-17: `date-picker.apg.spec.ts` and `date-picker.responsive.spec.ts` green in three engines.
- REQ-DATA-67: 20 week cases green. REQ-DATA-68: TimePicker unit and spec green.
- REQ-DATA-69 / AC-DATA-12 (date): hydration `date` case 0 warnings across UTC+14/UTC−11; lint clean.
- `./date` export set (12 names) required and green.

## 9. Final report format
```
PROMPT-12g REPORT
Branch/SHA:
Tasks: DATA-092..107 -> done|blocked (reason) each
RAC retention decision (D-13): kept|dropped (evidence)
Budgets: DatePicker=…, DateRangePicker=… KB gz, date.css=… KB gz (CI URL)
Prereq blockers: (exact output)
Tests: name -> engine -> pass/fail (local|remote URL)
Visual evidence: artifact URL + reviewer notes
Deviations from PRD/architecture: (each with evidence) or none
Files changed:
```
