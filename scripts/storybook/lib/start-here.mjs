// QUAL (REQ-QUAL-52; REQ-FIN-106; FIN-450): the data behind stories/qual/StartHere.mdx, computed — never typed in.
// Browser-safe (no node imports): the Start Here page imports it, and scripts/storybook/verify-start-here.mjs uses it
// to validate the built index. Inputs: storybook-static/index.json entries, the ComponentMeta inventory, package version.

/** Top-level groups the page links to, in storySort order (REQ-QUAL-49). */
export const START_HERE_GROUPS = ['Material Lab', 'Scenes', 'Showcases', 'Flagships', 'Core', 'Foundations', 'Migration'];
export const START_HERE_ID = 'start-here--docs';
export const VERSION_LITERAL_RE = /\b\d+\.\d+\.\d+(?:-[0-9A-Za-z.]+)?\b/;
// literal links only: a computed `?path=${...}` (template placeholder) is validated through computeStartHere's groups
export const PATH_LINK_RE = /\?path=([^"'`)\s>${}]+)/g;

const entriesOf = (index) => Object.values(index?.entries ?? {});

/** `?path=` value for an index entry. */
export const entryPath = (e) => `/${e.type === 'docs' ? 'docs' : 'story'}/${e.id}`;

/**
 * Counts and links. `metas`: ComponentMeta-like [{ name, flagship? }]. Flagships = distinct metas with a flagship number;
 * core = the other metas; stories = index story entries; interaction flows = stories with a play function (`play-fn`).
 */
export function computeStartHere({ index, metas, version }) {
  if (typeof version !== 'string' || !version) throw new Error('start-here: package version is required');
  const entries = entriesOf(index);
  const stories = entries.filter((e) => e.type === 'story');
  const names = new Map(metas.map((m) => [m.name, m]));
  const flagships = [...names.values()].filter((m) => typeof m.flagship === 'number').length;
  const groups = START_HERE_GROUPS.map((name) => {
    const inGroup = entries.filter((e) => String(e.title).split('/')[0].trim() === name);
    const first = inGroup.find((e) => e.type === 'docs') ?? inGroup[0];
    return { name, count: inGroup.filter((e) => e.type === 'story').length, path: first ? entryPath(first) : null };
  });
  return {
    version,
    counts: { flagships, core: names.size - flagships, stories: stories.length, flows: stories.filter((e) => (e.tags ?? []).includes('play-fn')).length },
    groups,
  };
}

/** Every `?path=` target in `text` that is not an entry of the index. */
export function brokenPathLinks(text, index) {
  const valid = new Set(entriesOf(index).map(entryPath));
  const out = [];
  for (const m of String(text).matchAll(PATH_LINK_RE)) {
    const target = decodeURIComponent(m[1]).replace(/&.*$/, '');
    if (!valid.has(target)) out.push(target);
  }
  return out;
}
