/* CMP-251 (REQ-CMP-141): generated matrix over the lane's overlay metas —
   material-transparency (glass|tinted|solid) x scheme per available subject;
   no hand-written cells; stable ids overlays-<subject>--matrix-*. */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Dialog } from '../../../src/components/dialog/index';
import { AlertDialog } from '../../../src/components/alert-dialog/index';
import { Sheet } from '../../../src/components/sheet/index';
import { AuraGlassProvider } from '../../../src/theme';

/* Spans three overlay metas, so no single ComponentMeta subject: a CMP fixture (no parameters.ag, tagged no-cert). */
const sbMeta = {
  title: 'CMP/Fixtures/Overlay Matrix',
  tags: ['no-cert'],
} satisfies Meta;
export default sbMeta;
type Story = StoryObj<typeof sbMeta>;

const SUBJECTS = {
  dialog: (props: Record<string, unknown>) => (
    <Dialog.Root defaultOpen {...props}>
      <Dialog.Content aria-label="matrix dialog"><Dialog.Title>Dialog</Dialog.Title><Dialog.Body>cell</Dialog.Body></Dialog.Content>
    </Dialog.Root>
  ),
  'alert-dialog': (props: Record<string, unknown>) => (
    <AlertDialog.Root defaultOpen {...props}>
      <AlertDialog.Content aria-label="matrix alert"><AlertDialog.Title>Alert</AlertDialog.Title><AlertDialog.Cancel>Cancel</AlertDialog.Cancel><AlertDialog.Action>OK</AlertDialog.Action></AlertDialog.Content>
    </AlertDialog.Root>
  ),
  sheet: (props: Record<string, unknown>) => (
    <Sheet.Root defaultOpen {...props}>
      <Sheet.Content aria-label="matrix sheet"><Sheet.Title>Sheet</Sheet.Title><Sheet.Body>cell</Sheet.Body></Sheet.Content>
    </Sheet.Root>
  ),
} as const;

const TRANSPARENCIES = ['glass', 'tinted', 'solid'] as const;
const SCHEMES = ['light', 'dark'] as const;

export const Matrix: Story = {
  render: () => (
    <AuraGlassProvider>
      <table style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th />
            {TRANSPARENCIES.map((t) => <th key={t} style={{ padding: 4 }}>{t}</th>)}
          </tr>
        </thead>
        <tbody>
          {SCHEMES.flatMap((scheme) =>
            (Object.keys(SUBJECTS) as (keyof typeof SUBJECTS)[]).map((kind) => (
              <tr key={`${scheme}-${kind}`}>
                <th style={{ padding: 4, textAlign: 'start' }}>{kind} / {scheme}</th>
                {TRANSPARENCIES.map((tr) => (
                  <td key={tr} data-scheme={scheme} data-ag-transparency={tr}
                      style={{ padding: 8, border: '1px solid #888', minWidth: 180 }}>
                    <div id={`overlays-${kind}--matrix-${scheme}-${tr}`}>{kind}</div>
                  </td>
                ))}
              </tr>
            )),
          )}
        </tbody>
      </table>
      {/* one live instance per kind for the matrix's interactive cell */}
      {SUBJECTS.dialog({})}
    </AuraGlassProvider>
  ),
};
