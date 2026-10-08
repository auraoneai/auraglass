// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
// fixture: banned media pattern
export function load(audio: HTMLAudioElement, url: string) {
  audio.src = url;
}
