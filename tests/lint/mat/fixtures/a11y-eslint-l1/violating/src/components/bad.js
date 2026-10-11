/* Fixture: runtime pixel sampling for contrast in a component (must fail). */
export function badgeTone(ctx) {
  const px = ctx.getImageData(0, 0, 1, 1);
  return px.data[0] > 127 ? "dark" : "light";
}
