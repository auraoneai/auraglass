import { Tour } from 'aura-glass';

export default function TourMinimal() {
  return (
    <Tour.Root
      steps={[
        { target: '#new-project', title: 'Create a project', description: 'Start here.' },
        { target: '#invite', title: 'Invite your team', description: 'Share the workspace.' },
      ]}
    />
  );
}
