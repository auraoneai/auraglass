"use client";
import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import { OptimizedGlass } from "../../primitives";
import { Motion } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import { useA11yId } from "../../utils/a11y";
import { useMotionPreferenceContext } from "../../contexts/MotionPreferenceContext";
import { useGlassSound } from "../../utils/soundDesign";

// Define SpeechRecognition types for browsers that don't have them in TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
    webkitAudioContext: typeof AudioContext;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any)
    | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

export interface VoiceCommand {
  phrase: string;
  action: string;
  confidence: number;
  timestamp: number;
  id: string;
}

export interface VoiceAnalysis {
  volume: number;
  frequency: number;
  clarity: number;
  pitch: number;
  timestamp: number;
}

export interface GlassVoiceInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "onError"> {
  /** Whether voice input is active */
  active?: boolean;
  /** Voice recognition language */
  language?: string;
  /** Continuous listening mode */
  continuous?: boolean;
  /** Interim results while speaking */
  interimResults?: boolean;
  /** Maximum recognition alternatives */
  maxAlternatives?: number;
  /** Commands to listen for */
  commands?: Array<{
    phrase: string;
    action: string;
    fuzzy?: boolean;
  }>;
  /** Wake word for activation */
  wakeWord?: string;
  /** Minimum confidence threshold */
  confidenceThreshold?: number;
  /** Whether to show voice visualizations */
  showVisualizer?: boolean;
  /** Visualizer style */
  visualizerStyle?: "waveform" | "circular" | "bars" | "particle";
  /** Whether to show transcript */
  showTranscript?: boolean;
  /** Maximum transcript length */
  maxTranscriptLength?: number;
  /** Voice input timeout */
  timeout?: number;
  /** Noise suppression */
  noiseSuppression?: boolean;
  /** Echo cancellation */
  echoCancellation?: boolean;
  /** Auto gain control */
  autoGainControl?: boolean;
  /** Voice change handler */
  onVoiceStart?: () => void;
  /** Voice end handler */
  onVoiceEnd?: () => void;
  /** Speech result handler */
  onResult?: (result: string, confidence: number) => void;
  /** Command recognition handler */
  onCommand?: (command: VoiceCommand) => void;
  /** Error handler */
  onError?: (error: string) => void;
  /** Audio level handler */
  onAudioLevel?: (level: number) => void;
  /** Transcript change handler */
  onTranscriptChange?: (transcript: string) => void;
  /** Show controls */
  showControls?: boolean;
  /** Respect user's motion preferences */
  respectMotionPreference?: boolean;
  /**
   * Custom data-testid for testing
   */
  "data-testid"?: string;
}

export const GlassVoiceInput = forwardRef<HTMLDivElement, GlassVoiceInputProps>(
  (
    {
      active = false,
      language = "en-US",
      continuous = true,
      interimResults = true,
      maxAlternatives = 1,
      commands = [],
      wakeWord,
      confidenceThreshold = 0.7,
      showVisualizer = true,
      visualizerStyle = "waveform",
      showTranscript = true,
      maxTranscriptLength = 500,
      timeout = 30000,
      noiseSuppression = true,
      echoCancellation = true,
      autoGainControl = true,
      onVoiceStart,
      onVoiceEnd,
      onResult,
      onCommand,
      onError,
      onAudioLevel,
      onTranscriptChange,
      showControls = true,
      respectMotionPreference = true,
      className,
      "data-testid": dataTestId,
      ...props
    },
    ref
  ) => {
    const { prefersReducedMotion, isMotionSafe } = useMotionPreferenceContext();
    const { play } = useGlassSound();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const micStreamRef = useRef<MediaStream | null>(null);
    const voiceInputId = useA11yId("glass-voice-input");

    const [isListening, setIsListening] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");
    const [audioLevel, setAudioLevel] = useState(0);
    const [frequency, setFrequency] = useState(0);
    const [recognizedCommands, setRecognizedCommands] = useState<
      VoiceCommand[]
    >([]);
    const [audioData, setAudioData] = useState<Float32Array>(
      new Float32Array(256)
    );
    const [isSupported, setIsSupported] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState<
      "granted" | "denied" | "prompt"
    >("prompt");

    // Check browser support
    useEffect(() => {
      const supported =
        "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
      setIsSupported(supported);

      if (!supported) {
        onError?.("Speech recognition is not supported in this browser");
      }
    }, [onError]);

    // Initialize speech recognition
    const initializeSpeechRecognition = useCallback(() => {
      if (!isSupported) return;

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = language;
      recognition.maxAlternatives = maxAlternatives;

      recognition.onstart = () => {
        setIsListening(true);
        onVoiceStart?.();
        play("tap");
      };

      recognition.onend = () => {
        setIsListening(false);
        onVoiceEnd?.();
        play("success");
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        let interimText = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const resultText = result[0].transcript;
          const confidence = result[0].confidence;

          if (result.isFinal) {
            finalTranscript += resultText;
            onResult?.(resultText, confidence);

            // Check for commands
            checkCommands(resultText, confidence);
          } else {
            interimText += resultText;
          }
        }

        if (finalTranscript) {
          setTranscript((prev: any) => {
            const newTranscript = (prev + finalTranscript).slice(
              -maxTranscriptLength
            );
            onTranscriptChange?.(newTranscript);
            return newTranscript;
          });
        }

        setInterimTranscript(interimText);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        onError?.(event.error);
        setIsListening(false);
        play("error");
      };

      recognitionRef.current = recognition;
    }, [
      isSupported,
      continuous,
      interimResults,
      language,
      maxAlternatives,
      maxTranscriptLength,
      onVoiceStart,
      onVoiceEnd,
      onResult,
      onTranscriptChange,
      onError,
      play,
    ]);

    // Initialize audio context for visualization
    const initializeAudioContext = useCallback(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation,
            noiseSuppression,
            autoGainControl,
          },
        });

        micStreamRef.current = stream;
        setPermissionStatus("granted");

        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);

        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.8;
        microphone.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        // Start audio analysis
        if (showVisualizer) {
          startAudioAnalysis();
        }
      } catch (error) {
        console.error("Microphone access denied:", error);
        setPermissionStatus("denied");
        onError?.("Microphone access denied");
      }
    }, [
      echoCancellation,
      noiseSuppression,
      autoGainControl,
      showVisualizer,
      onError,
    ]);

    // Start audio analysis
    const startAudioAnalysis = useCallback(() => {
      if (!analyserRef.current) return;

      const analyser = analyserRef.current;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Float32Array(bufferLength);

      const analyze = () => {
        analyser.getFloatFrequencyData(dataArray);

        // Calculate audio level
        const sum = dataArray.reduce((acc, val) => acc + Math.abs(val), 0);
        const level = Math.min(1, sum / bufferLength / 50);

        setAudioLevel(level);
        onAudioLevel?.(level);

        // Calculate dominant frequency
        let maxIndex = 0;
        let maxValue = -Infinity;
        for (let i = 0; i < bufferLength; i++) {
          if (dataArray[i] > maxValue) {
            maxValue = dataArray[i];
            maxIndex = i;
          }
        }

        const freq =
          (maxIndex * audioContextRef.current!.sampleRate) /
          (analyser.fftSize * 2);
        setFrequency(freq);

        // Update audio data for visualization
        setAudioData(new Float32Array(dataArray));

        if (showVisualizer) {
          animationRef.current = requestAnimationFrame(analyze);
        }
      };

      analyze();
    }, [showVisualizer, onAudioLevel]);

    // Check for voice commands
    const checkCommands = useCallback(
      (text: string, confidence: number) => {
        if (confidence < confidenceThreshold) return;

        const normalizedText = text.toLowerCase().trim();

        commands.forEach((cmd: any) => {
          const normalizedPhrase = cmd.phrase.toLowerCase();
          let match = false;

          if (cmd.fuzzy) {
            // Simple fuzzy matching - check if most words match
            const textWords = normalizedText.split(" ");
            const phraseWords = normalizedPhrase.split(" ");
            const matchCount = phraseWords.filter((word: any) =>
              textWords.some(
                (textWord) => textWord.includes(word) || word.includes(textWord)
              )
            ).length;

            match = matchCount / phraseWords.length >= 0.7;
          } else {
            match = normalizedText.includes(normalizedPhrase);
          }

          if (match) {
            const command: VoiceCommand = {
              phrase: cmd.phrase,
              action: cmd.action,
              confidence,
              timestamp: Date.now(),
              id: `command-${Date.now()}`,
            };

            setRecognizedCommands((prev: any) => [...prev.slice(-9), command]);
            onCommand?.(command);
            play("success");
          }
        });

        // Check for wake word
        if (wakeWord && normalizedText.includes(wakeWord.toLowerCase())) {
          if (!isListening) {
            startListening();
          }
        }
      },
      [confidenceThreshold, commands, wakeWord, isListening, onCommand, play]
    );

    // Initialize components
    useEffect(() => {
      initializeSpeechRecognition();
    }, [initializeSpeechRecognition]);

    // Start/stop listening
    const startListening = useCallback(() => {
      if (!recognitionRef.current || isListening) return;

      if (permissionStatus !== "granted") {
        initializeAudioContext();
      }

      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Failed to start recognition:", error);
        onError?.("Failed to start voice recognition");
      }
    }, [isListening, permissionStatus, initializeAudioContext, onError]);

    const stopListening = useCallback(() => {
      if (!recognitionRef.current || !isListening) return;

      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Failed to stop recognition:", error);
      }
    }, [isListening]);

    // Toggle listening
    const toggleListening = useCallback(() => {
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    }, [isListening, startListening, stopListening]);

    // Auto-start/stop based on active prop
    useEffect(() => {
      if (active && !isListening) {
        startListening();
      } else if (!active && isListening) {
        stopListening();
      }
    }, [active, isListening, startListening, stopListening]);

    // Cleanup
    useEffect(() => {
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }

        if (micStreamRef.current) {
          micStreamRef.current
            .getTracks()
            .forEach((track: any) => track.stop());
        }

        if (audioContextRef.current) {
          audioContextRef.current.close();
        }

        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }
      };
    }, []);

    // Render visualizer
    const renderVisualizer = useCallback(() => {
      if (!showVisualizer || prefersReducedMotion) return null;

      const canvas = canvasRef.current;
      if (!canvas) return null;

      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      if (!audioData || audioLevel === 0) return null;

      // Set up gradient
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, "rgba(100, 150, 255, 0.8)");
      gradient.addColorStop(0.5, "rgba(150, 200, 255, 0.6)");
      gradient.addColorStop(1, "rgba(200, 220, 255, 0.4)");

      switch (visualizerStyle) {
        case "waveform":
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.beginPath();

          const sliceWidth = width / audioData.length;
          let x = 0;

          for (let i = 0; i < audioData.length; i++) {
            const v = (audioData[i] + 100) / 100;
            const y = (v * height) / 2;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }

            x += sliceWidth;
          }

          ctx.stroke();
          break;

        case "bars":
          const barWidth = (width / audioData.length) * 2;

          for (let i = 0; i < audioData.length; i++) {
            const barHeight = ((audioData[i] + 100) / 100) * height;
            const x = i * barWidth;

            ctx.fillStyle = gradient;
            ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
          }
          break;

        case "circular":
          const centerX = width / 2;
          const centerY = height / 2;
          const radius = Math.min(centerX, centerY) * 0.6;

          ctx.lineWidth = 3;

          for (let i = 0; i < audioData.length; i++) {
            const angle = (i / audioData.length) * Math.PI * 2;
            const amplitude = ((audioData[i] + 100) / 100) * 50;

            const x1 = centerX + Math.cos(angle) * radius;
            const y1 = centerY + Math.sin(angle) * radius;
            const x2 = centerX + Math.cos(angle) * (radius + amplitude);
            const y2 = centerY + Math.sin(angle) * (radius + amplitude);

            ctx.strokeStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
          break;

        case "particle":
          const particleCount = Math.min(50, Math.floor(audioLevel * 100));

          for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 3 + 1;
            const alpha = Math.random() * 0.8 + 0.2;

            ctx.fillStyle = `rgba(100, 150, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
      }
    }, [
      showVisualizer,
      prefersReducedMotion,
      audioData,
      audioLevel,
      visualizerStyle,
    ]);

    // Render visualizer continuously
    useEffect(() => {
      if (showVisualizer && !prefersReducedMotion) {
        const animate = () => {
          renderVisualizer();
          if (showVisualizer) {
            requestAnimationFrame(animate);
          }
        };
        animate();
      }
    }, [showVisualizer, prefersReducedMotion, renderVisualizer]);

    // Canvas setup
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = 400;
      canvas.height = 100;
    }, []);

    // Clear transcript
    const clearTranscript = useCallback(() => {
      setTranscript("");
      setInterimTranscript("");
      onTranscriptChange?.("");
    }, [onTranscriptChange]);

    // Render controls
    const renderControls = () => {
      if (!showControls) return null;

      return (
        <OptimizedGlass
          elevation="level2"
          intensity="medium"
          depth={1}
          tint="neutral"
          border="subtle"
          className="glass-voice-controls glass-flex glass-flex-wrap glass-items-center glass-gap-4 glass-p-4 glass-radius-lg glass-backdrop-blur-md glass-contrast-guard glass-border glass-border-glass-border/20 glass-contrast-guard"
        >
          <div className="glass-flex glass-items-center glass-gap-2">
            <button
              onClick={toggleListening}
              disabled={!isSupported || permissionStatus === "denied"}
              className={cn(
                "glass-px-4 glass-py-2 glass-radius-md font-medium transition-all",
                "glass-focus glass-touch-target glass-contrast-guard",
                isListening
                  ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                  : "bg-green-500/20 hover:bg-green-500/30 text-green-400",
                (!isSupported || permissionStatus === "denied") &&
                  "opacity-50 cursor-not-allowed"
              )}
            >
              {isListening ? "Stop Listening" : "Start Listening"}
            </button>

            <button
              onClick={clearTranscript}
              className='glass-px-3 glass-py-2 glass-radius-md glass-bg-secondary/20 hover:glass-bg-secondary/30 glass-focus glass-touch-target glass-contrast-guard'
            >
              Clear
            </button>
          </div>

          <div className="glass-flex glass-items-center glass-gap-2">
            <label htmlFor="voice-language" className="glass-text-sm">
              Language:
            </label>
            <select
              id="voice-language"
              value={language}
              onChange={(e) => {}}
              aria-label="Select voice recognition language"
              className="glass-px-2 glass-py-1 glass-radius-md glass-surface-overlay glass-border glass-border-glass-border/20 glass-focus glass-touch-target glass-contrast-guard"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
              <option value="it-IT">Italian</option>
              <option value="ja-JP">Japanese</option>
              <option value="ko-KR">Korean</option>
              <option value="zh-CN">Chinese (Mandarin)</option>
            </select>
          </div>

          <div className="glass-flex glass-items-center glass-gap-2">
            <label htmlFor="visualizer-style" className="glass-text-sm">
              Style:
            </label>
            <select
              id="visualizer-style"
              value={visualizerStyle}
              onChange={(e) => {}}
              aria-label="Select visualizer style"
              className="glass-px-2 glass-py-1 glass-radius-md glass-surface-overlay glass-border glass-border-glass-border/20 glass-focus glass-touch-target glass-contrast-guard"
            >
              <option value="waveform">Waveform</option>
              <option value="bars">Bars</option>
              <option value="circular">Circular</option>
              <option value="particle">Particle</option>
            </select>
          </div>

          <div className="glass-flex glass-items-center glass-gap-2">
            <label className="glass-text-sm">
              <input
                type="checkbox"
                checked={continuous}
                onChange={(e) => {}}
                className="glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"
              />
              Continuous
            </label>
            <label className="glass-text-sm">
              <input
                type="checkbox"
                checked={showVisualizer}
                onChange={(e) => {}}
                className="glass-mr-1 glass-focus glass-touch-target glass-contrast-guard"
              />
              Visualizer
            </label>
          </div>

          <div className="glass-flex glass-items-center glass-gap-2">
            <span className="glass-text-sm">Audio Level:</span>
            <div className='glass-w-20 glass-h-2 glass-surface-overlay glass-radius-full glass-overflow-hidden'>
              <div
                className='glass-h-full glass-surface-green/60 glass-transition-all glass-duration-100'
                style={{ width: `${audioLevel * 100}%` }}
              />
            </div>
          </div>
        </OptimizedGlass>
      );
    };

    return (
      <OptimizedGlass
        ref={ref}
        id={voiceInputId}
        elevation="level1"
        intensity="subtle"
        depth={1}
        tint="neutral"
        border="subtle"
        className={cn(
          "glass-voice-input relative glass-radius-lg glass-glass-backdrop-blur-md glass-contrast-guard border border-border/20",
          className
        )}
        role="region"
        aria-label="Voice input"
        data-testid={dataTestId}
        {...props}
      >
        <Motion
          preset={isMotionSafe && respectMotionPreference ? "fadeIn" : "none"}
          className="glass-flex glass-flex-col glass-gap-4 glass-p-4"
        >
          {renderControls()}

          {/* Status indicators */}
          <div className="glass-flex glass-items-center glass-justify-between glass-p-3 glass-surface-overlay glass-radius-md">
            <div className="glass-flex glass-items-center glass-gap-3">
              <div
                className={cn(
                  "w-3 h-3 glass-radius-full",
                  isListening ? "bg-green-500 animate-pulse" : "bg-red-500"
                )}
              />
              <span className='glass-text-sm glass-font-medium'>
                {isListening ? "Listening..." : "Ready"}
              </span>
              {frequency > 0 && (
                <span className="glass-text-xs glass-text-secondary">
                  {Math.round(frequency)}Hz
                </span>
              )}
            </div>

            <div className="glass-text-xs glass-text-secondary">
              {permissionStatus === "denied" && "Microphone access denied"}
              {!isSupported && "Speech recognition not supported"}
              {recognizedCommands.length > 0 &&
                `${recognizedCommands.length} commands recognized`}
            </div>
          </div>

          {/* Voice visualizer */}
          {showVisualizer && (
            <div className="glass-p-4 glass-surface-overlay glass-radius-md">
              <canvas
                ref={canvasRef}
                className="glass-w-full"
                style={{ height: "100px" }}
              />
            </div>
          )}

          {/* Transcript */}
          {showTranscript && (transcript || interimTranscript) && (
            <div className="glass-p-4 glass-surface-overlay glass-radius-md">
              <div className='glass-text-sm glass-font-medium glass-mb-2'>Transcript:</div>
              <div className="glass-text-sm">
                <span>{transcript}</span>
                {interimTranscript && (
                  <span className='glass-text-secondary glass-italic'>
                    {" "}
                    {interimTranscript}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Recent commands */}
          {recognizedCommands.length > 0 && (
            <div className="glass-p-4 glass-surface-overlay glass-radius-md">
              <div className='glass-text-sm glass-font-medium glass-mb-2'>
                Recent Commands:
              </div>
              <div className='glass-space-y-1'>
                {recognizedCommands.slice(-5).map((command: any) => (
                  <div
                    key={command.id}
                    className="glass-text-xs glass-p-2 glass-surface-primary/10 glass-radius-sm"
                  >
                    <span className='glass-font-medium'>{command.phrase}</span>
                    <span className="glass-text-secondary glass-ml-2">
                      ({Math.round(command.confidence * 100)}% confidence)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Motion>
      </OptimizedGlass>
    );
  }
);

GlassVoiceInput.displayName = "GlassVoiceInput";

export default GlassVoiceInput;
