/* AlphaSmoke — REQ-PLAT-103 (PLAT-387) alpha-smoke quickstart target.
   tests/dx/quickstart.spec.ts renders this instead of the `app-frame` block
   while registry/blocks/app-frame/ is absent or not certified for the run's
   SHA, and reports the block cells `pending`. It is ordinary consumer code
   against the packed `aura-glass`: Surface (a chrome-layer header over a media
   backdrop, the material-presence subject), Button and Dialog. No
   'use client' directive: the page stays a Server Component in Next.js, so a
   client-boundary mistake in the package surfaces as an error. The one
   interactive compound (Dialog) sits behind SmokeDialog.client, the
   documented client-island pattern for overlays. */
import { Button, Environment, Surface } from 'aura-glass';
import { SmokeDialog } from './SmokeDialog.client';

/* A declared media backdrop with real luminance structure, so the chrome
   surface is glass over something (architecture §15.2 material presence). */
const BACKDROP_SVG = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">',
  '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">',
  '<stop offset="0" stop-color="#1d4ed8"/><stop offset="0.5" stop-color="#db2777"/><stop offset="1" stop-color="#f59e0b"/>',
  '</linearGradient></defs>',
  '<rect width="1440" height="900" fill="url(#g)"/>',
  '<circle cx="260" cy="120" r="180" fill="#f8fafc" fill-opacity="0.55"/>',
  '<circle cx="1180" cy="180" r="240" fill="#0f172a" fill-opacity="0.45"/>',
  '<circle cx="720" cy="700" r="300" fill="#22d3ee" fill-opacity="0.4"/>',
  '<path d="M0 60 L1440 0 L1440 40 L0 110 Z" fill="#ffffff" fill-opacity="0.35"/>',
  '</svg>',
].join('');
const BACKDROP = `data:image/svg+xml,${encodeURIComponent(BACKDROP_SVG)}`;

export function AlphaSmoke() {
  return (
    <Environment backdrop="media" image={BACKDROP}>
      <div style={{ position: 'relative', minHeight: '100vh', boxSizing: 'border-box', padding: 24, display: 'grid', alignContent: 'start', gap: 24 }}>
        <Surface
          layer="chrome"
          render={<header />}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '12px 16px' }}
        >
          <strong>AuraGlass</strong>
          <SmokeDialog />
        </Surface>
        <Surface render={<main />} style={{ display: 'grid', gap: 12, padding: 24, maxWidth: 560 }}>
          <h1>Install to beautiful</h1>
          <p>This page is the alpha-smoke quickstart target. The app-frame block replaces it once it is certified.</p>
          <div>
            <Button>Primary action</Button>
          </div>
        </Surface>
      </div>
    </Environment>
  );
}
