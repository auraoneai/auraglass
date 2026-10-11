'use client';
/* SURF-26: dev-only landmark registry. Landmarks (nav, complementary, region)
   register their (role, name) pair in a layout effect; a duplicate pair logs
   one console.warn. Renders nothing; safe inside server components. */
import { useLayoutEffect } from 'react';

const REGISTRY = new Map<string, number>();
const WARNED = new Set<string>();

export function LandmarkBeacon({ role, name }: { role: string; name: string | undefined }) {
  useLayoutEffect(() => {
    if (process.env.NODE_ENV === 'production' || name === undefined) return;
    const key = `${role}|${name}`;
    const count = (REGISTRY.get(key) ?? 0) + 1;
    REGISTRY.set(key, count);
    if (count > 1 && !WARNED.has(key)) {
      WARNED.add(key);
      console.warn(`[auraglass] duplicate landmark name '${name}' for role '${role}' — landmark names must be unique per page.`);
    }
    return () => {
      const n = (REGISTRY.get(key) ?? 1) - 1;
      if (n <= 0) { REGISTRY.delete(key); WARNED.delete(key); } else REGISTRY.set(key, n);
    };
  }, [role, name]);
  return null;
}
