/* MAT-274: Server Component emitting one synchronous inline <script nonce>
   before first paint. The body is the bundled+minified pre-paint routine
   (src/theme/generated/prepaint-script.ts) plus the invocation with the
   JSON-encoded args; `<` is escaped as < so the body is safe inside an
   inline script element. No eval / new Function anywhere.
   auraGlassPrepaintScript (SC-23, DX REQ-DX-12) is the same compiled body as
   a string constant for Vite and other non-RSC heads — it self-invokes with
   default args; heads that need args emit `__agP(window, document, args)`
   themselves. */
import type * as React from 'react';
import type { AuraGlassScriptProps } from '../contracts/preferences';
import { PREPAINT_IMPL } from './generated/prepaint-script';

const escapeInline = (s: string): string => s.replace(/</g, '\\u003c');

/** The full emitted body for non-RSC heads (impl + default invocation). */
export const auraGlassPrepaintScript: string =
  `${PREPAINT_IMPL}__agP(window,document,{});`;

export const AuraGlassScript = ({
  nonce,
  storageKey = 'ag:prefs:v1',
  defaults,
}: AuraGlassScriptProps): React.ReactElement => {
  const args = escapeInline(JSON.stringify({ storageKey, defaults: defaults ?? {} }));
  const body = `${PREPAINT_IMPL}__agP(window,document,${args});`;
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: body }} />;
};
