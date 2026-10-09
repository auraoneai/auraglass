import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toolbar } from './index';

const X = <svg data-testid="x" />;

describe('Toolbar', () => {
  it('renders root inside a SurfaceGroup with parts', () => {
    render(
      <Toolbar.Root aria-label="Editor">
        <Toolbar.Button>Bold</Toolbar.Button>
        <Toolbar.Group>
          <Toolbar.IconButton label="Undo" icon={X} />
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Link href="/help">Help</Toolbar.Link>
      </Toolbar.Root>,
    );
    const root = screen.getByRole('toolbar', { name: 'Editor' });
    expect(root.getAttribute('data-ag-part')).toBe('root');
    expect(root.parentElement?.getAttribute('data-ag-group')).toBe('');
    expect(screen.getByText('Help').closest('[data-ag-part="link"]')).not.toBeNull();
    expect(root.querySelector('[data-ag-part="separator"]')).not.toBeNull();
    expect(root.querySelector('[data-ag-part="group"]')).not.toBeNull();
  });

  it('Toolbar.Button renders our ag-button through the render prop', () => {
    render(
      <Toolbar.Root aria-label="t">
        <Toolbar.Button prominent>Save</Toolbar.Button>
      </Toolbar.Root>,
    );
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).toHaveClass('ag-button');
    expect(btn.getAttribute('data-ag-prominent')).toBe('');
  });

  it('Toolbar.IconButton renders icon-only button', () => {
    render(
      <Toolbar.Root aria-label="t">
        <Toolbar.IconButton label="Undo" icon={X} />
      </Toolbar.Root>,
    );
    const btn = screen.getByRole('button', { name: 'Undo' });
    expect(btn).toHaveClass('ag-icon-button');
  });

  it('orientation=vertical is forwarded', () => {
    render(
      <Toolbar.Root aria-label="t" orientation="vertical">
        <Toolbar.Button>A</Toolbar.Button>
      </Toolbar.Root>,
    );
    const root = screen.getByRole('toolbar');
    expect(root.getAttribute('data-ag-shape')).toBeNull();
    expect(root.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('horizontal root emits capsule shape', () => {
    render(
      <Toolbar.Root aria-label="t">
        <Toolbar.Button>A</Toolbar.Button>
      </Toolbar.Root>,
    );
    expect(screen.getByRole('toolbar').getAttribute('data-ag-shape')).toBe('capsule');
  });
});

it('priority="low" emits data-ag-priority and a trailing overflow menu (REQ-CMP-40)', () => {
  const { container } = render(
    <Toolbar.Root aria-label="t">
      <Toolbar.Button>Keep</Toolbar.Button>
      <Toolbar.Button priority="low">Later</Toolbar.Button>
      <Toolbar.IconButton label="settings" icon={<svg />} priority="low" />
    </Toolbar.Root>,
  );
  const lows = container.querySelectorAll('[data-ag-priority="low"]');
  expect(lows.length).toBe(2);
  expect(container.querySelector('[data-ag-part="overflow"]')).not.toBeNull();
  /* overflow menu trigger is the last tabbable child (roving order kept) */
  expect(container.querySelector('[data-ag-part="overflow"]')?.nextElementSibling).toBeNull();
});
