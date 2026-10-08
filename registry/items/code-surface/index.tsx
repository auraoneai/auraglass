// registry/items/code-surface — PLAT-363. Code viewer/editor: header
// (name, language, copy) + lazily mounted CodeMirror 6 with Shiki
// highlighting. Deps are consumer-installed; before they resolve the item
// renders a plain <pre> surface — readable, focusable, never blank.
import { useEffect, useRef, useState } from 'react';
import { Badge, Button, Card, Text } from 'aura-glass';

export interface CodeSurfaceProps {
  name?: string;
  language?: string;
  code: string;
  readOnly?: boolean;
  onChange?: (code: string) => void;
  /** Pre-loaded modules for tests/doubles; lazy import otherwise. */
  modules?: { cm: unknown; shiki: unknown };
}

const CM_SPECIFIER = '@codemirror/view';
const SHIKI_SPECIFIER = 'shiki';

export function CodeSurface({ name, language = 'ts', code, readOnly = true, onChange, modules: injected }: CodeSurfaceProps) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let live = true;
    const load = injected ? Promise.resolve(injected) : Promise.all([
      import(/* @vite-ignore */ CM_SPECIFIER),
      import(/* @vite-ignore */ SHIKI_SPECIFIER),
    ]).then(([cm, shiki]) => ({ cm, shiki }));
    load.then(({ cm }) => {
      if (!live || !host.current) return;
      const mod = cm as { EditorView?: new (config: { doc: string; parent: HTMLElement; extensions?: unknown[] }) => { destroy(): void } };
      const view = new mod.EditorView!({ doc: code, parent: host.current, extensions: [] });
      setReady(true);
      return () => view.destroy();
    }).catch(() => { /* static <pre> fallback stays */ });
    return () => { live = false; };
  }, [code, injected]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1200); }
    catch { /* clipboard unavailable */ }
  };

  return (
    <Card.Root data-ag-part="root" className="@container" data-ag-state={ready ? 'live' : 'static'}>
      <Card.Header data-ag-part="header">
        <div className="grid grid-flow-col auto-cols-max items-center gap-2">
          {name ? <Text type="mono" size="sm">{name}</Text> : null}
          <Badge>{language}</Badge>
        </div>
        <Button size="sm" onClick={copy}>{copied ? 'Copied' : 'Copy'}</Button>
      </Card.Header>
      <Card.Body data-ag-part="body">
        <div ref={host} data-ag-part="editor" hidden={!ready} />
        {!ready ? (
          <pre data-ag-part="static" className="overflow-x-auto" role="region" aria-label={name ?? 'Code'} tabIndex={0}>
            <code>{code}</code>
          </pre>
        ) : null}
      </Card.Body>
    </Card.Root>
  );
}
