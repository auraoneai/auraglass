// scale.ts (SURF-172): own linear scale — no d3 (REQ-SURF-04).
export interface LinearScale {
  (v: number): number;
  domain(): readonly [number, number];
  range(): readonly [number, number];
}

export function linearScale(
  domain: readonly [number, number],
  range: readonly [number, number],
): LinearScale {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const span = d1 - d0;
  const fn = ((v: number) => (span === 0 ? (r0 + r1) / 2 : r0 + ((v - d0) / span) * (r1 - r0))) as LinearScale;
  fn.domain = () => domain;
  fn.range = () => range;
  return fn;
}
