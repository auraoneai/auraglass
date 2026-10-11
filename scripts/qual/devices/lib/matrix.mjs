/* REQ-QUAL-48 real-device matrix (REQ-FIN-105, FIN-447).
   Targets, subjects and budgets for `qual:certify:devices`. The numbers here are
   the PRD gate (REQ-QUAL-48, AURAGLASS_QUALITY_SHOWCASE_PRD §8 "Real devices"),
   not measurements; measurements are only ever written by a real run. */

/** Lane id recorded in every resource tag and in the results file. */
export const LANE = 'qual:certify:devices';

/** AWS Device Farm exists only in us-west-2. */
export const DEVICE_FARM_REGION = 'us-west-2';

/** Frame budgets (ms). flagship: Pixel 7, iPhone 13, Intel proxy. mid: Moto G Power class. */
export const BUDGETS = Object.freeze({
  flagshipMs: 16.7,
  midMs: 25,
  /** One signed exception per release may sit in (midMs, midExceptionMaxMs] on mid-tier Android. */
  midExceptionMaxMs: 33,
  maxSignedExceptions: 1,
});

/**
 * Device targets. `filters` are AWS Device Farm DeviceSelectionConfiguration
 * filters (attribute / operator / values); `maxDevices: 1` per target.
 */
export const TARGETS = Object.freeze([
  {
    id: 'iphone13-ios18-safari',
    provider: 'device-farm',
    platform: 'ios',
    browser: 'safari',
    tier: 'flagship',
    label: 'iPhone 13 / Safari 18',
    filters: [
      { attribute: 'PLATFORM', operator: 'EQUALS', values: ['IOS'] },
      { attribute: 'MODEL', operator: 'EQUALS', values: ['Apple iPhone 13'] },
      { attribute: 'OS_VERSION', operator: 'GREATER_THAN_OR_EQUALS', values: ['18'] },
      { attribute: 'OS_VERSION', operator: 'LESS_THAN', values: ['19'] },
      { attribute: 'AVAILABILITY', operator: 'EQUALS', values: ['HIGHLY_AVAILABLE'] },
    ],
  },
  {
    id: 'iphone13-ios26-safari',
    provider: 'device-farm',
    platform: 'ios',
    browser: 'safari',
    tier: 'flagship',
    label: 'iPhone 13 / Safari 26',
    filters: [
      { attribute: 'PLATFORM', operator: 'EQUALS', values: ['IOS'] },
      { attribute: 'MODEL', operator: 'EQUALS', values: ['Apple iPhone 13'] },
      { attribute: 'OS_VERSION', operator: 'GREATER_THAN_OR_EQUALS', values: ['26'] },
      { attribute: 'OS_VERSION', operator: 'LESS_THAN', values: ['27'] },
      { attribute: 'AVAILABILITY', operator: 'EQUALS', values: ['HIGHLY_AVAILABLE'] },
    ],
  },
  {
    id: 'pixel7-chrome',
    provider: 'device-farm',
    platform: 'android',
    browser: 'chrome',
    tier: 'flagship',
    label: 'Pixel 7 / Chrome',
    filters: [
      { attribute: 'PLATFORM', operator: 'EQUALS', values: ['ANDROID'] },
      { attribute: 'MODEL', operator: 'EQUALS', values: ['Google Pixel 7'] },
      { attribute: 'AVAILABILITY', operator: 'EQUALS', values: ['HIGHLY_AVAILABLE'] },
    ],
  },
  {
    id: 'moto-g-power-chrome',
    provider: 'device-farm',
    platform: 'android',
    browser: 'chrome',
    tier: 'mid',
    label: 'Moto G Power class / Chrome',
    filters: [
      { attribute: 'PLATFORM', operator: 'EQUALS', values: ['ANDROID'] },
      { attribute: 'MODEL', operator: 'CONTAINS', values: ['moto g power'] },
      { attribute: 'AVAILABILITY', operator: 'EQUALS', values: ['HIGHLY_AVAILABLE'] },
    ],
  },
  {
    id: 'mac1-metal-safari',
    provider: 'ec2-mac',
    platform: 'macos',
    browser: 'safari',
    tier: 'flagship',
    label: 'EC2 mac1.metal / Safari (Intel-Mac proxy)',
    instanceType: 'mac1.metal',
  },
]);

/** The six S1 showcases (REQ-QUAL-58 table, tier S1). */
export const S1_SHOWCASES = Object.freeze([
  'ai-command-center',
  'financial-dashboard',
  'ops-console',
  'media-workspace',
  'collaborative-workspace',
  'mobile-productivity',
]);

/**
 * Subjects measured on every target. `kind` selects how the story id is
 * resolved from the SubjectIndex (REPORTS.subjects); `interaction` selects the
 * in-page drive of the rAF probe.
 */
export const SUBJECTS = Object.freeze([
  ...S1_SHOWCASES.map((id) => ({ subject: id, kind: 'showcase', interaction: 'scroll' })),
  { subject: 'Dialog', kind: 'component', interaction: 'open-close' },
  { subject: 'AppShell', kind: 'component', interaction: 'scroll' },
]);

/** Probe window per cell (ms) — matches the 5 s scripted interaction of REQ-QUAL-34. */
export const PROBE_WINDOW_MS = 5000;

export function budgetFor(target) {
  return target.tier === 'mid' ? BUDGETS.midMs : BUDGETS.flagshipMs;
}
