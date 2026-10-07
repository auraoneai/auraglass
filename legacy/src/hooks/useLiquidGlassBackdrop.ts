"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";

export type LiquidGlassContrastHint = "light" | "dark" | "mixed";

export interface LiquidGlassBackdropSample {
  luminance: number;
  dominantColor: { r: number; g: number; b: number; a: number };
  contrastHint: LiquidGlassContrastHint;
  mediaRichness: number;
  requiresDimming: boolean;
  source: "dom-grid" | "computed-style" | "theme" | "fallback";
}

export interface LiquidGlassBackdropOptions {
  enabled?: boolean;
  variant?: "regular" | "clear";
  throttleMs?: number;
  minContrastRatio?: number;
  observeMutations?: boolean;
  observeResize?: boolean;
}

const FALLBACK_SAMPLE: LiquidGlassBackdropSample = {
  luminance: 0.5,
  dominantColor: { r: 128, g: 128, b: 128, a: 1 },
  contrastHint: "mixed",
  mediaRichness: 0,
  requiresDimming: false,
  source: "fallback",
};

function parseRgb(value: string | null | undefined) {
  if (!value || value === "transparent") return null;
  const match = value.match(/rgba?\(([^)]+)\)/i);
  if (!match) return null;
  const [r, g, b, a = "1"] = match[1].split(",").map((part) => part.trim());
  const color = {
    r: Number.parseFloat(r),
    g: Number.parseFloat(g),
    b: Number.parseFloat(b),
    a: Number.parseFloat(a),
  };
  if ([color.r, color.g, color.b, color.a].some((channel) => Number.isNaN(channel))) {
    return null;
  }
  return color;
}

function luminanceFor(color: { r: number; g: number; b: number }) {
  const toLinear = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(color.r) + 0.7152 * toLinear(color.g) + 0.0722 * toLinear(color.b);
}

function backdropElementAt(element: HTMLElement, x: number, y: number) {

  if (
    typeof document === "undefined" ||
    typeof document.elementsFromPoint !== "function" ||
    typeof document.elementFromPoint !== "function"
  ) {
    return element.parentElement;
  }

  try {
    const stack = document.elementsFromPoint(x, y);
    return stack.find((candidate) => candidate !== element && !element.contains(candidate)) as HTMLElement | undefined;
  } catch {
    return element.parentElement;
  }
}

function getComputedBackdropColor(element: HTMLElement) {
  const computed = window.getComputedStyle(element);
  const color = parseRgb(computed.backgroundColor);
  const image = computed.backgroundImage || "";
  if (!color) return null;
  return { color, image };
}

function sampleBackdropGrid(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const points = [
    [0.5, 0.5],
    [0.2, 0.2],
    [0.8, 0.2],
    [0.2, 0.8],
    [0.8, 0.8],
    [0.5, 0.2],
    [0.5, 0.8],
    [0.2, 0.5],
    [0.8, 0.5],
  ];
  const samples: Array<{ color: { r: number; g: number; b: number; a: number }; image: string }> = [];

  for (const [xRatio, yRatio] of points) {
    const target = backdropElementAt(
      element,
      rect.left + rect.width * xRatio,
      rect.top + rect.height * yRatio
    );
    if (!target) continue;
    const sample = getComputedBackdropColor(target);
    if (sample) samples.push(sample);
  }

  return samples;
}

export function sampleLiquidGlassBackdrop(
  element: HTMLElement | null,
  options: LiquidGlassBackdropOptions = {}
): LiquidGlassBackdropSample {
  if (typeof window === "undefined" || !element) {
    return FALLBACK_SAMPLE;
  }

  const gridSamples = sampleBackdropGrid(element);
  const target = backdropElementAt(
    element,
    element.getBoundingClientRect().left + element.offsetWidth / 2,
    element.getBoundingClientRect().top + element.offsetHeight / 2
  ) || element.parentElement || document.body;
  const fallbackColor =
    parseRgb(window.getComputedStyle(document.body).backgroundColor) ||
    FALLBACK_SAMPLE.dominantColor;
  const color =
    gridSamples.length > 0
      ? gridSamples.reduce(
          (acc, sample) => ({
            r: acc.r + sample.color.r / gridSamples.length,
            g: acc.g + sample.color.g / gridSamples.length,
            b: acc.b + sample.color.b / gridSamples.length,
            a: acc.a + sample.color.a / gridSamples.length,
          }),
          { r: 0, g: 0, b: 0, a: 0 }
        )
      : getComputedBackdropColor(target)?.color || fallbackColor;

  const imageCount = gridSamples.filter((sample) => sample.image && sample.image !== "none").length;
  const mediaRichness =
    gridSamples.length > 0
      ? Math.min(1, imageCount / gridSamples.length + (gridSamples.length > 1 ? 0.1 : 0))
      : getComputedBackdropColor(target)?.image && getComputedBackdropColor(target)?.image !== "none"
        ? 0.85
        : 0.15;
  const luminance = luminanceFor(color);
  const contrastHint: LiquidGlassContrastHint =
    luminance > 0.68 ? "light" : luminance < 0.32 ? "dark" : "mixed";
  const variant = options.variant ?? "regular";
  const minContrastRatio = options.minContrastRatio ?? (variant === "clear" ? 7 : 4.5);
  const requiresDimming =
    variant === "clear" && (mediaRichness > 0.5 || contrastHint === "mixed" || minContrastRatio >= 7);

  return {
    luminance,
    dominantColor: color,
    contrastHint,
    mediaRichness,
    requiresDimming,
    source: gridSamples.length > 1 ? "dom-grid" : "computed-style",
  };
}

export function useLiquidGlassBackdrop<T extends HTMLElement>(
  ref: RefObject<T>,
  options: LiquidGlassBackdropOptions = {}
) {
  const {
    enabled = true,
    throttleMs = 100,
    observeMutations = true,
    observeResize = true,
  } = options;
  const optionsRef = useRef(options);
  const [sample, setSample] = useState<LiquidGlassBackdropSample>(FALLBACK_SAMPLE);

  optionsRef.current = options;

  const update = useMemo(() => {
    let frame = 0;
    let last = 0;
    return () => {
      if (!enabled || typeof window === "undefined") return;
      const now = window.performance?.now?.() ?? Date.now();
      if (now - last < throttleMs) return;
      last = now;
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setSample(sampleLiquidGlassBackdrop(ref.current, optionsRef.current));
      });
    };
  }, [enabled, ref, throttleMs]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    update();
    const target = ref.current;
    const scrollTarget = target?.closest("[data-liquid-glass-scroll-target]") || window;

    window.addEventListener("resize", update, { passive: true });
    scrollTarget.addEventListener("scroll", update as EventListener, { passive: true });

    let resizeObserver: ResizeObserver | undefined;
    if (observeResize && typeof ResizeObserver !== "undefined" && target) {
      resizeObserver = new ResizeObserver(update);
      resizeObserver.observe(target);
    }

    let mutationObserver: MutationObserver | undefined;
    if (observeMutations && typeof MutationObserver !== "undefined" && target?.parentElement) {
      mutationObserver = new MutationObserver(update);
      mutationObserver.observe(target.parentElement, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ["class", "style", "data-theme"],
      });
    }

    return () => {
      window.removeEventListener("resize", update);
      scrollTarget.removeEventListener("scroll", update as EventListener);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [enabled, observeMutations, observeResize, ref, update]);

  return sample;
}

export { FALLBACK_SAMPLE as LIQUID_GLASS_FALLBACK_BACKDROP_SAMPLE };
