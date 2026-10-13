# Migrating to the 5.0 date layer

4.x `GlassDatePicker`, `GlassDateRangePicker`, `GlassCalendar`, and
`GlassTimeline` become `DatePicker`, `DateRangePicker` and `Calendar` under
`aura-glass/date`, and `Timeline` from `aura-glass` — one date model, one
grammar.

## Import mapping

| 4.x | 5.0 |
| --- | --- |
| `GlassDatePicker` | `DatePicker` (`aura-glass/date`) |
| `GlassDateRangePicker` | `DateRangePicker` (`aura-glass/date`) |
| `GlassCalendar` | `Calendar` (`aura-glass/date`) |
| `GlassTimeline` | `Timeline` (`aura-glass`) |

## Prop mapping

| 4.x | 5.0 | notes |
| --- | --- | --- |
| `selected` | `value` + `onValueChange` | grammar triple |
| `onChange` | `onValueChange` | |
| `minDate`/`maxDate` | `minValue` / `maxValue` | |
| `range` | use `DateRangePicker` | its `value` is the range; there is no range mode on the single-date fields |
| `locale` | `locale` | BCP-47 tag; week-start/direction derived |

## Notes

- Values are `@internationalized/date` values (`CalendarDate`,
  `CalendarDateTime` or `ZonedDateTime`) — never mutated `Date`s. A `name`
  prop serializes the value as ISO for form submission.
- Locale and direction stay in the layer: pass `locale`, `dir` and
  `firstDayOfWeek` where you need to override the defaults.

## Compat

`GlassDate*` adapters live in `aura-glass/compat`; silence their warnings
with `<AuraGlassProvider deprecations="silent">`; removed at `6.0`.
Codemod: `npx aura-glass-cli migrate 4to5`.
