'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

export interface MediaFile {
  id: string;
  type: 'audio' | 'video';
  src: string;
  title?: string;
  description?: string;
  duration?: number;
  thumbnail?: string;
  poster?: string;
  size?: number;
  format?: string;
  quality?: 'auto' | '144p' | '240p' | '360p' | '480p' | '720p' | '1080p' | '1440p' | '2160p';
  chapters?: MediaChapter[];
  subtitles?: MediaSubtitle[];
  metadata?: Record<string, any>;
}

export interface MediaChapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  thumbnail?: string;
  description?: string;
}

export interface MediaSubtitle {
  id: string;
  language: string;
  label: string;
  src?: string;
  content?: SubtitleEntry[];
  isDefault?: boolean;
}

export interface SubtitleEntry {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  speaker?: string;
  confidence?: number;
}

export interface TranscriptEntry {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  speaker?: string;
  confidence?: number;
  keywords?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  summary?: string;
}

export interface MediaAnalytics {
  totalViews: number;
  averageWatchTime: number;
  completionRate: number;
  engagementPoints: Array<{ time: number; engagement: number }>;
  heatmapData: Array<{ time: number; views: number }>;
  deviceStats: Record<string, number>;
  locationStats: Record<string, number>;
}

export interface PlaybackState {
  mediaId: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isLoading: boolean;
  isError: boolean;
  volume: number;
  playbackRate: number;
  quality: string;
  isFullscreen: boolean;
  isMuted: boolean;
  buffered: TimeRanges | null;
  activeChapter?: string;
  activeSubtitle?: string;
}

interface MediaContextValue {
  // Media Management
  mediaFiles: MediaFile[];
  addMediaFile: (file: MediaFile) => void;
  removeMediaFile: (id: string) => void;
  getMediaFile: (id: string) => MediaFile | undefined;
  updateMediaFile: (id: string, updates: Partial<MediaFile>) => void;

  // Playback Control
  playbackState: PlaybackState | null;
  setPlaybackState: (state: PlaybackState | null) => void;
  
  // Player Controls
  play: (mediaId: string) => void;
  pause: () => void;
  stop: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  setQuality: (quality: string) => void;

  // Transcription Features
  transcripts: Record<string, TranscriptEntry[]>;
  generateTranscript: (mediaId: string) => Promise<void>;
  searchTranscript: (mediaId: string, query: string) => TranscriptEntry[];
  getTranscriptAtTime: (mediaId: string, time: number) => TranscriptEntry | undefined;

  // Chapter Management
  setActiveChapter: (mediaId: string, chapterId: string) => void;
  getChapterAtTime: (mediaId: string, time: number) => MediaChapter | undefined;

  // Subtitle Management
  setActiveSubtitle: (mediaId: string, subtitleId: string) => void;
  generateSubtitles: (mediaId: string, language: string) => Promise<void>;

  // Analytics
  analytics: Record<string, MediaAnalytics>;
  trackView: (mediaId: string, watchTime: number) => void;
  trackEngagement: (mediaId: string, time: number, type: 'play' | 'pause' | 'seek' | 'fullscreen') => void;

  // AI Features
  generateSummary: (mediaId: string) => Promise<string>;
  identifySpeakers: (mediaId: string) => Promise<string[]>;
  extractKeywords: (mediaId: string) => Promise<string[]>;
  analyzeSentiment: (mediaId: string) => Promise<Record<number, 'positive' | 'neutral' | 'negative'>>;

  // Recording Features
  isRecording: boolean;
  recordingDevices: MediaDeviceInfo[];
  startRecording: (type: 'audio' | 'video', options?: RecordingOptions) => Promise<void>;
  stopRecording: () => Promise<MediaFile | null>;
  pauseRecording: () => void;
  resumeRecording: () => void;
}

export interface RecordingOptions {
  audio?: {
    deviceId?: string;
    echoCancellation?: boolean;
    noiseSuppression?: boolean;
    sampleRate?: number;
  };
  video?: {
    deviceId?: string;
    width?: number;
    height?: number;
    frameRate?: number;
    facingMode?: 'user' | 'environment';
  };
  quality?: 'low' | 'medium' | 'high';
  format?: 'webm' | 'mp4' | 'ogg';
}

const MediaContext = createContext<MediaContextValue | null>(null);

// Mock transcription service
const mockTranscriptionService = {
  async transcribe(mediaFile: MediaFile): Promise<TranscriptEntry[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock transcript data based on media type and duration
    const duration = mediaFile.duration || 120;
    const entries: TranscriptEntry[] = [];
    
    const mockContent = [
      "Welcome to our presentation about advanced media components.",
      "Today we'll explore the capabilities of modern web media players.",
      "Our system includes automatic transcription and subtitle generation.",
      "Users can search through transcripts and jump to specific moments.",
      "The AI can identify speakers and analyze sentiment in real-time.",
      "Chapter markers help organize content for better navigation.",
      "Quality adaptation ensures smooth playback on all devices.",
      "Analytics provide insights into user engagement patterns.",
      "This technology represents the future of interactive media."
    ];

    const speakers = ['Alice Johnson', 'Bob Smith', 'Dr. Sarah Chen'];
    
    for (let i = 0; i < Math.min(mockContent.length, Math.floor(duration / 15)); i++) {
      const startTime = i * 15;
      const endTime = Math.min(startTime + 12, duration);
      
      entries.push({
        id: `transcript_${i}`,
        startTime,
        endTime,
        text: mockContent[i] || "Additional content continues...",
        speaker: speakers[i % speakers.length],
        confidence: 0.85 + Math.random() * 0.15,
        keywords: ['media', 'transcription', 'AI', 'technology'].slice(0, Math.floor(Math.random() * 3) + 1),
        sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as any
      });
    }
    
    return entries;
  },

  async generateSummary(transcript: TranscriptEntry[]): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return `This ${transcript.length > 5 ? 'comprehensive' : 'brief'} presentation covers advanced media components including automatic transcription, AI-powered analysis, and interactive features. Key topics include speaker identification, sentiment analysis, and user engagement tracking.`;
  },

  async identifySpeakers(transcript: TranscriptEntry[]): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const speakers = [...new Set(transcript.map((entry: any) => entry.speaker).filter(Boolean))];
    return speakers as string[];
  }
};

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null);
  const [transcripts, setTranscripts] = useState<Record<string, TranscriptEntry[]>>({});
  const [analytics, setAnalytics] = useState<Record<string, MediaAnalytics>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDevices, setRecordingDevices] = useState<MediaDeviceInfo[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Initialize recording devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setRecordingDevices(devices.filter((device: any) => 
          device.kind === 'audioinput' || device.kind === 'videoinput'
        ));
      } catch (error) {
        console.error('Error getting media devices:', error);
      }
    };

    getDevices();
  }, []);

  const addMediaFile = useCallback((file: MediaFile) => {
    setMediaFiles((prev: any) => [...prev, file]);
    
    // Initialize analytics
    setAnalytics((prev: any) => ({
      ...prev,
      [file.id]: {
        totalViews: 0,
        averageWatchTime: 0,
        completionRate: 0,
        engagementPoints: [],
        heatmapData: [],
        deviceStats: {},
        locationStats: {}
      }
    }));
  }, []);

  const removeMediaFile = useCallback((id: string) => {
    setMediaFiles((prev: any) => prev.filter((file: any) => file.id !== id));
    setTranscripts((prev: any) => {
      const newTranscripts = { ...prev };
      delete newTranscripts[id];
      return newTranscripts;
    });
    setAnalytics((prev: any) => {
      const newAnalytics = { ...prev };
      delete newAnalytics[id];
      return newAnalytics;
    });
  }, []);

  const getMediaFile = useCallback((id: string) => {
    return mediaFiles.find((file: any) => file.id === id);
  }, [mediaFiles]);

  const updateMediaFile = useCallback((id: string, updates: Partial<MediaFile>) => {
    setMediaFiles((prev: any) => prev.map((file: any) => 
      file.id === id ? { ...file, ...updates } : file
    ));
  }, []);

  const play = useCallback((mediaId: string) => {
    const mediaFile = getMediaFile(mediaId);
    if (mediaFile) {
      setPlaybackState((prev: any) => ({
        ...prev,
        mediaId,
        isPlaying: true,
        isLoading: false,
        isError: false,
        currentTime: prev?.mediaId === mediaId ? prev.currentTime : 0,
        duration: mediaFile.duration || 0,
        volume: prev?.volume || 1,
        playbackRate: prev?.playbackRate || 1,
        quality: prev?.quality || 'auto',
        isFullscreen: prev?.isFullscreen || false,
        isMuted: prev?.isMuted || false,
        buffered: null
      }));
      
      trackEngagement(mediaId, playbackState?.currentTime || 0, 'play');
    }
  }, [getMediaFile, playbackState]);

  const pause = useCallback(() => {
    setPlaybackState((prev: any) => prev ? { ...prev, isPlaying: false } : null);
    if (playbackState) {
      trackEngagement(playbackState.mediaId, playbackState.currentTime, 'pause');
    }
  }, [playbackState]);

  const stop = useCallback(() => {
    setPlaybackState(null);
  }, []);

  const seekTo = useCallback((time: number) => {
    setPlaybackState((prev: any) => prev ? { ...prev, currentTime: time } : null);
    if (playbackState) {
      trackEngagement(playbackState.mediaId, time, 'seek');
    }
  }, [playbackState]);

  const setVolume = useCallback((volume: number) => {
    setPlaybackState((prev: any) => prev ? { ...prev, volume } : null);
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    setPlaybackState((prev: any) => prev ? { ...prev, playbackRate: rate } : null);
  }, []);

  const toggleMute = useCallback(() => {
    setPlaybackState((prev: any) => prev ? { ...prev, isMuted: !prev.isMuted } : null);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setPlaybackState((prev: any) => prev ? { ...prev, isFullscreen: !prev.isFullscreen } : null);
    if (playbackState) {
      trackEngagement(playbackState.mediaId, playbackState.currentTime, 'fullscreen');
    }
  }, [playbackState]);

  const setQuality = useCallback((quality: string) => {
    setPlaybackState((prev: any) => prev ? { ...prev, quality } : null);
  }, []);

  const generateTranscript = useCallback(async (mediaId: string) => {
    const mediaFile = getMediaFile(mediaId);
    if (!mediaFile) return;

    try {
      const transcript = await mockTranscriptionService.transcribe(mediaFile);
      setTranscripts((prev: any) => ({ ...prev, [mediaId]: transcript }));
    } catch (error) {
      console.error('Error generating transcript:', error);
    }
  }, [getMediaFile]);

  const searchTranscript = useCallback((mediaId: string, query: string) => {
    const transcript = transcripts[mediaId] || [];
    const lowercaseQuery = query.toLowerCase();

    return transcript.filter((entry: any) =>
      entry.text.toLowerCase().includes(lowercaseQuery) ||
      entry.keywords?.some((keyword: any) => keyword.toLowerCase().includes(lowercaseQuery))
    );
  }, [transcripts]);

  const getTranscriptAtTime = useCallback((mediaId: string, time: number) => {
    const transcript = transcripts[mediaId] || [];
    return transcript.find((entry: any) => time >= entry.startTime && time <= entry.endTime);
  }, [transcripts]);

  const setActiveChapter = useCallback((mediaId: string, chapterId: string) => {
    setPlaybackState((prev: any) => prev && prev.mediaId === mediaId 
      ? { ...prev, activeChapter: chapterId }
      : prev
    );
  }, []);

  const getChapterAtTime = useCallback((mediaId: string, time: number) => {
    const mediaFile = getMediaFile(mediaId);
    if (!mediaFile?.chapters) return undefined;
    
    return mediaFile.chapters.find((chapter: any) => 
      time >= chapter.startTime && time <= chapter.endTime
    );
  }, [getMediaFile]);

  const setActiveSubtitle = useCallback((mediaId: string, subtitleId: string) => {
    setPlaybackState((prev: any) => prev && prev.mediaId === mediaId
      ? { ...prev, activeSubtitle: subtitleId }
      : prev
    );
  }, []);

  const generateSubtitles = useCallback(async (mediaId: string, language: string) => {
    const transcript = transcripts[mediaId];
    if (!transcript) return;

    const subtitles: SubtitleEntry[] = transcript.map((entry: any) => ({
      id: entry.id,
      startTime: entry.startTime,
      endTime: entry.endTime,
      text: entry.text,
      speaker: entry.speaker
    }));

    updateMediaFile(mediaId, {
      subtitles: [
        ...(getMediaFile(mediaId)?.subtitles || []),
        {
          id: `subtitle_${language}`,
          language,
          label: language.toUpperCase(),
          content: subtitles
        }
      ]
    });
  }, [transcripts, getMediaFile, updateMediaFile]);

  const trackView = useCallback((mediaId: string, watchTime: number) => {
    setAnalytics((prev: any) => ({
      ...prev,
      [mediaId]: {
        ...prev[mediaId],
        totalViews: (prev[mediaId]?.totalViews || 0) + 1,
        averageWatchTime: ((prev[mediaId]?.averageWatchTime || 0) + watchTime) / 2
      }
    }));
  }, []);

  const trackEngagement = useCallback((mediaId: string, time: number, type: string) => {
    setAnalytics((prev: any) => ({
      ...prev,
      [mediaId]: {
        ...prev[mediaId],
        engagementPoints: [
          ...(prev[mediaId]?.engagementPoints || []),
          { time, engagement: type === 'play' ? 1 : 0.5 }
        ].slice(-100) // Keep last 100 engagement points
      }
    }));
  }, []);

  const generateSummary = useCallback(async (mediaId: string) => {
    const transcript = transcripts[mediaId];
    if (!transcript) return '';

    return await mockTranscriptionService.generateSummary(transcript);
  }, [transcripts]);

  const identifySpeakers = useCallback(async (mediaId: string) => {
    const transcript = transcripts[mediaId];
    if (!transcript) return [];

    return await mockTranscriptionService.identifySpeakers(transcript);
  }, [transcripts]);

  const extractKeywords = useCallback(async (mediaId: string) => {
    const transcript = transcripts[mediaId];
    if (!transcript) return [];

    const allKeywords = transcript.flatMap(entry => entry.keywords || []);
    return [...new Set(allKeywords)];
  }, [transcripts]);

  const analyzeSentiment = useCallback(async (mediaId: string) => {
    const transcript = transcripts[mediaId];
    if (!transcript) return {};

    const sentimentMap: Record<number, 'positive' | 'neutral' | 'negative'> = {};
    transcript.forEach((entry: any) => {
      if (entry.sentiment) {
        sentimentMap[entry.startTime] = entry.sentiment;
      }
    });

    return sentimentMap;
  }, [transcripts]);

  const startRecording = useCallback(async (type: 'audio' | 'video', options?: RecordingOptions) => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: type === 'audio' || type === 'video',
        video: type === 'video'
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const mediaRecorder = new MediaRecorder(stream);
      
      recordedChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      mediaRecorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<MediaFile | null> => {
    if (!mediaRecorderRef.current || !isRecording) return null;

    return new Promise((resolve) => {
      mediaRecorderRef.current!.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        const mediaFile: MediaFile = {
          id: `recording_${Date.now()}`,
          type: 'video',
          src: url,
          title: 'New Recording',
          size: blob.size,
          format: 'webm'
        };

        addMediaFile(mediaFile);
        setIsRecording(false);
        resolve(mediaFile);
      };

      mediaRecorderRef.current!.stop();
    });
  }, [isRecording, addMediaFile]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
    }
  }, [isRecording]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.resume();
    }
  }, [isRecording]);

  const value: MediaContextValue = {
    mediaFiles,
    addMediaFile,
    removeMediaFile,
    getMediaFile,
    updateMediaFile,
    playbackState,
    setPlaybackState,
    play,
    pause,
    stop,
    seekTo,
    setVolume,
    setPlaybackRate,
    toggleMute,
    toggleFullscreen,
    setQuality,
    transcripts,
    generateTranscript,
    searchTranscript,
    getTranscriptAtTime,
    setActiveChapter,
    getChapterAtTime,
    setActiveSubtitle,
    generateSubtitles,
    analytics,
    trackView,
    trackEngagement,
    generateSummary,
    identifySpeakers,
    extractKeywords,
    analyzeSentiment,
    isRecording,
    recordingDevices,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording
  };

  return (
    <MediaContext.Provider data-glass-component value={value}>
      {children}
    </MediaContext.Provider>
  );
};

export { MediaProvider as GlassMediaProvider };

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
};