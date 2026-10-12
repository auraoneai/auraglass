/* REQ-CMP-05 (S-30): `intent` tints text, rim and specular; it never selects material. For every CMP component that
   takes `intent`, rendering each of its intent values leaves every material attribute (data-ag-variant, -layer,
   -thickness, -prominent, -surface, -content) exactly as the intent-less render has them. */
import { describe, expect, it, jest, beforeAll, afterAll } from '@jest/globals';
import { act, render } from '@testing-library/react';
import * as React from 'react';
import { Button } from '../../src/components/button';
import { IconButton } from '../../src/components/icon-button';
import { Badge } from '../../src/components/badge';
import { Text } from '../../src/components/text';
import { Link } from '../../src/components/link';
import { Alert } from '../../src/components/alert';
import { AlertDialog } from '../../src/components/alert-dialog';
import { Toast, useToast } from '../../src/components/toast';
import { AuraGlassProvider } from '../../src/theme';
import ButtonMeta from '../../src/components/button/Button.meta';
import IconButtonMeta from '../../src/components/icon-button/IconButton.meta';
import BadgeMeta from '../../src/components/badge/Badge.meta';
import TextMeta from '../../src/components/text/Text.meta';
import LinkMeta from '../../src/components/link/Link.meta';
import AlertMeta from '../../src/components/alert/Alert.meta';
import AlertDialogMeta from '../../src/components/alert-dialog/AlertDialog.meta';
import ToastMeta from '../../src/components/toast/Toast.meta';
import type { Intent } from '../../src/contracts/components';

const MATERIAL_ATTRS = ['data-ag-variant', 'data-ag-layer', 'data-ag-thickness', 'data-ag-prominent', 'data-ag-surface', 'data-ag-content'];

/** Material attributes of every element that carries any, in document order (portals included). Components
    without material (Badge, Text, Link) must stay at [] for every intent. */
const materialSnapshot = () =>
  [...document.body.querySelectorAll('*')]
    .filter((el) => MATERIAL_ATTRS.some((a) => el.hasAttribute(a)))
    .map((el) => `${el.getAttribute('data-ag-part') ?? el.tagName.toLowerCase()}:${MATERIAL_ATTRS.map((a) => el.getAttribute(a)).join('|')}`);

function ToastHost({ intent }: { intent?: Intent }) {
  const t = useToast();
  React.useEffect(() => { t.add({ title: 'Saved', timeout: 0, ...(intent ? { intent } : {}) } as never); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Toast.Viewport>
      {t.toasts.map((toast) => (
        <Toast.Root key={toast.id} toast={toast}><Toast.Title>{toast.title}</Toast.Title></Toast.Root>
      ))}
    </Toast.Viewport>
  );
}

type Case = { name: string; intents: readonly string[]; el: (intent?: string) => React.ReactElement };
const CASES: Case[] = [
  { name: 'Button', intents: ButtonMeta.variants.intent!, el: (i) => <Button {...(i ? { intent: i as never } : {})}>Go</Button> },
  { name: 'IconButton', intents: IconButtonMeta.variants.intent!, el: (i) => <IconButton label="Delete" icon={<span aria-hidden="true">x</span>} {...(i ? { intent: i as never } : {})} /> },
  { name: 'Badge', intents: BadgeMeta.variants.intent!, el: (i) => <Badge {...(i ? { intent: i as never } : {})}>3</Badge> },
  { name: 'Text', intents: TextMeta.variants.intent!, el: (i) => <Text {...(i ? { intent: i as never } : {})}>Body</Text> },
  { name: 'Link', intents: LinkMeta.variants.intent!, el: (i) => <Link href="/x" {...(i ? { intent: i as never } : {})}>Docs</Link> },
  { name: 'Alert', intents: AlertMeta.variants.intent!, el: (i) => <Alert title="Heads up" {...(i ? { intent: i as never } : {})}>Body</Alert> },
  {
    name: 'AlertDialog',
    intents: AlertDialogMeta.variants.intent!,
    el: (i) => (
      <AlertDialog.Root defaultOpen {...(i ? { intent: i as never } : {})}>
        <AlertDialog.Content>
          <AlertDialog.Title>Delete?</AlertDialog.Title>
          <AlertDialog.Description>It cannot be undone.</AlertDialog.Description>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action {...(i ? { intent: i as never } : {})}>Delete</AlertDialog.Action>
        </AlertDialog.Content>
      </AlertDialog.Root>
    ),
  },
  {
    name: 'Toast',
    intents: (ToastMeta.variants.intent ?? []).map((v) => (v === 'error' ? 'danger' : v)),
    el: (i) => <AuraGlassProvider><Toast.Provider><ToastHost {...(i ? { intent: i as Intent } : {})} /></Toast.Provider></AuraGlassProvider>,
  },
];

let warn: ReturnType<typeof jest.spyOn>;
beforeAll(() => { warn = jest.spyOn(console, 'warn').mockImplementation(() => {}); });
afterAll(() => warn.mockRestore());

describe('REQ-CMP-05: intent never changes material', () => {
  it('covers every CMP component that declares an intent variant', () => {
    expect(CASES.map((c) => c.name).sort()).toEqual(['Alert', 'AlertDialog', 'Badge', 'Button', 'IconButton', 'Link', 'Text', 'Toast']);
    for (const c of CASES) expect({ c: c.name, n: c.intents.length > 0 }).toEqual({ c: c.name, n: true });
  });

  for (const c of CASES) {
    it(`${c.name}: every intent value keeps the intent-less material attributes`, async () => {
      const base = render(c.el());
      await act(async () => {});
      const expected = materialSnapshot();
      base.unmount();
      for (const intent of c.intents) {
        const r = render(c.el(intent));
        await act(async () => {});
        expect({ intent, attrs: materialSnapshot() }).toEqual({ intent, attrs: expected });
        // the intent is applied (neutral is the default and may be omitted from the DOM)
        if (intent !== 'neutral') expect({ intent, applied: document.body.querySelector(`[data-ag-intent="${intent}"]`) !== null }).toEqual({ intent, applied: true });
        r.unmount();
      }
    });
  }
});
