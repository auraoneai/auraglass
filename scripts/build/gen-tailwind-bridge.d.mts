/** Canonical Tailwind bridge shared by token and package builds. */
export interface BridgeManifest {
  tokens?: readonly { cssVar?: string; cssvar?: string; type?: string; tier?: string }[];
}
export function buildBridge(manifest: BridgeManifest, materialSpec?: unknown): string;
