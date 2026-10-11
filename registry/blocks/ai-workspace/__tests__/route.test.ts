/** @jest-environment node */
// SURF-376/378 — source assertions over the interim Prism route
// (ci/surf/ai-sdk/ai-workspace/app/api/chat/route.ts; moves to
// registry/blocks/ai-workspace/app/api/chat/ with SURF-390). Behavioural
// coverage (503/413/429/model resolution) lives in
// ci/surf/ai-sdk/ai-workspace-route.test.ts which runs under the harness.

import { describe, expect, it } from '@jest/globals';
import * as fs from 'node:fs';
import * as path from 'node:path';

const ROUTE = path.join(__dirname, '..', '..', '..', '..', 'ci', 'surf', 'ai-sdk', 'ai-workspace', 'app', 'api', 'chat', 'route.ts');
const src = fs.readFileSync(ROUTE, 'utf8');

describe('ai-workspace route source (SURF-376)', () => {
  it('targets Kiro Prism over the OpenAI-compatible protocol', () => {
    expect(src).toContain("createOpenAICompatible");
    expect(src).toContain('prism.auraone.ai/v1');
    expect(src).toContain("'kiro-prism'");
    expect(src).toContain('PRISM_API_KEY');
  });
  it('has every guard: 503 auth, 413 size, 429 bucket, model resolution', () => {
    expect(src).toContain('413');
    expect(src).toContain('429');
    expect(src).toContain('503');
    expect(src).toContain('Retry-After');
    expect(src).toContain('PRISM_MODEL');
    expect(src).toContain('/v1/models');
  });
  it('contains no literal provider key and no NEXT_PUBLIC_ var', () => {
    expect(src).not.toMatch(/sk-[A-Za-z0-9]/);
    expect(src).not.toContain('NEXT_PUBLIC_');
  });
  it('never imports from aura-glass internals', () => {
    expect(src).not.toMatch(/from ['"]\.\.\/\.\.\/\.\.\/\.\.\/src\//);
  });
});
