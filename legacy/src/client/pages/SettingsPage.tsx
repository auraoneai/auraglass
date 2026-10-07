"use client";

import React from "react";
import { useSettings } from "../../contexts/SettingsContext";
import { createGlassStyle } from "../../core/mixins/glassMixins";

type Option<T extends string | number> = {
  value: T;
  label: string;
  description?: string;
};

const themeModeOptions: Option<"light" | "dark" | "system">[] = [
  { value: "system", label: "System", description: "Follow system appearance" },
  { value: "light", label: "Light", description: "Always use light theme" },
  { value: "dark", label: "Dark", description: "Always use dark theme" },
];

const glassIntensityOptions: Option<"subtle" | "balanced" | "strong">[] = [
  { value: "subtle", label: "Subtle" },
  { value: "balanced", label: "Balanced" },
  { value: "strong", label: "Strong" },
];

const contrastModeOptions: Option<"normal" | "high">[] = [
  { value: "normal", label: "Standard" },
  { value: "high", label: "High contrast" },
];

const reducedMotionOptions: Option<"system" | "on" | "off">[] = [
  {
    value: "system",
    label: "System",
    description: "Follow system motion preferences",
  },
  {
    value: "on",
    label: "Reduce",
    description: "Minimize animations and motion",
  },
  { value: "off", label: "Full", description: "Allow full motion effects" },
];

const fontScaleOptions: Option<1 | 1.1 | 1.25 | 1.5>[] = [
  { value: 1, label: "100%" },
  { value: 1.1, label: "110%" },
  { value: 1.25, label: "125%" },
  { value: 1.5, label: "150%" },
];

const focusStyleOptions: Option<"default" | "strong">[] = [
  { value: "default", label: "Default" },
  {
    value: "strong",
    label: "Strong",
    description: "More prominent focus outlines",
  },
];

const densityOptions: Option<"comfortable" | "compact">[] = [
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
];

const localeOptions: Option<string>[] = [{ value: "en", label: "English" }];

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetSettings, isReady } = useSettings();

  const handleChange =
    <K extends keyof typeof settings>(key: K) =>
    (value: (typeof settings)[K]) => {
      updateSettings({ [key]: value } as any);
    };

  const handleExperimentToggle = (key: string) => {
    const current = settings.experiments?.[key] ?? false;
    updateSettings({
      experiments: {
        ...(settings.experiments || {}),
        [key]: !current,
      },
    });
  };

  return (
    <div
      aria-label="Application settings"
      className="auraglass-settings-page"
      style={{
        padding: "2rem",
        maxWidth: 960,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <header>
        <h1
          style={{
            ...{
              fontSize: "1.75rem",
              fontWeight: 600,
              margin: 0,
            },
          }}
        >
          Settings
        </h1>
        <p
          style={{
            ...{
              margin: "0.5rem 0 0",
              color: "var(--auraglass-text-muted, #8f9bb3)",
            },
          }}
        >
          Customize appearance, motion, and accessibility for the Auraglass
          experience.
        </p>
      </header>

      {!isReady && (
        <div
          aria-live="polite"
          style={{
            ...createGlassStyle({ intent: "neutral", elevation: "level2" }),
          }}
        >
          Loading your preferences…
        </div>
      )}

      <section aria-labelledby="settings-theme">
        <SectionHeader
          id="settings-theme"
          title="Theme & Appearance"
          description="Control color mode, glass intensity, contrast and density."
        />
        <div className="auraglass-settings-glass-grid">
          <SelectGroup
            label="Theme mode"
            value={settings.themeMode}
            options={themeModeOptions}
            onChange={handleChange("themeMode")}
          />
          <SelectGroup
            label="Glass intensity"
            value={settings.glassIntensity}
            options={glassIntensityOptions}
            onChange={handleChange("glassIntensity")}
          />
          <SelectGroup
            label="Contrast mode"
            value={settings.contrastMode}
            options={contrastModeOptions}
            onChange={handleChange("contrastMode")}
          />
          <SelectGroup
            label="Interface density"
            value={settings.density}
            options={densityOptions}
            onChange={handleChange("density")}
          />
        </div>
      </section>

      <section aria-labelledby="settings-motion">
        <SectionHeader
          id="settings-motion"
          title="Motion & Interaction"
          description="Tune motion to align with your comfort and system preferences."
        />
        <div className="auraglass-settings-glass-grid">
          <SelectGroup
            label="Motion level"
            value={settings.reducedMotion}
            options={reducedMotionOptions}
            onChange={handleChange("reducedMotion")}
          />
        </div>
      </section>

      <section aria-labelledby="settings-accessibility">
        <SectionHeader
          id="settings-accessibility"
          title="Accessibility"
          description="Improve legibility and focus visibility."
        />
        <div className="auraglass-settings-glass-grid">
          <SelectGroup
            label="Text size"
            value={settings.fontScale}
            options={fontScaleOptions}
            onChange={handleChange("fontScale")}
          />
          <SelectGroup
            label="Focus style"
            value={settings.focusStyle}
            options={focusStyleOptions}
            onChange={handleChange("focusStyle")}
          />
        </div>
      </section>

      <section aria-labelledby="settings-language">
        <SectionHeader
          id="settings-language"
          title="Language & locale"
          description="Used for localization-sensitive components."
        />
        <div className="auraglass-settings-glass-grid">
          <SelectGroup
            label="Locale"
            value={settings.locale}
            options={localeOptions}
            onChange={handleChange("locale")}
          />
        </div>
      </section>

      <section aria-labelledby="settings-experiments">
        <SectionHeader
          id="settings-experiments"
          title="Experiments"
          description="Toggle experimental Auraglass capabilities."
        />
        <div className="auraglass-settings-glass-grid">
          <ToggleRow
            label="Quantum glass effects"
            description="Enable experimental high-fidelity glass rendering."
            checked={!!settings.experiments?.quantumGlass}
            onChange={() => handleExperimentToggle("quantumGlass")}
          />
          <ToggleRow
            label="AR depth fields"
            description="Enable AR-inspired depth and parallax layers."
            checked={!!settings.experiments?.arDepth}
            onChange={() => handleExperimentToggle("arDepth")}
          />
        </div>
      </section>

      <div
        style={{
          ...{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          },
        }}
      >
        <button
          type="button"
          onClick={resetSettings}
          className="auraglass-button-reset"
          style={{
            ...{
              padding: "0.6rem 1.2rem",
              borderRadius: "999px",
              border: "1px solid rgba(148,163,253,0.45)",
              background: "transparent",
              color: "var(--auraglass-text, #e5e7eb)",
              cursor: "pointer",
              // Use createGlassStyle() instead,
              // Use createGlassStyle() instead,
            },
          }}
        >
          Reset to defaults
        </button>
        <div
          aria-hidden="true"
          style={{
            ...{
              fontSize: "0.8rem",
              color: "var(--auraglass-text-muted, #9ca3af)",
              alignSelf: "center",
            },
          }}
        >
          Preferences are stored locally in your browser.
        </div>
      </div>
    </div>
  );
};

interface SectionHeaderProps {
  id: string;
  title: string;
  description?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  id,
  title,
  description,
}) => (
  <header
    style={{
      ...{
        marginBottom: "0.75rem",
      },
    }}
  >
    <h2
      id={id}
      style={{
        ...{
          fontSize: "1.1rem",
          margin: 0,
          fontWeight: 500,
        },
      }}
    >
      {title}
    </h2>
    {description && (
      <p
        style={{
          ...{
            margin: "0.25rem 0 0",
            fontSize: "0.9rem",
            color: "var(--auraglass-text-muted, #9ca3af)",
          },
        }}
      >
        {description}
      </p>
    )}
  </header>
);

interface SelectGroupProps<T extends string | number> {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
}

const SelectGroup = <T extends string | number>({
  label,
  value,
  options,
  onChange,
}: SelectGroupProps<T>) => {
  const id = `settings-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <label
      htmlFor={id}
      style={{
        ...createGlassStyle({ intent: "neutral", elevation: "level2" }),
      }}
    >
      <span
        style={{
          fontSize: "0.85rem",
          fontWeight: 500,
          color: "var(--auraglass-text, #e5e7eb)",
        }}
      >
        {label}
      </span>
      <select
        id={id}
        value={value as any}
        onChange={(e) =>
          onChange(
            options.find((o) => String(o.value) === e.target.value)!.value
          )
        }
        style={{
          marginTop: "0.25rem",
          padding: "0.4rem 0.6rem",
          borderRadius: "999px",
          border: "none",
          outline: "none",
          fontSize: "0.85rem",
          background: "var(--glass-primary-level3-surface)",
          color: "var(--auraglass-text, #e5e7eb)",
          boxShadow: "0 0 0 1px rgba(148,163,253,0.35)",
          appearance: "none",
          WebkitAppearance: "none",
        }}
      >
        {options.map((opt) => (
          <option
            key={String(opt.value)}
            value={opt.value as any}
            style={{
              backgroundColor: "#020817",
              color: "#e5e7eb",
            }}
          >
            {opt.label}
          </option>
        ))}
      </select>
      {options.find((o) => o.value === value)?.description && (
        <span
          style={{
            fontSize: "0.75rem",
            color: "var(--auraglass-text-muted, #9ca3af)",
          }}
        >
          {options.find((o) => o.value === value)?.description}
        </span>
      )}
    </label>
  );
};

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({
  label,
  description,
  checked,
  onChange,
}) => {
  const id = `toggle-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div
      style={{
        ...createGlassStyle({ intent: "neutral", elevation: "level2" }),
      }}
    >
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        style={{
          ...{
            width: 40,
            height: 22,
            borderRadius: 999,
            border: "1px solid rgba(148,163,253,0.65)",
            display: "flex",
            alignItems: "center",
            padding: 2,
            cursor: "pointer",
            background: checked
              ? "linear-gradient(to right, rgba(129,140,248,0.9), rgba(79,70,229,0.95))"
              : "rgba(15,23,42,0.96)",
            boxShadow: checked
              ? "0 0 12px rgba(129,140,248,0.85)"
              : "0 0 6px rgba(15,23,42,0.9)",
            transition: "all 160ms ease-out",
          },
        }}
      >
        <span
          style={{
            ...{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "var(--glass-gray-200)",
              transform: checked ? "translateX(14px)" : "translateX(0px)",
              transition: "transform 160ms ease-out",
            },
          }}
        />
      </button>
      <div>
        <div
          style={{
            ...{
              fontSize: "0.85rem",
              fontWeight: 500,
              color: "var(--auraglass-text, #e5e7eb)",
            },
          }}
        >
          {label}
        </div>
        {description && (
          <div
            style={{
              ...{
                fontSize: "0.75rem",
                color: "var(--auraglass-text-muted, #9ca3af)",
              },
            }}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
