import { cn } from "../../lib/utilsComprehensive";
import React, {
  forwardRef,
  useRef,
  useCallback,
  useState,
  useEffect,
} from "react";
import { OptimizedGlass } from "../../primitives";

export interface GlassRichTextEditorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * Editor content (HTML)
   */
  value?: string;
  /**
   * Callback when content changes
   */
  onChange?: (html: string) => void;
  /**
   * Placeholder text
   * @default 'Start typing...'
   */
  placeholder?: string;
  /**
   * Whether the editor is read-only
   * @default false
   */
  readOnly?: boolean;
  /**
   * Whether the editor is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Show toolbar
   * @default true
   */
  showToolbar?: boolean;
  /**
   * Toolbar tools to show
   */
  tools?: (
    | "bold"
    | "italic"
    | "underline"
    | "strike"
    | "heading"
    | "quote"
    | "list"
    | "orderedList"
    | "link"
    | "code"
    | "clear"
  )[];
  /**
   * Minimum height of editor
   * @default '200px'
   */
  minHeight?: string;
  /**
   * Maximum height of editor (auto-scrolls after)
   * @default '400px'
   */
  maxHeight?: string;
  /**
   * Glassmorphism elevation level
   * @default 'level2'
   */
  elevation?: "level1" | "level2" | "level3" | "level4" | "level5";
}

const defaultTools: GlassRichTextEditorProps["tools"] = [
  "bold",
  "italic",
  "underline",
  "heading",
  "quote",
  "list",
  "orderedList",
  "link",
  "code",
  "clear",
];

interface ToolConfig {
  icon: React.ReactNode;
  label: string;
  command: string;
  value?: string;
}

const toolConfigs: Record<string, ToolConfig> = {
  bold: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
        <path
          d="M6 12h8a4 4 0 1 0 0-8H6v8Zm0 0h9a4 4 0 1 1 0 8H6v-8Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: "Bold",
    command: "bold",
  },
  italic: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
        <path
          d="M19 4h-9M14 20H5M15 4 9 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: "Italic",
    command: "italic",
  },
  underline: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
        <path
          d="M6 4v7a6 6 0 0 0 12 0V4M4 21h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: "Underline",
    command: "underline",
  },
  strike: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
        <path
          d="M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H6m-2-8h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: "Strikethrough",
    command: "strikeThrough",
  },
  heading: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
        <path
          d="M6 12h12M6 4v16M18 4v16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: "Heading",
    command: "formatBlock",
    value: "h2",
  },
  quote: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
        <path
          d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: "Quote",
    command: "formatBlock",
    value: "blockquote",
  },
  list: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
        <path
          d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: "Bullet List",
    command: "insertUnorderedList",
  },
  orderedList: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
        <path
          d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: "Numbered List",
    command: "insertOrderedList",
  },
  link: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
        <path
          d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: "Link",
    command: "createLink",
  },
  code: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
        <path
          d="m16 18 6-6-6-6M8 6l-6 6 6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: "Code",
    command: "formatBlock",
    value: "pre",
  },
  clear: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
        <path
          d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: "Clear Formatting",
    command: "removeFormat",
  },
};

export const GlassRichTextEditor = forwardRef<
  HTMLDivElement,
  GlassRichTextEditorProps
>(
  (
    {
      value = "",
      onChange,
      placeholder = "Start typing...",
      readOnly = false,
      disabled = false,
      showToolbar = true,
      tools = defaultTools,
      minHeight = "200px",
      maxHeight = "400px",
      elevation = "level2",
      className,
      ...props
    },
    ref
  ) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
      if (editorRef.current && value !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = value;
      }
    }, [value]);

    const handleInput = useCallback(() => {
      if (editorRef.current) {
        onChange?.(editorRef.current.innerHTML);
      }
    }, [onChange]);

    const executeCommand = useCallback(
      (command: string, value?: string) => {
        if (readOnly || disabled) return;

        if (command === "createLink") {
          const url = prompt("Enter URL:");
          if (url) {
            document.execCommand(command, false, url);
          }
        } else if (value) {
          document.execCommand(command, false, value);
        } else {
          document.execCommand(command, false);
        }

        editorRef.current?.focus();
        handleInput();
      },
      [readOnly, disabled, handleInput]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && !e.shiftKey) {
          switch (e.key) {
            case "b":
              e.preventDefault();
              executeCommand("bold");
              break;
            case "i":
              e.preventDefault();
              executeCommand("italic");
              break;
            case "u":
              e.preventDefault();
              executeCommand("underline");
              break;
          }
        }
      },
      [executeCommand]
    );

    return (
      <OptimizedGlass
        data-glass-component
        ref={ref}
        elevation={elevation}
        className={cn("overflow-hidden glass-radius-lg", className)}
        {...props}
      >
        {showToolbar && !readOnly && (
          <div className="glass-flex glass-flex-wrap glass-items-center glass-gap-1 glass-p-2 glass-border-b glass-border-subtle">
            {tools.map((tool) => {
              const config = toolConfigs[tool];
              if (!config) return null;

              return (
                <button
                  key={tool}
                  type="button"
                  onClick={() => executeCommand(config.command, config.value)}
                  disabled={disabled}
                  className={cn(
                    "glass-p-2 glass-radius-md",
                    "transition-all duration-200",
                    "hover:bg-white/10 active:bg-white/20",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "glass-text-primary",
                    "glass-focus glass-touch-target glass-contrast-guard"
                  )}
                  title={config.label}
                  aria-label={config.label}
                >
                  {config.icon}
                </button>
              );
            })}
          </div>
        )}

        <div className="relative">
          <div
            ref={editorRef}
            contentEditable={!readOnly && !disabled}
            onInput={handleInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            className={cn(
              "glass-p-4 outline-none overflow-y-auto",
              "glass-text-primary prose prose-sm max-w-none",
              "focus:ring-2 focus:ring-blue-500/50",
              disabled && "opacity-50 cursor-not-allowed bg-white/5",
              readOnly && "cursor-default"
            )}
            style={{
              minHeight,
              maxHeight,
            }}
            role="textbox"
            aria-multiline="true"
            aria-label="Rich text editor"
            aria-readonly={readOnly}
            aria-disabled={disabled}
          />
          {!value && !isFocused && (
            <div
              className="absolute top-0 left-0 glass-p-4 glass-text-secondary pointer-events-none select-none"
              aria-hidden="true"
            >
              {placeholder}
            </div>
          )}
        </div>
      </OptimizedGlass>
    );
  }
);

GlassRichTextEditor.displayName = "GlassRichTextEditor";

export default GlassRichTextEditor;
