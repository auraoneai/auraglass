// @ts-nocheck
// Fixture: src/motion owns the shared ticker; rAF is legal here.
export function loop(cb: FrameRequestCallback) {
  return requestAnimationFrame(cb);
}
