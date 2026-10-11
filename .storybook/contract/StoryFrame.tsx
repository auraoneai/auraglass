/* REQ-QUAL-09 / REQ-QUAL-10 (FIN-449): the frame the preview's single decorator renders.
   AuraGlassProvider (props from the globals, no persistence; it applies the OS motion floor, D-11) →
   Environment (backdrop = SCENE_BACKDROP[scene], image /scenes/<file>) → StoryRoot (keyed per story). */
import * as React from 'react';
import type { StoryAgParameters, StoryKind } from '../../src/contracts/testing';
import type { AuraGlassProviderProps } from '../../src/contracts/preferences';
import { AuraGlassProvider, Environment } from '../../src/root/mat';
import { StoryRoot, STORY_KINDS } from './StoryRoot';
import { assertScene, paintBody, scenePaint } from './scene';

const useIsoLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

type Globals = Record<string, unknown>;

function storyKind(ag: Partial<StoryAgParameters> | undefined): StoryKind {
  const kind = ag?.kind ?? 'component';
  if (!STORY_KINDS.includes(kind)) throw new Error(`preview: parameters.ag.kind "${String(kind)}" is not a StoryKind`);
  return kind;
}

export function StoryFrame({ storyId, globals, ag, children }: {
  storyId: string; globals: Globals; ag?: Partial<StoryAgParameters> | undefined; children: React.ReactNode;
}): React.ReactElement {
  const kind = storyKind(ag);
  const paint = scenePaint(assertScene(globals.scene), kind);
  useIsoLayoutEffect(() => paintBody(document, paint.bodyImage), [paint.bodyImage]);
  const prefs = {
    scheme: globals.scheme, contrast: globals.contrast, transparency: globals.transparency,
    motion: globals.motion, density: globals.density, tier: globals.tier,
  } as Pick<AuraGlassProviderProps, 'scheme' | 'contrast' | 'transparency' | 'motion' | 'density' | 'tier'>;
  return (
    <AuraGlassProvider storage={null} {...prefs}>
      <Environment backdrop={paint.backdrop} {...(paint.envImage ? { image: paint.envImage } : {})}>
        <StoryRoot key={storyId} kind={kind} {...(paint.bodyImage ? { images: [paint.bodyImage] } : {})}>{children}</StoryRoot>
      </Environment>
    </AuraGlassProvider>
  );
}

