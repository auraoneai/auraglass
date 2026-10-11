/* GlassActivityFeed — 4.x compat adapter (REQ-SURF-13, DEP-S0217) →
   ActivityFeed. activities {id,type,title,description,timestamp,user,icon} →
   ActivityItem (user → actor, type success/warning/error/info → intent),
   maxItems truncates, title → aria-label. Filters/categories/avatars toggles
   have no 5.0 equivalent. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { ActivityFeed } from '../../../components/timeline/ActivityFeed';
import { toTimestamp } from './GlassTimeline';

export interface GlassActivityItem {
  id?: string;
  type?: 'user' | 'system' | 'notification' | 'error' | 'success' | 'warning' | 'info';
  title: React.ReactNode;
  description?: React.ReactNode;
  timestamp?: string | number | Date;
  user?: { name: string; avatar?: string; id?: string };
  actor?: string | { name: string; avatarUrl?: string };
  icon?: React.ReactNode;
}

export interface GlassActivityFeedProps {
  activities?: GlassActivityItem[];
  items?: GlassActivityItem[];
  entries?: GlassActivityItem[];
  title?: string;
  maxItems?: number;
  className?: string;
  [legacy: string]: unknown;
}

const INTENT = { success: 'success', warning: 'warning', error: 'danger', info: 'info' } as const;

/**
 * 4.x `GlassActivityFeed` compat adapter (DEP-S0217).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link ActivityFeed from aura-glass}.
 */
export function GlassActivityFeed(props: GlassActivityFeedProps) {
  warnDeprecated('DEP-S0217');
  const { activities, items, entries, title, maxItems, className } = props;
  const source = activities ?? items ?? entries ?? [];
  const list = (maxItems !== undefined ? source.slice(0, maxItems) : source).map((it, i) => {
    const actor = it.user
      ? { name: it.user.name, ...(it.user.avatar ? { avatarUrl: it.user.avatar } : {}) }
      : typeof it.actor === 'string'
        ? { name: it.actor }
        : it.actor;
    const intent = it.type && it.type in INTENT ? INTENT[it.type as keyof typeof INTENT] : undefined;
    return {
      id: it.id ?? String(i),
      timestamp: toTimestamp(it.timestamp),
      title: it.title,
      ...(it.description !== undefined ? { description: it.description } : {}),
      ...(it.icon !== undefined ? { icon: it.icon } : {}),
      ...(actor ? { actor } : {}),
      ...(intent ? { intent } : {}),
    };
  });
  return (
    <ActivityFeed
      items={list}
      {...(title ? { 'aria-label': title } : {})}
      {...(className ? { className } : {})}
    />
  );
}
