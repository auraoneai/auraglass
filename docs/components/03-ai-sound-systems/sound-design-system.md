### Sound Design System
Haptic feedback and glass-themed audio effects.

```tsx
import { glassSoundDesign, useGlassSound } from 'aura-glass';

// Using the sound design system directly
glassSoundDesign.playGlassSound('tap');
glassSoundDesign.triggerHaptic('success');
glassSoundDesign.playFeedback('hover'); // Combined sound + haptic

// React hook for sound effects
function SoundAwareComponent() {
  const { play, haptic, feedback } = useGlassSound();
  
  return (
    <button
      onClick={() => feedback('tap')}
      onMouseEnter={() => play('hover')}
      onMouseDown={() => haptic('tap')}
    >
      Interactive Sound Button
    </button>
  );
}

// Available sound types
// 'tap', 'hover', 'slide', 'break', 'morph', 'ripple', 'success', 'error', 'notification'

// Advanced effects
glassSoundDesign.playChord([440, 554.37, 659.25]); // Play chord
glassSoundDesign.playArpeggio([440, 493.88, 554.37, 659.25]); // Play arpeggio
const ambient = glassSoundDesign.createAmbientGlass(); // Create ambient atmosphere
```