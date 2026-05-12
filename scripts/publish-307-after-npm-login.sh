#!/usr/bin/env bash
set -euo pipefail

PACKAGE_NAME="aura-glass"
VERSION="3.0.7"

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
  npm login --auth-type=web

Then rerun:
  ./scripts/publish-307-after-npm-login.sh
EOF
  exit 1
fi

echo "npm user: $npm_user"
echo "Package owners:"
npm owner ls "$PACKAGE_NAME"

echo
echo "Current public npm version:"
npm view "$PACKAGE_NAME" version

echo
echo "Running final package release gate..."
npm run release:dry-run

echo
echo "Publishing $PACKAGE_NAME@$VERSION to npm..."
npm publish --access public --provenance=false

echo
echo "Verifying public npm latest..."
published_version="$(npm view "$PACKAGE_NAME" version)"
echo "$published_version"
if [[ "$published_version" != "$VERSION" ]]; then
  echo "npm latest is $published_version, expected $VERSION" >&2
  exit 1
fi

cat <<EOF

$PACKAGE_NAME@$VERSION is published on npm.

Now verify the website from the registry package:

  cd /Users/gurbakshchahal/auraglasswebsite
  npm install $PACKAGE_NAME@$VERSION --legacy-peer-deps --no-audit --no-fund --force
  npm run typecheck -- --pretty false
  npm run build
  lsof -ti :3021 | xargs kill -9 2>/dev/null || true
  npx next start -p 3021
  AUDIT_URL=http://localhost:3021 AUDIT_REPORT_DIR=reports/website-3.0.7-registry bash scripts/audit/run.sh
  AUDIT_URL=http://localhost:3021 npx tsx scripts/audit/motion-sweep-307.ts
EOF
