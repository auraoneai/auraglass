import React from "react";

import {
  ThemeProvider,
  PersonaPicker,
  GlassButton,
  GlassCard,
} from "aura-glass";
import tokens from "aura-glass/tokens";
import { StyledComponentsRegistry } from "aura-glass/registry";
import { AuraGlassSSRProvider } from "aura-glass/server";

export function TypingsSmokeTest() {
  // Tokens
  const version: string = (tokens as any).version ?? "";
  void version;

  // Basic render to ensure JSX types line up
  return (
    <ThemeProvider>
      <StyledComponentsRegistry>
        <AuraGlassSSRProvider>
          <GlassCard>
            <PersonaPicker />
            <GlassButton>Type-safe</GlassButton>
          </GlassCard>
        </AuraGlassSSRProvider>
      </StyledComponentsRegistry>
    </ThemeProvider>
  );
}
