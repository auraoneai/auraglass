import { Popover } from 'aura-glass';

export default function PopoverMinimal() {
  return (
    <Popover.Root>
      <Popover.Trigger>Share</Popover.Trigger>
      <Popover.Content>
        <Popover.Arrow />
        <Popover.Title>Share link</Popover.Title>
        <Popover.Description>Anyone with the link can view.</Popover.Description>
        <Popover.Close>Done</Popover.Close>
      </Popover.Content>
    </Popover.Root>
  );
}
