type ChatCompletionResult = {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
};

const buildFormSuggestions = (): ChatCompletionResult => ({
  choices: [
    {
      message: {
        content: JSON.stringify({
          fields: [
            {
              fieldName: "email",
              fieldType: "email",
              label: "Email Address",
              required: true,
              validation: {
                pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
              },
            },
            {
              fieldName: "password",
              fieldType: "password",
              label: "Password",
              required: true,
              validation: {
                minLength: 8,
              },
            },
            {
              fieldName: "name",
              fieldType: "text",
              label: "Full Name",
              required: false,
            },
          ],
        }),
      },
    },
  ],
});

const buildSemanticQuery = (userPrompt?: string): ChatCompletionResult => {
  const queryMatch = userPrompt?.match(/"(.+?)"/);
  const query = queryMatch ? queryMatch[1] : "";
  const terms = query
    .split(/[^a-z0-9]+/i)
    .filter((term) => term.length > 0);

  return {
    choices: [
      {
        message: {
          content: JSON.stringify({
            enhancedQuery: query ? `${query} refined` : "",
            searchTerms: terms,
            intent: "search",
            confidence: 0.9,
          }),
        },
      },
    ],
  };
};

const buildSummary = (content?: string, maxLength = 200): ChatCompletionResult => {
  const summary = (content || "").slice(0, maxLength);

  return {
    choices: [
      {
        message: {
          content: summary,
        },
      },
    ],
  };
};

class MockOpenAI {
  public chat: {
    completions: {
      create: (options: { messages?: Array<{ role: string; content: string }>; max_tokens?: number }) => Promise<ChatCompletionResult>;
    };
  };

  public embeddings: {
    create: ({ input }: { input: string }) => Promise<{ data: Array<{ embedding: number[] }> }>;
  };

  constructor(_config: Record<string, unknown>) {
    this.chat = {
      completions: {
        create: async (options) => {
          const userMessage = options.messages?.find((msg) => msg.role === "user");
          const content = userMessage?.content ?? "";

          if (content.includes("Enhance this search query")) {
            return buildSemanticQuery(content);
          }

          if (content.includes("Design form fields for")) {
            return buildFormSuggestions();
          }

          return buildSummary(content, options.max_tokens ? options.max_tokens * 4 : 200);
        },
      },
    };

    this.embeddings = {
      create: async () => ({
        data: [
          {
            embedding: Array.from({ length: 1536 }, (_, index) => (index % 2 === 0 ? 0.1 : 0.2)),
          },
        ],
      }),
    };
  }
}

export default MockOpenAI;
