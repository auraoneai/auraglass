/* LiquidGlassPhotoInspector — 4.x compat adapter (REQ-SURF-13, DEP-S0603).
   The 4.x component was an inspector-panel preset (open, title,
   selectionLabel, metadata record, tags, rating, onOpenChange), not an image
   viewer; its 5.0 successor for that panel is Inspector (ImageViewer +
   Inspector per DEP-S0603). metadata entries → Inspector.Field rows, tags →
   a "Tags" field, rating → a "Rating" field, all inside one
   Inspector.Section; open={false} renders nothing. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Inspector } from '../../../app-shell/Inspector';

export interface LiquidGlassPhotoInspectorProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  selectionLabel?: string;
  metadata?: Record<string, React.ReactNode>;
  tags?: string[];
  rating?: React.ReactNode;
  className?: string;
  [legacy: string]: unknown;
}

/**
 * 4.x `LiquidGlassPhotoInspector` compat adapter (DEP-S0603).
 * @deprecated since 4.2.0, removed in 5.0.0. Use {@link ImageViewer + Inspector from aura-glass/media}.
 */
export function LiquidGlassPhotoInspector(props: LiquidGlassPhotoInspectorProps) {
  warnDeprecated('DEP-S0603');
  const { open = true, onOpenChange, title = 'Photo Inspector', selectionLabel, metadata = {}, tags, rating, className } = props;
  if (!open) return null;
  return (
    <Inspector.Root
      aria-label={title}
      mode="docked"
      {...(className ? { className } : {})}
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        if (onOpenChange && (e.target as HTMLElement).closest('[data-ag-part="inspector-header"] button')) onOpenChange(false);
      }}
    >
      <Inspector.Header title={title} />
      <Inspector.Content>
        {selectionLabel !== undefined ? <p>{selectionLabel}</p> : null}
        <Inspector.Section title="Details">
          {Object.entries(metadata).map(([label, value]) => (
            <Inspector.Field key={label} label={label} value={value} />
          ))}
          {tags && tags.length ? <Inspector.Field label="Tags" value={tags.join(', ')} /> : null}
          {rating !== undefined ? <Inspector.Field label="Rating" value={rating} /> : null}
        </Inspector.Section>
      </Inspector.Content>
    </Inspector.Root>
  );
}
