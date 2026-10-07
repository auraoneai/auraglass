import type { Meta, StoryObj } from "@storybook/react";
import VoiceGlassControl from "./VoiceGlassControl";

const voiceStoryStyles = `
  .ag-voice-story {
    --glass-text-primary: rgba(15, 23, 42, 0.92);
    --glass-text-secondary: rgba(15, 23, 42, 0.72);
    --glass-text-tertiary: rgba(15, 23, 42, 0.6);
    --typography-text-primary: rgba(15, 23, 42, 0.92);
    --typography-text-secondary: rgba(15, 23, 42, 0.72);
    --glass-color-primary: 0 0% 38%;
    --glass-color-secondary: 0 0% 52%;
    --glass-color-success: 0 0% 42%;
    --glass-color-info: 0 0% 48%;
    height: 100vh;
    min-height: 100vh;
    width: 100%;
    overflow: auto;
    isolation: isolate;
    box-sizing: border-box;
    background-color: #e9e9e9 !important;
    background:
      radial-gradient(circle at 20% 12%, rgba(255,255,255,.86), transparent 30%),
      radial-gradient(circle at 82% 24%, rgba(150,150,150,.12), transparent 34%),
      linear-gradient(145deg, #e8e8e8 0%, #f7f7f7 48%, #dcdcdc 100%) !important;
    color: rgba(15, 23, 42, 0.92);
    padding: clamp(16px, 4vw, 32px);
  }

  .ag-voice-story,
  .ag-voice-story *,
  .ag-voice-story *::before,
  .ag-voice-story *::after {
    box-sizing: border-box;
  }

  .ag-voice-story .glass-text-primary,
  .ag-voice-story .glass-text-secondary,
  .ag-voice-story h1,
  .ag-voice-story h2,
  .ag-voice-story h3,
  .ag-voice-story p,
  .ag-voice-story span,
  .ag-voice-story div {
    color: rgba(15, 23, 42, 0.92) !important;
  }

  .ag-voice-story .glass-surface-subtle\\/10 {
    background: rgba(255, 255, 255, 0.2) !important;
    color: rgba(15, 23, 42, 0.92) !important;
  }

  .ag-voice-story .glass-surface-subtle\\/20 {
    background: rgba(255, 255, 255, 0.28) !important;
    color: rgba(15, 23, 42, 0.92) !important;
  }

  .ag-voice-story .glass-contrast-guard {
    color: rgba(15, 23, 42, 0.92) !important;
  }

  .ag-voice-story button {
    background: linear-gradient(180deg, rgba(255,255,255,.66), rgba(244,244,244,.48)) !important;
    color: rgba(15, 23, 42, 0.92) !important;
    border-color: rgba(32,32,32,.14) !important;
  }

  .ag-voice-story > div > .glass-grid > div,
  .ag-voice-story > div > .glass-surface-subtle\/10 {
    background: linear-gradient(145deg, rgba(255,255,255,.7), rgba(244,244,244,.5)) !important;
    border: 1px solid rgba(128,128,128,.28) !important;
    box-shadow: 0 18px 44px rgba(0,0,0,.1), inset 0 1px 0 rgba(255,255,255,.9);
  }

  .ag-voice-story [class~="glass-surface-green"],
  .ag-voice-story [class~="glass-surface-blue"],
  .ag-voice-story [class~="glass-surface-primary"],
  .ag-voice-story [class~="glass-surface-yellow"] {
    background: rgba(255,255,255,.28) !important;
    border: 1px solid rgba(64,64,64,.42) !important;
    box-shadow: inset 0 0 0 1px rgba(64,64,64,.18) !important;
  }

  .ag-voice-story .glass-grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .ag-voice-story .glass-grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ag-voice-story .max-w-4xl {
    max-width: 56rem;
  }

  .ag-voice-story .max-w-6xl {
    max-width: 72rem;
  }

  .ag-voice-story .mb-8 {
    margin-bottom: 2rem;
  }

  .ag-voice-story [data-testid="voiceglasscontrol"] {
    max-width: calc(100vw - 32px);
    color: rgba(15, 23, 42, 0.92) !important;
  }

  .ag-voice-story [data-testid="voiceglasscontrol"] .glass-w-80,
  .ag-voice-story [data-testid="voiceglasscontrol"] .glass-w-96 {
    width: min(24rem, calc(100vw - 32px));
    max-width: calc(100vw - 32px);
  }

  @media (max-width: 640px) {
    .ag-voice-story {
      padding: 16px;
    }

    .ag-voice-story [data-testid="voiceglasscontrol"] {
      left: 16px !important;
      right: 16px !important;
      width: auto;
      max-width: calc(100vw - 32px);
    }
  }

  @media (min-width: 768px) {
    .ag-voice-story .md\\:glass-grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .ag-voice-story .md\\:glass-grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .ag-voice-story .md\\:glass-grid-cols-4 {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
`;

const meta: Meta<typeof VoiceGlassControl> = {
  title: 'Effects + Advanced/Voice Glass Control',
  component: VoiceGlassControl,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Advanced voice interaction system with wake word detection, natural language processing, and hands-free glass UI control.",
      },
    },
  },
  argTypes: {
    position: {
      control: {
        type: "select",
        options: ["bottom-left", "bottom-right", "top-left", "top-right"],
      },
      description: "Control panel position",
    },
    autoEnable: {
      control: "boolean",
      description: "Automatically enable on mount",
    },
    showTranscript: {
      control: "boolean",
      description: "Display speech transcript",
    },
    wakeWord: {
      control: "text",
      description: "Wake word for activation",
    },
    enableFeedback: {
      control: "boolean",
      description: "Enable voice feedback",
    },
    showHelp: {
      control: "boolean",
      description: "Show help button",
    },
  },
  decorators: [
    (Story) => (
      <>
        <style>{voiceStoryStyles}</style>
        <Story />
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof VoiceGlassControl>;

export const Default: Story = {
  args: {
    position: "top-left",
    autoEnable: false,
    showTranscript: true,
    wakeWord: "Hey Genesis",
    enableFeedback: true,
    showHelp: true,
  },
  render: (args: any) => (
    <div className="ag-voice-story glass-min-h-screen glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-p-8">
      <div className="max-w-4xl glass-mx-auto">
        <h1 className="glass-text-3xl glass-font-bold glass-text-secondary dark:glass-text-primary mb-8">
          Voice Control Demo
        </h1>

        <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-6 mb-8">
          <div className="glass-p-6 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h3 className="glass-text-xl glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-4">
              Voice Commands
            </h3>
            <div className="glass-space-y-2 glass-text-sm glass-text-secondary">
              <p>Try saying: "Hey Genesis"</p>
              <p>• "Show navigation"</p>
              <p>• "Play music"</p>
              <p>• "Increase volume"</p>
              <p>• "Toggle theme"</p>
              <p>• "Show help"</p>
            </div>
          </div>

          <div className="glass-p-6 glass-surface-subtle/80 dark:glass-surface-primary/80 glass-backdrop-blur-lg glass-radius-xl glass-border glass-border-subtle/50 dark:glass-border-gray-700/50 glass-contrast-guard">
            <h3 className="glass-text-xl glass-font-semibold glass-text-secondary dark:glass-text-primary glass-mb-4">
              Voice Features
            </h3>
            <div className="glass-space-y-3">
              <div className="glass-flex glass-items-center glass-gap-2">
                <div className="glass-w-2 glass-h-2 glass-surface-green glass-radius-full"></div>
                <span className="glass-text-sm glass-text-secondary">
                  Wake word detection
                </span>
              </div>
              <div className="glass-flex glass-items-center glass-gap-2">
                <div className="glass-w-2 glass-h-2 glass-surface-blue glass-radius-full"></div>
                <span className="glass-text-sm glass-text-secondary">
                  Natural language processing
                </span>
              </div>
              <div className="glass-flex glass-items-center glass-gap-2">
                <div className="glass-w-2 glass-h-2 glass-surface-primary glass-radius-full"></div>
                <span className="glass-text-sm glass-text-secondary">
                  Voice feedback
                </span>
              </div>
            </div>
          </div>
        </div>

        <VoiceGlassControl {...args} />
      </div>
    </div>
  ),
};

export const MusicPlayer: Story = {
  args: {
    position: "bottom-right",
    autoEnable: true,
    showTranscript: true,
    wakeWord: "Hey Music",
    enableFeedback: true,
    showHelp: true,
  },
  render: (args: any) => (
    <div className="ag-voice-story glass-min-h-screen glass-gradient-primary glass-gradient-primary via-pink-900 glass-gradient-primary glass-p-8">
      <div className="max-w-4xl glass-mx-auto">
        <h1 className="glass-text-3xl glass-font-bold glass-text-primary mb-8">
          Voice Music Player
        </h1>

        <div className="glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-xl glass-p-6 mb-8 glass-contrast-guard">
          <div className="glass-flex glass-items-center glass-justify-between glass-mb-4">
            <div>
              <h3 className="glass-text-xl glass-font-semibold glass-text-primary">
                Now Playing
              </h3>
              <p className="glass-text-primary">Song Title - Artist Name</p>
            </div>
            <div className="glass-flex glass-items-center glass-gap-4">
              <button className="glass-p-2 glass-surface-subtle/20 glass-radius-lg hover:glass-surface-subtle/30 transition-colors">
                ⏮️
              </button>
              <button className="glass-p-3 glass-surface-subtle/20 glass-radius-lg hover:glass-surface-subtle/30 transition-colors">
                ▶️
              </button>
              <button className="glass-p-2 glass-surface-subtle/20 glass-radius-lg hover:glass-surface-subtle/30 transition-colors">
                ⏭️
              </button>
            </div>
          </div>

          <div className="glass-mb-4">
            <div className="glass-w-full glass-surface-subtle/20 glass-radius-full glass-h-2">
              <div
                className="glass-surface-subtle glass-h-2 glass-radius-full"
                style={{ width: "30%" }}
              ></div>
            </div>
            <div className="glass-flex glass-justify-between glass-text-sm glass-text-primary mt-1">
              <span>1:23</span>
              <span>4:15</span>
            </div>
          </div>

          <div className="glass-text-center glass-text-primary glass-text-sm">
            Try saying: "Play music", "Pause music", "Next track", "Increase
            volume"
          </div>
        </div>

        <VoiceGlassControl {...args} />
      </div>
    </div>
  ),
};

export const SmartHome: Story = {
  args: {
    position: "top-right",
    autoEnable: true,
    showTranscript: true,
    wakeWord: "Hey Home",
    enableFeedback: true,
    showHelp: true,
  },
  render: (args: any) => (
    <div className="ag-voice-story glass-min-h-screen glass-gradient-primary glass-gradient-primary via-teal-900 glass-gradient-primary glass-p-8">
      <div className="max-w-6xl glass-mx-auto">
        <h1 className="glass-text-3xl glass-font-bold glass-text-primary mb-8">
          Smart Home Control
        </h1>

        <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-3 glass-gap-6 mb-8">
          <div className="glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-xl glass-p-6 glass-contrast-guard">
            <div className="glass-flex glass-items-center glass-justify-between glass-mb-4">
              <h3 className="glass-text-lg glass-font-semibold glass-text-primary">
                Living Room
              </h3>
              <div className="glass-w-3 glass-h-3 glass-surface-yellow glass-radius-full"></div>
            </div>
            <div className="glass-space-y-2 glass-text-sm glass-text-primary">
              <p>💡 Lights: On</p>
              <p>🌡️ Temperature: 72°F</p>
              <p>🎵 Music: Playing</p>
            </div>
          </div>

          <div className="glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-xl glass-p-6 glass-contrast-guard">
            <div className="glass-flex glass-items-center glass-justify-between glass-mb-4">
              <h3 className="glass-text-lg glass-font-semibold glass-text-primary">
                Kitchen
              </h3>
              <div className="glass-w-3 glass-h-3 glass-surface-green glass-radius-full"></div>
            </div>
            <div className="glass-space-y-2 glass-text-sm glass-text-primary">
              <p>💡 Lights: Off</p>
              <p>🌡️ Temperature: 70°F</p>
              <p>🔒 Security: Armed</p>
            </div>
          </div>

          <div className="glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-xl glass-p-6 glass-contrast-guard">
            <div className="glass-flex glass-items-center glass-justify-between glass-mb-4">
              <h3 className="glass-text-lg glass-font-semibold glass-text-primary">
                Bedroom
              </h3>
              <div className="glass-w-3 glass-h-3 glass-surface-blue glass-radius-full"></div>
            </div>
            <div className="glass-space-y-2 glass-text-sm glass-text-primary">
              <p>💡 Lights: Dimmed</p>
              <p>🌡️ Temperature: 68°F</p>
              <p>😴 Sleep Mode: Active</p>
            </div>
          </div>
        </div>

        <div className="glass-surface-subtle/10 glass-backdrop-blur-lg glass-radius-xl glass-p-6 mb-8 glass-contrast-guard">
          <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-4">
            Voice Commands
          </h3>
          <div className="glass-grid glass-grid-cols-2 md:glass-grid-cols-4 glass-gap-4 glass-text-sm glass-text-primary">
            <div>"Turn on lights"</div>
            <div>"Set temperature to 72"</div>
            <div>"Play music"</div>
            <div>"Arm security"</div>
            <div>"Good night"</div>
            <div>"Wake up"</div>
            <div>"Lock doors"</div>
            <div>"Show cameras"</div>
          </div>
        </div>

        <VoiceGlassControl {...args} />
      </div>
    </div>
  ),
};

export const Accessibility: Story = {
  args: {
    position: "bottom-left",
    autoEnable: true,
    showTranscript: true,
    wakeWord: "Hey Assist",
    enableFeedback: true,
    showHelp: true,
  },
  render: (args: any) => (
    <div className="ag-voice-story glass-min-h-screen glass-surface-subtle glass-p-8">
      <div className="max-w-4xl glass-mx-auto">
        <h1 className="glass-text-3xl glass-font-bold glass-text-secondary mb-8">
          Accessibility Assistant
        </h1>

        <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-6 mb-8">
          <div className="glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-subtle">
            <h3 className="glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4">
              Screen Reader Support
            </h3>
            <div className="glass-space-y-2 glass-text-sm glass-text-secondary">
              <p>🔊 Voice feedback for all actions</p>
              <p>📖 Detailed descriptions</p>
              <p>🎯 Focus management</p>
              <p>⌨️ Keyboard navigation</p>
            </div>
          </div>

          <div className="glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-subtle">
            <h3 className="glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4">
              Voice Commands
            </h3>
            <div className="glass-space-y-2 glass-text-sm glass-text-secondary">
              <p>"Read this page"</p>
              <p>"Show help"</p>
              <p>"Increase text size"</p>
              <p>"Toggle high contrast"</p>
            </div>
          </div>
        </div>

        <div className="glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-blue-200 mb-8">
          <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-4">
            Try These Commands
          </h3>
          <div className="glass-grid glass-grid-cols-1 md:glass-grid-cols-2 glass-gap-4 glass-text-sm glass-text-primary">
            <div>"What's on this page?"</div>
            <div>"Read the main content"</div>
            <div>"Show navigation menu"</div>
            <div>"Go to settings"</div>
            <div>"Increase font size"</div>
            <div>"Toggle dark mode"</div>
          </div>
        </div>

        <VoiceGlassControl {...args} />
      </div>
    </div>
  ),
};

export const Minimal: Story = {
  args: {
    position: "top-left",
    autoEnable: false,
    showTranscript: false,
    wakeWord: "Hey",
    enableFeedback: false,
    showHelp: false,
  },
  render: (args: any) => (
    <div className="ag-voice-story glass-min-h-screen glass-surface-subtle glass-p-8">
      <div className="max-w-4xl glass-mx-auto">
        <h1 className="glass-text-2xl glass-font-bold glass-text-secondary mb-8">
          Minimal Voice Control
        </h1>

        <div className="glass-p-6 glass-surface-subtle glass-radius-xl glass-border glass-border-subtle glass-shadow-sm">
          <h3 className="glass-text-lg glass-font-semibold glass-text-secondary glass-mb-4">
            Clean Interface
          </h3>
          <p className="glass-text-secondary glass-mb-4">
            Minimal voice control interface with essential features only.
            Perfect for applications that need subtle voice interaction.
          </p>
          <div className="glass-text-sm glass-text-secondary">
            Say "Hey" to activate voice control
          </div>
        </div>

        <VoiceGlassControl {...args} />
      </div>
    </div>
  ),
};
