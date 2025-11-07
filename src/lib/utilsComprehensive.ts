import React from 'react';
/**
 * AuraGlass Utility Functions
 * Production-ready utility functions for the AuraGlass design system
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Class name utility function
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Color utilities
export function hexToRgba(hex: string, alpha: number = 1): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function rgbaToHex(rgba: string): string {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return rgba;

  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function adjustOpacity(color: string, opacity: number): string {
  if (color.startsWith('#')) {
    return hexToRgba(color, opacity);
  }
  
  if (color.startsWith('rgb')) {
    const match = color.match(/rgba?\(([^)]+)\)/);
    if (match) {
      const values = match[1].split(',').map((v: any) => v.trim());
      return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${opacity})`;
    }
  }

  return color;
}

// Number utilities
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

export function roundToDecimal(value: number, decimals: number): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// String utilities
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
    .replace(/^(.)/, char => char.toLowerCase());
}

// Object utilities
export function deepMerge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key] as Record<string, any>, source[key] as Record<string, any>);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

export function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key: any) => delete result[key]);
  return result;
}

export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key: any) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

// Array utilities
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

export function sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

// DOM utilities
export function getElementRect(element: HTMLElement): DOMRect {
  return element.getBoundingClientRect();
}

export function isElementInViewport(element: HTMLElement): boolean {
  const rect = getElementRect(element);
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export function scrollToElement(element: HTMLElement, options: ScrollIntoViewOptions = {}): void {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
    ...options,
  });
}

// Event utilities
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

// Format utilities
export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

export function formatPercentage(
  value: number,
  decimals: number = 1
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(dateObj);
}

// Animation utilities
export function createAnimationPromise(
  element: HTMLElement,
  animationName: string,
  duration?: number
): Promise<void> {
  return new Promise((resolve) => {
    const handleAnimationEnd = () => {
      element.removeEventListener('animationend', handleAnimationEnd);
      resolve();
    };

    element.addEventListener('animationend', handleAnimationEnd);
    element.style.animation = `${animationName} ${duration || 300}ms ease forwards`;
  });
}

export function getOptimalAnimationDuration(element: HTMLElement): number {
  const rect = getElementRect(element);
  const area = rect.width * rect.height;
  
  // Base duration on element size
  if (area < 10000) return 200;  // Small elements
  if (area < 50000) return 300;  // Medium elements
  if (area < 100000) return 400; // Large elements
  return 500; // Very large elements
}

// Storage utilities
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(`aura-glass-${key}`);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch {
      return defaultValue ?? null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(`aura-glass-${key}`, JSON.stringify(value));
    } catch {
      // Storage might be full or unavailable
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(`aura-glass-${key}`);
    } catch {
      // Storage might be unavailable
    }
  },

  clear: (): void => {
    try {
      const keys = Object.keys(localStorage).filter((key: any) => key.startsWith('aura-glass-'));
      keys.forEach((key: any) => localStorage.removeItem(key));
    } catch {
      // Storage might be unavailable
    }
  },
};

// Error handling utilities
export function safeExecute<T>(
  fn: () => T,
  fallback?: T,
  onError?: (error: Error) => void
): T | undefined {
  try {
    return fn();
  } catch (error) {
    if (onError && error instanceof Error) {
      onError(error);
    }
    return fallback;
  }
}

export async function safeExecuteAsync<T>(
  fn: () => Promise<T>,
  fallback?: T,
  onError?: (error: Error) => void
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    if (onError && error instanceof Error) {
      onError(error);
    }
    return fallback;
  }
}

// Export all utilities
export default {
  cn,
  hexToRgba,
  rgbaToHex,
  adjustOpacity,
  clamp,
  lerp,
  roundToDecimal,
  capitalize,
  kebabCase,
  camelCase,
  deepMerge,
  isObject,
  omit,
  pick,
  unique,
  groupBy,
  sortBy,
  getElementRect,
  isElementInViewport,
  scrollToElement,
  debounce,
  throttle,
  isValidEmail,
  isValidUrl,
  isValidHexColor,
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatDate,
  createAnimationPromise,
  getOptimalAnimationDuration,
  storage,
  safeExecute,
  safeExecuteAsync,
};