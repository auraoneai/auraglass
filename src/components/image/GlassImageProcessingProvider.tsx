'use client';
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export interface ImageFile {
  id: string;
  file: File;
  name: string;
  originalName: string;
  size: number;
  type: string;
  width: number;
  height: number;
  aspectRatio: number;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: Date;
  optimizedAt?: Date;
  metadata: ImageMetadata;
  editHistory: EditOperation[];
  cloudUrls?: CloudUrls;
  tags?: string[];
  faces?: FaceDetection[];
}

export interface ImageMetadata {
  format: string;
  quality: number;
  colorSpace: string;
  hasAlpha: boolean;
  dpi?: number;
  exifData?: Record<string, any>;
  dominantColors: string[];
  brightness: number;
  contrast: number;
  saturation: number;
  sharpness: number;
  fileSize: number;
  compressionRatio?: number;
}

export interface EditOperation {
  id: string;
  type: 'crop' | 'resize' | 'filter' | 'color' | 'rotate' | 'watermark' | 'background';
  timestamp: Date;
  parameters: Record<string, any>;
  preview?: string;
}

export interface CloudUrls {
  original: string;
  optimized: string;
  thumbnail: string;
  responsive: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  };
}

export interface FaceDetection {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  landmarks?: {
    leftEye: { x: number; y: number };
    rightEye: { x: number; y: number };
    nose: { x: number; y: number };
    mouth: { x: number; y: number };
  };
}

export interface OptimizationOptions {
  targetSize?: number; // in KB
  maxWidth?: number;
  maxHeight?: number;
  format?: 'auto' | 'jpeg' | 'png' | 'webp' | 'avif';
  quality?: number; // 1-100
  progressive?: boolean;
  removeMetadata?: boolean;
  smartCrop?: boolean;
  responsiveSizes?: number[];
}

export interface FilterOptions {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  hue: number; // -180 to 180
  blur: number; // 0 to 10
  sharpen: number; // 0 to 10
  noise: number; // 0 to 100
  vignette: number; // 0 to 100
  sepia: number; // 0 to 100
  grayscale: number; // 0 to 100
}

export interface WatermarkOptions {
  text?: string;
  image?: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity: number; // 0 to 100
  size: number; // 10 to 200 (percentage)
  rotation: number; // -45 to 45
  color?: string;
  font?: string;
}

export interface Template {
  id: string;
  name: string;
  category: 'social' | 'print' | 'web' | 'mobile';
  width: number;
  height: number;
  description: string;
  thumbnail: string;
  preset?: Partial<FilterOptions>;
}

export interface UploadProgress {
  imageId: string;
  progress: number;
  status: 'uploading' | 'processing' | 'optimizing' | 'completed' | 'error';
  message?: string;
}

interface ImageProcessingContextValue {
  // Image Management
  images: ImageFile[];
  addImage: (file: File) => Promise<ImageFile>;
  addImages: (files: FileList) => Promise<ImageFile[]>;
  removeImage: (id: string) => void;
  getImage: (id: string) => ImageFile | undefined;
  updateImage: (id: string, updates: Partial<ImageFile>) => void;

  // Image Processing
  optimizeImage: (imageId: string, options?: OptimizationOptions) => Promise<ImageFile>;
  batchOptimize: (imageIds: string[], options?: OptimizationOptions) => Promise<ImageFile[]>;
  
  // Editing Operations
  cropImage: (imageId: string, cropArea: { x: number; y: number; width: number; height: number }) => Promise<ImageFile>;
  resizeImage: (imageId: string, width: number, height: number, maintainAspect?: boolean) => Promise<ImageFile>;
  applyFilter: (imageId: string, filters: Partial<FilterOptions>) => Promise<ImageFile>;
  rotateImage: (imageId: string, degrees: number) => Promise<ImageFile>;
  addWatermark: (imageId: string, watermark: WatermarkOptions) => Promise<ImageFile>;
  
  // AI Features
  detectFaces: (imageId: string) => Promise<FaceDetection[]>;
  removeBackground: (imageId: string) => Promise<ImageFile>;
  replaceBackground: (imageId: string, backgroundImage: string | string) => Promise<ImageFile>;
  smartCrop: (imageId: string, aspectRatio: number) => Promise<ImageFile>;
  enhanceImage: (imageId: string) => Promise<ImageFile>;
  upscaleImage: (imageId: string, factor: number) => Promise<ImageFile>;

  // Batch Operations
  batchResize: (imageIds: string[], width: number, height: number) => Promise<ImageFile[]>;
  batchFilter: (imageIds: string[], filters: Partial<FilterOptions>) => Promise<ImageFile[]>;
  batchWatermark: (imageIds: string[], watermark: WatermarkOptions) => Promise<ImageFile[]>;

  // Cloud Integration
  uploadToCloud: (imageId: string, provider?: 'aws' | 'cloudinary' | 'imgur') => Promise<CloudUrls>;
  generateResponsiveImages: (imageId: string, sizes: number[]) => Promise<CloudUrls>;

  // Templates
  templates: Template[];
  applyTemplate: (imageId: string, templateId: string) => Promise<ImageFile>;
  createCustomTemplate: (template: Omit<Template, 'id'>) => Template;

  // Analytics & Insights
  getOptimizationStats: () => {
    totalSaved: number;
    averageReduction: number;
    imagesProcessed: number;
    mostUsedFormat: string;
  };
  getImageInsights: (imageId: string) => {
    colorPalette: string[];
    dominantColor: string;
    brightness: number;
    complexity: number;
    recommendedFormats: string[];
  };

  // Upload Progress
  uploadProgresses: UploadProgress[];
  clearProgress: (imageId: string) => void;
  
  // Settings
  defaultOptimizations: OptimizationOptions;
  setDefaultOptimizations: (options: OptimizationOptions) => void;
  autoOptimize: boolean;
  setAutoOptimize: (enabled: boolean) => void;
}

const ImageProcessingContext = createContext<ImageProcessingContextValue | null>(null);

// Default templates for common use cases
const defaultTemplates: Template[] = [
  // Social Media
  {
    id: 'instagram_post',
    name: 'Instagram Post',
    category: 'social',
    width: 1080,
    height: 1080,
    description: 'Square format perfect for Instagram posts',
    thumbnail: 'https://via.placeholder.com/100x100/e91e63/ffffff?text=IG',
    preset: { saturation: 10, contrast: 5 }
  },
  {
    id: 'instagram_story',
    name: 'Instagram Story',
    category: 'social',
    width: 1080,
    height: 1920,
    description: 'Vertical format for Instagram and Facebook stories',
    thumbnail: 'https://via.placeholder.com/56x100/e91e63/ffffff?text=Story'
  },
  {
    id: 'facebook_cover',
    name: 'Facebook Cover',
    category: 'social',
    width: 1200,
    height: 630,
    description: 'Facebook cover photo dimensions',
    thumbnail: 'https://via.placeholder.com/100x52/1877f2/ffffff?text=FB'
  },
  {
    id: 'twitter_header',
    name: 'Twitter Header',
    category: 'social',
    width: 1500,
    height: 500,
    description: 'Twitter profile header image',
    thumbnail: 'https://via.placeholder.com/100x33/1da1f2/ffffff?text=TW'
  },
  
  // Web
  {
    id: 'blog_banner',
    name: 'Blog Banner',
    category: 'web',
    width: 1200,
    height: 400,
    description: 'Wide banner for blog posts and articles',
    thumbnail: 'https://via.placeholder.com/100x33/6c757d/ffffff?text=Blog'
  },
  {
    id: 'web_thumbnail',
    name: 'Web Thumbnail',
    category: 'web',
    width: 400,
    height: 300,
    description: 'Standard web thumbnail size',
    thumbnail: 'https://via.placeholder.com/100x75/17a2b8/ffffff?text=Thumb'
  },
  
  // Print
  {
    id: 'business_card',
    name: 'Business Card',
    category: 'print',
    width: 1050,
    height: 600,
    description: 'Standard business card size (3.5" x 2")',
    thumbnail: 'https://via.placeholder.com/100x57/28a745/ffffff?text=Card'
  },
  {
    id: 'poster_a4',
    name: 'A4 Poster',
    category: 'print',
    width: 2480,
    height: 3508,
    description: 'A4 poster size at 300 DPI',
    thumbnail: 'https://via.placeholder.com/71x100/ffc107/ffffff?text=A4'
  }
];

// Mock AI image processing functions
const mockImageProcessor = {
  async analyzeImage(imageUrl: string): Promise<Partial<ImageMetadata>> {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      dominantColors: ['var(--glass-color-primary)', '#1e40af', '#93c5fd'],
      brightness: 65 + Math.random() * 30,
      contrast: 50 + Math.random() * 30,
      saturation: 40 + Math.random() * 40,
      sharpness: 60 + Math.random() * 30
    };
  },

  async detectFaces(imageUrl: string): Promise<FaceDetection[]> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock face detection - return 0-3 random faces
    const faceCount = Math.floor(Math.random() * 4);
    const faces: FaceDetection[] = [];
    
    for (let i = 0; i < faceCount; i++) {
      faces.push({
        id: `face_${i}`,
        x: Math.random() * 0.7,
        y: Math.random() * 0.7,
        width: 0.1 + Math.random() * 0.2,
        height: 0.1 + Math.random() * 0.2,
        confidence: 0.7 + Math.random() * 0.3,
        landmarks: {
          leftEye: { x: Math.random(), y: Math.random() },
          rightEye: { x: Math.random(), y: Math.random() },
          nose: { x: Math.random(), y: Math.random() },
          mouth: { x: Math.random(), y: Math.random() }
        }
      });
    }
    
    return faces;
  },

  async optimizeImage(imageUrl: string, options: OptimizationOptions): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this would call an AI service
    // For demo, we'll return the same URL with a query parameter
    return `${imageUrl}?optimized=true&q=${options.quality || 85}`;
  }
};

export const ImageProcessingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploadProgresses, setUploadProgresses] = useState<UploadProgress[]>([]);
  const [templates] = useState<Template[]>(defaultTemplates);
  const [defaultOptimizations, setDefaultOptimizations] = useState<OptimizationOptions>({
    quality: 85,
    format: 'auto',
    removeMetadata: true,
    progressive: true
  });
  const [autoOptimize, setAutoOptimize] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>();

  const generateId = useCallback(() => {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const createImageFromFile = useCallback(async (file: File): Promise<ImageFile> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const url = URL.createObjectURL(file);
        const metadata = await mockImageProcessor.analyzeImage(url);
        
        const imageFile: ImageFile = {
          id: generateId(),
          file,
          name: file.name,
          originalName: file.name,
          size: file.size,
          type: file.type,
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height,
          url,
          uploadedAt: new Date(),
          editHistory: [],
          metadata: {
            format: file.type.split('/')[1],
            quality: 100,
            colorSpace: 'sRGB',
            hasAlpha: file.type.includes('png'),
            fileSize: file.size,
            dominantColors: ['var(--glass-black)'],
            brightness: 50,
            contrast: 50,
            saturation: 50,
            sharpness: 50,
            ...metadata
          },
          tags: []
        };
        
        resolve(imageFile);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }, [generateId]);

  const addImage = useCallback(async (file: File): Promise<ImageFile> => {
    const imageFile = await createImageFromFile(file);
    
    setImages((prev: any) => [...prev, imageFile]);
    
    // Auto-optimize if enabled
    if (autoOptimize) {
      setTimeout(() => {
        optimizeImage(imageFile.id, defaultOptimizations);
      }, 100);
    }
    
    return imageFile;
  }, [createImageFromFile, autoOptimize, defaultOptimizations]);

  const addImages = useCallback(async (files: FileList): Promise<ImageFile[]> => {
    const imageFiles: ImageFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        try {
          const imageFile = await createImageFromFile(file);
          imageFiles.push(imageFile);
          
          // Update progress
          setUploadProgresses((prev: any) => [...prev, {
            imageId: imageFile.id,
            progress: 100,
            status: 'completed'
          }]);
        } catch (error) {
          console.error('Failed to process image:', file.name, error);
        }
      }
    }
    
    setImages((prev: any) => [...prev, ...imageFiles]);
    return imageFiles;
  }, [createImageFromFile]);

  const removeImage = useCallback((id: string) => {
    setImages((prev: any) => {
      const image = prev.find((img: any) => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.url);
        if (image.thumbnailUrl) {
          URL.revokeObjectURL(image.thumbnailUrl);
        }
      }
      return prev.filter((img: any) => img.id !== id);
    });
    
    setUploadProgresses((prev: any) => prev.filter((p: any) => p.imageId !== id));
  }, []);

  const getImage = useCallback((id: string) => {
    return images.find((img: any) => img.id === id);
  }, [images]);

  const updateImage = useCallback((id: string, updates: Partial<ImageFile>) => {
    setImages((prev: any) => prev.map((img: any) => 
      img.id === id ? { ...img, ...updates } : img
    ));
  }, []);

  const optimizeImage = useCallback(async (imageId: string, options: OptimizationOptions = {}): Promise<ImageFile> => {
    const image = getImage(imageId);
    if (!image) throw new Error('Image not found');

    // Update progress
    setUploadProgresses((prev: any) => [...prev, {
      imageId,
      progress: 0,
      status: 'processing',
      message: 'Analyzing image...'
    }]);

    const optimizationOptions = { ...defaultOptimizations, ...options };
    
    try {
      // Simulate optimization progress
      for (let progress = 10; progress <= 90; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgresses((prev: any) => prev.map((p: any) => 
          p.imageId === imageId ? { ...p, progress } : p
        ));
      }

      const optimizedUrl = await mockImageProcessor.optimizeImage(image.url, optimizationOptions);
      
      const optimizedImage: ImageFile = {
        ...image,
        url: optimizedUrl,
        optimizedAt: new Date(),
        metadata: {
          ...image.metadata,
          quality: optimizationOptions.quality || 85,
          compressionRatio: 0.3 + Math.random() * 0.4
        },
        editHistory: [
          ...image.editHistory,
          {
            id: generateId(),
            type: 'color',
            timestamp: new Date(),
            parameters: optimizationOptions
          }
        ]
      };

      setImages((prev: any) => prev.map((img: any) => 
        img.id === imageId ? optimizedImage : img
      ));

      setUploadProgresses((prev: any) => prev.map((p: any) => 
        p.imageId === imageId ? { ...p, progress: 100, status: 'completed', message: 'Optimization complete!' } : p
      ));

      return optimizedImage;
    } catch (error) {
      setUploadProgresses((prev: any) => prev.map((p: any) => 
        p.imageId === imageId ? { ...p, status: 'error', message: 'Optimization failed' } : p
      ));
      throw error;
    }
  }, [getImage, defaultOptimizations, generateId]);

  const batchOptimize = useCallback(async (imageIds: string[], options: OptimizationOptions = {}): Promise<ImageFile[]> => {
    const results: ImageFile[] = [];
    
    for (const imageId of imageIds) {
      try {
        const optimized = await optimizeImage(imageId, options);
        results.push(optimized);
      } catch (error) {
        console.error(`Failed to optimize image ${imageId}:`, error);
      }
    }
    
    return results;
  }, [optimizeImage]);

  const detectFaces = useCallback(async (imageId: string): Promise<FaceDetection[]> => {
    const image = getImage(imageId);
    if (!image) throw new Error('Image not found');

    const faces = await mockImageProcessor.detectFaces(image.url);
    
    updateImage(imageId, { faces });
    
    return faces;
  }, [getImage, updateImage]);

  const applyFilter = useCallback(async (imageId: string, filters: Partial<FilterOptions>): Promise<ImageFile> => {
    const image = getImage(imageId);
    if (!image) throw new Error('Image not found');

    // Simulate filter processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const editOperation: EditOperation = {
      id: generateId(),
      type: 'filter',
      timestamp: new Date(),
      parameters: filters
    };

    const updatedImage: ImageFile = {
      ...image,
      editHistory: [...image.editHistory, editOperation],
      metadata: {
        ...image.metadata,
        brightness: image.metadata.brightness + (filters.brightness || 0),
        contrast: image.metadata.contrast + (filters.contrast || 0),
        saturation: image.metadata.saturation + (filters.saturation || 0)
      }
    };

    setImages((prev: any) => prev.map((img: any) => 
      img.id === imageId ? updatedImage : img
    ));

    return updatedImage;
  }, [getImage, generateId]);

  const cropImage = useCallback(async (imageId: string, cropArea: { x: number; y: number; width: number; height: number }): Promise<ImageFile> => {
    const image = getImage(imageId);
    if (!image) throw new Error('Image not found');

    // Simulate crop processing
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const editOperation: EditOperation = {
      id: generateId(),
      type: 'crop',
      timestamp: new Date(),
      parameters: cropArea
    };

    const croppedImage: ImageFile = {
      ...image,
      width: Math.round(image.width * cropArea.width),
      height: Math.round(image.height * cropArea.height),
      aspectRatio: cropArea.width / cropArea.height,
      editHistory: [...image.editHistory, editOperation]
    };

    setImages((prev: any) => prev.map((img: any) => 
      img.id === imageId ? croppedImage : img
    ));

    return croppedImage;
  }, [getImage, generateId]);

  const resizeImage = useCallback(async (imageId: string, width: number, height: number, maintainAspect = true): Promise<ImageFile> => {
    const image = getImage(imageId);
    if (!image) throw new Error('Image not found');

    let newWidth = width;
    let newHeight = height;

    if (maintainAspect) {
      const aspectRatio = image.width / image.height;
      if (width / height > aspectRatio) {
        newWidth = height * aspectRatio;
      } else {
        newHeight = width / aspectRatio;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 600));
    
    const editOperation: EditOperation = {
      id: generateId(),
      type: 'resize',
      timestamp: new Date(),
      parameters: { width: newWidth, height: newHeight, maintainAspect }
    };

    const resizedImage: ImageFile = {
      ...image,
      width: Math.round(newWidth),
      height: Math.round(newHeight),
      aspectRatio: newWidth / newHeight,
      editHistory: [...image.editHistory, editOperation]
    };

    setImages((prev: any) => prev.map((img: any) => 
      img.id === imageId ? resizedImage : img
    ));

    return resizedImage;
  }, [getImage, generateId]);

  const addWatermark = useCallback(async (imageId: string, watermark: WatermarkOptions): Promise<ImageFile> => {
    const image = getImage(imageId);
    if (!image) throw new Error('Image not found');

    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const editOperation: EditOperation = {
      id: generateId(),
      type: 'watermark',
      timestamp: new Date(),
      parameters: watermark
    };

    const watermarkedImage: ImageFile = {
      ...image,
      editHistory: [...image.editHistory, editOperation]
    };

    setImages((prev: any) => prev.map((img: any) => 
      img.id === imageId ? watermarkedImage : img
    ));

    return watermarkedImage;
  }, [getImage, generateId]);

  const removeBackground = useCallback(async (imageId: string): Promise<ImageFile> => {
    const image = getImage(imageId);
    if (!image) throw new Error('Image not found');

    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const editOperation: EditOperation = {
      id: generateId(),
      type: 'background',
      timestamp: new Date(),
      parameters: { action: 'remove' }
    };

    const processedImage: ImageFile = {
      ...image,
      metadata: { ...image.metadata, hasAlpha: true },
      editHistory: [...image.editHistory, editOperation]
    };

    setImages((prev: any) => prev.map((img: any) => 
      img.id === imageId ? processedImage : img
    ));

    return processedImage;
  }, [getImage, generateId]);

  const smartCrop = useCallback(async (imageId: string, aspectRatio: number): Promise<ImageFile> => {
    const image = getImage(imageId);
    if (!image) throw new Error('Image not found');

    // If faces are detected, use them for smart cropping
    let faces = image.faces;
    if (!faces || faces.length === 0) {
      faces = await detectFaces(imageId);
    }

    let cropArea;
    if (faces.length > 0) {
      // Center crop around faces
      const facesCenterX = faces.reduce((sum, face) => sum + face.x + face.width / 2, 0) / faces.length;
      const facesCenterY = faces.reduce((sum, face) => sum + face.y + face.height / 2, 0) / faces.length;
      
      const currentAspect = image.width / image.height;
      
      if (aspectRatio > currentAspect) {
        // Crop height
        const newHeight = image.width / aspectRatio;
        cropArea = {
          x: 0,
          y: Math.max(0, facesCenterY - newHeight / 2),
          width: 1,
          height: newHeight / image.height
        };
      } else {
        // Crop width
        const newWidth = image.height * aspectRatio;
        cropArea = {
          x: Math.max(0, facesCenterX - newWidth / 2),
          y: 0,
          width: newWidth / image.width,
          height: 1
        };
      }
    } else {
      // Center crop
      const currentAspect = image.width / image.height;
      
      if (aspectRatio > currentAspect) {
        const newHeight = image.width / aspectRatio;
        cropArea = {
          x: 0,
          y: (image.height - newHeight) / 2 / image.height,
          width: 1,
          height: newHeight / image.height
        };
      } else {
        const newWidth = image.height * aspectRatio;
        cropArea = {
          x: (image.width - newWidth) / 2 / image.width,
          y: 0,
          width: newWidth / image.width,
          height: 1
        };
      }
    }

    return cropImage(imageId, cropArea);
  }, [getImage, detectFaces, cropImage]);

  const enhanceImage = useCallback(async (imageId: string): Promise<ImageFile> => {
    const image = getImage(imageId);
    if (!image) throw new Error('Image not found');

    // Apply AI enhancement (brightness, contrast, sharpness optimization)
    const enhancementFilters: Partial<FilterOptions> = {
      brightness: Math.max(-20, Math.min(20, 10 - image.metadata.brightness * 0.2)),
      contrast: Math.max(-20, Math.min(20, 15 - image.metadata.contrast * 0.3)),
      sharpen: Math.max(0, Math.min(10, 8 - image.metadata.sharpness * 0.1)),
      saturation: Math.max(-15, Math.min(15, 5 - image.metadata.saturation * 0.15))
    };

    return applyFilter(imageId, enhancementFilters);
  }, [getImage, applyFilter]);

  const getOptimizationStats = useCallback(() => {
    const processedImages = images.filter((img: any) => img.metadata.compressionRatio);
    const totalOriginalSize = processedImages.reduce((sum, img) => sum + img.size, 0);
    const totalOptimizedSize = processedImages.reduce((sum, img) => 
      sum + (img.size * (1 - (img.metadata.compressionRatio || 0))), 0
    );
    
    return {
      totalSaved: Math.round((totalOriginalSize - totalOptimizedSize) / 1024), // KB
      averageReduction: processedImages.length > 0 
        ? Math.round(processedImages.reduce((sum, img) => sum + (img.metadata.compressionRatio || 0), 0) / processedImages.length * 100)
        : 0,
      imagesProcessed: processedImages.length,
      mostUsedFormat: 'JPEG' // Mock data
    };
  }, [images]);

  const clearProgress = useCallback((imageId: string) => {
    setUploadProgresses((prev: any) => prev.filter((p: any) => p.imageId !== imageId));
  }, []);

  // Placeholder implementations for other methods
  const rotateImage = useCallback(async (imageId: string, degrees: number): Promise<ImageFile> => {
    // Implementation would go here
    return getImage(imageId)!;
  }, [getImage]);

  const replaceBackground = useCallback(async (imageId: string, backgroundImage: string): Promise<ImageFile> => {
    // Implementation would go here
    return getImage(imageId)!;
  }, [getImage]);

  const upscaleImage = useCallback(async (imageId: string, factor: number): Promise<ImageFile> => {
    // Implementation would go here
    return getImage(imageId)!;
  }, [getImage]);

  const batchResize = useCallback(async (imageIds: string[], width: number, height: number): Promise<ImageFile[]> => {
    const results: ImageFile[] = [];
    for (const imageId of imageIds) {
      try {
        const resized = await resizeImage(imageId, width, height);
        results.push(resized);
      } catch (error) {
        console.error(`Failed to resize image ${imageId}:`, error);
      }
    }
    return results;
  }, [resizeImage]);

  const batchFilter = useCallback(async (imageIds: string[], filters: Partial<FilterOptions>): Promise<ImageFile[]> => {
    const results: ImageFile[] = [];
    for (const imageId of imageIds) {
      try {
        const filtered = await applyFilter(imageId, filters);
        results.push(filtered);
      } catch (error) {
        console.error(`Failed to filter image ${imageId}:`, error);
      }
    }
    return results;
  }, [applyFilter]);

  const batchWatermark = useCallback(async (imageIds: string[], watermark: WatermarkOptions): Promise<ImageFile[]> => {
    const results: ImageFile[] = [];
    for (const imageId of imageIds) {
      try {
        const watermarked = await addWatermark(imageId, watermark);
        results.push(watermarked);
      } catch (error) {
        console.error(`Failed to watermark image ${imageId}:`, error);
      }
    }
    return results;
  }, [addWatermark]);

  const uploadToCloud = useCallback(async (imageId: string, provider = 'cloudinary'): Promise<CloudUrls> => {
    // Mock cloud upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const baseUrl = `https://${provider}.example.com`;
    return {
      original: `${baseUrl}/original/${imageId}`,
      optimized: `${baseUrl}/optimized/${imageId}`,
      thumbnail: `${baseUrl}/thumb/${imageId}`,
      responsive: {
        small: `${baseUrl}/w_400/${imageId}`,
        medium: `${baseUrl}/w_800/${imageId}`,
        large: `${baseUrl}/w_1200/${imageId}`,
        xlarge: `${baseUrl}/w_1600/${imageId}`
      }
    };
  }, []);

  const generateResponsiveImages = useCallback(async (imageId: string, sizes: number[]): Promise<CloudUrls> => {
    return uploadToCloud(imageId);
  }, [uploadToCloud]);

  const applyTemplate = useCallback(async (imageId: string, templateId: string): Promise<ImageFile> => {
    const template = templates.find((t: any) => t.id === templateId);
    if (!template) throw new Error('Template not found');

    let result = await resizeImage(imageId, template.width, template.height, false);
    
    if (template.preset) {
      result = await applyFilter(imageId, template.preset);
    }
    
    return result;
  }, [templates, resizeImage, applyFilter]);

  const createCustomTemplate = useCallback((template: Omit<Template, 'id'>): Template => {
    const newTemplate: Template = {
      ...template,
      id: generateId()
    };
    // In a real app, you'd save this to state or backend
    return newTemplate;
  }, [generateId]);

  const getImageInsights = useCallback((imageId: string) => {
    const image = getImage(imageId);
    if (!image) return {
      colorPalette: [],
      dominantColor: 'var(--glass-black)',
      brightness: 0,
      complexity: 0,
      recommendedFormats: []
    };

    return {
      colorPalette: image.metadata.dominantColors,
      dominantColor: image.metadata.dominantColors[0] || 'var(--glass-black)',
      brightness: image.metadata.brightness,
      complexity: Math.random() * 100, // Mock complexity score
      recommendedFormats: image.metadata.hasAlpha ? ['PNG', 'WebP'] : ['JPEG', 'WebP', 'AVIF']
    };
  }, [getImage]);

  const value: ImageProcessingContextValue = {
    images,
    addImage,
    addImages,
    removeImage,
    getImage,
    updateImage,
    optimizeImage,
    batchOptimize,
    cropImage,
    resizeImage,
    applyFilter,
    rotateImage,
    addWatermark,
    detectFaces,
    removeBackground,
    replaceBackground,
    smartCrop,
    enhanceImage,
    upscaleImage,
    batchResize,
    batchFilter,
    batchWatermark,
    uploadToCloud,
    generateResponsiveImages,
    templates,
    applyTemplate,
    createCustomTemplate,
    getOptimizationStats,
    getImageInsights,
    uploadProgresses,
    clearProgress,
    defaultOptimizations,
    setDefaultOptimizations,
    autoOptimize,
    setAutoOptimize
  };

  return (
    <ImageProcessingContext.Provider data-glass-component value={value}>
      {children}
    </ImageProcessingContext.Provider>
  );
};

export { ImageProcessingProvider as GlassImageProcessingProvider };

export const useImageProcessing = () => {
  const context = useContext(ImageProcessingContext);
  if (!context) {
    throw new Error('useImageProcessing must be used within an ImageProcessingProvider');
  }
  return context;
};