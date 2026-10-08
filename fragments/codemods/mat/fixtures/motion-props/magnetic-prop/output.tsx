// @ts-nocheck
import { Button } from "aura-glass";
import { magnetic } from "aura-glass/motion";

export function Cta() {
  // TODO(aura-glass 5): magnetic behaviour is now magnetic() from aura-glass/motion —
  // wire it onto the element ref (strength 0.6), see docs/motion.md
  return <Button>Buy</Button>;
}
