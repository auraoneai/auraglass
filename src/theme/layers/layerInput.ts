/* REQ-FIN-07 (REQ-MAT-57, REQ-CMP-12): the single per-document input
   dispatcher behind the LayerStack. Layers and primitives never attach their
   own document listeners or write body inline styles; the stack
   subscribes here instead. One capture-phase listener per event type and
   document, attached when the first subscriber arrives and detached when the
   last one leaves.

   Capture phase is deliberate: the stack must see Escape before Base UI's
   document-level dismiss handler and before React's root listener, so that
   the stack, not Base UI, decides which layer closes. */
type InputEventType = 'keydown' | 'pointerdown' | 'focusin';
type Handler = (e: Event) => void;

export interface LayerInput {
  on(type: InputEventType, h: Handler): () => void;
  /** Number of document listeners currently attached (test hook). */
  attachedCount(): number;
  dispose(): void;
}

const dispatches = new WeakMap<Document, LayerInput>();

const build = (doc: Document): LayerInput => {
  const sets = new Map<InputEventType, Set<Handler>>();
  const forwards = new Map<InputEventType, Handler>();

  const detach = (type: InputEventType): void => {
    const fwd = forwards.get(type);
    if (!fwd) return;
    doc.removeEventListener(type, fwd, true);
    forwards.delete(type);
  };

  return {
    on(type, h) {
      let set = sets.get(type);
      if (!set) {
        set = new Set();
        sets.set(type, set);
      }
      set.add(h);
      if (!forwards.has(type)) {
        const current = set;
        const fwd: Handler = (e) => {
          for (const fn of Array.from(current)) fn(e);
        };
        forwards.set(type, fwd);
        doc.addEventListener(type, fwd, true);
      }
      return () => {
        const s = sets.get(type);
        if (!s) return;
        s.delete(h);
        if (s.size === 0) detach(type);
      };
    },
    attachedCount: () => forwards.size,
    dispose() {
      for (const type of Array.from(forwards.keys())) detach(type);
      sets.clear();
    },
  };
};

/** The document's shared dispatcher (created on first use). */
export const layerInputFor = (doc: Document): LayerInput => {
  let d = dispatches.get(doc);
  if (!d) {
    d = build(doc);
    dispatches.set(doc, d);
  }
  return d;
};
