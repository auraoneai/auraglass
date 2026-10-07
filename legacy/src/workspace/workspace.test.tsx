"use client";

import React from "react";
import { render, screen } from "@testing-library/react";

import {
  GlassCanvasArea,
  GlassInspectorPanel,
  GlassTimelineRail,
  GlassWorkflowShell,
  GlassWorkspace,
  GlassWorkspaceHeader,
  GlassWorkspacePanel,
  GlassWorkspaceTab,
  GlassWorkspaceTabs,
} from ".";

describe("Glass workspace", () => {
  it("composes a product workspace with header, tabs, panels, canvas, and inspector", () => {
    render(
      <GlassWorkspace
        header={
          <GlassWorkspaceHeader
            title="AI Product Console"
            description="Review model activity"
            tabs={
              <GlassWorkspaceTabs>
                <GlassWorkspaceTab active>Runs</GlassWorkspaceTab>
                <GlassWorkspaceTab>Traces</GlassWorkspaceTab>
              </GlassWorkspaceTabs>
            }
          />
        }
        inspector={
          <GlassInspectorPanel title="Inspector">
            Selected run
          </GlassInspectorPanel>
        }
      >
        <GlassWorkspacePanel title="Live activity">
          <GlassCanvasArea emptyState="No activity yet" />
        </GlassWorkspacePanel>
      </GlassWorkspace>
    );

    expect(
      screen.getByRole("heading", { name: "AI Product Console" })
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Runs" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByText("No activity yet")).toBeInTheDocument();
    expect(screen.getByText("Selected run")).toBeInTheDocument();
  });

  it("renders workflow shells with command and inspector regions", () => {
    render(
      <GlassWorkflowShell
        title="Creator Studio"
        description="Edit the launch surface"
        command={<input aria-label="Ask AuraGlass" />}
        inspector={
          <GlassTimelineRail label="Events">Published</GlassTimelineRail>
        }
      >
        <GlassWorkspacePanel title="Canvas">Preview</GlassWorkspacePanel>
      </GlassWorkflowShell>
    );

    expect(
      screen.getByRole("heading", { name: "Creator Studio" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Ask AuraGlass")).toBeInTheDocument();
    expect(screen.getByText("Preview")).toBeInTheDocument();
    expect(screen.getByText("Published")).toBeInTheDocument();
  });
});
