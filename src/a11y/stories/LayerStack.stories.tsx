/* MAT-296: A11y/LayerStack — a manually stacked Dialog -> Popover -> Tooltip ->
   Toast tower driven through useLayer so Escape order, focus restore and
   inert/aria-modal behaviour are visible. The spec's "one portal root" case
   runs on this story remotely. */
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useLayer } from '../../theme/layers/useLayer';
import { AuraGlassProvider } from '../../theme/AuraGlassProvider';
import type { StoryAgParameters } from '../../contracts/testing';

const KIND_LABEL: Record<string, string> = {
  dialog: 'Dialog', popover: 'Popover', tooltip: 'Tooltip', toast: 'Toast',
};

function Layer({ kind, open, modal, onEscape, children }: {
  kind: 'dialog' | 'popover' | 'tooltip' | 'toast';
  open: boolean; modal: boolean; onEscape: () => void; children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { isTop } = useLayer({ kind, modal, open, onEscape, element: ref.current });
  return open ? (
    <div
      ref={ref}
      role={kind === 'dialog' ? 'dialog' : undefined}
      aria-modal={kind === 'dialog' && modal ? true : undefined}
      data-ag-part={kind}
      data-top={isTop || undefined}
      tabIndex={-1}
      style={{
        position: 'fixed', inset: 'auto 16px auto auto',
        top: `${40 + (['dialog', 'popover', 'tooltip', 'toast'].indexOf(kind)) * 48}px`,
        padding: 12, minWidth: 220, zIndex: 400,
      }}
      data-ag-surface=""
      data-ag-variant="raised"
    >
      <b>{KIND_LABEL[kind]}</b> {modal ? '(modal)' : ''} — Esc closes topmost only
      <div>{children}</div>
    </div>
  ) : null;
}

function Tower() {
  const [open, setOpen] = React.useState({ dialog: false, popover: false, tooltip: false, toast: false });
  const close = (k: keyof typeof open) => setOpen((s) => ({ ...s, [k]: false }));
  return (
    <div style={{ padding: 16 }}>
      <p>Open all four, then press Escape three times: Toast/tooltip closes first,
        popover next, dialog last, and focus returns to each trigger.</p>
      {(['dialog', 'popover', 'tooltip', 'toast'] as const).map((k) => (
        <button key={k} type="button" data-ag-part="trigger" data-kind={k}
          onClick={() => setOpen((s) => ({ ...s, [k]: !s[k] }))}>
          {open[k] ? 'Close' : 'Open'} {KIND_LABEL[k]}
        </button>
      ))}
      <Layer kind="dialog" modal open={open.dialog} onEscape={() => close('dialog')}>
        <input placeholder="focusable in dialog" />
      </Layer>
      <Layer kind="popover" modal={false} open={open.popover} onEscape={() => close('popover')}>
        <button type="button">popover action</button>
      </Layer>
      <Layer kind="tooltip" modal={false} open={open.tooltip} onEscape={() => close('tooltip')}>
        tooltip text
      </Layer>
      <Layer kind="toast" modal={false} open={open.toast} onEscape={() => close('toast')}>
        toast message <button type="button">Undo</button>
      </Layer>
      <p><a href="#inert-probe">inert probe link in the background</a></p>
    </div>
  );
}

const meta: Meta = {
  title: 'A11y/LayerStack',
  component: Tower,
  decorators: [(Story) => <AuraGlassProvider><Story /></AuraGlassProvider>],
  parameters: {
    layout: 'fullscreen',
    ag: { subject: 'A11yLayerStack', kind: 'component', tags: ['apg'] } satisfies StoryAgParameters & Record<string, unknown>,
  },
};
export default meta;

export const Default: StoryObj = {};
