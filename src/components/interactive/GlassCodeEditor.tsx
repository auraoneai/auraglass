"use client";
import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { OptimizedGlass } from "../../primitives";
import { createGlassStyle } from "../../core/mixins/glassMixins";

export type Language =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "cpp"
  | "csharp"
  | "go"
  | "rust"
  | "php"
  | "ruby"
  | "swift"
  | "kotlin"
  | "scala"
  | "html"
  | "css"
  | "json"
  | "xml"
  | "yaml"
  | "sql"
  | "bash"
  | "powershell"
  | "dockerfile"
  | "markdown"
  | "plaintext";

export interface GlassCodeEditorProps {
  /** Code content */
  value?: string;
  /** Language for syntax highlighting */
  language?: Language;
  /** Whether the editor is read-only */
  readOnly?: boolean;
  /** Placeholder text when empty */
  placeholder?: string;
  /** Font size */
  fontSize?: number;
  /** Number of lines to show */
  lineNumbers?: boolean;
  /** Whether to show minimap */
  minimap?: boolean;
  /** Whether to enable word wrap */
  wordWrap?: boolean;
  /** Tab size */
  tabSize?: number;
  /** Whether to enable auto-completion */
  autoComplete?: boolean;
  /** Theme for syntax highlighting */
  theme?: "light" | "dark" | "auto";
  /** Maximum height */
  maxHeight?: string;
  /** Minimum height */
  minHeight?: string;
  /** Compact mode for constrained cards, drawers, and documentation previews. */
  compact?: boolean;
  /** Hide toolbar controls/language metadata in compact mode. */
  showToolbar?: boolean;
  /** Custom className */
  className?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Focus handler */
  onFocus?: () => void;
  /** Blur handler */
  onBlur?: () => void;
  /** Mount handler */
  onMount?: (editor: HTMLTextAreaElement) => void;
}

// Simple syntax highlighting patterns for common languages
const syntaxPatterns = {
  javascript: {
    keywords:
      /\b(const|let|var|function|return|if|else|for|while|do|switch|case|default|try|catch|finally|throw|new|class|extends|super|import|export|from|async|await|yield|typeof|instanceof|in|of)\b/g,
    strings: /(["'`])(.*?)\1/g,
    comments: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
    numbers: /\b\d+(\.\d+)?\b/g,
    functions: /\b\w+(?=\()/g,
  },
  typescript: {
    keywords:
      /\b(const|let|var|function|return|if|else|for|while|do|switch|case|default|try|catch|finally|throw|new|class|extends|super|import|export|from|async|await|yield|typeof|instanceof|in|of|interface|type|enum|namespace|module)\b/g,
    strings: /(["'`])(.*?)\1/g,
    comments: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
    numbers: /\b\d+(\.\d+)?\b/g,
    types: /\b[A-Z]\w*\b/g,
  },
  python: {
    keywords:
      /\b(def|class|if|elif|else|for|while|try|except|finally|with|as|import|from|return|yield|lambda|and|or|not|in|is|None|True|False)\b/g,
    strings: /(["'`])(.*?)\1/g,
    comments: /(#.*$)/gm,
    numbers: /\b\d+(\.\d+)?\b/g,
    functions: /\b\w+(?=\()/g,
  },
  css: {
    properties: /([a-z-]+)(?=\s*:)/g,
    values: /:(.+?);/g,
    selectors: /([.#]?[\w-]+)(?=\s*\{)/g,
    comments: /(\/\*[\s\S]*?\*\/)/g,
  },
  json: {
    keys: /"([^"]+)":/g,
    strings: /"([^"]+)"/g,
    numbers: /\b\d+(\.\d+)?\b/g,
  },
};

const escapeHtml = (code: string) =>
  code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const GlassCodeEditor: React.FC<GlassCodeEditorProps> = ({
  value,
  language = "plaintext",
  readOnly = false,
  placeholder = "Enter your code here...",
  fontSize = 14,
  lineNumbers = true,
  minimap = false,
  wordWrap = true,
  tabSize = 2,
  autoComplete = false,
  theme = "dark",
  maxHeight = "320px",
  minHeight = "180px",
  compact = false,
  showToolbar = true,
  className = "",
  onChange,
  onFocus,
  onBlur,
  onMount,
}) => {
  const defaultValue =
    value === undefined && !onChange
      ? "import { GlassCard } from 'aura-glass';\n\nexport function Preview() {\n  return <GlassCard intensity=\"medium\">Live surface</GlassCard>;\n}"
      : "";
  const [internalValue, setInternalValue] = useState(value ?? defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const currentValue = value !== undefined ? value : internalValue;
  const effectiveFontSize = compact ? Math.min(fontSize, 11) : fontSize;
  const effectiveLineNumbers = compact ? false : lineNumbers;
  const effectiveMaxHeight = compact ? "220px" : maxHeight;
  const effectiveMinHeight = compact ? "120px" : minHeight;
  const lineHeight = `${Math.round(effectiveFontSize * 1.55)}px`;

  // Handle value changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      onChange?.(newValue);
    },
    [onChange]
  );

  // Handle focus/blur
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  // Syntax highlighting function
  const highlightCode = useCallback((code: string, lang: Language) => {
    const escapedCode = escapeHtml(code);
    if (lang === "plaintext") return escapedCode;

    const patterns = syntaxPatterns[lang as keyof typeof syntaxPatterns];
    if (!patterns) return escapedCode;

    // The editor previously performed regex replacement directly into HTML.
    // That caused later patterns to match inside generated class names and render
    // fragments like "400" as code. Keep the preview readable until a tokenized
    // highlighter is introduced.
    return escapedCode;
  }, []);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Tab" && !readOnly) {
        e.preventDefault();
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const spaces = " ".repeat(tabSize);

        const newValue =
          currentValue.substring(0, start) +
          spaces +
          currentValue.substring(end);
        setInternalValue(newValue);
        onChange?.(newValue);

        // Set cursor position after the inserted spaces
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + tabSize;
        }, 0);
      }
    },
    [currentValue, tabSize, readOnly, onChange]
  );

  // Update cursor position
  const updateCursorPosition = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const text = textarea.value;
    const cursorPos = textarea.selectionStart;

    let line = 1;
    let column = 1;

    for (let i = 0; i < cursorPos; i++) {
      if (text[i] === "\n") {
        line++;
        column = 1;
      } else {
        column++;
      }
    }

    setCursorPosition({ line, column });
  }, []);

  // Sync scroll positions
  useEffect(() => {
    const textarea = textareaRef.current;
    const pre = preRef.current;

    if (!textarea || !pre) return;

    const syncScroll = () => {
      pre.scrollTop = textarea.scrollTop;
      pre.scrollLeft = textarea.scrollLeft;
    };

    textarea.addEventListener("scroll", syncScroll);
    return () => textarea.removeEventListener("scroll", syncScroll);
  }, []);

  // Handle mount
  useEffect(() => {
    if (textareaRef.current && onMount) {
      onMount(textareaRef.current);
    }
  }, [onMount]);

  const highlightedCode = highlightCode(currentValue, language);
  const lines = currentValue.split("\n");

  return (
    <OptimizedGlass
      data-glass-component
      className={cn(
        "glass-code-editor glass-relative glass-overflow-hidden glass-max-w-full glass-surface-dark/30 glass-border glass-border-white/10",
        className
      )}
      style={{
        ...createGlassStyle({ intent: "neutral", elevation: "level2" }),
        maxHeight: effectiveMaxHeight,
        minHeight: effectiveMinHeight,
        minWidth: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      blur="medium"
      elevation={"level1"}
    >
      {/* Toolbar */}
      {showToolbar && !compact && (
        <div
          className={cn(
            "glass-flex glass-items-center glass-justify-between glass-px-3 glass-py-2 glass-border-b glass-border-white/10 glass-surface-dark/30"
          )}
        >
          <div className={cn("glass-flex glass-items-center glass-gap-4")}>
            <span
              className={cn(
                "glass-text-sm glass-text-primary-opacity-70 glass-font-medium"
              )}
            >
              {language.toUpperCase()}
            </span>
            {effectiveLineNumbers && (
              <span
                className={cn("glass-text-xs glass-text-primary-opacity-50")}
              >
                Ln {cursorPosition.line}, Col {cursorPosition.column}
              </span>
            )}
          </div>

          <div className={cn("glass-flex glass-items-center glass-gap-2")}>
            {!readOnly && (
              <>
                <button
                  className={cn(
                    "glass-px-2 glass-py-1 glass-text-xs glass-text-primary-opacity-70 hover:glass-text-primary hover:glass-surface-subtle glass-radius-md glass-transition-colors"
                  )}
                  onClick={(e) => {
                    const textarea = textareaRef.current;
                    if (textarea) {
                      textarea.value = "";
                      setInternalValue("");
                      onChange?.("");
                    }
                  }}
                >
                  Clear
                </button>
                <button
                  className={cn(
                    "glass-px-2 glass-py-1 glass-text-xs glass-text-primary-opacity-70 hover:glass-text-primary hover:glass-surface-subtle glass-radius-md glass-transition-colors"
                  )}
                  onClick={(e) => {
                    navigator.clipboard?.writeText(currentValue);
                  }}
                >
                  Copy
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Editor Container */}
      <div
        className={cn("glass-relative glass-min-h-0 glass-overflow-hidden")}
        style={{
          ...createGlassStyle({ intent: "neutral", elevation: "level1" }),
          minHeight: 0,
          height: "auto",
          flex: "1 1 auto",
        }}
      >
        {/* Syntax Highlighted Background */}
        <pre
          ref={preRef}
          className={cn(
            "glass-absolute glass-inset-0 glass-p-3 glass-font-mono glass-text-sm glass-overflow-auto glass-pointer-events-none glass-whitespace-pre-wrap glass-break-words",
            effectiveLineNumbers ? "glass-pl-16" : "",
            wordWrap ? "glass-break-words" : "glass-whitespace-pre"
          )}
          style={{ fontSize: effectiveFontSize, lineHeight, tabSize }}
        >
          <code
            dangerouslySetInnerHTML={{ __html: highlightedCode || placeholder }}
            className={cn(currentValue ? "" : "glass-text-primary-30")}
          />
        </pre>

        {/* Line Numbers */}
        {effectiveLineNumbers && (
          <div
            className={cn(
              "glass-absolute glass-left-0 glass-top-0 glass-bottom-0 glass-w-12 glass-surface-dark/40 glass-border-r glass-border-white/10 glass-p-3 glass-text-right glass-text-secondary glass-text-sm glass-font-mono glass-select-none"
            )}
            style={{ fontSize: effectiveFontSize, lineHeight }}
          >
            {lines.map((_, index) => (
              <div key={index}>{index + 1}</div>
            ))}
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={currentValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onSelect={updateCursorPosition}
          onClick={updateCursorPosition}
          readOnly={readOnly}
          placeholder={placeholder}
          className={cn(
            "glass-w-full glass-p-3 glass-font-mono glass-text-sm glass-bg-transparent glass-caret-white glass-outline-none glass-resize-none glass-overflow-auto",
            wordWrap ? "glass-break-words" : "glass-whitespace-pre",
            effectiveLineNumbers ? "glass-pl-16" : ""
          )}
          style={{
            color: "transparent",
            WebkitTextFillColor: "transparent",
            fontSize: effectiveFontSize,
            lineHeight,
            tabSize,
            minHeight: "100%",
            height: "100%",
          }}
          spellCheck={false}
          autoComplete={autoComplete ? "on" : "off"}
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
    </OptimizedGlass>
  );
};

// Compound component for code editor with file management
export const GlassCodeEditorWithFiles: React.FC<{
  files: { name: string; content: string; language: Language }[];
  onFileChange?: (filename: string, content: string) => void;
  className?: string;
}> = ({ files, onFileChange, className = "" }) => {
  const [activeFile, setActiveFile] = useState(files[0]?.name || "");

  const currentFile = files.find((f) => f.name === activeFile) || files[0];

  return (
    <div className={cn("glass-grid glass-grid-cols-4 glass-gap-4", className)}>
      {/* File Explorer */}
      <OptimizedGlass
        className={cn("glass-col-span-1 glass-p-4")}
        blur="medium"
        elevation={"level1"}
      >
        <h3
          className={cn(
            "glass-text-sm glass-font-semibold glass-text-primary glass-mb-4"
          )}
        >
          Files
        </h3>
        <div className={cn("glass-gap-2")}>
          {files.map((file: any) => (
            <button
              key={file.name}
              onClick={(e) => setActiveFile(file.name)}
              className={cn(
                "glass-w-full glass-text-left glass-px-3 glass-py-2 glass-radius-md glass-text-sm glass-transition-colors",
                activeFile === file.name
                  ? "glass-surface-elevated glass-text-primary"
                  : "glass-text-primary-70 glass-hover-text-primary glass-hover-surface-subtle"
              )}
            >
              {file.name}
            </button>
          ))}
        </div>
      </OptimizedGlass>

      {/* Code Editor */}
      <div className={cn("glass-col-span-3")}>
        {currentFile && (
          <GlassCodeEditor
            value={currentFile.content}
            language={currentFile.language}
            onChange={(content) => onFileChange?.(currentFile.name, content)}
          />
        )}
      </div>
    </div>
  );
};
