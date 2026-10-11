/** @jest-environment node */
// REQ-SURF-103: ISO-8601 week numbers from a calendar date via Date.UTC — 20
// fixed cases, each run under TZ=Asia/Tokyo and TZ=America/Los_Angeles.
// The time zone of a running process cannot be switched from inside Jest's
// sandbox, so each zone runs week-number.ts in a child Node process started
// with that TZ (and the in-process run covers the host zone).
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { CalendarDate } from '@internationalized/date';
import { isoWeekNumber } from './week-number';

const CASES: ReadonlyArray<readonly [number, number, number, number]> = [
  [2020, 12, 31, 53],
  [2021, 1, 1, 53],
  [2021, 1, 3, 53],
  [2021, 1, 4, 1],
  [2026, 12, 28, 53],
  [2026, 12, 29, 53],
  [2026, 12, 30, 53],
  [2026, 12, 31, 53],
  [2027, 1, 1, 53],
  [2027, 1, 2, 53],
  [2027, 1, 3, 53],
  [2027, 1, 4, 1],
  [2026, 1, 1, 1],
  [2025, 12, 29, 1],
  [2024, 12, 30, 1],
  [2024, 2, 29, 9],
  [2019, 12, 30, 1],
  [2015, 12, 31, 53],
  [2008, 12, 29, 1],
  [2026, 10, 10, 41],
];

const MODULE_URL = pathToFileURL(join(__dirname, 'week-number.ts')).href;

/** Node < 23.6 needs the flag to load a .ts module; later versions strip types by default. */
function stripTypesFlag(): string[] {
  const [major = 0, minor = 0] = process.versions.node.split('.').map(Number);
  return major < 23 || (major === 23 && minor < 6) ? ['--experimental-strip-types', '--no-warnings'] : ['--no-warnings'];
}

function runInZone(tz: string): { offset: number; weeks: number[] } {
  const script = `
    const { isoWeekNumber } = await import(${JSON.stringify(MODULE_URL)});
    const cases = JSON.parse(process.argv[1]);
    const weeks = cases.map(([year, month, day]) => isoWeekNumber({ year, month, day }));
    process.stdout.write(JSON.stringify({ offset: new Date(Date.UTC(2021, 0, 4)).getTimezoneOffset(), weeks }));
  `;
  const out = execFileSync(process.execPath, [...stripTypesFlag(), '--input-type=module', '-e', script, JSON.stringify(CASES)], {
    env: { ...process.env, TZ: tz },
    encoding: 'utf8',
  });
  return JSON.parse(out) as { offset: number; weeks: number[] };
}

describe.each([
  ['Asia/Tokyo', -540],
  ['America/Los_Angeles', 480],
] as const)('isoWeekNumber under TZ=%s', (tz, expectedOffset) => {
  const result = runInZone(tz);

  it('the child process really runs in that zone', () => {
    expect(result.offset).toBe(expectedOffset);
  });

  it.each(CASES.map((c, i) => [...c, i] as const))('%i-%i-%i → W%i', (_y, _m, _d, week, i) => {
    expect(result.weeks[i]).toBe(week);
  });
});

describe('isoWeekNumber in the host zone', () => {
  it.each(CASES)('%i-%i-%i → W%i (CalendarDate input)', (y, m, d, week) => {
    expect(isoWeekNumber(new CalendarDate(y, m, d))).toBe(week);
  });

  it('has exactly 20 fixed cases', () => {
    expect(CASES).toHaveLength(20);
  });
});
