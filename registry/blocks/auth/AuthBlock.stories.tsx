// AuthBlock.stories.tsx — showcase stories per the PLAT story contract
// (kind 'showcase'; 'certified' tag lands only after the render gate).
import type { Meta, StoryObj } from '@storybook/react';
import { AuthBlock } from './index';
import { authProps, errorProps, loadingProps, resetProps, signUpProps } from './fixtures';

const meta: Meta<typeof AuthBlock> = {
  title: 'plat/blocks/auth',
  component: AuthBlock,
  args: authProps,
  parameters: { ag: { subject: 'auth', kind: 'showcase' } },
};
export default meta;
type Story = StoryObj<typeof AuthBlock>;

export const SignIn: Story = {};
export const SignUp: Story = { args: signUpProps };
export const Reset: Story = { args: resetProps };
export const WithError: Story = { args: errorProps };
export const Loading: Story = { args: loadingProps };
export const RTL: Story = { parameters: { globals: { dir: 'rtl' } } };
export const ReducedTransparency: Story = { parameters: { ag: { material: 'regular' } } };
export const ForcedColors: Story = { parameters: { globals: { forcedColors: 'active' } } };
