"use client";

import React, { useMemo } from "react";

import { createGlassStyle } from "@/core/mixins/glassMixins";
import { PersonaId, PersonaMode } from "@/tokens/generated";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

import styles from "./HeroSection.module.css";

export type HeroActionVariant = "primary" | "secondary";

export interface HeroAction {
  label: string;
  href: string;
  variant?: HeroActionVariant;
  icon?: React.ReactNode;
  ariaLabel?: string;
}

export interface HeroStat {
  label: string;
  value: string;
}

export interface HeroSectionProps {
  eyebrow?: string;
  heading: React.ReactNode;
  description?: React.ReactNode;
  highlight?: React.ReactNode;
  actions?: HeroAction[];
  stats?: HeroStat[];
  media?: React.ReactNode;
  personaId?: PersonaId;
  mode?: PersonaMode;
  glassOverlay?: boolean;
  align?: "left" | "center";
  className?: string;
  "data-testid"?: string;
}

const DEFAULT_PERSONA: PersonaId = "auraglass-default";

export const HeroSection: React.FC<HeroSectionProps> = ({
  eyebrow,
  heading,
  description,
  highlight,
  actions = [],
  stats,
  media,
  personaId = DEFAULT_PERSONA,
  mode = "dark",
  glassOverlay = true,
  align = "left",
  className,
  "data-testid": dataTestId,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const overlayStyle = useMemo(() => {
    if (!glassOverlay) {
      return undefined;
    }

    return createGlassStyle({ intent: "primary", elevation: "level3" });
  }, [glassOverlay]);

  const hasStats = Array.isArray(stats) && stats.length > 0;
  const hasActions = Array.isArray(actions) && actions.length > 0;

  const mediaFrameStyle = useMemo(
    () => (glassOverlay ? { ...overlayStyle } : undefined),
    [glassOverlay, overlayStyle]
  );

  return (
    <section
      data-testid={dataTestId}
      className={cn(
        styles.hero,
        className,
        prefersReducedMotion && styles.motionReduced
      )}
      data-align={align}
      data-aura-theme={personaId}
      data-aura-mode={mode}
    >
      <span className={styles.noiseOverlay} aria-hidden />
      {glassOverlay ? (
        <span
          className={styles.backgroundMesh}
          style={{ ...{ opacity: 0.75 } }}
          aria-hidden
        />
      ) : null}

      <div className={styles.inner}>
        <div className={styles.copy}>
          {eyebrow ? (
            <span className={styles.eyebrow} data-testid="hero-eyebrow">
              {eyebrow}
            </span>
          ) : null}

          <div className={styles.heading} data-testid="hero-heading">
            {heading}
          </div>

          {description ? (
            <div className={styles.description} data-testid="hero-description">
              {description}
            </div>
          ) : null}

          {highlight}

          {hasActions ? (
            <div className={styles.actions} data-testid="hero-actions">
              {actions.map(
                ({ label, href, variant = "primary", icon, ariaLabel }) => (
                  <a
                    key={`${label}-${href}`}
                    className={cn(
                      styles.actionButton,
                      variant === "primary"
                        ? styles.primaryAction
                        : styles.secondaryAction
                    )}
                    href={href}
                    aria-label={ariaLabel}
                  >
                    <span>{label}</span>
                    {icon}
                  </a>
                )
              )}
            </div>
          ) : null}
        </div>

        {(hasStats || media) && (
          <div className={styles.meta}>
            {hasStats ? (
              <div className={styles.stats} data-testid="hero-stats">
                {stats!.map((stat) => (
                  <div key={stat.label} className={styles.stat}>
                    <span className={styles.statValue}>{stat.value}</span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </div>
                ))}
              </div>
            ) : null}

            {media ? (
              <div className={styles.media} data-testid="hero-media">
                <div
                  className={styles.mediaFrame}
                  style={{ ...(mediaFrameStyle || {}) }}
                >
                  <div className={styles.mediaContent}>{media}</div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
