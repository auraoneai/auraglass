import type { Meta, StoryObj } from '@storybook/react';
import { ArtifactPanel } from './ArtifactPanel';

const meta: Meta<typeof ArtifactPanel> = { title: 'registry/ai-artifact-panel', component: ArtifactPanel };
export default meta;
type Story = StoryObj<typeof ArtifactPanel>;

const doc = { id: 'a-1', title: 'deploy-report.md', kind: 'document' as const, content: 'Deploy window 04:12–04:19 UTC. No errors.', version: 3 };
const code = { id: 'a-2', title: 'build.sh', kind: 'code' as const, language: 'bash', content: 'npm ci\nnpm run build' };

export const Default: Story = { args: { artifact: doc, open: true } };
export const Code: Story = { args: { artifact: code, open: true } };
export const Empty: Story = { args: { artifact: null, open: true } };
export const RTL: Story = { args: { ...Default.args }, decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { args: { ...Default.args }, parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { args: { ...Default.args }, parameters: { agEnvironment: { forcedColors: 'active' } } };
