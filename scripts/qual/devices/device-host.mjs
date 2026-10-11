#!/usr/bin/env node
/* Device-host launcher shipped inside the Device Farm test package and the
   mac1.metal SSM bundle: `node device-host.mjs <android|ios|macos>`.
   Node 20 hosts need --experimental-websocket for the CDP client; re-exec once. */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { deviceEntry } from './lib/device-entry.mjs';

const platform = process.argv[2];
if (platform === 'android' && typeof globalThis.WebSocket !== 'function' && !process.env.AG_DEVICE_REEXEC) {
  const r = spawnSync(process.execPath, ['--experimental-websocket', fileURLToPath(import.meta.url), platform], {
    stdio: 'inherit',
    env: { ...process.env, AG_DEVICE_REEXEC: '1' },
  });
  process.exit(r.status ?? 1);
}
deviceEntry(platform).then(
  () => process.exit(0),
  (e) => {
    console.error(`device-host: ${e.stack || e.message}`);
    process.exit(1);
  },
);
