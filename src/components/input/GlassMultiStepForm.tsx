'use client';
import { cn } from "../../lib/utilsComprehensive";
import {
  AlertCircle,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import React, { createContext, useCallback, useContext, useState } from "react";
import { Motion } from "../../primitives";
import { GlassButton } from "../button";
import { CardContent, CardHeader, CardTitle, GlassCard } from "../card";
import { GlassBadge } from "../data-display";

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  component: React.ComponentType<any>;
  validation?: (data: any) => boolean | Promise<boolean>;
  validationMessage?: string;
  optional?: boolean;
  data?: any;
}

export interface GlassMultiStepFormProps {
  /**
   * Form steps configuration
   */
  steps?: FormStep[];
  /**
   * Initial form data
   */
  initialData?: Record<string, any>;
  /**
   * Form submission handler
   */
  onSubmit?: (data: Record<string, any>) => void | Promise<void>;
  /**
   * Form cancellation handler
   */
  onCancel?: () => void;
  /**
   * Step change handler
   */
  onStepChange?: (stepIndex: number, data: Record<string, any>) => void;
  /**
   * Form title
   */
  title?: string;
  /**
   * Form description
   */
  description?: string;
  /**
   * Show step progress indicator
   */
  showProgress?: boolean;
  /**
   * Show step navigation buttons
   */
  showNavigation?: boolean;
  /**
   * Allow skipping optional steps
   */
  allowSkip?: boolean;
  /**
   * Custom submit button text
   */
  submitButtonText?: string;
  /**
   * Custom cancel button text
   */
  cancelButtonText?: string;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Form validation mode
   */
  validationMode?: "onChange" | "onSubmit" | "onBlur";
  /**
   * Show step summary
   */
  showSummary?: boolean;
  /**
   * Custom className
   */
  className?: string;
}

// Form Context
interface FormContextType {
  currentStep: number;
  totalSteps: number;
  formData: Record<string, any>;
  updateFormData: (stepId: string, data: any) => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  isStepValid: (stepIndex: number) => Promise<boolean>;
  isStepCompleted: (stepIndex: number) => boolean;
  validationMode: "onChange" | "onSubmit" | "onBlur";
}

const FormContext = createContext<FormContextType | null>(null);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    console.warn(
      "useFormContext must be used within a GlassMultiStepForm. Using default values."
    );
    return {
      currentStep: 0,
      totalSteps: 1,
      formData: {},
      errors: {},
      isValid: false,
      nextStep: () => {},
      prevStep: () => {},
      goToStep: () => {},
      updateData: () => {},
      validateStep: () => false,
      validationMode: "onSubmit" as const,
    };
  }
  return context;
};

/**
 * GlassMultiStepForm component
 * A comprehensive multi-step form with validation, progress tracking, and smooth transitions
 */
export const GlassMultiStepForm: React.FC<GlassMultiStepFormProps> = ({
  steps = [],
  initialData = {},
  onSubmit,
  onCancel,
  onStepChange,
  title,
  description,
  showProgress = true,
  showNavigation = true,
  allowSkip = false,
  submitButtonText = "Submit",
  cancelButtonText = "Cancel",
  loading = false,
  validationMode = "onChange",
  showSummary = false,
  className,
  ...props
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [stepValidations, setStepValidations] = useState<
    Record<number, boolean>
  >({});
  const [stepCompletions, setStepCompletions] = useState<
    Record<number, boolean>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<number, string>
  >({});

  // Update form data for a specific step
  const updateFormData = useCallback((stepId: string, data: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [stepId]: data,
    }));
  }, []);

  // Check if step is valid
  const isStepValid = useCallback(
    async (stepIndex: number): Promise<boolean> => {
      const step = steps[stepIndex];
      if (!step.validation) return true;

      try {
        const isValid = await step.validation(formData[step.id] || {});
        setStepValidations((prev: any) => ({
          ...prev,
          [stepIndex]: isValid,
        }));

        if (!isValid && step.validationMessage) {
          setValidationErrors((prev: any) => ({
            ...prev,
            [stepIndex]: step.validationMessage!,
          }));
        } else {
          setValidationErrors((prev: any) => {
            const newErrors = { ...prev };
            delete newErrors[stepIndex];
            return newErrors;
          });
        }

        return isValid;
      } catch (error) {
        console.error("Step validation error:", error);
        return false;
      }
    },
    [steps, formData]
  );

  // Check if step is completed
  const isStepCompleted = useCallback(
    (stepIndex: number): boolean => {
      return stepCompletions[stepIndex] || false;
    },
    [stepCompletions]
  );

  // Navigate to specific step
  const goToStep = useCallback(
    async (stepIndex: number) => {
      if (stepIndex < 0 || stepIndex >= steps.length) return;

      // Validate current step before moving
      if (validationMode === "onChange") {
        const isValid = await isStepValid(currentStep);
        if (!isValid && !allowSkip) return;
      }

      setCurrentStep(stepIndex);
      onStepChange?.(stepIndex, formData);
    },
    [
      steps.length,
      validationMode,
      isStepValid,
      currentStep,
      allowSkip,
      onStepChange,
      formData,
    ]
  );

  // Go to next step
  const nextStep = useCallback(async () => {
    const isValid = await isStepValid(currentStep);
    if (!isValid && !allowSkip) return;

    if (currentStep < steps.length - 1) {
      setStepCompletions((prev: any) => ({
        ...prev,
        [currentStep]: true,
      }));
      setCurrentStep((prev: any) => prev + 1);
      onStepChange?.(currentStep + 1, formData);
    }
  }, [
    currentStep,
    steps.length,
    isStepValid,
    allowSkip,
    onStepChange,
    formData,
  ]);

  // Go to previous step
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev: any) => prev + -1);
      onStepChange?.(currentStep - 1, formData);
    }
  }, [currentStep, onStepChange, formData]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    // Validate all steps
    let allValid = true;
    for (let i = 0; i < steps.length; i++) {
      const isValid = await isStepValid(i);
      if (!isValid && !steps[i].optional) {
        allValid = false;
        goToStep(i);
        break;
      }
    }

    if (!allValid) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [steps, isStepValid, goToStep, onSubmit, formData]);

  // Handle form cancellation
  const handleCancel = useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  // Get step progress percentage
  const getProgressPercentage = useCallback(() => {
    if (!steps || steps.length === 0) return 0;
    return Math.min(100, Math.max(0, ((currentStep + 1) / steps.length) * 100));
  }, [currentStep, steps.length]);

  // Context value
  const contextValue: FormContextType = {
    currentStep,
    totalSteps: steps.length,
    formData,
    updateFormData,
    goToStep,
    nextStep,
    prevStep,
    isStepValid,
    isStepCompleted,
    validationMode,
  };

  return (
    <FormContext.Provider data-glass-component value={contextValue}>
      <Motion preset="fadeIn" className='glass-w-full glass-max-w-4xl glass-mx-auto'>
        <GlassCard className={cn("overflow-hidden", className)} {...props}>
          {/* Header */}
          <CardHeader className='glass-pb-6'>
            {title && (
              <CardTitle className='glass-text-primary glass-text-2xl glass-font-semibold glass-text-center'>
                {title}
              </CardTitle>
            )}

            {description && (
              <p className='glass-text-primary-opacity-70 glass-text-center glass-mt-2'>
                {description}
              </p>
            )}

            {/* Progress Indicator */}
            {showProgress && (
              <div className='glass-mt-6' role="group" aria-label="Form progress">
                <div className='glass-flex glass-justify-between glass-items-center glass-mb-2'>
                  <span
                    className='glass-text-sm glass-text-primary-glass-opacity-60'
                    aria-live="polite"
                  >
                    Step {currentStep + 1} of {steps.length}
                  </span>
                  <span
                    className='glass-text-sm glass-text-primary-glass-opacity-60'
                    aria-live="polite"
                  >
                    {Math.round(getProgressPercentage())}% Complete
                  </span>
                </div>

                {/* Progress Bar */}
                <div
                  role="progressbar"
                  aria-valuenow={Math.round(getProgressPercentage())}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Form progress: ${Math.round(getProgressPercentage())}% complete`}
                  className='glass-w-full glass-surface-subtle/10 glass-radius-full glass-h-2 glass-overflow-hidden'
                >
                  <Motion
                    preset="slideRight"
                    className="glass-h-full glass-gradient-primary glass-gradient-primary glass-gradient-primary glass-radius-full"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>

                {/* Step Indicators */}
                <nav
                  aria-label="Form steps"
                  className="glass-flex glass-justify-between glass-mt-4"
                >
                  {steps.map((step, index) => {
                    const isCompleted = isStepCompleted(index);
                    const isCurrent = index === currentStep;
                    const isValid = stepValidations[index] !== false;
                    const hasError = validationErrors[index];

                    return (
                      <div
                        key={step.id}
                        role="button"
                        aria-label={`${step.title}${isCurrent ? " (current step)" : ""}${isCompleted ? " (completed)" : ""}${hasError ? " (has errors)" : ""}`}
                        aria-current={isCurrent ? "step" : undefined}
                        tabIndex={0}
                        className={cn(
                          "flex flex-col items-center cursor-pointer transition-all duration-200",
                          "glass-hover-scale-105",
                          isCurrent && "scale-105",
                          "glass-focus glass-touch-target glass-contrast-guard"
                        )}
                        onClick={(e) => goToStep(index)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            goToStep(index);
                          }
                        }}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 glass-radius-full flex items-center justify-center border-2 transition-all duration-200",
                            isCompleted &&
                              isValid &&
                              "bg-green-500 border-green-500 glass-text-primary",
                            isCurrent &&
                              "bg-primary border-primary glass-text-primary",
                            !isCompleted &&
                              !isCurrent &&
                              "bg-white/10 border-white/30 glass-text-primary/60",
                            hasError && "border-red-500 bg-red-500/20"
                          )}
                        >
                          {isCompleted && isValid ? (
                            <Check className='glass-w-5 glass-h-5' aria-hidden="true" />
                          ) : step.icon ? (
                            <span className='glass-w-5 glass-h-5' aria-hidden="true">
                              {step.icon}
                            </span>
                          ) : (
                            <span
                              className='glass-text-sm glass-font-medium'
                              aria-hidden="true"
                            >
                              {index + 1}
                            </span>
                          )}
                        </div>

                        <div className='glass-text-center glass-mt-2'>
                          <p
                            className={cn(
                              "glass-text-xs font-medium transition-colors duration-200",
                              isCurrent
                                ? "glass-text-primary"
                                : "glass-text-primary/60"
                            )}
                          >
                            {step.title}
                          </p>
                          {step.description && (
                            <p className='glass-text-xs glass-text-primary-glass-opacity-50 glass-mt-1 glass-max-w-20 glass-truncate'>
                              {step.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </nav>
              </div>
            )}
          </CardHeader>

          {/* Form Content */}
          <CardContent className='glass-pt-0'>
            <div className='glass-min-h-400px'>
              {steps.map((step, index) => {
                const StepComponent = step.component;
                const isActive = index === currentStep;

                return (
                  <Motion
                    key={step.id}
                    preset={isActive ? "fadeIn" : "none"}
                    className={cn(
                      "transition-opacity duration-300",
                      isActive
                        ? "opacity-100"
                        : "opacity-0 absolute inset-0 pointer-events-none"
                    )}
                  >
                    {isActive && (
                      <div>
                        {/* Step Header */}
                        <div className='glass-mb-6'>
                          <h3 className='glass-text-xl glass-font-semibold glass-text-primary glass-mb-2'>
                            {step.title}
                          </h3>
                          {step.description && (
                            <p className='glass-text-primary-opacity-70'>
                              {step.description}
                            </p>
                          )}
                        </div>

                        {/* Step Content */}
                        <StepComponent
                          data={formData[step.id] || {}}
                          onChange={(data: any) =>
                            updateFormData(step.id, data)
                          }
                          validationMode={validationMode}
                        />

                        {/* Validation Error */}
                        {validationErrors[index] && (
                          <div
                            role="alert"
                            aria-live="assertive"
                            className="glass-mt-4 glass-p-3 glass-surface-red/20 glass-border glass-border-red/30 glass-radius-lg"
                          >
                            <div className="glass-flex glass-items-center glass-gap-2">
                              <AlertCircle
                                className='glass-w-4 glass-h-4 glass-text-primary'
                                aria-hidden="true"
                              />
                              <span className="glass-text-secondary glass-text-sm">
                                {validationErrors[index]}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Motion>
                );
              })}
            </div>

            {/* Navigation */}
            {showNavigation && (
              <div className='glass-flex glass-justify-between glass-items-center glass-mt-8 glass-pt-6 glass-border-t glass-border-white/10'>
                <div className="glass-flex glass-gap-3">
                  {currentStep > 0 && (
                    <GlassButton
                      variant="outline"
                      onClick={prevStep}
                      disabled={loading}
                      className="glass-flex glass-items-center glass-gap-2"
                    >
                      <ChevronLeft className='glass-w-4 glass-h-4' />
                      Previous
                    </GlassButton>
                  )}

                  {onCancel && (
                    <GlassButton
                      variant="ghost"
                      onClick={handleCancel}
                      disabled={loading || isSubmitting}
                    >
                      {cancelButtonText}
                    </GlassButton>
                  )}
                </div>

                <div className="glass-flex glass-gap-3">
                  {allowSkip && steps[currentStep].optional && (
                    <GlassButton
                      variant="outline"
                      onClick={nextStep}
                      disabled={loading || isSubmitting}
                    >
                      Skip Step
                    </GlassButton>
                  )}

                  {currentStep < steps.length - 1 ? (
                    <GlassButton
                      variant="primary"
                      onClick={nextStep}
                      disabled={loading || isSubmitting}
                      className="glass-flex glass-items-center glass-gap-2"
                    >
                      Next
                      <ChevronRight className='glass-w-4 glass-h-4' />
                    </GlassButton>
                  ) : (
                    <GlassButton
                      variant="primary"
                      onClick={handleSubmit}
                      disabled={loading || isSubmitting}
                      className="glass-flex glass-items-center glass-gap-2 glass-min-glass-w-24"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className='glass-w-4 glass-h-4 glass-animate-spin' />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className='glass-w-4 glass-h-4' />
                          {submitButtonText}
                        </>
                      )}
                    </GlassButton>
                  )}
                </div>
              </div>
            )}

            {/* Summary */}
            {showSummary && (
              <div className='glass-mt-6 glass-p-4 glass-surface-subtle/5 glass-radius-lg'>
                <h4 className='glass-text-sm glass-font-medium glass-text-primary glass-mb-3'>
                  Form Summary
                </h4>
                <div className="glass-gap-2">
                  {steps.map((step, index) => {
                    const isCompleted = isStepCompleted(index);
                    const hasData = formData[step.id];

                    return (
                      <div
                        key={step.id}
                        className="glass-flex glass-items-center glass-justify-between"
                      >
                        <div className="glass-flex glass-items-center glass-gap-2">
                          {isCompleted ? (
                            <CheckCircle className='glass-w-4 glass-h-4 glass-text-primary' />
                          ) : (
                            <div className='glass-w-4 glass-h-4 glass-radius-full glass-border-2 glass-border-white/30' />
                          )}
                          <span
                            className={cn(
                              "glass-text-sm",
                              isCompleted
                                ? "glass-text-primary"
                                : "glass-text-primary/60"
                            )}
                          >
                            {step.title}
                          </span>
                        </div>

                        {hasData && (
                          <GlassBadge variant="secondary" size="sm">
                            Data Saved
                          </GlassBadge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </GlassCard>
      </Motion>
    </FormContext.Provider>
  );
};

// Form Step Wrapper Component
export interface GlassFormStepProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const GlassFormStep: React.FC<GlassFormStepProps> = ({
  children,
  title,
  description,
  className,
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      {(title || description) && (
        <div className='glass-mb-6'>
          {title && (
            <h3 className='glass-text-lg glass-font-semibold glass-text-primary glass-mb-2'>
              {title}
            </h3>
          )}
          {description && <p className='glass-text-primary-opacity-70'>{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default GlassMultiStepForm;