import { ProviderErrorState } from 'aura-glass/ai';

export default function ProviderErrorStateMinimal() {
  return <ProviderErrorState kind="rate-limit" retryAfterMs={5000} onRetry={() => {}} />;
}
