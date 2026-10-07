/* MAT-314: Machado, Oliveira & Fernandes (2009) severity-1.0 matrices, applied
 *  in LINEAR RGB per the paper (not gamma space). protan/deutan/tritan. */

export type CvdType = 'protan' | 'deutan' | 'tritan';

const MACHADO: Record<CvdType, readonly number[]> = {
  protan: [
    0.152286, 1.052583, -0.204868,
    0.114503, 0.786281, 0.099216,
    -0.003882, -0.048116, 1.051998,
  ],
  deutan: [
    0.367322, 0.860646, -0.227968,
    0.280085, 0.672501, 0.047413,
    -0.011820, 0.042940, 0.968881,
  ],
  tritan: [
    1.255528, -0.076749, -0.178779,
    -0.078411, 0.930809, 0.147602,
    0.004733, 0.691367, 0.303900,
  ],
};

const linearize = (v: number) =>
  v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
const gamma = (v: number) =>
  v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;

/** Simulate a CVD type at severity 1.0 on an sRGB triple (0..1). */
export function simulateCvd(type: CvdType, r: number, g: number, b: number): [number, number, number] {
  const m = MACHADO[type];
  const lr = linearize(r), lg = linearize(g), lb = linearize(b);
  const out = [
    m[0]! * lr + m[1]! * lg + m[2]! * lb,
    m[3]! * lr + m[4]! * lg + m[5]! * lb,
    m[6]! * lr + m[7]! * lg + m[8]! * lb,
  ].map((v) => Math.min(1, Math.max(0, gamma(v))));
  return out as [number, number, number];
}

/** feColorMatrix row matrix for the SVG toggle in the ColorVision story
 *  (operates on sRGB values directly — an approximation used only for the
 *  interactive filter; conformance numbers come from the linear-space math). */
export function feColorMatrix(type: CvdType): string {
  const m = MACHADO[type];
  return `${m.slice(0, 3).join(' ')} 0 0 ${m.slice(3, 6).join(' ')} 0 0 ${m.slice(6, 9).join(' ')} 0 0 0 0 0 1 0`;
}
