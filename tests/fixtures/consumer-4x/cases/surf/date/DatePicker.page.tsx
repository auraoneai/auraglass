// @ts-nocheck — frozen 4.x consumer usage (codemod input). REQ-SURF-15: the
// date case must NOT use `format` (removed; the codemod leaves a TODO for it
// on any case that does).
import { GlassDatePicker, GlassDateRangePicker, GlassCalendar } from 'aura-glass';

export function BookingPage() {
  const [range, setRange] = useState({ start: new Date(2026, 9, 1), end: new Date(2026, 9, 7) });
  return (
    <>
      <GlassDatePicker value={new Date(2026, 9, 7)} onChange={(d) => console.log(d)} minDate={new Date(2026, 0, 1)} required helperText="Pick a day" />
      <GlassDateRangePicker startDate={range.start} endDate={range.end} onChange={setRange} />
      <GlassCalendar value={new Date(2026, 9, 7)} weekNumbers />
    </>
  );
}
import { useState } from 'react';
