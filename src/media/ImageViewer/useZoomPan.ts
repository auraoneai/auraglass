'use client';
import * as React from 'react';
import { useImageViewer } from './ivContext';

/** REQ-SURF-143/144 — pan via pointer capture (single-pointer only when
 * zoomed); wheel zoom is non-passive and only active with ctrlKey/metaKey or
 * while already zoomed. */
export function useZoomPan(stageRef: React.RefObject<HTMLElement | null>) {
  const c = useImageViewer('Stage');
  const pointers = React.useRef(new Map<number, { x: number; y: number }>());
  const pan = React.useRef({ x: 0, y: 0 });
  const [panState, setPanState] = React.useState({ x: 0, y: 0 });
  const resetPan = React.useCallback(() => {
    pan.current = { x: 0, y: 0 };
    setPanState({ x: 0, y: 0 });
  }, []);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el || !c.open) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey || c.zoom > 1) {
        e.preventDefault();
        c.setZoom(c.zoom * (e.deltaY < 0 ? 1.25 : 1 / 1.25));
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- binding once per open
  }, [c.open, c.zoom, stageRef]);

  const onPointerDown = React.useCallback((e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);
  const onPointerMove = React.useCallback((e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (c.zoom > 1 && pointers.current.size === 1) {
      pan.current = { x: pan.current.x + (e.clientX - prev.x), y: pan.current.y + (e.clientY - prev.y) };
      setPanState({ ...pan.current });
    }
  }, [c.zoom]);
  const onPointerUp = React.useCallback((e: React.PointerEvent) => { pointers.current.delete(e.pointerId); }, []);

  return { panState, resetPan, handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp } };
}
