'use client';
import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { GlassButton } from "@/components/button";
import { cn } from "../../../lib/utilsComprehensive";
import { GlassCard } from "@/components/card";
import { GlassFormBuilder } from "@/components/interactive/GlassFormBuilder";
import { HStack, VStack } from "@/components/layout";
import { Glass } from "@/primitives";
import { Motion } from "@/primitives";
import { GlassFormWizardSteps } from "./GlassFormWizardSteps";

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  schema: any[];
  validation?: (values: any) => Promise<Record<string, string>>;
  optional?: boolean;
  canSkip?: boolean;
  component?: React.ReactNode;
}

export interface GlassWizardTemplateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "autoSave"> {
  /**
   * Wizard title
   */
  title: string;
  /**
   * Wizard description
   */
  description?: string;
  /**
   * Wizard steps
   */
  steps: WizardStep[];
  /**
   * Current step index
   */
  currentStep?: number;
  /**
   * Form values
   */
  values?: Record<string, any>;
  /**
   * Form errors
   */
  errors?: Record<string, string>;
  /**
   * Step change handler
   */
  onStepChange?: (step: number) => void;
  /**
   * Form submit handler (called when wizard is completed)
   */
  onSubmit?: (values: Record<string, any>) => Promise<void> | void;
  /**
   * Form cancel handler
   */
  onCancel?: () => void;
  /**
   * Value change handler
   */
  onChange?: (values: Record<string, any>) => void;
  /**
   * Step validation handler
   */
  onStepValidate?: (
    step: number,
    values: Record<string, any>
  ) => Promise<Record<string, string>>;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Whether wizard can be saved as draft
   */
  allowDraft?: boolean;
  /**
   * Draft save handler
   */
  onSaveDraft?: (values: Record<string, any>) => void;
  /**
   * Auto-save functionality
   */
  autoSave?: boolean;
  /**
   * Show step indicators
   */
  showStepIndicator?: boolean;
  /**
   * Allow step skipping
   */
  allowSkipping?: boolean;
  /**
   * Layout variant
   */
  layout?: "default" | "compact" | "sidebar";
  /**
   * Button text customization
   */
  submitText?: string;
  cancelText?: string;
  nextText?: string;
  previousText?: string;
  skipText?: string;
  finishText?: string;
}

/**
 * GlassWizardTemplate component
 * Multi-step wizard template with advanced navigation and validation
 */
export const GlassWizardTemplate = forwardRef<
  HTMLDivElement,
  GlassWizardTemplateProps
>(
  (
    {
      title,
      description,
      steps,
      currentStep = 0,
      values = {},
      errors = {},
      onStepChange,
      onSubmit,
      onCancel,
      onChange,
      onStepValidate,
      loading = false,
      allowDraft = false,
      onSaveDraft,
      autoSave = false,
      showStepIndicator = true,
      allowSkipping = false,
      layout = "default",
      submitText = "Submit",
      cancelText = "Cancel",
      nextText = "Next",
      previousText = "Previous",
      skipText = "Skip",
      finishText = "Finish",
      className,
      ...props
    },
    ref
  ) => {
    const [internalValues, setInternalValues] = useState(values);
    const [internalErrors, setInternalErrors] = useState(errors);
    const [stepValidation, setStepValidation] = useState<
      Record<number, boolean>
    >({});
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(
      new Set()
    );

    const totalSteps = steps?.length || 0;
    const currentStepData = steps?.[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === totalSteps - 1;

    // Handle value change
    const handleValueChange = useCallback(
      (newValues: Record<string, any>) => {
        setInternalValues(newValues);
        onChange?.(newValues);
      },
      [onChange]
    );

    // Handle step validation
    const handleStepValidation = useCallback(
      async (stepIndex: number, stepValues: Record<string, any>) => {
        const step = steps?.[stepIndex];
        let errors: Record<string, string> = {};

        // Step-specific validation
        if (step.validation) {
          errors = await step.validation(stepValues);
        }

        // Custom validation handler
        if (onStepValidate) {
          const customErrors = await onStepValidate(stepIndex, stepValues);
          errors = { ...errors, ...customErrors };
        }

        setInternalErrors(errors);
        const isValid = Object.keys(errors).length === 0;
        setStepValidation((prev: any) => ({ ...prev, [stepIndex]: isValid }));

        return isValid;
      },
      [steps, onStepValidate]
    );

    // Handle next step
    const handleNext = useCallback(async () => {
      if (isLastStep) return;

      const isValid = await handleStepValidation(currentStep, internalValues);

      if (isValid) {
        setCompletedSteps((prev: any) => new Set([...prev, currentStep]));
        onStepChange?.(currentStep + 1);
      }
    }, [
      currentStep,
      isLastStep,
      handleStepValidation,
      internalValues,
      onStepChange,
    ]);

    // Handle previous step
    const handlePrevious = useCallback(() => {
      if (isFirstStep) return;
      onStepChange?.(currentStep - 1);
    }, [currentStep, isFirstStep, onStepChange]);

    // Handle skip step
    const handleSkip = useCallback(() => {
      if (isLastStep || !currentStepData.canSkip) return;
      onStepChange?.(currentStep + 1);
    }, [currentStep, isLastStep, currentStepData?.canSkip, onStepChange]);

    // Handle step click (direct navigation)
    const handleStepClick = useCallback(
      (stepIndex: number) => {
        // Only allow navigation to completed steps or the next step
        if (stepIndex <= currentStep || completedSteps.has(stepIndex - 1)) {
          onStepChange?.(stepIndex);
        }
      },
      [currentStep, completedSteps, onStepChange]
    );

    // Handle form submission
    const handleSubmit = useCallback(async () => {
      const isValid = await handleStepValidation(currentStep, internalValues);

      if (isValid) {
        if (isLastStep) {
          await onSubmit?.(internalValues);
        } else {
          handleNext();
        }
      }
    }, [
      currentStep,
      internalValues,
      isLastStep,
      handleStepValidation,
      onSubmit,
      handleNext,
    ]);

    // Handle draft save
    const handleSaveDraft = useCallback(() => {
      onSaveDraft?.(internalValues);
    }, [internalValues, onSaveDraft]);

    // Auto-save effect
    useEffect(() => {
      if (autoSave && onSaveDraft) {
        const timeoutId = setTimeout(() => {
          onSaveDraft(internalValues);
        }, 2000);

        return () => clearTimeout(timeoutId);
      }
    }, [internalValues, autoSave, onSaveDraft]);

    // Render wizard header
    const renderHeader = () => (
      <VStack space="md">
        <VStack space="sm">
          <h1 className="glass-text-2xl font-bold text-primary">{title}</h1>
          {description && <p className="glass-text-secondary">{description}</p>}
        </VStack>

        {showStepIndicator && (
          <GlassFormWizardSteps
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
            layout={layout === "compact" ? "compact" : "default"}
          />
        )}
      </VStack>
    );

    // Render step content
    const renderStepContent = () => (
      <VStack space="lg">
        {/* Step header */}
        <VStack space="sm">
          <HStack space="sm" align="center">
            <h2 className="glass-text-xl font-semibold text-primary">
              {currentStepData.title}
            </h2>
            {currentStepData.optional && (
              <span className="glass-text-sm glass-text-secondary glass-surface-subtle glass-px-2 glass-py-1 glass-radius-md">
                Optional
              </span>
            )}
          </HStack>
          {currentStepData.description && (
            <p className="glass-text-secondary">
              {currentStepData.description}
            </p>
          )}
        </VStack>

        {/* Step content */}
        <div className="glass-flex-1">
          {currentStepData.component ? (
            currentStepData.component
          ) : (
            <GlassFormBuilder
              schema={currentStepData.schema || []}
              values={internalValues}
              errors={internalErrors}
              onChange={handleValueChange}
              onSubmit={handleSubmit}
              validateOnChange={true}
              autoSave={false}
              showProgress={false}
              submitText=""
              showCancel={false}
            />
          )}
        </div>
      </VStack>
    );

    // Render navigation buttons
    const renderNavigation = () => (
      <HStack space="sm" align="center" justify="between">
        <HStack space="sm">
          {onCancel && (
            <GlassButton variant="ghost" onClick={onCancel} disabled={loading}>
              {cancelText}
            </GlassButton>
          )}

          {allowDraft && (
            <GlassButton
              variant="outline"
              onClick={handleSaveDraft}
              disabled={loading}
            >
              Save Draft
            </GlassButton>
          )}
        </HStack>

        <HStack space="sm">
          {!isFirstStep && (
            <GlassButton
              variant="ghost"
              onClick={handlePrevious}
              disabled={loading}
            >
              {previousText}
            </GlassButton>
          )}

          {allowSkipping && currentStepData.canSkip && !isLastStep && (
            <GlassButton
              variant="outline"
              onClick={handleSkip}
              disabled={loading}
            >
              {skipText}
            </GlassButton>
          )}

          <GlassButton
            variant="default"
            onClick={handleSubmit}
            loading={loading}
          >
            {isLastStep ? finishText : nextText}
          </GlassButton>
        </HStack>
      </HStack>
    );

    // Render layout
    const renderLayout = () => {
      const content = (
        <VStack space="lg">
          {renderStepContent()}
          {renderNavigation()}
        </VStack>
      );

      switch (layout) {
        case "compact":
          return (
            <div data-glass-component className="max-w-2xl glass-mx-auto">
              <GlassCard variant="default" className="glass-p-6">
                {content}
              </GlassCard>
            </div>
          );

        case "sidebar":
          return (
            <div className="glass-grid glass-grid-cols-12 glass-gap-8">
              <div className="col-span-4">
                <Glass className="glass-p-6 sticky top-8">
                  <VStack space="md">
                    <h3 className="font-semibold text-primary">Steps</h3>
                    <VStack space="sm">
                      {steps.map((step, index) => (
                        <GlassButton
                          key={step.id}
                          onClick={(e) => handleStepClick(index)}
                          className={cn(
                            "text-left glass-p-3 glass-radius-lg transition-colors",
                            index === currentStep
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : completedSteps.has(index)
                                ? "bg-success/10 text-success border border-success/20"
                                : "glass-text-secondary hover:bg-muted/50"
                          )}
                          disabled={
                            index > currentStep &&
                            !completedSteps.has(index - 1)
                          }
                        >
                          <div className="font-medium">{step.title}</div>
                          {step.description && (
                            <div className="glass-text-sm opacity-75 glass-mt-1">
                              {step.description}
                            </div>
                          )}
                        </GlassButton>
                      ))}
                    </VStack>
                  </VStack>
                </Glass>
              </div>
              <div className="col-span-8">
                <GlassCard variant="default" className="glass-p-6">
                  {content}
                </GlassCard>
              </div>
            </div>
          );

        default:
          return (
            <GlassCard variant="default" className="glass-p-6">
              {content}
            </GlassCard>
          );
      }
    };

    return (
      <div
        ref={ref}
        className={cn("w-full glass-auto-gap glass-auto-gap-3xl", className)}
        {...props}
      >
        {layout !== "sidebar" && renderHeader()}

        <Motion>{renderLayout()}</Motion>
      </div>
    );
  }
);

GlassWizardTemplate.displayName = "GlassWizardTemplate";