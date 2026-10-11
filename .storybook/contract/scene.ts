/* REQ-QUAL-09 / REQ-QUAL-10 (FIN-449): how the preview paints the `scene` global.
   The declared backdrop is always SCENE_BACKDROP[scene] (S-42). Media scenes are painted by
   Environment's backdrop image; scenes whose backdrop is not `media` (Environment renders no image
   for them) and stories of kind `scene` are painted by the <body> background, cover/center. */
import manifest from '../../certification/scenes/scenes.manifest.json';
import { SCENES, SCENE_ASSETS, SCENE_BACKDROP } from '../../src/contracts/testing';
import type { SceneId, StoryKind } from '../../src/contracts/testing';
import type { Backdrop } from '../../src/contracts/material';

type ManifestEntry = { id?: string; file?: string };

/** File name for a scene: the manifest's `file` (keyed by id, or in a `scenes` array), else `<id>.jpg`. */
export function sceneFile(id: SceneId, m: unknown = manifest): string {
  const rec = (m ?? {}) as Record<string, unknown> & { scenes?: ManifestEntry[] };
  const keyed = rec[id] as ManifestEntry | undefined;
  const listed = Array.isArray(rec.scenes) ? rec.scenes.find((s) => s.id === id) : undefined;
  return keyed?.file ?? listed?.file ?? `${id}.jpg`;
}

export function sceneUrl(id: SceneId, m?: unknown): string {
  return `${SCENE_ASSETS.storybookStaticPath}/${sceneFile(id, m)}`;
}

export function assertScene(value: unknown): SceneId {
  if (!(SCENES as readonly unknown[]).includes(value)) throw new Error(`preview: unknown scene global "${String(value)}"`);
  return value as SceneId;
}

export interface ScenePaint { backdrop: Backdrop; envImage?: string; bodyImage?: string }

export function scenePaint(scene: SceneId, kind: StoryKind, m?: unknown): ScenePaint {
  const backdrop = SCENE_BACKDROP[scene];
  const url = sceneUrl(scene, m);
  if (kind === 'scene' || backdrop !== 'media') return { backdrop, bodyImage: url };
  return { backdrop, envImage: url };
}

/** Writes the body background for body-painted scenes and clears it otherwise; returns the cleanup. */
export function paintBody(doc: Document, bodyImage: string | undefined): () => void {
  const s = doc.body.style;
  const prev = { backgroundImage: s.backgroundImage, backgroundSize: s.backgroundSize,
    backgroundPosition: s.backgroundPosition, backgroundRepeat: s.backgroundRepeat, backgroundAttachment: s.backgroundAttachment, backgroundColor: s.backgroundColor };
  s.backgroundColor = 'transparent';
  s.backgroundImage = bodyImage ? `url("${bodyImage}")` : 'none';
  s.backgroundSize = bodyImage ? 'cover' : '';
  s.backgroundPosition = bodyImage ? 'center' : '';
  s.backgroundRepeat = bodyImage ? 'no-repeat' : '';
  s.backgroundAttachment = bodyImage ? 'fixed' : '';
  return () => { Object.assign(s, prev); };
}
