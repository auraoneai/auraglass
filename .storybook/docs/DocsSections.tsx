/* QUAL (S-51; REQ-QUAL-51; REQ-FIN-106; FIN-450): the six generated docs-page sections for a story whose subject
   resolves to a ComponentMeta — Usage (the Playground story), Anatomy, Material role (meta.material.layer),
   Keyboard (the owner's APG script, read from storybook-static/apg-index.json, never by importing a spec),
   Migration and Selectors. Pure presentational: AgDocsPage supplies the Storybook pieces. No flagship MDX is
   written in QUAL paths; owners author nothing here, the page is computed from their meta and stories. */
import * as React from 'react';
import type { ComponentMeta } from '../../src/contracts/components';
import type { ApgStep } from '../../src/contracts/testing';
import { Anatomy, KeyboardTable, MigrationTable, SelectorTable } from '../blocks/index';

export const DOCS_SECTIONS = ['usage', 'anatomy', 'material-role', 'keyboard', 'migration', 'selectors'] as const;
export type DocsSectionId = (typeof DOCS_SECTIONS)[number];
const HEADINGS: Record<DocsSectionId, string> = {
  usage: 'Usage', anatomy: 'Anatomy', 'material-role': 'Material role', keyboard: 'Keyboard', migration: 'Migration', selectors: 'Selectors',
};

/** One APG index entry (scripts/storybook/write-apg-index.mjs). */
export interface ApgIndexEntry { storyId: string; owner: string; spec: string; test: string; script: readonly ApgStep[] | null }
export interface ApgIndex { version: 1; sha: string | null; entries: readonly ApgIndexEntry[];
  references: readonly { storyId: string; owner: string; spec: string }[] }

const MATERIAL_ROLE: Record<NonNullable<ComponentMeta['material']>['layer'], string> = {
  chrome: 'Chrome: navigation and controls that float above content.',
  overlay: 'Overlay: transient surfaces above the page (popups, dialogs, sheets).',
  transient: 'Transient: material that appears during an interaction (thumbs, knobs, indicators).',
  content: 'Content: sits in the content layer; no glass of its own.',
};

function Section({ id, metaName, children }: { id: DocsSectionId; metaName: string; children: React.ReactNode }) {
  const hid = `ag-docs-${metaName}-${id}`;
  return (
    <section data-ag-docs-section={id} aria-labelledby={hid}>
      <h2 id={hid}>{HEADINGS[id]}</h2>
      {children}
    </section>
  );
}

export function DocsSections({ meta, usage, keyboardStoryId, apg }: {
  meta: ComponentMeta;
  /** The rendered Playground story (a Storybook <Canvas>); null when the CSF file exports none. */
  usage: React.ReactNode | null;
  /** id of the subject's Keyboard story, when the CSF file exports one. */
  keyboardStoryId: string | null;
  /** apg-index.json; `undefined` while loading, `null` when the build has no index. */
  apg: ApgIndex | null | undefined;
}): React.ReactElement {
  const scripts = keyboardStoryId && apg ? apg.entries.filter((e) => e.storyId === keyboardStoryId) : [];
  const refs = keyboardStoryId && apg ? apg.references.filter((r) => r.storyId === keyboardStoryId) : [];
  const hasSelectors = meta.migration.some((m) => m.selectors && Object.keys(m.selectors).length > 0);
  return (
    <div data-ag-docs-page={meta.name}>
      <Section id="usage" metaName={meta.name}>
        {usage ?? <p>{meta.name} exports no <code>Playground</code> story ({meta.owner} story contract, REQ-QUAL-50).</p>}
      </Section>
      <Section id="anatomy" metaName={meta.name}>
        <Anatomy of={meta} />
      </Section>
      <Section id="material-role" metaName={meta.name}>
        {meta.material
          ? <p data-ag-material-layer={meta.material.layer}>{MATERIAL_ROLE[meta.material.layer]}{meta.material.refractionEligible ? ' Refraction eligible.' : ''}</p>
          : <p data-ag-material-layer="none">No material layer: {meta.name} renders without glass.</p>}
      </Section>
      <Section id="keyboard" metaName={meta.name}>
        {!keyboardStoryId && <p>{meta.name} exports no <code>Keyboard</code> story ({meta.owner} story contract, REQ-QUAL-50).</p>}
        {keyboardStoryId && apg === undefined && <p>Loading the APG index…</p>}
        {keyboardStoryId && apg === null && <p>This build has no <code>apg-index.json</code>.</p>}
        {keyboardStoryId && apg && scripts.length === 0 && refs.length === 0 && <p>No APG spec under <code>tests/a11y/apg/</code> drives <code>{keyboardStoryId}</code>.</p>}
        {keyboardStoryId && apg && scripts.length === 0 && refs.map((r) => (
          <p key={r.spec}><code>{r.spec}</code> drives this story with direct key presses (no ApgStep script to tabulate).</p>))}
        {scripts.map((s) => (s.script
          ? <KeyboardTable key={`${s.spec}#${s.test}`} script={s.script} caption={`${meta.name} keyboard: ${s.test}`} />
          : <p key={`${s.spec}#${s.test}`}><code>{s.spec}</code> ({s.test}) drives this story with a computed script.</p>))}
      </Section>
      <Section id="migration" metaName={meta.name}>
        {meta.migration.length ? <MigrationTable of={meta} /> : <p>{meta.name} is new in 5.0; nothing to migrate.</p>}
      </Section>
      <Section id="selectors" metaName={meta.name}>
        {hasSelectors ? <SelectorTable of={meta} /> : <p>No 4.x selectors map to {meta.name}.</p>}
      </Section>
    </div>
  );
}
