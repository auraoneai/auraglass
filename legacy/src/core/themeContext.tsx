import React, { createContext, useContext } from "react";
import {
  DEFAULT_PERSONA_ID,
  DESIGN_MATRIX,
  PERSONA_LIST,
  type PersonaConfig,
  type PersonaId,
} from "../theme/designMatrix";

const warn = (..._args: unknown[]) => undefined;

export interface ThemeContextType {
  theme: "light" | "dark" | "glass";
  isDarkMode: boolean;
  setTheme: (theme: "light" | "dark" | "glass") => void;
  personaId: PersonaId;
  persona: PersonaConfig;
  personas: PersonaConfig[];
  setPersona: (persona: PersonaId) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "glass",
  isDarkMode: false,
  setTheme: () => warn("setTheme called outside ThemeProvider"),
  personaId: DEFAULT_PERSONA_ID,
  persona: DESIGN_MATRIX[DEFAULT_PERSONA_ID],
  personas: PERSONA_LIST,
  setPersona: (persona) =>
    warn(`setPersona(${persona}) called outside ThemeProvider`),
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const createThemeContext = (theme?: "light" | "dark" | "glass") => {
  return createContext<ThemeContextType>({
    theme: theme || "glass",
    isDarkMode: theme === "dark",
    setTheme: () => warn("setTheme called outside ThemeProvider"),
    personaId: DEFAULT_PERSONA_ID,
    persona: DESIGN_MATRIX[DEFAULT_PERSONA_ID],
    personas: PERSONA_LIST,
    setPersona: (persona) =>
      warn(`setPersona(${persona}) called outside ThemeProvider`),
  });
};
