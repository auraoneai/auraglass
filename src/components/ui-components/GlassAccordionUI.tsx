/**
 * Accordion Component - Backward Compatibility Layer
 * 
 * This file provides backward compatibility for legacy accordion imports.
 * All functionality is now provided by the Glass design system.
 * 
 * @deprecated Use GlassAccordion from @/design-system/components/data-display instead
 */

import { cn } from '../../lib/utilsComprehensive';
import { ContrastGuard, TextWithContrast } from '@/components/accessibility/ContrastGuard';

// Re-export Glass components with legacy names
export {
  GlassAccordion as Accordion,
  GlassAccordion,
} from '../data-display/GlassAccordion';

// Re-export types
export type {
  GlassAccordionProps as AccordionProps,
  AccordionItem,
} from '../data-display/GlassAccordion';

// Default export for backward compatibility
export { GlassAccordion as default } from '../data-display/GlassAccordion';