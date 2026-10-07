"use client";

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  GlassActionBar,
  GlassAppShell,
  GlassBreadcrumbs,
  GlassCommandDock,
  GlassIconButton,
  GlassMain,
  GlassPage,
  GlassPageHeader,
  GlassSidebarPanel,
  GlassSidebarRail,
  GlassSplitPane,
  GlassStatusBar,
  GlassTopBar,
} from ".";

describe("Glass app shell", () => {
  it("composes top bar, sidebar, main content, actions, and status regions", () => {
    render(
      <GlassAppShell
        topBar={
          <GlassTopBar brand="AuraGlass" actions={<button>Profile</button>} />
        }
        sidebar={
          <GlassSidebarPanel title="Sections">
            <GlassSidebarRail
              items={[{ id: "home", label: "Home", active: true }]}
            />
          </GlassSidebarPanel>
        }
        actionBar={
          <GlassActionBar>
            <button>Deploy</button>
          </GlassActionBar>
        }
        statusBar={<GlassStatusBar>Ready</GlassStatusBar>}
      >
        <GlassMain>
          <GlassPage>
            <GlassPageHeader
              eyebrow="Launch"
              title="Operations"
              description="Production cockpit"
            />
            <p>Workflow surface</p>
          </GlassPage>
        </GlassMain>
      </GlassAppShell>
    );

    expect(screen.getByRole("banner")).toHaveTextContent("AuraGlass");
    expect(screen.getByRole("main")).toHaveTextContent("Workflow surface");
    expect(screen.getByRole("button", { name: "Deploy" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Ready");
    expect(
      screen.getByRole("navigation", { name: "Primary navigation" })
    ).toBeInTheDocument();
  });

  it("keeps navigation and icon buttons accessible", async () => {
    const onSelect = jest.fn();
    const user = userEvent.setup();

    render(
      <>
        <GlassSidebarRail
          items={[{ id: "settings", label: "Settings", onSelect }]}
        />
        <GlassIconButton label="Open command menu">⌘</GlassIconButton>
      </>
    );

    await user.click(screen.getByRole("button", { name: "Settings" }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("button", { name: "Open command menu" })
    ).toBeInTheDocument();
  });

  it("renders breadcrumb, command dock, and split-pane semantics", () => {
    render(
      <>
        <GlassBreadcrumbs
          items={[{ label: "Docs", href: "/docs" }, { label: "3.2" }]}
        />
        <GlassCommandDock
          input={<input aria-label="Command" />}
          actions={<button>Run</button>}
        />
        <GlassSplitPane ratio="two-thirds">
          <section>Canvas</section>
          <aside>Inspector</aside>
        </GlassSplitPane>
      </>
    );

    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" })
    ).toHaveTextContent("Docs");
    expect(screen.getByLabelText("Command")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Run" })).toBeInTheDocument();
    expect(screen.getByText("Inspector").parentElement).toHaveAttribute(
      "data-direction",
      "horizontal"
    );
  });
});
