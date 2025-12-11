"use client";

import React, { CSSProperties } from "react";
import clsx from "clsx";
import { usePersonaTheme } from "@/theme/ThemeProvider";
import type { PersonaId } from "@/theme/designMatrix";
import "./persona-picker.css";

export interface PersonaPickerProps {
  className?: string;
  id?: string;
  orientation?: "auto" | "horizontal" | "vertical";
  onPersonaChange?: (personaId: PersonaId) => void;
  showMeta?: boolean;
}

export const PersonaPicker: React.FC<PersonaPickerProps> = ({
  className,
  id,
  orientation = "auto",
  onPersonaChange,
  showMeta = true,
}) => {
  const { personaId, persona, personas, setPersona } = usePersonaTheme();

  const handleSelect = (nextId: PersonaId) => {
    if (nextId === personaId) return;
    setPersona(nextId);
    onPersonaChange?.(nextId);
  };

  return (
    <section
      id={id}
      className={clsx(
        "persona-picker",
        `persona-picker--${orientation}`,
        className
      )}
      aria-label="Persona selector"
    >
      <header className="persona-picker__header">
        <span className="persona-picker__eyebrow">Active persona</span>
        <div className="persona-picker__active">
          <strong className="persona-picker__active-name">
            {persona.meta.name}
          </strong>
          {showMeta && (
            <span className="persona-picker__active-context">
              {persona.meta.primaryContext}
            </span>
          )}
        </div>
      </header>

      <div
        className="persona-picker__grid"
        role="list"
        aria-label="Available personas"
      >
        {personas.map((entry) => {
          const active = entry.meta.id === personaId;
          const motionDuration = entry.motion.hover || "180ms";
          const cardStyle: CSSProperties & {
            [key: string]: string | CSSProperties[keyof CSSProperties];
          } = {
            background: entry.colors.background.surface,
            color: entry.colors.text.primary,
            borderRadius: entry.spacing.panelRadius,
            boxShadow: active
              ? entry.colors.shadow.panel
              : "0 20px 45px -30px rgba(6, 12, 20, 0.6)",
            transitionDuration: motionDuration,
            ["--card-accent" as string]: entry.colors.accent.primary,
            ["--card-hover" as string]: motionDuration,
          };

          return (
            <button
              key={entry.meta.id}
              type="button"
              className="persona-picker-card"
              style={{ ...cardStyle }}
              data-active={active}
              data-persona={entry.meta.id}
              aria-pressed={active}
              aria-current={active}
              onClick={() => handleSelect(entry.meta.id)}
            >
              <div className="persona-picker-card__header">
                <span className="persona-picker-card__name">
                  {entry.meta.name}
                </span>
                {active && (
                  <span className="persona-picker-card__pill">Active</span>
                )}
              </div>

              <div className="persona-picker-card__swatches" aria-hidden="true">
                <span
                  className="glass-persona-picker-card__swatch glass-persona-picker-card__swatch--primary"
                  style={{ background: entry.colors.accent.primary }}
                />
                <span
                  className="glass-persona-picker-card__swatch glass-persona-picker-card__swatch--secondary"
                  style={{ background: entry.colors.accent.secondary }}
                />
              </div>

              {showMeta && (
                <div className="persona-picker-card__meta">
                  <p className="persona-picker-card__context">
                    {entry.meta.paletteAnchor}
                  </p>
                  <p className="persona-picker-card__schema">
                    {entry.meta.surfaceSchema}
                  </p>
                </div>
              )}

              <footer className="persona-picker-card__footer">
                <span className="persona-picker-card__signal">
                  {entry.meta.motionSignals}
                </span>
              </footer>
            </button>
          );
        })}
      </div>
    </section>
  );
};

PersonaPicker.displayName = "PersonaPicker";
