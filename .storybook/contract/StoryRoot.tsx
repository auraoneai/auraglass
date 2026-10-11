/* REQ-QUAL-09 (REQ-FIN-106, FIN-449): the single story root.
   Exactly one <div data-ag-story-content data-ag-story-kind> with no class and no style, so nothing the
   harness renders paints inside #storybook-root. `data-ag-cert-ready` is written on that element only after
   document.fonts.ready, every <img> in the document (plus any extra scene images) decoded, and two
   animation frames; it is removed again on unmount, so it never survives a story navigation. Lanes wait
   on it and never on sleeps. */
import * as React from 'react';
import type { StoryKind } from '../../src/contracts/testing';

export const STORY_KINDS: readonly StoryKind[] = ['lab', 'component', 'matrix', 'scene', 'showcase'];
export const CERT_READY_ATTR = 'data-ag-cert-ready';

export interface StoryRootProps {
  kind: StoryKind;
  /** Extra image URLs painted outside the story (e.g. a body-background scene) that must be decoded first. */
  images?: readonly string[];
  children?: React.ReactNode;
}

const nextFrame = (win: Window) => new Promise<void>((resolve) => { win.requestAnimationFrame(() => resolve()); });

const decode = (img: HTMLImageElement): Promise<void> =>
  (typeof img.decode === 'function' ? img.decode() : Promise.resolve());

/** Resolves once fonts are loaded, every image is decoded and two frames have been presented. */
export async function waitForStoryAssets(doc: Document, images: readonly string[] = []): Promise<void> {
  const win = doc.defaultView;
  if (!win) throw new Error('StoryRoot: document has no window');
  const fonts = (doc as Document & { fonts?: { ready?: Promise<unknown> } }).fonts;
  if (fonts?.ready) await fonts.ready;
  const extra = images.map((src) => {
    const img = doc.createElement('img');
    img.src = src;
    return img;
  });
  await Promise.all([...Array.from(doc.images), ...extra].map(decode));
  await nextFrame(win);
  await nextFrame(win);
}

export function StoryRoot({ kind, images = [], children }: StoryRootProps): React.ReactElement {
  if (!STORY_KINDS.includes(kind)) throw new Error(`StoryRoot: unknown story kind "${String(kind)}"`);
  const ref = React.useRef<HTMLDivElement>(null);
  const imagesKey = images.join('\n');
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let live = true;
    el.removeAttribute(CERT_READY_ATTR);
    waitForStoryAssets(el.ownerDocument, imagesKey ? imagesKey.split('\n') : []).then(
      () => { if (live) el.setAttribute(CERT_READY_ATTR, ''); },
      // A failed decode never marks the story ready; the console lane reports the error.
      (err: unknown) => { if (live) console.error('StoryRoot: story assets failed to load', err); },
    );
    return () => {
      live = false;
      el.removeAttribute(CERT_READY_ATTR);
    };
  }, [imagesKey]);
  return <div ref={ref} data-ag-story-content="" data-ag-story-kind={kind}>{children}</div>;
}
