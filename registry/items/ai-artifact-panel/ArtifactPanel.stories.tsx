import type { Meta, StoryObj } from '@storybook/react';
import { ArtifactPanel } from './ArtifactPanel';
import { CODE_ARTIFACT, DOCUMENT_ARTIFACT } from './fixtures';

const meta: Meta<typeof ArtifactPanel> = { title: 'registry/ai-artifact-panel', component: ArtifactPanel };
export default meta;
type Story = StoryObj<typeof ArtifactPanel>;

const doc = DOCUMENT_ARTIFACT;
const code = CODE_ARTIFACT;

export const Default: Story = { args: { artifact: doc, open: true } };
export const Code: Story = { args: { artifact: code, open: true } };
export const Empty: Story = { args: { artifact: null, open: true } };
/** Code body behind the lazy code-surface boundary: the Suspense fallback
 * <pre> renders until the optional code-surface item resolves. */
export const Loading: Story = { args: { artifact: code, open: true } };
export const RTL: Story = { args: { ...Default.args }, decorators: [(S) => <div dir="rtl"><S /></div>] };
export const ReducedTransparency: Story = { args: { ...Default.args }, parameters: { agEnvironment: { transparency: 'none' } } };
export const ForcedColors: Story = { args: { ...Default.args }, parameters: { agEnvironment: { forcedColors: 'active' } } };
