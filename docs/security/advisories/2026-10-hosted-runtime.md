# GHSA draft — hand to repository owner (PLAT-122/127; agents never publish)

**Title:** Hosted example runtime: default JWT secret, missing authorization, and open WebSocket rooms

**Package:** `aura-glass` (npm). **Patched in:** 4.1.1. **Proposed severity:** High.

## Affected versions

Every published `aura-glass` version from 1.0.0 through 4.1.0, **only** when an
operator deploys the example runtime built from the repository `Dockerfile` or
`server/`. Using the component package in a browser or an app bundle is not
affected.

Derivation:

- `git log --diff-filter=A --format='%h %ad %s' --date=iso -- Dockerfile server/index.ts`:
  `Dockerfile` was added in `841fecd00` (2025-09-13) and `server/index.ts` in
  `df9456215` (2025-11-07 02:40:56 UTC; re-added in `54528965a`, 2025-11-11).
- `npm view aura-glass time`: the first published version, 1.0.0, is dated
  2025-11-07T03:21:02Z and 1.1.0 2025-11-07T03:36:23Z, both after those two
  commits. Neither has a git tag, so they are counted as affected rather than
  excluded. The earliest tag containing both files is `v2.0.1` (published
  2025-11-07T04:59:04Z); every later tag through `v4.1.0` (published
  2026-09-05T19:57:37Z) contains them.

## Scope

Deployments built from `Dockerfile`, `server/`, `src/services/**` or
`docker-compose.yml`. These are unsupported example code scheduled for
extraction (`SECURITY.md`, "Hosted runtime"). They are not in the npm `files`
list (`bin`, `dist`, `workers`, `README.md`, `LICENSE` at `v4.1.0`).

## Issues (file references at `v4.1.0`, commit `15b6de6f7`)

1. **Default JWT secret.** `Dockerfile:49-50` copies `.env.example` to `.env`
   inside the image (`COPY --chown=nodejs:nodejs .env.example .env`), and
   `.env.example:22` sets `JWT_SECRET=your-super-secret-jwt-key-change-in-production`.
   An image built without overriding the variable signs and verifies tokens
   with a public string, so anyone can mint a valid token for
   `server/index.ts` (`authenticateToken`, `:316-345`) and for the WebSocket
   server (`server/websocket-server.js:37-72`, `jwt.verify(token, JWT_SECRET)`
   at `:50`). The readiness check (`server/index.ts:61-70`) only tests that a
   secret is set, not that it differs from the example.
2. **Missing authorization.** `server/index.ts:348` (`aiRouter.use(authenticateToken)`)
   authenticates the caller, but no route checks what the caller may do: any
   token holder can call the paid model routes (`server/index.ts:350`
   generate-form, `server/index.ts:382` search, `server/index.ts:434`
   analyze-image, `server/index.ts:475` remove-background,
   `server/index.ts:497` summarize) and write to the shared semantic index
   (`server/index.ts:413` index-documents), and `server/index.ts:540`
   (`/api/auth/register`) issues such a token to anyone.
   `server/api-server.js:52-116` mounts the same AI routes with no
   authentication at all.
3. **Open WebSocket rooms.** The `join-room` handler
   (`server/websocket-server.js:86-150`) calls `socket.join(roomId)`
   (`server/websocket-server.js:95`) for any room id with no membership check
   and then sends that room's `documentState` to the joiner
   (`server/websocket-server.js:129-134`); `collaborative-edit`
   (`server/websocket-server.js:217`) and `cursor-move`
   (`server/websocket-server.js:193`) broadcast into whatever room the socket
   joined. Together with issue 1, an unauthenticated attacker can read and
   modify any collaboration room.

## Fix in 4.1.1

- `server/index.ts:31` calls `assertJwtSecret(process.env)` before anything
  else; `src/services/auth/auth-service.ts:50-60` exits 1 when `JWT_SECRET` is
  unset, equals the former example value (`EXAMPLE_JWT_SECRET`, `:42`) or is
  shorter than 32 characters.
- `.env.example:22` is `JWT_SECRET=` (empty), and the `Dockerfile` no longer
  copies `.env.example` into the image.
- `SECURITY.md` marks `server/`, `src/services/**`, `Dockerfile` and
  `docker-compose.yml` as unsupported example code scheduled for extraction.
  Issues 2 and 3 are not code-fixed in 4.x; the runtime is removed from the
  package line in 5.0 (B14).

## Mitigations (deployer's action)

- Set a unique, random `JWT_SECRET` of at least 32 bytes, rebuild, and rotate
  every token issued under the old value.
- Do not expose `server/`, `server/api-server.js` or `server/websocket-server.js`
  to untrusted networks; put them behind your own authentication and
  per-resource authorization.
- Replace every default from `.env.example` (secrets, `CLIENT_URL`, provider
  keys) before deploying.

## Proposed CVSS 3.1

`CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:L` — base score 7.7 (High).
`AC:H` because exploitation depends on the deployment having kept the example
secret or exposing the example servers; with that condition met, no
privileges or user interaction are needed, and the attacker reads and alters
collaboration documents and the semantic index (C:H, I:H) and can run up model
provider usage (A:L). The owner may adjust the vector when publishing.

## AuraOne consumer grep (bounded)

Run 2026-10-12 over `/Users/gurbakshchahal/AuraOne`, excluding
`node_modules`, `.git`, `dist`, `build`, `.next`, `artifacts` and lockfiles:

- Hosted-runtime use (`aura-glass/(server|dist/server)`,
  `auraglass.*(Dockerfile|websocket-server|api-server)`,
  `aura-glass.*JWT_SECRET`): **0 hits**.
- `"aura-glass"` in a `package.json`: **2 files** —
  `opensource/open-studio-platform/docs-template/package.json`,
  `opensource/open-studio-platform/templates/tauri-app/package.json`
  (component-package consumers, not affected).

## Owner action required

Publish this advisory as a GitHub Security Advisory before tagging v4.1.1, and
record the GHSA id and published time in the release issue. Agents must not
publish advisories or change security settings.
