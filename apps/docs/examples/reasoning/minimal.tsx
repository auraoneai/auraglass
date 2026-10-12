import { Reasoning } from 'aura-glass/ai';

export default function ReasoningMinimal() {
  return <Reasoning text="Checked three releases; the regression started after 4.2.1." state="done" durationMs={4200} />;
}
