# Migrating to the 5.0 date layer

4.x `GlassDatePicker`, `GlassDateRangePicker`, `GlassCalendar`, and
`GlassTimeline` become `DateField`, `DateRange`, `Calendar`, `Timeline`, and
`Scheduler` under `aura-glass/date` — one date model, one grammar.

## Import mapping

| 4.x | 5.0 |
| --- | --- |
| `GlassDatePicker` | `DateField` (`aura-glass/date`) |
| `GlassDateRangePicker` | `DateRange` (`aura-glass/date`) |
| `GlassCalendar` | `Calendar` (`aura-glass/date`) |
| `GlassTimeline` | `Timeline` (`aura-glass/date`) |
| — | `Scheduler` (`aura-glass/date`, new in 5.0) |

## Prop mapping

| 4.x | 5.0 | notes |
| --- | --- | --- |
| `selected` | `value` + `onValueChange` | grammar triple |
| `onChange` | `onValueChange` | |
| `minDate`/`maxDate` | `bounds={{ min, max }}` | config object |
| `range` | `mode="range"` on `DateRange` | implicit range mode removed |
| `locale` | `locale` | BCP-47 tag; week-start/direction derived |

## Notes

- Values are ISO strings or `Temporal`-like plain objects — never `Date`
  mutation; pass `serialize` for custom formats.
- `Calendar` renders headless-ready: month grid is a slot, so locale and
  RTL stay in the layer.

## Compat

`GlassDate*` adapters live in `src/compat/surf`; `AG_COMPAT_DATE=1`
silences; removed at `6.0`. Codemod: `aura-glass-codemod date`.
