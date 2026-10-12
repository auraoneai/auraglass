import { Combobox } from 'aura-glass';

const PEOPLE = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing'];

export default function ComboboxMinimal() {
  return (
    <Combobox.Root items={PEOPLE}>
      <Combobox.Input placeholder="Search people" aria-label="Assignee" />
      <Combobox.Content>
        {PEOPLE.map((p) => (
          <Combobox.Item key={p} value={p}>{p}</Combobox.Item>
        ))}
        <Combobox.Empty />
      </Combobox.Content>
    </Combobox.Root>
  );
}
