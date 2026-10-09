'use client';
import { warnDeprecated } from '../../../internal';
import { ActivityFeed } from '../../../components/timeline/ActivityFeed';
import type { ActivityFeedProps } from '../../../components/timeline/ActivityFeed';

/** @deprecated GlassActivityFeedProps DEP-S0643 since 4.2.0, removed in 6.0.0. */
export type GlassActivityFeedProps = {
  entries?: { id?: string; timestamp?: string | number | Date; title: string; description?: string; actor?: string | { name: string; avatarUrl?: string | undefined } }[];
  items?: GlassActivityFeedProps['entries'];
} & Omit<ActivityFeedProps, 'items'>;

export function GlassActivityFeed(props: GlassActivityFeedProps) {
  warnDeprecated('DEP-S0643');
  const { entries, items, ...rest } = props;
  const list = (items ?? entries ?? []).map((it, i) => ({
    id: it.id ?? String(i),
    timestamp: it.timestamp instanceof Date ? it.timestamp : typeof it.timestamp === 'number' ? new Date(it.timestamp) : (it.timestamp ?? ''),
    title: it.title,
    ...(it.description !== undefined ? { description: it.description } : {}),
    ...(it.actor !== undefined ? { actor: typeof it.actor === 'string' ? { name: it.actor } : it.actor } : {}),
  }));
  return <ActivityFeed {...rest} items={list} />;
}
