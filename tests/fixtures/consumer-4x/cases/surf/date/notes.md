## date cases

| case | exercises | expected |
| --- | --- | --- |
| `DatePicker.page.tsx` | GlassDatePicker/GlassDateRangePicker/GlassCalendar, no `format` | renamed to `aura-glass/date`; `Date`↔`CalendarDate` via compat (client-side `fromDate(getLocalTimeZone())`) |
| `DateFnsDirect.page.tsx` | direct date-fns import | `deps` codemod row: migrate to `@internationalized/date` |
