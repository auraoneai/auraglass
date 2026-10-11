// fixtures.ts — deterministic sample data for ai-artifact-panel (no clocks, no randomness,
// no network — contract §3.3 file contract). Stories and showcases import it.
import type { Artifact } from './ArtifactPanel';

export const DOCUMENT_ARTIFACT: Artifact = {
  id: 'a-1', title: 'deploy-report.md', kind: 'document',
  content: 'Deploy window 04:12–04:19 UTC. No errors.', version: 3,
};

export const CODE_ARTIFACT: Artifact = {
  id: 'a-2', title: 'build.sh', kind: 'code', language: 'bash', content: 'npm ci\nnpm run build',
};
