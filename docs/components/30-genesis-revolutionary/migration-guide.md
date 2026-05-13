# Genesis Revolutionary Migration Guide

Use Genesis advanced components as progressive enhancements over standard AuraGlass surfaces.

## Migration Steps

1. Keep the existing AuraGlass component behavior intact.
2. Add the Genesis provider or control surface around the target experience.
3. Verify keyboard, reduced-motion, and fallback behavior.
4. Run Storybook and targeted visual tests before release.

## Fallbacks

Every integration should provide a non-Houdini, non-voice, or non-collaborative path when browser capabilities are unavailable.
