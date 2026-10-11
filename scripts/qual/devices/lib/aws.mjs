/* Resource tags (attempt-id, sha, lane, ttl) and the AWS CLI boundary.
   Credentials: only the runner's instance role (contract §4.13.4 rule 8,
   REQ-QUAL-48). The CLI is never given --profile and the run refuses to start
   when static or profile credentials are present in the environment. */
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { LANE } from './matrix.mjs';

export const TAG_KEYS = Object.freeze(['attempt-id', 'sha', 'lane', 'ttl']);

export function newAttemptId(env = process.env) {
  const parts = [env.CI_PIPELINE_ID, env.CI_JOB_ID].filter(Boolean);
  return [...parts, randomBytes(4).toString('hex')].join('-');
}

/** Tag map for one attempt; `ttl` is an absolute ISO-8601 expiry a sweeper can act on. */
export function buildTags({ attemptId, sha, ttlMinutes = 180, now = Date.now() }) {
  if (!attemptId) throw new Error('tags: attemptId is required');
  if (!/^[0-9a-f]{7,40}$/.test(String(sha ?? ''))) throw new Error(`tags: sha must be a git sha, got ${JSON.stringify(sha)}`);
  if (!(ttlMinutes > 0 && ttlMinutes <= 24 * 60)) throw new Error('tags: ttlMinutes must be in (0, 1440]');
  return { 'attempt-id': attemptId, sha, lane: LANE, ttl: new Date(now + ttlMinutes * 60_000).toISOString() };
}

/** EC2 `--tag-specifications` value for the given resource types. */
export function ec2TagSpecifications(tags, resourceTypes) {
  const list = Object.entries(tags).map(([Key, Value]) => ({ Key, Value }));
  return JSON.stringify(resourceTypes.map((ResourceType) => ({ ResourceType, Tags: list })));
}

/** Device Farm `tag-resource --tags` value. */
export function deviceFarmTags(tags) {
  return JSON.stringify(Object.entries(tags).map(([Key, Value]) => ({ Key, Value })));
}

/** Environment variables that would make the CLI use something other than the instance role. */
export const FORBIDDEN_CREDENTIAL_ENV = Object.freeze([
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_SESSION_TOKEN',
  'AWS_PROFILE',
  'AWS_DEFAULT_PROFILE',
  'AWS_SHARED_CREDENTIALS_FILE',
  'AWS_WEB_IDENTITY_TOKEN_FILE',
  'AWS_ROLE_ARN',
  'AWS_CONTAINER_CREDENTIALS_FULL_URI',
  'AWS_CONTAINER_CREDENTIALS_RELATIVE_URI',
]);

export function assertInstanceRoleOnly(env) {
  const present = FORBIDDEN_CREDENTIAL_ENV.filter((k) => env[k] != null && env[k] !== '');
  if (present.length) {
    throw new Error(`instance role only: refusing to run with ${present.join(', ')} set (credentials must come from the runner's instance role)`);
  }
}

/** sts get-caller-identity of an EC2 instance role is `arn:aws:sts::<acct>:assumed-role/<role>/i-<id>`. */
export function assertInstanceRoleIdentity(identity) {
  const arn = String(identity?.Arn ?? '');
  if (!/^arn:aws[a-z-]*:sts::\d{12}:assumed-role\/[^/]+\/i-[0-9a-f]{8,17}$/.test(arn)) {
    throw new Error(`instance role only: caller identity ${arn || '<none>'} is not an EC2 instance-role session`);
  }
  return arn;
}

/** Default executor: spawn the AWS CLI, JSON output, no shell. */
export function spawnExec(bin) {
  return (args, { input } = {}) =>
    new Promise((resolve, reject) => {
      const child = spawn(bin, args, { stdio: ['pipe', 'pipe', 'pipe'] });
      let out = '';
      let err = '';
      child.stdout.on('data', (d) => (out += d));
      child.stderr.on('data', (d) => (err += d));
      child.on('error', reject);
      child.on('close', (code) => (code === 0 ? resolve(out) : reject(new Error(`${bin} ${args.slice(0, 2).join(' ')} exited ${code}: ${err.trim()}`))));
      child.stdin.end(input ?? '');
    });
}

/**
 * AWS client over an injectable executor. Every call goes through `call`, which
 * rejects --profile and appends `--output json`.
 */
export function createAws({ exec, env = process.env }) {
  assertInstanceRoleOnly(env);
  const calls = [];
  async function call(service, op, args = [], { region } = {}) {
    if (args.includes('--profile')) throw new Error('instance role only: --profile is not allowed');
    const argv = [service, op, ...args, ...(region ? ['--region', region] : []), '--output', 'json'];
    calls.push(argv);
    const out = await exec(argv);
    return out && out.trim() ? JSON.parse(out) : {};
  }
  return { call, calls };
}
