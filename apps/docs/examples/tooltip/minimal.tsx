import { Tooltip } from 'aura-glass';

export default function TooltipMinimal() {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger>Copy</Tooltip.Trigger>
        <Tooltip.Content><Tooltip.Arrow />Copy to clipboard</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
