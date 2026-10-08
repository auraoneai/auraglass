import { createIcon } from '../createIcon';
import type { IconNode } from '../types';

const play: IconNode[] = [["path", { d: "m8 5 12 7-12 7Z" }]];

export const PlayIcon = /*#__PURE__*/ createIcon('Play', play);
export const MediaIcon = /*#__PURE__*/ PlayIcon;
