import type { AgMessage } from './types';

/**
 * Joins the `text` parts of a message in order with a blank line, excluding
 * reasoning, tool, source and file parts (REQ-SURF-114 `Message.getText`).
 */
export function getMessageText(message: AgMessage): string {
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('\n\n');
}
