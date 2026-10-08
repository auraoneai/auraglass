// ai-workspace page (SURF-375, REQ-SURF-172/173): the owning-stream scaffold —
// W1 AppShell + Thread + Composer + inspector (AgentSteps, UsageMeter,
// ai-artifact-panel) wired with useAuraChat from the ai-sdk-adapter item.
'use client';
import * as React from 'react';
import { AppShell, TopBar, Inspector } from 'aura-glass/app-shell';
import { AgentSteps, Composer, ProviderErrorState, Thread, UsageMeter } from 'aura-glass/ai';
import { useAuraChat } from '../ai-sdk-adapter/useAuraChat';
import { ArtifactPanel, type Artifact } from '../ai-artifact-panel/ArtifactPanel';
import type { AgStep } from 'aura-glass/ai';

const INSPECTOR_STEPS: AgStep[] = [
  { id: 'plan', label: 'Plan response', state: 'succeeded', startedAt: 0, endedAt: 120 },
  { id: 'draft', label: 'Draft answer', state: 'succeeded', startedAt: 120, endedAt: 480 },
  { id: 'cite', label: 'Attach sources', state: 'running', startedAt: 480 },
];

export default function AiWorkspacePage() {
  const { threadProps, composerProps, status } = useAuraChat();
  const [artifact, setArtifact] = React.useState<Artifact | null>({
    id: 'a-1', title: 'deploy-report.md', kind: 'document',
    content: 'Deploy window 04:12–04:19 UTC. No errors.',
  });
  const errored = status === 'error';
  return (
    <AppShell.Root>
      <TopBar.Root>
        <strong>AI Workspace</strong>
        <UsageMeter usage={{ inputTokens: 1820, outputTokens: 640, contextWindow: 128000 }} />
      </TopBar.Root>
      <AppShell.Main>
        {errored ? (
          <ProviderErrorState kind="network" onRetry={() => window.location.reload()} />
        ) : null}
        <Thread messages={threadProps.messages} label="Assistant" />
        <Composer
          status={status}
          onSubmit={composerProps.onSubmit}
          {...(composerProps.onStop ? { onStop: composerProps.onStop } : {})}
        />
      </AppShell.Main>
      <Inspector.Root aria-label="Run inspector">
        <AgentSteps steps={INSPECTOR_STEPS} />
        <ArtifactPanel artifact={artifact} open={artifact != null} onOpenChange={(o: boolean) => { if (!o) setArtifact(null); }} />
      </Inspector.Root>
    </AppShell.Root>
  );
}
