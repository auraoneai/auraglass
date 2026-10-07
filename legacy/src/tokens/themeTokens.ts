// token-lint-ignore-file: theme tokens intentionally defined with raw values
import React from "react";
// Theme tokens for the AuraGlass design system

import AURA_GLASS, { glassTokenUtils } from "./glass";
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  BOX_SHADOW,
  Z_INDEX,
  BREAKPOINTS,
  ANIMATION,
} from "./designConstants";

export interface ThemeTokens {
  // Color tokens
  colors: {
    // Glass morphism colors
    glass: {
      surface: string;
      border: string;
      text: string;
      textSecondary: string;
      shadow: string;
    };

    // Semantic colors
    semantic: typeof COLORS.semantic;

    // Neutral colors
    neutral: typeof COLORS.neutral;

    // Component-specific colors
    components: {
      button: {
        primary: string;
        secondary: string;
        danger: string;
        success: string;
        warning: string;
      };
      input: {
        background: string;
        border: string;
        focus: string;
        error: string;
      };
      card: {
        background: string;
        border: string;
        shadow: string;
      };
    };
  };

  // Typography tokens
  typography: typeof TYPOGRAPHY & {
    // Glass-specific typography
    glass: {
      heading: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
        color: string;
      };
      body: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
        color: string;
      };
      caption: {
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
        color: string;
      };
    };
  };

  // Spacing tokens
  spacing: typeof SPACING & {
    // Glass-specific spacing
    glass: {
      container: string;
      component: string;
      element: string;
    };
  };

  // Layout tokens
  layout: {
    borderRadius: typeof BORDER_RADIUS;
    boxShadow: typeof BOX_SHADOW;
    zIndex: typeof Z_INDEX;
    breakpoints: typeof BREAKPOINTS;
  };

  // Animation tokens
  animation: typeof ANIMATION & {
    // Glass-specific animations
    glass: {
      appear: {
        duration: string;
        easing: string;
      };
      hover: {
        duration: string;
        easing: string;
        scale: number;
      };
      focus: {
        duration: string;
        easing: string;
      };
    };
  };

  // Glass morphism tokens
  glass: typeof AURA_GLASS;

  // Component-specific tokens
  components: {
    button: {
      size: {
        sm: { height: string; padding: string; fontSize: string };
        md: { height: string; padding: string; fontSize: string };
        lg: { height: string; padding: string; fontSize: string };
      };
      variant: {
        primary: {
          background: string;
          color: string;
          hover: { background: string; shadow: string };
          active: { background: string; shadow: string };
        };
        secondary: {
          background: string;
          color: string;
          border: string;
          hover: { background: string; border: string };
          active: { background: string; border: string };
        };
      };
    };

    input: {
      size: {
        sm: { height: string; padding: string; fontSize: string };
        md: { height: string; padding: string; fontSize: string };
        lg: { height: string; padding: string; fontSize: string };
      };
      state: {
        default: { border: string; background: string };
        focus: { border: string; background: string; shadow: string };
        error: { border: string; background: string };
        disabled: { border: string; background: string; opacity: number };
      };
    };

    card: {
      variant: {
        default: {
          background: string;
          border: string;
          shadow: string;
          hover: { shadow: string; transform: string };
        };
        elevated: {
          background: string;
          border: string;
          shadow: string;
          hover: { shadow: string; transform: string };
        };
        outlined: {
          background: string;
          border: string;
          shadow: string;
          hover: { border: string; shadow: string };
        };
      };
    };
  };
}

// Light theme tokens
export const lightTheme: ThemeTokens = {
  colors: {
    glass: {
      surface: AURA_GLASS.surfaces.neutral.level1.surface.base,
      border: AURA_GLASS.surfaces.neutral.level1.border.color,
      text: AURA_GLASS.surfaces.neutral.level1.text.primary,
      textSecondary: AURA_GLASS.surfaces.neutral.level1.text.secondary,
      shadow: AURA_GLASS.surfaces.neutral.level1.outerShadow
        ? `${AURA_GLASS.surfaces.neutral.level1.outerShadow.x}px ${AURA_GLASS.surfaces.neutral.level1.outerShadow.y}px ${AURA_GLASS.surfaces.neutral.level1.outerShadow.blur}px ${AURA_GLASS.surfaces.neutral.level1.outerShadow.spread}px ${AURA_GLASS.surfaces.neutral.level1.outerShadow.color}`
        : "none",
    },
    semantic: COLORS.semantic,
    neutral: COLORS.neutral,
    components: {
      button: {
        primary: COLORS.semantic.primary,
        secondary: COLORS.neutral.gray[100],
        danger: COLORS.semantic.error,
        success: COLORS.semantic.success,
        warning: COLORS.semantic.warning,
      },
      input: {
        background: COLORS.neutral.white,
        border: COLORS.neutral.gray[300],
        focus: COLORS.semantic.primary,
        error: COLORS.semantic.error,
      },
      card: {
        background: COLORS.neutral.white,
        border: COLORS.neutral.gray[200],
        shadow: BOX_SHADOW.sm,
      },
    },
  },

  typography: {
    ...TYPOGRAPHY,
    glass: {
      heading: {
        fontSize: TYPOGRAPHY.fontSize.xl,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        lineHeight: TYPOGRAPHY.lineHeight.tight,
        color: COLORS.neutral.gray[900],
      },
      body: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontWeight: TYPOGRAPHY.fontWeight.normal,
        lineHeight: TYPOGRAPHY.lineHeight.normal,
        color: COLORS.neutral.gray[700],
      },
      caption: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontWeight: TYPOGRAPHY.fontWeight.normal,
        lineHeight: TYPOGRAPHY.lineHeight.normal,
        color: COLORS.neutral.gray[500],
      },
    },
  },

  spacing: {
    ...SPACING,
    glass: {
      container: SPACING.space[16],
      component: SPACING.space[4],
      element: SPACING.space[2],
    },
  },

  layout: {
    borderRadius: BORDER_RADIUS,
    boxShadow: BOX_SHADOW,
    zIndex: Z_INDEX,
    breakpoints: BREAKPOINTS,
  },

  animation: {
    ...ANIMATION,
    glass: {
      appear: {
        duration: `${ANIMATION.DURATION.normal}ms`,
        easing: ANIMATION.EASING.easeOut,
      },
      hover: {
        duration: `${ANIMATION.DURATION.fast}ms`,
        easing: ANIMATION.EASING.easeOut,
        scale: 1.02,
      },
      focus: {
        duration: `${ANIMATION.DURATION.fast}ms`,
        easing: ANIMATION.EASING.easeOut,
      },
    },
  },

  glass: AURA_GLASS,

  components: {
    button: {
      size: {
        sm: {
          height: SPACING.space[8],
          padding: `${SPACING.space[1]} ${SPACING.space[3]}`,
          fontSize: TYPOGRAPHY.fontSize.sm,
        },
        md: {
          height: SPACING.space[10],
          padding: `${SPACING.space[2]} ${SPACING.space[4]}`,
          fontSize: TYPOGRAPHY.fontSize.base,
        },
        lg: {
          height: SPACING.space[12],
          padding: `${SPACING.space[3]} ${SPACING.space[6]}`,
          fontSize: TYPOGRAPHY.fontSize.lg,
        },
      },
      variant: {
        primary: {
          background: COLORS.semantic.primary,
          color: COLORS.neutral.white,
          hover: {
            background: COLORS.semantic.primary,
            shadow: BOX_SHADOW.md,
          },
          active: {
            background: COLORS.semantic.primary,
            shadow: BOX_SHADOW.sm,
          },
        },
        secondary: {
          background: COLORS.neutral.white,
          color: COLORS.neutral.gray[900],
          border: COLORS.neutral.gray[300],
          hover: {
            background: COLORS.neutral.gray[50],
            border: COLORS.neutral.gray[400],
          },
          active: {
            background: COLORS.neutral.gray[100],
            border: COLORS.neutral.gray[400],
          },
        },
      },
    },

    input: {
      size: {
        sm: {
          height: SPACING.space[8],
          padding: `${SPACING.space[1]} ${SPACING.space[3]}`,
          fontSize: TYPOGRAPHY.fontSize.sm,
        },
        md: {
          height: SPACING.space[10],
          padding: `${SPACING.space[2]} ${SPACING.space[4]}`,
          fontSize: TYPOGRAPHY.fontSize.base,
        },
        lg: {
          height: SPACING.space[12],
          padding: `${SPACING.space[3]} ${SPACING.space[6]}`,
          fontSize: TYPOGRAPHY.fontSize.lg,
        },
      },
      state: {
        default: {
          border: COLORS.neutral.gray[300],
          background: COLORS.neutral.white,
        },
        focus: {
          border: COLORS.semantic.primary,
          background: COLORS.neutral.white,
          shadow: `0 0 0 3px ${COLORS.semantic.primary}20`,
        },
        error: {
          border: COLORS.semantic.error,
          background: COLORS.neutral.white,
        },
        disabled: {
          border: COLORS.neutral.gray[200],
          background: COLORS.neutral.gray[50],
          opacity: 0.5,
        },
      },
    },

    card: {
      variant: {
        default: {
          background: COLORS.neutral.white,
          border: COLORS.neutral.gray[200],
          shadow: BOX_SHADOW.sm,
          hover: {
            shadow: BOX_SHADOW.md,
            transform: "translateY(-2px)",
          },
        },
        elevated: {
          background: COLORS.neutral.white,
          border: COLORS.neutral.gray[200],
          shadow: BOX_SHADOW.lg,
          hover: {
            shadow: BOX_SHADOW.xl,
            transform: "translateY(-4px)",
          },
        },
        outlined: {
          background: COLORS.neutral.white,
          border: COLORS.neutral.gray[300],
          shadow: "none",
          hover: {
            border: COLORS.neutral.gray[400],
            shadow: BOX_SHADOW.sm,
          },
        },
      },
    },
  },
};

// Dark theme tokens
export const darkTheme: ThemeTokens = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    glass: {
      surface: AURA_GLASS.surfaces.neutral.level2.surface.base,
      border: AURA_GLASS.surfaces.neutral.level2.border.color,
      text: AURA_GLASS.surfaces.neutral.level2.text.primary,
      textSecondary: AURA_GLASS.surfaces.neutral.level2.text.secondary,
      shadow: AURA_GLASS.surfaces.neutral.level2.outerShadow
        ? `${AURA_GLASS.surfaces.neutral.level2.outerShadow.x}px ${AURA_GLASS.surfaces.neutral.level2.outerShadow.y}px ${AURA_GLASS.surfaces.neutral.level2.outerShadow.blur}px ${AURA_GLASS.surfaces.neutral.level2.outerShadow.spread}px ${AURA_GLASS.surfaces.neutral.level2.outerShadow.color}`
        : "none",
    },
    components: {
      ...lightTheme.colors.components,
      button: {
        primary: COLORS.semantic.primary,
        secondary: COLORS.neutral.gray[800],
        danger: COLORS.semantic.error,
        success: COLORS.semantic.success,
        warning: COLORS.semantic.warning,
      },
      input: {
        background: COLORS.neutral.gray[900],
        border: COLORS.neutral.gray[700],
        focus: COLORS.semantic.primary,
        error: COLORS.semantic.error,
      },
      card: {
        background: COLORS.neutral.gray[900],
        border: COLORS.neutral.gray[800],
        shadow: BOX_SHADOW.sm.replace("rgba(0, 0, 0", "rgba(255, 255, 255"),
      },
    },
  },

  typography: {
    ...lightTheme.typography,
    glass: {
      ...lightTheme.typography.glass,
      heading: {
        ...lightTheme.typography.glass.heading,
        color: COLORS.neutral.gray[100],
      },
      body: {
        ...lightTheme.typography.glass.body,
        color: COLORS.neutral.gray[300],
      },
      caption: {
        ...lightTheme.typography.glass.caption,
        color: COLORS.neutral.gray[500],
      },
    },
  },
};

// Glass theme tokens (default glassmorphism theme)
export const glassTheme: ThemeTokens = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    glass: {
      surface: AURA_GLASS.surfaces.neutral.level3.surface.base,
      border: AURA_GLASS.surfaces.neutral.level3.border.color,
      text: AURA_GLASS.surfaces.neutral.level3.text.primary,
      textSecondary: AURA_GLASS.surfaces.neutral.level3.text.secondary,
      shadow: AURA_GLASS.surfaces.neutral.level3.outerShadow
        ? `${AURA_GLASS.surfaces.neutral.level3.outerShadow.x}px ${AURA_GLASS.surfaces.neutral.level3.outerShadow.y}px ${AURA_GLASS.surfaces.neutral.level3.outerShadow.blur}px ${AURA_GLASS.surfaces.neutral.level3.outerShadow.spread}px ${AURA_GLASS.surfaces.neutral.level3.outerShadow.color}`
        : "none",
    },
  },
};

// Utility functions for theme management
export const themeUtils = {
  // Get theme value by path
  get: (theme: ThemeTokens, path: string): unknown => {
    const keys = path.split(".");
    let value: unknown = theme;

    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return undefined;
      }
    }

    return value;
  },

  // Merge themes
  merge: (
    baseTheme: ThemeTokens,
    overrides: Partial<ThemeTokens>
  ): ThemeTokens => {
    return {
      ...baseTheme,
      ...overrides,
      colors: {
        ...baseTheme.colors,
        ...overrides.colors,
      },
      typography: {
        ...baseTheme.typography,
        ...overrides.typography,
      },
      spacing: {
        ...baseTheme.spacing,
        ...overrides.spacing,
      },
      layout: {
        ...baseTheme.layout,
        ...overrides.layout,
      },
      animation: {
        ...baseTheme.animation,
        ...overrides.animation,
      },
      components: {
        ...baseTheme.components,
        ...overrides.components,
      },
    };
  },

  // Create custom theme
  create: (overrides: Partial<ThemeTokens>): ThemeTokens => {
    return themeUtils.merge(glassTheme, overrides);
  },
};

// Export default themes
export { lightTheme as light, darkTheme as dark, glassTheme as glass };
export default glassTheme;
