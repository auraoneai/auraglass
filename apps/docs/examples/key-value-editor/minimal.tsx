import { KeyValueEditor } from 'aura-glass/data';

export default function KeyValueEditorMinimal() {
  return <KeyValueEditor defaultValue={[{ key: 'NODE_ENV', value: 'production' }]} />;
}
