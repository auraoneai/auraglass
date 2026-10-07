// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
// fixture: banned media pattern
export function record(s: MediaStream) {
  return new MediaRecorder(s);
}
