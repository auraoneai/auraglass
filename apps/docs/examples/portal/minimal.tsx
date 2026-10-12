import { Portal } from 'aura-glass/primitives';
import { AuraGlassProvider } from 'aura-glass/theme';

export default function PortalMinimal() {
  return (
    <AuraGlassProvider>
      <Portal><div>Rendered at the end of the provider's portal root.</div></Portal>
    </AuraGlassProvider>
  );
}
