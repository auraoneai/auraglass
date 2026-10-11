// registry/items/presence-stack/PresenceStack.tsx — SURF-594 (AC-SURF-30),
// REQ-SURF-176. A <ul> of present users: each <li> carries the avatar
// (decorative) and the user's name as visually-hidden text. Overflow is a +N
// button named "N more collaborators". Colour = a deterministic hash of the
// user id indexed into the categorical chart palette (var(--_ag-chart-k)).
// Below 390 px of CONTAINER width the stack clamps to 3 (container query in
// presence-stack.css; `narrow` sets the data-narrow fallback for engines
// without container queries). No timers, no simulated presence — data by props.
import { Avatar, VisuallyHidden } from 'aura-glass';
import './presence-stack.css';

export interface PresenceUser {
  id: string;
  name: string;
  avatarUrl?: string;
  /** Overrides the id-derived palette colour (any CSS colour / var()). */
  color?: string;
  status?: 'active' | 'idle';
}

export interface PresenceStackProps {
  users: PresenceUser[];
  /** Avatars shown before the +N overflow (default 4). Below 390 px of
   *  container width at most 3 are shown, whatever `max` is. */
  max?: number;
  /** Force the narrow (≤3) layout: the data-narrow fallback for engines
   *  without CSS container queries. */
  narrow?: boolean;
  onOverflowClick?: () => void;
  /** Accessible name of the list (default 'Collaborators'). */
  label?: string;
}

/** Categorical palette slots (--_ag-chart-1 … --_ag-chart-8). */
export const PALETTE_SIZE = 8;
/** Narrow-container cap (REQ-SURF-176). */
export const NARROW_MAX = 3;

/** Deterministic 32-bit hash of a string id — same id, same value, always. */
export function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

/** Palette colour var for a user id: var(--_ag-chart-((hash % N) + 1)). */
export function presenceColor(id: string): string {
  return `var(--_ag-chart-${(hashId(id) % PALETTE_SIZE) + 1})`;
}

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export function PresenceStack({ users, max = 4, narrow, onOverflowClick, label = 'Collaborators' }: PresenceStackProps) {
  const wideMax = Math.max(0, max);
  const narrowMax = Math.min(wideMax, NARROW_MAX);
  const wideOverflow = Math.max(0, users.length - wideMax);
  const narrowOverflow = Math.max(0, users.length - narrowMax);
  const shown = users.slice(0, wideMax);
  return (
    <div data-ag-part="root" className="ag-presence-stack" data-narrow={narrow ? '' : undefined}>
      <ul data-ag-part="avatars" className="ag-presence-stack__list" aria-label={label}>
        {shown.map((u, i) => (
          <li key={u.id} data-ag-part="avatar" data-status={u.status}
            className="ag-presence-stack__item" data-beyond-narrow={i >= narrowMax ? '' : undefined}>
            <Avatar.Root aria-hidden="true" className="ag-presence-stack__avatar"
              style={{ background: u.color ?? presenceColor(u.id) }}>
              {u.avatarUrl ? <Avatar.Image src={u.avatarUrl} alt="" /> : null}
              <Avatar.Fallback>{initials(u.name)}</Avatar.Fallback>
            </Avatar.Root>
            <VisuallyHidden>{u.status === 'idle' ? `${u.name} (idle)` : u.name}</VisuallyHidden>
          </li>
        ))}
      </ul>
      {/* Two overflow buttons, one per layout; CSS shows exactly one, so the
          accessible name always matches the visible +N. */}
      {wideOverflow > 0 ? (
        <button type="button" data-ag-part="overflow" data-layout="wide" className="ag-presence-stack__overflow"
          aria-label={`${wideOverflow} more collaborators`} onClick={onOverflowClick}>+{wideOverflow}</button>
      ) : null}
      {narrowOverflow > 0 ? (
        <button type="button" data-ag-part="overflow" data-layout="narrow" className="ag-presence-stack__overflow"
          aria-label={`${narrowOverflow} more collaborators`} onClick={onOverflowClick}>+{narrowOverflow}</button>
      ) : null}
    </div>
  );
}

export default PresenceStack;
