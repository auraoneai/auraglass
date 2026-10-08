import { lazyPeer, lazyMember } from "../utils/optionalPeer";
/** Optional-peer shim for 'react-chartjs-2' (4.2 diet, REQ-PLAT-56). */
const mod = lazyPeer<typeof import("react-chartjs-2")>("react-chartjs-2");
export default mod;
export const Bar = lazyMember<(typeof import("react-chartjs-2"))["Bar"]>(
  "react-chartjs-2",
  "Bar"
);
export const Chart = lazyMember<(typeof import("react-chartjs-2"))["Chart"]>(
  "react-chartjs-2",
  "Chart"
);
export const Line = lazyMember<(typeof import("react-chartjs-2"))["Line"]>(
  "react-chartjs-2",
  "Line"
);
export const Pie = lazyMember<(typeof import("react-chartjs-2"))["Pie"]>(
  "react-chartjs-2",
  "Pie"
);
export const Scatter = lazyMember<
  (typeof import("react-chartjs-2"))["Scatter"]
>("react-chartjs-2", "Scatter");
