/**
 * Internal AI glyph set (SURF-295). Pure SVG path data — components render them
 * inside a 16×16 viewBox `aria-hidden` icon; accessible names come from the
 * owning control's label, never the icon itself.
 */

export type AiIconName =
  | 'send'
  | 'stop'
  | 'attach'
  | 'tool'
  | 'source'
  | 'copy'
  | 'regenerate'
  | 'thumbs-up'
  | 'thumbs-down'
  | 'check'
  | 'chevron'
  | 'mic';

export const AI_ICONS: Record<AiIconName, string> = {
  send: 'M2.01 21 23 12 2.01 3 2 10l15 2-15 2z',
  stop: 'M6 6h12v12H6z',
  attach: 'M16.5 6.5v11.2a4.7 4.7 0 0 1-9.4 0V5.8a3.1 3.1 0 0 1 6.2 0v10.4a1.6 1.6 0 0 1-3.1 0V6.5H8.7v9.7a2.6 2.6 0 0 0 5.2 0V5.8a4.1 4.1 0 0 0-8.2 0v11.9a5.7 5.7 0 0 0 11.4 0V6.5z',
  tool: 'M21.7 18.3 13 9.6a5.4 5.4 0 0 0-6.6-6.6l3.4 3.4-2.6 2.6-3.4-3.4A5.4 5.4 0 0 0 9.4 13l8.8 8.7a2.1 2.1 0 0 0 3-3z',
  source: 'M10 6 8.6 4.6 1.9 11.3a1.2 1.2 0 0 0 0 1.4l6.7 6.7L10 18l-5.6-5.7L10 6zm4 12 1.4 1.4 6.7-6.7a1.2 1.2 0 0 0 0-1.4l-6.7-6.7L14 6l5.6 5.7L14 18z',
  copy: 'M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z',
  regenerate: 'M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z',
  'thumbs-up': 'M1 21h4V9H1v12zM23 10a2 2 0 0 0-2-2h-6.3l.95-4.57a1.5 1.5 0 0 0-.47-1.5L14.4 1.15 7.6 7.95A2 2 0 0 0 7 9.4V19a2 2 0 0 0 2 2h9a2 2 0 0 0 1.8-1.1l3-7.1c.1-.2.2-.5.2-.8v-2z',
  'thumbs-down': 'M15 3H6a2 2 0 0 0-1.8 1.1l-3 7.1A2 2 0 0 0 1 12v2c0 1.1.9 2 2 2h6.3l-.95 4.57a1.5 1.5 0 0 0 .47 1.5l.78.78 6.8-6.8A2 2 0 0 0 17 14.6V5a2 2 0 0 0-2-2zm4 0v12h4V3h-4z',
  check: 'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z',
  chevron: 'M7.4 8.6 12 13.2l4.6-4.6L18 10l-6 6-6-6 1.4-1.4z',
  mic: 'M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1a7 7 0 0 0 6-6.9h-2z',
};

export { AiIcon } from './AiIcon';
export type { AiIconProps } from './AiIcon';
