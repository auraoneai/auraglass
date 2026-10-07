import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { GlassEmptyState } from "../components/data-display/GlassEmptyState";
import { GlassErrorState } from "../components/data-display/GlassErrorState";
import { GlassLoadingState } from "../components/data-display/GlassLoadingState";
import { GlassFilterBar } from "../components/interactive/GlassFilterBar";
import { GlassCombobox } from "../components/input/GlassCombobox";
import { GlassDateField } from "../components/input/GlassDateField";
import { GlassFieldGroup } from "../components/input/GlassFieldGroup";
import { GlassFormField } from "../components/input/GlassFormField";
import { GlassSearchField } from "../components/input/GlassSearchField";
import { GlassTimeField } from "../components/input/GlassTimeField";
import { GlassValidationMessage } from "../components/input/GlassValidationMessage";
import { GlassPageTabs } from "../components/navigation/GlassPageTabs";

describe("3.2 production workflow components", () => {
  it("renders empty, error, and loading states with accessible live semantics", () => {
    const onRetry = jest.fn();

    render(
      <>
        <GlassEmptyState
          title="No invoices"
          description="Create the first invoice."
        />
        <GlassErrorState title="Billing failed" onRetry={onRetry} />
        <GlassLoadingState
          label="Loading usage"
          variant="progress"
          progress={42}
        />
      </>
    );

    expect(screen.getByText("No invoices")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Billing failed");
    fireEvent.click(screen.getByRole("button", { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "42"
    );
  });

  it("renders filter bar chips and clears active filters", () => {
    const onClear = jest.fn();
    const onRemove = jest.fn();

    render(
      <GlassFilterBar
        filters={[
          { id: "status", label: "Status", value: "Open", onRemove },
          { id: "archived", label: "Archived", active: false },
        ]}
        onClear={onClear}
      />
    );

    expect(screen.getByRole("region", { name: "Filters" })).toHaveTextContent(
      "Status"
    );
    expect(screen.queryByText("Archived")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /remove status/i }));
    fireEvent.click(screen.getByRole("button", { name: /clear filters/i }));
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("supports keyboard selection in combobox with grouped options", () => {
    const onChange = jest.fn();

    render(
      <GlassCombobox
        label="Assignee"
        options={[
          { value: "ana", label: "Ana", group: "Design" },
          { value: "bo", label: "Bo", group: "Engineering" },
        ]}
        onChange={onChange}
      />
    );

    const combobox = screen.getByRole("combobox", { name: "Assignee" });
    fireEvent.change(combobox, { target: { value: "bo" } });
    expect(
      screen.getByRole("group", { name: "Engineering" })
    ).toBeInTheDocument();
    fireEvent.keyDown(combobox, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(
      "bo",
      expect.objectContaining({ label: "Bo" })
    );
  });

  it("renders form wrappers, date/time fields, search, and validation messages", () => {
    const onClear = jest.fn();

    render(
      <GlassFieldGroup
        legend="Schedule"
        description="Pick a release window"
        columns={2}
      >
        <GlassFormField
          label="Release date"
          htmlFor="release-date"
          error="Required"
        >
          <GlassDateField id="release-date" />
        </GlassFormField>
        <GlassFormField label="Release time" htmlFor="release-time">
          <GlassTimeField id="release-time" />
        </GlassFormField>
        <GlassSearchField
          value="aurora"
          onClear={onClear}
          onChange={() => {}}
        />
        <GlassValidationMessage tone="success">Saved</GlassValidationMessage>
      </GlassFieldGroup>
    );

    expect(
      screen.getByRole("group", { name: /schedule/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toHaveAttribute("type", "date");
    expect(screen.getByLabelText("Time")).toHaveAttribute("type", "time");
    fireEvent.click(screen.getByRole("button", { name: /clear search/i }));
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
  });

  it("activates page tabs with arrow-key navigation", () => {
    const onChange = jest.fn();

    render(
      <GlassPageTabs
        tabs={[
          { value: "overview", label: "Overview", panel: "Overview panel" },
          { value: "activity", label: "Activity", panel: "Activity panel" },
        ]}
        onChange={onChange}
      />
    );

    const tablist = screen.getByRole("tablist");
    const overview = within(tablist).getByRole("tab", { name: "Overview" });
    fireEvent.keyDown(overview, { key: "ArrowRight" });

    expect(onChange).toHaveBeenCalledWith("activity");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Activity panel");
  });
});
