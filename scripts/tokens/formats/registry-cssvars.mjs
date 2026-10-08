// MAT-072: dist/tokens/registry-cssvars.json — {cssVars:{theme,light,dark}}.
import { colorToCss } from '../color.mjs';
import { renderValue } from './_shared.mjs';

/** Emit dist/tokens/registry-cssvars.json — {cssVars:{theme,light,dark}} (MAT-072). */
export function emitRegistry(cells) {
  const theme = {}; const light = {}; const dark = {};
  for (const c of cells) {
    if (!c.cssVar || c.cssVar.startsWith('--_ag-')) continue;
    if (c.renderType === 'color' && c.axis === 'scheme') {
      if (c.axisValue === 'light') light[c.cssVar] = colorToCss(c.value.light);
      if (c.axisValue === 'dark') dark[c.cssVar] = colorToCss(c.value);
      continue;
    }
    if (!c.axis) theme[c.cssVar] = renderValue(c);
  }
  return JSON.stringify({ cssVars: { theme, light, dark } }, null, 2) + '\n';
}

