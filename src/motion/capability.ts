/* MAT-214 (§4.8, REQ-MAT-23): MotionCapability context. No implementation,
   no motion import — the optional `aura-glass/motion` adapter provides it. */
import { createContext } from 'react';
import type { MotionCapability } from '../contracts/motion';

export const MotionCapabilityContext = createContext<MotionCapability | null>(null);
