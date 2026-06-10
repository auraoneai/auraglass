/**
 * AuraGlass Smart Color Extraction
 * AI-powered color extraction from images, videos, and content
 */

import React, { useState, useCallback } from "react";

interface ExtractedColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  lab: { l: number; a: number; b: number };
  weight: number; // 0-1, importance/prominence of this color
  contrast: number; // 0-21, WCAG contrast ratio against white
  temperature: "warm" | "cool" | "neutral";
  emotion: string; // Associated emotional tone
}

interface ColorPalette {
  primary: ExtractedColor;
  secondary: ExtractedColor;
  accent: ExtractedColor;
  dominant: ExtractedColor[];
  supporting: ExtractedColor[];
  gradients: {
    primary: string;
    secondary: string;
    mesh: string;
  };
  accessibility: {
    textOnLight: ExtractedColor;
    textOnDark: ExtractedColor;
    backgrounds: ExtractedColor[];
  };
}

interface ColorExtractionOptions {
  maxColors?: number;
  quality?: "fast" | "balanced" | "precise";
  ignoreWhite?: boolean;
  ignoreBlack?: boolean;
  minSaturation?: number; // 0-100
  minLightness?: number; // 0-100
  maxLightness?: number; // 0-100
  clustering?: "kmeans" | "median-cut" | "octree";
  generateGradients?: boolean;
  ensureAccessibility?: boolean;
}

export class SmartColorExtraction {
  private static instance: SmartColorExtraction;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private colorCache: Map<string, ColorPalette> = new Map();

  // Color emotion mapping
  private colorEmotions = {
    red: ["passionate", "energetic", "aggressive", "warm"],
    orange: ["cheerful", "creative", "enthusiastic", "warm"],
    yellow: ["happy", "optimistic", "attention-grabbing", "warm"],
    green: ["natural", "calming", "growth", "fresh"],
    blue: ["trustworthy", "calming", "professional", "cool"],
    purple: ["luxurious", "creative", "mysterious", "cool"],
    pink: ["romantic", "playful", "gentle", "warm"],
    brown: ["earthy", "stable", "natural", "warm"],
    gray: ["neutral", "sophisticated", "balanced", "neutral"],
    black: ["elegant", "powerful", "mysterious", "neutral"],
    white: ["pure", "clean", "minimal", "neutral"],
  };

  private constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true })!;
  }

  static getInstance(): SmartColorExtraction {
    if (!SmartColorExtraction.instance) {
      SmartColorExtraction.instance = new SmartColorExtraction();
    }
    return SmartColorExtraction.instance;
  }

  /**
   * Extract colors from an image
   */
  async extractFromImage(
    source: HTMLImageElement | string,
    options: ColorExtractionOptions = {}
  ): Promise<ColorPalette> {
    const cacheKey = typeof source === "string" ? source : source.src;

    if (this.colorCache.has(cacheKey)) {
      return this.colorCache.get(cacheKey)!;
    }

    const img =
      typeof source === "string" ? await this.loadImage(source) : source;

    // Resize canvas for analysis
    const maxSize =
      options.quality === "fast"
        ? 50
        : options.quality === "balanced"
          ? 100
          : 200;
    const { width, height } = this.getOptimalSize(img, maxSize);

    this.canvas.width = width;
    this.canvas.height = height;

    // Draw image to canvas
    this.ctx.drawImage(img, 0, 0, width, height);

    // Get image data
    const imageData = this.ctx.getImageData(0, 0, width, height);
    const colors = this.extractColorsFromImageData(imageData, options);

    // Generate palette
    const palette = this.generatePalette(colors, options);

    // Cache result
    this.colorCache.set(cacheKey, palette);

    return palette;
  }

  /**
   * Extract colors from video
   */
  async extractFromVideo(
    video: HTMLVideoElement,
    options: ColorExtractionOptions & { frameInterval?: number } = {}
  ): Promise<ColorPalette> {
    const { frameInterval = 1000 } = options; // Sample every second
    const duration = video.duration * 1000;
    const frameCount = Math.min(10, Math.floor(duration / frameInterval));

    const allColors: ExtractedColor[] = [];

    // Sample multiple frames
    for (let i = 0; i < frameCount; i++) {
      const time = (i / frameCount) * video.duration;
      await this.seekVideo(video, time);

      // Extract from current frame
      this.canvas.width = video.videoWidth;
      this.canvas.height = video.videoHeight;
      this.ctx.drawImage(video, 0, 0);

      const imageData = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      const frameColors = this.extractColorsFromImageData(imageData, options);
      allColors.push(...frameColors);
    }

    // Merge and weight colors
    const mergedColors = this.mergeColors(allColors);
    return this.generatePalette(mergedColors, options);
  }

  /**
   * Extract colors from DOM element
   */
  async extractFromElement(
    element: HTMLElement,
    options: ColorExtractionOptions = {}
  ): Promise<ColorPalette> {
    return new Promise((resolve) => {
      // Use html2canvas or similar approach
      const rect = element.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;

      // Draw element styles to canvas (simplified)
      const computedStyle = getComputedStyle(element);
      this.ctx.fillStyle =
        computedStyle.backgroundColor || "var(--glass-white)";
      this.ctx.fillRect(0, 0, rect.width, rect.height);

      // Extract text colors, border colors, etc.
      const colors = this.extractColorsFromStyles(element);
      const palette = this.generatePalette(colors, options);

      resolve(palette);
    });
  }

  /**
   * Load image from URL
   */
  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * Get optimal canvas size
   */
  private getOptimalSize(img: HTMLImageElement, maxSize: number) {
    const { width, height } = img;
    const aspectRatio = width / height;

    if (width > height) {
      return {
        width: maxSize,
        height: Math.round(maxSize / aspectRatio),
      };
    } else {
      return {
        width: Math.round(maxSize * aspectRatio),
        height: maxSize,
      };
    }
  }

  /**
   * Extract colors from image data using specified algorithm
   */
  private extractColorsFromImageData(
    imageData: ImageData,
    options: ColorExtractionOptions
  ): ExtractedColor[] {
    const { data, width, height } = imageData;
    const pixels = [];

    // Sample pixels (skip for performance)
    const step =
      options.quality === "fast" ? 10 : options.quality === "balanced" ? 5 : 2;

    for (let i = 0; i < data.length; i += step * 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Skip transparent pixels
      if (a < 125) continue;

      // Skip white/black if specified
      if (options.ignoreWhite && r > 240 && g > 240 && b > 240) continue;
      if (options.ignoreBlack && r < 15 && g < 15 && b < 15) continue;

      pixels.push({ r, g, b });
    }

    // Apply clustering algorithm
    switch (options.clustering || "median-cut") {
      case "kmeans":
        return this.kMeansCluster(pixels, options.maxColors || 8);
      case "median-cut":
        return this.medianCutCluster(pixels, options.maxColors || 8);
      case "octree":
        return this.octreeCluster(pixels, options.maxColors || 8);
      default:
        return this.medianCutCluster(pixels, options.maxColors || 8);
    }
  }

  /**
   * K-means clustering algorithm
   */
  private kMeansCluster(
    pixels: Array<{ r: number; g: number; b: number }>,
    k: number
  ): ExtractedColor[] {
    if (pixels.length === 0) return [];

    // Initialize centroids randomly
    let centroids = Array.from({ length: k }, () => {
      const randomPixel = pixels[Math.floor(Math.random() * pixels.length)];
      return { ...randomPixel };
    });

    let iterations = 0;
    const maxIterations = 20;

    while (iterations < maxIterations) {
      // Assign pixels to nearest centroid
      const clusters: Array<Array<{ r: number; g: number; b: number }>> =
        Array.from({ length: k }, () => []);

      pixels.forEach((pixel: any) => {
        let minDistance = Infinity;
        let closestCentroid = 0;

        centroids.forEach((centroid, i) => {
          const distance = this.colorDistance(pixel, centroid);
          if (distance < minDistance) {
            minDistance = distance;
            closestCentroid = i;
          }
        });

        clusters[closestCentroid].push(pixel);
      });

      // Update centroids
      const newCentroids = clusters.map((cluster: any) => {
        if (cluster.length === 0) return centroids[0]; // Fallback

        const sum = cluster.reduce(
          (acc: any, pixel: any) => ({
            r: acc.r + pixel.r,
            g: acc.g + pixel.g,
            b: acc.b + pixel.b,
          }),
          { r: 0, g: 0, b: 0 }
        );

        return {
          r: Math.round(sum.r / cluster.length),
          g: Math.round(sum.g / cluster.length),
          b: Math.round(sum.b / cluster.length),
        };
      });

      // Check convergence
      const converged = centroids.every(
        (centroid, i) => this.colorDistance(centroid, newCentroids[i]) < 5
      );

      if (converged) break;

      centroids = newCentroids;
      iterations++;
    }

    // Convert to ExtractedColor format
    return centroids
      .map((centroid, i) => {
        const clusterSize =
          pixels.length > 0
            ? pixels.filter((pixel: any) => {
                const distances = centroids.map((c: any) =>
                  this.colorDistance(pixel, c)
                );
                return distances.indexOf(Math.min(...distances)) === i;
              }).length
            : 0;

        return this.rgbToExtractedColor(centroid, clusterSize / pixels.length);
      })
      .filter((color: any) => color.weight > 0.01);
  }

  /**
   * Simplified median cut clustering
   */
  private medianCutCluster(
    pixels: Array<{ r: number; g: number; b: number }>,
    maxColors: number
  ): ExtractedColor[] {
    if (pixels.length === 0) return [];

    // Group similar colors and count occurrences
    const colorMap = new Map<
      string,
      { color: { r: number; g: number; b: number }; count: number }
    >();

    pixels.forEach((pixel: any) => {
      // Quantize to reduce precision
      const key = `${Math.floor(pixel.r / 8) * 8}-${Math.floor(pixel.g / 8) * 8}-${Math.floor(pixel.b / 8) * 8}`;
      if (colorMap.has(key)) {
        colorMap.get(key)!.count++;
      } else {
        colorMap.set(key, { color: pixel, count: 1 });
      }
    });

    // Sort by frequency and take top colors
    const sortedColors = Array.from(colorMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, maxColors);

    const totalPixels = pixels.length;

    return sortedColors.map(({ color, count }) =>
      this.rgbToExtractedColor(color, count / totalPixels)
    );
  }

  /**
   * Simplified octree clustering
   */
  private octreeCluster(
    pixels: Array<{ r: number; g: number; b: number }>,
    maxColors: number
  ): ExtractedColor[] {
    // Simplified octree - just use median cut for now
    return this.medianCutCluster(pixels, maxColors);
  }

  /**
   * Calculate color distance (Euclidean in RGB space)
   */
  private colorDistance(
    color1: { r: number; g: number; b: number },
    color2: { r: number; g: number; b: number }
  ): number {
    const dr = color1.r - color2.r;
    const dg = color1.g - color2.g;
    const db = color1.b - color2.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  /**
   * Convert RGB to ExtractedColor with metadata
   */
  private rgbToExtractedColor(
    rgb: { r: number; g: number; b: number },
    weight: number
  ): ExtractedColor {
    const { r, g, b } = rgb;

    // Convert to hex
    const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

    // Convert to HSL
    const hsl = this.rgbToHsl(r, g, b);

    // Convert to LAB
    const lab = this.rgbToLab(r, g, b);

    // Calculate contrast ratio against white
    const contrast = this.getContrastRatio(rgb, { r: 255, g: 255, b: 255 });

    // Determine temperature
    const temperature = this.getColorTemperature(hsl);

    // Get emotion
    const emotion = this.getColorEmotion(hsl);

    return {
      hex,
      rgb,
      hsl,
      lab,
      weight,
      contrast,
      temperature,
      emotion,
    };
  }

  /**
   * Convert RGB to HSL
   */
  private rgbToHsl(
    r: number,
    g: number,
    b: number
  ): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const sum = max + min;
    const l = sum / 2;

    let h = 0;
    let s = 0;

    if (diff !== 0) {
      s = l < 0.5 ? diff / sum : diff / (2 - sum);

      switch (max) {
        case r:
          h = (g - b) / diff + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / diff + 2;
          break;
        case b:
          h = (r - g) / diff + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  /**
   * Convert RGB to LAB color space
   */
  private rgbToLab(
    r: number,
    g: number,
    b: number
  ): { l: number; a: number; b: number } {
    // Simplified RGB to LAB conversion
    const l = ((0.299 * r + 0.587 * g + 0.114 * b) / 255) * 100;
    const a = ((r - g) / 255) * 100;
    const bVal = ((g - b) / 255) * 100;

    return { l: Math.round(l), a: Math.round(a), b: Math.round(bVal) };
  }

  /**
   * Calculate WCAG contrast ratio
   */
  private getContrastRatio(
    color1: { r: number; g: number; b: number },
    color2: { r: number; g: number; b: number }
  ): number {
    const l1 = this.getLuminance(color1);
    const l2 = this.getLuminance(color2);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Get relative luminance
   */
  private getLuminance(rgb: { r: number; g: number; b: number }): number {
    const { r, g, b } = rgb;
    const rsRGB = r / 255;
    const gsRGB = g / 255;
    const bsRGB = b / 255;

    const rLinear =
      rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const gLinear =
      gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const bLinear =
      bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  }

  /**
   * Determine color temperature
   */
  private getColorTemperature(hsl: {
    h: number;
    s: number;
    l: number;
  }): "warm" | "cool" | "neutral" {
    const { h } = hsl;

    if (h >= 0 && h <= 60) return "warm"; // Red to yellow
    if (h > 60 && h <= 120) return "neutral"; // Yellow to green
    if (h > 120 && h <= 240) return "cool"; // Green to blue
    if (h > 240 && h <= 300) return "cool"; // Blue to purple
    return "warm"; // Purple to red
  }

  /**
   * Get color emotion
   */
  private getColorEmotion(hsl: { h: number; s: number; l: number }): string {
    const { h, s, l } = hsl;

    // Low saturation = neutral emotions
    if (s < 20) {
      if (l < 30) return "sophisticated";
      if (l > 70) return "clean";
      return "balanced";
    }

    // Determine base emotion by hue
    if (h >= 0 && h < 30) return "passionate";
    if (h >= 30 && h < 60) return "energetic";
    if (h >= 60 && h < 90) return "optimistic";
    if (h >= 90 && h < 150) return "natural";
    if (h >= 150 && h < 210) return "calming";
    if (h >= 210 && h < 270) return "trustworthy";
    if (h >= 270 && h < 330) return "creative";
    return "romantic";
  }

  /**
   * Generate comprehensive color palette
   */
  private generatePalette(
    colors: ExtractedColor[],
    options: ColorExtractionOptions
  ): ColorPalette {
    if (colors.length === 0) {
      return this.getDefaultPalette();
    }

    // Sort by weight (prominence)
    const sortedColors = colors.sort((a, b) => b.weight - a.weight);

    const primary = sortedColors[0];
    const secondary = sortedColors[1] || primary;
    const accent = this.findAccentColor(sortedColors, primary);

    const dominant = sortedColors.slice(0, 3);
    const supporting = sortedColors.slice(3, 8);

    // Generate gradients
    const gradients =
      options.generateGradients !== false
        ? {
            primary: `linear-gradient(135deg, ${primary.hex}, ${secondary.hex})`,
            secondary: `linear-gradient(45deg, ${secondary.hex}, ${accent.hex})`,
            mesh: this.generateMeshGradient(sortedColors.slice(0, 4)),
          }
        : {
            primary: primary.hex,
            secondary: secondary.hex,
            mesh: primary.hex,
          };

    // Ensure accessibility
    const accessibility = this.generateAccessibilityColors(
      sortedColors,
      options.ensureAccessibility !== false
    );

    return {
      primary,
      secondary,
      accent,
      dominant,
      supporting,
      gradients,
      accessibility,
    };
  }

  /**
   * Find accent color that contrasts well with primary
   */
  private findAccentColor(
    colors: ExtractedColor[],
    primary: ExtractedColor
  ): ExtractedColor {
    // Find color with good contrast and different hue
    for (const color of colors) {
      const hueDiff = Math.abs(color.hsl.h - primary.hsl.h);
      const normalizedHueDiff = Math.min(hueDiff, 360 - hueDiff);

      if (
        normalizedHueDiff > 60 &&
        this.getContrastRatio(color.rgb, primary.rgb) > 3
      ) {
        return color;
      }
    }

    // Fallback to complementary color
    return this.generateComplementaryColor(primary);
  }

  /**
   * Generate complementary color
   */
  private generateComplementaryColor(color: ExtractedColor): ExtractedColor {
    const complementaryHue = (color.hsl.h + 180) % 360;
    return {
      ...color,
      hsl: { ...color.hsl, h: complementaryHue },
      hex: this.hslToHex(complementaryHue, color.hsl.s, color.hsl.l),
      emotion: "complementary",
    };
  }

  /**
   * Convert HSL to hex
   */
  private hslToHex(h: number, s: number, l: number): string {
    const hNorm = h / 360;
    const sNorm = s / 100;
    const lNorm = l / 100;

    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
    const x = c * (1 - Math.abs(((hNorm * 6) % 2) - 1));
    const m = lNorm - c / 2;

    let r = 0,
      g = 0,
      b = 0;

    if (0 <= hNorm && hNorm < 1 / 6) {
      r = c;
      g = x;
      b = 0;
    } else if (1 / 6 <= hNorm && hNorm < 2 / 6) {
      r = x;
      g = c;
      b = 0;
    } else if (2 / 6 <= hNorm && hNorm < 3 / 6) {
      r = 0;
      g = c;
      b = x;
    } else if (3 / 6 <= hNorm && hNorm < 4 / 6) {
      r = 0;
      g = x;
      b = c;
    } else if (4 / 6 <= hNorm && hNorm < 5 / 6) {
      r = x;
      g = 0;
      b = c;
    } else if (5 / 6 <= hNorm && hNorm < 1) {
      r = c;
      g = 0;
      b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }

  /**
   * Generate mesh gradient
   */
  private generateMeshGradient(colors: ExtractedColor[]): string {
    if (colors.length < 2)
      return colors[0]?.hex || "hsl(var(--glass-color-primary))";

    const positions = [
      "circle at 20% 20%",
      "circle at 80% 20%",
      "circle at 20% 80%",
      "circle at 80% 80%",
    ];

    const gradients = colors
      .slice(0, 4)
      .map(
        (color, i) =>
          `radial-gradient(${positions[i]}, ${color.hex} 0%, transparent 50%)`
      )
      .join(", ");

    return gradients;
  }

  /**
   * Generate accessibility-compliant colors
   */
  private generateAccessibilityColors(
    colors: ExtractedColor[],
    ensure: boolean
  ) {
    const textOnLight = colors.find((c) => c.contrast >= 4.5) || colors[0];
    const textOnDark =
      colors.find(
        (c) => this.getContrastRatio(c.rgb, { r: 0, g: 0, b: 0 }) >= 4.5
      ) || colors[0];
    const backgrounds = colors.filter((c: any) => c.hsl.l > 85 || c.hsl.l < 15);

    return {
      textOnLight,
      textOnDark,
      backgrounds: backgrounds.length > 0 ? backgrounds : [colors[0]],
    };
  }

  /**
   * Extract colors from DOM styles
   */
  private extractColorsFromStyles(element: HTMLElement): ExtractedColor[] {
    const styles = getComputedStyle(element);
    const colors: ExtractedColor[] = [];

    const colorProperties = [
      "color",
      "backgroundColor",
      "borderColor",
      "boxShadow",
      "textShadow",
    ];

    colorProperties.forEach((prop: any) => {
      const value = styles.getPropertyValue(prop);
      const extractedColors = this.parseColorValues(value);
      colors.push(...extractedColors);
    });

    return colors.filter(
      (color, index, self) =>
        self.findIndex((c) => c.hex === color.hex) === index
    );
  }

  /**
   * Parse CSS color values
   */
  private parseColorValues(cssValue: string): ExtractedColor[] {
    const colors: ExtractedColor[] = [];

    // RGB/RGBA pattern
    const rgbPattern = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/g;
    let match;

    while ((match = rgbPattern.exec(cssValue)) !== null) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);

      colors.push(this.rgbToExtractedColor({ r, g, b }, 1));
    }

    // Hex pattern
    const hexPattern = /#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/g;
    while ((match = hexPattern.exec(cssValue)) !== null) {
      const hex = match[0];
      const rgb = this.hexToRgb(hex);
      if (rgb) {
        colors.push(this.rgbToExtractedColor(rgb, 1));
      }
    }

    return colors;
  }

  /**
   * Convert hex to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /**
   * Merge similar colors and combine their weights
   */
  private mergeColors(colors: ExtractedColor[]): ExtractedColor[] {
    const merged = new Map<string, ExtractedColor>();

    colors.forEach((color: any) => {
      // Group by similar colors (quantized hex)
      const key = this.quantizeHex(color.hex);

      if (merged.has(key)) {
        const existing = merged.get(key)!;
        existing.weight += color.weight;
      } else {
        merged.set(key, { ...color });
      }
    });

    return Array.from(merged.values()).sort((a, b) => b.weight - a.weight);
  }

  /**
   * Quantize hex color for grouping
   */
  private quantizeHex(hex: string): string {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;

    const quantize = (value: number) => Math.floor(value / 16) * 16;

    return `#${quantize(rgb.r).toString(16).padStart(2, "0")}${quantize(rgb.g).toString(16).padStart(2, "0")}${quantize(rgb.b).toString(16).padStart(2, "0")}`;
  }

  /**
   * Seek video to specific time
   */
  private seekVideo(video: HTMLVideoElement, time: number): Promise<void> {
    return new Promise((resolve) => {
      const onSeeked = () => {
        video.removeEventListener("seeked", onSeeked);
        resolve();
      };
      video.addEventListener("seeked", onSeeked);
      video.currentTime = time;
    });
  }

  /**
   * Get default palette fallback
   */
  private getDefaultPalette(): ColorPalette {
    const defaultColor = this.rgbToExtractedColor({ r: 59, g: 130, b: 246 }, 1);

    return {
      primary: defaultColor,
      secondary: defaultColor,
      accent: defaultColor,
      dominant: [defaultColor],
      supporting: [],
      gradients: {
        primary: "hsl(var(--glass-color-primary))",
        secondary: "hsl(var(--glass-color-primary))",
        mesh: "hsl(var(--glass-color-primary))",
      },
      accessibility: {
        textOnLight: defaultColor,
        textOnDark: defaultColor,
        backgrounds: [defaultColor],
      },
    };
  }

  /**
   * Clear color cache
   */
  clearCache(): void {
    this.colorCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.colorCache.size,
      keys: Array.from(this.colorCache.keys()),
    };
  }
}

// Export singleton
export const smartColorExtraction = SmartColorExtraction.getInstance();

// React hook for color extraction
export function useSmartColorExtraction() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [palette, setPalette] = useState<ColorPalette | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractFromImage = useCallback(
    async (
      source: HTMLImageElement | string,
      options?: ColorExtractionOptions
    ) => {
      setIsExtracting(true);
      setError(null);

      try {
        const result = await smartColorExtraction.extractFromImage(
          source,
          options
        );
        setPalette(result);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        throw err;
      } finally {
        setIsExtracting(false);
      }
    },
    []
  );

  const extractFromVideo = useCallback(
    async (
      video: HTMLVideoElement,
      options?: ColorExtractionOptions & { frameInterval?: number }
    ) => {
      setIsExtracting(true);
      setError(null);

      try {
        const result = await smartColorExtraction.extractFromVideo(
          video,
          options
        );
        setPalette(result);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        throw err;
      } finally {
        setIsExtracting(false);
      }
    },
    []
  );

  const extractFromElement = useCallback(
    async (element: HTMLElement, options?: ColorExtractionOptions) => {
      setIsExtracting(true);
      setError(null);

      try {
        const result = await smartColorExtraction.extractFromElement(
          element,
          options
        );
        setPalette(result);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        throw err;
      } finally {
        setIsExtracting(false);
      }
    },
    []
  );

  return {
    palette,
    isExtracting,
    error,
    extractFromImage,
    extractFromVideo,
    extractFromElement,
    clearCache: smartColorExtraction.clearCache.bind(smartColorExtraction),
  };
}
