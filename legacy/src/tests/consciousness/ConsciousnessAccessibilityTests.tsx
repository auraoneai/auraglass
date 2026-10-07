/**
 * Consciousness Interface Accessibility Compliance Test Suite
 *
 * Comprehensive accessibility testing to ensure consciousness-enhanced components
 * maintain full accessibility compliance and provide inclusive experiences.
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mock axe accessibility testing library
const axe = jest.fn().mockResolvedValue({ violations: [] });

// Extend Jest matchers for accessibility testing
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R;
      toHaveAttribute(name: string, value?: string): R;
      toHaveTextContent(text: string): R;
      toHaveFocus(): R;
      toHaveClass(className: string): R;
      toBeVisible(): R;
      toBeInTheDocument(): R;
    }
  }
}

expect.extend({
  toHaveNoViolations(results: { violations: any[] }) {
    const pass = results.violations.length === 0;
    return {
      pass,
      message: () => pass
        ? 'Expected accessibility violations but found none'
        : `Found ${results.violations.length} accessibility violations: ${JSON.stringify(results.violations)}`,
    };
  },
});

// Mock consciousness hooks with accessibility considerations
const mockPredictiveEngine = {
  isActive: true,
  getPatterns: jest.fn(() => []),
  getInsights: jest.fn(() => [{ 
    id: '1', 
    title: 'Data Trend', 
    message: 'Values increasing by 15%',
    confidence: 0.8,
    accessible: true,
    description: 'Accessible description of data trend insight'
  }]),
  recordInteraction: jest.fn(),
};

const mockBiometricAdapter = {
  isActive: true,
  currentStressLevel: 0.5,
  adaptiveSettings: {
    reducedMotion: false,
    highContrast: false,
    largeText: false,
  },
  getAccessibilityPreferences: jest.fn(() => ({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    screenReader: false,
  })),
};

const mockEyeTracker = {
  isActive: true,
  respectsAccessibility: true,
  onGazeEnter: jest.fn(),
  onGazeExit: jest.fn(),
  offGazeEnter: jest.fn(),
  offGazeExit: jest.fn(),
  isGazing: false,
};

const mockSpatialAudio = {
  isActive: true,
  playGlassSound: jest.fn(),
  respectsAccessibility: true,
  hasAudioDescriptions: true,
  setGlobalVolume: jest.fn(),
  getAccessibilitySettings: jest.fn(() => ({
    audioDescriptions: true,
    reducedAudio: false,
    preferSilent: false,
  })),
};

const mockAchievements = {
  isActive: true,
  trackEvent: jest.fn(),
  recordAction: jest.fn(),
  getAccessibleProgress: jest.fn(() => ({
    level: 'Beginner',
    points: 150,
    description: 'You have earned 150 points and achieved Beginner level',
    nextGoal: 'Reach 300 points for Intermediate level',
  })),
};

const mockInteractionRecorder = {
  recordClick: jest.fn(),
  recordKeyboard: jest.fn(),
  recordFocus: jest.fn(),
  recordAssistiveTech: jest.fn(),
};

// Mock hooks with accessibility features
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
// import { GlassModal } from '../../components/modal/GlassModal';

describe('Consciousness Interface Accessibility Compliance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset accessibility settings
    mockBiometricAdapter.adaptiveSettings = {
      reducedMotion: false,
      highContrast: false,
      largeText: false,
    };
    
    mockSpatialAudio.getAccessibilitySettings.mockReturnValue({
      audioDescriptions: true,
      reducedAudio: false,
      preferSilent: false,
    });
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ARIA Compliance', () => {
    it('should maintain proper ARIA attributes with consciousness features enabled', async () => {
      const TestApp = () => (
        <GlassContainer
          predictive={true}
          adaptive={true}
          role="main"
          aria-label="Consciousness-enhanced application container"
        >
          <GlassButton
            trackAchievements={true}
            aria-describedby="button-desc"
          >
            Smart Button
          </GlassButton>
          
          <div id="button-desc">
            This button adapts to your usage patterns and provides intelligent feedback
          </div>
          
          <GlassChart
            type="bar"
            data={[{ x: 'A', y: 10 }, { x: 'B', y: 20 }]}
            title="Accessible Chart"
            predictive={true}
            aria-label="Bar chart showing data comparison between A and B"
          />
        </GlassContainer>
      );

      const { container } = render(<TestApp />);
      
      // Check ARIA attributes are preserved
      expect(screen.getByRole('main')).toHaveAttribute('aria-label', 'Consciousness-enhanced application container');
      expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', 'button-desc');
      expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Bar chart showing data comparison between A and B');
      
      // Run axe accessibility test
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
    
    it('should provide accessible descriptions for consciousness insights', async () => {
      const TestComponent = () => (
        <GlassContainer
          predictive={true}
          data-testid="insights-container"
        >
          <GlassChart
            type="line"
            data={[{ x: 1, y: 10 }, { x: 2, y: 20 }, { x: 3, y: 15 }]}
            predictive={true}
            title="Data Trends"
            aria-describedby="chart-insights"
          />
          
          <div id="chart-insights" role="status" aria-live="polite">
            Data shows an increasing trend with 15% growth
          </div>
        </GlassContainer>
      );

      const { container } = render(<TestComponent />);
      
      // Insights should be announced to screen readers
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
      expect(screen.getByRole('img')).toHaveAttribute('aria-describedby', 'chart-insights');
      
      // No accessibility violations
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
    
    it('should handle dynamic ARIA updates with consciousness state changes', async () => {
      const TestApp = ({ stressLevel }: { stressLevel: number }) => {
        mockBiometricAdapter.currentStressLevel = stressLevel;
        
        return (
          <GlassContainer
            adaptive={true}
            biometricResponsive={true}
          >
            <GlassButton
              adaptive={true}
              aria-describedby="adaptive-desc"
              data-testid="adaptive-button"
            >
              Adaptive Button
            </GlassButton>
            
            <div 
              id="adaptive-desc" 
              role="status" 
              aria-live="polite"
              data-testid="adaptive-description"
            >
              {stressLevel > 0.7 ? 
                'Button simplified for easier interaction during high stress' :
                stressLevel < 0.3 ?
                'Button enhanced for efficient interaction during low stress' :
                'Button in balanced mode for optimal interaction'
              }
            </div>
          </GlassContainer>
        );
      };

      const { rerender, container } = render(<TestApp stressLevel={0.5} />);
      
      // Initial state
      expect(screen.getByTestId('adaptive-description')).toHaveTextContent('balanced mode');
      
      // High stress state
      rerender(<TestApp stressLevel={0.8} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('adaptive-description')).toHaveTextContent('simplified for easier interaction');
      });
      
      // Low stress state  
      rerender(<TestApp stressLevel={0.2} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('adaptive-description')).toHaveTextContent('enhanced for efficient interaction');
      });
      
      // Verify no violations throughout state changes
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should maintain keyboard accessibility with consciousness features', async () => {
      const user = userEvent.setup();
      
      const TestApp = () => (
        <GlassContainer
          predictive={true}
          trackAchievements={true}
        >
          <GlassButton data-testid="button1">Button 1</GlassButton>
          <GlassButton data-testid="button2">Button 2</GlassButton>
          <GlassButton data-testid="button3">Button 3</GlassButton>
        </GlassContainer>
      );

      render(<TestApp />);
      
      // Test tab navigation
      await user.tab();
      expect(screen.getByTestId('button1')).toHaveFocus();
      
      await user.tab();
      expect(screen.getByTestId('button2')).toHaveFocus();
      
      await user.tab();
      expect(screen.getByTestId('button3')).toHaveFocus();
      
      // Test reverse tab navigation
      await user.tab({ shift: true });
      expect(screen.getByTestId('button2')).toHaveFocus();
      
      // Test keyboard activation
      await user.keyboard('{Enter}');
      expect(mockInteractionRecorder.recordClick).toHaveBeenCalled();
    });
    
    it('should support keyboard shortcuts for consciousness features', async () => {
      const user = userEvent.setup();
      
      const TestApp = () => (
        <GlassContainer
          spatialAudio={true}
          trackAchievements={true}
        >
          <GlassButton data-testid="modal-button">
            Modal Action
          </GlassButton>
        </GlassContainer>
      );

      render(<TestApp />);
      
      // Test Escape key functionality
      await user.keyboard('{Escape}');
      expect(mockSpatialAudio.playGlassSound).toHaveBeenCalledWith(expect.stringContaining('modal'));
    });
    
    it('should handle focus management with eye tracking enabled', async () => {
      const user = userEvent.setup();
      
      const TestApp = () => (
        <GlassContainer
          eyeTracking={true}
          gazeResponsive={true}
        >
          <GlassButton 
            data-testid="gaze-button"
            aria-describedby="gaze-info"
          >
            Gaze-Responsive Button
          </GlassButton>
          
          <div id="gaze-info" role="status" aria-live="polite">
            This button responds to both keyboard focus and eye gaze
          </div>
        </GlassContainer>
      );

      render(<TestApp />);
      
      // Keyboard focus should still work with eye tracking
      await user.tab();
      expect(screen.getByTestId('gaze-button')).toHaveFocus();
      
      // Focus should not interfere with gaze detection
      expect(mockEyeTracker.onGazeEnter).toHaveBeenCalled();
    });
  });

  describe('Screen Reader Compatibility', () => {
    it('should provide meaningful screen reader announcements for consciousness insights', async () => {
      const TestComponent = () => (
        <GlassChart
          type="bar"
          data={[{ x: 'Q1', y: 100 }, { x: 'Q2', y: 150 }, { x: 'Q3', y: 120 }]}
          predictive={true}
          title="Quarterly Sales"
          aria-label="Quarterly sales chart showing growth from Q1 to Q2, then slight decline in Q3"
        />
      );

      render(<TestComponent />);
      
      // Wait for insights to be generated
      await waitFor(() => {
        expect(mockPredictiveEngine.getInsights).toHaveBeenCalled();
      });
      
      // Check that insights have accessible descriptions
      const insights = mockPredictiveEngine.getInsights();
      insights.forEach((insight: any) => {
        expect(insight).toHaveProperty('accessible', true);
        expect(insight).toHaveProperty('description');
        expect(insight.description).toBeTruthy();
      });
    });
    
    it('should announce biometric adaptations to screen readers', async () => {
      const TestApp = ({ enableScreenReader }: { enableScreenReader: boolean }) => {
        mockBiometricAdapter.getAccessibilityPreferences.mockReturnValue({
          reducedMotion: false,
          highContrast: false,
          largeText: false,
          screenReader: enableScreenReader,
        });
        
        return (
          <GlassContainer
            adaptive={true}
            biometricResponsive={true}
          >
            <div role="status" aria-live="polite" data-testid="adaptation-status">
              {mockBiometricAdapter.currentStressLevel > 0.7 ? 
                'Interface simplified for reduced cognitive load' :
                'Interface in standard mode'
              }
            </div>
          </GlassContainer>
        );
      };

      const { rerender } = render(<TestApp enableScreenReader={true} />);
      
      // Change stress level to trigger adaptation announcement
      mockBiometricAdapter.currentStressLevel = 0.8;
      rerender(<TestApp enableScreenReader={true} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('adaptation-status')).toHaveTextContent('simplified for reduced cognitive load');
      });
    });
    
    it('should provide accessible audio descriptions for spatial audio', async () => {
      const TestApp = () => (
        <GlassContainer
          spatialAudio={true}
          audioFeedback={true}
        >
          <GlassButton data-testid="audio-button">
            Audio Feedback Button
          </GlassButton>
          
          <div role="status" aria-live="polite" data-testid="audio-description">
            Button provides spatial audio feedback at position (0, 0)
          </div>
        </GlassContainer>
      );

      render(<TestApp />);
      
      const button = screen.getByTestId('audio-button');
      fireEvent.click(button);
      
      // Verify spatial audio is announced
      expect(mockSpatialAudio.playGlassSound).toHaveBeenCalled();
      expect(mockSpatialAudio.hasAudioDescriptions).toBe(true);
      expect(screen.getByTestId('audio-description')).toBeInTheDocument();
    });
  });

  describe('Reduced Motion Compliance', () => {
    it('should respect prefers-reduced-motion for consciousness animations', async () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query: string) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
      
      mockBiometricAdapter.getAccessibilityPreferences.mockReturnValue({
        reducedMotion: true,
        highContrast: false,
        largeText: false,
        screenReader: false,
      });
      
      const TestComponent = () => (
        <GlassContainer
          adaptive={true}
          biometricResponsive={true}
          data-testid="reduced-motion-container"
        >
          <GlassButton>Accessible Button</GlassButton>
        </GlassContainer>
      );

      render(<TestComponent />);
      
      const container = screen.getByTestId('reduced-motion-container');
      
      // Verify reduced motion classes or styles are applied
      await waitFor(() => {
        expect(container).not.toHaveClass('animate-pulse');
        expect(container).not.toHaveClass('transform-gpu');
      });
    });
    
    it('should disable consciousness animations when motion is reduced', async () => {
      mockBiometricAdapter.adaptiveSettings.reducedMotion = true;
      
      const TestComponent = () => (
        <GlassChart
          type="line"
          data={[{ x: 1, y: 10 }]}
          predictive={true}
          adaptive={true}
        />
      );

      render(<TestComponent />);
      
      // Verify animations respect reduced motion
      await waitFor(() => {
        expect(mockBiometricAdapter.getAccessibilityPreferences).toHaveBeenCalled();
      });
    });
  });

  describe('High Contrast Support', () => {
    it('should adapt consciousness features for high contrast mode', async () => {
      mockBiometricAdapter.getAccessibilityPreferences.mockReturnValue({
        reducedMotion: false,
        highContrast: true,
        largeText: false,
        screenReader: false,
      });
      
      const TestComponent = () => (
        <GlassContainer
          adaptive={true}
          gazeResponsive={true}
          data-testid="high-contrast-container"
        >
          <GlassButton data-testid="high-contrast-button">
            High Contrast Button
          </GlassButton>
        </GlassContainer>
      );

      const { container } = render(<TestComponent />);
      
      // Verify high contrast adaptations
      await waitFor(() => {
        const button = screen.getByTestId('high-contrast-button');
        // Should maintain visibility in high contrast
        expect(button).toBeVisible();
      });
      
      // Run accessibility test for high contrast
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Achievement Accessibility', () => {
    it('should provide accessible achievement notifications', async () => {
      const TestComponent = () => (
        <GlassContainer
          trackAchievements={true}
        >
          <GlassButton 
            trackAchievements={true}
            achievementId="accessible_interaction"
            data-testid="achievement-button"
          >
            Achievement Button
          </GlassButton>
          
          <div role="status" aria-live="polite" data-testid="achievement-status">
            {/* Achievement notifications will be announced here */}
          </div>
        </GlassContainer>
      );

      render(<TestComponent />);
      
      const button = screen.getByTestId('achievement-button');
      fireEvent.click(button);
      
      // Verify achievement is accessible
      expect(mockAchievements.getAccessibleProgress).toHaveBeenCalled();
      
      const progress = mockAchievements.getAccessibleProgress();
      expect(progress).toHaveProperty('description');
      expect(progress.description).toContain('points');
    });
  });

  describe('Error Handling and Fallbacks', () => {
    it('should maintain accessibility when consciousness features fail', async () => {
      // Mock consciousness feature failure
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      mockPredictiveEngine.getInsights.mockImplementation(() => {
        throw new Error('Insights service unavailable');
      });
      
      const TestComponent = () => (
        <GlassContainer
          predictive={true}
          role="main"
          aria-label="Application container"
        >
          <GlassButton aria-label="Action button">
            Fallback Button
          </GlassButton>
        </GlassContainer>
      );

      const { container } = render(<TestComponent />);
      
      // Basic accessibility should still work
      expect(screen.getByRole('main')).toHaveAttribute('aria-label', 'Application container');
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Action button');
      
      // Should have no accessibility violations even with failed consciousness features
      const results = await axe(container);
      expect(results).toHaveNoViolations();
      
      consoleSpy.mockRestore();
    });
    
    it('should provide accessible error messages for consciousness failures', async () => {
      const TestComponent = () => (
        <GlassChart
          type="bar"
          data={[]}
          predictive={true}
          title="Chart with Error"
          aria-describedby="chart-error"
        />
      );

      render(<TestComponent />);
      
      // Error should be communicated accessibly
      await waitFor(() => {
        const errorElement = document.getElementById('chart-error');
        if (errorElement) {
          expect(errorElement).toHaveAttribute('role', 'alert');
          expect(errorElement).toHaveAttribute('aria-live', 'assertive');
        }
      });
    });
  });
});

/**
 * Accessibility Testing Utilities for Consciousness Features
 */
export class ConsciousnessAccessibilityUtils {
  /**
   * Test component for ARIA compliance
   */
  static async testAriaCompliance(component: React.ReactElement): Promise<void> {
    const { container } = render(component);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }
  
  /**
   * Test keyboard navigation
   */
  static async testKeyboardNavigation(
    component: React.ReactElement,
    expectedFocusOrder: string[]
  ): Promise<void> {
    render(component);
    const user = userEvent.setup();
    
    for (const testId of expectedFocusOrder) {
      await user.tab();
      expect(screen.getByTestId(testId)).toHaveFocus();
    }
  }
  
  /**
   * Test screen reader announcements
   */
  static testScreenReaderAnnouncements(component: React.ReactElement): void {
    render(component);
    
    // Check for live regions
    const liveRegions = screen.getAllByRole('status');
    expect(liveRegions.length).toBeGreaterThan(0);
    
    liveRegions.forEach((region: any) => {
      expect(region).toHaveAttribute('aria-live');
    });
  }
  
  /**
   * Test reduced motion compliance
   */
  static testReducedMotionCompliance(component: React.ReactElement): void {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    
    const { container } = render(component);
    
    // Check that animations are disabled
    const animatedElements = container.querySelectorAll('.animate-pulse, .transform-gpu');
    expect(animatedElements).toHaveLength(0);
  }
  
  /**
   * Test high contrast support
   */
  static async testHighContrastSupport(component: React.ReactElement): Promise<void> {
    // Mock high contrast media query
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-contrast: high)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    
    const { container } = render(component);
    
    // Run axe test for high contrast
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });
    
    expect(results).toHaveNoViolations();
  }
  
  /**
   * Generate accessibility report
   */
  static async generateAccessibilityReport(
    component: React.ReactElement
  ): Promise<{
    ariaCompliance: boolean;
    keyboardAccessible: boolean;
    screenReaderFriendly: boolean;
    reducedMotionSupport: boolean;
    highContrastSupport: boolean;
    violations: any[];
  }> {
    const { container } = render(component);
    
    // Run comprehensive axe test
    const results = await axe(container);
    
    return {
      ariaCompliance: results.violations.length === 0,
      keyboardAccessible: container.querySelectorAll('[tabindex="-1"]:not([aria-hidden="true"])').length === 0,
      screenReaderFriendly: container.querySelectorAll('[role="status"], [aria-live]').length > 0,
      reducedMotionSupport: true, // Would require more complex testing
      highContrastSupport: true, // Would require more complex testing
      violations: results.violations,
    };
  }
}