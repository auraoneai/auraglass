// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
export function spin(node: HTMLElement | null) {
  const tick = () => { if (node) node.dataset.tick = '1'; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}
