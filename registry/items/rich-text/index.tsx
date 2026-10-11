// registry/items/rich-text — PLAT-364. Tiptap editor card: toolbar on the
// CMP Toolbar grammar (bold/italic/lists) + a lazily mounted editor.
// Before the consumer-installed engine resolves, content renders read-only.
import { useEffect, useRef, useState } from 'react';
import { Card, Text, Toolbar } from 'aura-glass';

export interface RichTextProps {
  /** Initial HTML or plain-text content. */
  content: string;
  onChange?: (html: string) => void;
  readOnly?: boolean;
  /** Pre-loaded tiptap modules for tests/doubles. */
  modules?: { core: unknown; starterKit: unknown };
}

const TIPTAP_SPECIFIER = '@tiptap/core';
const STARTER_SPECIFIER = '@tiptap/starter-kit';

export function RichText({ content, onChange, readOnly = false, modules: injected }: RichTextProps) {
  const host = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<{ commands: Record<string, () => unknown>; chain(): Record<string, () => unknown> } | null>(null);

  useEffect(() => {
    let live = true;
    const load = injected
      ? Promise.resolve(injected)
      : Promise.all([import(/* @vite-ignore */ TIPTAP_SPECIFIER), import(/* @vite-ignore */ STARTER_SPECIFIER)])
        .then(([core, starterKit]) => ({ core, starterKit }));
    load.then(({ core, starterKit }) => {
      if (!live || !host.current) return;
      const mod = core as { Editor?: new (config: { element: HTMLElement; extensions: unknown[]; content: string; editable: boolean; onUpdate?: (e: { editor: { getHTML(): string } }) => void }) => { destroy(): void } };
      const sk = starterKit as { default?: unknown; StarterKit?: unknown };
      const ed = new mod.Editor!({
        element: host.current,
        extensions: [sk.default ?? sk.StarterKit],
        content,
        editable: !readOnly,
        onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
      });
      setEditor(ed as never);
      return () => ed.destroy();
    }).catch(() => { /* static fallback stays */ });
    return () => { live = false; };
  }, [content, readOnly, injected, onChange]);

  const cmd = (name: string) => () => {
    const chain = (editor as { chain?: () => Record<string, () => { run(): void }> } | null)?.chain?.();
    chain?.[name]?.()?.run?.();
  };

  return (
    <Card.Root data-ag-part="root" className="@container" data-ag-state={editor ? 'live' : 'static'}>
      {editor ? (
        <Toolbar.Root data-ag-part="toolbar" aria-label="Formatting">
          <Toolbar.Button onClick={cmd('toggleBold')}>Bold</Toolbar.Button>
          <Toolbar.Button onClick={cmd('toggleItalic')}>Italic</Toolbar.Button>
          <Toolbar.Separator />
          <Toolbar.Button onClick={cmd('toggleBulletList')}>List</Toolbar.Button>
        </Toolbar.Root>
      ) : null}
      <Card.Body data-ag-part="body">
        <div ref={host} data-ag-part="editor" hidden={!editor} />
        {!editor ? <div data-ag-part="static" className="prose" dangerouslySetInnerHTML={{ __html: content }} /> : null}
      </Card.Body>
      <Card.Footer data-ag-part="footer">
        <Text size="sm" muted>{editor ? 'Editing' : 'Preview'}</Text>
      </Card.Footer>
    </Card.Root>
  );
}
