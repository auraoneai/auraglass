/* GlassTimeline — 4.x compat adapter (REQ-SURF-13, DEP-S0216) → Timeline.
   items {id,title,subtitle,time,icon} → TimelineItem: subtitle →
   description, time → timestamp (4.x passed display strings such as
   "2 hours ago", which Timeline renders verbatim when they are not
   parseable dates). orientation and aria-label map 1:1. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Timeline } from '../../../components/timeline/Timeline';
import { toTimestamp } from './_time';

export interface GlassTimelineItem {
  id?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  time?: string;
  timestamp?: string | number | Date;
  icon?: React.ReactNode;
}

export interface GlassTimelineProps {
  items?: GlassTimelineItem[];
  events?: GlassTimelineItem[];
  orientation?: 'vertical' | 'horizontal';
  'aria-label'?: string;
  className?: string;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassTimeline` compat adapter (DEP-S0216).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Timeline from aura-glass}.
 */
export function GlassTimeline(props: GlassTimelineProps) {
  warnDeprecated('DEP-S0216');
  const { items, events, orientation, className } = props;
  const list = (items ?? events ?? []).map((it, i) => {
    const description = it.description ?? it.subtitle;
    return {
      id: it.id ?? String(i),
      timestamp: toTimestamp(it.timestamp ?? it.time),
      title: it.title,
      ...(description !== undefined ? { description } : {}),
      ...(it.icon !== undefined ? { icon: it.icon } : {}),
    };
  });
  return (
    <Timeline
      items={list}
      {...(orientation ? { orientation } : {})}
      {...(props['aria-label'] ? { 'aria-label': props['aria-label'] } : {})}
      {...(className ? { className } : {})}
    />
  );
}
