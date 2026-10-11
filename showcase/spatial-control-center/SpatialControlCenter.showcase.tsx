/* spatial-control-center showcase (REQ-QUAL-58, tier S2, default scene hf-pattern).
   Composes public entries directly (contract §3.3): grouped control surfaces, a
   concentric room card stack, and exactly one refraction chrome surface (the scene bar).
   Material roles: the scene bar is the single refraction chrome surface; the
   living-room controls are one SurfaceGroup platter whose tiles are sunken
   content wells (no glass on every tile); room cards are content-raised. */
import * as React from 'react';
import {
  ButtonGroup,
  ConcentricFrame,
  Heading,
  IconButton,
  SegmentedControl,
  Slider,
  Surface,
  SurfaceGroup,
  Switch,
  Text,
  Toolbar,
} from 'aura-glass';
import { AppShell } from 'aura-glass/app-shell';
import { PauseIcon, SkipBackIcon, SkipForwardIcon, SunIcon, MoonIcon, Volume2Icon } from 'aura-glass/icons';
import { COPY, DEVICE_COLUMNS, DEVICES, ROOMS, SHOWCASE_EPOCH, TOGGLES } from './copy';
import styles from './spatial-control-center.module.css';

export interface SpatialControlCenterProps {
  /** Fixed epoch (REQ-QUAL-59 determinism). */
  now?: number;
}

function Tile({ title, value, children }: { title: string; value?: string; children: React.ReactNode }) {
  return (
    <Surface layer="content" content="content-sunken" shape="concentric" fallbackRadius="lg" className={styles.tile}>
      <div className={styles.tileHeader}>
        <Heading level={3} size="sm">{title}</Heading>
        {value ? <Text type="mono" size="sm" muted>{value}</Text> : null}
      </div>
      {children}
    </Surface>
  );
}

/** Fragment: the living-room control grid. */
export function SpatialControlGrid() {
  const [blinds, setBlinds] = React.useState('half');
  return (
    <section className={styles.controls} aria-labelledby="scc-controls">
      <SurfaceGroup spacing="3" className={String(styles.platter)}>
        <div className={styles.platterHeader}>
          <Heading level={2} size="lg" id="scc-controls">{COPY.controlsHeading}</Heading>
          <Text type="caption" muted>{COPY.controlsSummary}</Text>
        </div>
        <div className={styles.grid}>
          <Tile title={COPY.brightness} value="70%">
            <Slider.Root aria-label={COPY.brightness} defaultValue={70} min={0} max={100} />
          </Tile>
          <Tile title={COPY.warmth} value="3200 K">
            <Slider.Root aria-label={COPY.warmth} defaultValue={3200} min={2200} max={6500} step={100} />
          </Tile>
          <Tile title={COPY.thermostat} value="21.5 °C">
            <Slider.Root aria-label={COPY.thermostat} defaultValue={21.5} min={16} max={26} step={0.5} />
          </Tile>
          <Tile title={COPY.blinds}>
            <SegmentedControl.Root name="living-room-blinds" aria-label={COPY.blinds} value={blinds} onValueChange={(v: string) => setBlinds(v)}>
              <SegmentedControl.Item value="open">Open</SegmentedControl.Item>
              <SegmentedControl.Item value="half">Half</SegmentedControl.Item>
              <SegmentedControl.Item value="closed">Closed</SegmentedControl.Item>
            </SegmentedControl.Root>
          </Tile>
          <Tile title={COPY.mediaToolbar} value={COPY.nowPlaying}>
            <Toolbar.Root aria-label={COPY.mediaToolbar} variant="identity">
              <Toolbar.IconButton label="Previous track" icon={<SkipBackIcon />} />
              <Toolbar.IconButton label="Pause" icon={<PauseIcon />} />
              <Toolbar.IconButton label="Next track" icon={<SkipForwardIcon />} />
              <Toolbar.Separator />
              <Toolbar.IconButton label={COPY.volume} icon={<Volume2Icon />} />
            </Toolbar.Root>
            <Slider.Root aria-label={COPY.volume} defaultValue={35} min={0} max={100} />
          </Tile>
          <Tile title={COPY.quickToggles}>
            <ul className={styles.toggles}>
              {TOGGLES.map((t) => (
                <li key={t.id}>
                  <Switch defaultChecked={t.on}>{t.label}</Switch>
                </li>
              ))}
            </ul>
          </Tile>
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
        <Surface layer="chrome" refraction className={styles.sceneBar} render={<header />}>
          <div className={styles.headerText}>
            <Heading level={1} size="title-2">{COPY.title}</Heading>
            <Text type="caption" muted>
              {COPY.subtitle} · {String(hour).padStart(2, '0')}:00 local
            </Text>
          </div>
          <div className={styles.sceneSwitch}>
            <Text type="label" muted>{COPY.scenesLabel}</Text>
            <ButtonGroup aria-label={COPY.scenesLabel}>
              <IconButton label="Morning scene" icon={<SunIcon />} pressed={scene === 'morning'} onPressedChange={() => setScene('morning')} />
              <IconButton label="Evening scene" icon={<MoonIcon />} pressed={scene === 'evening'} onPressedChange={() => setScene('evening')} />
            </ButtonGroup>
          </div>
        </Surface>
        <section className={styles.rooms} aria-labelledby="scc-rooms">
          <Heading level={2} size="md" id="scc-rooms">{COPY.roomsHeading}</Heading>
          <ul className={styles.roomList}>
            {ROOMS.map((r) => (
              <li key={r.id}>
                <ConcentricFrame radius="xl" inset="2">
                  <Surface layer="content" shape="concentric" className={styles.room}>
                    <div className={styles.roomMedia} data-ag-radius="lg">
                      <img className={styles.roomImage} src={r.image} alt="" width={960} height={600} />
                    </div>
                    <div className={styles.roomText}>
                      <Heading level={3} size="sm">{r.name}</Heading>
                      <Text type="caption" muted>{r.status}</Text>
                    </div>
                  </Surface>
                </ConcentricFrame>
              </li>
            ))}
          </ul>
        </section>
        <SpatialControlGrid />
        <section className={styles.rooms} aria-labelledby="scc-devices">
          <h2 id="scc-devices">{COPY.devicesHeading}</h2>
          <table>
            <caption>{COPY.devicesCaption}</caption>
            <thead>
              <tr>
                {DEVICE_COLUMNS.map((c) => (
                  <th key={c} scope="col">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEVICES.map(([device, room, state, minutesAgo]) => (
                <tr key={`${room}-${device}`}>
                  <th scope="row">{device}</th>
                  <td>{room}</td>
                  <td>{state}</td>
                  <td>{new Date(now - minutesAgo * 60_000).toISOString().slice(11, 16)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
}
