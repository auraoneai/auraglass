/* User-app dependency model for docs snippet type-checking (REQ-PLAT-102).
   Models the chart.js 4 surface the ChartFrame example drives: register,
   construct on a canvas with a bar config, destroy. It never ships. */

export interface ChartDataset {
  label?: string;
  data: number[];
  backgroundColor?: string;
}

export interface ChartConfig {
  type: 'bar';
  data: { labels: string[]; datasets: ChartDataset[] };
  options?: { animation?: false | undefined };
}

export declare class Chart {
  constructor(canvas: HTMLCanvasElement, config: ChartConfig);
  static register(...items: unknown[]): void;
  destroy(): void;
}

export declare const registerables: unknown[];
