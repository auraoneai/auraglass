/* 4.x Date/string ↔ 5.0 date-value bridge for the date compat adapters
   (REQ-SURF-13). 4.x `Date` values convert client-side with
   fromDate(date, getLocalTimeZone()) (PRD-4 REQ-SURF-13); on the server the
   local zone is unknowable, so `timeZone` is required there. 4.x
   GlassDateField/GlassTimeField were native inputs whose values were ISO
   strings ('2026-09-18', '09:30'); those parse with parseDate/parseTime.
   Date-only adapters use CalendarDate so the 5.0 field shows day
   granularity. Public signatures use the AuraGlass-owned date value types
   (REQ-CMP-01: no date-foundation types in the emitted d.ts). */
import type * as React from 'react';

/* REQ-SURF-04: the value conversions live in src/date (the only allowlisted
   importer of `@internationalized/date`). Only the lazily loaded *.impl.tsx
   adapters value-import them; the adapter shells import types only. */
export { fromDate, getLocalTimeZone, toCalendarDate, toDateValue, toJsDate, toTimeValue } from '../../../date/legacy-bridge';

export type FirstDay = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
const DAYS: FirstDay[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export interface LegacyFieldProps {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorMessage?: React.ReactNode;
  error?: boolean | string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  locale?: string;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

/** Shared 4.x field props -> DateFieldLikeProps (label, description, error, flags). */
export function fieldProps(p: LegacyFieldProps): Record<string, unknown> {
  const err = typeof p.error === 'string' ? p.error : p.errorMessage;
  return {
    ...(p.label !== undefined ? { label: p.label } : {}),
    ...(p.helperText !== undefined ? { description: p.helperText } : {}),
    ...(err !== undefined ? { errorMessage: err } : {}),
    ...(p.error ? { isInvalid: true } : {}),
    ...(p.required ? { isRequired: true } : {}),
    ...(p.disabled ? { isDisabled: true } : {}),
    ...(p.readOnly ? { isReadOnly: true } : {}),
    ...(p.name !== undefined ? { name: p.name } : {}),
    ...(p.size !== undefined ? { size: p.size } : {}),
    ...(p.locale !== undefined ? { locale: p.locale } : {}),
    ...(p.firstDayOfWeek !== undefined ? { firstDayOfWeek: DAYS[p.firstDayOfWeek] } : {}),
  };
}

/** 4.x native-input onChange payload: an event-shaped object carrying the value. */
export function legacyChange(value: string) {
  return { target: { value }, currentTarget: { value } };
}
