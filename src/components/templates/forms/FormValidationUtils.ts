import React from "react";
/**
 * Form validation utilities for form templates
 */

export interface ValidationRule {
  type: "required" | "email" | "min" | "max" | "pattern" | "custom";
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

export interface FieldValidation {
  [fieldId: string]: ValidationRule[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Built-in validation rules
 */
export const validationRules = {
  required: (message = "This field is required"): ValidationRule => ({
    type: "required",
    message,
    validator: (value: any) => {
      if (typeof value === "string") return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined;
    },
  }),

  email: (message = "Please enter a valid email address"): ValidationRule => ({
    type: "email",
    message,
    validator: (value: string) => {
      if (!value) return true; // Let required rule handle empty values
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    type: "min",
    value: min,
    message: message || `Must be at least ${min} characters`,
    validator: (value: string) => {
      if (!value) return true;
      return value.length >= min;
    },
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    type: "max",
    value: max,
    message: message || `Must be no more than ${max} characters`,
    validator: (value: string) => {
      if (!value) return true;
      return value.length <= max;
    },
  }),

  minValue: (min: number, message?: string): ValidationRule => ({
    type: "min",
    value: min,
    message: message || `Must be at least ${min}`,
    validator: (value: number) => {
      if (value === null || value === undefined) return true;
      return value >= min;
    },
  }),

  maxValue: (max: number, message?: string): ValidationRule => ({
    type: "max",
    value: max,
    message: message || `Must be no more than ${max}`,
    validator: (value: number) => {
      if (value === null || value === undefined) return true;
      return value <= max;
    },
  }),

  pattern: (regex: RegExp, message: string): ValidationRule => ({
    type: "pattern",
    value: regex,
    message,
    validator: (value: string) => {
      if (!value) return true;
      return regex.test(value);
    },
  }),

  custom: (
    validator: (value: any) => boolean,
    message: string
  ): ValidationRule => ({
    type: "custom",
    message,
    validator,
  }),

  // Common patterns
  phone: (message = "Please enter a valid phone number"): ValidationRule => ({
    type: "pattern",
    value: /^[\+]?[1-9][\d]{0,15}$/,
    message,
    validator: (value: string) => {
      if (!value) return true;
      return /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ""));
    },
  }),

  url: (message = "Please enter a valid URL"): ValidationRule => ({
    type: "pattern",
    value: /^https?:\/\/.+/,
    message,
    validator: (value: string) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
  }),

  strongPassword: (
    message = "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character"
  ): ValidationRule => ({
    type: "pattern",
    value:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message,
    validator: (value: string) => {
      if (!value) return true;
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        value
      );
    },
  }),
};

/**
 * Validate a single field value against its rules
 */
export const validateField = (
  value: any,
  rules: ValidationRule[]
): string | null => {
  for (const rule of rules) {
    if (rule.validator && !rule.validator(value)) {
      return rule.message;
    }
  }
  return null;
};

/**
 * Validate multiple fields
 */
export const validateFields = (
  values: Record<string, any>,
  validation: FieldValidation
): ValidationResult => {
  const errors: Record<string, string> = {};

  for (const [fieldId, rules] of Object.entries(validation)) {
    const fieldValue = values[fieldId];
    const error = validateField(fieldValue, rules);
    if (error) {
      errors[fieldId] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Common validation schemas
 */
export const commonValidationSchemas = {
  userRegistration: {
    firstName: [validationRules.required()],
    lastName: [validationRules.required()],
    email: [validationRules.required(), validationRules.email()],
    password: [validationRules.required(), validationRules.strongPassword()],
    confirmPassword: [validationRules.required()],
    terms: [
      validationRules.required("You must accept the terms and conditions"),
    ],
  },

  contactForm: {
    name: [validationRules.required()],
    email: [validationRules.required(), validationRules.email()],
    subject: [validationRules.required()],
    message: [validationRules.required(), validationRules.minLength(10)],
  },

  profileUpdate: {
    displayName: [
      validationRules.required(),
      validationRules.minLength(2),
      validationRules.maxLength(50),
    ],
    bio: [validationRules.maxLength(500)],
    website: [validationRules.url()],
    phone: [validationRules.phone()],
  },

  passwordChange: {
    currentPassword: [validationRules.required()],
    newPassword: [validationRules.required(), validationRules.strongPassword()],
    confirmNewPassword: [validationRules.required()],
  },
};

/**
 * Custom validation functions for common scenarios
 */
export const customValidators = {
  passwordsMatch: (password: string, confirmPassword: string) => {
    return password === confirmPassword;
  },

  uniqueEmail: async (
    email: string,
    checkFunction: (email: string) => Promise<boolean>
  ) => {
    if (!email) return true;
    return await checkFunction(email);
  },

  fileSize: (file: File, maxSizeInMB: number) => {
    if (!file) return true;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  },

  fileType: (file: File, allowedTypes: string[]) => {
    if (!file) return true;
    return allowedTypes.some((type) => {
      if (type.startsWith(".")) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type.startsWith(type);
    });
  },

  dateRange: (date: Date, minDate?: Date, maxDate?: Date) => {
    if (!date) return true;

    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;

    return true;
  },

  creditCard: (cardNumber: string) => {
    if (!cardNumber) return true;

    // Remove spaces and dashes
    const cleanNumber = cardNumber.replace(/[\s-]/g, "");

    // Check if it's all digits and proper length
    if (!/^\d{13,19}$/.test(cleanNumber)) return false;

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  },
};

/**
 * Async validation utilities
 */
export const asyncValidation = {
  debounce: (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      return new Promise((resolve) => {
        timeoutId = setTimeout(() => resolve(func(...args)), delay);
      });
    };
  },

  createAsyncValidator: (
    asyncCheck: (value: any) => Promise<boolean>,
    message: string,
    debounceMs = 500
  ) => {
    const debouncedCheck = asyncValidation.debounce(asyncCheck, debounceMs);

    return async (value: any): Promise<string | null> => {
      if (!value) return null;

      try {
        const isValid = await debouncedCheck(value);
        return isValid ? null : message;
      } catch {
        return "Validation failed. Please try again.";
      }
    };
  },
};

/**
 * Form validation state manager
 */
export class FormValidator {
  private validationSchema: FieldValidation;
  private asyncValidators: Record<
    string,
    (value: any) => Promise<string | null>
  >;

  constructor(validationSchema: FieldValidation = {}) {
    this.validationSchema = validationSchema;
    this.asyncValidators = {};
  }

  setValidationSchema(schema: FieldValidation) {
    this.validationSchema = schema;
  }

  addAsyncValidator(
    fieldId: string,
    validator: (value: any) => Promise<string | null>
  ) {
    this.asyncValidators[fieldId] = validator;
  }

  async validateForm(values: Record<string, any>): Promise<ValidationResult> {
    // Sync validation
    const syncResult = validateFields(values, this.validationSchema);

    // Async validation
    const asyncErrors: Record<string, string> = {};

    for (const [fieldId, validator] of Object.entries(this.asyncValidators)) {
      const fieldValue = values[fieldId];
      const error = await validator(fieldValue);
      if (error) {
        asyncErrors[fieldId] = error;
      }
    }

    const allErrors = { ...syncResult.errors, ...asyncErrors };

    return {
      isValid: Object.keys(allErrors).length === 0,
      errors: allErrors,
    };
  }

  async validateField(fieldId: string, value: any): Promise<string | null> {
    // Sync validation
    const rules = this.validationSchema[fieldId] || [];
    const syncError = validateField(value, rules);
    if (syncError) return syncError;

    // Async validation
    const asyncValidator = this.asyncValidators[fieldId];
    if (asyncValidator) {
      return await asyncValidator(value);
    }

    return null;
  }
}
