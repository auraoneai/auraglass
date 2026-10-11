/* MAT-314: CIEDE2000 (ΔE00) over CIE Lab — implementation after Sharma, Wu &
 *  Dalal (2005), eq. 1-36. Unit-tested in tests/a11y/color-math.test.ts against
 *  the paper's reference pairs to ±0.0001. */

export interface Lab { L: number; a: number; b: number }

const rad = Math.PI / 180;

export function deltaE2000(x: Lab, y: Lab, kL = 1, kC = 1, kH = 1): number {
  const C1 = Math.hypot(x.a, x.b);
  const C2 = Math.hypot(y.a, y.b);
  const CBar = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Math.pow(CBar, 7) / (Math.pow(CBar, 7) + Math.pow(25, 7))));
  const a1p = x.a * (1 + G);
  const a2p = y.a * (1 + G);
  const C1p = Math.hypot(a1p, x.b);
  const C2p = Math.hypot(a2p, y.b);
  const h1p = (C1p === 0 ? 0 : Math.atan2(x.b, a1p) / rad + 360) % 360;
  const h2p = (C2p === 0 ? 0 : Math.atan2(y.b, a2p) / rad + 360) % 360;
  const dLp = y.L - x.L;
  const dCp = C2p - C1p;
  let dhp = 0;
  if (C1p * C2p !== 0) {
    dhp = h2p - h1p;
    if (dhp > 180) dhp -= 360;
    else if (dhp < -180) dhp += 360;
  }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp / 2) * rad);
  const LBarP = (x.L + y.L) / 2;
  const CBarP = (C1p + C2p) / 2;
  const hBarP = C1p * C2p === 0 ? h1p + h2p
    : Math.abs(h1p - h2p) <= 180 ? (h1p + h2p) / 2
    : (h1p + h2p + (h1p + h2p < 360 ? 360 : -360)) / 2;
  const T = 1
    - 0.17 * Math.cos((hBarP - 30) * rad)
    + 0.24 * Math.cos(2 * hBarP * rad)
    + 0.32 * Math.cos((3 * hBarP + 6) * rad)
    - 0.20 * Math.cos((4 * hBarP - 63) * rad);
  const dTheta = 30 * Math.exp(-Math.pow((hBarP - 275) / 25, 2));
  const RC = 2 * Math.sqrt(Math.pow(CBarP, 7) / (Math.pow(CBarP, 7) + Math.pow(25, 7)));
  const SL = 1 + (0.015 * Math.pow(LBarP - 50, 2)) / Math.sqrt(20 + Math.pow(LBarP - 50, 2));
  const SC = 1 + 0.045 * CBarP;
  const SH = 1 + 0.015 * CBarP * T;
  const RT = -Math.sin(2 * dTheta * rad) * RC;
  return Math.sqrt(
    Math.pow(dLp / (kL * SL), 2) +
    Math.pow(dCp / (kC * SC), 2) +
    Math.pow(dHp / (kH * SH), 2) +
    RT * (dCp / (kC * SC)) * (dHp / (kH * SH)),
  );
}
