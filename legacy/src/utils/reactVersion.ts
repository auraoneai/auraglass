import React from "react";

/**
 * Detects whether the current React runtime exposes the React 19+ reconciler internals.
 * React 18 does not define the `S` slot, which newer reconcilers rely on.
 */
export const isReact19OrNewer = (): boolean => {
  const internals =
    // @ts-ignore - accessing React internals on purpose to detect React 19 shape
    (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

  return Boolean(
    internals && typeof internals === "object" && "S" in internals
  );
};

export const assertReact19ForThree = (): boolean => {
  if (!isReact19OrNewer()) {
    return false;
  }
  return true;
};
