'use client';

import React, { forwardRef, useState } from 'react';
import { Glass } from '../../../primitives';
import { Motion } from '../../../primitives';
import { GlassFormBuilder } from '../../../components/interactive/GlassFormBuilder';
import { GlassButton } from '../../../components/button/GlassButton';
import { GlassProgress } from '../../../components/data-display/GlassProgress';
import { PageHeader } from '../../../components/layout/GlassAppShell';
import { VStack, HStack } from '../../../components/layout/GlassStack';
import { GlassCard } from '../../../components/card/GlassCard';
import { cn } from '../../../lib/utilsComprehensive';

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  sections: any[]; // FormSection from GlassFormBuilder
  optional?: boolean;
  validation?: (values: any) => Promise<Record<string, string>>;
}

export interface GlassFormTemplateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'autoSave'> {
  /**
   * Form title
   */
  title: string;
  /**
   * Form description
   */
  description?: string;
  /**
   * Form steps (for multi-step forms)
   */
  steps?: FormStep[];
  /**
   * Single form schema (for single-step forms)
   */
  schema?: any[];
  /**
   * Form values
   */
  values?: Record<string, any>;
  /**
   * Form errors
   */
  errors?: Record<string, string>;
  /**
   * Whether form is in multi-step mode
   */
  multiStep?: boolean;
  /**
   * Current step index
   */
  currentStep?: number;
  /**
   * Step change handler
   */
  onStepChange?: (step: number) => void;
  /**
   * Form submit handler
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
   * Form validation handler
   */
  onValidate?: (values: Record<string, any>) => Record<string, string>;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Whether form can be saved as draft
   */
  allowDraft?: boolean;
  /**
   * Draft save handler
   */
  onSaveDraft?: (values: Record<string, any>) => void;
  /**
   * Form layout
   */
  layout?: 'default' | 'centered' | 'sidebar';
  /**
   * Sidebar content (for sidebar layout)
   */
  sidebar?: React.ReactNode;
  /**
   * Show progress indicator
   */
  showProgress?: boolean;
  /**
   * Auto-save functionality
   */
  autoSave?: boolean;
  /**
   * Submit button text
   */
  submitText?: string;
  /**
   * Cancel button text
   */
  cancelText?: string;
  /**
   * Next button text
   */
  nextText?: string;
  /**
   * Previous button text
   */
  previousText?: string;
}

/**
 * GlassFormTemplate component
 * Comprehensive form template with single-step and multi-step support
 */
export const GlassFormTemplate = forwardRef<HTMLDivElement, GlassFormTemplateProps>(
  (
    {
      title,
      description,
      steps = [],
      schema = [],
      values = {},
      errors = {},
      multiStep = false,
      currentStep = 0,
      onStepChange,
      onSubmit,
      onCancel,
      onChange,
      onValidate,
      loading = false,
      allowDraft = false,
      onSaveDraft,
      layout = 'default',
      sidebar,
      showProgress = true,
      autoSave = false,
      submitText = 'Submit',
      cancelText = 'Cancel',
      nextText = 'Next',
      previousText = 'Previous',
      className,
      ...props
    },
    ref
  ) => {
    const [internalValues, setInternalValues] = useState(values);
    const [internalErrors, setInternalErrors] = useState(errors);
    const [stepValidation, setStepValidation] = useState<Record<number, boolean>>({});

    const isMultiStep = multiStep && (steps?.length || 0) > 0;
    const totalSteps = isMultiStep ? (steps?.length || 0) : 1;
    const currentStepData: FormStep | null = isMultiStep ? steps[currentStep] : null;
    const currentSchema = isMultiStep ? currentStepData?.sections : schema;

    // Handle value change
    const handleValueChange = (newValues: Record<string, any>) => {
      setInternalValues(newValues);
      onChange?.(newValues);
    };

    // Handle form validation
    const handleValidate = async (stepValues: Record<string, any>) => {
      let errors: Record<string, string> = {};

      // Global validation
      if (onValidate) {
        errors = { ...errors, ...onValidate(stepValues) };
      }

      // Step-specific validation
      if (currentStepData?.validation) {
        const stepErrors = await currentStepData.validation(stepValues);
        errors = { ...errors, ...stepErrors };
      }

      setInternalErrors(errors);
      return errors;
    };

    // Handle step navigation
    const handleNext = async () => {
      if (!isMultiStep || currentStep >= totalSteps - 1) return;

      const errors = await handleValidate(internalValues);
      const hasErrors = Object.keys(errors).length > 0;

      if (!hasErrors) {
        setStepValidation({ ...stepValidation, [currentStep]: true });
        onStepChange?.(currentStep + 1);
      }
    };

    const handlePrevious = () => {
      if (!isMultiStep || currentStep <= 0) return;
      onStepChange?.(currentStep - 1);
    };

    // Handle form submission
    const handleSubmit = async (formValues: Record<string, any>) => {
      if (isMultiStep) {
        const errors = await handleValidate(formValues);
        const hasErrors = Object.keys(errors).length > 0;

        if (hasErrors) return;

        if (currentStep < totalSteps - 1) {
          handleNext();
          return;
        }
      }

      await onSubmit?.(formValues);
    };

    // Handle draft save
    const handleSaveDraft = () => {
      onSaveDraft?.(internalValues);
    };

    // Calculate progress
    const getProgress = () => {
      if (!isMultiStep) return 100;
      return ((currentStep + 1) / totalSteps) * 100;
    };

    // Render step indicator
    const renderStepIndicator = () => {
      if (!isMultiStep || !showProgress) return null;

      return (
        <VStack space="md">
          <HStack space="sm" align="center" justify="between">
            <span className="text-sm font-medium text-primary">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm glass-text-secondary">
              {Math.round(getProgress())}% Complete
            </span>
          </HStack>
          
          <GlassProgress
            value={getProgress()}
            size="sm"
            variant="default"
            showValue={false}
          />
          
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  'flex flex-col items-center glass-gap-2 cursor-pointer transition-opacity',
                  index > currentStep && 'opacity-50',
                  index < currentStep && 'opacity-75'
                )}
                onClick={(e) => stepValidation[index] && onStepChange?.(index)}
              >
                <div className={cn(
                  'w-8 h-8 glass-radius-full flex items-center justify-center glass-text-sm font-medium',
                  index === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : index < currentStep
                    ? 'bg-success text-success-foreground'
                    : 'bg-muted glass-text-secondary'
                )}>
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <span className="text-xs text-center max-w-16 truncate">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </VStack>
      );
    };

    // Render form actions
    const renderFormActions = () => (
      <HStack space="sm" align="center" justify="between">
        <HStack space="sm">
          {onCancel && (
            <GlassButton
              variant="ghost"
              onClick={onCancel}
              disabled={loading}
            >
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
          {isMultiStep && currentStep > 0 && (
            <GlassButton
              variant="ghost"
              onClick={handlePrevious}
              disabled={loading}
            >
              {previousText}
            </GlassButton>
          )}
          
          <GlassButton
            variant="default"
            type="submit"
            loading={loading}
          >
            {isMultiStep && currentStep < totalSteps - 1 ? nextText : submitText}
          </GlassButton>
        </HStack>
      </HStack>
    );

    // Render form content
    const renderFormContent = () => (
      <VStack space="lg">
        {/* Step indicator */}
        {renderStepIndicator()}

        {/* Current step header */}
        {isMultiStep && currentStepData && (
          <VStack space="sm">
            <h2 className="text-xl font-semibold text-primary">
              {currentStepData.title}
            </h2>
            {currentStepData.description && (
              <p className="glass-text-secondary">
                {currentStepData.description}
              </p>
            )}
          </VStack>
        )}

        {/* Form */}
        <div className="flex-1">
          <GlassFormBuilder
            schema={currentSchema || []}
            values={internalValues}
            errors={internalErrors}
            onChange={handleValueChange}
            onSubmit={handleSubmit}
            onValidate={onValidate}
            validateOnChange={true}
            autoSave={autoSave}
            showProgress={false}
            submitText=""
            showCancel={false}
          />
        </div>

        {/* Actions */}
        {renderFormActions()}
      </VStack>
    );

    // Render layout
    const renderLayout = () => {
      switch (layout) {
        case 'centered':
          return (
            <div className="max-w-2xl mx-auto">
              <GlassCard variant="default" className="p-8">
                {renderFormContent()}
              </GlassCard>
            </div>
          );

        case 'sidebar':
          return (
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-8">
                <GlassCard variant="default" className="p-6">
                  {renderFormContent()}
                </GlassCard>
              </div>
              <div className="col-span-4">
                {sidebar}
              </div>
            </div>
          );

        default:
          return (
            <GlassCard variant="default" className="p-6">
              {renderFormContent()}
            </GlassCard>
          );
      }
    };

    return (
      <div ref={ref} className={cn('w-full glass-auto-gap glass-auto-gap-3xl', className)} {...props}>
        {/* Header */}
        <PageHeader
          title={title}
          description={description}
          variant={layout === 'centered' ? 'centered' : 'default'}
        />

        {/* Form */}
        <Motion preset="fadeIn">
          {renderLayout()}
        </Motion>
      </div>
    );
  }
);

GlassFormTemplate.displayName = 'GlassFormTemplate';
