// .lighthouserc.js — PLAT-385. Docs Pages budgets; runs in the pages job.
module.exports = {
  ci: {
    collect: { staticDistDir: 'apps/docs/out', numberOfRuns: 1 },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
      },
    },
  },
};
