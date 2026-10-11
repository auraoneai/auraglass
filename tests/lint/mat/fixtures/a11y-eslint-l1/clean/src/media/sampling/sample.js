/* Fixture: src/media/sampling is covered by the expiring exemption row. */
export function sampleOwned(ctx) {
  return ctx.getImageData(0, 0, 32, 32);
}
