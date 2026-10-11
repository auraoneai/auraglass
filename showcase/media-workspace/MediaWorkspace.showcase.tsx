/* media-workspace showcase (REQ-QUAL-58, tier S1, default scene video-frame).
   Composes registry/blocks/media-viewer (contract §3.3) as the review stage, with
   the clear-over-media controls, an approved-stills ImageViewer, a select rail,
   a grading popover and the shot inspector Sheet around it.
   Material roles: one chrome TopBar (its toolbar is identity — no glass inside
   glass), the playback controls and the now-playing bar are chrome; the stills
   and selects panels are content-raised; the inspector is an overlay Sheet. */
import * as React from 'react';
import { Button, DescriptionList, Heading, IconButton, Popover, Sheet, Slider, Surface, Text, Toolbar } from 'aura-glass';
import { AppShell, TopBar } from 'aura-glass/app-shell';
import { Backdrop } from 'aura-glass/backdrops';
import { CarouselRail, ImageViewer, MediaControls, NowPlayingBar } from 'aura-glass/media';
import { InfoIcon, MaximizeIcon, PaletteIcon, Share2Icon } from 'aura-glass/icons';
import { MediaViewer } from '../../registry/blocks/media-viewer/index';
import { COPY, SHOT_FIELDS, SHOT_LOG, SHOT_LOG_COLUMNS, SHOWCASE_EPOCH, STILLS, VIDEO_SRC } from './copy';
import styles from './media-workspace.module.css';

export interface MediaWorkspaceProps {
  /** Fixed epoch (REQ-QUAL-59 determinism); the review due date derives from it. */
  now?: number;
}

/** Fragment: the canonical `clear` controls over media (a declared media backdrop). */
export function MediaWorkspaceClearControls() {
  const [playing, setPlaying] = React.useState(false);
  const [time, setTime] = React.useState(41);
  return (
    <section className={styles.overMediaSection} aria-label="Playback controls over the frame">
      <Backdrop preset="photo" src={STILLS[0]!.src} mediaTone="dark" className={styles.overMedia} data-ag-radius="xl">
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
            <MediaControls.Volume />
            <MediaControls.Rate />
            <MediaControls.Fullscreen />
          </MediaControls.Root>
        </div>
      </Backdrop>
    </section>
  );
}

/** Fragment: the shot inspector as a docked Sheet. */
export function MediaWorkspaceInspectorSheet({ defaultOpen = true }: { defaultOpen?: boolean }) {
  return (
    <Sheet.Root side="end" modal={false} defaultOpen={defaultOpen}>
      <Sheet.Trigger render={<Button startIcon={<InfoIcon />} />}>{COPY.inspectorTitle}</Sheet.Trigger>

        <Sheet.Content backdrop={false}>
          <Sheet.Header>
            <Sheet.Title>{COPY.inspectorTitle}</Sheet.Title>
          </Sheet.Header>
          <Sheet.Body>
            <div className={styles.sheetBody}>
              <DescriptionList layout="inline">
                {SHOT_FIELDS.map((f) => (
                  <DescriptionList.Item key={f.label}>
                    <DescriptionList.Term>{f.label}</DescriptionList.Term>
                    <DescriptionList.Details>{f.value}</DescriptionList.Details>
                  </DescriptionList.Item>
                ))}
              </DescriptionList>
              <Heading level={3} size="sm">{COPY.notesTitle}</Heading>
              <Text type="callout">{COPY.notesBody}</Text>
            </div>
          </Sheet.Body>
          <Sheet.Footer>
            <Sheet.Close>Close</Sheet.Close>
          </Sheet.Footer>
        </Sheet.Content>

    </Sheet.Root>
  );
}

function GradePopover() {
  return (
    <Popover.Root>
      <Popover.Trigger render={<Toolbar.Button render={<IconButton label="Grade" icon={<PaletteIcon />} />} />} />


          <Popover.Content>
            <Popover.Title>Quick grade</Popover.Title>
            <div className={styles.sliders}>
              <Text type="label">{COPY.gradeLabel}</Text>
              <Slider.Root aria-label={COPY.gradeLabel} defaultValue={33} min={-100} max={100} />
              <Text type="label">{COPY.saturationLabel}</Text>
              <Slider.Root aria-label={COPY.saturationLabel} defaultValue={90} min={0} max={200} />
            </div>
          </Popover.Content>


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
        <TopBar.Root className={styles.topBar} scrollEdge="none">
          <TopBar.Leading className={styles.topBarLeading}>
            <Text type="label" weight="semibold">{COPY.product}</Text>
            <Text type="caption" muted>{COPY.subtitle} · due {due}</Text>
          </TopBar.Leading>
          <TopBar.Trailing className={styles.topBarTrailing}>
            <Toolbar.Root aria-label={COPY.toolbarLabel} variant="identity">
              <GradePopover />
              <Toolbar.Button render={<IconButton label="Share review link" icon={<Share2Icon />} />} />
              <Toolbar.Button render={<IconButton label="Fit to window" icon={<MaximizeIcon />} />} />
              <Toolbar.Separator />
              <Toolbar.Button prominent>Approve take</Toolbar.Button>
            </Toolbar.Root>
            <MediaWorkspaceInspectorSheet defaultOpen={false} />
          </TopBar.Trailing>
        </TopBar.Root>
        <div className={styles.workspace}>
          {/* The page <h1> and <main> come from the media-viewer block. */}
          <div id="media-review" className={styles.stage} data-ag-radius="xl">
            <MediaViewer src={VIDEO_SRC} title={COPY.title} poster={STILLS[0]!.src} backdrop={STILLS[3]!.src} images={[]} />
          </div>
          <div className={styles.rail}>
            <Surface layer="content" shape="concentric" fallbackRadius="lg" className={styles.panel} render={<section aria-labelledby="mw-stills-heading" />}>
              <div className={styles.panelHeader}>
                <Heading level={2} size="sm" id="mw-stills-heading">{COPY.stillsLabel}</Heading>
                <Text type="caption" muted>{STILLS.length} frames · tap to compare</Text>
              </div>
              <ImageViewer.Root items={STILLS}>
                <ul className={styles.thumbs}>
                  {STILLS.map((s) => (
                    <li key={s.id} className={styles.thumbItem}>
                      <ImageViewer.Trigger id={s.id}>
                        <img className={styles.thumb} src={s.src} alt={s.alt} width={320} height={180} />
                      </ImageViewer.Trigger>
                      <Text type="caption" muted>{s.caption}</Text>
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
            </Surface>
            <Surface layer="content" shape="concentric" fallbackRadius="lg" className={styles.panel} render={<section aria-labelledby="mw-rail-heading" />}>
              <div className={styles.panelHeader}>
                <Heading level={2} size="sm" id="mw-rail-heading">{COPY.carouselLabel}</Heading>
                <Text type="caption" muted>Circle takes for the editor</Text>
              </div>
              <CarouselRail.Root label={COPY.carouselRailLabel} slides={slides} slidesPerView={2} />
            </Surface>
            <MediaWorkspaceClearControls />
          </div>
        </div>
        <section className={styles.section} aria-labelledby="mw-shot-log-heading">
          <h2 id="mw-shot-log-heading">{COPY.shotLogHeading}</h2>
          <table>
            <caption>{COPY.shotLogCaption}</caption>
            <thead>
              <tr>
                {SHOT_LOG_COLUMNS.map((c) => (
                  <th key={c} scope="col">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SHOT_LOG.map(([shot, ...cells]) => (
                <tr key={shot}>
                  <th scope="row">{shot}</th>
                  {cells.map((c, i) => (
                    <td key={SHOT_LOG_COLUMNS[i + 1]}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <NowPlayingBar.Root className={styles.nowPlaying} playing={false} progress={0.27} artwork={STILLS[0]!.src}>
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
