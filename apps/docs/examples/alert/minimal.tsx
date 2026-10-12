import { Alert } from 'aura-glass';

export default function AlertMinimal() {
  return <Alert intent="warning" title="Storage almost full">You have used 92% of your workspace storage.</Alert>;
}
