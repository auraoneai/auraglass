export function classifyPlaywrightReport(report) {
  const tests = [];
  const walk = (suite) => {
    for (const spec of suite.specs ?? []) for (const t of spec.tests ?? []) tests.push(t);
    for (const s of suite.suites ?? []) walk(s);
  };
  for (const s of report.suites ?? []) walk(s);
  const failed = tests.filter((t) => t.status === 'unexpected');
  const pendingRe = /(^|[\s:])pending: /;
  const reasons = failed.map((t) => {
    const last = (t.results ?? []).at(-1);
    return String(last?.error?.message ?? last?.errors?.[0]?.message ?? '');
  });
  const pending = reasons.filter((m) => pendingRe.test(m));
  return { total: tests.length, failed: failed.length, pendingOnly: failed.length > 0 && pending.length === failed.length,
    pendingReasons: [...new Set(pending.map((m) => m.slice(m.search(pendingRe)).trim().split('\n')[0]))] };
}
