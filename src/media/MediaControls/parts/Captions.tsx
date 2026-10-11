'use client';
/* REQ-SURF-134/138 — Captions: nothing with 0 captions|subtitles tracks; a
 * toggle (aria-pressed) between showing/disabled with exactly 1; a CMP Menu
 * listing "Off" + every track with >1. */
import * as React from 'react';
import { Menu } from '../../../components/menu';
import { useMediaLayout, useMediaModel } from '../mediaContext';
import { MediaToolbarButton } from './ToolbarButton';

const OFF = '__off__';

function CaptionsGlyph() {
  return <span aria-hidden="true" className="ag-media-captions-glyph">CC</span>;
}

export function Captions({ className, ref }: { className?: string | undefined; ref?: React.Ref<HTMLButtonElement> | undefined }) {
  const m = useMediaModel('Captions');
  const { size } = useMediaLayout();
  const tracks = m.captionTracks;
  if (tracks.length === 0 || size === 'minimal') return null;
  const showing = tracks.find((t) => t.mode === 'showing');

  if (tracks.length === 1) {
    return (
      <MediaToolbarButton
        ref={ref}
        className={className}
        data-ag-part="media-captions"
        label="Captions"
        aria-pressed={!!showing}
        icon={<CaptionsGlyph />}
        onClick={() => m.toggleCaptions()}
      />
    );
  }

  return (
    <Menu.Root>
      <Menu.Trigger
        render={
          <MediaToolbarButton
            ref={ref}
            className={className}
            data-ag-part="media-captions"
            label="Captions"
            icon={<CaptionsGlyph />}
          />
        }
      />
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup aria-label="Captions">
            <Menu.RadioGroup
              value={showing?.id ?? OFF}
              onValueChange={(v) => m.selectCaptions(v === OFF ? null : v)}
            >
              <Menu.RadioItem value={OFF}>Off</Menu.RadioItem>
              {tracks.map((t) => (
                <Menu.RadioItem key={t.id} value={t.id}>{t.label || t.language || t.id}</Menu.RadioItem>
              ))}
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
