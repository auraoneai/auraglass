/**
 * AI Demo Component
 *
 * Complete example showing how to use all AuraGlass AI features.
 * Replace the simulated components with this real implementation.
 */

import React, { useState } from "react";
import { aiClient } from "../../../lib/ai-client";
import type {
  FormFieldSuggestion,
  SearchResult,
  ImageAnalysis,
} from "../../../lib/ai-client";
import { OptimizedGlass } from "../../../primitives";
import { cn } from "../../../lib/utilsComprehensive";

export const AIDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "forms" | "search" | "images" | "auth"
  >("forms");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Authentication state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Form generation state
  const [formContext, setFormContext] = useState("user registration form");
  const [generatedFields, setGeneratedFields] = useState<FormFieldSuggestion[]>(
    []
  );

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [enhancedQuery, setEnhancedQuery] = useState("");

  // Image analysis state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysis | null>(
    null
  );

  // ============================================
  // Authentication Handlers
  // ============================================

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await aiClient.login(email, password);
      setIsAuthenticated(true);
      console.log("Logged in as:", result.user);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await aiClient.register(email, password);
      setIsAuthenticated(true);
      console.log("Registered:", result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await aiClient.logout();
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
  };

  // ============================================
  // AI Feature Handlers
  // ============================================

  const handleGenerateForm = async () => {
    setLoading(true);
    setError(null);

    try {
      const fields = await aiClient.generateFormFields(
        formContext,
        generatedFields
      );
      setGeneratedFields(fields);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await aiClient.search(searchQuery, { limit: 10 });
      setSearchResults(result.results);
      setEnhancedQuery(result.enhancedQuery);
      console.log("Detected intent:", result.intent);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        setSelectedImage(base64);

        // Analyze image
        const analysis = await aiClient.analyzeImage(base64, ["all"]);
        setImageAnalysis(analysis);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  const handleRemoveBackground = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      const processedImage = await aiClient.removeBackground(selectedImage);
      setSelectedImage(processedImage);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Render Components
  // ============================================

  const renderAuthTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="glass-text-lg font-semibold text-primary/90 mb-4">
          {isAuthenticated ? "✓ Authenticated" : "Authentication Required"}
        </h3>

        {!isAuthenticated ? (
          <div className="space-y-4">
            <div>
              <label className="block glass-text-sm font-medium text-primary/80 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="glass-w-full glass-px-4 glass-py-2 glass-border glass-border-white/20 glass-radius-lg glass-surface-subtle/5 text-primary glass-focus glass-touch-target glass-contrast-guard"
              />
            </div>

            <div>
              <label className="block glass-text-sm font-medium text-primary/80 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="glass-w-full glass-px-4 glass-py-2 glass-border glass-border-white/20 glass-radius-lg glass-surface-subtle/5 text-primary glass-focus glass-touch-target glass-contrast-guard"
              />
            </div>

            <div className="glass-flex glass-gap-3">
              <button
                onClick={handleLogin}
                disabled={loading || !email || !password}
                className="glass-flex-1 glass-px-4 glass-py-2 glass-surface-blue text-primary glass-radius-lg hover:opacity-90 disabled:opacity-50 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <button
                onClick={handleRegister}
                disabled={loading || !email || !password}
                className="glass-flex-1 glass-px-4 glass-py-2 glass-border glass-border-white/30 text-primary glass-radius-lg hover:bg-white/5 disabled:opacity-50 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-primary/70">
              You are logged in as: <strong>{email}</strong>
            </p>
            <button
              onClick={handleLogout}
              className="glass-px-4 glass-py-2 glass-border glass-border-red-500/30 text-red-400 glass-radius-lg hover:bg-red-500/10 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderFormsTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block glass-text-sm font-medium text-primary/80 mb-2">
          Form Context (describe your form)
        </label>
        <input
          type="text"
          value={formContext}
          onChange={(e) => setFormContext(e.target.value)}
          placeholder="e.g., 'user registration form', 'contact form', 'payment form'"
          className="glass-w-full glass-px-4 glass-py-2 glass-border glass-border-white/20 glass-radius-lg glass-surface-subtle/5 text-primary glass-focus glass-touch-target glass-contrast-guard"
        />
      </div>

      <button
        onClick={handleGenerateForm}
        disabled={loading || !formContext}
        className="glass-w-full glass-px-6 glass-py-3 glass-surface-blue text-primary glass-radius-lg hover:opacity-90 disabled:opacity-50 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
      >
        {loading ? "Generating with GPT-4..." : "🤖 Generate Smart Form Fields"}
      </button>

      {generatedFields.length > 0 && (
        <div className="space-y-3">
          <h4 className="glass-text-sm font-medium text-primary/80">
            Generated Fields:
          </h4>
          {generatedFields.map((field, index) => (
            <div
              key={index}
              className="glass-p-4 glass-surface-subtle/10 glass-border glass-border-white/10 glass-radius-lg"
            >
              <div className="glass-flex glass-items-center glass-justify-between mb-2">
                <span className="font-medium text-primary/90">
                  {field.label}
                </span>
                <span className="glass-text-xs glass-px-2 glass-py-1 glass-surface-subtle/20 glass-radius">
                  {field.fieldType}
                </span>
              </div>
              <p className="glass-text-sm text-primary/60 mb-2">
                {field.placeholder}
              </p>
              {field.required && (
                <span className="glass-text-xs text-red-400">* Required</span>
              )}
              {field.validation && (
                <div className="glass-text-xs text-primary/50 mt-2">
                  Validation: {JSON.stringify(field.validation)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSearchTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block glass-text-sm font-medium text-primary/80 mb-2">
          Search Query
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search anything..."
          className="glass-w-full glass-px-4 glass-py-2 glass-border glass-border-white/20 glass-radius-lg glass-surface-subtle/5 text-primary glass-focus glass-touch-target glass-contrast-guard"
        />
      </div>

      <button
        onClick={handleSearch}
        disabled={loading || !searchQuery}
        className="glass-w-full glass-px-6 glass-py-3 glass-surface-blue text-primary glass-radius-lg hover:opacity-90 disabled:opacity-50 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
      >
        {loading ? "Searching with AI..." : "🔍 Semantic Search"}
      </button>

      {enhancedQuery && (
        <div className="glass-p-3 glass-surface-subtle/10 glass-border glass-border-blue-400/20 glass-radius-lg">
          <span className="glass-text-xs text-primary/60">Enhanced Query:</span>
          <p className="glass-text-sm text-primary/90 mt-1">{enhancedQuery}</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="space-y-3">
          <h4 className="glass-text-sm font-medium text-primary/80">
            Results ({searchResults.length}):
          </h4>
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="glass-p-4 glass-surface-subtle/10 glass-border glass-border-white/10 glass-radius-lg"
            >
              <p className="text-primary/90 mb-2">{result.content}</p>
              <div className="glass-flex glass-items-center glass-justify-between glass-text-xs text-primary/60">
                <span>Score: {result.score.toFixed(3)}</span>
                {result.highlights && result.highlights.length > 0 && (
                  <span className="text-blue-400">★ Highlighted</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderImagesTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block glass-text-sm font-medium text-primary/80 mb-2">
          Upload Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="glass-w-full glass-px-4 glass-py-2 glass-border glass-border-white/20 glass-radius-lg glass-surface-subtle/5 text-primary file:mr-4 file:py-2 file:px-4 file:glass-radius file:border-0 file:glass-surface-blue file:text-primary glass-touch-target glass-contrast-guard"
        />
      </div>

      {selectedImage && (
        <>
          <div className="aspect-square glass-surface-subtle/5 glass-border glass-border-white/20 glass-radius-lg overflow-hidden">
            <img
              src={selectedImage}
              alt="Uploaded"
              className="glass-w-full glass-h-full object-cover"
            />
          </div>

          <button
            onClick={handleRemoveBackground}
            disabled={loading}
            className="glass-w-full glass-px-6 glass-py-3 glass-surface-green text-primary glass-radius-lg hover:opacity-90 disabled:opacity-50 glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard"
          >
            {loading ? "Removing Background..." : "✂️ Remove Background"}
          </button>
        </>
      )}

      {imageAnalysis && (
        <div className="space-y-3">
          <h4 className="glass-text-sm font-medium text-primary/80">
            Analysis Results:
          </h4>

          <div className="glass-grid glass-grid-cols-2 glass-gap-3">
            <div className="glass-p-3 glass-surface-subtle/10 glass-border glass-border-white/10 glass-radius-lg">
              <div className="glass-text-2xl font-bold text-primary/90">
                {imageAnalysis.faces?.length || 0}
              </div>
              <div className="glass-text-xs text-primary/60">
                Faces Detected
              </div>
            </div>

            <div className="glass-p-3 glass-surface-subtle/10 glass-border glass-border-white/10 glass-radius-lg">
              <div className="glass-text-2xl font-bold text-primary/90">
                {imageAnalysis.objects?.length || 0}
              </div>
              <div className="glass-text-xs text-primary/60">
                Objects Detected
              </div>
            </div>
          </div>

          {imageAnalysis.labels && imageAnalysis.labels.length > 0 && (
            <div className="glass-p-3 glass-surface-subtle/10 glass-border glass-border-white/10 glass-radius-lg">
              <div className="glass-text-xs text-primary/60 mb-2">Labels:</div>
              <div className="glass-flex glass-flex-wrap glass-gap-2">
                {imageAnalysis.labels.slice(0, 5).map((label, i) => (
                  <span
                    key={i}
                    className="glass-px-2 glass-py-1 glass-surface-subtle/20 glass-radius glass-text-xs text-primary/90"
                  >
                    {label.description} ({(label.score * 100).toFixed(0)}%)
                  </span>
                ))}
              </div>
            </div>
          )}

          {imageAnalysis.text && imageAnalysis.text.text && (
            <div className="glass-p-3 glass-surface-subtle/10 glass-border glass-border-white/10 glass-radius-lg">
              <div className="glass-text-xs text-primary/60 mb-2">
                Extracted Text:
              </div>
              <p className="glass-text-sm text-primary/90">
                {imageAnalysis.text.text.substring(0, 200)}...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // ============================================
  // Main Render
  // ============================================

  return (
    <div data-glass-component className="min-h-screen glass-p-6">
      <div className="max-w-4xl glass-mx-auto">
        <OptimizedGlass className="glass-p-8">
          <div className="mb-8">
            <h1 className="glass-text-3xl font-bold text-primary/90 mb-2">
              🤖 AuraGlass AI Demo
            </h1>
            <p className="text-primary/60">
              Production-ready AI features with real OpenAI, Pinecone, and
              Google Vision APIs
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 glass-p-4 glass-border glass-border-red-500/30 glass-surface-red/20 glass-radius-lg">
              <p className="text-red-400 glass-text-sm">⚠️ {error}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="glass-flex glass-gap-2 mb-6 glass-border-b glass-border-white/10 pb-4">
            {[
              { id: "auth", label: "🔐 Auth", icon: "🔐" },
              { id: "forms", label: "📝 Smart Forms", icon: "📝" },
              { id: "search", label: "🔍 Search", icon: "🔍" },
              { id: "images", label: "🖼️ Images", icon: "🖼️" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-4 py-2 glass-radius-lg transition-colors glass-focus glass-touch-target glass-contrast-guard",
                  activeTab === tab.id
                    ? "glass-surface-blue text-primary"
                    : "text-primary/60 hover:text-primary/90 hover:bg-white/5"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === "auth" && renderAuthTab()}
            {activeTab === "forms" && renderFormsTab()}
            {activeTab === "search" && renderSearchTab()}
            {activeTab === "images" && renderImagesTab()}
          </div>

          {/* Server Status */}
          <div className="mt-8 pt-6 glass-border-t glass-border-white/10">
            <div className="glass-text-xs text-primary/60">
              💡 <strong>Tip:</strong> Make sure your API server is running on
              port 3001. Run:{" "}
              <code className="glass-px-2 glass-py-1 glass-surface-subtle/20 glass-radius">
                npm run server:all
              </code>
            </div>
          </div>
        </OptimizedGlass>
      </div>
    </div>
  );
};

export default AIDemo;
