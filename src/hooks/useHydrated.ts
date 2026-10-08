"use client";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * PLAT-094: hydration-stable "mounted" flag. Always `false` during SSR and on
 * the server-rendered markup's first client render (identical output), then
 * `true` after hydration. Use it to gate client-only UI without a mismatch.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot
  );
}
