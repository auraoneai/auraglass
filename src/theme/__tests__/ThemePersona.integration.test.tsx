import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ThemeProvider, usePersonaTheme } from "@/theme/ThemeProvider";
import { PersonaPicker } from "@/components/theme/PersonaPicker";

const ActivePersonaLabel: React.FC = () => {
  const { persona } = usePersonaTheme();
  return <span data-testid="active-persona-name">{persona.meta.name}</span>;
};

describe("ThemeProvider + PersonaPicker integration", () => {
  it("renders without crashing and allows persona switching", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ActivePersonaLabel />
        <PersonaPicker />
      </ThemeProvider>
    );

    const activeLabel = await screen.findByTestId("active-persona-name");
    const initialName = activeLabel.textContent;

    const personaButtons = screen.getAllByRole("button");
    const initialActive = personaButtons.find(
      (btn) => btn.getAttribute("data-active") === "true"
    );
    expect(initialActive).toBeDefined();

    const target = personaButtons.find((btn) => btn !== initialActive);
    expect(target).toBeDefined();

    await user.click(target as HTMLButtonElement);

    const updatedActive = personaButtons.find(
      (btn) => btn.getAttribute("data-active") === "true"
    );
    const updatedName = activeLabel.textContent;

    expect(updatedActive).toBeDefined();
    expect(updatedActive).not.toBe(initialActive);
    expect(updatedName).not.toBe(initialName);
  });
});
