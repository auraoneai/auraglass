import React from 'react';
import { ChartDataPoint, ChartSeries, ChartType } from '../types';

export interface DataProcessingOptions {
  normalize?: boolean;
  smooth?: boolean;
  smoothWindow?: number;
  removeOutliers?: boolean;
  outlierThreshold?: number;
  aggregate?: boolean;
  aggregateMethod?: 'sum' | 'avg' | 'min' | 'max' | 'count';
  aggregateWindow?: number;
  sort?: boolean;
  sortBy?: 'x' | 'y' | 'value';
  sortOrder?: 'asc' | 'desc';
  filter?: (point: ChartDataPoint) => boolean;
  transform?: (point: ChartDataPoint) => ChartDataPoint;
}

export class ChartDataUtils {
  /**
   * Normalize data points to a specific range
   */
  static normalizeData(
    data: ChartDataPoint[],
    min: number = 0,
    max: number = 1
  ): ChartDataPoint[] {
    if (data.length === 0) return data;

    const numericValues = data
      .map((p: any) => typeof p.y === 'number' ? p.y : 0)
      .filter((v: any) => !isNaN(v));

    if (numericValues.length === 0) return data;

    const dataMin = Math.min(...numericValues);
    const dataMax = Math.max(...numericValues);
    const range = dataMax - dataMin;

    if (range === 0) {
      return data.map((p: any) => ({
        ...p,
        y: typeof p.y === 'number' ? min : p.y,
      }));
    }

    return data.map((point: any) => {
      if (typeof point.y !== 'number') return point;

      const normalized = min + ((point.y - dataMin) / range) * (max - min);
      return {
        ...point,
        y: normalized,
      };
    });
  }

  /**
   * Apply smoothing to data points using moving average
   */
  static smoothData(
    data: ChartDataPoint[],
    windowSize: number = 3
  ): ChartDataPoint[] {
    if (data.length < windowSize || windowSize < 2) return data;

    const smoothed: ChartDataPoint[] = [];
    const halfWindow = Math.floor(windowSize / 2);

    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - halfWindow);
      const end = Math.min(data.length - 1, i + halfWindow);
      const values: number[] = [];

      for (let j = start; j <= end; j++) {
        const value: number = typeof data[j].y === 'number' ? (data[j].y as number) : 0;
        values.push(value);
      }

      const average = values.reduce((sum, val) => sum + val, 0) / values.length;

      smoothed.push({
        ...data[i],
        y: typeof data[i].y === 'number' ? average : data[i].y,
      });
    }

    return smoothed;
  }

  /**
   * Remove outliers using statistical methods
   */
  static removeOutliers(
    data: ChartDataPoint[],
    threshold: number = 2
  ): ChartDataPoint[] {
    const numericData = data.filter((p: any) => typeof p.y === 'number');
    if (numericData.length < 4) return data;

    const values = numericData.map((p: any) => p.y as number);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return data.filter((point: any) => {
      if (typeof point.y !== 'number') return true;
      return Math.abs(point.y - mean) <= threshold * stdDev;
    });
  }

  /**
   * Aggregate data points using various methods
   */
  static aggregateData(
    data: ChartDataPoint[],
    method: 'sum' | 'avg' | 'min' | 'max' | 'count' = 'avg',
    windowSize: number = 1
  ): ChartDataPoint[] {
    if (windowSize <= 1) return data;

    const aggregated: ChartDataPoint[] = [];

    for (let i = 0; i < data.length; i += windowSize) {
      const window = data.slice(i, i + windowSize);
      const numericValues = window
        .map((p: any) => typeof p.y === 'number' ? p.y : 0)
        .filter((v: any) => !isNaN(v));

      if (numericValues.length === 0) continue;

      let aggregatedValue: number;

      switch (method) {
        case 'sum':
          aggregatedValue = numericValues.reduce((sum, val) => sum + val, 0);
          break;
        case 'avg':
          aggregatedValue = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
          break;
        case 'min':
          aggregatedValue = Math.min(...numericValues);
          break;
        case 'max':
          aggregatedValue = Math.max(...numericValues);
          break;
        case 'count':
          aggregatedValue = numericValues.length;
          break;
        default:
          aggregatedValue = numericValues[0];
      }

      // Use the first point in the window as the base
      const basePoint = window[0];
      aggregated.push({
        ...basePoint,
        y: aggregatedValue,
        label: `${method}(${window.length})`,
      });
    }

    return aggregated;
  }

  /**
   * Sort data points by specified criteria
   */
  static sortData(
    data: ChartDataPoint[],
    sortBy: 'x' | 'y' | 'value' = 'x',
    order: 'asc' | 'desc' = 'asc'
  ): ChartDataPoint[] {
    return [...data].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'x':
          aValue = a.x;
          bValue = b.x;
          break;
        case 'y':
          aValue = typeof a.y === 'number' ? a.y : 0;
          bValue = typeof b.y === 'number' ? b.y : 0;
          break;
        case 'value':
          aValue = typeof a.y === 'number' ? a.y : a.x;
          bValue = typeof b.y === 'number' ? b.y : b.x;
          break;
      }

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return order === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      const numA = Number(aValue) || 0;
      const numB = Number(bValue) || 0;

      return order === 'asc' ? numA - numB : numB - numA;
    });
  }

  /**
   * Filter data points using a predicate function
   */
  static filterData(
    data: ChartDataPoint[],
    predicate: (point: ChartDataPoint) => boolean
  ): ChartDataPoint[] {
    return data.filter(predicate);
  }

  /**
   * Transform data points using a transformation function
   */
  static transformData(
    data: ChartDataPoint[],
    transformer: (point: ChartDataPoint) => ChartDataPoint
  ): ChartDataPoint[] {
    return data.map(transformer);
  }

  /**
   * Process data with multiple operations in sequence
   */
  static processData(
    data: ChartDataPoint[],
    options: DataProcessingOptions
  ): ChartDataPoint[] {
    let processed = [...data];

    if (options.filter) {
      processed = this.filterData(processed, options.filter);
    }

    if (options.transform) {
      processed = this.transformData(processed, options.transform);
    }

    if (options.removeOutliers) {
      processed = this.removeOutliers(
        processed,
        options.outlierThreshold || 2
      );
    }

    if (options.smooth) {
      processed = this.smoothData(
        processed,
        options.smoothWindow || 3
      );
    }

    if (options.aggregate) {
      processed = this.aggregateData(
        processed,
        options.aggregateMethod || 'avg',
        options.aggregateWindow || 1
      );
    }

    if (options.normalize) {
      processed = this.normalizeData(processed);
    }

    if (options.sort) {
      processed = this.sortData(
        processed,
        options.sortBy || 'x',
        options.sortOrder || 'asc'
      );
    }

    return processed;
  }

  /**
   * Generate sample data for testing
   */
  static generateSampleData(
    count: number = 20,
    type: 'linear' | 'sine' | 'random' | 'exponential' = 'random',
    range: [number, number] = [0, 100]
  ): ChartDataPoint[] {
    const data: ChartDataPoint[] = [];

    for (let i = 0; i < count; i++) {
      const x = i;
      let y: number;

      switch (type) {
        case 'linear':
          y = range[0] + (range[1] - range[0]) * (i / (count - 1));
          break;
        case 'sine':
          y = range[0] + (range[1] - range[0]) * (Math.sin(i * 0.5) + 1) / 2;
          break;
        case 'exponential':
          y = range[0] + (range[1] - range[0]) * Math.pow(i / (count - 1), 2);
          break;
        case 'random':
        default:
          y = range[0] + Math.random() * (range[1] - range[0]);
          break;
      }

      data.push({
        x,
        y,
        label: `Point ${i + 1}`,
      });
    }

    return data;
  }

  /**
   * Calculate statistical measures for data
   */
  static calculateStatistics(data: ChartDataPoint[]): {
    mean: number;
    median: number;
    mode: number[];
    variance: number;
    standardDeviation: number;
    min: number;
    max: number;
    range: number;
    quartiles: [number, number, number];
  } {
    const numericValues = data
      .map((p: any) => typeof p.y === 'number' ? p.y : 0)
      .filter((v: any) => !isNaN(v))
      .sort((a, b) => a - b);

    if (numericValues.length === 0) {
      return {
        mean: 0,
        median: 0,
        mode: [],
        variance: 0,
        standardDeviation: 0,
        min: 0,
        max: 0,
        range: 0,
        quartiles: [0, 0, 0],
      };
    }

    const mean = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
    const median = numericValues.length % 2 === 0
      ? (numericValues[numericValues.length / 2 - 1] + numericValues[numericValues.length / 2]) / 2
      : numericValues[Math.floor(numericValues.length / 2)];

    const variance = numericValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericValues.length;
    const standardDeviation = Math.sqrt(variance);

    const min = Math.min(...numericValues);
    const max = Math.max(...numericValues);
    const range = max - min;

    // Calculate quartiles
    const q1Index = Math.floor(numericValues.length * 0.25);
    const q2Index = Math.floor(numericValues.length * 0.5);
    const q3Index = Math.floor(numericValues.length * 0.75);

    const quartiles: [number, number, number] = [
      numericValues[q1Index],
      numericValues[q2Index],
      numericValues[q3Index],
    ];

    // Calculate mode (most frequent values)
    const frequency: { [key: number]: number } = {};
    numericValues.forEach((val: any) => {
      frequency[val] = (frequency[val] || 0) + 1;
    });

    const maxFrequency = Math.max(...Object.values(frequency));
    const mode = Object.keys(frequency)
      .filter((key: any) => frequency[Number(key)] === maxFrequency)
      .map(Number);

    return {
      mean,
      median,
      mode,
      variance,
      standardDeviation,
      min,
      max,
      range,
      quartiles,
    };
  }

  /**
   * Detect trends in data
   */
  static detectTrend(data: ChartDataPoint[]): 'increasing' | 'decreasing' | 'stable' | 'volatile' {
    const numericData = data.filter((p: any) => typeof p.y === 'number');
    if (numericData.length < 3) return 'stable';

    const values = numericData.map((p: any) => p.y as number);
    const diffs: number[] = [];

    for (let i = 1; i < values.length; i++) {
      diffs.push(values[i] - values[i - 1]);
    }

    const positiveDiffs = diffs.filter((d: any) => d > 0).length;
    const negativeDiffs = diffs.filter((d: any) => d < 0).length;
    const totalDiffs = diffs.length;

    const positiveRatio = positiveDiffs / totalDiffs;
    const negativeRatio = negativeDiffs / totalDiffs;

    if (positiveRatio > 0.7) return 'increasing';
    if (negativeRatio > 0.7) return 'decreasing';
    if (positiveRatio > 0.3 && negativeRatio > 0.3) return 'volatile';

    return 'stable';
  }
}

// Utility functions for common data processing patterns
export const normalizeData = (data: ChartDataPoint[], min?: number, max?: number) =>
  ChartDataUtils.normalizeData(data, min, max);

export const smoothData = (data: ChartDataPoint[], windowSize?: number) =>
  ChartDataUtils.smoothData(data, windowSize);

export const removeOutliers = (data: ChartDataPoint[], threshold?: number) =>
  ChartDataUtils.removeOutliers(data, threshold);

export const aggregateData = (
  data: ChartDataPoint[],
  method?: 'sum' | 'avg' | 'min' | 'max' | 'count',
  windowSize?: number
) => ChartDataUtils.aggregateData(data, method, windowSize);

export const sortData = (
  data: ChartDataPoint[],
  sortBy?: 'x' | 'y' | 'value',
  order?: 'asc' | 'desc'
) => ChartDataUtils.sortData(data, sortBy, order);

export const filterData = (data: ChartDataPoint[], predicate: (point: ChartDataPoint) => boolean) =>
  ChartDataUtils.filterData(data, predicate);

export const transformData = (data: ChartDataPoint[], transformer: (point: ChartDataPoint) => ChartDataPoint) =>
  ChartDataUtils.transformData(data, transformer);

export const processData = (data: ChartDataPoint[], options: DataProcessingOptions) =>
  ChartDataUtils.processData(data, options);

export const generateSampleData = (
  count?: number,
  type?: 'linear' | 'sine' | 'random' | 'exponential',
  range?: [number, number]
) => ChartDataUtils.generateSampleData(count, type, range);

export const calculateStatistics = (data: ChartDataPoint[]) =>
  ChartDataUtils.calculateStatistics(data);

export const detectTrend = (data: ChartDataPoint[]) =>
  ChartDataUtils.detectTrend(data);
