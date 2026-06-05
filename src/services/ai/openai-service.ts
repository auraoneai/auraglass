// @ts-nocheck - Optional OpenAI dependency
import { createHash } from "crypto";
import { z } from "zod";
import { AIConfig } from "./config";
import { CacheService } from "./cache-service";
import { ErrorHandler } from "./error-handler";

const FieldSuggestionSchema = z.object({
  fieldName: z.string(),
  fieldType: z.enum([
    "text",
    "email",
    "password",
    "number",
    "date",
    "select",
    "checkbox",
    "radio",
    "textarea",
    "file",
  ]),
  label: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean(),
  validation: z
    .object({
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
      pattern: z.string().optional(),
      customMessage: z.string().optional(),
    })
    .optional(),
  options: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .optional(),
});

export type FieldSuggestion = z.infer<typeof FieldSuggestionSchema>;

export interface FormFieldSuggestionResult {
  fields: FieldSuggestion[];
  cached: boolean;
  usage: AIUsageMetadata;
}

export interface AIUsageMetadata {
  provider: "openai";
  feature: string;
  model: AIConfig["openai"]["model"];
  promptTokensEstimate: number;
  completionTokensEstimate: number;
  cached: boolean;
  estimatedCostUsd: number;
}

export class OpenAIService {
  private client: any | null = null;
  private cache: CacheService;
  private errorHandler: ErrorHandler;
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
    this.cache = new CacheService(config.redis);
    this.errorHandler = new ErrorHandler();
  }

  private async getClient(): Promise<any> {
    if (this.client) {
      return this.client;
    }

    const module = await import("openai");
    const OpenAI = module.default ?? module.OpenAI ?? module;
    this.client = new OpenAI({
      apiKey: this.config.openai.apiKey,
    });
    return this.client;
  }

  async generateFormFieldSuggestions(
    formContext: string,
    existingFields: FieldSuggestion[] = []
  ): Promise<FieldSuggestion[]> {
    const result = await this.generateFormFieldSuggestionsWithMetadata(
      formContext,
      existingFields
    );

    return result.fields;
  }

  async generateFormFieldSuggestionsWithMetadata(
    formContext: string,
    existingFields: FieldSuggestion[] = []
  ): Promise<FormFieldSuggestionResult> {
    const cacheKey = this.createCacheKey("form-suggestions", {
      formContext,
      existingFields,
    });

    if (this.config.costOptimization.enableCaching) {
      const cached = await this.cache.get<FieldSuggestion[]>(cacheKey);
      if (cached) {
        return {
          fields: cached,
          cached: true,
          usage: this.createUsageMetadata({
            feature: "smart form generation",
            model: this.config.openai.model,
            promptText: "",
            responseText: "",
            cached: true,
          }),
        };
      }
    }

    try {
      const prompt = this.buildFormSuggestionPrompt(
        formContext,
        existingFields
      );
      const client = await this.getClient();
      const model = this.shouldUseCheaperModel(formContext)
        ? "gpt-3.5-turbo"
        : this.config.openai.model;

      const response = await client.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are a form design expert. Suggest optimal field types, validation rules, and user experience improvements for forms. Return JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: this.config.openai.temperature,
        max_tokens: this.config.openai.maxTokens,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error("No response from OpenAI");

      const parsed = JSON.parse(content);
      const suggestions = z
        .array(FieldSuggestionSchema)
        .parse(parsed.fields || parsed.suggestions || []);

      if (this.config.costOptimization.enableCaching) {
        await this.cache.set(cacheKey, suggestions, this.config.redis.ttl);
      }

      return {
        fields: suggestions,
        cached: false,
        usage: this.createUsageMetadata({
          feature: "smart form generation",
          model,
          promptText: prompt,
          responseText: content,
          cached: false,
        }),
      };
    } catch (error) {
      return this.errorHandler.handleWithFallback(error, () => ({
        fields: this.getFallbackSuggestions(formContext),
        cached: false,
        usage: this.createUsageMetadata({
          feature: "smart form generation",
          model: this.config.openai.model,
          promptText: "",
          responseText: "",
          cached: false,
        }),
      }));
    }
  }

  async generateSemanticSearchQuery(userQuery: string): Promise<{
    enhancedQuery: string;
    searchTerms: string[];
    intent: "search" | "navigation" | "action" | "question";
    confidence: number;
  }> {
    const cacheKey = this.createCacheKey("search-query", { userQuery });

    if (this.config.costOptimization.enableCaching) {
      const cached = await this.cache.get<{
        enhancedQuery: string;
        searchTerms: string[];
        intent: "search" | "navigation" | "action" | "question";
        confidence: number;
      }>(cacheKey);
      if (cached) return cached;
    }

    try {
      const client = await this.getClient();

      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a search query optimization expert. Enhance user queries for better semantic search results. Return JSON only.",
          },
          {
            role: "user",
            content: `Enhance this search query for semantic search: "${userQuery}"

            Return JSON with:
            - enhancedQuery: improved query for vector search
            - searchTerms: array of key terms
            - intent: one of 'search', 'navigation', 'action', 'question'
            - confidence: 0-1 confidence score`,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error("No response from OpenAI");

      const result = JSON.parse(content);

      if (this.config.costOptimization.enableCaching) {
        await this.cache.set(cacheKey, result, this.config.redis.ttl);
      }

      return result;
    } catch (error) {
      return this.errorHandler.handleWithFallback(error, () => ({
        enhancedQuery: userQuery,
        searchTerms: userQuery
          .split(" ")
          .filter((term: any) => term.length > 2),
        intent: "search" as const,
        confidence: 0.5,
      }));
    }
  }

  async generateContentSummary(
    content: string,
    maxLength: number = 200
  ): Promise<string> {
    const cacheKey = this.createCacheKey("content-summary", {
      content,
      maxLength,
    });

    if (this.config.costOptimization.enableCaching) {
      const cached = await this.cache.get<string>(cacheKey);
      if (cached) return cached;
    }

    try {
      const client = await this.getClient();

      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Summarize content in ${maxLength} characters or less. Be concise and capture key points.`,
          },
          {
            role: "user",
            content: content,
          },
        ],
        temperature: 0.5,
        max_tokens: Math.ceil(maxLength / 4),
      });

      const summary =
        response.choices[0]?.message?.content ||
        content.substring(0, maxLength);

      if (this.config.costOptimization.enableCaching) {
        await this.cache.set(cacheKey, summary, this.config.redis.ttl);
      }

      return summary;
    } catch (error) {
      return this.errorHandler.handleWithFallback(
        error,
        () =>
          content.substring(0, maxLength) +
          (content.length > maxLength ? "..." : "")
      );
    }
  }

  async generateCodeCompletion(
    code: string,
    language: string,
    context?: string
  ): Promise<string> {
    try {
      const client = await this.getClient();

      const response = await client.chat.completions.create({
        model: this.config.openai.model,
        messages: [
          {
            role: "system",
            content: `You are a ${language} code expert. Complete the code based on context and best practices.`,
          },
          {
            role: "user",
            content: `${context ? `Context: ${context}\n\n` : ""}Complete this ${language} code:\n\n${code}`,
          },
        ],
        temperature: 0.3,
        max_tokens: this.config.openai.maxTokens,
      });

      return response.choices[0]?.message?.content || code;
    } catch (error) {
      return this.errorHandler.handleWithFallback(error, () => code);
    }
  }

  private buildFormSuggestionPrompt(
    formContext: string,
    existingFields: FieldSuggestion[]
  ): string {
    const existingFieldsStr =
      existingFields.length > 0
        ? `\n\nExisting fields:\n${JSON.stringify(existingFields, null, 2)}`
        : "";

    return `Design form fields for: ${formContext}${existingFieldsStr}

    Requirements:
    1. Suggest appropriate field types based on context
    2. Include validation rules for data integrity
    3. Add helpful placeholders and labels
    4. Consider user experience and accessibility
    5. For select/radio fields, include relevant options
    6. Mark fields as required based on importance

    Return a JSON object with a "fields" array containing field suggestions.
    Each field should follow this structure:
    {
      "fieldName": "unique_field_name",
      "fieldType": "text|email|password|number|date|select|checkbox|radio|textarea|file",
      "label": "User-friendly label",
      "placeholder": "Optional placeholder text",
      "required": true/false,
      "validation": {
        "minLength": number (optional),
        "maxLength": number (optional),
        "pattern": "regex pattern" (optional),
        "customMessage": "validation error message" (optional)
      },
      "options": [{"value": "val", "label": "Label"}] (for select/radio only)
    }`;
  }

  private shouldUseCheaperModel(context: string): boolean {
    const simpleKeywords = [
      "login",
      "signup",
      "contact",
      "newsletter",
      "feedback",
    ];
    const complexity = context.split(" ").length / 10;

    return (
      this.config.costOptimization.useCheaperModelsThreshold > 0.5 &&
      (simpleKeywords.some((keyword) =>
        context.toLowerCase().includes(keyword)
      ) ||
        complexity < this.config.costOptimization.useCheaperModelsThreshold)
    );
  }

  private createUsageMetadata(options: {
    feature: string;
    model: AIConfig["openai"]["model"];
    promptText: string;
    responseText: string;
    cached: boolean;
  }): AIUsageMetadata {
    const promptTokensEstimate = options.cached
      ? 0
      : this.estimateTokens(options.promptText);
    const completionTokensEstimate = options.cached
      ? 0
      : this.estimateTokens(options.responseText);

    return {
      provider: "openai",
      feature: options.feature,
      model: options.model,
      promptTokensEstimate,
      completionTokensEstimate,
      cached: options.cached,
      estimatedCostUsd: this.estimateCostUsd(
        options.model,
        promptTokensEstimate,
        completionTokensEstimate
      ),
    };
  }

  private estimateTokens(text: string): number {
    if (!text) return 0;
    return Math.max(1, Math.ceil(text.length / 4));
  }

  private estimateCostUsd(
    model: AIConfig["openai"]["model"],
    promptTokens: number,
    completionTokens: number
  ): number {
    if (promptTokens === 0 && completionTokens === 0) return 0;

    const rates = {
      "gpt-4": { input: 0.03, output: 0.06 },
      "gpt-4-turbo": { input: 0.01, output: 0.03 },
      "gpt-3.5-turbo": { input: 0.0005, output: 0.0015 },
    };
    const rate = rates[model];
    const cost =
      (promptTokens / 1000) * rate.input +
      (completionTokens / 1000) * rate.output;

    return Number(cost.toFixed(6));
  }

  private getFallbackSuggestions(formContext: string): FieldSuggestion[] {
    const context = formContext.toLowerCase();

    if (context.includes("login")) {
      return [
        {
          fieldName: "email",
          fieldType: "email",
          label: "Email Address",
          placeholder: "Enter your email",
          required: true,
          validation: {
            pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
            customMessage: "Please enter a valid email address",
          },
        },
        {
          fieldName: "password",
          fieldType: "password",
          label: "Password",
          placeholder: "Enter your password",
          required: true,
          validation: {
            minLength: 8,
            customMessage: "Password must be at least 8 characters",
          },
        },
      ];
    }

    if (context.includes("register") || context.includes("signup")) {
      return [
        {
          fieldName: "fullName",
          fieldType: "text",
          label: "Full Name",
          placeholder: "Enter your full name",
          required: true,
          validation: {
            minLength: 2,
            maxLength: 100,
          },
        },
        {
          fieldName: "email",
          fieldType: "email",
          label: "Email Address",
          placeholder: "Enter your email",
          required: true,
          validation: {
            pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
            customMessage: "Please enter a valid email address",
          },
        },
        {
          fieldName: "password",
          fieldType: "password",
          label: "Password",
          placeholder: "Create a password",
          required: true,
          validation: {
            minLength: 8,
            pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$",
            customMessage:
              "Password must contain uppercase, lowercase, and numbers",
          },
        },
        {
          fieldName: "confirmPassword",
          fieldType: "password",
          label: "Confirm Password",
          placeholder: "Re-enter your password",
          required: true,
        },
      ];
    }

    return [
      {
        fieldName: "name",
        fieldType: "text",
        label: "Name",
        placeholder: "Enter name",
        required: true,
      },
      {
        fieldName: "email",
        fieldType: "email",
        label: "Email",
        placeholder: "Enter email",
        required: true,
      },
    ];
  }

  private createCacheKey(prefix: string, payload: unknown): string {
    const digest = createHash("sha256")
      .update(JSON.stringify(payload))
      .digest("hex");

    return `${prefix}:${digest}`;
  }
}
