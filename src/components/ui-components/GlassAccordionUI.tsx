'use client';
import React from 'react';
import {
  GlassAccordion as BaseGlassAccordion,
  type GlassAccordionProps,
  type AccordionItem,
} from '../data-display/GlassAccordion';

export type { GlassAccordionProps as AccordionProps, AccordionItem };

export const GlassAccordionUI: React.FC<GlassAccordionProps> = (props) => (
  <BaseGlassAccordion {...props} />
);

export { BaseGlassAccordion as GlassAccordion, BaseGlassAccordion as Accordion };

export default GlassAccordionUI;
