/* media-workspace showcase (REQ-QUAL-58, tier S1, default scene video-frame).
   Composes registry/blocks/media-viewer (contract §3.3) as the review stage, with
   the clear-over-media controls, an approved-stills ImageViewer, a select rail,
   a grading popover and the shot inspector Sheet around it. */
import * as React from 'react';
import { Button, Popover, Sheet, Slider, Toolbar } from 'aura-glass';
import { AppShell } from 'aura-glass/app-shell';
import { CarouselRail, ImageViewer, MediaControls, NowPlayingBar } from 'aura-glass/media';
import { InfoIcon, MaximizeIcon, PaletteIcon, Share2Icon } from 'aura-glass/icons';
import { MediaViewer } from '../../registry/blocks/media-viewer/index';
import { COPY, SHOT_FIELDS, SHOWCASE_EPOCH, STILLS, VIDEO_SRC } from './copy';
import styles from './media-workspace.module.css';

export interface MediaWorkspaceProps {
  /** Fixed epoch (REQ-QUAL-59 determinism); the review due date derives from it. */
  now?: number;
}

/** Fragment: the canonical `clear` controls over media. */
export function MediaWorkspaceClearControls() {
  const [playing, setPlaying] = React.useState(false);
  const [time, setTime] = React.useState(41);
  return (
    <section className={styles.overMedia} aria-label="Playback controls over the frame">
      <img className={styles.frame} src={STILLS[0]!.src} alt={STILLS[0]!.alt} width={1280} height={720} />
      <div className={styles.controlsDock}>
        <MediaControls.Root
          variant="clear"
          label="Reel 3 playback"
          playing={playing}
          currentTime={time}
          duration={2472}
          volume={0.8}
          onPlayingChange={setPlaying}
          onSeek={setTime}
        >
          <MediaControls.PlayButton />
          <MediaControls.Scrubber />
          <MediaControls.Time />
          <MediaControls.Spacer />
          <MediaControls.Volume />
          <MediaControls.Rate />
          <MediaControls.Fullscreen />
        </MediaControls.Root>
      </div>
    </section>
  );
}

/** Fragment: the shot inspector as a docked Sheet. */
export function MediaWorkspaceInspectorSheet({ defaultOpen = true }: { defaultOpen?: boolean }) {
  return (
    <Sheet.Root side="end" modal={false} defaultOpen={defaultOpen}>
      <Sheet.Trigger render={<Button startIcon={<InfoIcon />} />}>{COPY.inspectorTitle}</Sheet.Trigger>
      <Sheet.Portal>
        <Sheet.Popup>
          <Sheet.Header>
            <Sheet.Title>{COPY.inspectorTitle}</Sheet.Title>
          </Sheet.Header>
          <Sheet.Body>
            <dl className={styles.facts}>
              {SHOT_FIELDS.map((f) => (
                <div key={f.label} className={styles.fact}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
            <h3>{COPY.notesTitle}</h3>
            <p>{COPY.notesBody}</p>
          </Sheet.Body>
          <Sheet.Footer>
            <Sheet.Close>Close</Sheet.Close>
          </Sheet.Footer>
        </Sheet.Popup>
      </Sheet.Portal>
    </Sheet.Root>
  );
}

function GradePopover() {
  return (
    <Popover.Root>
      <Popover.Trigger render={<Toolbar.IconButton label="Grade" icon={<PaletteIcon />} />} />
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup>
            <Popover.Title>Quick grade</Popover.Title>
            <div className={styles.sliders}>
              <Slider.Root aria-label={COPY.gradeLabel} defaultValue={33} min={-100} max={100} />
              <Slider.Root aria-label={COPY.saturationLabel} defaultValue={90} min={0} max={200} />
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function MediaWorkspace({ now = SHOWCASE_EPOCH }: MediaWorkspaceProps) {
  const due = new Date(now + 4 * 86_400_000).toISOString().slice(0, 10);
  const slides = STILLS.map((s) => ({
    id: s.id,
    label: s.caption,
    children: <img className={styles.slide} src={s.src} alt={s.alt} width={s.width} height={s.height} />,
  }));
  return (
    <>
      <AppShell.SkipLink href="#media-review">{COPY.skip}</AppShell.SkipLink>
      <div className={styles.page}>
        <header className={styles.header}>
          {/* The page <h1> and <main> come from the media-viewer block below. */}
          <p>{COPY.subtitle} ({due})</p>
          <Toolbar.Root aria-label={COPY.toolbarLabel}>
            <GradePopover />
            <Toolbar.IconButton label="Share review link" icon={<Share2Icon />} />
            <Toolbar.IconButton label="Fit to window" icon={<MaximizeIcon />} />
            <Toolbar.Separator />
            <Toolbar.Button>Approve take</Toolbar.Button>
          </Toolbar.Root>
        </header>
        <div id="media-review" className={styles.stage}>
          <MediaViewer src={VIDEO_SRC} title={COPY.title} />
        </div>
        <section className={styles.section} aria-labelledby="mw-stills-heading">
          <h2 id="mw-stills-heading">{COPY.stillsLabel}</h2>
          <ImageViewer.Root items={STILLS}>
            <ul className={styles.thumbs}>
              {STILLS.map((s) => (
                <li key={s.id}>
                  <ImageViewer.Trigger id={s.id}>
                    <img className={styles.thumb} src={s.src} alt={s.alt} width={320} height={180} />
                  </ImageViewer.Trigger>
                </li>
              ))}
            </ul>
            <ImageViewer.Popup>
              <ImageViewer.Toolbar />
              <ImageViewer.Caption />
              <ImageViewer.Prev />
              <ImageViewer.Next />
              <ImageViewer.Counter />
              <ImageViewer.Close />
            </ImageViewer.Popup>
          </ImageViewer.Root>
        </section>
        <section className={styles.section} aria-labelledby="mw-rail-heading">
          <h2 id="mw-rail-heading">{COPY.carouselLabel}</h2>
          <CarouselRail.Root label={COPY.carouselLabel} slides={slides} slidesPerView={2} overMedia />
        </section>
        <MediaWorkspaceClearControls />
        <MediaWorkspaceInspectorSheet defaultOpen={false} />
        <NowPlayingBar.Root playing={false} progress={0.27} artwork={STILLS[0]!.src}>
          <NowPlayingBar.Artwork />
          <NowPlayingBar.Title>{COPY.nowPlayingTitle}</NowPlayingBar.Title>
          <NowPlayingBar.Subtitle>{COPY.nowPlayingSubtitle}</NowPlayingBar.Subtitle>
          <NowPlayingBar.Actions />
          <NowPlayingBar.Progress />
        </NowPlayingBar.Root>
      </div>
    </>
  );
}
