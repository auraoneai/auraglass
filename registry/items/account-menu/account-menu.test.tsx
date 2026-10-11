/* CMP-345: account-menu render harness. */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, act } from '@testing-library/react';
import { AccountMenu } from './index';

const flush = async () => { await act(async () => {}); };

describe('registry item account-menu', () => {
  it('renders an avatar trigger labelled for the account', async () => {
    render(<AccountMenu name="Amara Osei" email="a@x.io" items={[{ id: 'p', label: 'Profile' }]} />);
    await flush();
    expect(document.querySelector('[aria-label="Account menu for Amara Osei"]')).toBeTruthy();
  });
});
