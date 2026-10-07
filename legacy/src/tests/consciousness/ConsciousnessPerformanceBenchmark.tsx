/**
 * Consciousness Interface Performance Benchmark Suite
 *
 * Performance testing and optimization validation for consciousness features
 * across all enhanced components to ensure smooth user experience.
 */
import React from 'react';
import { render, act, cleanup } from '@testing-library/react';

// Performance monitoring utilities
class PerformanceMonitor {
  private startTime: number = 0;
  private measurements: { [key: string]: number[] } = {};
  private memoryBaseline: number = 0;
  
  startMeasurement(testName: string) {
    this.startTime = performance.now();
    // Record memory baseline if available
    if ('memory' in performance && (performance as any).memory) {
      this.memoryBaseline = (performance as any).memory.usedJSHeapSize;
    }
  }
  
  endMeasurement(testName: string) {
    const duration = performance.now() - this.startTime;
    
    if (!this.measurements[testName]) {
      this.measurements[testName] = [];
    }
    
    this.measurements[testName].push(duration);
    return duration;
  }
  
  getAverageTime(testName: string): number {
    const measurements = this.measurements[testName] || [];
    return measurements.length > 0 
      ? measurements.reduce((sum, time) => sum + time, 0) / measurements.length
      : 0;
  }
  
  getMemoryDelta(): number {
    if ('memory' in performance && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize - this.memoryBaseline;
    }
    return 0;
  }
  
  reset() {
    this.measurements = {};
    this.startTime = 0;
    this.memoryBaseline = 0;
  }
}

// Mock consciousness hooks with performance tracking
const createPerformanceTrackingMock = (hookName: string) => {
  let callCount = 0;
  
  return {
    ...jest.fn().mockImplementation(() => {
      callCount++;
      
      // Simulate realistic hook initialization time
      const initTime = Math.random() * 2; // 0-2ms
      const start = performance.now();
      while (performance.now() - start < initTime) {
        // Busy wait to simulate processing
      }
      
      return {
        isActive: true,
        currentStressLevel: 0.5,
        getPatterns: jest.fn(() => []),
        getInsights: jest.fn(() => []),
        playGlassSound: jest.fn(),
        recordAction: jest.fn(),
        trackEvent: jest.fn(),
        recordClick: jest.fn(),
        onGazeEnter: jest.fn(),
        onGazeExit: jest.fn(),
      };
    }),
    getCallCount: () => callCount,
    reset: () => { callCount = 0; }
  };
};

const mockPredictiveEngine = createPerformanceTrackingMock('usePredictiveEngine');
const mockBiometricAdapter = createPerformanceTrackingMock('useBiometricAdaptation');
const mockEyeTracker = createPerformanceTrackingMock('useEyeTracking');
const mockSpatialAudio = createPerformanceTrackingMock('useSpatialAudio');
const mockAchievements = createPerformanceTrackingMock('useAchievements');
const mockInteractionRecorder = createPerformanceTrackingMock('useInteractionRecorder');

// Mock hooks with performance tracking
jest.mock('../../components/advanced/GlassPredictiveEngine', () => ({
  usePredictiveEngine: mockPredictiveEngine,
  useInteractionRecorder: mockInteractionRecorder,
}));

jest.mock('../../components/advanced/GlassBiometricAdaptation', () => ({
  useBiometricAdaptation: mockBiometricAdapter,
}));

jest.mock('../../components/advanced/GlassEyeTracking', () => ({
  useEyeTracking: mockEyeTracker,
}));

jest.mock('../../components/advanced/GlassSpatialAudio', () => ({
  useSpatialAudio: mockSpatialAudio,
}));

jest.mock('../../components/advanced/GlassAchievementSystem', () => ({
  useAchievements: mockAchievements,
}));

// Import consciousness-enhanced components
import { ConsciousGlassContainer } from '../../components/layout/GlassContainer';
import { ConsciousGlassButton } from '../../components/button/GlassButton';
import { ConsciousGlassChart } from '../../components/charts/GlassChart';
import { ConsciousGlassDataTable } from '../../components/data-display/GlassDataTable';
import { GlassCarousel } from '../../components/interactive/GlassCarousel';

describe('Consciousness Interface Performance Benchmark', () => {
  const performanceMonitor = new PerformanceMonitor();
  
  beforeEach(() => {
    performanceMonitor.reset();
    
    // Reset all mock counters
    mockPredictiveEngine.reset();
    mockBiometricAdapter.reset();
    mockEyeTracker.reset();
    mockSpatialAudio.reset();
    mockAchievements.reset();
    mockInteractionRecorder.reset();
    
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    cleanup();
  });

  describe('Component Initialization Performance', () => {
    it('should initialize consciousness-enhanced container within performance budget', async () => {
      performanceMonitor.startMeasurement('container-init');
      
      const TestContainer = () => (
        <ConsciousGlassContainer
          predictive={true}
          adaptive={true}
          eyeTracking={true}
          spatialAudio={true}
          trackAchievements={true}
        >
          <div>Test Content</div>
        </ConsciousGlassContainer>
      );
      
      await act(async () => {
        render(<TestContainer />);
      });
      
      const initTime = performanceMonitor.endMeasurement('container-init');
      
      // Container should initialize within 50ms
      expect(initTime).toBeLessThan(50);
      
      // Memory usage should be reasonable (less than 1MB for component init)
      const memoryDelta = performanceMonitor.getMemoryDelta();
      expect(memoryDelta).toBeLessThan(1024 * 1024); // 1MB
    });
    
    it('should handle multiple consciousness components efficiently', async () => {
      performanceMonitor.startMeasurement('multiple-components-init');
      
      const TestApp = () => (
        <ConsciousGlassContainer>
          <ConsciousGlassButton>Button 1</ConsciousGlassButton>
          <ConsciousGlassButton>Button 2</ConsciousGlassButton>
          <ConsciousGlassButton>Button 3</ConsciousGlassButton>
          <ConsciousGlassDataTable
            data={[{ id: 1, name: 'Test' }]}
            columns={[{ accessorKey: 'name', header: 'Name' }]}
          />
          <ConsciousGlassChart
            type="bar"
            data={[{ x: 1, y: 10 }]}
          />
        </ConsciousGlassContainer>
      );
      
      await act(async () => {
        render(<TestApp />);
      });
      
      const initTime = performanceMonitor.endMeasurement('multiple-components-init');
      
      // Multiple components should initialize within 200ms
      expect(initTime).toBeLessThan(200);
      
      // Hook calls should be reasonable (not exponential)
      const totalHookCalls = mockPredictiveEngine.getCallCount() + 
                           mockBiometricAdapter.getCallCount() +
                           mockEyeTracker.getCallCount() +
                           mockSpatialAudio.getCallCount() +
                           mockAchievements.getCallCount();
      
      // Should not exceed reasonable hook call count
      expect(totalHookCalls).toBeLessThan(30);
    });
    
    it('should scale efficiently with component count', async () => {
      const componentCounts = [1, 5, 10, 20];
      const initTimes: number[] = [];
      
      for (const count of componentCounts) {
        performanceMonitor.startMeasurement(`scale-test-${count}`);
        
        const TestApp = () => (
          <ConsciousGlassContainer>
            {Array.from({ length: count }, (_, i) => (
              <ConsciousGlassButton key={i}>
                Button {i + 1}
              </ConsciousGlassButton>
            ))}
          </ConsciousGlassContainer>
        );
        
        await act(async () => {
          const { unmount } = render(<TestApp />);
          unmount();
        });
        
        const initTime = performanceMonitor.endMeasurement(`scale-test-${count}`);
        initTimes.push(initTime);
      }
      
      // Performance should scale sub-linearly (not exponentially)
      const scaleFactor1to5 = initTimes[1] / initTimes[0];
      const scaleFactor5to10 = initTimes[2] / initTimes[1];
      const scaleFactor10to20 = initTimes[3] / initTimes[2];
      
      // Each doubling should be less than linear scaling
      expect(scaleFactor1to5).toBeLessThan(5);
      expect(scaleFactor5to10).toBeLessThan(2);
      expect(scaleFactor10to20).toBeLessThan(2);
    });
  });
  
  describe('Runtime Performance', () => {
    it('should handle rapid consciousness state updates efficiently', async () => {
      const TestComponent = () => (
        <ConsciousGlassContainer
          adaptive={true}
          biometricResponsive={true}
        >
          <ConsciousGlassButton>Adaptive Button</ConsciousGlassButton>
        </ConsciousGlassContainer>
      );
      
      const { rerender } = render(<TestComponent />);
      
      performanceMonitor.startMeasurement('rapid-updates');
      
      // Simulate rapid biometric updates
      for (let i = 0; i < 100; i++) {
        // Change stress level rapidly
        mockBiometricAdapter().currentStressLevel = Math.random();
        
        await act(async () => {
          rerender(<TestComponent />);
          await new Promise(resolve => setTimeout(resolve, 1));
        });
      }
      
      const updateTime = performanceMonitor.endMeasurement('rapid-updates');
      
      // 100 rapid updates should complete within 1 second
      expect(updateTime).toBeLessThan(1000);
    });
    
    it('should efficiently handle large dataset consciousness processing', async () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        value: Math.random() * 100,
      }));
      
      performanceMonitor.startMeasurement('large-dataset');
      
      const TestComponent = () => (
        <ConsciousGlassDataTable
          data={largeDataset}
          columns={[
            { accessorKey: 'name', header: 'Name' },
            { accessorKey: 'value', header: 'Value' }
          ]}
          predictive={true}
          gazeResponsive={true}
        />
      );
      
      await act(async () => {
        render(<TestComponent />);
      });
      
      const processingTime = performanceMonitor.endMeasurement('large-dataset');
      
      // Large dataset should process within 500ms
      expect(processingTime).toBeLessThan(500);
    });
    
    it('should maintain 60fps during consciousness animations', async () => {
      const frameTime = 1000 / 60; // 16.67ms per frame
      let frameCount = 0;
      let totalFrameTime = 0;
      
      const TestComponent = () => (
        <GlassCarousel
          items={Array.from({ length: 10 }, (_, i) => ({
            id: `slide-${i}`,
            content: `Slide ${i + 1}`
          }))}
          predictive={true}
          eyeTracking={true}
          spatialAudio={true}
        />
      );
      
      render(<TestComponent />);
      
      // Simulate animation frames
      const startTime = performance.now();
      
      for (let i = 0; i < 60; i++) { // Test 1 second worth of frames
        const frameStart = performance.now();
        
        await act(async () => {
          // Simulate frame update
          await new Promise(resolve => requestAnimationFrame(resolve));
        });
        
        const frameEnd = performance.now();
        const frameTime = frameEnd - frameStart;
        
        totalFrameTime += frameTime;
        frameCount++;
      }
      
      const averageFrameTime = totalFrameTime / frameCount;
      
      // Average frame time should be under budget (16.67ms)
      expect(averageFrameTime).toBeLessThan(frameTime * 1.5); // Allow 50% buffer
    });
  });
  
  describe('Memory Management', () => {
    it('should properly clean up consciousness features on unmount', async () => {
      const initialMemory = performanceMonitor.getMemoryDelta();
      
      const TestComponent = () => (
        <ConsciousGlassContainer
          predictive={true}
          adaptive={true}
          eyeTracking={true}
          spatialAudio={true}
        >
          <ConsciousGlassChart
            type="line"
            data={Array.from({ length: 100 }, (_, i) => ({ x: i, y: Math.random() * 100 }))}
          />
        </ConsciousGlassContainer>
      );
      
      const { unmount } = render(<TestComponent />);
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      unmount();
      
      // Allow cleanup to occur
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });
      
      // Force garbage collection again
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = performanceMonitor.getMemoryDelta();
      
      // Memory should not significantly increase after cleanup
      expect(finalMemory).toBeLessThan(initialMemory + (1024 * 1024)); // Allow 1MB variance
    });
    
    it('should handle memory efficiently with component recycling', async () => {
      const TestApp = ({ componentCount }: { componentCount: number }) => (
        <ConsciousGlassContainer>
          {Array.from({ length: componentCount }, (_, i) => (
            <ConsciousGlassButton key={i}>
              Button {i}
            </ConsciousGlassButton>
          ))}
        </ConsciousGlassContainer>
      );
      
      const { rerender, unmount } = render(<TestApp componentCount={10} />);
      
      const baselineMemory = performanceMonitor.getMemoryDelta();
      
      // Rapidly change component count to test recycling
      for (let count = 5; count <= 50; count += 5) {
        await act(async () => {
          rerender(<TestApp componentCount={count} />);
          await new Promise(resolve => setTimeout(resolve, 10));
        });
      }
      
      const peakMemory = performanceMonitor.getMemoryDelta();
      
      // Back to baseline
      await act(async () => {
        rerender(<TestApp componentCount={10} />);
        await new Promise(resolve => setTimeout(resolve, 100));
      });
      
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = performanceMonitor.getMemoryDelta();
      
      unmount();
      
      // Memory growth should be bounded
      expect(peakMemory - baselineMemory).toBeLessThan(10 * 1024 * 1024); // 10MB max
      expect(finalMemory - baselineMemory).toBeLessThan(2 * 1024 * 1024); // 2MB final
    });
  });
  
  describe('Consciousness Feature Performance Budget', () => {
    it('should meet performance budget for minimal consciousness features', async () => {
      performanceMonitor.startMeasurement('minimal-consciousness');
      
      const TestComponent = () => (
        <ConsciousGlassContainer
          predictive={true}
          trackAchievements={true}
        >
          <ConsciousGlassButton>Minimal Consciousness</ConsciousGlassButton>
        </ConsciousGlassContainer>
      );
      
      await act(async () => {
        render(<TestComponent />);
      });
      
      const initTime = performanceMonitor.endMeasurement('minimal-consciousness');
      
      // Minimal consciousness should be very fast
      expect(initTime).toBeLessThan(25);
    });
    
    it('should meet performance budget for balanced consciousness features', async () => {
      performanceMonitor.startMeasurement('balanced-consciousness');
      
      const TestComponent = () => (
        <ConsciousGlassContainer
          predictive={true}
          adaptive={true}
          biometricResponsive={true}
          trackAchievements={true}
        >
          <ConsciousGlassButton>Balanced Consciousness</ConsciousGlassButton>
        </ConsciousGlassContainer>
      );
      
      await act(async () => {
        render(<TestComponent />);
      });
      
      const initTime = performanceMonitor.endMeasurement('balanced-consciousness');
      
      // Balanced consciousness should still be fast
      expect(initTime).toBeLessThan(50);
    });
    
    it('should meet performance budget for full consciousness features', async () => {
      performanceMonitor.startMeasurement('full-consciousness');
      
      const TestComponent = () => (
        <ConsciousGlassContainer
          predictive={true}
          preloadContent={true}
          eyeTracking={true}
          gazeResponsive={true}
          adaptive={true}
          biometricResponsive={true}
          spatialAudio={true}
          audioFeedback={true}
          trackAchievements={true}
        >
          <ConsciousGlassButton>Full Consciousness</ConsciousGlassButton>
        </ConsciousGlassContainer>
      );
      
      await act(async () => {
        render(<TestComponent />);
      });
      
      const initTime = performanceMonitor.endMeasurement('full-consciousness');
      
      // Full consciousness should still be within budget
      expect(initTime).toBeLessThan(100);
    });
  });
  
  describe('Performance Regression Detection', () => {
    it('should detect performance regressions in consciousness initialization', async () => {
      const baselineRuns = 10;
      const initTimes: number[] = [];
      
      // Establish baseline
      for (let i = 0; i < baselineRuns; i++) {
        performanceMonitor.startMeasurement(`baseline-${i}`);
        
        const TestComponent = () => (
          <ConsciousGlassContainer
            predictive={true}
            adaptive={true}
            trackAchievements={true}
          >
            <ConsciousGlassButton>Regression Test</ConsciousGlassButton>
          </ConsciousGlassContainer>
        );
        
        await act(async () => {
          const { unmount } = render(<TestComponent />);
          unmount();
        });
        
        const time = performanceMonitor.endMeasurement(`baseline-${i}`);
        initTimes.push(time);
      }
      
      const averageTime = initTimes.reduce((sum, time) => sum + time, 0) / initTimes.length;
      const standardDeviation = Math.sqrt(
        initTimes.reduce((sum, time) => sum + Math.pow(time - averageTime, 2), 0) / initTimes.length
      );
      
      // Performance should be consistent (low standard deviation)
      expect(standardDeviation).toBeLessThan(averageTime * 0.5); // 50% variance max
      
      // Store baseline for future regression testing
      const performanceBaseline = {
        averageTime,
        standardDeviation,
        maxTime: Math.max(...initTimes),
        minTime: Math.min(...initTimes),
      };
      
      // Baseline should be reasonable
      expect(performanceBaseline.averageTime).toBeLessThan(75);
      expect(performanceBaseline.maxTime).toBeLessThan(150);
    });
  });
});

/**
 * Performance Testing Utilities
 */
export class ConsciousnessPerformanceUtils {
  /**
   * Measure component render time
   */
  static async measureRenderTime(component: React.ReactElement): Promise<number> {
    const start = performance.now();
    
    await act(async () => {
      const { unmount } = render(component);
      unmount();
    });
    
    return performance.now() - start;
  }
  
  /**
   * Measure memory usage of components
   */
  static measureMemoryUsage(): number {
    if ('memory' in performance && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }
  
  /**
   * Run performance benchmark
   */
  static async runBenchmark(
    testName: string, 
    component: React.ReactElement, 
    iterations: number = 10
  ): Promise<{
    averageTime: number;
    minTime: number;
    maxTime: number;
    standardDeviation: number;
  }> {
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const time = await this.measureRenderTime(component);
      times.push(time);
    }
    
    const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    const variance = times.reduce((sum, time) => sum + Math.pow(time - averageTime, 2), 0) / times.length;
    const standardDeviation = Math.sqrt(variance);
    
    return {
      averageTime,
      minTime: Math.min(...times),
      maxTime: Math.max(...times),
      standardDeviation,
    };
  }
  
  /**
   * Profile consciousness hook usage
   */
  static getHookUsageProfile() {
    return {
      predictiveEngine: mockPredictiveEngine.getCallCount(),
      biometricAdapter: mockBiometricAdapter.getCallCount(),
      eyeTracker: mockEyeTracker.getCallCount(),
      spatialAudio: mockSpatialAudio.getCallCount(),
      achievements: mockAchievements.getCallCount(),
      interactionRecorder: mockInteractionRecorder.getCallCount(),
    };
  }
}