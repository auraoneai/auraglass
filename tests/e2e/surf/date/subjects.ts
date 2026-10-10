// Subject lookup for the SURF date specs (REQ-SURF-100..104). A missing story
// subject FAILS the test — it never turns into an early `pending` return.
import { expect } from '@playwright/test';
import { listSubjects } from '../../../helpers';

/** Story id for `subject` (optionally the story whose id ends with `--<story>`). */
export async function requireStory(subject: string, story?: string): Promise<string> {
  const subjects = await listSubjects({ owner: 'SURF' });
  const match = subjects.find((s) => s.subject === subject && (story === undefined || s.id.endsWith(`--${story}`)));
  expect(match, `story subject ${subject}${story ? ` (--${story})` : ''} must be registered in the Storybook under test`).toBeTruthy();
  return match!.id;
}
