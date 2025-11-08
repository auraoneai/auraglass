'use client';
import { useContext } from 'react';
import { ThemeContext } from '../core/themeContext';

export function useGlassTheme() {
  const context = useContext(ThemeContext);
  return context;
}