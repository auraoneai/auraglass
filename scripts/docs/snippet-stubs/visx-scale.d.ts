/* User-app dependency model for docs snippet type-checking (REQ-PLAT-102).
   Models @visx/scale's scaleLinear for the numeric use in the ChartFrame
   visx example. It never ships. */

export interface LinearScaleConfig {
  domain: [number, number];
  range: [number, number];
}

export declare function scaleLinear(config: LinearScaleConfig): (value: number) => number;
