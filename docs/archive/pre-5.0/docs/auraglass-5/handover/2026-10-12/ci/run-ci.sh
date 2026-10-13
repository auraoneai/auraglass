#!/usr/bin/env bash
# Runs the AuraGlass GitLab CI pipeline for one GitHub ref on this VM with gitlab-ci-local
# (GitLab CI credits exhausted). Usage: run-ci.sh <branch> <sha>
set -uo pipefail
BRANCH="$1"; SHA="$2"
ROOT=/srv/ag-ci; RUN="$ROOT/$SHA"; NODE_VER=22.20.0; GCL_VER=4.76.1
mkdir -p "$ROOT" "$RUN"
exec >"$RUN/driver.log" 2>&1
echo "start $(date -u +%FT%TZ) branch=$BRANCH sha=$SHA"

# node + gitlab-ci-local on the host (cached across runs)
if [ ! -x "$ROOT/node/bin/node" ]; then
  curl -fsSL "https://nodejs.org/dist/v$NODE_VER/node-v$NODE_VER-linux-x64.tar.xz" | tar -xJ -C "$ROOT"
  mv "$ROOT/node-v$NODE_VER-linux-x64" "$ROOT/node"
fi
export PATH="$ROOT/node/bin:$PATH"
[ "$(gitlab-ci-local --version 2>/dev/null)" = "$GCL_VER" ] || npm i -g --no-audit --no-fund "gitlab-ci-local@$GCL_VER"

# checkout on a real branch so CI_COMMIT_BRANCH = $BRANCH (workflow rules: contract/* -> pr/5x)
rm -rf "$RUN/repo"
git clone --quiet --no-tags --branch "$BRANCH" https://github.com/auraoneai/auraglass.git "$RUN/repo"
cd "$RUN/repo" && git checkout --quiet -B "$BRANCH" "$SHA" || { echo "checkout failed"; echo 99 >"$RUN/exit"; exit 99; }

gitlab-ci-local --list-json >"$RUN/jobs.json" 2>"$RUN/list.err"
echo "jobs listed: $(node -e "console.log(require('$RUN/jobs.json').length)" 2>/dev/null)"

# DIAG=1: every job allow_failure via a separate expanded pipeline file (tracked CI files untouched;
# a diagnostic pass, never a green-pipeline result)
GCL_FILE=()
if [ "${DIAG:-0}" = 1 ]; then
  [ -d "$ROOT/tools/node_modules/yaml" ] || (mkdir -p "$ROOT/tools" && cd "$ROOT/tools" && npm init -y >/dev/null && npm i --no-audit --no-fund yaml@2.8.1)
  mkdir -p .gitlab-ci-local
  gitlab-ci-local --preview >.gitlab-ci-local/expanded-preview.yml 2>"$RUN/preview.err"
  node "$ROOT/diag-overlay2.mjs" .gitlab-ci-local/expanded-preview.yml .gitlab-ci-local/diag.yml
  GCL_FILE=(--file .gitlab-ci-local/diag.yml)
fi

# Disk watch only (OS disk is 1 TB; a full pass peaks ~250 GB). Never prune volumes mid-run:
# gitlab-ci-local fills a job's volume before its container exists, so a prune empties live jobs.
docker volume prune -af >/dev/null 2>&1
(
  while sleep 120; do
    [ -f "$RUN/exit" ] && break
    df -h / | tail -1 >>"$RUN/disk.log"
  done
) &

gitlab-ci-local "${GCL_FILE[@]}" --concurrency 10 --no-color \
  --variable AG_REMOTE_RUNNER=1 >"$RUN/pipeline.log" 2>&1
echo $? >"$RUN/exit"
# job outcomes, artifacts and per-job logs live in .gitlab-ci-local/
cp -r .gitlab-ci-local/output "$RUN/job-logs" 2>/dev/null
tar -czf "$RUN/artifacts.tgz" -C .gitlab-ci-local artifacts 2>/dev/null
# job summary + logs back to the write-only blob container (SAS_BASE = container URL, SAS = token)
cd "$RUN" && grep -E "^\S.*finished in" pipeline.log | sed -E "s/ +finished in/ |/" | sort -u > summary.txt
if [ -n "${SAS:-}" ]; then
  tar -czf "$RUN/logs.tgz" job-logs summary.txt jobs.json pipeline.log driver.log 2>/dev/null
  for b in logs artifacts; do
    curl -sS -o /dev/null -w "upload $b %{http_code}\n" -X PUT -H 'x-ms-blob-type: BlockBlob' -T "$RUN/$b.tgz" "$SAS_BASE/$SHA/$b.tgz?$SAS"
  done
fi
echo "end $(date -u +%FT%TZ) exit=$(cat "$RUN/exit")"
