// @ts-nocheck
/* Frozen 4.x consumer case — D03. An app rendering 4.x OptimizedGlass cards.
   Must render pixel-identical on 4.2/4.3 without data-ag-preview="v5". */
import * as React from 'react';
import { OptimizedGlass } from 'aura-glass';

export function App() {
  return (
    <main style={{ padding: 24, background: '#0b1020', minHeight: '100vh' }}>
      <OptimizedGlass intent="primary" elevation="level2" rounded="lg" hover liftOnHover>
        <h2>Weekly digest</h2>
        <p>Six updates from your workspace.</p>
      </OptimizedGlass>
      <OptimizedGlass elevation={1} tier="medium" glowIntensity={0.4} style={{ marginTop: 16 }}>
        <button type="button">Open report</button>
      </OptimizedGlass>
    </main>
  );
}

export default App;
