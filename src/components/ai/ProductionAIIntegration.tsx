'use client';
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { OpenAIService } from "../../services/ai/openai-service";
import { SemanticSearchService } from "../../services/ai/semantic-search-service";
import { VisionService } from "../../services/ai/vision-service";
import { CollaborationService } from "../../services/websocket/collaboration-service";
import { AuthService } from "../../services/auth/auth-service";
import { defaultAIConfig } from "../../services/ai/config";
import * as Sentry from "@sentry/react";
import { cn } from "../../lib/utilsComprehensive";

interface ProductionAIIntegrationProps extends React.HTMLAttributes<HTMLDivElement> {
  authToken?: string;
  userId?: string;
  'data-testid'?: string;
}

export const ProductionAIIntegration: React.FC<
  ProductionAIIntegrationProps
> = ({ authToken, userId, className, 'data-testid': dataTestId, ...props }) => {
  const prefersReducedMotion = useReducedMotion();
  const [isInitialized, setIsInitialized] = useState(false);
  const [formFields, setFormFields] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [imageAnalysis, setImageAnalysis] = useState<any>(null);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openAIService = useRef<OpenAIService>();
  const searchService = useRef<SemanticSearchService>();
  const visionService = useRef<VisionService>();
  const collaborationService = useRef<CollaborationService>();
  const authService = useRef<AuthService>();

  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = async () => {
    try {
      setLoading(true);

      openAIService.current = new OpenAIService(defaultAIConfig);
      searchService.current = new SemanticSearchService(defaultAIConfig);
      visionService.current = new VisionService(defaultAIConfig);
      authService.current = new AuthService();

      await searchService.current.initialize();

      if (authToken) {
        collaborationService.current = new CollaborationService(
          process.env.REACT_APP_WEBSOCKET_URL || "ws://localhost:3001",
          authToken
        );
        await collaborationService.current.connect();

        collaborationService.current.on("user-joined", (user) => {
          setCollaborators((prev: any) => [...prev, user]);
        });

        collaborationService.current.on("user-left", (userId) => {
          setCollaborators((prev: any) =>
            prev.filter((c: any) => c.userId !== userId)
          );
        });
      }

      setIsInitialized(true);
    } catch (error) {
      Sentry.captureException(error);
      setError("Failed to initialize AI services");
    } finally {
      setLoading(false);
    }
  };

  const generateSmartForm = useCallback(
    async (context: string) => {
      if (!openAIService.current) return;

      try {
        setLoading(true);
        setError(null);

        const suggestions =
          await openAIService.current.generateFormFieldSuggestions(
            context,
            formFields
          );

        setFormFields(suggestions);

        Sentry.addBreadcrumb({
          category: "ai",
          message: "Generated form fields",
          level: "info",
          data: { context, fieldCount: suggestions.length },
        });
      } catch (error) {
        Sentry.captureException(error);
        setError("Failed to generate form fields");
      } finally {
        setLoading(false);
      }
    },
    [formFields]
  );

  const performSemanticSearch = useCallback(async (query: string) => {
    if (!searchService.current || !openAIService.current) return;

    try {
      setLoading(true);
      setError(null);

      const { enhancedQuery, intent } =
        await openAIService.current.generateSemanticSearchQuery(query);

      const results = await searchService.current.hybridSearch(enhancedQuery, {
        semanticWeight: intent === "search" ? 0.8 : 0.6,
        keywordWeight: intent === "navigation" ? 0.4 : 0.2,
        topK: 10,
      });

      setSearchResults(results);

      Sentry.addBreadcrumb({
        category: "search",
        message: "Performed semantic search",
        level: "info",
        data: { query, intent, resultCount: results.length },
      });
    } catch (error) {
      Sentry.captureException(error);
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeImage = useCallback(async (file: File) => {
    if (!visionService.current) return;

    try {
      setLoading(true);
      setError(null);

      const buffer = await file.arrayBuffer();
      const imageBuffer = Buffer.from(buffer);

      const [faces, objects, text, analysis] = await Promise.all([
        visionService.current.detectFaces(imageBuffer),
        visionService.current.detectObjects(imageBuffer),
        visionService.current.extractText(imageBuffer),
        visionService.current.analyzeImage(imageBuffer),
      ]);

      const result = {
        faces,
        objects,
        text,
        ...analysis,
        fileName: file.name,
        fileSize: file.size,
      };

      setImageAnalysis(result);

      Sentry.addBreadcrumb({
        category: "vision",
        message: "Analyzed image",
        level: "info",
        data: {
          fileName: file.name,
          faceCount: faces.length,
          objectCount: objects.length,
        },
      });
    } catch (error) {
      Sentry.captureException(error);
      setError("Image analysis failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const removeImageBackground = useCallback(async (file: File) => {
    if (!visionService.current) return null;

    try {
      setLoading(true);
      setError(null);

      const buffer = await file.arrayBuffer();
      const imageBuffer = Buffer.from(buffer);

      const processedBuffer =
        await visionService.current.removeBackground(imageBuffer);

      // Convert Node Buffer to a Blob-compatible type for browsers
      const blob = new Blob([new Uint8Array(processedBuffer)], {
        type: "image/png",
      });
      const url = URL.createObjectURL(blob);

      return url;
    } catch (error) {
      Sentry.captureException(error);
      setError("Background removal failed");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const joinCollaborationRoom = useCallback(async (roomId: string) => {
    if (!collaborationService.current) return;

    try {
      await collaborationService.current.joinRoom(roomId);

      collaborationService.current.on("document-changed", (operation) => {
        console.log("Document changed:", operation);
      });

      collaborationService.current.on("cursor-moved", (cursor) => {
        console.log("Cursor moved:", cursor);
      });

      const participants = collaborationService.current.getRoomParticipants();
      setCollaborators(participants);
    } catch (error) {
      Sentry.captureException(error);
      setError("Failed to join collaboration room");
    }
  }, []);

  const sendCollaborativeEdit = useCallback((edit: any) => {
    if (!collaborationService.current) return;

    collaborationService.current.sendEdit(edit);
  }, []);

  const updateCursorPosition = useCallback((x: number, y: number) => {
    if (!collaborationService.current) return;

    collaborationService.current.sendCursorPosition(x, y);
  }, []);

  const cleanup = useCallback(() => {
    if (collaborationService.current) {
      collaborationService.current.disconnect();
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  if (!isInitialized) {
    return (
      <div
        data-glass-component
        className={cn(
          "glass-flex glass-items-center glass-justify-center glass-p-8",
          className
        )}
        data-testid={dataTestId || 'productionaiintegration'}
        {...props}
      >
        <div className='text-center'>
          <div className='animate-spin glass-radius-full h-12 w-12 glass-border-b-2 glass-border-blue glass-mx-auto mb-4'></div>
          <p className="glass-text-secondary">Initializing AI services...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      data-glass-component
      className={cn('production-ai-integration glass-p-6', className)}
      data-testid={dataTestId || 'productionaiintegration'}
      {...props}
    >
      {error && (
        <div className='glass-surface-subtle glass-border glass-border-red-200 text-primary glass-px-4 glass-py-3 glass-radius mb-4 glass-contrast-guard'>
          {error}
        </div>
      )}

      <div className='glass-grid glass-grid-cols-1 md:grid-cols-2 glass-gap-6'>
        <div className="glass-surface-subtle glass-radius-lg glass-shadow glass-p-6 glass-contrast-guard">
          <h2 className='glass-text-xl font-bold mb-4'>Smart Form Builder</h2>
          <input
            type="text"
            placeholder="Describe your form (e.g., 'user registration')"
            className='glass-w-full glass-px-4 glass-py-2 glass-border glass-radius mb-4 glass-touch-target glass-contrast-guard'
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                generateSmartForm((e.target as HTMLInputElement).value);
              }
            }}
          />
          {formFields.length > 0 && (
            <div className='space-y-2'>
              {formFields.map((field, idx) => (
                <div
                  key={idx}
                  className="glass-p-3 glass-surface-subtle glass-radius glass-contrast-guard"
                >
                  <span className='font-medium'>{field.label}</span>
                  <span className='glass-text-sm glass-text-secondary ml-2'>
                    ({field.fieldType})
                  </span>
                  {field.required && (
                    <span className='text-primary ml-1'>*</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-surface-subtle glass-radius-lg glass-shadow glass-p-6 glass-contrast-guard">
          <h2 className='glass-text-xl font-bold mb-4'>Semantic Search</h2>
          <input
            type="text"
            placeholder="Search anything..."
            className='glass-w-full glass-px-4 glass-py-2 glass-border glass-radius mb-4 glass-touch-target glass-contrast-guard'
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                performSemanticSearch((e.target as HTMLInputElement).value);
              }
            }}
          />
          {searchResults.length > 0 && (
            <div className='space-y-2 glass-max-h-64 overflow-y-auto'>
              {searchResults.map((result, idx) => (
                <div
                  key={idx}
                  className="glass-p-3 glass-surface-subtle glass-radius glass-contrast-guard"
                >
                  <div className='font-medium'>
                    {result.content.substring(0, 100)}...
                  </div>
                  <div className="glass-text-sm glass-text-secondary">
                    Score: {result.score.toFixed(3)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-surface-subtle glass-radius-lg glass-shadow glass-p-6 glass-contrast-guard">
          <h2 className='glass-text-xl font-bold mb-4'>Image Analysis</h2>
          <input
            type="file"
            accept="image/*"
            className='mb-4 glass-touch-target glass-contrast-guard'
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) analyzeImage(file);
            }}
          />
          {imageAnalysis && (
            <div className='space-y-2 glass-text-sm'>
              <div>Faces detected: {imageAnalysis.faces?.length || 0}</div>
              <div>Objects detected: {imageAnalysis.objects?.length || 0}</div>
              <div>
                Text extracted:{" "}
                {imageAnalysis.text?.text?.substring(0, 50) || "None"}...
              </div>
              <div>
                Labels:{" "}
                {imageAnalysis.labels
                  ?.map((l: any) => l.description)
                  .join(", ")}
              </div>
            </div>
          )}
        </div>

        <div className="glass-surface-subtle glass-radius-lg glass-shadow glass-p-6 glass-contrast-guard">
          <h2 className='glass-text-xl font-bold mb-4'>Collaboration</h2>
          <div className='mb-4'>
            <input
              type="text"
              placeholder="Room ID"
              className='glass-w-full glass-px-4 glass-py-2 glass-border glass-radius mb-2 glass-touch-target glass-contrast-guard'
              id="roomId"
            />
            <button
              onClick={() => {
                const input = document.getElementById(
                  "roomId"
                ) as HTMLInputElement;
                if (input?.value) joinCollaborationRoom(input.value);
              }}
              className='glass-px-4 glass-py-2 glass-surface-blue text-primary glass-radius hover:glass-surface-blue glass-focus glass-touch-target glass-contrast-guard'
            >
              Join Room
            </button>
          </div>
          {collaborators.length > 0 && (
            <div className='space-y-1'>
              <div className='font-medium'>Active Collaborators:</div>
              {collaborators.map((collab, idx) => (
                <div
                  key={idx}
                  className="glass-flex glass-items-center glass-gap-2"
                >
                  <div className='w-2 h-2 glass-surface-green glass-radius-full glass-contrast-guard'></div>
                  <span className="glass-text-sm">{collab.userName}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className='fixed inset-0 glass-surface-dark glass-opacity-50 glass-flex glass-items-center glass-justify-center z-50 glass-contrast-guard'>
          <div className="glass-surface-subtle glass-radius-lg glass-p-6 glass-contrast-guard">
            <div className='animate-spin glass-radius-full h-12 w-12 glass-border-b-2 glass-border-blue glass-mx-auto'></div>
            <p className='mt-4'>Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sentry.withProfiler(ProductionAIIntegration);