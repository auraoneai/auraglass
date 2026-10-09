/* REQ-FIN-07: the single per-document input dispatcher. Layers and primitives
   must never touch document.addEventListener / body.style — they subscribe
   here instead (one keydown, one pointerdown, one focusin listener per
   document, lazily attached when the first subscriber arrives and removed
   when the last leaves). */
type InputEvent = 'keydown' | 'pointerdown' | 'focusin';
type Handler = (e: Event) => void;

interface Dispatch {
  on(type: InputEvent, h: Handler): () => void;
  dispose(): void;
}

const dispatches = new WeakMap<Document, Dispatch>();

const CAPTURED: Record<InputEvent, boolean> = {
  keydown: false, pointerdown: true, focusin: true,
};

const build = (doc: Document): Dispatch => {
  const sets: Record<InputEvent, Set<Handler>> = {
    keydown: new Set(), pointerdown: new Set(), focusin: new Set(),
  };
  const attached = new Set<InputEvent>();
  const forward = (type: InputEvent) => (e: Event) => {
    for (const h of Array.from(sets[type])) h(e);
  };
  const ensure = (type: InputEvent) => {
    if (!attached.has(type)) {
      doc.addEventListener(type, forward(type), CAPTURED[type]);
      attached.add(type);
    }
  };
  return {
    on(type, h) {
      ensure(type);
      sets[type].add(h);
      return () => sets[type].delete(h);
    },
    dispose() {
      for (const type of attached) {
        doc.removeEventListener(type, forward(type), CAPTURED[type]);
      }
      attached.clear();
      for (const t of (Object.keys(sets) as InputEvent[])) sets[t].clear();
    },
  };
};

/** The document's shared dispatcher (created on first use). */
export const layerInputFor = (doc: Document): Dispatch => {
  let d = dispatches.get(doc);
  if (!d) {
    d = build(doc);
    dispatches.set(doc, d);
  }
  return d;
};
