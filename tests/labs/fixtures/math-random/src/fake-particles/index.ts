// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
export function ParticleField({ count = 40 }: { count?: number }) {
  const seeds = Array.from({ length: count }, () => Math.random() * 100);
  return { seeds };
}
