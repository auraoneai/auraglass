"use client";

import React from "react";

import { PersonaPicker } from "@/components/theme/PersonaPicker";
import styles from "./PageShell.module.css";

export interface PageShellProps {
  children: React.ReactNode;
  mode?: "dark" | "light";
  className?: string;
  "data-testid"?: string;
  /**
   * Whether to show the PersonaPicker component
   * @default false
   */
  showPersonaPicker?: boolean;
  /**
   * PersonaPicker orientation
   * @default "horizontal"
   */
  personaPickerOrientation?: "horizontal" | "vertical" | "auto";
}

export const PageShell: React.FC<PageShellProps> = ({
  children,
  mode = "dark",
  className,
  "data-testid": dataTestId,
  showPersonaPicker = false,
  personaPickerOrientation = "horizontal",
}) => (
  <main
    data-testid={dataTestId}
    className={[styles.page, className].filter(Boolean).join(" ")}
    data-mode={mode}
  >
    <div className={styles.contentGrid}>
      {showPersonaPicker && (
        <PersonaPicker orientation={personaPickerOrientation} />
      )}
      {children}
    </div>
  </main>
);

export const SectionTitle: React.FC<{ children: React.ReactNode; className?: string }>= ({
  children,
  className,
}) => (
  <h2 className={[styles.sectionTitle, className].filter(Boolean).join(" ")}>{children}</h2>
);

export const SectionDescription: React.FC<{ children: React.ReactNode; className?: string }>= ({
  children,
  className,
}) => (
  <p className={[styles.sectionDescription, className].filter(Boolean).join(" ")}>{children}</p>
);

export const InfoCard: React.FC<{ title: string; body: React.ReactNode }>= ({
  title,
  body,
}) => (
  <article className={styles.card}>
    <h3 className={styles.cardTitle}>{title}</h3>
    <div className={styles.cardBody}>{body}</div>
  </article>
);

export const CardGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.cardGrid}>{children}</div>
);

export default PageShell;
