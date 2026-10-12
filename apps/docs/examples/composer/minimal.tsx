import { Composer } from 'aura-glass/ai';

export default function ComposerMinimal() {
  return <Composer onSubmit={({ text }) => console.log(text)} />;
}
