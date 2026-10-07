/* CMP-323 compat: LiquidGlassButtonStyle (4.x) -> — (style object removed) (5.0).
   warnDeprecated fires at call time, once per page load per symbol; unmappable
   props drop with a single warning; never throws. Mapping per the target meta. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
const DEP = 'DEP-C0009';

/* 4.x exported a style object; 5.0 styles live in styles.css. A Proxy warns
   once on first property access (call-time, never module scope). */
export const LiquidGlassButtonStyle: Record<string, unknown> = new Proxy(
  {},
  {
    get() {
      warnDeprecated(DEP);
      return undefined;
    },
  },
);
export default LiquidGlassButtonStyle;
