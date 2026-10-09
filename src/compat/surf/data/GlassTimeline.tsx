'use client';
import { warnDeprecated } from '../../../internal';
import { Timeline } from '../../../components/timeline/Timeline';
import type { TimelineProps } from '../../../components/timeline/Timeline';

export type GlassTimelineProps = {
  items?: { id?: string; timestamp?: string | number | Date; title: string; description?: string; icon?: React.ReactNode }[];
  events?: GlassTimelineProps['items'];
} & Omit<TimelineProps, 'items'>;

export function GlassTimeline(props: GlassTimelineProps) {
  warnDeprecated('DEP-S0637');
  const { items, events, ...rest } = props;
  const list = (items ?? events ?? []).map((it, i) => ({
    id: it.id ?? String(i),
    timestamp: it.timestamp instanceof Date ? it.timestamp : typeof it.timestamp === 'number' ? new Date(it.timestamp) : (it.timestamp ?? ''),
    title: it.title,
    ...(it.description !== undefined ? { description: it.description } : {}),
    ...(it.icon !== undefined ? { icon: it.icon } : {}),
  }));
  return <Timeline {...rest} items={list} />;
}
