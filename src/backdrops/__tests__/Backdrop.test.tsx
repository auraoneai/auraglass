import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import { Backdrop } from '../Backdrop';

describe('Backdrop DOM (REQ-SURF-155/156/159)', () => {
  it('aurora/mesh render exactly one decorative element, no canvas', () => {
    for (const preset of ['aurora', 'mesh'] as const) {
      const { container } = render(<Backdrop preset={preset} />);
      const layer = container.querySelector('[data-ag-part="backdrop-layer"]')!;
      expect(layer.children.length).toBe(0); // CSS gradients only, one DOM element
      expect(container.querySelectorAll('canvas, img, video, svg').length).toBe(0);
    }
  });
  it('photo renders <img aria-hidden alt="">; video muted/playsinline/loop/preload=metadata, no autoplay', () => {
    const { container } = render(<Backdrop preset="photo" src="/x.jpg" />);
    const img = container.querySelector('img')!;
    expect(img.getAttribute('aria-hidden')).toBe('true');
    expect(img.getAttribute('alt')).toBe('');
    expect(img.getAttribute('decoding')).toBe('async');
    const { container: c2 } = render(<Backdrop preset="video" src="/v.mp4" poster="/p.jpg" />);
    const video = c2.querySelector('video')!;
    expect(video.muted).toBe(true);
    expect(video.hasAttribute('playsinline')).toBe(true);
    expect(video.hasAttribute('loop')).toBe(true);
    expect(video.getAttribute('preload')).toBe('metadata');
    expect(video.hasAttribute('autoplay')).toBe(false);
    expect(video.getAttribute('poster')).toBe('/p.jpg');
  });
  it('no preset carries the drift gate by default; drift opts in by class only', () => {
    // jsdom runs no CSS animations, so the "0 running animations" half lives
    // in tests/e2e/surf/motion/backdrop-drift.spec.ts (L9) and the keyframe
    // shape in tests/backdrops/backdrop-css.test.ts; here: the DOM hooks the
    // gated rule keys on are absent by default and present with drift.
    const cases: import('../Backdrop').BackdropProps[] = [
      { preset: 'aurora' }, { preset: 'mesh' }, { preset: 'grain' },
      { preset: 'photo', src: '/x.jpg' }, { preset: 'video', src: '/v.mp4' },
    ];
    for (const props of cases) {
      const { container } = render(<Backdrop {...props} />);
      const root = container.firstElementChild as HTMLElement;
      expect(root.classList.contains('ag-backdrop--drift')).toBe(false);
      expect(root.getAttribute('data-backdrop-motion')).toBe('static');
    }
    const { container } = render(<Backdrop preset="aurora" motion="drift" />);
    const drift = container.firstElementChild as HTMLElement;
    expect(drift.classList.contains('ag-backdrop--drift')).toBe(true);
    // the MAT preference axis is never written by SURF (REQ-SURF-190)
    expect(drift.hasAttribute('data-ag-motion')).toBe(false);
    expect(drift.getAttribute('data-backdrop-motion')).toBe('drift');
    expect(drift.querySelectorAll('[data-ag-part="backdrop-layer"]').length).toBe(1);
  });
  it('video keeps the pause control hidden while nothing plays (REQ-SURF-157)', () => {
    const { container } = render(<Backdrop preset="video" src="/v.mp4" />);
    const btn = container.querySelector('[data-ag-part="backdrop-pause"]') as HTMLButtonElement;
    expect(btn.hidden).toBe(true);
    expect(btn.textContent).toBe('Pause background video');
  });
  it('media props never land on the root element (REQ-SURF-155)', () => {
    const { container } = render(
      <Backdrop preset="video" src="/v.mp4" poster="/p.jpg" crossOrigin="anonymous" mediaTone="dark" />,
    );
    const root = container.firstElementChild as HTMLElement;
    for (const a of ['src', 'srcset', 'sizes', 'poster', 'crossorigin']) expect(root.hasAttribute(a)).toBe(false);
    expect(container.querySelector('video')!.getAttribute('poster')).toBe('/p.jpg');
  });
  it('layer z-order: backdrop-layer z-0, backdrop-content z-1, aria-hidden layer', () => {
    const { container } = render(<Backdrop preset="mesh"><p>c</p></Backdrop>);
    const layer = container.querySelector('[data-ag-part="backdrop-layer"]')!;
    const content = container.querySelector('[data-ag-part="backdrop-content"]')!;
    expect(layer.getAttribute('aria-hidden')).toBe('true');
    expect(content.textContent).toBe('c');
  });
});
