// @ts-nocheck
/* Frozen 4.x consumer case — provider tree + motion preference hook usage a
   4.x app relies on (cookie-consent + reduced-motion surfaces, MAT-362). */
import * as React from 'react';
import { ThemeProvider, MotionPreferenceProvider, useMotionPreference, useReducedMotion } from 'aura-glass';

function Banner() {
  const { motion } = useMotionPreference();
  const reduced = useReducedMotion();
  return <div data-motion={motion} data-reduced={reduced || undefined}>Announcements</div>;
}

export function App() {
  return (
    <ThemeProvider defaultMode="dark">
      <MotionPreferenceProvider>
        <Banner />
      </MotionPreferenceProvider>
    </ThemeProvider>
  );
}

export default App;
