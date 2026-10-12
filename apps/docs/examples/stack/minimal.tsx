import { Stack } from 'aura-glass';

export default function StackMinimal() {
  return (
    <Stack direction="row" gap={2} align="center" justify="between">
      <span>Invoices</span>
      <span>24</span>
    </Stack>
  );
}
