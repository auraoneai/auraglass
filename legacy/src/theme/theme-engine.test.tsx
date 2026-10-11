"use client";

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  GlassThemeProvider,
  createBrandGlassTheme,
  createGlassTheme,
  createGlassThemeCssVars,
  useGlassDensity,
  useGlassMotionPolicy,
  useGlassTheme,
} from ".";

const ThemeProbe = () => {
  const { theme, setMode } = useGlassTheme();
  const { density, setDensity } = useGlassDensity();
  const { motionPolicy, setMotionPolicy } = useGlassMotionPolicy();

  return (
    <div>
      <p>mode:{theme.mode}</p>
      <p>density:{density}</p>
      <p>motion:{motionPolicy}</p>
      <button type="button" onClick={() => setMode("high-contrast")}>
        Contrast
      </button>
      <button type="button" onClick={() => setDensity("compact")}>
        Compact
      </button>
      <button type="button" onClick={() => setMotionPolicy("none")}>
        No motion
      </button>
    </div>
  );
};

describe("Glass theme engine", () => {
  it("creates contrast-aware theme tokens and CSS variables", () => {
    const theme = createGlassTheme({
      brandColor: "#38bdf8",
      density: "spacious",
      motionPolicy: "reduced",
    });
    const vars = createGlassThemeCssVars(theme);

    expect(theme.tokens.color.brand).toBe("#38bdf8");
    expect(theme.density).toBe("spacious");
    expect(theme.tokens.motion.allowContinuous).toBe(false);
    expect(theme.contrast.textOnSurface).toBeGreaterThan(4.5);
    expect(vars["--glass-theme-brand"]).toBe("#38bdf8");
    expect(vars["--glass-theme-page-padding"]).toBe("2rem");
  });

  it("builds brand themes with derived accents", () => {
    const theme = createBrandGlassTheme({
      brandColor: "#22c55e",
      name: "AuraOne Green",
    });

    expect(theme.name).toBe("AuraOne Green");
    expect(theme.tokens.color.brand).toBe("#22c55e");
    expect(theme.tokens.color.accent).not.toBe(theme.tokens.color.brand);
  });

  it("provides runtime controls through hooks", async () => {
    const user = userEvent.setup();

    render(
      <GlassThemeProvider
        theme={{ id: "suite", mode: "dark", density: "comfortable" }}
      >
        <ThemeProbe />
      </GlassThemeProvider>
    );

    expect(screen.getByText("mode:dark")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Contrast" }));
    await user.click(screen.getByRole("button", { name: "Compact" }));
    await user.click(screen.getByRole("button", { name: "No motion" }));

    expect(screen.getByText("mode:high-contrast")).toBeInTheDocument();
    expect(screen.getByText("density:compact")).toBeInTheDocument();
    expect(screen.getByText("motion:none")).toBeInTheDocument();
  });
});
