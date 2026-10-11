"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "aura-glass";

export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
