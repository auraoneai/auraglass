#!/usr/bin/env bash
set -euo pipefail

PACKAGE_NAME="aura-glass"
VERSION="3.0.7"
REPO="auraoneai/auraglass"
WORKFLOW_FILE="publish-npm.yml"

cd "$(dirname "$0")/.."

actual_version="$(node -p "require('./package.json').version")"
if [[ "$actual_version" != "$VERSION" ]]; then
  echo "package.json version is $actual_version, expected $VERSION" >&2
  exit 1
fi

echo "Checking npm authentication..."
if ! npm_user="$(npm whoami 2>/dev/null)"; then
  cat >&2 <<EOF
Not logged into npm with a valid publish-capable account.

Run:
  npm login

Then rerun:
  ./scripts/configure-npm-trusted-publishing-307.sh
EOF
  exit 1
fi

echo "npm user: $npm_user"
echo "Current package owners:"
npm owner ls "$PACKAGE_NAME"

echo
echo "Configuring npm trusted publishing for:"
echo "  package:    $PACKAGE_NAME"
echo "  repository: $REPO"
echo "  workflow:   $WORKFLOW_FILE"
echo

npm trust github "$PACKAGE_NAME" --repo "$REPO" --file "$WORKFLOW_FILE" -y

echo
echo "Trusted publisher relationships:"
npm trust list "$PACKAGE_NAME"

echo
echo "Triggering GitHub publish workflow for $PACKAGE_NAME@$VERSION..."
gh workflow run "$WORKFLOW_FILE" --repo "$REPO" -f version="$VERSION" --ref main

cat <<EOF

Publish workflow triggered.

Watch the latest run:
  gh run list --repo $REPO --workflow $WORKFLOW_FILE --limit 5
  gh run watch <RUN_ID> --repo $REPO --exit-status

After it completes, verify npm:
  npm view $PACKAGE_NAME version
  npm view $PACKAGE_NAME dist-tags --json

The release is not complete until npm latest returns $VERSION.
EOF
