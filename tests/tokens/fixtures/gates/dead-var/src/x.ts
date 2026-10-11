// --ag-live-fixture has a reader (alive); --ag-dead-fixture is never read.
export const live = { background: 'var(--ag-live-fixture)' };
// hand-written private decl with no readers: also reported dead.
export const css = `.y { --_ag-private-orphan: 0; }`;
