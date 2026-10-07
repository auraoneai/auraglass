import { describe, expect, it } from '@jest/globals';
import { formatMediaTime, formatMediaTimeIso } from '../formatMediaTime';

describe('formatMediaTime (§12.1)', () => {
  it.each([
    [0, '0:00'], [92, '1:32'], [3725, '1:02:05'], [59.9, '0:59'],
    [NaN, '0:00'], [Infinity, '0:00'], [-5, '0:00'],
  ])('%s → %s', (s, out) => {
    expect(formatMediaTime(s)).toBe(out);
  });
  it('hours: always forces the hour column', () => {
    expect(formatMediaTime(92, { hours: 'always' })).toBe('0:01:32');
  });
  it('spoken form', () => {
    expect(formatMediaTime(92, { spoken: true })).toBe('1 minute 32 seconds');
    expect(formatMediaTime(3725, { spoken: true })).toBe('1 hour 2 minutes 5 seconds');
    expect(formatMediaTime(60, { spoken: true })).toBe('1 minute 0 seconds');
    expect(formatMediaTime(NaN, { spoken: true })).toBe('unknown duration');
  });
  it('ISO-8601 for <time datetime>', () => {
    expect(formatMediaTimeIso(92)).toBe('PT1M32S');
    expect(formatMediaTimeIso(3725)).toBe('PT1H2M5S');
    expect(formatMediaTimeIso(NaN)).toBe('PT0S');
  });
});
