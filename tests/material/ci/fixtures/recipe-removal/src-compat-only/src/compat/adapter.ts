declare const glassFoundation: { buildSurfaceStyles(p: unknown): unknown };
export const wrap = (p: unknown) => glassFoundation.buildSurfaceStyles(p);
