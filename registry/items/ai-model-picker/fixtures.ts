import type { ModelOption } from './ModelPicker';

/** Example loader: the consumer app exposes a route that proxies
 * Kiro Prism GET /v1/models server-side; this file groups the response by
 * provider prefix. No model ids are hard-coded in the component. */
export async function loadModels(fetcher: (url: string) => Promise<{ data: { id: string }[] }>): Promise<ModelOption[]> {
  const res = await fetcher('/api/models');
  return res.data.map((m) => ({
    id: m.id,
    label: m.id.split('/').pop() ?? m.id,
    provider: m.id.includes('/') ? m.id.split('/')[0]! : 'kiro-prism',
  }));
}

/** Story fixture only. */
export const MODELS: ModelOption[] = [
  { id: 'kiro-prism/aura-large', label: 'aura-large', provider: 'kiro-prism', capabilities: ['tools', 'vision'], contextWindow: 256000 },
  { id: 'kiro-prism/aura-small', label: 'aura-small', provider: 'kiro-prism', capabilities: ['tools'], contextWindow: 64000 },
];
