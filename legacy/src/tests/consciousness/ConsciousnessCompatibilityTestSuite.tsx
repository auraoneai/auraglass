/**
 * Consciousness Interface Compatibility Test Suite
 *
 * Comprehensive testing for cross-component consciousness feature integration,
 * ensuring all consciousness-enhanced components work together seamlessly.
 */
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock consciousness interface hooks
const mockPredictiveEngine = {
  getPatterns: jest.fn(() => []),
  getInsights: jest.fn(() => []),
  recordInteraction: jest.fn(),
  predictNext: jest.fn(),
};

const mockBiometricAdapter = {
  currentStressLevel: 0.5,
  isActive: true,
  adaptiveSettings: {},
};

const mockEyeTracker = {
  isActive: true,
  currentGaze: null,
  onGazeEnter: jest.fn(),
  onGazeExit: jest.fn(),
  offGazeEnter: jest.fn(),
  offGazeExit: jest.fn(),
};

const mockSpatialAudio = {
  isActive: true,
  playGlassSound: jest.fn(),
  setGlobalVolume: jest.fn(),
};

const mockAchievements = {
  isActive: true,
  trackEvent: jest.fn(),
  recordAction: jest.fn(),
  getProgress: jest.fn(() => ({})),
};

const mockInteractionRecorder = {
  recordClick: jest.fn(),
  recordScroll: jest.fn(),
  recordFocus: jest.fn(),
  recordInteraction: jest.fn(),
};

// Extend Jest matchers for accessibility testing
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveAttribute(name: string, value?: string): R;
      toHaveTextContent(text: string): R;
      toHaveFocus(): R;
      toHaveClass(className: string): R;
      toBeVisible(): R;
      toBeInTheDocument(): R;
    }
  }
}

// Mock hooks
jest.mock('../../components/advanced/GlassPredictiveEngine', () => ({
  usePredictiveEngine: () => mockPredictiveEngine,
  useInteractionRecorder: () => mockInteractionRecorder,
}));

jest.mock('../../components/advanced/GlassBiometricAdaptation', () => ({
  useBiometricAdaptation: () => mockBiometricAdapter,
}));

jest.mock('../../components/advanced/GlassEyeTracking', () => ({
  useEyeTracking: () => mockEyeTracker,
}));

jest.mock('../../components/advanced/GlassSpatialAudio', () => ({
  useSpatialAudio: () => mockSpatialAudio,
}));

jest.mock('../../components/advanced/GlassAchievementSystem', () => ({
  useAchievements: () => mockAchievements,
}));

// Import consciousness-enhanced components
import { GlassButton } from '../../components/button/GlassButton';
import { GlassChart } from '../../components/charts/GlassChart';
import { GlassContainer } from '../../components/layout/GlassContainer';
import { GlassHeader } from '../../components/navigation/GlassHeader';
// GlassModal not available, using regular GlassModal
import { GlassDataTable } from '../../components/data-display/GlassDataTable';
import { GlassCarousel } from '../../components/interactive/GlassCarousel';
import { GlassModal } from '../../components/modal/GlassModal';

describe('Consciousness Interface Compatibility Test Suite', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Reset mock states
    mockBiometricAdapter.currentStressLevel = 0.5;
    mockEyeTracker.currentGaze = null;
    mockPredictiveEngine.getPatterns.mockReturnValue([]);
    mockPredictiveEngine.getInsights.mockReturnValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Cross-Component Integration Tests', () => {
    it('should integrate consciousness features across nested components', async () => {
      const TestApp = () => (
        <GlassContainer 
          predictive={true}
          adaptive={true}
          trackAchievements={true}
          usageContext="main"
        >
          <GlassHeader 
            predictive={true}
            eyeTracking={true}
            spatialAudio={true}
          >
            Test App
          </GlassHeader>
          
          <GlassButton 
            adaptive={true}
            biometricResponsive={true}
            audioFeedback={true}
          >
            Action Button
          </GlassButton>
          
          <GlassDataTable
            data={[{ id: 1, name: 'Test' }]}
            columns={[{ header: 'Name', accessorKey: 'name' }]}
            predictive={true}
            gazeResponsive={true}
          />
        </GlassContainer>
      );

      render(<TestApp />);
      
      // Verify consciousness features are initialized across components
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
      
      // Test interaction recording across components
      const button = screen.getByRole('button');
      await userEvent.click(button);
      
      // Verify consciousness hooks are called
      expect(mockInteractionRecorder.recordClick).toHaveBeenCalled();
      expect(mockAchievements.recordAction).toHaveBeenCalled();
      expect(mockSpatialAudio.playGlassSound).toHaveBeenCalled();
    });

    it('should handle consciousness state synchronization between components', async () => {
      let containerStressLevel = 0.5;
      let headerStressLevel = 0.5;
      
      const TestApp = () => {
        // Simulate shared biometric state
        mockBiometricAdapter.currentStressLevel = 0.8; // High stress
        
        return (
          <GlassContainer 
            adaptive={true}
            biometricResponsive={true}
            data-testid="container"
          >
            <GlassHeader 
              adaptive={true}
              biometricResponsive={true}
              data-testid="header"
            >
              Stress Test
            </GlassHeader>
            
            <GlassButton 
              adaptive={true}
              biometricResponsive={true}
              data-testid="button"
            >
              Adaptive Button
            </GlassButton>
          </GlassContainer>
        );
      };

      render(<TestApp />);
      
      // Allow biometric adaptation to occur
      await waitFor(() => {
        expect(screen.getByTestId('container')).toHaveClass('chart-simplified');
        expect(screen.getByTestId('button')).toHaveClass('adaptive-stress-high');
      }, { timeout: 5000 });
    });

    it('should coordinate spatial audio across multiple components', async () => {
      const TestApp = () => (
        <GlassContainer spatialAudio={true}>
          <GlassCarousel
            items={[{ id: '1', content: 'Slide 1' }]}
            spatialAudio={true}
            audioFeedback={true}
            data-testid="carousel"
          />
          
          <GlassModal
            open={true}
            onClose={() => {}}
            spatialAudio={true}
            audioFeedback={true}
            data-testid="modal"
          >
            Modal Content
          </GlassModal>
        </GlassContainer>
      );

      render(<TestApp />);
      
      // Test spatial audio coordination
      const modal = screen.getByTestId('modal');
      fireEvent.click(modal);
      
      // Verify spatial audio calls are made with proper positioning
      expect(mockSpatialAudio.playGlassSound).toHaveBeenCalledWith(
        expect.stringContaining('modal'),
        undefined,
        expect.any(Object)
      );
    });

    it('should handle achievement tracking across component interactions', async () => {
      const TestApp = () => (
        <GlassContainer trackAchievements={true}>
          <GlassChart
            type="bar"
            data={[{ x: 1, y: 10 }]}
            trackAchievements={true}
            achievementId="chart_interaction"
            data-testid="chart"
          />
          
          <GlassButton
            trackAchievements={true}
            achievementId="button_interaction"
            data-testid="button"
          >
            Chart Action
          </GlassButton>
        </GlassContainer>
      );

      render(<TestApp />);
      
      // Test cross-component achievement tracking
      const button = screen.getByTestId('button');
      await userEvent.click(button);
      
      const chart = screen.getByTestId('chart');
      fireEvent.click(chart);
      
      // Verify achievement tracking calls
      expect(mockAchievements.recordAction).toHaveBeenCalledWith(
        'button_interaction',
        expect.any(Object)
      );
      expect(mockAchievements.recordAction).toHaveBeenCalledWith(
        'chart_interaction',
        expect.any(Object)
      );
    });
  });

  describe('Consciousness Feature Performance Tests', () => {
    it('should handle high-frequency consciousness updates without performance degradation', async () => {
      let renderCount = 0;
      
      const TestComponent = () => {
        renderCount++;
        return (
          <GlassContainer
            predictive={true}
            adaptive={true}
            eyeTracking={true}
            spatialAudio={true}
            data-testid="performance-container"
          >
            <GlassDataTable
              data={Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }))}
              columns={[{ header: 'Name', accessorKey: 'name' }]}
              predictive={true}
              gazeResponsive={true}
            />
          </GlassContainer>
        );
      };

      render(<TestComponent />);
      
      // Simulate rapid consciousness updates
      for (let i = 0; i < 10; i++) {
        mockBiometricAdapter.currentStressLevel = Math.random();
        
        // Trigger consciousness update cycle
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
        });
      }
      
      // Ensure reasonable render count (shouldn't re-render excessively)
      expect(renderCount).toBeLessThan(15); // Allow for some re-renders but not excessive
    });

    it('should efficiently manage consciousness hook subscriptions', async () => {
      const { unmount } = render(
        <GlassContainer
          predictive={true}
          eyeTracking={true}
          spatialAudio={true}
          adaptive={true}
          trackAchievements={true}
        >
          <GlassButton>Test</GlassButton>
        </GlassContainer>
      );
      
      // Verify hooks are initialized
      expect(mockEyeTracker.onGazeEnter).toHaveBeenCalled();
      expect(mockEyeTracker.onGazeExit).toHaveBeenCalled();
      
      // Unmount and verify cleanup
      unmount();
      
      expect(mockEyeTracker.offGazeEnter).toHaveBeenCalled();
      expect(mockEyeTracker.offGazeExit).toHaveBeenCalled();
    });
  });

  describe('Consciousness State Management Tests', () => {
    it('should maintain consciousness state consistency across component updates', async () => {
      let stressLevel = 0.3;
      
      const TestApp = ({ stress }: { stress: number }) => {
        mockBiometricAdapter.currentStressLevel = stress;
        
        return (
          <GlassContainer
            adaptive={true}
            biometricResponsive={true}
            data-testid="container"
          >
            <GlassButton
              adaptive={true}
              biometricResponsive={true}
              data-testid="button"
            >
              Adaptive Button
            </GlassButton>
          </GlassContainer>
        );
      };

      const { rerender } = render(<TestApp stress={0.3} />);
      
      // Initial state should be medium complexity
      await waitFor(() => {
        const container = screen.getByTestId('container');
        expect(container).not.toHaveClass('chart-simplified');
        expect(container).not.toHaveClass('chart-enhanced');
      });
      
      // Update to high stress
      rerender(<TestApp stress={0.8} />);
      
      await waitFor(() => {
        const container = screen.getByTestId('container');
        expect(container).toHaveClass('chart-simplified');
      });
      
      // Update to low stress
      rerender(<TestApp stress={0.2} />);
      
      await waitFor(() => {
        const container = screen.getByTestId('container');
        expect(container).toHaveClass('chart-enhanced');
      });
    });

    it('should handle consciousness feature toggling dynamically', async () => {
      const TestApp = ({ features }: { features: { predictive: boolean; adaptive: boolean } }) => (
        <GlassContainer
          predictive={features.predictive}
          adaptive={features.adaptive}
          data-testid="container"
        >
          <GlassButton data-testid="button">Test</GlassButton>
        </GlassContainer>
      );

      const { rerender } = render(<TestApp features={{ predictive: false, adaptive: false }} />);
      
      // No consciousness features initially
      expect(screen.getByTestId('container')).toHaveAttribute('data-consciousness-level', '0');
      
      // Enable predictive
      rerender(<TestApp features={{ predictive: true, adaptive: false }} />);
      expect(screen.getByTestId('container')).toHaveAttribute('data-consciousness-level', '1');
      
      // Enable adaptive
      rerender(<TestApp features={{ predictive: true, adaptive: true }} />);
      expect(screen.getByTestId('container')).toHaveAttribute('data-consciousness-level', '2');
    });
  });

  describe('Error Handling and Resilience Tests', () => {
    it('should gracefully handle consciousness hook failures', async () => {
      // Mock hook failure
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Make predictive engine throw an error
      mockPredictiveEngine.getPatterns.mockImplementation(() => {
        throw new Error('Predictive engine failure');
      });
      
      const TestApp = () => (
        <GlassContainer
          predictive={true}
          data-testid="container"
        >
          <GlassButton data-testid="button">Test</GlassButton>
        </GlassContainer>
      );

      // Should render without crashing
      expect(() => render(<TestApp />)).not.toThrow();
      
      // Should log warning
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('insights analysis failed')
        );
      });
      
      consoleSpy.mockRestore();
    });

    it('should maintain basic functionality when consciousness features are disabled', () => {
      const TestApp = () => (
        <GlassContainer
          predictive={false}
          adaptive={false}
          eyeTracking={false}
          spatialAudio={false}
          trackAchievements={false}
          data-testid="container"
        >
          <GlassButton data-testid="button">Basic Button</GlassButton>
        </GlassContainer>
      );

      render(<TestApp />);
      
      // Basic functionality should work
      expect(screen.getByTestId('button')).toBeInTheDocument();
      expect(screen.getByText('Basic Button')).toBeInTheDocument();
      
      // No consciousness features should be active
      expect(screen.getByTestId('container')).toHaveAttribute('data-consciousness-level', '0');
      
      // Basic interactions should still work
      fireEvent.click(screen.getByTestId('button'));
      
      // Consciousness hooks should not be called
      expect(mockPredictiveEngine.getPatterns).not.toHaveBeenCalled();
      expect(mockSpatialAudio.playGlassSound).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility Integration Tests', () => {
    it('should maintain accessibility while adding consciousness features', async () => {
      const TestApp = () => (
        <GlassContainer
          predictive={true}
          eyeTracking={true}
          role="main"
          aria-label="Consciousness-enhanced container"
        >
          <GlassButton
            adaptive={true}
            aria-describedby="button-desc"
          >
            Accessible Conscious Button
          </GlassButton>
          
          <div id="button-desc">
            This button adapts to your stress level
          </div>
        </GlassContainer>
      );

      render(<TestApp />);
      
      // Verify accessibility attributes are preserved
      expect(screen.getByRole('main')).toHaveAttribute('aria-label', 'Consciousness-enhanced container');
      expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', 'button-desc');
      
      // Verify consciousness features don't interfere with screen readers
      const button = screen.getByRole('button');
      expect(button).toBeVisible();
      expect(button).not.toHaveAttribute('aria-hidden');
    });
  });
});

/**
 * Integration Test Utilities for Consciousness Features
 */
export class ConsciousnessTestUtils {
  /**
   * Simulate biometric stress level changes
   */
  static simulateStressChange(level: number) {
    mockBiometricAdapter.currentStressLevel = Math.max(0, Math.min(1, level));
  }
  
  /**
   * Simulate eye tracking gaze events
   */
  static simulateGazeEvent(element: HTMLElement, type: 'enter' | 'exit') {
    const handler = type === 'enter' 
      ? mockEyeTracker.onGazeEnter.mock.calls[0]?.[1]
      : mockEyeTracker.onGazeExit.mock.calls[0]?.[1];
    
    if (handler) {
      handler(element);
    }
  }
  
  /**
   * Verify consciousness feature integration
   */
  static verifyConsciousnessIntegration(container: HTMLElement) {
    expect(container).toHaveAttribute('data-consciousness-level');
    expect(container).toHaveAttribute('data-usage-context');
  }
  
  /**
   * Get mock call counts for consciousness features
   */
  static getConsciousnessMetrics() {
    return {
      predictiveEngineCalls: mockPredictiveEngine.getPatterns.mock.calls.length,
      biometricAdaptations: mockBiometricAdapter.currentStressLevel,
      spatialAudioCalls: mockSpatialAudio.playGlassSound.mock.calls.length,
      achievementTracking: mockAchievements.recordAction.mock.calls.length,
      interactionRecording: mockInteractionRecorder.recordClick.mock.calls.length,
    };
  }
  
  /**
   * Reset all consciousness mocks
   */
  static resetMocks() {
    jest.clearAllMocks();
    mockBiometricAdapter.currentStressLevel = 0.5;
    mockEyeTracker.currentGaze = null;
  }
}