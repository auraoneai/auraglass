// registry/items/presence-stack — REQ-SURF-177 (5.1 scope).
// Avatar stack of present users: deterministic colour per user id, stable
// order, +N overflow. No timers, no simulated presence — data by props.
import { Avatar, AvatarGroup } from 'aura-glass';

export interface PresenceUser {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface PresenceStackProps {
  users: PresenceUser[];
  max?: number;
  /** hue space used to derive the fallback colour from the id */
  hueOffset?: number;
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

export function PresenceStack({ users, max = 5, hueOffset = 0 }: PresenceStackProps) {
  const shown = users.slice(0, max);
  const overflow = users.length - shown.length;
  return (
    <div data-ag-part="root" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <AvatarGroup data-ag-part="avatars">
        {shown.map((u) => (
          <Avatar.Root key={u.id} data-ag-part="avatar">
            {u.imageUrl ? <Avatar.Image src={u.imageUrl} alt={u.name} /> : null}
            <Avatar.Fallback style={{ background: presenceColor(u.id, hueOffset) }}>
              {initials(u.name)}
            </Avatar.Fallback>
          </Avatar.Root>
        ))}
      </AvatarGroup>
      {overflow > 0 && <span data-ag-part="overflow">+{overflow}</span>}
      <span data-ag-part="count">{users.length} online</span>
    </div>
  );
}

function initials(name: string): string {
  return name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export default PresenceStack;
