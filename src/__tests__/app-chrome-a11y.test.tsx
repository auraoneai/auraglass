import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";

import { GlassButton } from "../components/button/GlassButton";
import { GlassCard } from "../components/card/GlassCard";
import { GlassCommandPalette } from "../components/interactive/GlassCommandPalette";
import { GlassDialog } from "../components/modal/GlassDialog";
import { GlassDrawer } from "../components/modal/GlassDrawer";
import {
  GlassDropdownMenu,
  GlassDropdownMenuContent,
  GlassDropdownMenuItem,
  GlassDropdownMenuLabel,
  GlassDropdownMenuSeparator,
  GlassDropdownMenuTrigger,
} from "../components/navigation/GlassDropdownMenu";
import { GlassPopover } from "../components/modal/GlassPopover";
import {
  Select as GlassSelectRoot,
  SelectContent as GlassSelectContent,
  SelectItem as GlassSelectItem,
  SelectTrigger as GlassSelectTrigger,
  SelectValue as GlassSelectValue,
} from "../components/input/GlassSelectCompound";
import {
  GlassTabs,
  TabsContent as GlassTabsContent,
  TabsList as GlassTabsList,
  TabsTrigger as GlassTabsTrigger,
} from "../components/navigation/GlassTabs";
import { GlassTooltip } from "../components/modal/GlassTooltip";

const expectNoAxeViolations = async (baseElement: HTMLElement) => {
  const results = await axe(baseElement, {
    rules: {
      region: { enabled: false },
    },
  });
  expect(results).toHaveNoViolations();
};

describe("3.2 app-chrome accessibility", () => {
  it("renders dropdown menu without axe violations", async () => {
    const { baseElement } = render(
      <GlassDropdownMenu open>
        <GlassDropdownMenuTrigger>Workspace actions</GlassDropdownMenuTrigger>
        <GlassDropdownMenuContent
          contained
          portalled={false}
          positionStrategy="contained"
        >
          <GlassDropdownMenuLabel>Project</GlassDropdownMenuLabel>
          <GlassDropdownMenuItem>Open command center</GlassDropdownMenuItem>
          <GlassDropdownMenuItem>Duplicate workspace</GlassDropdownMenuItem>
          <GlassDropdownMenuSeparator />
          <GlassDropdownMenuItem>Archive surface</GlassDropdownMenuItem>
        </GlassDropdownMenuContent>
      </GlassDropdownMenu>
    );

    await expectNoAxeViolations(baseElement);
  });

  it("renders select without axe violations", async () => {
    const { baseElement } = render(
      <GlassSelectRoot open value="balanced" name="density">
        <GlassSelectTrigger aria-label="Density">
          <GlassSelectValue placeholder="Choose density" />
        </GlassSelectTrigger>
        <GlassSelectContent
          contained
          portalled={false}
          positionStrategy="contained"
        >
          <GlassSelectItem value="compact">Compact UI</GlassSelectItem>
          <GlassSelectItem value="balanced">
            Balanced product surface
          </GlassSelectItem>
          <GlassSelectItem value="comfortable">
            Comfortable media controls
          </GlassSelectItem>
        </GlassSelectContent>
      </GlassSelectRoot>
    );

    await expectNoAxeViolations(baseElement);
  });

  it("renders dialog without axe violations", async () => {
    const { baseElement } = render(
      <GlassDialog
        open
        title="Publish release evidence"
        description="Confirm package gates before marking 3.2 ready."
        footer={<GlassButton>Approve release</GlassButton>}
      >
        <GlassCard>Dependency sovereignty gates passed.</GlassCard>
      </GlassDialog>
    );

    await expectNoAxeViolations(baseElement);
  });

  it("renders drawer without axe violations", async () => {
    const { baseElement } = render(
      <GlassDrawer
        open
        contained
        title="Task details"
        description="Native AuraGlass drawer without Radix or MUI."
        footer={<GlassButton>Save status</GlassButton>}
      >
        <GlassCard>Status: visual baseline capture.</GlassCard>
      </GlassDrawer>
    );

    await expectNoAxeViolations(baseElement);
  });

  it("renders popover without axe violations", async () => {
    const { baseElement } = render(
      <GlassPopover
        open
        content={
          <div>
            <strong>Surface telemetry</strong>
            <span>Latency 212ms / Quality 98%</span>
          </div>
        }
      >
        <button type="button">Inspect surface</button>
      </GlassPopover>
    );

    await expectNoAxeViolations(baseElement);
  });

  it("renders tooltip without axe violations", async () => {
    const { baseElement, getByRole } = render(
      <GlassTooltip content="First-party tooltip behavior." showDelay={0}>
        <button type="button">Hover for details</button>
      </GlassTooltip>
    );

    fireEvent.mouseEnter(getByRole("button", { name: "Hover for details" }));
    await waitFor(() => {
      expect(baseElement.querySelector('[role="tooltip"]')).toBeTruthy();
    });

    await expectNoAxeViolations(baseElement);
  });

  it("renders tabs without axe violations", async () => {
    const originalRaf = window.requestAnimationFrame;
    window.requestAnimationFrame = () => 0;

    const { baseElement } = render(
      <GlassTabs defaultValue="overview" aria-label="Release views">
        <GlassTabsList>
          <GlassTabsTrigger value="overview">Overview</GlassTabsTrigger>
          <GlassTabsTrigger value="gates">Gates</GlassTabsTrigger>
          <GlassTabsTrigger value="evidence">Evidence</GlassTabsTrigger>
        </GlassTabsList>
        <GlassTabsContent value="overview">
          Native app chrome overview.
        </GlassTabsContent>
        <GlassTabsContent value="gates">
          Dependency gates are passing.
        </GlassTabsContent>
        <GlassTabsContent value="evidence">
          Screenshots are recorded.
        </GlassTabsContent>
      </GlassTabs>
    );

    await expectNoAxeViolations(baseElement);
    window.requestAnimationFrame = originalRaf;
  });

  it("renders command palette without axe violations", async () => {
    const { baseElement } = render(
      <GlassCommandPalette
        open
        contained
        positionStrategy="inline"
        enableRecents={false}
        showFooter={false}
        placeholder="Search AuraGlass actions"
        items={[
          {
            id: "open-dashboard",
            label: "Open dashboard",
            category: "Navigation",
          },
          {
            id: "audit-deps",
            label: "Audit dependencies",
            category: "Release",
          },
          {
            id: "capture-visuals",
            label: "Capture visual baselines",
            category: "Visual QA",
          },
        ]}
      />
    );

    await expectNoAxeViolations(baseElement);
  });
});
