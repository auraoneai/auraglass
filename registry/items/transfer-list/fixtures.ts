// fixtures.ts — deterministic transfer data (contract §3.3).
import type { TransferListProps } from './index';

export const transferProps: TransferListProps = {
  source: {
    title: 'Available',
    rows: [
      { id: 'u-1', label: 'Ada', hint: 'Design' },
      { id: 'u-2', label: 'Grace', hint: 'Build' },
      { id: 'u-3', label: 'Katherine', hint: 'Docs' },
      { id: 'u-4', label: 'Mary', hint: 'QA' },
    ],
  },
  target: {
    title: 'Reviewers',
    rows: [
      { id: 'u-5', label: 'Radia', hint: 'PLAT' },
    ],
  },
};
