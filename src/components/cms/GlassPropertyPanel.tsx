import React, { useState, useCallback } from "react";
import { Glass } from "../../primitives";
import { cn } from "../../lib/utilsComprehensive";
import { useDragDrop, ComponentDefinition } from "./GlassDragDropProvider";

interface PropertyPanelProps {
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface PropertyInputProps {
  label: string;
  type: ComponentDefinition["editableProps"][string]["type"];
  value: any;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: any) => void;
}

const PropertyInput: React.FC<PropertyInputProps> = ({
  label,
  type,
  value,
  options,
  min,
  max,
  step,
  onChange,
}) => {
  const renderInput = () => {
    switch (type) {
      case "text":
        return (
          <input
            data-glass-component
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="glass-w-full glass-px-3 glass-py-2 glass-text-sm glass-border glass-border-subtle glass-radius-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value || 0}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(Number(e.target.value))}
            className="glass-w-full glass-px-3 glass-py-2 glass-text-sm glass-border glass-border-subtle glass-radius-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case "range":
        return (
          <div className="space-y-2">
            <input
              type="range"
              value={value || 0}
              min={min || 0}
              max={max || 100}
              step={step || 1}
              onChange={(e) => onChange(Number(e.target.value))}
              className="glass-w-full"
            />
            <div className="glass-text-xs glass-text-secondary text-center">
              {value}
            </div>
          </div>
        );

      case "color":
        return (
          <div className="glass-flex glass-items-center glass-gap-2">
            <input
              type="color"
              value={value || "var(--glass-black)"}
              onChange={(e) => onChange(e.target.value)}
              className="w-12 h-8 glass-border glass-border-subtle glass-radius cursor-pointer"
            />
            <input
              type="text"
              value={value || "var(--glass-black)"}
              onChange={(e) => onChange(e.target.value)}
              className="glass-flex-1 glass-px-3 glass-py-2 glass-text-sm glass-border glass-border-subtle glass-radius-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      case "boolean":
        return (
          <label className="glass-flex glass-items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              className="mr-2 w-4 h-4 text-primary glass-border-subtle glass-radius focus:ring-blue-500"
            />
            <span className="glass-text-sm glass-text-secondary">Enabled</span>
          </label>
        );

      case "select":
        return (
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="glass-w-full glass-px-3 glass-py-2 glass-text-sm glass-border glass-border-subtle glass-radius-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {options?.map((option: any) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "image":
        return (
          <div className="space-y-2">
            <input
              type="url"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="glass-w-full glass-px-3 glass-py-2 glass-text-sm glass-border glass-border-subtle glass-radius-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="glass-flex glass-gap-2">
              <button
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => onChange(e.target?.result);
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }}
                className="glass-px-3 glass-py-1.5 glass-text-xs glass-surface-subtle glass-text-secondary glass-radius hover:glass-surface-subtle transition-colors"
              >
                Upload
              </button>
              <button
                onClick={() => onChange("https://via.placeholder.com/400x300")}
                className="glass-px-3 glass-py-1.5 glass-text-xs glass-surface-subtle glass-text-secondary glass-radius hover:glass-surface-subtle transition-colors"
              >
                Placeholder
              </button>
            </div>
            {value && (
              <div className="mt-2">
                <img
                  src={value}
                  alt="Preview"
                  className="glass-w-full h-24 object-cover glass-radius glass-border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/400x300?text=Invalid+Image";
                  }}
                />
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="glass-text-sm glass-text-secondary italic">
            Unsupported input type: {type}
          </div>
        );
    }
  };

  return (
    <div className="space-y-2">
      <label className="block glass-text-sm font-medium glass-text-secondary">
        {label}
      </label>
      {renderInput()}
    </div>
  );
};

const ActionButton: React.FC<{
  onClick: () => void;
  icon: string;
  label: string;
  variant?: "default" | "danger";
}> = ({ onClick, icon, label, variant = "default" }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors glass-focus glass-touch-target",
      variant === "default"
        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
        : "bg-red-50 text-red-700 hover:bg-red-100"
    )}
  >
    <span>{icon}</span>
    {label}
  </button>
);

export const GlassPropertyPanel: React.FC<PropertyPanelProps> = ({
  className,
  collapsed = false,
  onToggleCollapse,
}) => {
  const {
    pageState,
    componentLibrary,
    getSelectedComponent,
    updateComponent,
    duplicateComponent,
    deleteComponent,
    copyComponent,
    pasteComponent,
  } = useDragDrop();

  const [activeSection, setActiveSection] = useState<
    "properties" | "styles" | "advanced"
  >("properties");

  const selectedComponent = getSelectedComponent();
  const componentDefinition = selectedComponent
    ? componentLibrary.find((def) => def.type === selectedComponent.type)
    : null;

  const handlePropertyChange = useCallback(
    (prop: string, value: any) => {
      if (selectedComponent) {
        updateComponent(selectedComponent.id, { [prop]: value });
      }
    },
    [selectedComponent, updateComponent]
  );

  if (collapsed) {
    return (
      <div className={cn("w-12", className)}>
        <Glass className="glass-h-full glass-contrast-guard">
          <button
            onClick={onToggleCollapse}
            className="glass-flex glass-items-center glass-justify-center glass-w-full h-12 glass-text-secondary hover:glass-text-secondary transition-colors glass-focus glass-touch-target glass-focus glass-touch-target glass-contrast-guard"
            title="Expand Property Panel"
          >
            <div className="glass-text-lg">⚙️</div>
          </button>
        </Glass>
      </div>
    );
  }

  return (
    <div className={cn("w-80 h-full flex flex-col", className)}>
      <Glass className="glass-h-full glass-flex glass-flex-col glass-contrast-guard">
        {/* Header */}
        <div className="glass-flex glass-items-center glass-justify-between glass-p-4 glass-border-b glass-border-subtle">
          <h2 className="glass-text-lg font-semibold glass-text-secondary">
            Properties
          </h2>
          <button
            onClick={onToggleCollapse}
            className="glass-p-2 glass-text-secondary hover:glass-text-secondary transition-colors glass-focus glass-touch-target glass-focus glass-touch-target glass-contrast-guard"
            title="Collapse Panel"
          >
            ▶
          </button>
        </div>

        {!selectedComponent ? (
          /* No Selection State */
          <div className="glass-flex-1 glass-flex glass-items-center glass-justify-center glass-p-6">
            <div className="text-center">
              <div className="glass-text-4xl mb-4">🎯</div>
              <h3 className="glass-text-lg font-medium glass-text-secondary mb-2">
                No Component Selected
              </h3>
              <p className="glass-text-secondary glass-text-sm">
                Click on a component in the canvas to edit its properties.
              </p>
            </div>
          </div>
        ) : (
          <div className="glass-flex-1 glass-flex glass-flex-col overflow-hidden">
            {/* Component Info */}
            <div className="glass-p-4 glass-surface-subtle glass-border-b glass-border-subtle">
              <div className="glass-flex glass-items-center glass-gap-3">
                <span className="glass-text-2xl">
                  {componentDefinition?.icon || "📦"}
                </span>
                <div className="glass-flex-1 min-glass-w-0">
                  <div className="glass-text-sm font-medium glass-text-secondary truncate">
                    {componentDefinition?.name || selectedComponent.type}
                  </div>
                  <div className="glass-text-xs glass-text-secondary">
                    ID: {selectedComponent.id.split("_").pop()}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="glass-p-4 glass-border-b glass-border-subtle">
              <div className="glass-grid glass-grid-cols-2 glass-gap-2">
                <ActionButton
                  onClick={() => duplicateComponent(selectedComponent.id)}
                  icon="📋"
                  label="Duplicate"
                />
                <ActionButton
                  onClick={() => copyComponent(selectedComponent.id)}
                  icon="📄"
                  label="Copy"
                />
                <ActionButton
                  onClick={() => pasteComponent(selectedComponent.id)}
                  icon="📁"
                  label="Paste"
                />
                <ActionButton
                  onClick={() => deleteComponent(selectedComponent.id)}
                  icon="🗑️"
                  label="Delete"
                  variant="danger"
                />
              </div>
            </div>

            {/* Section Tabs */}
            <div className="glass-flex glass-border-b glass-border-subtle">
              {[
                { key: "properties", label: "Properties", icon: "⚙️" },
                { key: "styles", label: "Styles", icon: "🎨" },
                { key: "advanced", label: "Advanced", icon: "🔧" },
              ].map((section: any) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key as any)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium transition-colors glass-focus glass-touch-target",
                    activeSection === section.key
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <span className="glass-text-xs">{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </div>

            {/* Properties Content */}
            <div className="glass-flex-1 overflow-y-auto glass-p-4">
              {componentDefinition?.editableProps ? (
                <div className="space-y-4">
                  {Object.entries(componentDefinition.editableProps)
                    .filter(([key, config]) => {
                      // Filter properties based on active section
                      if (activeSection === "styles") {
                        return [
                          "color",
                          "backgroundColor",
                          "fontSize",
                          "fontWeight",
                          "textAlign",
                          "padding",
                          "margin",
                          "borderRadius",
                          "border",
                          "boxShadow",
                        ].includes(key);
                      } else if (activeSection === "advanced") {
                        return ["onClick", "href", "className", "id"].includes(
                          key
                        );
                      } else {
                        // Properties section - show main functional properties
                        return ![
                          "color",
                          "backgroundColor",
                          "fontSize",
                          "fontWeight",
                          "textAlign",
                          "padding",
                          "margin",
                          "borderRadius",
                          "border",
                          "boxShadow",
                          "onClick",
                          "href",
                          "className",
                          "id",
                        ].includes(key);
                      }
                    })
                    .map(([key, config]) => (
                      <PropertyInput
                        key={key}
                        label={config.label}
                        type={config.type}
                        value={selectedComponent.props[key]}
                        options={config.options}
                        min={config.min}
                        max={config.max}
                        step={config.step}
                        onChange={(value) => handlePropertyChange(key, value)}
                      />
                    ))}

                  {Object.entries(componentDefinition.editableProps).filter(
                    ([key]) => {
                      if (activeSection === "styles") {
                        return [
                          "color",
                          "backgroundColor",
                          "fontSize",
                          "fontWeight",
                          "textAlign",
                          "padding",
                          "margin",
                          "borderRadius",
                          "border",
                          "boxShadow",
                        ].includes(key);
                      } else if (activeSection === "advanced") {
                        return ["onClick", "href", "className", "id"].includes(
                          key
                        );
                      } else {
                        return ![
                          "color",
                          "backgroundColor",
                          "fontSize",
                          "fontWeight",
                          "textAlign",
                          "padding",
                          "margin",
                          "borderRadius",
                          "border",
                          "boxShadow",
                          "onClick",
                          "href",
                          "className",
                          "id",
                        ].includes(key);
                      }
                    }
                  ).length === 0 && (
                    <div className="text-center glass-py-8 glass-text-secondary">
                      <div className="glass-text-2xl mb-2">
                        {activeSection === "styles"
                          ? "🎨"
                          : activeSection === "advanced"
                            ? "🔧"
                            : "⚙️"}
                      </div>
                      <p className="glass-text-sm">
                        No {activeSection} available for this component
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center glass-py-8 glass-text-secondary">
                  <div className="glass-text-2xl mb-2">⚠️</div>
                  <p className="glass-text-sm">No editable properties found</p>
                </div>
              )}
            </div>

            {/* Component Stats */}
            <div className="glass-p-4 glass-surface-subtle glass-border-t glass-border-subtle">
              <div className="glass-text-xs glass-text-secondary space-y-1">
                <div className="glass-flex glass-justify-between">
                  <span>Children:</span>
                  <span>{selectedComponent.children.length}</span>
                </div>
                <div className="glass-flex glass-justify-between">
                  <span>Parent:</span>
                  <span>{selectedComponent.parent ? "Yes" : "Root"}</span>
                </div>
                {selectedComponent.locked && (
                  <div className="glass-flex glass-items-center glass-gap-1 text-primary">
                    <span>🔒</span>
                    <span>Locked</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Glass>
    </div>
  );
};
