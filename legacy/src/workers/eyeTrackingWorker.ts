/**
 * Eye Tracking Web Worker
 * Handles computationally intensive eye tracking calculations off the main thread
 */

interface EyeTrackingMessage {
  command: "start" | "stop" | "process";
  data?: {
    videoFrame?: ImageData;
    timestamp?: number;
  };
}

interface GazeData {
  x: number;
  y: number;
  confidence: number;
  timestamp: number;
}

let isTracking = false;
let processingInterval: ReturnType<typeof setInterval> | null = null;

// Simplified eye tracking algorithm (placeholder for actual ML model)
function processEyeTracking(frame?: ImageData): GazeData {
  // In production, this would use TensorFlow.js or similar
  // For now, return mock data with realistic patterns
  const timestamp = Date.now();

  // Simulate natural eye movement patterns
  const baseX = 0.5 + Math.sin(timestamp / 1000) * 0.2;
  const baseY = 0.5 + Math.cos(timestamp / 1500) * 0.2;

  // Add small random variations (saccades)
  const x = Math.max(0, Math.min(1, baseX + (Math.random() - 0.5) * 0.05));
  const y = Math.max(0, Math.min(1, baseY + (Math.random() - 0.5) * 0.05));

  return {
    x,
    y,
    confidence: 0.85 + Math.random() * 0.15, // 85-100% confidence
    timestamp,
  };
}

// Listen for messages from main thread
self.addEventListener("message", (event: MessageEvent<EyeTrackingMessage>) => {
  const { command, data } = event.data;

  switch (command) {
    case "start":
      isTracking = true;

      // Process eye tracking at 60fps
      processingInterval = setInterval(() => {
        if (isTracking) {
          const gazeData = processEyeTracking();
          self.postMessage(gazeData);
        }
      }, 16.67); // ~60fps

      self.postMessage({ status: "started" });
      break;

    case "stop":
      isTracking = false;

      if (processingInterval) {
        clearInterval(processingInterval);
        processingInterval = null;
      }

      self.postMessage({ status: "stopped" });
      break;

    case "process":
      if (data?.videoFrame) {
        const gazeData = processEyeTracking(data.videoFrame);
        self.postMessage(gazeData);
      }
      break;

    default:
      self.postMessage({ error: "Unknown command" });
  }
});

// Notify main thread that worker is ready
self.postMessage({ status: "ready" });
