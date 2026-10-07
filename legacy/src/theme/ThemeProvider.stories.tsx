import type { Meta, StoryObj } from "@storybook/react";

import {
  ThemeProvider as ThemeProviderComponent,
  useColorMode,
  usePersonaTheme,
  useResponsive,
  useThemeProviderPresence,
} from "./ThemeProvider";
import { DEFAULT_PERSONA_ID } from "./designMatrix";

const ProviderReadout = () => {
  const providerPresent = useThemeProviderPresence();
  const { colorMode, isDarkMode } = useColorMode();
  const { persona } = usePersonaTheme();
  const { currentBreakpoint } = useResponsive();

  return (
    <section
      className="glass-foundation-complete glass-w-full glass-p-5"
      style={{ maxWidth: 760 }}
      aria-label="Theme provider state"
    >
      <p className="glass-m-0 glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-secondary">
        Provider state
      </p>
      <h2 className="glass-mt-2 glass-text-2xl glass-font-semibold glass-text-primary">
        {persona.meta.name}
      </h2>
      <p className="glass-mt-2 glass-text-sm glass-text-secondary">
        The values below are read from the actual ThemeProvider contexts.
      </p>
      <dl
        className="glass-mt-4 glass-grid glass-gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
      >
        <div className="glass-rounded-lg glass-bg-white/10 glass-p-3">
          <dt className="glass-text-xs glass-text-secondary">Mounted</dt>
          <dd className="glass-mt-1 glass-font-semibold glass-text-primary">
            {providerPresent ? "Yes" : "No"}
          </dd>
        </div>
        <div className="glass-rounded-lg glass-bg-white/10 glass-p-3">
          <dt className="glass-text-xs glass-text-secondary">Color mode</dt>
          <dd className="glass-mt-1 glass-font-semibold glass-text-primary">
            {colorMode} / {isDarkMode ? "dark" : "light"}
          </dd>
        </div>
        <div className="glass-rounded-lg glass-bg-white/10 glass-p-3">
          <dt className="glass-text-xs glass-text-secondary">Persona</dt>
          <dd className="glass-mt-1 glass-font-semibold glass-text-primary">
            {persona.meta.id}
          </dd>
        </div>
        <div className="glass-rounded-lg glass-bg-white/10 glass-p-3">
          <dt className="glass-text-xs glass-text-secondary">Breakpoint</dt>
          <dd className="glass-mt-1 glass-font-semibold glass-text-primary">
            {currentBreakpoint}
          </dd>
        </div>
      </dl>
    </section>
  );
};

const meta = {
  title: "Foundations/Theming/Theme Provider",
  component: ThemeProviderComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "Direct coverage for the exported ThemeProvider, including live reads from its color-mode, persona, responsive, and presence contexts.",
      },
    },
  },
  args: {
    children: null,
  },
} satisfies Meta<typeof ThemeProviderComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThemeProvider: Story = {
  name: "ThemeProvider",
  render: () => (
    <div
      className="glass-grid glass-w-full glass-p-4"
      style={{ minHeight: "100vh", placeItems: "center" }}
    >
      <ThemeProviderComponent
        forceColorMode="light"
        initialPersona={DEFAULT_PERSONA_ID}
        persistPersona={false}
        enableAutoDetection={false}
        respectSystemPreference={false}
        enableScrollOptimization={false}
        isolateTheme
      >
        <ProviderReadout />
      </ThemeProviderComponent>
    </div>
  ),
};
