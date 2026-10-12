/* REQ-CMP-01 seam: Base UI imports are confined to src/components/** and
   src/foundation/** (tests/foundation/base-ui-pin.test.ts). Non-CMP consumers
   (SURF ai/app-shell/media, theme tests) import the pinned Base UI part from
   here. One module per Base UI entry so server modules never pull in client
   parts. Internal only: not re-exported from any public entry. */
export { Slider } from '@base-ui/react/slider';
