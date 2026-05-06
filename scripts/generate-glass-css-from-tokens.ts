#!/usr/bin/env ts-node

/**
 * AuraGlass CSS Generator - Token to CSS Variables
 * 
 * Generates src/styles/glass.generated.css from AURA_GLASS tokens.
 * This is the bridge between our canonical token system and CSS.
 * 
 * CRITICAL REQUIREMENTS:
 * - No empty or undefined values emitted
 * - Fail hard on any missing data
 * - Generate complete CSS custom property system
 * - Maintain WCAG AA contrast compliance
 */

import * as fs from 'fs';
import * as path from 'path';
import { AURA_GLASS, PERFORMANCE_TIERS, glassTokenUtils, GlassIntent, GlassElevation, QualityTier } from '../src/tokens/glass.js';

interface GenerationResult {
  success: boolean;
  cssContent: string;
  errors: string[];
  warnings: string[];
  stats: {
    propertiesGenerated: number;
    intentsProcessed: number;
    elevationsProcessed: number;
    tiersProcessed: number;
  };
}

class GlassCSSGenerator {
  private errors: string[] = [];
  private warnings: string[] = [];
  private stats = {
    propertiesGenerated: 0,
    intentsProcessed: 0,
    elevationsProcessed: 0,
    tiersProcessed: 0
  };

  /**
   * Validate that a value is not empty, undefined, or null
   */
  private validateValue(value: any, propertyName: string): boolean {
    if (value === undefined || value === null || value === '' || value === 'none' || value === 'undefined') {
      this.errors.push(`CRITICAL: Empty or undefined value for ${propertyName}: ${value}`);
      return false;
    }
    
    // Check for suspiciously low alpha values
    if (typeof value === 'string' && value.includes('rgba') && value.includes('0.0')) {
      const alphaMatch = value.match(/rgba\\([^,]+,[^,]+,[^,]+,\\s*(0\\.0\\d+)\\)/);
      if (alphaMatch && parseFloat(alphaMatch[1]) < 0.08) {
        this.errors.push(`CRITICAL: Invisible alpha value in ${propertyName}: ${value} (alpha < 0.08)`);
        return false;
      }
    }
    
    return true;
  }

  /**
   * Generate CSS custom properties for a specific intent and elevation
   */
  private generateSurfaceProperties(intent: GlassIntent, elevation: GlassElevation): string[] {
    const surface = glassTokenUtils.getSurface(intent, elevation);
    const properties: string[] = [];
    
    const prefix = `--glass-${intent}-${elevation}`;
    
    // Surface background
    if (this.validateValue(surface.surface.base, `${prefix}-surface`)) {
      properties.push(`  ${prefix}-surface: ${surface.surface.base};`);
      this.stats.propertiesGenerated++;
    }
    
    if (surface.surface.overlay && this.validateValue(surface.surface.overlay, `${prefix}-overlay`)) {
      properties.push(`  ${prefix}-overlay: ${surface.surface.overlay};`);
      this.stats.propertiesGenerated++;
    }
    
    // Border properties
    if (this.validateValue(surface.border.color, `${prefix}-border-color`)) {
      properties.push(`  ${prefix}-border-color: ${surface.border.color};`);
      this.stats.propertiesGenerated++;
    }
    
    if (this.validateValue(surface.border.width, `${prefix}-border-width`)) {
      properties.push(`  ${prefix}-border-width: ${surface.border.width}px;`);
      this.stats.propertiesGenerated++;
    }
    
    if (this.validateValue(surface.border.style, `${prefix}-border-style`)) {
      properties.push(`  ${prefix}-border-style: ${surface.border.style};`);
      this.stats.propertiesGenerated++;
    }
    
    // Backdrop blur
    if (this.validateValue(surface.backdropBlur.px, `${prefix}-blur`)) {
      if (surface.backdropBlur.px < 2) {
        this.errors.push(`CRITICAL: Blur value too low for ${prefix}: ${surface.backdropBlur.px}px (minimum 2px)`);
      } else {
        properties.push(`  ${prefix}-blur: ${surface.backdropBlur.px}px;`);
        this.stats.propertiesGenerated++;
      }
    }
    
    // Shadow properties
    if (surface.outerShadow && this.validateValue(surface.outerShadow.color, `${prefix}-shadow-color`)) {
      const shadow = surface.outerShadow;
      const shadowValue = `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`;
      properties.push(`  ${prefix}-shadow: ${shadowValue};`);
      this.stats.propertiesGenerated++;
    }
    
    // Inner glow
    if (surface.innerGlow && this.validateValue(surface.innerGlow.color, `${prefix}-glow-color`)) {
      const glow = surface.innerGlow;
      properties.push(`  ${prefix}-glow: inset 0 0 ${glow.blur}px ${glow.spread}px ${glow.color};`);
      this.stats.propertiesGenerated++;
    }
    
    // Text colors
    if (this.validateValue(surface.text.primary, `${prefix}-text-primary`)) {
      properties.push(`  ${prefix}-text-primary: ${surface.text.primary};`);
      this.stats.propertiesGenerated++;
    }
    
    if (this.validateValue(surface.text.secondary, `${prefix}-text-secondary`)) {
      properties.push(`  ${prefix}-text-secondary: ${surface.text.secondary};`);
      this.stats.propertiesGenerated++;
    }
    
    // Noise and highlight opacities
    if (surface.noiseOpacity !== undefined && this.validateValue(surface.noiseOpacity, `${prefix}-noise-opacity`)) {
      properties.push(`  ${prefix}-noise-opacity: ${surface.noiseOpacity};`);
      this.stats.propertiesGenerated++;
    }
    
    if (surface.highlightOpacity !== undefined && this.validateValue(surface.highlightOpacity, `${prefix}-highlight-opacity`)) {
      properties.push(`  ${prefix}-highlight-opacity: ${surface.highlightOpacity};`);
      this.stats.propertiesGenerated++;
    }
    
    return properties;
  }

  /**
   * Generate performance tier backdrop filter values
   */
  private generatePerformanceTierProperties(tier: QualityTier): string[] {
    const properties: string[] = [];
    const config = PERFORMANCE_TIERS[tier];
    
    if (!this.validateValue(config, `performance-tier-${tier}`)) {
      return [];
    }
    
    // Generate backdrop filters for each base blur level
    const baseBlurLevels = [8, 12, 16, 20];
    
    baseBlurLevels.forEach(baseBlur => {
      const backdropFilter = glassTokenUtils.buildBackdropFilter(baseBlur, tier);
      if (this.validateValue(backdropFilter, `backdrop-filter-${tier}-${baseBlur}`)) {
        properties.push(`  --glass-backdrop-${tier}-${baseBlur}: ${backdropFilter};`);
        this.stats.propertiesGenerated++;
      }
    });
    
    // Multipliers
    properties.push(`  --glass-${tier}-blur-multiplier: ${config.blurMultiplier};`);
    properties.push(`  --glass-${tier}-shadow-multiplier: ${config.shadowMultiplier};`);
    properties.push(`  --glass-${tier}-saturate-multiplier: ${config.saturateMultiplier};`);
    this.stats.propertiesGenerated += 3;
    
    return properties;
  }

  /**
   * Generate foundation properties (motion, radii, gaps)
   */
  private generateFoundationProperties(): string[] {
    const properties: string[] = [];
    
    // Motion
    if (this.validateValue(AURA_GLASS.motion.defaultMs, 'motion-default')) {
      properties.push(`  --glass-motion-default: ${AURA_GLASS.motion.defaultMs}ms;`);
      this.stats.propertiesGenerated++;
    }
    
    if (this.validateValue(AURA_GLASS.motion.enterMs, 'motion-enter')) {
      properties.push(`  --glass-motion-enter: ${AURA_GLASS.motion.enterMs}ms;`);
      this.stats.propertiesGenerated++;
    }
    
    if (this.validateValue(AURA_GLASS.motion.exitMs, 'motion-exit')) {
      properties.push(`  --glass-motion-exit: ${AURA_GLASS.motion.exitMs}ms;`);
      this.stats.propertiesGenerated++;
    }
    
    // Radii
    Object.entries(AURA_GLASS.radii).forEach(([key, value]) => {
      if (this.validateValue(value, `radii-${key}`)) {
        const radiusValue = key === 'pill' ? `${value}px` : `${value}px`;
        properties.push(`  --glass-radius-${key}: ${radiusValue};`);
        this.stats.propertiesGenerated++;
      }
    });
    
    // Gaps
    Object.entries(AURA_GLASS.gaps).forEach(([key, value]) => {
      if (this.validateValue(value, `gaps-${key}`)) {
        properties.push(`  --glass-gap-${key}: ${value}px;`);
        this.stats.propertiesGenerated++;
      }
    });
    
    return properties;
  }

  /**
   * Generate the complete CSS content
   */
  public generate(): GenerationResult {
    const cssLines: string[] = [];
    
    // Header
    cssLines.push('/* AuraGlass Generated CSS - DO NOT EDIT MANUALLY */');
    cssLines.push('/* Generated from AURA_GLASS tokens in src/tokens/glass.ts */');
    cssLines.push('/* To regenerate: npm run glass:generate */');
    cssLines.push('');
    cssLines.push(':root {');
    cssLines.push('  /* === FOUNDATION PROPERTIES === */');
    
    // Foundation properties
    const foundationProps = this.generateFoundationProperties();
    cssLines.push(...foundationProps);
    cssLines.push('');
    
    // Surface properties for each intent and elevation
    const intents = Object.keys(AURA_GLASS.surfaces) as GlassIntent[];
    const elevations = Object.keys(AURA_GLASS.surfaces.neutral) as GlassElevation[];
    
    intents.forEach(intent => {
      cssLines.push(`  /* === ${intent.toUpperCase()} SURFACES === */`);
      elevations.forEach(elevation => {
        const surfaceProps = this.generateSurfaceProperties(intent, elevation);
        cssLines.push(...surfaceProps);
        this.stats.elevationsProcessed++;
      });
      cssLines.push('');
      this.stats.intentsProcessed++;
    });
    
    // Performance tier properties
    cssLines.push('  /* === PERFORMANCE TIER PROPERTIES === */');
    const tiers = Object.keys(PERFORMANCE_TIERS) as QualityTier[];
    tiers.forEach(tier => {
      if (tier !== 'auto') { // Skip auto since it's determined at runtime
        const tierProps = this.generatePerformanceTierProperties(tier);
        cssLines.push(...tierProps);
        this.stats.tiersProcessed++;
      }
    });
    
    cssLines.push('}');
    cssLines.push('');
    
    // Utility classes
    cssLines.push('/* === GENERATED UTILITY CLASSES === */');
    cssLines.push('');
    
    // Generate utility classes for each intent/elevation combination
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
    
    const cssContent = cssLines.join('\n');
    
    return {
      success: this.errors.length === 0,
      cssContent,
      errors: this.errors,
      warnings: this.warnings,
      stats: this.stats
    };
  }
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  console.log('🔄 Generating glass.generated.css from AURA_GLASS tokens...');
  
  const generator = new GlassCSSGenerator();
  const result = generator.generate();
  
  // Print stats
  console.log('📊 Generation Stats:');
  console.log(`   Properties Generated: ${result.stats.propertiesGenerated}`);
  console.log(`   Intents Processed: ${result.stats.intentsProcessed}`);
  console.log(`   Elevations Processed: ${result.stats.elevationsProcessed}`);
  console.log(`   Performance Tiers: ${result.stats.tiersProcessed}`);
  
  // Handle warnings
  if (result.warnings.length > 0) {
    console.warn('⚠️  Warnings:');
    result.warnings.forEach(warning => console.warn(`   ${warning}`));
  }
  
  // Handle errors
  if (!result.success) {
    console.error('❌ CSS Generation FAILED:');
    result.errors.forEach(error => console.error(`   ${error}`));
    process.exit(1);
  }
  
  // Write the generated CSS
  const outputPath = path.join(__dirname, '..', 'src', 'styles', 'glass.generated.css');
  
  try {
    fs.writeFileSync(outputPath, result.cssContent, 'utf8');
    console.log(`✅ Successfully generated ${outputPath}`);
    console.log(`   File size: ${(result.cssContent.length / 1024).toFixed(1)} KB`);
  } catch (error) {
    console.error(`❌ Failed to write CSS file: ${error}`);
    process.exit(1);
  }
  
  console.log('🎉 CSS generation completed successfully!');
}

// Execute if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

export { GlassCSSGenerator };
export type { GenerationResult };