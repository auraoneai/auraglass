// fixtures.ts — deterministic sample data for ai-voice-input (no clocks, no randomness,
// no network — contract §3.3 file contract). Stories and showcases import it.
import type { VoiceInputActionProps } from './VoiceInputAction';

export const VOICE_INPUT_PROPS: VoiceInputActionProps = { 'aria-label': 'Dictate message' };

export const VOICE_INPUT_DISABLED_PROPS: VoiceInputActionProps = { 'aria-label': 'Dictate message', disabled: true };
