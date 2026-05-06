import * as Sentry from "@sentry/react";

export interface ErrorContext {
  service?: string;
  operation?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export class ErrorHandler {
  private initialized = false;

  constructor() {
    this.initializeSentry();
  }

  private initializeSentry(): void {
    if (this.initialized || !process.env.SENTRY_DSN) return;

    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || "development",
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
      integrations: [
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      beforeSend(event, hint) {
        if (event.exception) {
          const error = hint.originalException;
          if (error && typeof error === "object" && "code" in error) {
            if ((error as any).code === "insufficient_quota") {
              return null;
            }
          }
        }
        return event;
      },
    });

    this.initialized = true;
  }

  handleError(error: unknown, context?: ErrorContext): void {
    const errorInfo = this.extractErrorInfo(error);

    if (this.initialized && process.env.NODE_ENV === "production") {
      Sentry.captureException(error, {
        tags: {
          service: context?.service,
          operation: context?.operation,
        },
        extra: {
          ...context?.metadata,
          errorCode: errorInfo.code,
          errorStatus: errorInfo.status,
        },
        user: context?.userId ? { id: context.userId } : undefined,
      });
    }
  }

  handleWithFallback<T>(
    error: unknown,
    fallbackFn: () => T,
    context?: ErrorContext
  ): T {
    this.handleError(error, context);
    return fallbackFn();
  }

  async handleAsyncWithFallback<T>(
    error: unknown,
    fallbackFn: () => Promise<T>,
    context?: ErrorContext
  ): Promise<T> {
    this.handleError(error, context);
    return fallbackFn();
  }

  wrapAsync<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    context?: ErrorContext
  ): T {
    return (async (...args: Parameters<T>) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handleError(error, {
          ...context,
          metadata: {
            ...context?.metadata,
            functionName: fn.name,
            arguments: args.slice(0, 3),
          },
        });
        throw error;
      }
    }) as T;
  }

  private extractErrorInfo(error: unknown): {
    message: string;
    code?: string;
    status?: number;
    details?: any;
  } {
    if (error instanceof Error) {
      const info: any = {
        message: error.message,
      };

      if ("code" in error) info.code = (error as any).code;
      if ("response" in error) info.details = (error as any).response;
      if ("status" in error) info.status = (error as any).status;

      return info;
    }

    if (typeof error === "string") {
      return { message: error };
    }

    return {
      message: "Unknown error occurred",
      details: error,
    };
  }

  createServiceError(
    message: string,
    code: string,
    statusCode: number = 500,
    details?: any
  ): ServiceError {
    return new ServiceError(message, code, statusCode, details);
  }
}

export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

export class RateLimitError extends ServiceError {
  constructor(message = "Rate limit exceeded", retryAfter?: number) {
    super(message, "RATE_LIMIT_EXCEEDED", 429, { retryAfter });
  }
}

export class QuotaExceededError extends ServiceError {
  constructor(service: string) {
    super(
      `${service} quota exceeded. Falling back to alternative implementation.`,
      "QUOTA_EXCEEDED",
      402
    );
  }
}

export class ValidationError extends ServiceError {
  constructor(message: string, fields?: Record<string, string>) {
    super(message, "VALIDATION_ERROR", 400, { fields });
  }
}
