'use client';
import * as React from 'react';
import { ResizablePanels } from 'aura-glass/app-shell';
import { Tabs } from 'aura-glass';

export interface Artifact {
  id: string;
  title: string;
  kind: 'code' | 'document' | 'preview' | 'data';
  content: string;
  language?: string;
  version?: number;
}

export interface ArtifactPanelProps {
  artifact: Artifact | null;
  open?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  onCopy?: ((artifact: Artifact) => void) | undefined;
}

/** The code-surface registry item renders code bodies when the consumer has
 * installed it; this lazy wrapper falls back to a plain <pre>. */
const CodeSurface = React.lazy(async () => {
  const mod = await import('@/registry/items/code-surface' as string).catch(() => null);
  const C = (mod as Record<string, React.ComponentType<{ code: string; language?: string }>> | null)?.CodeSurface;
  return { default: C ?? ((p: { code: string }) => <pre data-ag-part="artifact-code"><code>{p.code}</code></pre>) };
});

/** ai-artifact-panel (SURF-371, REQ-SURF-173): artifact panel on the W1
 * ResizablePanels + Tabs (Preview / Code) with a lazy code-surface body on a
 * content-raised Surface. */
export function ArtifactPanel({ artifact, open = true, onOpenChange, onCopy }: ArtifactPanelProps) {
  if (!open || !artifact) return null;
  const isCode = artifact.kind === 'code';
  const body = (
    <div data-ag-part="artifact-body">
      {isCode ? (
        <React.Suspense fallback={<pre data-ag-part="artifact-code"><code>{artifact.content}</code></pre>}>
          <CodeSurface code={artifact.content} language={artifact.language} />
        </React.Suspense>
      ) : artifact.kind === 'preview' ? (
        <iframe title={artifact.title} sandbox="" srcDoc={artifact.content} data-ag-part="artifact-preview" />
      ) : artifact.kind === 'data' ? (
        <pre data-ag-part="artifact-data">{artifact.content}</pre>
      ) : (
        <article data-ag-part="artifact-document">{artifact.content}</article>
      )}
    </div>
  );
  return (
    <ResizablePanels.Root orientation="horizontal" style={{ minBlockSize: '100%' }}>
      <ResizablePanels.Panel id="artifact" defaultSize={60} label={artifact.title}>
        <aside data-ag-part="artifact-panel" aria-label={artifact.title} data-surface="content-raised">
          <header data-ag-part="artifact-header">
            <h2>{artifact.title}</h2>
            {artifact.version !== undefined ? <span data-ag-part="artifact-version">v{artifact.version}</span> : null}
            {onCopy ? <button type="button" onClick={() => onCopy(artifact)}>Copy</button> : null}
            {onOpenChange ? (
              <button type="button" aria-label="Close artifact panel" onClick={() => onOpenChange(false)}>Close</button>
            ) : null}
          </header>
          {isCode ? (
            <Tabs.Root defaultValue="preview">
              <Tabs.List>
                <Tabs.Tab value="preview">Preview</Tabs.Tab>
                <Tabs.Tab value="code">Code</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="preview">{body}</Tabs.Panel>
              <Tabs.Panel value="code">
                <pre data-ag-part="artifact-code"><code data-language={artifact.language}>{artifact.content}</code></pre>
              </Tabs.Panel>
            </Tabs.Root>
          ) : body}
        </aside>
      </ResizablePanels.Panel>
    </ResizablePanels.Root>
  );
}
