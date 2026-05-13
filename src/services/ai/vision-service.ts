// @ts-nocheck - Optional Google Cloud Vision dependency
import { AIConfig } from "./config";
import { CacheService } from "./cache-service";
import { ErrorHandler } from "./error-handler";

export interface FaceDetectionResult {
  boundingBox: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  confidence: number;
  emotions: {
    joy: number;
    sorrow: number;
    anger: number;
    surprise: number;
  };
  landmarks?: Array<{
    type: string;
    position: { x: number; y: number; z: number };
  }>;
}

export interface ObjectDetectionResult {
  name: string;
  confidence: number;
  boundingBox: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
}

export interface TextExtractionResult {
  text: string;
  confidence: number;
  language?: string;
  blocks: Array<{
    text: string;
    confidence: number;
    boundingBox: any;
  }>;
}

export interface ImageAnalysisResult {
  labels: Array<{ description: string; score: number }>;
  safeSearch: {
    adult: string;
    violence: string;
    medical: string;
  };
  colors: Array<{
    color: { red: number; green: number; blue: number };
    score: number;
    pixelFraction: number;
  }>;
  cropHints?: Array<{
    boundingBox: any;
    confidence: number;
    importanceFraction: number;
  }>;
}

export class VisionService {
  private client: any | null = null;
  private cache: CacheService;
  private errorHandler: ErrorHandler;
  private removeBgApiKey: string;

  constructor(private config: AIConfig) {
    this.cache = new CacheService(config.redis);
    this.errorHandler = new ErrorHandler();
    this.removeBgApiKey = config.removeBg.apiKey;
  }

  private async getClient(): Promise<any | null> {
    if (this.client) {
      return this.client;
    }

    try {
      const vision = await import("@google-cloud/vision");
      const ImageAnnotatorClient =
        vision.ImageAnnotatorClient ??
        vision.default?.ImageAnnotatorClient;

      if (!ImageAnnotatorClient) {
        return null;
      }

      if (this.config.googleCloud.keyFilename) {
        this.client = new ImageAnnotatorClient({
          keyFilename: this.config.googleCloud.keyFilename,
        });
      } else if (this.config.googleCloud.apiKey) {
        this.client = new ImageAnnotatorClient({
          apiEndpoint: "vision.googleapis.com",
          credentials: {
            client_email: "vision-api@project.iam.gserviceaccount.com",
            private_key: this.config.googleCloud.apiKey,
          },
        });
      }

      return this.client;
    } catch {
      return null;
    }
  }

  async detectFaces(imageBuffer: Buffer): Promise<FaceDetectionResult[]> {
    const cacheKey = `vision:faces:${this.hashBuffer(imageBuffer)}`;

    if (this.config.costOptimization.enableCaching) {
      const cached = await this.cache.get<FaceDetectionResult[]>(cacheKey);
      if (cached) return cached;
    }

    try {
      const client = await this.getClient();
      if (!client) {
        return this.fallbackFaceDetection();
      }

      const [result] = await client.faceDetection(imageBuffer);
      const faces = result.faceAnnotations || [];

      const detectionResults: FaceDetectionResult[] = faces.map(
        (face: any) => ({
          boundingBox: this.convertBoundingPoly(face.boundingPoly),
          confidence: face.detectionConfidence || 0,
          emotions: {
            joy: this.likelihoodToScore(face.joyLikelihood),
            sorrow: this.likelihoodToScore(face.sorrowLikelihood),
            anger: this.likelihoodToScore(face.angerLikelihood),
            surprise: this.likelihoodToScore(face.surpriseLikelihood),
          },
          landmarks: face.landmarks?.map((landmark: any) => ({
            type: landmark.type || "",
            position: landmark.position || { x: 0, y: 0, z: 0 },
          })),
        })
      );

      if (this.config.costOptimization.enableCaching) {
        await this.cache.set(cacheKey, detectionResults, 3600);
      }

      return detectionResults;
    } catch (error) {
      return this.errorHandler.handleWithFallback(
        error,
        () => this.fallbackFaceDetection(),
        {
          service: "Vision",
          operation: "detectFaces",
        }
      );
    }
  }

  async detectObjects(imageBuffer: Buffer): Promise<ObjectDetectionResult[]> {
    const cacheKey = `vision:objects:${this.hashBuffer(imageBuffer)}`;

    if (this.config.costOptimization.enableCaching) {
      const cached = await this.cache.get<ObjectDetectionResult[]>(cacheKey);
      if (cached) return cached;
    }

    try {
      const client = await this.getClient();
      if (!client) {
        return this.fallbackObjectDetection();
      }

      const [result] = await client.objectLocalization(imageBuffer);
      const objects = result.localizedObjectAnnotations || [];

      const detectionResults: ObjectDetectionResult[] = objects.map(
        (obj: any) => ({
          name: obj.name || "unknown",
          confidence: obj.score || 0,
          boundingBox: this.convertBoundingPoly(obj.boundingPoly),
        })
      );

      if (this.config.costOptimization.enableCaching) {
        await this.cache.set(cacheKey, detectionResults, 3600);
      }

      return detectionResults;
    } catch (error) {
      return this.errorHandler.handleWithFallback(
        error,
        () => this.fallbackObjectDetection(),
        {
          service: "Vision",
          operation: "detectObjects",
        }
      );
    }
  }

  async extractText(imageBuffer: Buffer): Promise<TextExtractionResult> {
    const cacheKey = `vision:text:${this.hashBuffer(imageBuffer)}`;

    if (this.config.costOptimization.enableCaching) {
      const cached = await this.cache.get<TextExtractionResult>(cacheKey);
      if (cached) return cached;
    }

    try {
      const client = await this.getClient();
      if (!client) {
        return this.fallbackTextExtraction();
      }

      const [result] = await client.documentTextDetection(imageBuffer);
      const fullTextAnnotation = result.fullTextAnnotation;

      if (!fullTextAnnotation) {
        return {
          text: "",
          confidence: 0,
          blocks: [],
        };
      }

      const extractionResult: TextExtractionResult = {
        text: fullTextAnnotation.text || "",
        confidence: this.calculateAverageConfidence(
          fullTextAnnotation.pages ?? undefined
        ),
        language: result.textAnnotations?.[0]?.locale || undefined,
        blocks:
          fullTextAnnotation.pages?.[0]?.blocks?.map((block: any) => ({
            text: this.extractBlockText(block),
            confidence: block.confidence || 0,
            boundingBox: block.boundingBox,
          })) || [],
      };

      if (this.config.costOptimization.enableCaching) {
        await this.cache.set(cacheKey, extractionResult, 3600);
      }

      return extractionResult;
    } catch (error) {
      return this.errorHandler.handleWithFallback(
        error,
        () => this.fallbackTextExtraction(),
        {
          service: "Vision",
          operation: "extractText",
        }
      );
    }
  }

  async analyzeImage(imageBuffer: Buffer): Promise<ImageAnalysisResult> {
    const cacheKey = `vision:analysis:${this.hashBuffer(imageBuffer)}`;

    if (this.config.costOptimization.enableCaching) {
      const cached = await this.cache.get<ImageAnalysisResult>(cacheKey);
      if (cached) return cached;
    }

    try {
      const client = await this.getClient();
      if (!client) {
        return this.fallbackImageAnalysis();
      }

      const [result] = await client.annotateImage({
        image: { content: imageBuffer.toString("base64") },
        features: [
          { type: "LABEL_DETECTION", maxResults: 10 },
          { type: "SAFE_SEARCH_DETECTION" },
          { type: "IMAGE_PROPERTIES" },
          { type: "CROP_HINTS", maxResults: 3 },
        ],
      });

      const analysisResult: ImageAnalysisResult = {
        labels:
          result.labelAnnotations?.map((label: any) => ({
            description: label.description || "",
            score: label.score || 0,
          })) || [],
        safeSearch: {
          adult: String(result.safeSearchAnnotation?.adult ?? "UNKNOWN"),
          violence: String(result.safeSearchAnnotation?.violence ?? "UNKNOWN"),
          medical: String(result.safeSearchAnnotation?.medical ?? "UNKNOWN"),
        },
        colors:
          result.imagePropertiesAnnotation?.dominantColors?.colors?.map(
            (color: any) => ({
              color: {
                red: color.color?.red || 0,
                green: color.color?.green || 0,
                blue: color.color?.blue || 0,
              },
              score: color.score || 0,
              pixelFraction: color.pixelFraction || 0,
            })
          ) || [],
        cropHints: result.cropHintsAnnotation?.cropHints?.map((hint: any) => ({
          boundingBox: hint.boundingPoly,
          confidence: hint.confidence || 0,
          importanceFraction: hint.importanceFraction || 0,
        })),
      };

      if (this.config.costOptimization.enableCaching) {
        await this.cache.set(cacheKey, analysisResult, 3600);
      }

      return analysisResult;
    } catch (error) {
      return this.errorHandler.handleWithFallback(
        error,
        () => this.fallbackImageAnalysis(),
        {
          service: "Vision",
          operation: "analyzeImage",
        }
      );
    }
  }

  async removeBackground(imageBuffer: Buffer): Promise<Buffer> {
    const cacheKey = `vision:removebg:${this.hashBuffer(imageBuffer)}`;

    if (this.config.costOptimization.enableCaching) {
      const cached = await this.cache.get<string>(cacheKey);
      if (cached) return Buffer.from(cached, "base64");
    }

    try {
      const formData = new FormData();
      // Convert Node Buffer to Blob-compatible data for fetch
      formData.append(
        "image_file",
        new Blob([new Uint8Array(imageBuffer)]),
        "image.jpg"
      );
      formData.append("size", "auto");

      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": this.removeBgApiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Remove.bg API error: ${response.status}`);
      }

      const resultBuffer = Buffer.from(await response.arrayBuffer());

      if (this.config.costOptimization.enableCaching) {
        await this.cache.set(cacheKey, resultBuffer.toString("base64"), 3600);
      }

      return resultBuffer;
    } catch (error) {
      return this.errorHandler.handleWithFallback(error, () => imageBuffer, {
        service: "Vision",
        operation: "removeBackground",
      });
    }
  }

  async generateImageDescription(imageBuffer: Buffer): Promise<string> {
    try {
      const analysis = await this.analyzeImage(imageBuffer);
      const topLabels = analysis.labels.slice(0, 5);

      if (topLabels.length === 0) {
        return "No description available";
      }

      const labelDescriptions = topLabels
        .map((l: any) => l.description)
        .join(", ");
      return `This image contains: ${labelDescriptions}`;
    } catch (error) {
      return this.errorHandler.handleWithFallback(
        error,
        () => "Unable to generate image description",
        {
          service: "Vision",
          operation: "generateImageDescription",
        }
      );
    }
  }

  private convertBoundingPoly(boundingPoly: any): {
    left: number;
    top: number;
    width: number;
    height: number;
  } {
    if (!boundingPoly?.vertices || boundingPoly.vertices.length < 4) {
      return { left: 0, top: 0, width: 0, height: 0 };
    }

    const vertices = boundingPoly.vertices;
    const left = Math.min(...vertices.map((v: any) => v.x || 0));
    const top = Math.min(...vertices.map((v: any) => v.y || 0));
    const right = Math.max(...vertices.map((v: any) => v.x || 0));
    const bottom = Math.max(...vertices.map((v: any) => v.y || 0));

    return {
      left,
      top,
      width: right - left,
      height: bottom - top,
    };
  }

  private likelihoodToScore(likelihood?: any): number {
    const map: Record<string, number> = {
      VERY_UNLIKELY: 0,
      UNLIKELY: 0.25,
      POSSIBLE: 0.5,
      LIKELY: 0.75,
      VERY_LIKELY: 1,
    };
    return map[likelihood || ""] || 0;
  }

  private calculateAverageConfidence(pages?: any[]): number {
    if (!pages || pages.length === 0) return 0;

    const confidences: number[] = [];
    pages.forEach((page: any) => {
      page.blocks?.forEach((block: any) => {
        if (block.confidence) confidences.push(block.confidence);
      });
    });

    if (confidences.length === 0) return 0;
    return confidences.reduce((a, b) => a + b, 0) / confidences.length;
  }

  private extractBlockText(block: any): string {
    if (!block.paragraphs) return "";

    return block.paragraphs
      .map(
        (p: any) =>
          p.words
            ?.map(
              (w: any) =>
                w.symbols?.map((s: any) => s.text || "").join("") || ""
            )
            .join(" ") || ""
      )
      .join("\n");
  }

  private hashBuffer(buffer: Buffer): string {
    const crypto = require("crypto");
    return crypto.createHash("sha256").update(buffer).digest("hex");
  }

  private fallbackFaceDetection(): FaceDetectionResult[] {
    return [
      {
        boundingBox: { left: 100, top: 100, width: 200, height: 200 },
        confidence: 0.5,
        emotions: { joy: 0.5, sorrow: 0, anger: 0, surprise: 0 },
      },
    ];
  }

  private fallbackObjectDetection(): ObjectDetectionResult[] {
    return [
      {
        name: "object",
        confidence: 0.5,
        boundingBox: { left: 0, top: 0, width: 100, height: 100 },
      },
    ];
  }

  private fallbackTextExtraction(): TextExtractionResult {
    return {
      text: "Text extraction unavailable",
      confidence: 0,
      blocks: [],
    };
  }

  private fallbackImageAnalysis(): ImageAnalysisResult {
    return {
      labels: [{ description: "image", score: 0.5 }],
      safeSearch: { adult: "UNKNOWN", violence: "UNKNOWN", medical: "UNKNOWN" },
      colors: [],
    };
  }
}
