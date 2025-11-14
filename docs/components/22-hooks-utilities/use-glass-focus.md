### useGlassFocus
Advanced focus management with glass effects and accessibility features.

```tsx
import { useGlassFocus } from 'aura-glass';

function FocusableComponent() {
  const { ref, focusState, focusRingStyles, focus, blur } = useGlassFocus({
    enabled: true,
    color: 'rgba(59, 130, 246, 0.5)',
    width: 2,
    blur: 4,
    keyboardNavigation: true,
    autoFocus: false,
  });

  return (
    <div ref={ref} style={focusRingStyles} tabIndex={0}>
      <p>Focusable content with glass focus ring</p>
      <p>Focus state: {focusState.isFocused ? 'Focused' : 'Not focused'}</p>
    </div>
  );
}
```