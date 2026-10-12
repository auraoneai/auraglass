/* music-player showcase (REQ-QUAL-58, tier S2, default scene photo).
   Composes registry/blocks/media-viewer (contract §3.3) for the live-session video,
   with a library panel, queue, playback controls and the now-playing bar.
   Material roles: the session stage is the block's media backdrop; the library
   is one content-raised panel; the bottom dock carries the only chrome — the
   now-playing bar and the transport capsule, side by side, never nested. */
import * as React from 'react';
import { Heading, IconButton, SegmentedControl, Slider, Surface, Text } from 'aura-glass';
import { AppShell } from 'aura-glass/app-shell';
import { CarouselRail, MediaControls, NowPlayingBar, formatMediaTime } from 'aura-glass/media';
import { HeartIcon, ListIcon, RefreshCwIcon, ShuffleIcon } from 'aura-glass/icons';
import { MediaViewer } from '../../registry/blocks/media-viewer/index';
import { ALBUMS, COPY, NOW_PLAYING, QUEUE, SESSION_VIDEO, SHOWCASE_EPOCH } from './copy';
import styles from './music-player.module.css';

export interface MusicPlayerProps {
  /** Fixed epoch (REQ-QUAL-59 determinism). */
  now?: number;
}

/** Fragment: the now-playing bar with transport and position. In the full page
    it shares the player's play state with the transport capsule. */
export function MusicNowPlaying({ playing: controlled, onPlayingChange }: { playing?: boolean; onPlayingChange?: (playing: boolean) => void } = {}) {
  const [own, setOwn] = React.useState(true);
  const playing = controlled ?? own;
  const setPlaying = onPlayingChange ?? setOwn;
  return (
    <NowPlayingBar.Root
      playing={playing}
      onPlayingChange={setPlaying}
      progress={NOW_PLAYING.position / NOW_PLAYING.duration}
      artwork={ALBUMS[0].cover}
    >
      <NowPlayingBar.Artwork />
      <NowPlayingBar.Title>{NOW_PLAYING.title}</NowPlayingBar.Title>
      <NowPlayingBar.Subtitle>
        {NOW_PLAYING.artist} · {NOW_PLAYING.album}
      </NowPlayingBar.Subtitle>
      <NowPlayingBar.Actions onPrevious={() => undefined} onNext={() => undefined} />
      <NowPlayingBar.Progress />
    </NowPlayingBar.Root>
  );
}

export function MusicPlayer({ now = SHOWCASE_EPOCH }: MusicPlayerProps) {
  const [view, setView] = React.useState('albums');
  const [playing, setPlaying] = React.useState(true);
  const [position, setPosition] = React.useState(NOW_PLAYING.position);
  const year = new Date(now).getUTCFullYear();
  const slides = ALBUMS.map((a) => ({
    id: a.id,
    label: `${a.title} by ${a.artist}`,
    children: (
      <figure className={styles.album}>
        <div className={styles.coverFrame} data-ag-radius="md">
          <img className={styles.cover} src={a.cover} alt={`${a.title} cover art`} width={512} height={512} />
        </div>
        <figcaption className={styles.albumCaption}>
          <Text type="label" weight="semibold" truncate>{a.title}</Text>
          <Text type="caption" muted truncate>{a.artist}</Text>
        </figcaption>
      </figure>
    ),
  }));
  return (
    <>
      <AppShell.SkipLink href="#ag-media-main">{COPY.skip}</AppShell.SkipLink>
      <div className={styles.page}>
        <div id="ag-media-main" className={styles.session} data-ag-radius="xl">
          <MediaViewer src={SESSION_VIDEO} title={COPY.sessionTitle} poster={ALBUMS[3].cover} backdrop={ALBUMS[0].cover} images={[]} />
        </div>
        <Surface layer="content" shape="concentric" fallbackRadius="lg" className={styles.library} render={<aside aria-label="Library" />}>
          <div className={styles.libraryHeader}>
            <Heading level={2} size="title-3">{COPY.albumsHeading}</Heading>
            <SegmentedControl.Root name="library-view" aria-label={COPY.viewLabel} value={view} onValueChange={(v: string) => setView(v)}>
              <SegmentedControl.Item value="albums">Albums</SegmentedControl.Item>
              <SegmentedControl.Item value="artists">Artists</SegmentedControl.Item>
              <SegmentedControl.Item value="playlists">Playlists</SegmentedControl.Item>
            </SegmentedControl.Root>
          </div>
          <CarouselRail.Root label={COPY.albumsHeading} slides={slides} slidesPerView="auto" />
          <div className={styles.queueHeader}>
            <Heading level={2} size="title-3">{COPY.queueHeading}</Heading>
            <div className={styles.actions}>
              <IconButton label={COPY.shuffle} icon={<ShuffleIcon />} variant="identity" />
              <IconButton label={COPY.repeat} icon={<RefreshCwIcon />} variant="identity" />
              <IconButton label={COPY.like} icon={<HeartIcon />} variant="identity" />
              <IconButton label={COPY.queue} icon={<ListIcon />} variant="identity" />
            </div>
          </div>
          <ol className={styles.queue}>
            {QUEUE.map((t, i) => (
              <li key={t.id} className={styles.queueItem}>
                <Text type="mono" size="sm" muted>{String(i + 1).padStart(2, '0')}</Text>
                <span className={styles.queueTitle}>
                  <Text type="label" weight="medium" truncate>{t.title}</Text>
                  <Text type="caption" muted truncate>{t.artist}</Text>
                </span>
                <Text type="mono" size="sm" muted>{t.length}</Text>
              </li>
            ))}
          </ol>
          <div className={styles.sliders}>
            <div className={styles.sliderField}>
              <Text type="label">{COPY.eqLabel}</Text>
              <Slider.Root aria-label={COPY.eqLabel} defaultValue={30} min={0} max={100} />
            </div>
            <div className={styles.sliderField}>
              <Text type="label">{COPY.crossfadeLabel}</Text>
              <Slider.Root aria-label={COPY.crossfadeLabel} defaultValue={4} min={0} max={12} />
            </div>
          </div>
          <Text type="caption" muted>
            © {year} Tideline Records · {formatMediaTime(NOW_PLAYING.duration)} track length
          </Text>
        </Surface>
        <section className={styles.transport} aria-label="Player controls">
          <MusicNowPlaying playing={playing} onPlayingChange={setPlaying} />
          <MediaControls.Root
            variant="regular"
            label={`${NOW_PLAYING.title} playback`}
            playing={playing}
            onPlayingChange={setPlaying}
            currentTime={position}
            duration={NOW_PLAYING.duration}
            onSeek={setPosition}
            volume={0.7}
          >
            <MediaControls.PlayButton />
            <MediaControls.Scrubber />
            <MediaControls.Time />
            <MediaControls.Volume />
            <MediaControls.Mute />
          </MediaControls.Root>
        </section>
      </div>
    </>
  );
}
