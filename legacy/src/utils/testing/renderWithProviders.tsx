'use client';
import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { GlassDragDropProvider } from "@/components/cms/GlassDragDropProvider";
import { CollaborationProvider } from "@/components/collaboration/GlassCollaborationProvider";
import { AIGlassThemeProvider } from "@/components/ai/AIGlassThemeProvider";
import { GlassMediaProvider } from "@/components/media/GlassMediaProvider";
import { GlassEcommerceProvider } from "@/components/ecommerce/GlassEcommerceProvider";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";

type ProviderFlags = {
  dragDrop?: boolean;
  collaboration?: boolean;
  aiTheme?: boolean;
  media?: boolean;
  ecommerce?: boolean;
  accessibility?: boolean;
};

interface RenderWithProvidersOptions extends RenderOptions {
  providers?: ProviderFlags;
}

const defaultFlags: ProviderFlags = {
  accessibility: true,
};

const ProviderComposer: React.FC<{ flags: ProviderFlags; children: React.ReactNode }> = ({
  flags,
  children,
}) => {
  let content = children;

  if (flags.dragDrop) {
    content = <GlassDragDropProvider>{content}</GlassDragDropProvider>;
  }

  if (flags.collaboration) {
    content = (
      <CollaborationProvider roomId="test-room">
        {content}
      </CollaborationProvider>
    );
  }

  if (flags.aiTheme) {
    content = <AIGlassThemeProvider>{content}</AIGlassThemeProvider>;
  }

  if (flags.media) {
    content = <GlassMediaProvider>{content}</GlassMediaProvider>;
  }

  if (flags.ecommerce) {
    content = <GlassEcommerceProvider>{content}</GlassEcommerceProvider>;
  }

  if (flags.accessibility) {
    content = <AccessibilityProvider>{content}</AccessibilityProvider>;
  }

  return <>{content}</>;
};

export function renderWithProviders(
  ui: React.ReactElement,
  { providers, ...renderOptions }: RenderWithProvidersOptions = {}
): ReturnType<typeof render> {
  const flags = { ...defaultFlags, ...providers };

  return render(ui, {
    wrapper: ({ children }) => (
      <ProviderComposer flags={flags}>{children}</ProviderComposer>
    ),
    ...renderOptions,
  });
}
