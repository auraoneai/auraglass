import React from "react";

import {
  ThemeProvider,
  PersonaPicker,
  GlassButton,
  GlassCard,
} from "aura-glass";
import { GlassDataTable } from "aura-glass/data";
import { GlassFormTemplate } from "aura-glass/forms";
import { DisplayText } from "aura-glass/marketing";
import { GlassPageTabs } from "aura-glass/navigation";
import { LiquidGlassAdaptiveSheet } from "aura-glass/overlays";
import tokens from "aura-glass/tokens";
import {
  type AIConfig,
  validateAIConfig,
} from "aura-glass/services/ai/config";
import { StyledComponentsRegistry } from "aura-glass/registry";
import { AuraGlassSSRProvider } from "aura-glass/server";
import { GlassWorkflowShell } from "aura-glass/workflows";

export function TypingsSmokeTest() {
  // Tokens
  const version: string = (tokens as any).version ?? "";
  void version;

  // Service config subpath
  const config: AIConfig = validateAIConfig({
    openai: { apiKey: "test" },
    googleCloud: {},
    pinecone: { apiKey: "test", environment: "test" },
    removeBg: { apiKey: "test" },
    redis: {},
    rateLimit: {},
    costOptimization: {},
  });
  void config;

  // Basic render to ensure JSX types line up
  return (
    <ThemeProvider>
      <StyledComponentsRegistry>
        <AuraGlassSSRProvider>
          <GlassCard>
            <PersonaPicker />
            <GlassButton>Type-safe</GlassButton>
            <GlassFormTemplate title="Typed form" schema={[]} />
            <GlassDataTable columns={[]} data={[]} />
            <GlassPageTabs
              tabs={[{ value: "overview", label: "Overview" }]}
              value="overview"
            />
            <LiquidGlassAdaptiveSheet open={false} title="Typed sheet" />
            <GlassWorkflowShell title="Typed workflow">
              <GlassButton>Workflow action</GlassButton>
            </GlassWorkflowShell>
            <DisplayText as="p">Typed marketing copy</DisplayText>
          </GlassCard>
        </AuraGlassSSRProvider>
      </StyledComponentsRegistry>
    </ThemeProvider>
  );
}
