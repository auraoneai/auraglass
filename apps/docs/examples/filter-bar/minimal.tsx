import { FilterBar } from 'aura-glass/data';

export default function FilterBarMinimal() {
  return (
    <FilterBar
      schema={[
        { id: 'status', label: 'Status', type: 'enum', options: [{ value: 'open', label: 'Open' }, { value: 'closed', label: 'Closed' }] },
        { id: 'title', label: 'Title', type: 'text' },
      ]}
    />
  );
}
