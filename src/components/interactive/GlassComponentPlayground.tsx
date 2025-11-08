'use client';
import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { OptimizedGlass } from "../../primitives";

export interface ComponentExample {
  id: string;
  name: string;
  description?: string;
  category: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  code?: string;
}

export interface PlaygroundTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface GlassComponentPlaygroundProps {
  /** Available component examples */
  examples: ComponentExample[];
  /** Default selected example */
  defaultExample?: string;
  /** Whether to show code panel */
  showCode?: boolean;
  /** Whether to show props panel */
  showProps?: boolean;
  /** Custom tabs */
  customTabs?: PlaygroundTab[];
  /** Custom className */
  className?: string;
  /** Theme for the playground */
  theme?: "light" | "dark" | "auto";
  /** Code editor theme */
  codeTheme?: "light" | "dark";
}

export const GlassComponentPlayground: React.FC<
  GlassComponentPlaygroundProps
> = ({
  examples,
  defaultExample,
  showCode = true,
  showProps = true,
  customTabs = [],
  className = "",
  theme = "dark",
  codeTheme = "dark",
}) => {
  const [selectedExample, setSelectedExample] = useState<string>(
    defaultExample || examples[0]?.id || ""
  );
  const [activeTab, setActiveTab] = useState<
    "preview" | "code" | "props" | string
  >("preview");
  const [componentProps, setComponentProps] = useState<Record<string, any>>({});
  const [componentCode, setComponentCode] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Group examples by category
  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(examples.map((ex: any) => ex.category))
    );
    setCategories(uniqueCategories);
  }, [examples]);

  // Update component props and code when example changes
  useEffect(() => {
    const example = examples.find((ex) => ex.id === selectedExample);
    if (example) {
      setComponentProps(example.props || {});
      setComponentCode(
        example.code ||
          generateCodeFromProps(example.component, example.props || {})
      );
    }
  }, [selectedExample, examples]);

  // Generate code from component and props
  const generateCodeFromProps = useCallback(
    (
      component: React.ComponentType<any>,
      props: Record<string, any>
    ): string => {
      const componentName =
        component.displayName || component.name || "Component";
      const propsString = Object.entries(props)
        .map(([key, value]) => {
          if (typeof value === "string") {
            return `${key}="${value}"`;
          } else if (typeof value === "boolean") {
            return value ? key : `${key}={false}`;
          } else if (typeof value === "number") {
            return `${key}={${value}}`;
          } else if (Array.isArray(value)) {
            return `${key}={${JSON.stringify(value)}}`;
          } else if (typeof value === "object") {
            return `${key}={${JSON.stringify(value, null, 2)}}`;
          }
          return `${key}={${String(value)}}`;
        })
        .join("\n  ");

      return `<${componentName}${propsString ? `\n  ${propsString}` : ""}\n/>`;
    },
    []
  );

  // Handle prop change
  const handlePropChange = useCallback(
    (propName: string, value: any) => {
      setComponentProps((prev: any) => ({
        ...prev,
        [propName]: value,
      }));

      const example = examples.find((ex) => ex.id === selectedExample);
      if (example) {
        const newCode = generateCodeFromProps(example.component, {
          ...componentProps,
          [propName]: value,
        });
        setComponentCode(newCode);
      }
    },
    [componentProps, selectedExample, examples, generateCodeFromProps]
  );

  // Filter examples by category
  const filteredExamples =
    selectedCategory === "all"
      ? examples
      : examples.filter((ex: any) => ex.category === selectedCategory);

  const currentExample = examples.find((ex) => ex.id === selectedExample);

  // Render prop editor
  const renderPropEditor = () => {
    if (!showProps || !currentExample) return null;

    const propKeys = Object.keys(componentProps);

    return (
      <div data-glass-component className="glass-gap-4">
        <h4 className="glass-text-sm font-semibold text-primary mb-3">
          Component Props
        </h4>

        {propKeys.length === 0 ? (
          <p className="glass-text-sm text-primary/50">
            No editable props available
          </p>
        ) : (
          propKeys.map((propName: any) => {
            const value = componentProps[propName];
            const valueType = typeof value;

            return (
              <div key={propName} className="glass-gap-2">
                <label className="block glass-text-sm text-primary/70">
                  {propName} ({valueType})
                </label>

                {valueType === "string" && (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handlePropChange(propName, e.target.value)}
                    className="glass-w-full glass-px-3 glass-py-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-md text-primary placeholder-white/50 focus:outline-none focus:border-white/40 glass-focus glass-touch-target glass-contrast-guard"
                  />
                )}

                {valueType === "number" && (
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      handlePropChange(propName, Number(e.target.value))
                    }
                    className="glass-w-full glass-px-3 glass-py-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-md text-primary placeholder-white/50 focus:outline-none focus:border-white/40 glass-focus glass-touch-target glass-contrast-guard"
                  />
                )}

                {valueType === "boolean" && (
                  <label className="glass-flex glass-items-center glass-gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        handlePropChange(propName, e.target.checked)
                      }
                      className="glass-radius-md glass-border-white/20 text-primary focus:ring-blue-500 glass-focus glass-touch-target glass-contrast-guard"
                    />
                    <span className="glass-text-sm text-primary/70">
                      {value ? "True" : "False"}
                    </span>
                  </label>
                )}

                {(valueType === "object" || Array.isArray(value)) && (
                  <textarea
                    value={JSON.stringify(value, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        handlePropChange(propName, parsed);
                      } catch (err) {
                        // Invalid JSON, don't update
                      }
                    }}
                    rows={4}
                    className="glass-w-full glass-px-3 glass-py-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-md text-primary placeholder-white/50 focus:outline-none focus:border-white/40 font-mono glass-text-sm"
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    );
  };

  return (
    <OptimizedGlass
      className={`flex flex-col h-full ${className}`}
      intent="neutral"
      elevation="level1"
    >
      {/* Header */}
      <div className="glass-flex glass-items-center glass-justify-between glass-p-4 glass-border-b glass-border-white/10">
        <h2 className="glass-text-xl font-semibold text-primary">
          Component Playground
        </h2>

        <div className="glass-flex glass-items-center glass-gap-4">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="glass-px-3 glass-py-2 glass-surface-subtle/10 glass-border glass-border-white/20 glass-radius-md text-primary focus:outline-none focus:border-white/40 glass-focus glass-touch-target glass-contrast-guard"
          >
            <option value="all">All Categories</option>
            {categories.map((category: any) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="glass-flex glass-flex-1 overflow-hidden">
        {/* Sidebar - Component List */}
        <div className="w-64 glass-border-r glass-border-white/10 glass-p-4 overflow-y-auto">
          <h3 className="glass-text-sm font-semibold text-primary mb-4">
            Components
          </h3>

          <div className="glass-gap-2">
            {filteredExamples.map((example: any) => (
              <button
                key={example.id}
                onClick={(e) => setSelectedExample(example.id)}
                className={`w-full text-left glass-p-3 glass-radius-md transition-colors glass-focus glass-touch-target glass-contrast-guard ${
                  selectedExample === example.id
                    ? "bg-white/20 glass-text-primary"
                    : "glass-text-primary/70 hover:glass-text-primary hover:bg-white/10"
                }`}
              >
                <div className="font-medium glass-text-sm">{example.name}</div>
                {example.description && (
                  <div className="glass-text-xs opacity-70 glass-mt-1">
                    {example.description}
                  </div>
                )}
                <div className="glass-text-xs opacity-50 glass-mt-1 capitalize">
                  {example.category}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="glass-flex-1 glass-flex glass-flex-col">
          {/* Tabs */}
          <div className="glass-flex glass-border-b glass-border-white/10">
            <button
              onClick={(e) => setActiveTab("preview")}
              className={`glass-px-4 glass-py-3 glass-text-sm font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard ${
                activeTab === "preview"
                  ? "glass-text-primary border-b-2 border-blue-400"
                  : "glass-text-primary/70 hover:glass-text-primary"
              }`}
            >
              Preview
            </button>

            {showCode && (
              <button
                onClick={(e) => setActiveTab("code")}
                className={`glass-px-4 glass-py-3 glass-text-sm font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard ${
                  activeTab === "code"
                    ? "glass-text-primary border-b-2 border-blue-400"
                    : "glass-text-primary/70 hover:glass-text-primary"
                }`}
              >
                Code
              </button>
            )}

            {showProps && (
              <button
                onClick={(e) => setActiveTab("props")}
                className={`glass-px-4 glass-py-3 glass-text-sm font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard ${
                  activeTab === "props"
                    ? "glass-text-primary border-b-2 border-blue-400"
                    : "glass-text-primary/70 hover:glass-text-primary"
                }`}
              >
                Props
              </button>
            )}

            {/* Custom Tabs */}
            {customTabs.map((tab: any) => (
              <button
                key={tab.id}
                onClick={(e) => setActiveTab(tab.id)}
                className={`glass-px-4 glass-py-3 glass-text-sm font-medium transition-colors glass-focus glass-touch-target glass-contrast-guard ${
                  activeTab === tab.id
                    ? "glass-text-primary border-b-2 border-blue-400"
                    : "glass-text-primary/70 hover:glass-text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="glass-flex-1 overflow-hidden">
            {/* Preview Tab */}
            {activeTab === "preview" && (
              <div className="glass-h-full glass-p-6 overflow-auto">
                <div className="max-w-4xl glass-mx-auto">
                  {currentExample ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="glass-text-lg font-semibold text-primary mb-2">
                          {currentExample.name}
                        </h3>
                        {currentExample.description && (
                          <p className="text-primary/70">
                            {currentExample.description}
                          </p>
                        )}
                      </div>

                      {/* Component Preview */}
                      <OptimizedGlass
                        className="glass-p-6 glass-min-h-64 glass-flex glass-items-center glass-justify-center"
                        blur="subtle"
                        elevation="level1"
                      >
                        <currentExample.component {...componentProps} />
                      </OptimizedGlass>
                    </div>
                  ) : (
                    <div className="glass-flex glass-items-center glass-justify-center h-64 text-primary/50">
                      Select a component to preview
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Code Tab */}
            {activeTab === "code" && showCode && (
              <div className="glass-h-full glass-p-6 overflow-auto">
                <div className="glass-gap-4">
                  <div className="glass-flex glass-items-center glass-justify-between">
                    <h3 className="glass-text-lg font-semibold text-primary">
                      Generated Code
                    </h3>
                    <button
                      onClick={(e) =>
                        navigator.clipboard?.writeText(componentCode)
                      }
                      className="glass-px-3 glass-py-1 glass-text-sm glass-surface-subtle/10 hover:glass-surface-subtle/20 glass-radius-md transition-colors glass-focus glass-touch-target glass-contrast-guard"
                    >
                      Copy
                    </button>
                  </div>

                  <pre className="glass-p-4 glass-surface-dark/20 glass-radius-md overflow-x-auto">
                    <code className="glass-text-sm text-primary font-mono whitespace-pre-wrap">
                      {componentCode}
                    </code>
                  </pre>
                </div>
              </div>
            )}

            {/* Props Tab */}
            {activeTab === "props" && showProps && (
              <div className="glass-h-full glass-p-6 overflow-y-auto">
                {renderPropEditor()}
              </div>
            )}

            {/* Custom Tab Content */}
            {customTabs.map((tab: any) =>
              activeTab === tab.id ? (
                <div
                  key={tab.id}
                  className="glass-h-full glass-p-6 overflow-auto"
                >
                  {tab.content}
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
    </OptimizedGlass>
  );
};

// Utility hook for creating playground examples
export const usePlaygroundExample = (
  component: React.ComponentType<any>,
  defaultProps: Record<string, any> = {}
) => {
  const [props, setProps] = useState(defaultProps);

  const updateProp = useCallback((propName: string, value: any) => {
    setProps((prev: any) => ({
      ...prev,
      [propName]: value,
    }));
  }, []);

  const resetProps = useCallback(() => {
    setProps(defaultProps);
  }, [defaultProps]);

  return {
    props,
    updateProp,
    resetProps,
    component,
  };
};

// Example usage helper
export const createPlaygroundExample = (
  id: string,
  name: string,
  component: React.ComponentType<any>,
  options: {
    category?: string;
    description?: string;
    defaultProps?: Record<string, any>;
  } = {}
): ComponentExample => {
  const { category = "general", description, defaultProps = {} } = options;

  return {
    id,
    name,
    description,
    category,
    component,
    props: defaultProps,
  };
};