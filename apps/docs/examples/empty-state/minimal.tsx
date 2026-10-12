import { Button, EmptyState } from 'aura-glass';

export default function EmptyStateMinimal() {
  return <EmptyState title="No projects yet" description="Create a project to start tracking work." actions={<Button prominent>New project</Button>} />;
}
