/* music-player showcase (REQ-QUAL-58, tier S2, default scene photo).
   Composes registry/blocks/media-viewer (contract §3.3) for the live-session video,
   with a library rail, queue, playback controls and the now-playing bar. */
import * as React from 'react';
import { IconButton, SegmentedControl, Slider } from 'aura-glass';
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

/** Fragment: the now-playing bar with transport and position. */
export function MusicNowPlaying() {
  const [playing, setPlaying] = React.useState(true);
  return (
    <NowPlayingBar.Root
      playing={playing}
      onPlayingChange={setPlaying}
      progress={NOW_PLAYING.position / NOW_PLAYING.duration}
      artwork={ALBUMS[0].cover}
      onPrevious={() => undefined}
      onNext={() => undefined}
    >
      <NowPlayingBar.Artwork />
      <NowPlayingBar.Title>{NOW_PLAYING.title}</NowPlayingBar.Title>
      <NowPlayingBar.Subtitle>
        {NOW_PLAYING.artist} · {NOW_PLAYING.album}
      </NowPlayingBar.Subtitle>
      <NowPlayingBar.Actions />
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
        <img className={styles.cover} src={a.cover} alt={`${a.title} cover art`} width={512} height={512} />
        <figcaption>
          {a.title}
          <br />
          {a.artist}
        </figcaption>
      </figure>
    ),
  }));
  return (
    <>
      <AppShell.SkipLink href="#ag-media-main">{COPY.skip}</AppShell.SkipLink>
      <div className={styles.page}>
        <div id="ag-media-main" className={styles.session}>
          <MediaViewer src={SESSION_VIDEO} title={COPY.sessionTitle} />
        </div>
        <aside className={styles.library} aria-label="Library">
          <div className={styles.libraryHeader}>
            <h2>{COPY.albumsHeading}</h2>
            <SegmentedControl.Root aria-label={COPY.viewLabel} value={view} onValueChange={(v: string) => setView(v)}>
              <SegmentedControl.Item value="albums">Albums</SegmentedControl.Item>
              <SegmentedControl.Item value="artists">Artists</SegmentedControl.Item>
              <SegmentedControl.Item value="playlists">Playlists</SegmentedControl.Item>
            </SegmentedControl.Root>
          </div>
          <CarouselRail.Root label={COPY.albumsHeading} slides={slides} slidesPerView="auto" />
          <h2>{COPY.queueHeading}</h2>
          <ol className={styles.queue}>
            {QUEUE.map((t) => (
              <li key={t.id} className={styles.queueItem}>
                <span>{t.title}</span>
                <span>{t.artist}</span>
                <span>{t.length}</span>
              </li>
            ))}
          </ol>
          <p>
            © {year} Tideline Records · {formatMediaTime(NOW_PLAYING.duration)} track length
          </p>
        </aside>
        <section className={styles.transport} aria-label="Player controls">
          <MediaControls.Root
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
            <MediaControls.Spacer />
            <MediaControls.Volume />
            <MediaControls.Mute />
          </MediaControls.Root>
          <div className={styles.actions}>
            <IconButton label={COPY.shuffle} icon={<ShuffleIcon />} />
            <IconButton label={COPY.repeat} icon={<RefreshCwIcon />} />
            <IconButton label={COPY.like} icon={<HeartIcon />} />
            <IconButton label={COPY.queue} icon={<ListIcon />} />
          </div>
          <div className={styles.sliders}>
            <Slider.Root aria-label={COPY.eqLabel} defaultValue={30} min={0} max={100} />
            <Slider.Root aria-label={COPY.crossfadeLabel} defaultValue={4} min={0} max={12} />
          </div>
          <MusicNowPlaying />
        </section>
      </div>
    </>
  );
}
