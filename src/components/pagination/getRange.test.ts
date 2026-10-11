import { describe, expect, it } from '@jest/globals';
import { getPaginationRange } from './getRange';

interface Case {
  page: number;
  pageCount: number;
  siblingCount?: number | undefined;
  boundaryCount?: number | undefined;
  expect: Array<number | 'ellipsis-start' | 'ellipsis-end'>;
}

const E = 'ellipsis-start' as const;
const E2 = 'ellipsis-end' as const;

const cases: Case[] = [
  // pageCount 0..6: never ellipsizes
  { page: 1, pageCount: 1, expect: [1] },
  { page: 2, pageCount: 2, expect: [1, 2] },
  { page: 3, pageCount: 5, expect: [1, 2, 3, 4, 5] },
  { page: 1, pageCount: 0, expect: [] },
  { page: 1, pageCount: 6, expect: [1, 2, 3, 4, 5, 6] },
  { page: 3, pageCount: 6, expect: [1, 2, 3, 4, 5, 6] },
  { page: 6, pageCount: 6, expect: [1, 2, 3, 4, 5, 6] },

  // long range, defaults — window keeps 7 items at every page
  { page: 1, pageCount: 20, expect: [1, 2, 3, 4, 5, E2, 20] },
  { page: 2, pageCount: 20, expect: [1, 2, 3, 4, 5, E2, 20] },
  { page: 4, pageCount: 20, expect: [1, 2, 3, 4, 5, E2, 20] },
  { page: 5, pageCount: 20, expect: [1, E, 4, 5, 6, E2, 20] },
  { page: 10, pageCount: 20, expect: [1, E, 9, 10, 11, E2, 20] },
  { page: 16, pageCount: 20, expect: [1, E, 15, 16, 17, E2, 20] },
  { page: 17, pageCount: 20, expect: [1, E, 16, 17, 18, 19, 20] },
  { page: 19, pageCount: 20, expect: [1, E, 16, 17, 18, 19, 20] },
  { page: 20, pageCount: 20, expect: [1, E, 16, 17, 18, 19, 20] },

  // siblingCount 0
  { page: 1, pageCount: 20, siblingCount: 0, expect: [1, 2, 3, E2, 20] },
  { page: 10, pageCount: 20, siblingCount: 0, expect: [1, E, 10, E2, 20] },
  { page: 20, pageCount: 20, siblingCount: 0, expect: [1, E, 18, 19, 20] },

  // siblingCount 2
  { page: 1, pageCount: 20, siblingCount: 2, expect: [1, 2, 3, 4, 5, 6, 7, E2, 20] },
  { page: 10, pageCount: 20, siblingCount: 2, expect: [1, E, 8, 9, 10, 11, 12, E2, 20] },
  { page: 20, pageCount: 20, siblingCount: 2, expect: [1, E, 14, 15, 16, 17, 18, 19, 20] },

  // boundaryCount 0
  { page: 1, pageCount: 20, boundaryCount: 0, expect: [1, 2, 3, 4, E2] },
  { page: 10, pageCount: 20, boundaryCount: 0, expect: [E, 9, 10, 11, E2] },
  { page: 20, pageCount: 20, boundaryCount: 0, expect: [E, 17, 18, 19, 20] },

  // boundaryCount 2
  { page: 1, pageCount: 20, boundaryCount: 2, expect: [1, 2, 3, 4, 5, 6, E2, 19, 20] },
  { page: 10, pageCount: 20, boundaryCount: 2, expect: [1, 2, E, 9, 10, 11, E2, 19, 20] },
  { page: 20, pageCount: 20, boundaryCount: 2, expect: [1, 2, E, 15, 16, 17, 18, 19, 20] },

  // sibling+boundary together
  { page: 1, pageCount: 20, siblingCount: 0, boundaryCount: 0, expect: [1, 2, E2] },
  { page: 10, pageCount: 20, siblingCount: 0, boundaryCount: 0, expect: [E, 10, E2] },
  { page: 20, pageCount: 20, siblingCount: 0, boundaryCount: 0, expect: [E, 19, 20] },
  { page: 10, pageCount: 20, siblingCount: 2, boundaryCount: 2, expect: [1, 2, E, 8, 9, 10, 11, 12, E2, 19, 20] },

  // small counts
  { page: 4, pageCount: 7, expect: [1, 2, 3, 4, 5, 6, 7] },
  { page: 4, pageCount: 8, expect: [1, 2, 3, 4, 5, E2, 8] },
  { page: 5, pageCount: 8, expect: [1, E, 4, 5, 6, 7, 8] },
  { page: 5, pageCount: 9, expect: [1, E, 4, 5, 6, E2, 9] },
  { page: 9, pageCount: 9, expect: [1, E, 5, 6, 7, 8, 9] },

  // out-of-range pages clamp
  { page: 0, pageCount: 20, expect: [1, 2, 3, 4, 5, E2, 20] },
  { page: -3, pageCount: 20, expect: [1, 2, 3, 4, 5, E2, 20] },
  { page: 25, pageCount: 20, expect: [1, E, 16, 17, 18, 19, 20] },
];

describe('getPaginationRange', () => {
  it.each(cases)('page $page of $pageCount (sib $siblingCount, bnd $boundaryCount)', ({ page, pageCount, siblingCount, boundaryCount, expect: want }) => {
    expect(getPaginationRange({ page, pageCount, siblingCount, boundaryCount })).toEqual(want);
  });

  it('stable item count: once ellipsized the list length is constant', () => {
    const lengths = new Set<number>();
    for (let page = 1; page <= 20; page++) {
      lengths.add(getPaginationRange({ page, pageCount: 20 }).length);
    }
    expect([...lengths]).toEqual([7]);
  });

  it('invariants across the whole grid: sorted, current present, single item per page', () => {
    for (let pageCount = 6; pageCount <= 30; pageCount++) {
      for (let page = 1; page <= pageCount; page++) {
        const items = getPaginationRange({ page, pageCount });
        expect(items).toContain(page);
        const nums = items.filter((i): i is number => typeof i === 'number');
        expect([...nums].sort((a, b) => a - b)).toEqual(nums);
        expect(new Set(nums).size).toBe(nums.length);
        expect(Math.min(...nums)).toBeGreaterThanOrEqual(1);
        expect(Math.max(...nums)).toBeLessThanOrEqual(pageCount);
      }
    }
  });
});
