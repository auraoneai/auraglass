import React from "react";
import { render, renderHook, act, screen } from "@testing-library/react";

import { ThemeProvider, usePersonaTheme } from "./ThemeProvider";
import {
  DEFAULT_PERSONA_ID,
  PERSONA_IDS,
  type PersonaId,
} from "./designMatrix";

describe("usePersonaTheme", () => {
  beforeEach(() => {
    if (typeof window !== "undefined") {
      window.localStorage?.clear();
    }
  });

  const uncontrolledWrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  it("exposes the default persona and persona list", () => {
    const { result } = renderHook(() => usePersonaTheme(), {
      wrapper: uncontrolledWrapper,
    });

    expect(result.current.personaId).toBe(DEFAULT_PERSONA_ID);
    expect(result.current.persona.meta.id).toBe(DEFAULT_PERSONA_ID);
    expect(result.current.personas).toHaveLength(PERSONA_IDS.length);
  });

  it("updates persona when setPersona is called", () => {
    const { result } = renderHook(() => usePersonaTheme(), {
      wrapper: uncontrolledWrapper,
    });

    const targetPersona = PERSONA_IDS.find(
      (id) => id !== DEFAULT_PERSONA_ID
    ) as PersonaId;

    act(() => {
      result.current.setPersona(targetPersona);
    });

    expect(result.current.personaId).toBe(targetPersona);
    expect(result.current.persona.meta.id).toBe(targetPersona);
  });

  it("mirrors controlled persona prop", () => {
    const initialPersona = DEFAULT_PERSONA_ID;
    const nextPersona = PERSONA_IDS.find(
      (id) => id !== initialPersona
    ) as PersonaId;

    const TestComponent = () => {
      const { personaId } = usePersonaTheme();
      return <span data-testid="persona-id">{personaId}</span>;
    };

    const { rerender } = render(
      <ThemeProvider initialPersona={initialPersona} persona={initialPersona}>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId("persona-id").textContent).toBe(
      initialPersona
    );

    rerender(
      <ThemeProvider initialPersona={initialPersona} persona={nextPersona}>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId("persona-id").textContent).toBe(nextPersona);
  });
});
