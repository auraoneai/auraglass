/* spatial-control-center copy and deterministic data (REQ-QUAL-58 / REQ-QUAL-59). */
import living from './assets/room-living.avif';
import studio from './assets/room-studio.avif';
import kitchen from './assets/room-kitchen.avif';

/** Fixed showcase epoch: 2026-03-02T09:30:00Z. */
export const SHOWCASE_EPOCH = Date.UTC(2026, 2, 2, 9, 30, 0);

export const COPY = {
  product: 'Lumen Home',
  skip: 'Skip to controls',
  title: 'Home controls',
  subtitle: '3 rooms · 14 devices online · Evening scene active',
  scenesLabel: 'Scene',
  roomsHeading: 'Rooms',
  controlsHeading: 'Living room',
  brightness: 'Brightness',
  warmth: 'Colour temperature',
  volume: 'Speaker volume',
  thermostat: 'Target temperature',
  blinds: 'Blinds',
  mediaToolbar: 'Media',
  quickToggles: 'Quick toggles',
} as const;

export const ROOMS = [
  { id: 'living', name: 'Living room', status: '21.5 °C · lights 70%', image: living },
  { id: 'studio', name: 'Studio', status: '20.0 °C · lights off', image: studio },
  { id: 'kitchen', name: 'Kitchen', status: '22.0 °C · lights 40%', image: kitchen },
] as const;

export const TOGGLES = [
  { id: 'lamps', label: 'Floor lamps', on: true },
  { id: 'heating', label: 'Underfloor heating', on: true },
  { id: 'purifier', label: 'Air purifier', on: false },
  { id: 'night', label: 'Night mode at 23:00', on: true },
] as const;
