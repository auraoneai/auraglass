'use client';
import * as React from 'react';
import { useImageViewer } from './ivContext';

type Pt = { x: number; y: number };
const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);

/** REQ-SURF-144 — zoom/pan/pinch on the Stage.
 * - wheel: non-passive, zooms (and prevents the page scroll) only with
 *   ctrlKey/metaKey or while already zoomed; at 1× a plain wheel scrolls.
 * - one pointer: pans via pointer capture, only while zoomed.
 * - two pointers: pinch — zoom = start zoom × (distance / start distance),
 *   clamped 1–8 by the Root.
 * - pan resets whenever zoom returns to 1. */
export function useZoomPan(stageRef: React.RefObject<HTMLElement | null>) {
  const c = useImageViewer('Stage');
  const pointers = React.useRef(new Map<number, Pt>());
  const pinch = React.useRef<{ d0: number; z0: number } | null>(null);
  const pan = React.useRef<Pt>({ x: 0, y: 0 });
  const [panState, setPanState] = React.useState<Pt>({ x: 0, y: 0 });
  const [gesturing, setGesturing] = React.useState(false);
  const zoomRef = React.useRef(c.zoom);
  zoomRef.current = c.zoom;
  const { setZoom } = c;

  const resetPan = React.useCallback(() => {
    pan.current = { x: 0, y: 0 };
    setPanState({ x: 0, y: 0 });
  }, []);

  React.useEffect(() => {
    if (c.zoom === 1) resetPan();
  }, [c.zoom, resetPan]);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el || !c.open) return undefined;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey || zoomRef.current > 1) {
        e.preventDefault();
        setZoom(zoomRef.current * (e.deltaY < 0 ? 1.25 : 1 / 1.25));
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [c.open, setZoom, stageRef]);

  const startPinch = () => {
    const [a, b] = Array.from(pointers.current.values());
    pinch.current = a && b ? { d0: Math.max(1, dist(a, b)), z0: zoomRef.current } : null;
  };

  const onPointerDown = React.useCallback((e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    if (pointers.current.size === 2) startPinch();
    setGesturing(true);
  }, []);

  const onPointerMove = React.useCallback((e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = Array.from(pointers.current.values()) as [Pt, Pt];
      setZoom(pinch.current.z0 * (dist(a, b) / pinch.current.d0));
      return;
    }
    if (pointers.current.size === 1 && zoomRef.current > 1) {
      pan.current = { x: pan.current.x + (e.clientX - prev.x), y: pan.current.y + (e.clientY - prev.y) };
      setPanState({ ...pan.current });
    }
  }, [setZoom]);

  const onPointerUp = React.useCallback((e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) setGesturing(false);
  }, []);

  return {
    panState, resetPan, gesturing,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
  };
}
