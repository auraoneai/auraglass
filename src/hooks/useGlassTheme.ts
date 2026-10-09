"use client";
import { useContext } from "react";
import { ThemeContext } from "../core/themeContext";

/** @deprecated useGlassTheme DEP-M0939 since 4.2.0, removed in 5.0.0. {@link usePreference / useResolvedPreferences} */
export function useGlassTheme() {
  const context = useContext(ThemeContext);
  return context;
}
