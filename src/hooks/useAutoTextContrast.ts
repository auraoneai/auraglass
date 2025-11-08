'use client';
import { useEffect } from 'react';

type Options = {
  threshold?: number; // 0..1 luminance threshold; below means dark bg
  observe?: boolean;  // attach observers for dynamic changes
};

// Parse rgb/rgba/hsl/hsla/hex color strings to [r,g,b,a]
function parseColor(input: string): [number, number, number, number] | null {
  if (!input) return null;
  const s = input.trim();
  const rgba = s.match(/^rgba?\(([^)]+)\)/i);
  if (rgba) {
    const parts = rgba[1].split(',').map((v: any) => v.trim());
    const r = parseFloat(parts[0]);
    const g = parseFloat(parts[1]);
    const b = parseFloat(parts[2]);
    const a = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
    return [r, g, b, isNaN(a) ? 1 : a];
  }
  const hsla = s.match(/^hsla?\(([^)]+)\)/i);
  if (hsla) {
    const parts = hsla[1].split(',').map((v: any) => v.trim().replace('%',''));
    const h = parseFloat(parts[0]);
    const ss = parseFloat(parts[1]) / 100;
    const l = parseFloat(parts[2]) / 100;
    const a = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
    // hsl -> rgb
    const c = (1 - Math.abs(2 * l - 1)) * ss;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r1 = 0, g1 = 0, b1 = 0;
    if (0 <= h && h < 60) { r1 = c; g1 = x; b1 = 0; }
    else if (60 <= h && h < 120) { r1 = x; g1 = c; b1 = 0; }
    else if (120 <= h && h < 180) { r1 = 0; g1 = c; b1 = x; }
    else if (180 <= h && h < 240) { r1 = 0; g1 = x; b1 = c; }
    else if (240 <= h && h < 300) { r1 = x; g1 = 0; b1 = c; }
    else { r1 = c; g1 = 0; b1 = x; }
    const r = Math.round((r1 + m) * 255);
    const g = Math.round((g1 + m) * 255);
    const b = Math.round((b1 + m) * 255);
    return [r, g, b, isNaN(a) ? 1 : a];
  }
  const hex = s.match(/^#([0-9a-f]{3,8})$/i);
  if (hex) {
    let v = hex[1];
    if (v.length === 3) v = v.split('').map((ch: any) => ch + ch).join('');
    if (v.length === 6) v += 'ff';
    const num = parseInt(v, 16);
    const r = (num >> 24) & 0xff;
    const g = (num >> 16) & 0xff;
    const b = (num >> 8) & 0xff;
    const a = (num & 0xff) / 255;
    return [r, g, b, a];
  }
  return null;
}

function relativeLuminance([r, g, b, _a]: [number, number, number, number]): number {
  // sRGB → linear
  const srgb = [r, g, b].map((v: any) => v / 255);
  const lin = srgb.map((c: any) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function extractFirstColorFromBackground(bg: string): [number, number, number, number] | null {
  if (!bg) return null;
  const re = /(rgba?\([^\)]+\)|hsla?\([^\)]+\)|#[0-9a-fA-F]{3,8})/g;
  const match = re.exec(bg);
  if (match) return parseColor(match[1]);
  return null;
}

export function useAutoTextContrast(ref: React.RefObject<HTMLElement>, options: Options = {}) {
  const { threshold = 0.55, observe = true } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const decide = () => {
      const cs = getComputedStyle(el);
      let color = parseColor(cs.backgroundColor);
      if (!color || color[3] === 0) {
        // try background-image
        const bg = cs.backgroundImage;
        const c2 = extractFirstColorFromBackground(bg);
        if (c2) color = c2;
      }
      if (!color) return; // bail if unknown
      const lum = relativeLuminance(color);
      const mode = lum < threshold ? 'dark' : 'light';
      if (el.getAttribute('data-bg') !== mode) {
        el.setAttribute('data-bg', mode);
      }
    };

    decide();

    if (!observe) return;
    const ro = new ResizeObserver(() => decide());
    ro.observe(el);
    const mo = new MutationObserver(() => decide());
    mo.observe(el, { attributes: true, attributeFilter: ['style', 'class'] });
    const id = window.setInterval(decide, 1000);
    return () => { ro.disconnect(); mo.disconnect(); window.clearInterval(id); };
  }, [ref, threshold, observe]);
}

export default useAutoTextContrast;