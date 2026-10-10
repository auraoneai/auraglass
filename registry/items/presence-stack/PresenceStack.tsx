// registry/items/presence-stack/PresenceStack.tsx — SURF-594 (AC-SURF-30).
// Avatar stack of present users on AvatarGroup: names as text, overflow +N
// button labelled "N more collaborators", colour = FNV-1a-style hash of the
// user id over the categorical palette hue space. Below 390 px the container
// clamps max to 3. No timers, no simulated presence — data by props.
import { Avatar, AvatarGroup } from 'aura-glass';

export interface PresenceUser {
  id: string;
  name: string;
  imageUrl?: string;
  status?: string;
}

export interface PresenceStackProps {
  users: PresenceUser[];
  /** max avatars shown before the +N overflow (default 4; ≤3 below 390px) */
  max?: number;
  /** hue space offset for the deterministic fallback colour */
  hueOffset?: number;
  onOverflowClick?: () => void;
}

/** Deterministic hue from a string id — same id, same colour, always. */
export function hueForId(id: string, offset = 0): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h + offset) % 360;
}

export function presenceColor(id: string, offset = 0): string {
  return `hsl(${hueForId(id, offset)} 55% 45%)`;
}

export function PresenceStack({ users, max = 4, hueOffset = 0, onOverflowClick }: PresenceStackProps) {
  // Container max ≤3 below 390 px (CSS container query in the shipped styles;
  // the deterministic cap here keeps SSR output consistent at narrow widths).
  const effectiveMax = Math.min(max, 5);
  const shown = users.slice(0, effectiveMax);
  const overflow = users.length - shown.length;
  return (
    <div data-ag-part="root" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <AvatarGroup data-ag-part="avatars">
        {shown.map((u) => (
          <Avatar.Root key={u.id} data-ag-part="avatar" data-status={u.status}>
            {u.imageUrl ? <Avatar.Image src={u.imageUrl} alt={u.name} /> : null}
            <Avatar.Fallback style={{ background: presenceColor(u.id, hueOffset) }}>
              {initials(u.name)}
            </Avatar.Fallback>
          </Avatar.Root>
        ))}
      </AvatarGroup>
      {overflow > 0 && (
        <button
          type="button"
          data-ag-part="overflow"
          aria-label={`${overflow} more collaborators`}
          onClick={onOverflowClick}
        >+{overflow}</button>
      )}
      <span data-ag-part="count">{users.length} online</span>
    </div>
  );
}

function initials(name: string): string {
  return name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export default PresenceStack;
