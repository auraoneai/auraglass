import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import PageGlassContainer from './PageGlassContainer';

const meta: Meta<typeof PageGlassContainer> = {
  title: 'Surfaces/Cards + Panels/Page Glass Container',
  component: PageGlassContainer,
  parameters: {
    layout: 'fullscreen',
    previewSurface: 'app',
    docs: {
      description: {
        component: 'Full-page glass surface shown with dashboard content and stable viewport framing.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'className prop',
    },
  },
  args: {
    className: ''
  },
};

export default meta;
type Story = StoryObj<typeof PageGlassContainer>;

export const Default: Story = {
  render: (args) => (
    <div
      data-bg="light"
      className="glass-on-light glass-min-h-screen glass-w-full glass-p-6"
    >
      <PageGlassContainer
        {...args}
        borderRadius="xl"
        maxWidth="1120px"
        fullWidth={false}
        className="glass-mx-auto glass-shadow-2xl"
        style={{ minHeight: 620 }}
      >
        <div
          className="glass-stack glass-stack-md"
          style={{
            color: "#0f172a",
            "--glass-text-primary": "#0f172a",
            "--glass-text-secondary": "#475569",
            "--typography-text-primary": "#0f172a",
            "--typography-text-secondary": "#475569",
          } as React.CSSProperties}
        >
          <header className="glass-flex glass-items-center glass-justify-between glass-gap-4">
            <div>
              <p className="glass-text-sm glass-text-secondary">Page container</p>
              <h1 className="glass-text-2xl glass-font-semibold glass-text-primary">
                Customer health
              </h1>
            </div>
            <span
              className="glass-radius-full glass-px-3 glass-py-1 glass-text-sm glass-font-medium"
              style={{ background: "rgba(220, 252, 231, 0.92)", color: "#15803d" }}
            >
              Stable
            </span>
          </header>
          <div className="glass-grid glass-grid-cols-3 glass-gap-4">
            {['Accounts', 'Expansion', 'Risk'].map((label) => (
              <article
                key={label}
                className="glass-radius-xl glass-p-4 glass-shadow-sm"
                style={{ background: "rgba(255, 255, 255, 0.72)" }}
              >
                <p className="glass-text-sm glass-text-secondary">{label}</p>
                <div className="glass-mt-2 glass-text-2xl glass-font-semibold glass-text-primary">24</div>
              </article>
            ))}
          </div>
          <section
            className="glass-radius-xl glass-p-5 glass-shadow-sm"
            style={{ background: "rgba(255, 255, 255, 0.72)" }}
          >
            <h2 className="glass-text-base glass-font-semibold glass-text-primary">Priority accounts</h2>
            <div className="glass-mt-4 glass-stack glass-stack-sm">
              {['Northstar Bank', 'Atlas Retail', 'Kite Logistics'].map((name) => (
                <div
                  key={name}
                  className="glass-flex glass-items-center glass-justify-between glass-radius-lg glass-p-3"
                  style={{ background: "rgba(255, 255, 255, 0.62)" }}
                >
                  <span className="glass-text-sm glass-font-medium glass-text-primary">{name}</span>
                  <span className="glass-text-xs glass-text-secondary">Renewal review</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </PageGlassContainer>
    </div>
  ),
  args: {
    className: '',
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div
      data-bg="light"
      className="glass-on-light glass-grid glass-min-h-screen glass-w-full glass-place-items-center glass-p-6"
    >
      <div
        className="glass-grid glass-w-full glass-grid-cols-2 glass-gap-4"
        style={{ maxWidth: 1024 }}
      >
        {['level1', 'level3'].map((elevation) => (
          <PageGlassContainer
            key={elevation}
            {...args}
            elevation={elevation as any}
            borderRadius="lg"
            fullWidth
            className="glass-min-h-64"
          >
            <h3 className="glass-text-base glass-font-semibold glass-text-primary">{elevation}</h3>
            <p className="glass-mt-2 glass-text-sm glass-text-secondary">
              Surface composition with readable inner content.
            </p>
          </PageGlassContainer>
        ))}
      </div>
    </div>
  ),
  args: {
    className: '',
  },
};
