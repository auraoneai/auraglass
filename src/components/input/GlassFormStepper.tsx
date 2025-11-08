import { cn } from "../../lib/utilsComprehensive";
import { AlertCircle, Check, Circle } from "lucide-react";
import React from "react";
import { Motion } from "../../primitives";

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  completed?: boolean;
  disabled?: boolean;
  error?: boolean;
  optional?: boolean;
}

export interface GlassFormStepperProps {
  /**
   * Array of form steps
   */
  steps: FormStep[];
  /**
   * Current active step index
   */
  currentStep?: number;
  /**
   * Step click handler
   */
  onStepClick?: (stepIndex: number) => void;
  /**
   * Orientation of the stepper
   */
  orientation?: "horizontal" | "vertical";
  /**
   * Size variant
   */
  size?: "sm" | "md" | "lg";
  /**
   * Show step numbers
   */
  showNumbers?: boolean;
  /**
   * Show step descriptions
   */
  showDescriptions?: boolean;
  /**
   * Allow clicking on completed steps
   */
  allowClickCompleted?: boolean;
  /**
   * Show progress line
   */
  showProgressLine?: boolean;
  /**
   * Custom className
   */
  className?: string;
}

/**
 * GlassFormStepper component
 * A visual stepper component for multi-step forms with glassmorphism design
 */
export const GlassFormStepper: React.FC<GlassFormStepperProps> = ({
  steps,
  currentStep = 0,
  onStepClick,
  orientation = "horizontal",
  size = "md",
  showNumbers = true,
  showDescriptions = false,
  allowClickCompleted = true,
  showProgressLine = true,
  className,
  ...props
}) => {
  // Size configurations
  const sizeConfigs = {
    sm: {
      stepSize: "w-8 h-8",
      iconSize: "w-4 h-4",
      fontSize: "glass-text-sm",
      lineHeight: "h-px",
      spacing: "glass-gap-4",
    },
    md: {
      stepSize: "w-10 h-10",
      iconSize: "w-5 h-5",
      fontSize: "glass-text-base",
      lineHeight: "h-0.5",
      spacing: "glass-gap-6",
    },
    lg: {
      stepSize: "w-12 h-12",
      iconSize: "w-6 h-6",
      fontSize: "glass-text-lg",
      lineHeight: "h-1",
      spacing: "gap-8",
    },
  };

  const config = sizeConfigs[size];

  // Get step state
  const getStepState = (stepIndex: number, step: FormStep) => {
    if (step.disabled) return "disabled";
    if (step.error) return "error";
    if (step.completed) return "completed";
    if (stepIndex === currentStep) return "active";
    if (stepIndex < currentStep) return "completed";
    return "pending";
  };

  // Get step styles based on state
  const getStepStyles = (state: string) => {
    switch (state) {
      case "completed":
        return {
          circle: "bg-green-500 border-green-500 glass-text-primary",
          icon: "glass-text-primary",
          line: "bg-green-500",
          text: "glass-text-primary",
        };
      case "active":
        return {
          circle: "bg-primary border-primary glass-text-primary",
          icon: "glass-text-primary",
          line: "bg-primary/50",
          text: "glass-text-primary",
        };
      case "error":
        return {
          circle: "bg-red-500 border-red-500 glass-text-primary",
          icon: "glass-text-primary",
          line: "bg-red-500/50",
          text: "text-red-300",
        };
      case "disabled":
        return {
          circle: "bg-white/10 border-white/30 glass-text-primary/50",
          icon: "glass-text-primary/50",
          line: "bg-white/30",
          text: "glass-text-primary/50",
        };
      default:
        return {
          circle: "bg-white/10 border-white/30 glass-text-primary/60",
          icon: "glass-text-primary/60",
          line: "bg-white/30",
          text: "glass-text-primary/60",
        };
    }
  };

  // Handle step click
  const handleStepClick = (stepIndex: number, step: FormStep) => {
    const state = getStepState(stepIndex, step);

    if (state === "disabled") return;
    if (state === "pending" && !allowClickCompleted) return;

    onStepClick?.(stepIndex);
  };

  // Render horizontal stepper
  const renderHorizontalStepper = () => (
    <nav
      aria-label="Form steps"
      className={cn(
        "flex items-center justify-center",
        config.spacing,
        className
      )}
    >
      {steps.map((step, index) => {
        const state = getStepState(index, step);
        const styles = getStepStyles(state);
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment data-glass-component key={step.id}>
            {/* Step */}
            <div className="glass-flex glass-flex-col glass-items-center group">
              <Motion
                preset={state === "active" ? "scaleIn" : "fadeIn"}
                className="glass-flex glass-flex-col glass-items-center cursor-pointer"
                onClick={(e) => handleStepClick(index, step)}
                role="button"
                aria-label={`Step ${index + 1}: ${step.title}${state === "completed" ? " (completed)" : state === "active" ? " (current)" : ""}`}
                aria-current={state === "active" ? "step" : undefined}
                aria-disabled={state === "disabled"}
                tabIndex={state === "disabled" ? -1 : 0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleStepClick(index, step);
                  }
                }}
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    "relative glass-radius-full border-2 flex items-center justify-center transition-all duration-200",
                    "hover:scale-110 group-hover:shadow-lg",
                    config.stepSize,
                    styles.circle
                  )}
                >
                  {state === "completed" ? (
                    <Check className={config.iconSize} />
                  ) : state === "error" ? (
                    <AlertCircle className={config.iconSize} />
                  ) : step.icon ? (
                    <span className={cn(config.iconSize, styles.icon)}>
                      {step.icon}
                    </span>
                  ) : showNumbers ? (
                    <span
                      className={cn(
                        "font-medium",
                        config.fontSize.replace("text-", "text-"),
                        styles.icon
                      )}
                    >
                      {index + 1}
                    </span>
                  ) : (
                    <Circle className={config.iconSize} />
                  )}

                  {/* Optional indicator */}
                  {step.optional && (
                    <div className="absolute glass-top-1 -right-1 w-2 h-2 glass-surface-yellow glass-radius-full" />
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-3 text-center max-w-24">
                  <h3
                    className={cn(
                      "font-medium leading-tight",
                      config.fontSize,
                      styles.text
                    )}
                  >
                    {step.title}
                  </h3>
                  {showDescriptions && step.description && (
                    <p
                      className={cn(
                        "glass-text-xs glass-mt-1 leading-tight",
                        state === "active"
                          ? "glass-text-primary/80"
                          : "glass-text-primary/50"
                      )}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </Motion>
            </div>

            {/* Connection Line */}
            {!isLast && showProgressLine && (
              <div
                className={cn(
                  "flex-1 glass-mx-2 transition-all duration-300",
                  config.lineHeight,
                  index < currentStep ? styles.line : "bg-white/20"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );

  // Render vertical stepper
  const renderVerticalStepper = () => (
    <nav
      aria-label="Form steps"
      className={cn("flex flex-col", config.spacing, className)}
    >
      {steps.map((step, index) => {
        const state = getStepState(index, step);
        const styles = getStepStyles(state);
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div className="glass-flex glass-items-start group">
              <Motion
                preset={state === "active" ? "slideRight" : "fadeIn"}
                className="glass-flex glass-items-start cursor-pointer"
                onClick={(e) => handleStepClick(index, step)}
                role="button"
                aria-label={`Step ${index + 1}: ${step.title}${state === "completed" ? " (completed)" : state === "active" ? " (current)" : ""}`}
                aria-current={state === "active" ? "step" : undefined}
                aria-disabled={state === "disabled"}
                tabIndex={state === "disabled" ? -1 : 0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleStepClick(index, step);
                  }
                }}
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    "relative glass-radius-full border-2 flex items-center justify-center transition-all duration-200",
                    "hover:scale-110 group-hover:shadow-lg glass-mr-4",
                    config.stepSize,
                    styles.circle
                  )}
                >
                  {state === "completed" ? (
                    <Check className={config.iconSize} />
                  ) : state === "error" ? (
                    <AlertCircle className={config.iconSize} />
                  ) : step.icon ? (
                    <span className={cn(config.iconSize, styles.icon)}>
                      {step.icon}
                    </span>
                  ) : showNumbers ? (
                    <span
                      className={cn(
                        "font-medium",
                        config.fontSize.replace("text-", "text-"),
                        styles.icon
                      )}
                    >
                      {index + 1}
                    </span>
                  ) : (
                    <Circle className={config.iconSize} />
                  )}

                  {/* Optional indicator */}
                  {step.optional && (
                    <div className="absolute glass-top-1 -right-1 w-2 h-2 glass-surface-yellow glass-radius-full" />
                  )}
                </div>

                {/* Step Content */}
                <div className="glass-flex-1 pt-1">
                  <h3
                    className={cn(
                      "font-medium leading-tight",
                      config.fontSize,
                      styles.text
                    )}
                  >
                    {step.title}
                  </h3>
                  {showDescriptions && step.description && (
                    <p
                      className={cn(
                        "glass-text-sm glass-mt-1 leading-tight",
                        state === "active"
                          ? "glass-text-primary/80"
                          : "glass-text-primary/50"
                      )}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </Motion>
            </div>

            {/* Connection Line */}
            {!isLast && showProgressLine && (
              <div className="glass-flex glass-justify-center glass-py-2">
                <div
                  className={cn(
                    "w-px h-8 transition-all duration-300",
                    index < currentStep ? styles.line : "bg-white/20"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );

  return (
    <Motion preset="fadeIn" className="glass-w-full">
      {orientation === "horizontal"
        ? renderHorizontalStepper()
        : renderVerticalStepper()}
    </Motion>
  );
};

// Compact stepper variant
export interface GlassCompactStepperProps
  extends Omit<GlassFormStepperProps, "orientation" | "showDescriptions"> {
  /**
   * Show labels
   */
  showLabels?: boolean;
}

/**
 * GlassCompactStepper component
 * A compact version of the stepper for tight spaces
 */
export const GlassCompactStepper: React.FC<GlassCompactStepperProps> = ({
  steps,
  currentStep = 0,
  onStepClick,
  size = "sm",
  showLabels = false,
  className,
  ...props
}) => {
  const sizeConfigs = {
    sm: { stepSize: "w-6 h-6", iconSize: "w-3 h-3", fontSize: "glass-text-xs" },
    md: { stepSize: "w-8 h-8", iconSize: "w-4 h-4", fontSize: "glass-text-sm" },
    lg: {
      stepSize: "w-10 h-10",
      iconSize: "w-5 h-5",
      fontSize: "glass-text-base",
    },
  };

  const config = sizeConfigs[size];

  return (
    <div className={cn("flex items-center glass-gap-2", className)}>
      {steps.map((step, index) => {
        const state = getStepState(index, step);
        const styles = getStepStyles(state);
        const isLast = index === steps.length - 1;

        // Helper function (defined inside since it's specific to this component)
        function getStepState(stepIndex: number, step: FormStep) {
          if (step.disabled) return "disabled";
          if (step.error) return "error";
          if (step.completed) return "completed";
          if (stepIndex === currentStep) return "active";
          if (stepIndex < currentStep) return "completed";
          return "pending";
        }

        // Helper function for styles
        function getStepStyles(state: string) {
          switch (state) {
            case "completed":
              return {
                circle: "bg-green-500 border-green-500",
                line: "bg-green-500",
              };
            case "active":
              return {
                circle: "bg-primary border-primary",
                line: "bg-primary/50",
              };
            case "error":
              return {
                circle: "bg-red-500 border-red-500",
                line: "bg-red-500/50",
              };
            case "disabled":
              return {
                circle: "bg-white/10 border-white/30",
                line: "bg-white/30",
              };
            default:
              return {
                circle: "bg-white/10 border-white/30",
                line: "bg-white/30",
              };
          }
        }

        return (
          <React.Fragment key={step.id}>
            <div className="glass-flex glass-items-center">
              <button
                onClick={(e) => onStepClick?.(index)}
                className={cn(
                  "relative glass-radius-full border flex items-center justify-center transition-all duration-200",
                  "hover:scale-110",
                  config.stepSize,
                  styles.circle
                )}
              >
                {state === "completed" ? (
                  <Check className={config.iconSize} />
                ) : state === "error" ? (
                  <AlertCircle className={config.iconSize} />
                ) : step.icon ? (
                  <span className={config.iconSize}>{step.icon}</span>
                ) : (
                  <span className={cn("font-medium", config.fontSize)}>
                    {index + 1}
                  </span>
                )}
              </button>

              {showLabels && (
                <span
                  className={cn(
                    "glass-ml-2 font-medium",
                    config.fontSize,
                    "glass-text-primary/80"
                  )}
                >
                  {step.title}
                </span>
              )}
            </div>

            {!isLast && <div className={cn("h-px w-8", styles.line)} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default GlassFormStepper;
