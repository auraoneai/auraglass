/* Subject → story id from the SubjectIndex (REPORTS.subjects =
   storybook-static/cert-manifest.json, contract S-55). Fail closed: an
   unresolved subject becomes a failing cell, never a silently dropped one. */

export function resolveStories(index, subjects) {
  if (!index || index.version !== 1 || !Array.isArray(index.stories)) {
    throw new Error('subject index: expected SubjectIndex { version: 1, stories: [] } (storybook-static/cert-manifest.json)');
  }
  return subjects.map((s) => {
    const candidates = index.stories.filter(
      (st) => st.subject === s.subject && st.kind === s.kind && !(st.tags ?? []).includes('no-cert'),
    );
    const pick =
      s.kind === 'showcase'
        ? candidates.find((st) => /--(fullscreen|full-page|default)$/.test(st.id)) ?? candidates[0]
        : candidates.find((st) => (st.tags ?? []).includes('flagship')) ?? candidates[0];
    return { ...s, storyId: pick?.id ?? null, error: pick ? null : `unresolved-subject:${s.kind}:${s.subject}` };
  });
}

/** Story URL on the device-reachable Storybook (AG_STORYBOOK_URL). */
export function storyUrl(storybookUrl, storyId) {
  const u = new URL('iframe.html', storybookUrl.endsWith('/') ? storybookUrl : `${storybookUrl}/`);
  u.searchParams.set('id', storyId);
  u.searchParams.set('viewMode', 'story');
  u.searchParams.set('ag-cert', '1');
  return u.toString();
}
