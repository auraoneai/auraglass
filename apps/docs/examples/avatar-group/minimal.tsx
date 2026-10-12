import { Avatar, AvatarGroup } from 'aura-glass';

export default function AvatarGroupMinimal() {
  return (
    <AvatarGroup max={3}>
      {['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson'].map((name) => (
        <Avatar.Root key={name} name={name} />
      ))}
    </AvatarGroup>
  );
}
