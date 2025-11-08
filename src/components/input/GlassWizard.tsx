'use client';
import { cn } from "../../lib/utilsComprehensive";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Motion } from "../../primitives";
import { GlassButton } from "../button";
import { CardContent, CardHeader, CardTitle, GlassCard } from "../card";
import { GlassProgress } from "../data-display";

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  validation?: () => boolean | Promise<boolean>;
  optional?: boolean;
  disabled?: boolean;
}

export interface GlassWizardProps {
  /**
   * Wizard steps
   */
  steps: WizardStep[];
  /**
   * Current step index
   */
  currentStep?: number;
  /**
   * Callback when step changes
   */
  onStepChange?: (stepIndex: number) => void;
  /**
   * Callback when wizard completes
   */
  onComplete?: (data?: any) => void;
  /**
   * Callback when wizard is cancelled
   */
  onCancel?: () => void;
  /**
   * Wizard title
   */
  title?: string;
  /**
   * Wizard description
   */
  description?: string;
  /**
   * Show step navigation
   */
  showStepNavigation?: boolean;
  /**
   * Show step progress
   */
  showProgress?: boolean;
  /**
   * Allow step skipping
   */
  allowSkip?: boolean;
  /**
   * Custom next button text
   */
  nextButtonText?: string;
  /**
   * Custom previous button text
   */
  previousButtonText?: string;
  /**
   * Custom complete button text
   */
  completeButtonText?: string;
  /**
   * Custom cancel button text
   */
  cancelButtonText?: string;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Step validation mode
   */
  validationMode?: "onChange" | "onNext";
}

// Wizard Context
interface WizardContextValue {
  currentStep: number;
  steps: WizardStep[];
  goToStep: (stepIndex: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  isStepValid: (stepIndex: number) => boolean;
  isStepCompleted: (stepIndex: number) => boolean;
  completeWizard: () => void;
  cancelWizard: () => void;
  data: Record<string, any>;
  setData: (data: Record<string, any>) => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    console.warn(
      "useWizard must be used within a GlassWizard component. Using default values."
    );
    return {
      currentStep: 0,
      totalSteps: 1,
      nextStep: () => {},
      previousStep: () => {},
      goToStep: () => {},
      isFirstStep: true,
      isLastStep: true,
      data: {},
      setData: () => {},
    };
  }
  return context;
};

/**
 * GlassWizard component
 * A multi-step form wizard with glassmorphism styling and comprehensive features
 */
export const GlassWizard: React.FC<GlassWizardProps> = ({
  steps,
  currentStep: controlledCurrentStep,
  onStepChange,
  onComplete,
  onCancel,
  title,
  description,
  showStepNavigation = true,
  showProgress = true,
  allowSkip = false,
  nextButtonText = "Next",
  previousButtonText = "Previous",
  completeButtonText = "Complete",
  cancelButtonText = "Cancel",
  loading = false,
  validationMode = "onNext",
  className,
  ...props
}) => {
  const [internalCurrentStep, setInternalCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [wizardData, setWizardData] = useState<Record<string, any>>({});
  const [validatingStep, setValidatingStep] = useState<number | null>(null);
  const [stepErrors, setStepErrors] = useState<Record<number, string>>({});

  const currentStep = controlledCurrentStep ?? internalCurrentStep;
  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  // Update internal step when controlled step changes
  useEffect(() => {
    if (controlledCurrentStep !== undefined) {
      setInternalCurrentStep(controlledCurrentStep);
    }
  }, [controlledCurrentStep]);

  // Validate step
  const validateStep = async (stepIndex: number): Promise<boolean> => {
    const step = steps[stepIndex];
    if (!step?.validation) return true;

    try {
      setValidatingStep(stepIndex);
      const isValid = await step.validation();
      setValidatingStep(null);

      if (!isValid) {
        setStepErrors((prev: any) => ({
          ...prev,
          [stepIndex]: "Please complete all required fields",
        }));
      } else {
        setStepErrors((prev: any) => {
          const newErrors = { ...prev };
          delete newErrors[stepIndex];
          return newErrors;
        });
      }

      return isValid;
    } catch (error) {
      setValidatingStep(null);
      setStepErrors((prev: any) => ({
        ...prev,
        [stepIndex]: "Validation failed",
      }));
      return false;
    }
  };

  // Check if step is valid
  const isStepValid = (stepIndex: number): boolean => {
    return !stepErrors[stepIndex];
  };

  // Check if step is completed
  const isStepCompleted = (stepIndex: number): boolean => {
    return completedSteps.has(stepIndex);
  };

  // Navigate to step
  const goToStep = async (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= steps.length) return;

    // Validate current step if validation mode is onChange
    if (validationMode === "onChange" && !isStepValid(currentStep)) {
      return;
    }

    // Validate current step before moving to next
    if (stepIndex > currentStep) {
      const isValid = await validateStep(currentStep);
      if (!isValid) return;

      // Mark current step as completed
      setCompletedSteps((prev: any) => new Set([...prev, currentStep]));
    }

    const newStep =
      controlledCurrentStep !== undefined ? controlledCurrentStep : stepIndex;
    if (controlledCurrentStep === undefined) {
      setInternalCurrentStep(stepIndex);
    }
    onStepChange?.(stepIndex);
  };

  // Go to next step
  const goToNext = async () => {
    if (isLastStep) {
      await completeWizard();
    } else {
      await goToStep(currentStep + 1);
    }
  };

  // Go to previous step
  const goToPrevious = () => {
    if (!isFirstStep) {
      goToStep(currentStep - 1);
    }
  };

  // Complete wizard
  const completeWizard = async () => {
    // Validate final step
    const isValid = await validateStep(currentStep);
    if (!isValid) return;

    // Mark final step as completed
    setCompletedSteps((prev: any) => new Set([...prev, currentStep]));

    onComplete?.(wizardData);
  };

  // Cancel wizard
  const cancelWizard = () => {
    onCancel?.();
  };

  // Set wizard data
  const setData = (data: Record<string, any>) => {
    setWizardData((prev: any) => ({ ...prev, ...data }));
  };

  const contextValue: WizardContextValue = {
    currentStep,
    steps,
    goToStep,
    goToNext,
    goToPrevious,
    isStepValid,
    isStepCompleted,
    completeWizard,
    cancelWizard,
    data: wizardData,
    setData,
  };

  return (
    <WizardContext.Provider data-glass-component value={contextValue}>
      <Motion preset="fadeIn" className="glass-w-full max-w-4xl glass-mx-auto">
        <GlassCard className={cn("overflow-hidden", className)} {...props}>
          {/* Header */}
          <CardHeader className="glass-border-b glass-border-white/10">
            <div className="glass-flex glass-items-center glass-justify-between">
              <div>
                {title && (
                  <CardTitle className="glass-text-xl font-semibold text-primary mb-1">
                    {title}
                  </CardTitle>
                )}
                {description && (
                  <p className="glass-text-sm text-primary/70">{description}</p>
                )}
              </div>

              {showProgress && (
                <div className="glass-flex glass-items-center glass-gap-3">
                  <span className="glass-text-sm text-primary/60">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                  <div className="w-24">
                    <GlassProgress value={progress} size="sm" />
                  </div>
                </div>
              )}
            </div>

            {/* Step Navigation */}
            {showStepNavigation && (
              <nav
                aria-label="Wizard steps"
                className="glass-flex glass-items-center glass-gap-2 mt-6 overflow-x-auto pb-2"
              >
                {steps.map((step, index) => {
                  const isActive = index === currentStep;
                  const isCompleted = completedSteps.has(index);
                  const isValid = isStepValid(index);
                  const isDisabled = step.disabled;

                  return (
                    <button
                      key={step.id}
                      onClick={(e) => !isDisabled && goToStep(index)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          if (!isDisabled) goToStep(index);
                        }
                      }}
                      disabled={isDisabled}
                      aria-label={`${step.title}${isActive ? " (current step)" : ""}${isCompleted ? " (completed)" : ""}`}
                      aria-current={isActive ? "step" : undefined}
                      aria-disabled={isDisabled}
                      className={cn(
                        "flex items-center glass-gap-2 glass-px-3 glass-py-2 glass-radius-lg glass-text-sm font-medium transition-all duration-200 whitespace-nowrap",
                        "border border-white/20",
                        "glass-focus glass-touch-target glass-contrast-guard",
                        {
                          "bg-primary/20 text-primary-foreground border-primary/40":
                            isActive,
                          "bg-green-500/20 text-green-400 border-green-500/40":
                            isCompleted && !isActive,
                          "bg-white/5 glass-text-primary/60":
                            !isActive && !isCompleted,
                          "opacity-50 cursor-not-allowed": isDisabled,
                          "hover:bg-white/10": !isDisabled && !isActive,
                        }
                      )}
                    >
                      <div className="glass-flex glass-items-center glass-justify-center w-6 h-6 glass-radius-full glass-text-xs">
                        {isCompleted ? (
                          <Check className="w-3 h-3" />
                        ) : isActive && validatingStep === index ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <span className="hidden sm:inline">{step.title}</span>
                    </button>
                  );
                })}
              </nav>
            )}
          </CardHeader>

          {/* Step Content */}
          <CardContent className="glass-p-6">
            <Motion
              key={currentStep}
              preset="slideIn"
              className="min-h-[300px]"
            >
              {/* Step Header */}
              <div className="glass-flex glass-items-start glass-gap-4 mb-6">
                {currentStepData.icon && (
                  <div className="glass-flex glass-items-center glass-justify-center w-12 h-12 glass-radius-lg glass-surface-subtle/10">
                    {currentStepData.icon}
                  </div>
                )}

                <div className="glass-flex-1">
                  <h2 className="glass-text-lg font-semibold text-primary mb-1">
                    {currentStepData.title}
                  </h2>
                  {currentStepData.description && (
                    <p className="glass-text-sm text-primary/70">
                      {currentStepData.description}
                    </p>
                  )}
                </div>

                {/* Error indicator */}
                {stepErrors[currentStep] && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="glass-flex glass-items-center glass-gap-2 text-primary"
                  >
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    <span className="glass-text-sm">
                      {stepErrors[currentStep]}
                    </span>
                  </div>
                )}
              </div>

              {/* Step Content */}
              <div className="glass-flex-1">{currentStepData.content}</div>
            </Motion>
          </CardContent>

          {/* Footer Actions */}
          <div className="glass-border-t glass-border-white/10 glass-p-6">
            <div className="glass-flex glass-items-center glass-justify-between">
              <div className="glass-flex glass-gap-3">
                {!isFirstStep && (
                  <GlassButton
                    variant="outline"
                    onClick={goToPrevious}
                    disabled={loading}
                    className="glass-flex glass-items-center glass-gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {previousButtonText}
                  </GlassButton>
                )}

                {allowSkip && !isLastStep && (
                  <GlassButton
                    variant="ghost"
                    onClick={(e) => goToStep(currentStep + 1)}
                    disabled={loading}
                  >
                    Skip
                  </GlassButton>
                )}
              </div>

              <div className="glass-flex glass-gap-3">
                <GlassButton
                  variant="ghost"
                  onClick={cancelWizard}
                  disabled={loading}
                >
                  {cancelButtonText}
                </GlassButton>

                <GlassButton
                  variant="primary"
                  onClick={goToNext}
                  disabled={loading || validatingStep === currentStep}
                  className="glass-flex glass-items-center glass-gap-2"
                >
                  {validatingStep === currentStep ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isLastStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  {isLastStep ? completeButtonText : nextButtonText}
                </GlassButton>
              </div>
            </div>
          </div>
        </GlassCard>
      </Motion>
    </WizardContext.Provider>
  );
};

// Wizard Step Component
export interface GlassWizardStepProps {
  step: WizardStep;
  children: React.ReactNode;
  className?: string;
}

export const GlassWizardStep: React.FC<GlassWizardStepProps> = ({
  step,
  children,
  className,
}) => {
  return <div className={cn("glass-gap-4", className)}>{children}</div>;
};

// Wizard Stepper Component (Progress Indicator)
export interface GlassWizardStepperProps {
  steps: WizardStep[];
  currentStep: number;
  completedSteps?: Set<number>;
  className?: string;
}

export const GlassWizardStepper: React.FC<GlassWizardStepperProps> = ({
  steps,
  currentStep,
  completedSteps = new Set(),
  className,
}) => {
  return (
    <div
      className={cn("flex items-center justify-center glass-gap-4", className)}
    >
      {steps.map((step, index) => {
        const isCompleted = completedSteps.has(index);
        const isActive = index === currentStep;
        const isPast = index < currentStep;

        return (
          <div
            key={step.id}
            className="glass-flex glass-items-center glass-gap-4"
          >
            <div className="glass-flex glass-flex-col glass-items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 glass-radius-full border-2 transition-all duration-200",
                  {
                    "bg-primary border-primary text-primary-foreground":
                      isActive,
                    "bg-green-500 border-green-500 glass-text-primary":
                      isCompleted,
                    "border-white/30 glass-text-primary/60":
                      !isActive && !isCompleted,
                    "bg-white/10 border-white/50": isPast && !isCompleted,
                  }
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="glass-text-sm font-medium">{index + 1}</span>
                )}
              </div>

              <span
                className={cn(
                  "glass-text-xs glass-mt-2 text-center max-w-20 truncate",
                  isActive
                    ? "glass-text-primary font-medium"
                    : "glass-text-primary/60"
                )}
              >
                {step.title}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-12 h-0.5 transition-all duration-200",
                  isCompleted || isPast ? "bg-green-500" : "bg-white/20"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GlassWizard;