import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import {
  GlassButton,
  GlassCard,
  GlassCombobox,
  GlassDateField,
  GlassEmptyState,
  GlassErrorState,
  GlassFieldGroup,
  GlassFilterBar,
  GlassFormField,
  GlassLoadingState,
  GlassPageTabs,
  GlassSearchField,
  GlassTimeField,
  GlassValidationMessage,
} from "../index";

const meta: Meta = {
  title: "3.2/Production Workflow Components",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj;

export const WorkflowSurface: Story = {
  render: () => (
    <main className="glass-min-h-screen glass-bg-slate-950 glass-p-8 glass-text-primary">
      <div className="glass-mx-auto glass-max-w-6xl glass-space-y-6">
        <GlassPageTabs
          tabs={[
            {
              value: "overview",
              label: "Overview",
              badge: "Live",
              panel: (
                <div className="glass-grid glass-gap-4 md:glass-grid-cols-3">
                  <GlassLoadingState
                    label="Syncing usage"
                    variant="progress"
                    progress={64}
                  />
                  <GlassEmptyState
                    variant="compact"
                    title="No exceptions"
                    description="All workflow checks are clear."
                  />
                  <GlassErrorState
                    severity="warning"
                    title="One webhook delayed"
                    description="Retry the integration when the provider responds."
                    onRetry={() => undefined}
                  />
                </div>
              ),
            },
            {
              value: "filters",
              label: "Filters",
              panel: (
                <GlassCard className="glass-space-y-4 glass-p-4">
                  <GlassFilterBar
                    filters={[
                      { id: "status", label: "Status", value: "Open" },
                      { id: "owner", label: "Owner", value: "Design" },
                    ]}
                    actions={<GlassButton size="sm">Apply</GlassButton>}
                  />
                  <GlassSearchField
                    label="Search workflows"
                    placeholder="Search workflows"
                    value=""
                    onChange={() => undefined}
                  />
                  <GlassCombobox
                    label="Owner"
                    options={[
                      { value: "ana", label: "Ana", group: "Design" },
                      { value: "bo", label: "Bo", group: "Engineering" },
                      { value: "cy", label: "Cy", group: "Support" },
                    ]}
                  />
                </GlassCard>
              ),
            },
            {
              value: "schedule",
              label: "Schedule",
              panel: (
                <GlassFieldGroup
                  legend="Release window"
                  description="Set the publish date and owner-visible validation."
                  columns={2}
                >
                  <GlassFormField label="Date" htmlFor="story-date">
                    <GlassDateField id="story-date" label="Date" />
                  </GlassFormField>
                  <GlassFormField label="Time" htmlFor="story-time">
                    <GlassTimeField id="story-time" label="Time" />
                  </GlassFormField>
                  <GlassValidationMessage tone="success">
                    Release window saved.
                  </GlassValidationMessage>
                </GlassFieldGroup>
              ),
            },
          ]}
        />
      </div>
    </main>
  ),
};

