## date cases

| case | exercises | expected |
| --- | --- | --- |
| `DatePicker.page.tsx` | GlassDatePicker (value/onChange/minDate/required/helperText) / GlassDateRangePicker (value `{from,to}`/onChange) / GlassCalendar (selectedDate/onDateSelect), no `format` | renamed to `aura-glass/date`; `Date`↔`CalendarDate` via compat (client-side `fromDate(getLocalTimeZone())`); flagship (0 TODOs) |
| `DateFnsDirect.page.tsx` | direct date-fns import (declared in the canary app's `package.json`) | `deps` codemod row: migrate to `@internationalized/date`, or keep `date-fns` declared; flagship (tsc on 5.0, no render: it exports a formatter) |
