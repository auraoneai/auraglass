/* Media glyphs: the library icon set at the media control size, so every media
 * button draws the same stroke icon instead of a unicode/emoji character.
 * Decorative (aria-hidden) — the owning button carries the accessible name. */
import * as React from 'react';
import { PlayIcon } from '../icons/media/play';
import { PauseIcon } from '../icons/action/pause';
import { SkipBackIcon } from '../icons/action/skip-back';
import { SkipForwardIcon } from '../icons/action/skip-forward';
import { Volume2Icon } from '../icons/action/volume-2';
import { VolumeXIcon } from '../icons/action/volume-x';
import { MaximizeIcon } from '../icons/action/maximize';
import { ZoomInIcon } from '../icons/action/zoom-in';
import { ZoomOutIcon } from '../icons/action/zoom-out';
import { XIcon } from '../icons/action/x';
import { ChevronLeftIcon } from '../icons/navigation/chevron-left';
import { ChevronRightIcon } from '../icons/navigation/chevron-right';
import { ChevronUpIcon } from '../icons/navigation/chevron-up';
import { ChevronDownIcon } from '../icons/navigation/chevron-down';

const GLYPHS = {
  play: PlayIcon,
  pause: PauseIcon,
  previous: SkipBackIcon,
  next: SkipForwardIcon,
  volume: Volume2Icon,
  muted: VolumeXIcon,
  fullscreen: MaximizeIcon,
  'zoom-in': ZoomInIcon,
  'zoom-out': ZoomOutIcon,
  close: XIcon,
  'chevron-left': ChevronLeftIcon,
  'chevron-right': ChevronRightIcon,
  'chevron-up': ChevronUpIcon,
  'chevron-down': ChevronDownIcon,
} as const;

export type MediaGlyphName = keyof typeof GLYPHS;

export function MediaGlyph({ name, size = 18 }: { name: MediaGlyphName; size?: number }): React.ReactElement {
  const Icon = GLYPHS[name];
  return <Icon size={size} strokeWidth={2} data-ag-part="media-glyph" />;
}
