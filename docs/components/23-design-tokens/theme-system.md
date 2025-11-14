### Theme System
Advanced theme management with light, dark, and glass themes.

```tsx
import { 
  lightTheme, 
  darkTheme, 
  glassTheme, 
  themeUtils,
  createGlassTheme,
  mergeThemes 
} from 'aura-glass';

// Create custom theme
const customTheme = createGlassTheme({
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
  }
});

// Merge themes
const hybridTheme = mergeThemes(darkTheme, customTheme);

// Get theme values
const primaryColor = themeUtils.get(customTheme, 'colors.primary');
const spacing = themeUtils.get(customTheme, 'spacing.md');
```