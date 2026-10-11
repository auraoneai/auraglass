// @ts-nocheck
// Fixture (REQ-MAT-51): src/date is a guarded dir — a component-owned loop is an error.
export function startClock(onTick: () => void) {
  return setInterval(onTick, 1000);
}
