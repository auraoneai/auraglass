'use client';
import * as React from 'react';
import type { AgPart } from './types';

export type AgPartRenderer = (part: AgPart) => React.ReactNode;
export type AgTextRenderer = (text: string, opts: { streaming?: boolean | undefined }) => React.ReactNode;
export interface AgApprovalResponse {
  approvalId: string;
  toolCallId: string;
  approved: boolean;
  reason?: string | undefined;
}

export interface AiRenderers {
  /** Per-part-type overrides, e.g. 'data-artifact' or 'text'. */
  renderers?: Record<string, AgPartRenderer | undefined>;
  /** Default text renderer (e.g. the ai-markdown registry item). */
  renderText?: AgTextRenderer;
  /** Approval callback threaded to every ToolCall under this provider. */
  onApprovalResponse?: ((detail: AgApprovalResponse) => void) | undefined;
}

const RenderersContext = React.createContext<AiRenderers>({});

export function AiRenderersProvider(props: AiRenderers & { children?: React.ReactNode }) {
  const { renderers, renderText, onApprovalResponse, children } = props;
  const value = React.useMemo<AiRenderers>(
    () => ({
      ...(renderers ? { renderers } : {}),
      ...(renderText ? { renderText } : {}),
      ...(onApprovalResponse ? { onApprovalResponse } : {}),
    }),
    [renderers, renderText, onApprovalResponse],
  );
  return <RenderersContext.Provider value={value}>{children}</RenderersContext.Provider>;
}

export function useAiRenderers(): AiRenderers {
  return React.useContext(RenderersContext);
}
