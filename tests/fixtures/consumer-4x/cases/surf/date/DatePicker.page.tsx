// @ts-nocheck — frozen 4.x consumer usage (codemod input). REQ-SURF-15: the
// date case must NOT use `format` (removed; the codemod leaves a TODO for it
// on any case that does).
import { useState } from 'react';
import { GlassDatePicker, GlassDateRangePicker, GlassCalendar } from 'aura-glass';

type Range = { from: Date | null; to: Date | null };

export function BookingPage() {
  const [range, setRange] = useState<Range>({ from: new Date(2026, 9, 1), to: new Date(2026, 9, 7) });
  return (
    <>
      <GlassDatePicker value={new Date(2026, 9, 7)} onChange={(d) => console.log(d)} minDate={new Date(2026, 0, 1)} required helperText="Pick a day" />
      <GlassDateRangePicker value={range} onChange={setRange} />
      <GlassCalendar selectedDate={new Date(2026, 9, 7)} onDateSelect={(d) => console.log(d)} />
    </>
  );
}
