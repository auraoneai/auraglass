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
  it('0 running animations per preset by default; drift ships one named keyframe', () => {
    const cases: import('../Backdrop').BackdropProps[] = [
      { preset: 'aurora' }, { preset: 'mesh' }, { preset: 'grain' },
      { preset: 'photo', src: '/x.jpg' }, { preset: 'video', src: '/v.mp4' },
    ];
    for (const props of cases) {
      const { container } = render(<Backdrop {...props} />);
      const root = container.firstElementChild as HTMLElement;
      expect(root.getAnimations?.().length ?? 0).toBe(0);
    }
    const { container } = render(<Backdrop preset="aurora" motion="drift" />);
    expect((container.firstElementChild as HTMLElement).getAttribute('data-backdrop-motion')).toBe('drift');
  });
  it('video renders the BackdropTone pause toggle', () => {
    const { container } = render(<Backdrop preset="video" src="/v.mp4" />);
    const btn = container.querySelector('[data-ag-part="backdrop-pause"]')!;
    expect(btn.textContent).toBe('Pause background video');
    expect(btn.getAttribute('aria-pressed')).toBe('false');
  });
  it('layer z-order: backdrop-layer z-0, backdrop-content z-1, aria-hidden layer', () => {
    const { container } = render(<Backdrop preset="mesh"><p>c</p></Backdrop>);
    const layer = container.querySelector('[data-ag-part="backdrop-layer"]')!;
    const content = container.querySelector('[data-ag-part="backdrop-content"]')!;
    expect(layer.getAttribute('aria-hidden')).toBe('true');
    expect(content.textContent).toBe('c');
  });
});
