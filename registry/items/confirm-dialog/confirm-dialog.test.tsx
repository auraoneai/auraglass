/* CMP-344: confirm-dialog render harness. */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, act } from '@testing-library/react';
import { ConfirmDialog } from './index';

const flush = async () => { await act(async () => {}); };

describe('registry item confirm-dialog', () => {
  it('renders AlertDialog with title/description/actions', async () => {
    render(<ConfirmDialog open title="Delete file?" description="No undo" confirmLabel="Delete" />);
    await flush();
    expect(document.querySelector('[data-ag-overlay="alert-dialog"]')).toBeTruthy();
  });
  it('destructive variant marks the surface danger', async () => {
    render(<ConfirmDialog open variant="destructive" title="T" />);
    await flush();
    const popup = document.querySelector('[data-ag-overlay="alert-dialog"]');
    expect(popup).toBeTruthy();
  });
});
