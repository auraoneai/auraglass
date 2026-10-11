#!/usr/bin/env bash
# scripts/qual/remote/worker-entry.sh — REQ-QUAL-67 offline worker entry for `.ag-aws-remote` (QUAL, FIN-425).
#
#   worker-entry.sh <bundle.tar.gz | bundle dir> <lane> <scope> [results-uri]
#
# 1. Unpacks the bundle (scripts/qual/remote/build-bundle.mjs) and verifies EVERY file against bundle.sha256 and
#    bundle.manifest.json: a changed, missing or unlisted file aborts before anything runs (exit 65).
# 2. Runs `node certification/run.mjs --lane <lane> --scope <scope>` from bundle/repo with AG_REMOTE_RUNNER=1 and
#    AG_OFFLINE_BUNDLE=1: every Playwright context aborts non-127.0.0.1 requests (context.route('**', abort) in
#    certification/lanes/_fixtures/offline.ts); Storybook is served from bundle/storybook-static on 127.0.0.1:6006.
# 3. Halts the run after 120 minutes (timeout; exit 124 is reported as a failure, never as a pass).
# 4. Uploads .artifacts/qual/ to <results-uri> (s3://…, instance role only, no credentials in env or files) — always,
#    also after a failure or the timeout. AG_WORKER_POWEROFF=1 powers the instance off afterwards.
# Exit: the lane runner's code (0/1/…), 124 on timeout, 65 on bundle verification failure, 64 on usage, 70 on upload failure.
set -euo pipefail

usage() { echo "usage: worker-entry.sh <bundle.tar.gz|bundle-dir> <L1..L12|all> <pr|main|nightly|release> [s3://results-uri]" >&2; exit 64; }
[[ $# -ge 3 && $# -le 4 ]] || usage
SRC=$1 LANE=$2 SCOPE=$3 RESULTS_URI=${4:-${AG_RESULTS_URI:-}}
[[ $LANE =~ ^(L([1-9]|1[0-2])|all)$ ]] || usage
[[ $SCOPE =~ ^(pr|main|nightly|release)$ ]] || usage
HALT_MINUTES=${AG_WORKER_HALT_MINUTES:-120}
[[ $HALT_MINUTES =~ ^[0-9]+$ && $HALT_MINUTES -ge 1 && $HALT_MINUTES -le 120 ]] || { echo "worker-entry: AG_WORKER_HALT_MINUTES must be 1..120" >&2; exit 64; }

# ---- 1. unpack + verify
if [[ -d $SRC ]]; then
  BUNDLE=$(cd "$SRC" && pwd)
else
  WORK=$(mktemp -d "${TMPDIR:-/tmp}/ag-worker-XXXXXX")
  tar -xzf "$SRC" -C "$WORK"
  BUNDLE="$WORK/bundle"
fi
[[ -f $BUNDLE/bundle.manifest.json && -f $BUNDLE/bundle.sha256 ]] || { echo "worker-entry: $BUNDLE has no bundle.manifest.json / bundle.sha256" >&2; exit 65; }
cd "$BUNDLE"
if command -v sha256sum >/dev/null; then SHACHECK=(sha256sum --check --strict --quiet); else SHACHECK=(shasum -a 256 --check --strict --quiet); fi
if ! "${SHACHECK[@]}" bundle.sha256; then echo "worker-entry: bundle hash verification FAILED" >&2; exit 65; fi
# the manifest and the sha256 list must describe the same files, and no unlisted regular file may exist
node -e '
  const fs = require("fs");
  const m = JSON.parse(fs.readFileSync("bundle.manifest.json", "utf8"));
  const list = fs.readFileSync("bundle.sha256", "utf8").trim().split("\n").map((l) => { const i = l.indexOf("  "); return [l.slice(i + 2), l.slice(0, i)]; });
  const fromList = new Map(list);
  const bad = [];
  if (fromList.size !== m.files.length) bad.push(`manifest lists ${m.files.length} files, bundle.sha256 ${fromList.size}`);
  for (const f of m.files) if (fromList.get(f.path) !== f.sha256) bad.push(`manifest/sha256 mismatch: ${f.path}`);
  const listed = new Set(m.files.map((f) => f.path));
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = d === "." ? e.name : `${d}/${e.name}`;
    if (e.isDirectory()) walk(p); else if (e.isFile() && !["bundle.manifest.json", "bundle.sha256"].includes(p) && !listed.has(p)) bad.push(`unlisted file: ${p}`); } };
  walk(".");
  if (!/^sha256:[0-9a-f]{64}$/.test(m.imageDigest ?? "")) bad.push("manifest has no image digest");
  if (bad.length) { console.error("worker-entry: bundle manifest check FAILED\n  " + bad.slice(0, 20).join("\n  ")); process.exit(65); }
  console.log(`worker-entry: bundle verified — ${m.files.length} files, git ${m.gitSha}, image ${m.imageDigest}`);
'
GIT_SHA=$(node -p 'require("./bundle.manifest.json").gitSha')
TARBALL="$BUNDLE/package/$(node -p 'require("./bundle.manifest.json").tarball')"

# ---- 2. offline environment
export AG_REMOTE_RUNNER=1 AG_OFFLINE_BUNDLE=1 AG_SCOPE="$SCOPE" AG_LINE=5x CI_COMMIT_SHA="$GIT_SHA"
export PLAYWRIGHT_BROWSERS_PATH="$BUNDLE/browsers" PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 TESSDATA_PREFIX="$BUNDLE/tessdata"
export PATH="$BUNDLE/tools:$BUNDLE/repo/node_modules/.bin:$PATH"
export AURAGLASS_TARBALL="$TARBALL" AG_STORYBOOK_STATIC="$BUNDLE/storybook-static" AG_STORYBOOK_URL="http://127.0.0.1:6006"
export AURAGLASS_EVIDENCE_DIR=.artifacts CI_JOB_NAME_SLUG="${CI_JOB_NAME_SLUG:-qual-certify-$(echo "$LANE" | tr 'A-Z' 'a-z')-aws}"
export npm_config_offline=true
cd "$BUNDLE/repo"
mkdir -p .artifacts/qual
ln -sfn "$BUNDLE/storybook-static" storybook-static

node tests/perf/harness/run-perf.mjs --serve "$BUNDLE/storybook-static" --port 6006 > .artifacts/qual/storybook-server.log 2>&1 &
SERVER=$!

upload() {
  local rc=$?
  if kill -0 "$SERVER" 2>/dev/null; then kill "$SERVER"; fi
  local up=0
  if [[ -n $RESULTS_URI ]]; then
    aws s3 cp --recursive --only-show-errors .artifacts/qual/ "${RESULTS_URI%/}/$GIT_SHA/$CI_JOB_NAME_SLUG/" || up=70
  else
    echo "worker-entry: no results URI (arg 4 / AG_RESULTS_URI): evidence left in $BUNDLE/repo/.artifacts/qual" >&2; up=70
  fi
  if [[ ${AG_WORKER_POWEROFF:-0} == 1 ]] && ! sudo shutdown -h +1 "auraglass cert worker done"; then echo "worker-entry: poweroff failed" >&2; fi
  if [[ $rc -eq 0 && $up -ne 0 ]]; then exit $up; fi
  exit $rc
}
trap upload EXIT

for _ in $(seq 1 120); do
  if node -e 'fetch("http://127.0.0.1:6006/index.json").then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))'; then break; fi
  sleep 0.5
done
node -e 'fetch("http://127.0.0.1:6006/index.json").then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))' \
  || { echo "worker-entry: storybook-static not served on 127.0.0.1:6006" >&2; exit 1; }

# ---- 3. run, halting after HALT_MINUTES
set +e
timeout --signal=TERM --kill-after=60s "${HALT_MINUTES}m" node certification/run.mjs --lane "$LANE" --scope "$SCOPE"
RC=$?
set -e
if [[ $RC -eq 124 ]]; then echo "worker-entry: halted after ${HALT_MINUTES} minutes (REQ-QUAL-67); the run is a failure" >&2; fi
exit $RC
