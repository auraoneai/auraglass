import * as Sentry from "@sentry/node";

const SENSITIVE_METADATA_KEY =
  /(api[-_]?key|authorization|cookie|password|private[-_]?key|secret|token)/i;

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
          ...this.sanitizeMetadata({
            ...context?.metadata,
            errorCode: errorInfo.code,
            errorStatus: errorInfo.status,
          }),
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
            argumentCount: args.length,
            argumentTypes: args
              .slice(0, 3)
              .map((arg) => this.describeValue(arg)),
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

  private sanitizeMetadata(
    metadata: Record<string, any | undefined>
  ): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(metadata).map(([key, value]) => [
        key,
        this.sanitizeValue(key, value),
      ])
    );
  }

  private sanitizeValue(key: string, value: any, depth = 0): unknown {
    if (SENSITIVE_METADATA_KEY.test(key)) {
      return "[redacted]";
    }

    if (value === undefined) {
      return undefined;
    }

    if (
      value === null ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return value;
    }

    if (typeof value === "string") {
      if (/^(bearer|sk-|pk-|eyJ)/i.test(value) || value.length > 512) {
        return "[redacted]";
      }

      return value.length > 256 ? `${value.slice(0, 256)}...` : value;
    }

    if (typeof Buffer !== "undefined" && Buffer.isBuffer(value)) {
      return `[buffer:${value.byteLength}]`;
    }

    if (value instanceof Uint8Array) {
      return `[uint8array:${value.byteLength}]`;
    }

    if (Array.isArray(value)) {
      if (depth >= 2) {
        return `[array:${value.length}]`;
      }

      return value
        .slice(0, 5)
        .map((entry) => this.sanitizeValue(key, entry, depth + 1));
    }

    if (typeof value === "object") {
      if (depth >= 2) {
        return "[object]";
      }

      return Object.fromEntries(
        Object.entries(value)
          .slice(0, 20)
          .map(([childKey, childValue]) => [
            childKey,
            this.sanitizeValue(childKey, childValue, depth + 1),
          ])
      );
    }

    return this.describeValue(value);
  }

  private describeValue(value: any): string {
    if (value === null) {
      return "null";
    }

    if (typeof Buffer !== "undefined" && Buffer.isBuffer(value)) {
      return `Buffer(${value.byteLength})`;
    }

    if (value instanceof Uint8Array) {
      return `Uint8Array(${value.byteLength})`;
    }

    if (Array.isArray(value)) {
      return `Array(${value.length})`;
    }

    return typeof value;
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
