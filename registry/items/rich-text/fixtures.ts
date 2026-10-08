// fixtures.ts — deterministic rich-text content (contract §3.3).
import type { RichTextProps } from './index';

export const richTextProps: RichTextProps = {
  content: '<p>Release notes draft: registry pipeline landed; docs site next.</p>',
};

export const richTextEmpty: RichTextProps = {
  content: '<p></p>',
};
