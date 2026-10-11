'use client';
/* REQ-SURF-135 — below 480 px Rate and PictureInPicture leave the row and
 * are offered in a CMP Menu "More" (rendered by Root when either part is
 * mounted). Hidden at ≥480 px and <320 px. */
import * as React from 'react';
import { Menu } from '../../../components/menu';
import { MoreHorizontalIcon } from '../../../icons/navigation/more-horizontal';
import { useMediaLayout, useMediaModel } from '../mediaContext';
import { RATES } from '../shortcuts';
import { formatRate } from './Rate';
import { MediaToolbarButton } from './ToolbarButton';

export function More() {
  const m = useMediaModel('More');
  const { size, parts } = useMediaLayout();
  if (size !== 'compact' || (parts.rate === 0 && parts.pip === 0)) return null;
  return (
    <Menu.Root>
      <Menu.Trigger
        render={<MediaToolbarButton data-ag-part="media-more" label="More" icon={<MoreHorizontalIcon />} />}
      />
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup aria-label="More media controls">
            {parts.rate > 0 ? (
              <Menu.RadioGroup value={String(m.playbackRate)} onValueChange={(v) => m.setRate(Number(v))}>
                {RATES.map((r) => (
                  <Menu.RadioItem key={r} value={String(r)}>{`Speed ${formatRate(r)}`}</Menu.RadioItem>
                ))}
              </Menu.RadioGroup>
            ) : null}
            {parts.rate > 0 && parts.pip > 0 ? <Menu.Separator /> : null}
            {parts.pip > 0 ? (
              <Menu.Item onClick={() => m.requestPictureInPicture()}>Picture in picture</Menu.Item>
            ) : null}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
