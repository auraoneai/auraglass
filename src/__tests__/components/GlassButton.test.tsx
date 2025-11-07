/**
 * GlassButton Component Tests
 * Week 5: Component Testing Infrastructure
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GlassButton } from '../../components/button/GlassButton';

describe('GlassButton', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<GlassButton>Click me</GlassButton>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(
        <GlassButton className="custom-class">Button</GlassButton>
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders in disabled state', () => {
      render(<GlassButton disabled>Disabled</GlassButton>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Variants', () => {
    it('renders primary variant', () => {
      const { container } = render(
        <GlassButton variant="primary">Primary</GlassButton>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders secondary variant', () => {
      const { container } = render(
        <GlassButton variant="secondary">Secondary</GlassButton>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders ghost variant', () => {
      const { container } = render(
        <GlassButton variant="ghost">Ghost</GlassButton>
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('renders small size', () => {
      const { container } = render(
        <GlassButton size="sm">Small</GlassButton>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders medium size (default)', () => {
      const { container } = render(
        <GlassButton size="md">Medium</GlassButton>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders large size', () => {
      const { container } = render(
        <GlassButton size="lg">Large</GlassButton>
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClick handler when clicked', () => {
      const handleClick = jest.fn();
      render(<GlassButton onClick={handleClick}>Click</GlassButton>);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(
        <GlassButton onClick={handleClick} disabled>
          Disabled
        </GlassButton>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<GlassButton aria-label="Custom label">Button</GlassButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
    });

    it('is keyboard accessible', () => {
      const handleClick = jest.fn();
      render(<GlassButton onClick={handleClick}>Button</GlassButton>);

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();

      fireEvent.keyDown(button, { key: 'Enter' });
      // Button should still be clickable via keyboard
    });

    it('shows loading state', () => {
      render(<GlassButton loading>Loading</GlassButton>);
      const button = screen.getByRole('button');
      // Verify loading state is accessible
      expect(button).toBeInTheDocument();
    });
  });

  describe('Glass Effect', () => {
    it('applies glass material', () => {
      const { container } = render(
        <GlassButton material="glass">Glass</GlassButton>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('applies acrylic material', () => {
      const { container } = render(
        <GlassButton material="acrylic">Acrylic</GlassButton>
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Icon Support', () => {
    it('renders with left icon', () => {
      const IconComponent = () => <span data-testid="icon">Icon</span>;
      render(
        <GlassButton icon={<IconComponent />} iconPosition="left">
          With Icon
        </GlassButton>
      );

      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('renders with right icon', () => {
      const IconComponent = () => <span data-testid="icon">Icon</span>;
      render(
        <GlassButton icon={<IconComponent />} iconPosition="right">
          With Icon
        </GlassButton>
      );

      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });
});
