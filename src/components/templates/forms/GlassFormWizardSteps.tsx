'use client';
import React, { forwardRef } from "react";
import { Motion } from "../../../primitives";
import { GlassProgress } from "../../../components/data-display/GlassProgress";
import { VStack, HStack } from "../../../components/layout/GlassStack";
import { cn } from "../../../lib/utilsComprehensive";

export interface StepIndicatorProps {
  step: {
    id: string;
    title: string;
    description?: string;
    optional?: boolean;
  };
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  isClickable: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  layout?: "default" | "compact" | "vertical";
}

export interface GlassFormWizardStepsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Wizard steps
   */
  steps: Array<{
    id: string;
    title: string;
    description?: string;
    optional?: boolean;
  }>;
  /**
   * Current active step index
   */
  currentStep: number;
  /**
   * Set of completed step indices
   */
  completedSteps: Set<number>;
  /**
   * Step click handler
   */
  onStepClick?: (stepIndex: number) => void;
  /**
   * Layout variant
   */
  layout?: "default" | "compact" | "vertical";
  /**
   * Show progress bar
   */
  showProgress?: boolean;
  /**
   * Show step numbers
   */
  showNumbers?: boolean;
  /**
   * Allow clicking on steps
   */
  clickable?: boolean;
}

/**
 * StepIndicator component
 * Individual step indicator for wizard navigation
 */
const StepIndicator = forwardRef<HTMLDivElement, StepIndicatorProps>(
  (
    {
      step,
      index,
      isActive,
      isCompleted,
      isClickable,
      onClick,
      layout = "default",
    },
    ref
  ) => {
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (isClickable && onClick) {
        onClick(event);
      }
    };

    const renderStepIcon = () => {
      if (isCompleted) {
        return (
          <div
            data-glass-component
            className="w-8 h-8 glass-radius-full bg-success glass-flex glass-items-center glass-justify-center"
          >
            <svg
              className="w-4 h-4 text-success-foreground"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      }

      return (
        <div
          className={cn(
            "w-8 h-8 glass-radius-full flex items-center justify-center glass-text-sm font-medium border-2 transition-colors",
            isActive
              ? "bg-primary border-primary text-primary-foreground"
              : "bg-background border-border glass-text-secondary"
          )}
        >
          {index + 1}
        </div>
      );
    };

    const renderStepContent = () => {
      if (layout === "compact") {
        return renderStepIcon();
      }

      return (
        <VStack space="xs" align="center">
          {renderStepIcon()}
          <VStack space="xs" align="center">
            <span
              className={cn(
                "glass-text-sm font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : isCompleted
                    ? "text-success"
                    : "glass-text-secondary"
              )}
            >
              {step.title}
            </span>
            {step.optional && (
              <span className="glass-text-xs glass-text-secondary glass-surface-subtle glass-px-1.5 glass-py-0.5 glass-radius-md">
                Optional
              </span>
            )}
          </VStack>
        </VStack>
      );
    };

    if (layout === "vertical") {
      return (
        <div ref={ref} className="glass-flex glass-items-start glass-gap-4">
          <div className="glass-flex glass-flex-col glass-items-center">
            {renderStepIcon()}
            {index < step.title.length - 1 && (
              <div
                className={cn(
                  "w-0.5 h-8 glass-mt-2 transition-colors",
                  isCompleted ? "bg-success" : "bg-border"
                )}
              />
            )}
          </div>
          <VStack space="xs" className="glass-flex-1">
            <span
              className={cn(
                "font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : isCompleted
                    ? "text-success"
                    : "glass-text-secondary"
              )}
            >
              {step.title}
            </span>
            {step.description && (
              <p className="glass-text-sm glass-text-secondary">
                {step.description}
              </p>
            )}
            {step.optional && (
              <span className="glass-text-xs glass-text-secondary glass-surface-subtle glass-px-1.5 glass-py-0.5 glass-radius-md w-fit">
                Optional
              </span>
            )}
          </VStack>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center transition-opacity",
          isClickable && "cursor-pointer hover:opacity-80",
          !isClickable && "cursor-default"
        )}
        onClick={handleClick}
      >
        {renderStepContent()}
      </div>
    );
  }
);

StepIndicator.displayName = "StepIndicator";

/**
 * GlassFormWizardSteps component
 * Step indicator and navigation for wizard forms
 */
export const GlassFormWizardSteps = forwardRef<
  HTMLDivElement,
  GlassFormWizardStepsProps
>(
  (
    {
      steps = [],
      currentStep,
      completedSteps,
      onStepClick,
      layout = "default",
      showProgress = true,
      showNumbers = true,
      clickable = true,
      className,
      ...props
    },
    ref
  ) => {
    const totalSteps = steps?.length || 0;
    const progressValue =
      totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

    const handleStepClick = (stepIndex: number) => {
      if (clickable && onStepClick) {
        onStepClick(stepIndex);
      }
    };

    const isStepClickable = (stepIndex: number) => {
      if (!clickable) return false;
      // Allow clicking on current step, completed steps, and next step if previous is completed
      return (
        stepIndex === currentStep ||
        completedSteps.has(stepIndex) ||
        (stepIndex === currentStep + 1 && completedSteps.has(stepIndex - 1))
      );
    };

    const renderProgressBar = () => {
      if (!showProgress) return null;

      return (
        <VStack space="sm">
          <HStack space="sm" align="center" justify="between">
            <span className="glass-text-sm font-medium text-primary">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="glass-text-sm glass-text-secondary">
              {Math.round(progressValue)}% Complete
            </span>
          </HStack>

          <GlassProgress
            value={progressValue}
            size="sm"
            variant="default"
            showValue={false}
          />
        </VStack>
      );
    };

    const renderSteps = () => {
      if (layout === "vertical") {
        return (
          <VStack space="md">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="animate-slide-in-left"
                style={{
                  animationDelay: `${Math.min(index, 5) * 100}ms`,
                  animationFillMode: "both",
                }}
              >
                <StepIndicator
                  step={step}
                  index={index}
                  isActive={index === currentStep}
                  isCompleted={completedSteps.has(index)}
                  isClickable={isStepClickable(index)}
                  onClick={(e) => handleStepClick(index)}
                  layout={layout}
                />
              </div>
            ))}
          </VStack>
        );
      }

      return (
        <div
          className={cn(
            "flex items-center",
            layout === "compact"
              ? "justify-center glass-gap-2"
              : "justify-between"
          )}
        >
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div
                className="animate-slide-in-up"
                style={{
                  animationDelay: `${Math.min(index, 5) * 100}ms`,
                  animationFillMode: "both",
                }}
              >
                <StepIndicator
                  step={step}
                  index={index}
                  isActive={index === currentStep}
                  isCompleted={completedSteps.has(index)}
                  isClickable={isStepClickable(index)}
                  onClick={(e) => handleStepClick(index)}
                  layout={layout}
                />
              </div>

              {/* Connector line */}
              {index < totalSteps - 1 && layout !== "compact" && (
                <div
                  className={cn(
                    "flex-1 h-0.5 glass-mx-4 transition-colors",
                    completedSteps.has(index) ? "bg-success" : "bg-border"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      );
    };

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <VStack space="lg">
          {renderProgressBar()}
          {renderSteps()}
        </VStack>
      </div>
    );
  }
);

GlassFormWizardSteps.displayName = "GlassFormWizardSteps";