import { lazyPeer, lazyMember } from "../utils/optionalPeer";
/** Optional-peer shim for 'chart.js' (4.2 diet, REQ-PLAT-56). */
const mod = lazyPeer<typeof import("chart.js")>("chart.js");
export default mod;
export const ArcElement = lazyMember<(typeof import("chart.js"))["ArcElement"]>(
  "chart.js",
  "ArcElement"
);
export const BarElement = lazyMember<(typeof import("chart.js"))["BarElement"]>(
  "chart.js",
  "BarElement"
);
export const CategoryScale = lazyMember<
  (typeof import("chart.js"))["CategoryScale"]
>("chart.js", "CategoryScale");
export const Chart = lazyMember<(typeof import("chart.js"))["Chart"]>(
  "chart.js",
  "Chart"
);
export const Filler = lazyMember<(typeof import("chart.js"))["Filler"]>(
  "chart.js",
  "Filler"
);
export const Legend = lazyMember<(typeof import("chart.js"))["Legend"]>(
  "chart.js",
  "Legend"
);
export const LineElement = lazyMember<
  (typeof import("chart.js"))["LineElement"]
>("chart.js", "LineElement");
export const LinearScale = lazyMember<
  (typeof import("chart.js"))["LinearScale"]
>("chart.js", "LinearScale");
export const PointElement = lazyMember<
  (typeof import("chart.js"))["PointElement"]
>("chart.js", "PointElement");
export const RadialLinearScale = lazyMember<
  (typeof import("chart.js"))["RadialLinearScale"]
>("chart.js", "RadialLinearScale");
export const Tooltip = lazyMember<(typeof import("chart.js"))["Tooltip"]>(
  "chart.js",
  "Tooltip"
);
export const defaults = lazyMember<(typeof import("chart.js"))["defaults"]>(
  "chart.js",
  "defaults"
);
