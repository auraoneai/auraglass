# alpha-smoke fixture

Frozen minimal consumer app used by `tests/dx/quickstart.spec.ts` — the spec
copies this fixture, runs the packed CLI's init/add against it, then builds.
It deliberately contains no lockfile or node_modules so each run is cold.
