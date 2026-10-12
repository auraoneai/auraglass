'use client';
/* StatCard frame island (SURF-176, REQ-SURF-90): the server StatCard renders
   the body; this leaf owns the card element (<article> or, with href, one
   <a>) and its label, because the labelledby target id comes from
   React.useId — a client signal under REQ-PLAT-69 — so it cannot live in the
   server module. useId is deterministic across SSR/CSR and unique per card
   instance, so two cards with the same label never share an id. Every prop is
   serializable (strings plus server-rendered children). */
import * as React from 'react';

export interface StatCardFrameProps {
  id?: string | undefined;
  label: string;
  href?: string | undefined;
  intent: 'neutral' | 'success' | 'danger';
  children?: React.ReactNode;
}

export function StatCardFrame({ id: idProp, label, href, intent, children }: StatCardFrameProps) {
  const autoId = React.useId();
  const id = idProp ?? `ag-stat-${autoId.replace(/[^A-Za-z0-9_-]/g, '')}`;
  const labelNode = (
    <span data-ag-part="stat-card-label" className="ag-stat-card__label" id={`${id}-label`}>
      {label}
    </span>
  );
  if (href !== undefined) {
    return (
      <a href={href} data-ag-part="stat-card" data-ag-intent={intent} className="ag-stat-card" aria-labelledby={`${id}-label`}>
        {labelNode}
        {children}
      </a>
    );
  }
  return (
    <article data-ag-part="stat-card" data-ag-intent={intent} className="ag-stat-card" aria-labelledby={`${id}-label`}>
      {labelNode}
      {children}
    </article>
  );
}
