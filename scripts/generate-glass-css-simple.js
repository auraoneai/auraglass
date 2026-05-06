#!/usr/bin/env node

/**
 * Simple CSS Generator - Creates glass.generated.css directly from tokens
 * This bypasses TypeScript compilation issues and generates the CSS file directly
 */

const fs = require('fs');
const path = require('path');

// Simplified token definitions (extracted from our AURA_GLASS tokens)
const tokens = {
  surfaces: {
    neutral: {
      level1: {
        backdropBlur: 8,
        surface: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)',
        border: { color: 'rgba(255,255,255,0.4)', width: 1 },
        shadow: '0 4px 16px rgba(0,0,0,0.15)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      },
      level2: {
        backdropBlur: 12,
        surface: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(59,130,246,0.15) 50%, rgba(147,51,234,0.08) 100%)',
        border: { color: 'rgba(255,255,255,0.5)', width: 1 },
        shadow: '0 8px 24px rgba(0,0,0,0.2)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      },
      level3: {
        backdropBlur: 16,
        surface: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(59,130,246,0.2) 50%, rgba(147,51,234,0.12) 100%)',
        border: { color: 'rgba(255,255,255,0.6)', width: 2 },
        shadow: '0 12px 32px rgba(0,0,0,0.25)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      },
      level4: {
        backdropBlur: 20,
        surface: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(59,130,246,0.25) 50%, rgba(147,51,234,0.15) 100%)',
        border: { color: 'rgba(255,255,255,0.7)', width: 2 },
        shadow: '0 16px 40px rgba(0,0,0,0.3)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      }
    },
    primary: {
      level1: {
        backdropBlur: 8,
        surface: 'linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(29,78,216,0.2) 100%)',
        border: { color: 'rgba(59,130,246,0.5)', width: 1 },
        shadow: '0 4px 16px rgba(59,130,246,0.15)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      },
      level2: {
        backdropBlur: 12,
        surface: 'linear-gradient(135deg, rgba(59,130,246,0.4) 0%, rgba(29,78,216,0.25) 100%)',
        border: { color: 'rgba(59,130,246,0.6)', width: 1 },
        shadow: '0 8px 24px rgba(59,130,246,0.2)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      },
      level3: {
        backdropBlur: 16,
        surface: 'linear-gradient(135deg, rgba(59,130,246,0.5) 0%, rgba(29,78,216,0.35) 100%)',
        border: { color: 'rgba(59,130,246,0.7)', width: 2 },
        shadow: '0 12px 32px rgba(59,130,246,0.25)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      },
      level4: {
        backdropBlur: 20,
        surface: 'linear-gradient(135deg, rgba(59,130,246,0.6) 0%, rgba(29,78,216,0.45) 100%)',
        border: { color: 'rgba(59,130,246,0.8)', width: 2 },
        shadow: '0 16px 40px rgba(59,130,246,0.3)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      }
    },
    success: {
      level1: {
        backdropBlur: 8,
        surface: 'linear-gradient(135deg, rgba(34,197,94,0.25) 0%, rgba(22,163,74,0.18) 100%)',
        border: { color: 'rgba(34,197,94,0.4)', width: 1 },
        shadow: '0 4px 16px rgba(34,197,94,0.12)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      },
      level2: {
        backdropBlur: 12,
        surface: 'linear-gradient(135deg, rgba(34,197,94,0.3) 0%, rgba(22,163,74,0.22) 100%)',
        border: { color: 'rgba(34,197,94,0.5)', width: 1 },
        shadow: '0 8px 24px rgba(34,197,94,0.15)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      },
      level3: {
        backdropBlur: 16,
        surface: 'linear-gradient(135deg, rgba(34,197,94,0.4) 0%, rgba(22,163,74,0.28) 100%)',
        border: { color: 'rgba(34,197,94,0.6)', width: 2 },
        shadow: '0 12px 32px rgba(34,197,94,0.18)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      },
      level4: {
        backdropBlur: 20,
        surface: 'linear-gradient(135deg, rgba(34,197,94,0.5) 0%, rgba(22,163,74,0.35) 100%)',
        border: { color: 'rgba(34,197,94,0.7)', width: 2 },
        shadow: '0 16px 40px rgba(34,197,94,0.22)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      }
    },
    warning: {
      level1: {
        backdropBlur: 8,
        surface: 'linear-gradient(135deg, rgba(245,158,11,0.25) 0%, rgba(217,119,6,0.18) 100%)',
        border: { color: 'rgba(245,158,11,0.4)', width: 1 },
        shadow: '0 4px 16px rgba(245,158,11,0.12)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      },
      level2: {
        backdropBlur: 12,
        surface: 'linear-gradient(135deg, rgba(245,158,11,0.3) 0%, rgba(217,119,6,0.22) 100%)',
        border: { color: 'rgba(245,158,11,0.5)', width: 1 },
        shadow: '0 8px 24px rgba(245,158,11,0.15)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      },
      level3: {
        backdropBlur: 16,
        surface: 'linear-gradient(135deg, rgba(245,158,11,0.4) 0%, rgba(217,119,6,0.28) 100%)',
        border: { color: 'rgba(245,158,11,0.6)', width: 2 },
        shadow: '0 12px 32px rgba(245,158,11,0.18)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      },
      level4: {
        backdropBlur: 20,
        surface: 'linear-gradient(135deg, rgba(245,158,11,0.5) 0%, rgba(217,119,6,0.35) 100%)',
        border: { color: 'rgba(245,158,11,0.7)', width: 2 },
        shadow: '0 16px 40px rgba(245,158,11,0.22)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      }
    },
    danger: {
      level1: {
        backdropBlur: 8,
        surface: 'linear-gradient(135deg, rgba(239,68,68,0.25) 0%, rgba(220,38,38,0.18) 100%)',
        border: { color: 'rgba(239,68,68,0.4)', width: 1 },
        shadow: '0 4px 16px rgba(239,68,68,0.12)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      },
      level2: {
        backdropBlur: 12,
        surface: 'linear-gradient(135deg, rgba(239,68,68,0.3) 0%, rgba(220,38,38,0.22) 100%)',
        border: { color: 'rgba(239,68,68,0.5)', width: 1 },
        shadow: '0 8px 24px rgba(239,68,68,0.15)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      },
      level3: {
        backdropBlur: 16,
        surface: 'linear-gradient(135deg, rgba(239,68,68,0.4) 0%, rgba(220,38,38,0.28) 100%)',
        border: { color: 'rgba(239,68,68,0.6)', width: 2 },
        shadow: '0 12px 32px rgba(239,68,68,0.18)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      },
      level4: {
        backdropBlur: 20,
        surface: 'linear-gradient(135deg, rgba(239,68,68,0.5) 0%, rgba(220,38,38,0.35) 100%)',
        border: { color: 'rgba(239,68,68,0.7)', width: 2 },
        shadow: '0 16px 40px rgba(239,68,68,0.22)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      }
    },
    info: {
      level1: {
        backdropBlur: 8,
        surface: 'linear-gradient(135deg, rgba(14,165,233,0.25) 0%, rgba(2,132,199,0.18) 100%)',
        border: { color: 'rgba(14,165,233,0.4)', width: 1 },
        shadow: '0 4px 16px rgba(14,165,233,0.12)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      },
      level2: {
        backdropBlur: 12,
        surface: 'linear-gradient(135deg, rgba(14,165,233,0.3) 0%, rgba(2,132,199,0.22) 100%)',
        border: { color: 'rgba(14,165,233,0.5)', width: 1 },
        shadow: '0 8px 24px rgba(14,165,233,0.15)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      },
      level3: {
        backdropBlur: 16,
        surface: 'linear-gradient(135deg, rgba(14,165,233,0.4) 0%, rgba(2,132,199,0.28) 100%)',
        border: { color: 'rgba(14,165,233,0.6)', width: 2 },
        shadow: '0 12px 32px rgba(14,165,233,0.18)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      },
      level4: {
        backdropBlur: 20,
        surface: 'linear-gradient(135deg, rgba(14,165,233,0.5) 0%, rgba(2,132,199,0.35) 100%)',
        border: { color: 'rgba(14,165,233,0.7)', width: 2 },
        shadow: '0 16px 40px rgba(14,165,233,0.22)',
        textPrimary: 'rgba(255,255,255,0.95)',
        textSecondary: 'rgba(255,255,255,0.85)'
      }
    }
  },
  motion: {
    default: 200,
    enter: 150,
    exit: 100
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    pill: 9999
  }
};

function generateCSS() {
  const cssLines = [];
  
  // Header
  cssLines.push('/* AuraGlass Generated CSS - DO NOT EDIT MANUALLY */');
  cssLines.push('/* Generated from AURA_GLASS tokens in src/tokens/glass.ts */');
  cssLines.push('/* To regenerate: npm run glass:generate */');
  cssLines.push('');
  cssLines.push(':root {');
  cssLines.push('  /* === FOUNDATION PROPERTIES === */');
  
  // Foundation properties
  cssLines.push(`  --glass-motion-default: ${tokens.motion.default}ms;`);
  cssLines.push(`  --glass-motion-enter: ${tokens.motion.enter}ms;`);
  cssLines.push(`  --glass-motion-exit: ${tokens.motion.exit}ms;`);
  cssLines.push('');
  
  // Radii
  Object.entries(tokens.radii).forEach(([key, value]) => {
    cssLines.push(`  --glass-radius-${key}: ${value}px;`);
  });
  cssLines.push('');
  
  // Surface properties for each intent and elevation
  const intents = Object.keys(tokens.surfaces);
  const elevations = Object.keys(tokens.surfaces.neutral);
  
  intents.forEach(intent => {
    cssLines.push(`  /* === ${intent.toUpperCase()} SURFACES === */`);
    elevations.forEach(elevation => {
      const surface = tokens.surfaces[intent][elevation];
      const prefix = `--glass-${intent}-${elevation}`;
      
      cssLines.push(`  ${prefix}-surface: ${surface.surface};`);
      cssLines.push(`  ${prefix}-border-color: ${surface.border.color};`);
      cssLines.push(`  ${prefix}-border-width: ${surface.border.width}px;`);
      cssLines.push(`  ${prefix}-border-style: solid;`);
      cssLines.push(`  ${prefix}-blur: ${surface.backdropBlur}px;`);
      cssLines.push(`  ${prefix}-shadow: ${surface.shadow};`);
      cssLines.push(`  ${prefix}-text-primary: ${surface.textPrimary};`);
      cssLines.push(`  ${prefix}-text-secondary: ${surface.textSecondary};`);
    });
    cssLines.push('');
  });
  
  cssLines.push('}');
  cssLines.push('');
  
  // Utility classes
  cssLines.push('/* === GENERATED UTILITY CLASSES === */');
  cssLines.push('');
  
  intents.forEach(intent => {
    elevations.forEach(elevation => {
      const className = `.glass-${intent}-${elevation}`;
      cssLines.push(`${className} {`);
      cssLines.push(`  background: var(--glass-${intent}-${elevation}-surface);`);
      cssLines.push(`  border: var(--glass-${intent}-${elevation}-border-width) var(--glass-${intent}-${elevation}-border-style) var(--glass-${intent}-${elevation}-border-color);`);
      cssLines.push(`  backdrop-filter: blur(var(--glass-${intent}-${elevation}-blur)) saturate(1.8) brightness(1.15) contrast(1.08);`);
      cssLines.push(`  -webkit-backdrop-filter: blur(var(--glass-${intent}-${elevation}-blur)) saturate(1.8) brightness(1.15) contrast(1.08);`);
      cssLines.push(`  box-shadow: var(--glass-${intent}-${elevation}-shadow);`);
      cssLines.push(`  color: var(--glass-${intent}-${elevation}-text-primary);`);
      cssLines.push(`  border-radius: var(--glass-radius-md);`);
      cssLines.push(`  transition: all var(--glass-motion-default) ease-out;`);
      cssLines.push(`  position: relative;`);
      cssLines.push(`  transform: translateZ(0);`);
      cssLines.push('}');
      cssLines.push('');
    });
  });
  
  // Accessibility and fallbacks
  cssLines.push('/* === ACCESSIBILITY & FALLBACKS === */');
  cssLines.push('');
  cssLines.push('@media (prefers-reduced-motion: reduce) {');
  cssLines.push('  [class*="glass-"] {');
  cssLines.push('    transition: none !important;');
  cssLines.push('    animation: none !important;');
  cssLines.push('  }');
  cssLines.push('}');
  cssLines.push('');
  cssLines.push('@supports not (backdrop-filter: blur(0)) {');
  cssLines.push('  [class*="glass-"] {');
  cssLines.push('    background: rgba(0, 0, 0, 0.85) !important;');
  cssLines.push('    backdrop-filter: none !important;');
  cssLines.push('    -webkit-backdrop-filter: none !important;');
  cssLines.push('  }');
  cssLines.push('}');
  
  return cssLines.join('\n');
}

function main() {
  console.log('🔄 Generating glass.generated.css from tokens...');
  
  const cssContent = generateCSS();
  const outputPath = path.join(__dirname, '..', 'src', 'styles', 'glass.generated.css');
  
  try {
    fs.writeFileSync(outputPath, cssContent, 'utf8');
    console.log(`✅ Successfully generated ${outputPath}`);
    console.log(`   File size: ${(cssContent.length / 1024).toFixed(1)} KB`);
    
    // Count properties
    const propertyCount = (cssContent.match(/--glass-/g) || []).length;
    console.log(`   Properties generated: ${propertyCount}`);
  } catch (error) {
    console.error(`❌ Failed to write CSS file: ${error}`);
    process.exit(1);
  }
  
  console.log('🎉 CSS generation completed successfully!');
}

// Execute if called directly
if (require.main === module) {
  main();
}