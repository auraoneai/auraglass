### Glass Tokens
Comprehensive glassmorphism design tokens for consistent styling.

```tsx
import { glassTokens, glassUtils } from 'aura-glass';

// Use predefined glass variants
const frostedStyle = glassUtils.getVariant('frosted');
const dynamicStyle = glassUtils.getVariant('dynamic');

// Access color schemes
const lightColors = glassUtils.getColorScheme('light');
const darkColors = glassUtils.getColorScheme('dark');

// Get responsive values
const mobileBlur = glassUtils.getResponsiveBlur('sm');
const desktopBlur = glassUtils.getResponsiveBlur('xl');

// Animation configurations
const gentleSpring = glassUtils.getSpring('gentle');
const bouncySpring = glassUtils.getSpring('bouncy');
```