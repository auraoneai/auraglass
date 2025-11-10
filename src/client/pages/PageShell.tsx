"use client";

import React from "react";

import styles from "./PageShell.module.css";

export interface PageShellProps {
  children: React.ReactNode;
  mode?: "dark" | "light";
  className?: string;
  "data-testid"?: string;
}

export const PageShell: React.FC<PageShellProps> = ({
  children,
  mode = "dark",
  className,
  "data-testid": dataTestId,
}) => (
  <main
    data-testid={dataTestId}
    className={[styles.page, className].filter(Boolean).join(" ")}
    data-mode={mode}
  >
    <div className={styles.contentGrid}>{children}</div>
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
