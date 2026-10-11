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
  /** Renders code bodies — pass the installed code-surface item, e.g.
   * `renderCode={(code, language) => <CodeSurface code={code} language={language} />}`.
   * Without it, code renders in a plain `<pre>`. */
  renderCode?: ((code: string, language: string | undefined) => React.ReactNode) | undefined;
}

function PlainCode({ code, language }: { code: string; language: string | undefined }) {
  return <pre data-ag-part="artifact-code"><code data-language={language}>{code}</code></pre>;
}

/** ai-artifact-panel (SURF-371, REQ-SURF-173): artifact panel on the W1
 * ResizablePanels + Tabs (Preview / Code) on a content-raised Surface. Code
 * bodies go through the `renderCode` slot (code-surface stays a
 * registryDependency); the item never imports another item at runtime. */
export function ArtifactPanel({ artifact, open = true, onOpenChange, onCopy, renderCode }: ArtifactPanelProps) {
  if (!open || !artifact) return null;
  const isCode = artifact.kind === 'code';
  const code = renderCode
    ? <div data-ag-part="artifact-code">{renderCode(artifact.content, artifact.language)}</div>
    : <PlainCode code={artifact.content} language={artifact.language} />;
  const body = (
    <div data-ag-part="artifact-body">
      {isCode ? (
        code
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
                <PlainCode code={artifact.content} language={artifact.language} />
              </Tabs.Panel>
            </Tabs.Root>
          ) : body}
        </aside>
      </ResizablePanels.Panel>
    </ResizablePanels.Root>
  );
}
