// TODO(aura-glass 5): AuraGlassProvider preview: preview="v5" is unnecessary in 5.0; drop the prop, see docs/auraglass-5/migrate/5.md#b-6
import { AuraGlassProvider } from 'aura-glass/theme';
export const x = <AuraGlassProvider theme={t}><App/></AuraGlassProvider>;
