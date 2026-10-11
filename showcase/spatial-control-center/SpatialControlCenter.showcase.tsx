/* spatial-control-center showcase (REQ-QUAL-58, tier S2, default scene hf-pattern).
   Composes public entries directly (contract §3.3): grouped control surfaces, a
   concentric room card stack, and exactly one refraction chrome surface (the scene bar). */
import * as React from 'react';
import {
  ButtonGroup,
  ConcentricFrame,
  IconButton,
  SegmentedControl,
  Slider,
  Surface,
  SurfaceGroup,
  Switch,
  Toolbar,
} from 'aura-glass';
import { AppShell } from 'aura-glass/app-shell';
import { PauseIcon, SkipBackIcon, SkipForwardIcon, SunIcon, MoonIcon, Volume2Icon } from 'aura-glass/icons';
import { COPY, ROOMS, SHOWCASE_EPOCH, TOGGLES } from './copy';
import styles from './spatial-control-center.module.css';

export interface SpatialControlCenterProps {
  /** Fixed epoch (REQ-QUAL-59 determinism). */
  now?: number;
}

/** Fragment: the living-room control grid. */
export function SpatialControlGrid() {
  const [blinds, setBlinds] = React.useState('half');
  return (
    <section className={styles.controls} aria-labelledby="scc-controls">
      <h2 id="scc-controls">{COPY.controlsHeading}</h2>
      <SurfaceGroup spacing="3">
        <div className={styles.grid}>
          <Surface layer="chrome" className={styles.tile}>
            <h3>{COPY.brightness}</h3>
            <Slider.Root aria-label={COPY.brightness} defaultValue={70} min={0} max={100} />
          </Surface>
          <Surface layer="chrome" className={styles.tile}>
            <h3>{COPY.warmth}</h3>
            <Slider.Root aria-label={COPY.warmth} defaultValue={3200} min={2200} max={6500} step={100} />
          </Surface>
          <Surface layer="chrome" className={styles.tile}>
            <h3>{COPY.thermostat}</h3>
            <Slider.Root aria-label={COPY.thermostat} defaultValue={21.5} min={16} max={26} step={0.5} />
          </Surface>
          <Surface layer="chrome" className={styles.tile}>
            <h3>{COPY.blinds}</h3>
            <SegmentedControl.Root aria-label={COPY.blinds} value={blinds} onValueChange={(v: string) => setBlinds(v)}>
              <SegmentedControl.Item value="open">Open</SegmentedControl.Item>
              <SegmentedControl.Item value="half">Half</SegmentedControl.Item>
              <SegmentedControl.Item value="closed">Closed</SegmentedControl.Item>
            </SegmentedControl.Root>
          </Surface>
          <Surface layer="chrome" className={styles.tile}>
            <h3>{COPY.mediaToolbar}</h3>
            <Toolbar.Root aria-label={COPY.mediaToolbar}>
              <Toolbar.IconButton label="Previous track" icon={<SkipBackIcon />} />
              <Toolbar.IconButton label="Pause" icon={<PauseIcon />} />
              <Toolbar.IconButton label="Next track" icon={<SkipForwardIcon />} />
              <Toolbar.Separator />
              <Toolbar.IconButton label={COPY.volume} icon={<Volume2Icon />} />
            </Toolbar.Root>
            <Slider.Root aria-label={COPY.volume} defaultValue={35} min={0} max={100} />
          </Surface>
          <Surface layer="chrome" className={styles.tile}>
            <h3>{COPY.quickToggles}</h3>
            <ul className={styles.toggles}>
              {TOGGLES.map((t) => (
                <li key={t.id}>
                  <Switch defaultChecked={t.on}>{t.label}</Switch>
                </li>
              ))}
            </ul>
          </Surface>
        </div>
      </SurfaceGroup>
    </section>
  );
}

export function SpatialControlCenter({ now = SHOWCASE_EPOCH }: SpatialControlCenterProps) {
  const [scene, setScene] = React.useState('evening');
  const hour = new Date(now).getUTCHours();
  return (
    <>
      <AppShell.SkipLink href="#scc-main">{COPY.skip}</AppShell.SkipLink>
      <main id="scc-main" tabIndex={-1} className={styles.page}>
        <header className={styles.header}>
          <h1>{COPY.title}</h1>
          <p>
            {COPY.subtitle} · {String(hour).padStart(2, '0')}:00 local
          </p>
        </header>
        <Surface layer="chrome" refraction className={styles.sceneBar} aria-label={COPY.scenesLabel}>
          <ButtonGroup aria-label={COPY.scenesLabel}>
            <IconButton label="Morning scene" icon={<SunIcon />} pressed={scene === 'morning'} onPressedChange={() => setScene('morning')} />
            <IconButton label="Evening scene" icon={<MoonIcon />} pressed={scene === 'evening'} onPressedChange={() => setScene('evening')} />
          </ButtonGroup>
        </Surface>
        <section className={styles.rooms} aria-labelledby="scc-rooms">
          <h2 id="scc-rooms">{COPY.roomsHeading}</h2>
          <ul className={styles.roomList}>
            {ROOMS.map((r) => (
              <li key={r.id}>
                <ConcentricFrame radius="xl" inset="2">
                  <Surface layer="content" className={styles.room}>
                    <img className={styles.roomImage} src={r.image} alt="" width={960} height={600} />
                    <h3>{r.name}</h3>
                    <p>{r.status}</p>
                  </Surface>
                </ConcentricFrame>
              </li>
            ))}
          </ul>
        </section>
        <SpatialControlGrid />
      </main>
    </>
  );
}
