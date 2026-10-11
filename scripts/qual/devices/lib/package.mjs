/* Device-side bundle: the probe code packaged for AWS Device Farm (zip
   containing an npm-style .tgz) and for the mac1.metal SSM command, plus the
   generated Device Farm test spec. Built in memory, deterministic, offline. */
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { zipStore } from './zip.mjs';

export const PACKAGE_NAME = 'ag-device-probe';
export const PACKAGE_VERSION = '1.0.0';
/** Files shipped to the device host, relative to scripts/qual/devices/. */
export const DEVICE_FILES = Object.freeze(['device-host.mjs', 'lib/device-entry.mjs', 'lib/drivers.mjs', 'lib/probe.mjs']);

/** Node for the mac1.metal (x86_64) host, verified by sha256 before use. */
export const MAC_NODE = Object.freeze({
  version: 'v22.23.3',
  url: 'https://nodejs.org/dist/v22.23.3/node-v22.23.3-darwin-x64.tar.gz',
  sha256: '8a677b0219178efd6eb0e475457c4afb452b521a92f6e67845a73bd85727f2a8',
  dir: 'node-v22.23.3-darwin-x64',
});

export function devicesDir() {
  /* lib/ → scripts/qual/devices/ */
  return join(dirname(fileURLToPath(import.meta.url)), '..');
}

function tarHeader(name, size) {
  const h = Buffer.alloc(512);
  h.write(name, 0, 100, 'utf8');
  h.write('0000644\0', 100);
  h.write('0000000\0', 108);
  h.write('0000000\0', 116);
  h.write(`${size.toString(8).padStart(11, '0')}\0`, 124);
  h.write('00000000000\0', 136); // mtime 0: deterministic
  h.write('        ', 148); // checksum placeholder
  h.write('0', 156);
  h.write('ustar\0', 257);
  h.write('00', 263);
  let sum = 0;
  for (const b of h) sum += b;
  h.write(`${sum.toString(8).padStart(6, '0')}\0 `, 148);
  return h;
}

/** entries: [{ name, data }] → gzip'd ustar archive. */
export function tarGz(entries) {
  const parts = [];
  for (const { name, data } of entries) {
    if (Buffer.byteLength(name) > 100) throw new Error(`tar: name too long: ${name}`);
    parts.push(tarHeader(name, data.length), data, Buffer.alloc((512 - (data.length % 512)) % 512));
  }
  parts.push(Buffer.alloc(1024));
  return gzipSync(Buffer.concat(parts), { level: 9 });
}

/** The npm-pack-shaped tarball (`package/…`) holding the device-side code. */
export function deviceTarball(readFile = (rel) => readFileSync(join(devicesDir(), rel))) {
  const pkg = { name: PACKAGE_NAME, version: PACKAGE_VERSION, private: true, type: 'module', files: [...DEVICE_FILES], dependencies: {} };
  const entries = [{ name: 'package/package.json', data: Buffer.from(`${JSON.stringify(pkg, null, 2)}\n`) }];
  for (const rel of DEVICE_FILES) entries.push({ name: `package/${rel}`, data: Buffer.from(readFile(rel)) });
  return tarGz(entries);
}

/** Device Farm APPIUM_WEB_NODE_TEST_PACKAGE: a zip containing the .tgz. */
export function deviceFarmPackage(tgz) {
  return zipStore([{ name: `${PACKAGE_NAME}-${PACKAGE_VERSION}.tgz`, data: tgz }]);
}

const shq = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;

/** Device Farm custom-environment test spec for one target, with the plan inlined. */
export function testSpecYaml(target, planB64) {
  if (!/^[A-Za-z0-9+/=]+$/.test(planB64)) throw new Error('test spec: plan must be base64');
  const pkg = '$DEVICEFARM_TEST_PACKAGE_PATH';
  const ios = target.platform === 'ios';
  const caps = JSON.stringify({
    'appium:deviceName': '$DEVICEFARM_DEVICE_NAME',
    platformName: '$DEVICEFARM_DEVICE_PLATFORM_NAME',
    'appium:udid': '$DEVICEFARM_DEVICE_UDID',
    'appium:platformVersion': '$DEVICEFARM_DEVICE_OS_VERSION',
    'appium:derivedDataPath': '$DEVICEFARM_WDA_DERIVED_DATA_PATH',
    'appium:usePrebuiltWDA': true,
    'appium:automationName': 'XCUITest',
    browserName: 'Safari',
  }).replace(/"/g, '\\"');
  const cmd = (s) => `      - ${JSON.stringify(s)}`;
  const lines = [
    'version: 0.1',
    'android_test_host: amazon_linux_2',
    'ios_test_host: macos_sequoia',
    'phases:',
    '  install:',
    '    commands:',
    cmd('devicefarm-cli use node 20'),
    ...(ios ? [cmd('devicefarm-cli use appium 2')] : []),
    '  pre_test:',
    '    commands:',
    cmd(`cd "${pkg}" && tar -xzf ${PACKAGE_NAME}-${PACKAGE_VERSION}.tgz`),
    ...(ios
      ? [
          cmd(`appium --base-path=/wd/hub --log-timestamp --log-no-colors --default-capabilities "${caps}" >> "$DEVICEFARM_LOG_DIR/appium.log" 2>&1 &`),
          cmd('for i in $(seq 1 90); do curl -sf http://127.0.0.1:4723/wd/hub/status >/dev/null && break; sleep 2; done'),
        ]
      : []),
    '  test:',
    '    commands:',
    cmd(`AG_DEVICE_PLAN=${planB64} node "${pkg}/package/device-host.mjs" ${target.platform}`),
    'artifacts:',
    '  - $DEVICEFARM_LOG_DIR',
    '',
  ];
  return lines.join('\n');
}

/** AWS-RunShellScript commands for the mac1.metal Safari host (SSM; no SSH keys). */
export function macCommands(planB64, tgz) {
  const n = MAC_NODE;
  return [
    'set -euo pipefail',
    'rm -rf /tmp/ag-devices && mkdir -p /tmp/ag-devices && cd /tmp/ag-devices',
    `curl -fsSL -o node.tgz ${shq(n.url)}`,
    `echo ${shq(`${n.sha256}  node.tgz`)} | shasum -a 256 -c -`,
    'tar -xzf node.tgz',
    `echo ${shq(tgz.toString('base64'))} | base64 -D > bundle.tgz`,
    'tar -xzf bundle.tgz',
    'chown -R ec2-user /tmp/ag-devices',
    'safaridriver --enable',
    'sudo -u ec2-user /bin/sh -c "safaridriver -p 4444 > /tmp/ag-devices/safaridriver.log 2>&1 &"',
    'for i in $(seq 1 30); do curl -sf http://127.0.0.1:4444/status >/dev/null && break; sleep 1; done',
    `sudo -u ec2-user env AG_DEVICE_PLAN=${planB64} /tmp/ag-devices/${n.dir}/bin/node /tmp/ag-devices/package/device-host.mjs macos`,
  ];
}
