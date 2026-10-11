// Basic spring physics configuration
export const springConfig = {
  stiffness: 100,
  damping: 10,
  mass: 1,
};

export const gentleSpring = {
  stiffness: 50,
  damping: 15,
  mass: 1,
};

export const bouncySpring = {
  stiffness: 200,
  damping: 8,
  mass: 1,
};

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

/** @deprecated SpringPresets DEP-M0887 since 4.2.0, removed in 5.0.0. {@link the 5.x motion tokens} */
export const SpringPresets = {
  default: springConfig,
  gentle: gentleSpring,
  bouncy: bouncySpring,
};
